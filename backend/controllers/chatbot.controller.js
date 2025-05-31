import axios from "axios";

const COHERE_API_KEY = process.env.COHERE_API_KEY;

export const chatbotResponse = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Received prompt:", prompt);

    const response = await axios.post(
      "https://api.cohere.ai/v1/chat", // ✅ Correct API endpoint
      {
        model: "command-xlarge-nightly",
        message: prompt, // ✅ Use 'message' instead of 'prompt'
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Cohere API response:", response.data);

    // Extract the chatbot's reply from response
    if (response.data && response.data.text) {
      const generatedText = response.data.text.trim();
      res.status(200).json({ message: generatedText });
    } else {
      console.error("Cohere API response is missing text:", response.data);
      res.status(500).json({ error: "No text field in response from Cohere" });
    }
  } catch (error) {
    console.error("Error with Cohere API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate response from the backend." });
  }
};
