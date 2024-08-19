const Reinforced = async (req, res) => {
    try {
      const { move } = req.body;
  
      // Validate if 'move' is provided
      if (move === undefined) {
        return res.status(400).json({ error: 'Please provide a move to play' });
      }
  
      // Construct the URL for the Flask API endpoint
      const flaskUrl = process.env.FLASK_URL+"/play-tic-tac-toe";
  
      // Send POST request to Flask API with move data
      const response = await axios.post(flaskUrl, { move });
  
      // Return the response data from Flask API
      return res.status(200).json(response.data);
    } catch (err) {
      // Handle errors if request fails or server error
      console.error('Error occurred while calling Flask API:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };