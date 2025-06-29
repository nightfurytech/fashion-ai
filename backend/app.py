from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import openai, base64, json, os, re
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:4000"}}, supports_credentials=True)

UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def clean_text(text):
    # Remove 'json', '\n', and triple backticks
    cleaned = re.sub(r'(json|\\n|```)', '', text)
    # Trim leading and trailing whitespaces
    cleaned = cleaned.strip()
    return cleaned

@app.route("/analyze-outfit/", methods=["POST"])
def analyze_outfit():
    image = request.files['image']
    event_type = request.form['event_type']

    filename = secure_filename(image.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    image.save(filepath)

    image.stream.seek(0)
    image_bytes = image.read()
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    prompt = f"""
    You are a fashion stylist AI. A user has uploaded this image and said they are going to a {event_type}.
    Analyze whether the outfit is appropriate for the event. Evaluate the color combination and suggest any improvements.

    Respond in the following JSON format:
    {{
      "suitability": "...",
      "color_rating": "...",
      "suggestions": "..."
    }}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        { "type": "text", "text": prompt },
                        { "type": "image_url", "image_url": { "url": f"data:image/jpeg;base64,{image_base64}" } }
                    ]
                }
            ]
        )
        message = response.choices[0].message.content
        json_response = json.loads(clean_text(message))

        return jsonify({
            "event": event_type,
            "feedback": json_response
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ping/", methods=["GET"])
def serve_ui():
    return jsonify({"hello": "world"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
