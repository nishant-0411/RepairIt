import httpx
from typing import Optional, Dict, Any
from app.core.config import settings

async def reverse_geocode(latitude: float, longitude: float) -> Optional[Dict[str, Any]]:
    if not settings.MAPBOX_API_KEY:
        return None
        
    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{longitude},{latitude}.json"
    params = {
        "access_token": settings.MAPBOX_API_KEY,
        "types": "address,poi,place"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            if data.get("features"):
                return data["features"][0]
            return None
        except httpx.HTTPError:
            return None

async def geocode(address: str) -> Optional[Dict[str, Any]]:
    if not settings.MAPBOX_API_KEY:
        return None
        
    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json"
    params = {
        "access_token": settings.MAPBOX_API_KEY,
        "limit": 1
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            if data.get("features"):
                return data["features"][0]
            return None
        except httpx.HTTPError:
            return None
