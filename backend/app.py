import os

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import openai

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/analyze-outfit/', methods=['POST'])
def analyze_outfit():
    image = request.files['image']
    event_type = request.form['event_type']

    image_bytes = image.read()
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    # Construct prompt for GPT-4o (or other vision-language models)
    prompt = f"""
    You are a fashion stylist AI. A user has uploaded this image and said they are going to a {event_type}.
    Analyze whether the outfit is appropriate for the event. Evaluate the color combination and suggest any improvements.

    Respond with:
    1. Suitability for the event
    2. Color combination rating
    3. Styling suggestions
    """

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
                ]
            }
        ]
    )

    ai_response = response.choices[0].message.content

    # Placeholder response
    return jsonify({
        "event": event_type,
        "feedback": ai_response
    })

if __name__ == "__main__":
    app.run(debug=True)
