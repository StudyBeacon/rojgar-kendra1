#!/usr/bin/env python3
"""
Test script for the ML service
Run this to verify that the resume matching functionality is working
"""

import requests
import json

# ML service URL
ML_SERVICE_URL = "http://localhost:5001"

def test_resume_matching():
    """Test the resume matching endpoint"""
    
    # Sample resume text
    resume_text = """
    John Doe
    Software Engineer
    
    SKILLS:
    - JavaScript, React, Node.js
    - Python, Django, Flask
    - MongoDB, MySQL
    - AWS, Docker
    
    EXPERIENCE:
    - 3 years of experience in web development
    - Senior Developer at TechCorp (2021-2024)
    - Full Stack Developer at StartupXYZ (2020-2021)
    
    EDUCATION:
    - Bachelor's in Computer Science
    """
    
    # Sample job description
    job_description = {
        "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
        "experience": "2 years",
        "description": "We are looking for a Full Stack Developer with experience in JavaScript, React, and Node.js. The ideal candidate should have at least 2 years of experience in web development."
    }
    
    # Test data
    test_data = {
        "resume_text": resume_text,
        "job_description": job_description
    }
    
    try:
        print("🧪 Testing resume matching...")
        response = requests.post(f"{ML_SERVICE_URL}/score", json=test_data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Resume matching test passed!")
            print(f"📊 Match Score: {result['match_score']}%")
            print(f"🎯 Is Match: {result['is_match']}")
            print(f"🔧 Extracted Skills: {result['extracted_skills']}")
            print(f"⏰ Extracted Experience: {result['extracted_experience']}")
        else:
            print(f"❌ Test failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to ML service. Make sure it's running on port 5001")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

def test_pdf_parsing():
    """Test the PDF parsing endpoint"""
    
    # Sample PDF text (in real scenario, this would be extracted from PDF)
    pdf_text = """
    Resume of Jane Smith
    
    SKILLS:
    - Python, Machine Learning
    - TensorFlow, PyTorch
    - Data Analysis, Pandas
    
    EXPERIENCE:
    - 4 years of experience in data science
    - Data Scientist at AI Company (2020-2024)
    """
    
    test_data = {
        "pdf_text": pdf_text
    }
    
    try:
        print("\n🧪 Testing PDF parsing...")
        response = requests.post(f"{ML_SERVICE_URL}/parse-pdf", json=test_data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ PDF parsing test passed!")
            print(f"🔧 Extracted Skills: {result['extracted_skills']}")
            print(f"⏰ Extracted Experience: {result['extracted_experience']}")
        else:
            print(f"❌ Test failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to ML service. Make sure it's running on port 5001")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

def test_fraud_detection():
    """Test the fraud detection endpoint (existing functionality)"""
    
    # Sample job posting
    job_data = {
        "title": "Software Engineer",
        "description": "We are looking for a talented software engineer to join our team. This is a legitimate job posting with competitive salary and benefits."
    }
    
    try:
        print("\n🧪 Testing fraud detection...")
        response = requests.post(f"{ML_SERVICE_URL}/predict", json=job_data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Fraud detection test passed!")
            print(f"🚨 Fraudulent: {result['fraudulent']}")
            print(f"📊 Probability: {result['probability']:.2f}")
        else:
            print(f"❌ Test failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to ML service. Make sure it's running on port 5001")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

if __name__ == "__main__":
    print("🚀 Starting ML Service Tests...")
    print("=" * 50)
    
    # Run all tests
    test_resume_matching()
    test_pdf_parsing()
    test_fraud_detection()
    
    print("\n" + "=" * 50)
    print("🏁 All tests completed!")
    print("\n💡 If all tests passed, your ML service is working correctly!")
    print("🌐 You can now use the full application with resume-based filtering.") 