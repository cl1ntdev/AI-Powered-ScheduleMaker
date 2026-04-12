from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI


from api.context import router as context_router
from api.ocr import router as ocr_router

app = FastAPI()

app.include_router(context_router)
app.include_router(ocr_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def __main__():
    print("Starting server...") # port 8011
    
    
    
# python -m venv venv
# # On Windows (which you are using):
# .\venv\Scripts\activate