from typing import List, Dict, Any, AsyncGenerator
from openai import AsyncOpenAI
from app.core.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def get_embedding(text: str) -> List[float]:
    response = await client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

async def get_chat_completion(messages: List[Dict[str, Any]], model: str = "gpt-4o-mini") -> str:
    response = await client.chat.completions.create(
        model=model,
        messages=messages
    )
    return response.choices[0].message.content

async def get_chat_completion_stream(messages: List[Dict[str, Any]], model: str = "gpt-4o-mini") -> AsyncGenerator[str, None]:
    stream = await client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True
    )
    async for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content
