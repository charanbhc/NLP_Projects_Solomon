from flask import Flask, request, jsonify
import numpy as np
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

app = Flask(__name__)

# Load the Iris dataset
data = load_iris()
X = data.data
y = data.target

# Standardize features
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Convert labels to one-hot encoding
one_hot_encoder = OneHotEncoder(sparse_output=False)
y_encoded = one_hot_encoder.fit_transform(y.reshape(-1, 1))

# Define the feed-forward neural network model
model = Sequential([
    Dense(64, activation='relu', input_shape=(X.shape[1],)),
    Dense(32, activation='relu'),
    Dense(3, activation='softmax')  # Output layer for 3 classes
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model

history = model.fit(X, y_encoded, epochs=20, batch_size=8, validation_split=0.1, verbose=0)


# Print training history

for key in history.history:
    print(f"{key}: {history.history[key][-1]}")

def predict_class(features):
    # Standardize input features
    features_scaled = scaler.transform([features])

    # Predict class probabilities
    predictions = model.predict(features_scaled)

    # Get predicted class
    predicted_class = np.argmax(predictions, axis=1)[0]

    # Map predicted class index to class name
    class_name = data.target_names[predicted_class]
    
    return class_name


@app.route('/AI-API/feedforward-network', methods=['POST'])
def ffnpredict():
    data = request.get_json()

    # Extract features from request data
    try:
        sepal_length = float(data['sepal_length'])
        sepal_width = float(data['sepal_width'])
        petal_length = float(data['petal_length'])
        petal_width = float(data['petal_width'])
    except KeyError:
        return jsonify({'error': 'Missing features'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid input type'}), 400

    features = [sepal_length, sepal_width, petal_length, petal_width]

    # Predict class
    class_name = predict_class(features)
    response = {
        'predicted_class': class_name
    }

    return jsonify(response) 
