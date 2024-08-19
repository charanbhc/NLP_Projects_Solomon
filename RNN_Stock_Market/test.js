const RecurrentNeuralNetworks = async (req, res) => {
  try {
    const flaskUrl = process.env.FLASK_URL+"/recurrent-neural-networks"; // Correct Flask API endpoint
    const { start_date, ticker } = req.body; // Extract parameters from request body

    // Validate request parameters
    if (!start_date || !ticker) {
      return res.status(400).json({ error: 'The "start_date" and "ticker" parameters are required.' });
    }

    // Set end date to the current date
    const end_date = new Date().toISOString().split('T')[0];

    // Send POST request to Flask API with required parameters
    const response = await axios.post(flaskUrl, { start_date, end_date, ticker }, { responseType: 'arraybuffer' });

    // Check if the response contains image data
    if (response && response.data) {
      // Set the correct content type for the image
      res.set('Content-Type', 'image/png'); // Set content type as PNG image
      
      // Send the image data in the response
      return res.status(200).send(response.data);  
    } else {
      // Handle case where image data is not present in response
      console.error("Error: Image data not found in response.");
      return res.status(500).json({ error: "Image data not found in response" });
    }
  } catch (err) {
    console.error("Error occurred in Flask API:", err);
    return res.status(500).json({ error: err.message });
  }
};
