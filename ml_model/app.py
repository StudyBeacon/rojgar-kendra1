from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os
import fitz  # PyMuPDF
import spacy
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)

# Load spaCy model for entity extraction
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # If model not found, create a simple fallback
    print("Warning: spaCy model not found. Using fallback text processing.")
    nlp = None

# Load the fraud detection model from the parent directory
model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'job_fraud_detector.pkl')
fraud_model = joblib.load(model_path)

def extract_text_from_pdf(pdf_url):
    """Extract text from PDF URL (placeholder - in production, download from Cloudinary)"""
    # This is a placeholder. In production, you'd download the PDF from Cloudinary
    # For now, we'll assume the text is passed directly
    return pdf_url  # Assuming pdf_url contains the text for now

def extract_skills_from_text(text):
    """Extract skills from resume text using spaCy"""
    if nlp:
        doc = nlp(text.lower())
    else:
        doc = None
    
    # Common programming languages and technologies
    tech_skills = [
        'python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
        'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
        'mongodb', 'mysql', 'postgresql', 'redis', 'aws', 'azure', 'docker',
        'kubernetes', 'git', 'html', 'css', 'sass', 'typescript', 'jquery',
        'bootstrap', 'tailwind', 'material-ui', 'redux', 'graphql', 'rest api',
        'machine learning', 'ai', 'data science', 'pandas', 'numpy', 'scikit-learn',
        'tensorflow', 'pytorch', 'opencv', 'nltk', 'spacy'
    ]
    
    # Extract skills from text
    found_skills = []
    text_lower = text.lower()
    
    for skill in tech_skills:
        if skill in text_lower:
            found_skills.append(skill.title())
    
    # Also extract entities that might be skills (only if spaCy is available)
    if doc:
        for ent in doc.ents:
            if ent.label_ in ['ORG', 'PRODUCT']:
                found_skills.append(ent.text)
    
    return list(set(found_skills))  # Remove duplicates

def extract_experience_from_text(text):
    """Extract experience information from resume text"""
    # Look for patterns like "X years", "X+ years", etc.
    experience_patterns = [
        r'(\d+)\+?\s*years?\s*of?\s*experience',
        r'experience:\s*(\d+)\+?\s*years?',
        r'(\d+)\+?\s*years?\s*in',
        r'(\d+)\+?\s*years?\s*working',
        r'(\d+)\s*years?\s*experience',
        r'(\d+)\s*years?\s*in\s*\w+',
        r'(\d+)\s*years?\s*of\s*\w+',
        r'experience\s*(\d+)\s*years?',
        r'(\d+)\s*years?\s*background',
        r'(\d+)\s*years?\s*professional'
    ]
    
    for pattern in experience_patterns:
        match = re.search(pattern, text.lower())
        if match:
            years = match.group(1)
            return f"{years} years"
    
    return "Experience not specified"

def calculate_match_score(resume_text, job_description, required_skills):
    """Calculate match score using TF-IDF and cosine similarity"""
    # Combine resume text and job description for vectorization
    documents = [resume_text.lower(), job_description.lower()]
    
    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    # Calculate cosine similarity
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    
    # Convert to percentage
    base_score = similarity * 100
    
    # Bonus for skill matches
    resume_skills = extract_skills_from_text(resume_text)
    skill_matches = sum(1 for skill in required_skills if skill.lower() in [s.lower() for s in resume_skills])
    skill_bonus = min(skill_matches * 10, 30)  # Max 30 points for skills
    
    final_score = min(base_score + skill_bonus, 100)
    
    return round(final_score, 2)

@app.route('/predict', methods=['POST'])
def predict_fraud():
    """Original fraud detection endpoint"""
    try:
        data = request.json
        text = data.get('title', '') + ' ' + data.get('description', '')
        prediction = fraud_model.predict([text])[0]
        proba = fraud_model.predict_proba([text])[0][1]  # Probability of being fake
        return jsonify({'fraudulent': int(prediction), 'probability': float(proba)})
    except Exception as e:
        # Fallback response if model fails
        print(f"Model prediction error: {e}")
        return jsonify({'fraudulent': 0, 'probability': 0.1, 'error': 'Model temporarily unavailable'})

@app.route('/score', methods=['POST'])
def score_resume():
    """New endpoint for resume-job matching"""
    try:
        data = request.json
        
        resume_text = data.get('resume_text', '')
        job_description = data.get('job_description', {})
        
        if not resume_text:
            return jsonify({'error': 'resume_text is required'}), 400
        
        # Extract job information
        job_skills = job_description.get('skills', [])
        job_exp = job_description.get('experience', '')
        job_desc = job_description.get('description', '')
        
        # Extract information from resume
        extracted_skills = extract_skills_from_text(resume_text)
        extracted_experience = extract_experience_from_text(resume_text)
        
        # Calculate match score
        match_score = calculate_match_score(resume_text, job_desc, job_skills)
        
        # Determine if it's a match (threshold: 60%)
        is_match = match_score >= 60
        
        return jsonify({
            'match_score': float(match_score),
            'is_match': bool(is_match),
            'extracted_skills': extracted_skills,
            'extracted_experience': extracted_experience
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/parse-pdf', methods=['POST'])
def parse_pdf():
    """Parse PDF and extract text"""
    try:
        data = request.json
        pdf_text = data.get('pdf_text', '')
        
        if not pdf_text:
            return jsonify({'error': 'pdf_text is required'}), 400
        
        # Extract skills and experience
        extracted_skills = extract_skills_from_text(pdf_text)
        extracted_experience = extract_experience_from_text(pdf_text)
        
        return jsonify({
            'parsed_text': pdf_text,
            'extracted_skills': extracted_skills,
            'extracted_experience': extracted_experience
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
