from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from utils.evaluator import evaluate_answer

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({"message": "UnlockED AI Module API is running"})

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    data = request.get_json()
    
    if not data or 'question' not in data or 'answer' not in data:
        return jsonify({"error": "Missing required fields: question and answer"}), 400
    
    question = data['question']
    answer = data['answer']
    
    # Evaluate the answer
    result = evaluate_answer(question, answer)
    
    return jsonify(result)

@app.route('/api/questions', methods=['GET'])
def get_questions():
    # Load questions from the database or file
    try:
        with open(os.path.join(os.path.dirname(__file__), 'data', 'questions.json'), 'r') as f:
            questions = json.load(f)
        return jsonify({"success": True, "data": questions})
    except FileNotFoundError:
        return jsonify({"success": False, "error": "Questions file not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    os.makedirs(os.path.join(os.path.dirname(__file__), 'data'), exist_ok=True)
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5001)), debug=True)