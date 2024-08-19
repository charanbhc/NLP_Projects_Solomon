const FeedforwardNetwork = async (req, res) => {
    try {
      const { sepal_length, sepal_width, petal_length, petal_width } = req.body;
  
      // Validate input
      if (typeof sepal_length !== 'number' ||
          typeof sepal_width !== 'number' ||
          typeof petal_length !== 'number' ||
          typeof petal_width !== 'number') {
        return res.status(400).json({ error: 'Invalid input types' });
      }
  
      // Define the Flask API URL
      const flaskUrl = process.env.FLASK_URL + "/feedforward-network";
  
      // Send a POST request to the Flask API with the features
      const response = await axios.post(flaskUrl, {
        sepal_length,
        sepal_width,
        petal_length,
        petal_width
      });
  
      // Extract class name from the Flask response
      const { predicted_class: predictedClass } = response.data;
  
      // Return the prediction result
      return res.status(200).json({
        class: predictedClass
      });
    } catch (error) {
      // Handle errors
      console.error('Error occurred while calling Flask API:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  