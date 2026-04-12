import { Context } from "../models/Context";
import { URL }  from "../utils/global";

const url = URL.api_url;


export async function SendContext(context: Context[],userPrompt:string) {
  console.log("context", context, "userPrompt")
  const payload = {
    context,
    userPrompt,
  }
  const response = await fetch(url + "/context", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  console.log("the resp from backend", data)
  return data
}
