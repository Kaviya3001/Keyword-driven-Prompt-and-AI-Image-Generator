from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS  # Import the CORS module

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow requests from any origin


@app.route('/generate_image_prompt', methods=['POST'])
def generate_image_prompt():
    data = request.json
    keyword = data.get('keyword')

    if not keyword:
        return jsonify({'error': 'Keyword is required'}), 400

    text_generator = pipeline("text-generation", model="gpt2")
    prompt = f"Create a detailed image of a {keyword}"
    generated_text = text_generator(prompt, max_length=100, num_return_sequences=1)[0]

    result = generated_text['generated_text'].replace("\n", " ").strip()

    response = jsonify({'image_prompt': result})
    response.headers.add('Access-Control-Allow-Origin', '*')  # Allow requests from any origin
    return response

if __name__ == '__main__':
 app.run(debug=True)