from groq import Groq
import base64
import os

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def process_image_with_groq(image_bytes: bytes) -> str:
    base64_image = base64.b64encode(image_bytes).decode('utf-8')

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image? Extract the text. do not include any other text and explanation"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    },
                ],
            }
        ],
        # Note: Ensure this model supports vision processing on Groq
        model="meta-llama/llama-4-scout-17b-16e-instruct", 
    )

    return chat_completion.choices[0].message.content 