import datetime as dt
import yfinance as yf
import numpy as np
import matplotlib.pyplot as plt
import io
import math
from sklearn.preprocessing import MinMaxScaler

def rnn_predict(data):
    try:
        # Extract start date and set end date to current date
        start_date = dt.datetime.strptime(data['start_date'], '%Y-%m-%d')
        end_date = dt.datetime.today()

        # Download data from Yahoo Finance
        stock_data = yf.download(data['ticker'], start_date, end_date)
        
        # Handle missing data by forward filling
        stock_data.fillna(method='ffill', inplace=True)

        # Ensure there are no missing values
        if stock_data.isnull().values.any():
            raise ValueError("Data contains missing values after forward filling")

        # Preprocess data
        training_data_len = math.ceil(len(stock_data) * .8)
        train_data = stock_data[:training_data_len].iloc[:, :1]
        test_data = stock_data[training_data_len:].iloc[:, :1]

        # Calculate the moving average for the training data
        window_size = 50
        moving_avg_predictions = train_data['Open'].rolling(window=window_size).mean().iloc[window_size-1:].values

        # Align predictions with the test data length
        moving_avg_predictions = np.concatenate([np.full((window_size-1,), np.nan), moving_avg_predictions])

        # Plot the actual vs. predicted open prices
        plt.figure(figsize=(10, 6))
        plt.plot(stock_data.index, stock_data['Open'], label='Actual Open Price')
        plt.plot(stock_data.index[:len(moving_avg_predictions)], moving_avg_predictions, label='Moving Average Predicted Open Price')
        plt.title('Actual vs. Moving Average Predicted Open Prices')
        plt.xlabel('Date')
        plt.ylabel('Open Price')
        plt.legend()
        plt.grid(True)

        # Save plot to in-memory image file
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        
        # Clear the figure to free up memory
        plt.clf()
        
        # Return the image file
        return img
    
    except Exception as e:
        raise RuntimeError(f"Prediction error: {str(e)}")


@app.route('/AI-API/recurrent-neural-networks', methods=['POST'])
def rnn_predict_api():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'error': 'No JSON data provided'}), 400

        # Call rnn_predict function to get the image
        img = rnn_predict(data)

        # Send image data as response
        return send_file(img, mimetype='image/png')

    except Exception as e:
        return jsonify({'error': str(e)}), 500
