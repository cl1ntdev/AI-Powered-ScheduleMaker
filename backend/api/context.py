import inspect
from typing import Any, List

from fastapi import APIRouter, FastAPI
from models.ContextReceive import ContextReceive
from typing import List
from services.ai import ai_service

router = APIRouter()



@router.post("/context")
async def create_context(payload: ContextReceive):
    context = payload.context
    userPrompt = payload.userPrompt
    print("hello from server")
    try:
        if context is None or not context:
            return {"error": "No context provided"}
        response = ai_service(context,userPrompt)
        return response
    except Exception as e:
        return {"error in context": str(e)}

                        
                    
