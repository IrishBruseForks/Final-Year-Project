import json
import random
import requests
import sseclient

url = "https://api.openai.com/v1/chat/completions"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ",
}

name = "Ethan"

prompt = f"""Generate 3 replies to this conversattion  and reply as if you were {name}.



Sure here are the 3 replies to Ryan:
1."""

seed = random.randrange(500)

system = f"""You are an AI assistant that provides civil suggestions for replies to text messages between real humans.
Do not reply with code, emojis, quotes, colons, or other special characters.
Input is the conversation with their names for reference.
Reply as if you were {name}.
Do not reply with anything other than the 3 choices."""

chat = """
Ethan: Hey Ryan, what's up?
Ryan: Not much, just grabbing a coffee. You?
Ethan: Same here, actually. Long week?
Ryan: You could say that. Been swamped with deadlines. How about you?
"""

data = {
    "messages": [
        {"role": "system", "content": system},
        {"role": "user", "content": chat},
    ],
    "model": "gpt-3.5-turbo",
    "max_tokens": 50,
    "temperature": 1,
    "top_p": 0.9,
    "seed": 10,
    "stream": False,
}

stream_response = requests.post(url, headers=headers, json=data)

print(stream_response.text)
