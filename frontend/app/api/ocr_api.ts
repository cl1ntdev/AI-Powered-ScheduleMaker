import { URL } from "../utils/global"

export default async function ocr_api(file:File) {
  const formData = new FormData();
  // CRITICAL: The first argument 'file' must match the parameter name in FastAPI
  formData.append('file', file); 

  try {
    const result = await fetch(URL.api_url + '/api/ocr', {
      method: 'POST',
      body: formData,
    });
    
    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }
    
    const data = await result.json();
    console.log("OCR Response:", JSON.stringify(data, null, 2));
    return data; 
  } catch (error) {
    console.error("Failed to upload image:", error);
    throw error;
  }
}