from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


@app.route('/AI-API/product-recommendations', methods=['POST'])
def electron_recommendation(data_path='data.csv', top_n=10):
    try:
        app.logger.debug(f"Loading data from {data_path}.")

        # Load data from CSV file
        data = pd.read_csv(data_path)
        app.logger.info(f"Data loaded successfully from {data_path}.")
        
        # Preprocess data
        data['name'] = data['name'].str.lower()
        data['brand'] = data['brand'].str.lower()
        data['categories'] = data['categories'].str.lower()
        data['manufacturer'] = data['manufacturer'].str.lower()
        data['combined_features'] = data['name'] + ' ' + data['brand'] + ' ' + data['categories'] + ' ' + data['manufacturer']

        # Apply TF-IDF vectorization and compute cosine similarity matrix
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(data['combined_features'])
        cosine_sim_matrix = cosine_similarity(tfidf_matrix)

    except Exception as e:
        app.logger.error(f"Error loading and preprocessing data from {data_path}: {e}")
        return jsonify({"error": str(e)}), 500  # Return error message and status 500 for error

    try:
        # Extract input name from POST request
        request_data = request.get_json()
        name = request_data['name'].lower()

        # Filter data to find products that contain the input name as a substring in the 'name' column
        matching_products = data[data['name'].str.contains(name, case=False, na=False)]

        # Return an error message if there are no matching products
        if matching_products.empty:
            return jsonify({"error": "No matching products found."}), 404  # Return error message and status 404 for not found

        # Collect recommendations based on cosine similarity
        unique_names = set()  # Track unique product names
        recommended_products = []  # List to store recommended product details

        # Iterate through indices of matching products
        for input_index in matching_products.index:
            # Get similarity scores for the input product
            similarity_scores = list(enumerate(cosine_sim_matrix[input_index]))

            # Sort similarity scores by descending order
            similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

            for index, score in similarity_scores:
                if index == input_index:
                    continue  # Skip the input product itself

                # Get the product details from the data
                product_name = data.loc[index, 'name']

                # If the product name is unique and not in the set, add it to the recommendations list
                if product_name not in unique_names:
                    unique_names.add(product_name)
                    product_details = {
                        'name': product_name,
                        'brand': data.loc[index, 'brand'],
                        'categories': data.loc[index, 'categories'],
                        'price': data.loc[index, 'price'],
                        'dateAdded': data.loc[index, 'dateAdded'],
                        'manufacturer': data.loc[index, 'manufacturer']
                    }
                    recommended_products.append(product_details)

                    # Stop when enough recommendations are collected
                    if len(recommended_products) >= top_n:
                        break

            # Stop iterating if enough recommendations are collected
            if len(recommended_products) >= top_n:
                break

        # Convert recommendations to a DataFrame
        recommendations_df = pd.DataFrame(recommended_products)

        # Convert the DataFrame to a CSV string
        csv_data = recommendations_df.to_csv(index=False)  # 'index=False' removes the index column

        return csv_data, 200  # Return CSV data string and status code 200 for success

    except Exception as e:
        app.logger.error(f"Error processing recommendation request: {e}")
        return jsonify({"error": str(e)}), 500  # Return error message and status 500 for error
#-----Recommend DN 79----------------------------------------------------------------------------------------
def recommend_endpoint():
    try:
        app.logger.debug("Request received.")
        
        # Get JSON data from request body
        request_data = request.get_json()
        app.logger.debug(f"Request data: {request_data}")

        input_name = request_data.get('name')
        app.logger.debug(f"Input name: {input_name}")

        # Check if the input name is provided
        if not input_name:
            app.logger.error("Missing input name.")
            return jsonify({'error': 'Missing input name.'}), 400

        # Get the data path from the environment variable or use default
        data_path = os.getenv('DATA_PATH', 'data.csv')
        app.logger.debug(f"Data path: {data_path}")

        # Call the electron_recommendation function with the correct parameters
        csv_data, status = electron_recommendation(input_name=input_name, data_path=data_path)
        app.logger.debug(f"Recommendation status: {status}")

        # If csv_data is None, return an appropriate response
        if csv_data is None:
            app.logger.error("No matching products found.")
            return jsonify({'error': 'No matching products found.'}), status
        
        # Return the CSV data as a response
        response = Response(
            csv_data,
            status=status,
            mimetype='text/csv'
        )

        # Add headers to specify the file name (optional)
        response.headers['Content-Disposition'] = 'attachment; filename="recommendations.csv"'

        return response

    except Exception as e:
        app.logger.error(f'Error fetching recommendations: {e}')
        return jsonify({'error': f'Error fetching recommendations: {str(e)}'}), 500
