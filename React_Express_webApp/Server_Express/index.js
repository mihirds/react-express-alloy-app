// helps with the API, backend and loading secret env variables.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
// console.log("Loaded ALLOY_API_KEY:", process.env.ALLOY_API_KEY);  was for debugging


const app = express(); // creates express instance
app.use(cors()); // enables cross-origin Resource Sharing 
app.use(express.json()); // allows express to parse JSON request bodies

// defining post endpoint
app.post("/api/submit", async (req, res) => {
  try {
    const formData = req.body;
// constructing a payload as required by Alloy
    const payload = {
      name_first: formData.firstName,
      name_last: formData.lastName,
      birth_date: formData.dob,
      document_ssn: formData.ssn,
      address_line_1: formData.address.line1,
      address_line_2: formData.address.line2,
      address_city: formData.address.city,
      address_state: formData.address.state,
      address_postal_code: formData.address.zip,
      address_country_code: formData.address.country,
      email_address: formData.email,
      entity_type: "individual", // optional for sandbox
      // workflow_token: "your_workflow_token_here"
    };
// debug log for what is being sent to Alloy API
    console.log("Submitting to Alloy API:", payload);
// The actual send request to alloy sandbox API
    const alloyResponse = await fetch("https://sandbox.alloy.co/v1/evaluations", {
      method: "POST",
      headers: {
        accept: "application/json", // accepts JSON
        "content-type": "application/json", // Sending JSON
        authorization: process.env.ALLOY_API_KEY, // creds held in .env
      },
      body: JSON.stringify(payload),
    });
// returns the Alloy response and logs it in the terminal for debugging
    const data = await alloyResponse.json();
    console.log("Alloy API Response:", data); 
// handles the API error, logs the error and stop further code from running
    if (!alloyResponse.ok) {
      console.error("❌ Alloy API Error:", alloyResponse.status, data);
      return res.status(alloyResponse.status).json({
        errors: { server: data || "Alloy API returned an error" }
      });
    }

    res.status(200).json({
      message: "Fantastic, you have created an account with Best Bank!",
      alloy: data
    });

  } catch (error) {
    console.error("Error submitting to Alloy:", error);
    res.status(500).json({ errors: { server: "Failed to connect to Alloy API" } });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
