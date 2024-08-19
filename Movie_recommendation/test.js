const WhatisNLP = async (req, res) => {
    try {
      const { movie_name } = req.body;
  
      // Validate if 'movie_name' is provided
      if (!movie_name) {
        return res.status(400).json({ error: 'Please provide a movie name.' });
      }
  
      // Construct the URL for the Flask API endpoint
      const flaskUrl = `${process.env.FLASK_URL}/movie_recommend`;
  
      // Send POST request to Flask API with movie name data
      const response = await axios.post(flaskUrl, { movie_name });
  
      // Return the response data from Flask API
      return res.status(200).json(response.data);
    } catch (err) {
      // Handle errors if request fails or server error
      console.error('Error occurred while calling Flask API:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };