import { Context } from "../models/Context";


const url = "http://127.0.0.1:8011/";


export async function SendContext(context: Context[],userPrompt) {
  console.log("context", context, "userPrompt")
  const payload = {
    context,
    userPrompt,
  }
  const response = await fetch(url + "context", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  console.log("the resp from backend",response)
  return response.json()
}
