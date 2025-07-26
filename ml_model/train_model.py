import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib

# Always load the CSV relative to this script's location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, 'dataset', 'fake_job_postings.csv')
df = pd.read_csv(csv_path)

# Combine more fields for better features
fields = ['title', 'description', 'requirements', 'job_type', 'location', 'salary']
def combine_fields(row):
    return ' '.join([str(row.get(f, '')) for f in fields if pd.notnull(row.get(f, ''))])
df['all_text'] = df.apply(combine_fields, axis=1)
X = df['all_text']
y = df['fraudulent']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build pipeline with Logistic Regression
model = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', max_features=5000)),
    ('clf', LogisticRegression(class_weight='balanced', max_iter=1000))
])

# Train
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Save model
joblib.dump(model, 'job_fraud_detector.pkl')
print("Model saved as job_fraud_detector.pkl")

