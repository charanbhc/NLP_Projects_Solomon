import numpy as np
import pandas as pd
import difflib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify

# Load the data from the CSV file into a pandas DataFrame
movies_data = pd.read_csv('movies_telugu.csv')

# Select features for recommendation
selected_features = ['genres', 'Overview', 'Rating', 'No.of.Ratings']

# Replace null values with empty strings
for feature in selected_features:
    movies_data[feature] = movies_data[feature].fillna('')

# Combine selected features into a single string
combined_features = movies_data['genres'] + ' ' + movies_data['Overview'] + ' ' + movies_data['Rating'].astype(str) + ' ' + movies_data['No.of.Ratings'].astype(str)

# Vectorize the combined features
vectorizer = TfidfVectorizer()
feature_vectors = vectorizer.fit_transform(combined_features)

# Calculate similarity scores
similarity = cosine_similarity(feature_vectors)

# Create a list of all movie titles
list_of_all_titles = movies_data['Movie'].tolist()

from transformers import DistilBertForSequenceClassification,DistilBertTokenizer

#Distillation
# Load the pre-trained teacher model and tokenizer
teacher_model = BertForSequenceClassification.from_pretrained('bert-base-uncased')
teacher_tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# Load the pre-trained student model and tokenizer
student_model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased')
student_tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')

# Function to clean the input text
def clean_text(text):
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and numbers
    text = re.sub(r'[^a-z\s]', '', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

# Function to get the model size in bytes
def get_model_size(model):
    temp_path = 'temp_model.pth'
    torch.save(model.state_dict(), temp_path)
    model_size = os.path.getsize(temp_path)
    os.remove(temp_path)
    return model_size



@app.route('/AI-API/D_predict', methods=['POST'])
def D_predict():
    if request.method == 'POST':
        data = request.get_json()
        D_text = data['text']
        
        # Clean the input text
        cleaned_text = clean_text(D_text)
        
        # Teacher model inference time
        start_time = time.time()
        teacher_inputs = teacher_tokenizer(cleaned_text, return_tensors='pt', truncation=True, padding=True)
        teacher_outputs = teacher_model(**teacher_inputs)
        teacher_inference_time = time.time() - start_time
        teacher_model_size = get_model_size(teacher_model)

        # Student model inference time
        start_time = time.time()
        student_inputs = student_tokenizer(cleaned_text, return_tensors='pt', truncation=True, padding=True)
        student_outputs = student_model(**student_inputs)
        student_inference_time = time.time() - start_time
        student_model_size = get_model_size(student_model)

        D_response = {
            'original_text': D_text,
            'teacher_model': {
                'cleaned_text': cleaned_text,
                'inference_time': teacher_inference_time,
                'model_size_MB': teacher_model_size / 1e6
            },
            'student_model': {
                'cleaned_text': cleaned_text,
                'inference_time': student_inference_time,
                'model_size_MB': student_model_size / 1e6
            }
        }

        return jsonify(D_response)

