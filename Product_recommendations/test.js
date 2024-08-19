const ProductRecommendations = async (req, res) => {
  try {
  // Validate the request body
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'The "input_name" parameter is required.' });
  }

  // Define the Flask API URL
  const flaskUrl = `${process.env.FLASK_URL}/product-recommendations`;

  // Send a POST request to the Flask API with the 'input_name' parameter
  const response = await axios.post(flaskUrl, { name });

  // Respond with the data from the Flask API
  return res.status(200).json(response.data);
} catch (error) {
  // Handle errors
  console.error('Error occurred while communicating with the Flask API:', error);

  // Send an appropriate error response
  if (error.response) {
    // Flask API responded with an error status code
    return res.status(error.response.status).json({
      error: error.response.data,
    });
  } else {
    // Axios failed to communicate with the Flask API
    return res.status(500).json({
      error: 'Failed to communicate with the Flask API.',
      details: error.message,
    });
  }
}
};
