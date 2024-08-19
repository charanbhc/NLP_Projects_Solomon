const ADDNORM = async (req, res) => {
    try {
      const { numbers } = req.body;
  
      // Validate input
      if (!Array.isArray(numbers) || numbers.length === 0) {
        return res.status(400).json({ error: 'Invalid input. Please provide a non-empty array of numbers.' });
      }
  
      // Define the Flask API URL
      const flaskUrl = `${process.env.FLASK_URL}/process`;
  
      // Send a POST request to the Flask API with the numbers
      const response = await axios.post(flaskUrl, { numbers });
      
      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Error occurred while processing input with details:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return res.status(error.response.status).json({ error: error.response.data });
      } else if (error.request) {
        // The request was made but no response was received
        return res.status(500).json({ error: 'No response received from Flask server.' });
      } else {
        // Something happened in setting up the request that triggered an Error
        return res.status(500).json({ error: error.message });
      }
    }
  };