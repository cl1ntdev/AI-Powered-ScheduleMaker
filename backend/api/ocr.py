from fastapi import APIRouter, File, HTTPException, UploadFile
from services.ocr import process_image_with_groq

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB limit
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"]


@router.post("/api/ocr")
async def ocr(file: UploadFile = File(...)):
    print(f"Uploading file: {file.filename}")
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type ({file.content_type}). Only JPEG, PNG, and WEBP are allowed.",
        )
    try:
        image_bytes = await file.read()
        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File is too large. Maximum allowed size is 5MB.",
            )
        extracted_text = process_image_with_groq(image_bytes)

        return {
            "filename": file.filename,
            "status": "success",
            "extracted_text": extracted_text,
        }
    except HTTPException:
        # We need this to ensure our custom size/type errors are passed to the frontend correctly
        raise
    except Exception as e:
        print(f"Error processing image: {e}")
        # Return a generic 500 error for unexpected server crashes
        raise HTTPException(
            status_code=500, detail=f"An error occurred while processing the image."
        )
