from fastapi import APIRouter, File, UploadFile

router = APIRouter()

@router.post("/api/ocr")
async def ocr(file: UploadFile = File(...)):
    # print the image file name
    print(f"Uploading file: {file.filename}")
    
    return {"filename": file.filename}