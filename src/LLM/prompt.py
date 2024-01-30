import json
import random
import requests
import sseclient

url = "http://127.0.0.1:5000/v1/completions"

headers = {"Content-Type": "application/json"}

name = "Ethan"

instruction = f"""
You are an AI assistant that provides civil suggestions for replies to text messages between real humans.
Do not reply with code, emojis, quotes, colons, or other special characters.
Input is the conversation with their names for reference.
Reply as if you were {name}.
Do not reply with anything other than the 3 choices.
"""

chat = """
Conor: Did you hear about the crash?
Ethan: No what happened? Just got off work so I didn't have my phone.
Ryan: Same here. Lads in College said something about an accident alright.
Conor: Not good. Is there much traffic cause of it?
"""

responseSeed = "Sure here are the 3 replies:\n\n1."

prompt = (
    f"### Instruction:{instruction}\n### Input:{chat}\n### Response:\n{responseSeed}"
)


print(prompt, end="")

data = {
    "prompt": prompt,
    "max_tokens": 150,
    "temperature": 1,
    "top_p": 0.9,
    "seed": random.randrange(500),
    "stream": True,
}

stream_response = requests.post(
    url, headers=headers, json=data, verify=False, stream=True
)
client = sseclient.SSEClient(stream_response)

# print(data)

for event in client.events():
    payload = json.loads(event.data)
    chunk = payload["choices"][0]["text"]
    print(chunk, end="")
