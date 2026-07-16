import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.api import deps
from app import models
from app.schemas.chat import ChatRequest
from openai import AsyncOpenAI

router = APIRouter()

client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))

@router.post("/")
async def chat_endpoint(
    request: ChatRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
):
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
    
    query = request.messages[-1].content
    
    try:
        response = await client.embeddings.create(
            input=query,
            model="text-embedding-ada-002"
        )
        query_embedding = response.data[0].embedding
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    similar_steps = db.query(models.GuideStep).order_by(
        models.GuideStep.embedding.cosine_distance(query_embedding)
    ).limit(5).all()
    
    context_text = "\n\n".join(
        [f"Step {step.step_number}: {step.instruction}" for step in similar_steps]
    )
    
    system_prompt = f"You are a troubleshooting assistant. Use the following guide steps to help the user:\n\n{context_text}"
    
    openai_messages = [{"role": "system", "content": system_prompt}]
    for msg in request.messages:
        openai_messages.append({"role": msg.role, "content": msg.content})
        
    async def generate():
        try:
            stream = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=openai_messages,
                stream=True,
            )
            async for chunk in stream:
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    if delta and delta.content:
                        yield delta.content
        except Exception as e:
            yield str(e)

    return StreamingResponse(generate(), media_type="text/event-stream")
