const Distillation = async (req, res) => {
    try {
      const { text } = req.body;
      const flaskUrl = process.env.FLASK_URL + "/D_predict";
      const response = await axios.post(flaskUrl, { text });
      return res.status(200).json(response.data);
    } catch (err) {
      console.error("Error occurred in Flask API:", err);
      return res.status(500).json({ error: err.message });
    }
  }