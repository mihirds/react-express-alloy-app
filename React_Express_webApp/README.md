# React + Express Alloy Sandbox Form

This project is a full-stack demo using ** React (frontend) ** and **Express (backend)** to submit user data to the ** Alloy Sandbox API **.

## 🚀 Features
- React form collects applicant data
- Express backend securely calls Alloy API
- Handles Sandbox personas:
  - Last name ** Review ** → “Manual Review” outcome
  - Last name ** Deny ** → “Denied” outcome
- API responses logged in the server console

## 🛠️ Setup
SERVER SETUP

cd Server_Express
npm install
cp .env.example .env
# Add your real Alloy API key in .env
npm run dev

CLIENT SETUP
cd ../Client_React
npm install
npm start
