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


@app.route('/AI-API/movie_recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    movie_name = data.get('movie_name')
    
    if not movie_name:
        return jsonify({'error': 'Please provide a movie name.'}), 400

    # Find the close match for the movie name given by the user
    find_close_match = difflib.get_close_matches(movie_name, list_of_all_titles)
    if not find_close_match:
        return jsonify({'error': 'No match found.'}), 404

    close_match = find_close_match[0]

    # Find the index of the movie with the title
    index_of_the_movie = movies_data[movies_data.Movie == close_match]['Index'].values[0]

    # Get a list of similar movies
    similarity_score = list(enumerate(similarity[index_of_the_movie]))

    # Sort the movies based on their similarity score
    sorted_similar_movies = sorted(similarity_score, key=lambda x: x[1], reverse=True)

    # Prepare the list of similar movie names and overviews
    recommended_movies = []
    for movie in sorted_similar_movies[:10]:  # Limit to top 10 recommendations
        index = movie[0]
        title_from_index = movies_data[movies_data.Index == index]['Movie'].values[0]
        overview_from_index = movies_data[movies_data.Index == index]['Overview'].values[0]
        recommended_movies.append({
            'title': title_from_index,
            'overview': overview_from_index
        })

    return jsonify({'recommended_movies': recommended_movies})
    