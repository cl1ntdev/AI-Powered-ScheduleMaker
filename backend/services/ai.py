import os

from models.ContextReceive import Context
from openai import OpenAI
from sys_prompt.prompt1 import prompt1
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)


def context_convert(context: list[Context]):
    converted = [f"{c.title}: {c.details}" for c in context]
    return converted


# Main Function is this
def ai_service(context,userPrompt):
    converted_context = context_convert(context)
    user_input_string = "\n".join(converted_context)
    print("prompt",prompt1)
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b", 
        messages=[
            {"role": "system", "content": prompt1},
            {
                "role": "user",
                "content": f"Create a schedule based on these contexts:\n{user_input_string},{userPrompt}",
            },
        ],
        temperature=0.2,  # Low temperature keeps the formatting strict
        # Groq supports json_object to force valid JSON output
        response_format={"type": "json_object"},
    )
    return response.choices[0].message.content
