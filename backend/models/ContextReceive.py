from pydantic import BaseModel

class Context(BaseModel):
    title: str
    details: str
    
class ContextReceive(BaseModel):
    context: list[Context]
    userPrompt: str