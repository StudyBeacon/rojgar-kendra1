from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)
# Load the model from the parent directory
model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'job_fraud_detector.pkl')
model = joblib.load(model_path)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get('title', '') + ' ' + data.get('description', '')
    prediction = model.predict([text])[0]
    proba = model.predict_proba([text])[0][1]  # Probability of being fake
    return jsonify({'fraudulent': int(prediction), 'probability': float(proba)})

if __name__ == '__main__':
    app.run(port=5001)
