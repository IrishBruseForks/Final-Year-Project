import json
import random
import requests
import sseclient

url = "http://127.0.0.1:5000/v1/completions"

headers = {"Content-Type": "application/json"}

name = "Ethan"

chat = """Ryan: Hello
Ethan: Hi
Ryan: How are you?
Ethan: I'm doing well
Ryan: What are you doing today?
"""


prompt = f"""### Instruction:
You are an AI assistant that provides civil suggestions for replies to text messages between real humans.
Do not reply with code, emojis, quotes, colons, or other special characters.
The Input section is the conversation with their names for reference use this as reference in your reply.
Reply as if you were {name}.
Do not reply with anything other than the 3 choices.

### Input:
{chat}
### Response:
Sure here are the 3 replies only:

1."""

seed = random.randrange(500)

print("seed: " + str(seed))
print(prompt, end="")


data = {
    "prompt": prompt,
    "max_tokens": 150,
    "temperature": 1,
    "top_p": 0.95,
    "seed": seed,
    "stream": False,
}

stream_response = requests.post(url, headers=headers, json=data)

print(json.loads(stream_response.text)["choices"][0]["text"])

print(data)
