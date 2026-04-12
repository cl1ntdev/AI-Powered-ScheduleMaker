from fastapi import UploadFile
from pydantic import BaseModel
# from typing import List

class FileReceive(BaseModel):
    file: UploadFile 
    
    # Or for multiple images
    # files: List[UploadFile]

    class Config:
        # This allows Pydantic to play nice with non-standard types
        arbitrary_types_allowed = True