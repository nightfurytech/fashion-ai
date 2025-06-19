
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)

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

    # Placeholder response
    return jsonify({
        "event": event_type,
        "feedback": {
            "suitability": "✅ Yes, it's appropriate for the event.",
            "color_rating": "🎨 Good balance of tones, slightly muted for a date night.",
            "suggestions": "Consider adding a bright accessory or changing shoes to heels for a more striking look."
        }
    })

if __name__ == "__main__":
    app.run(debug=True)
