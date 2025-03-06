# expense-tracker
 
📌 Project Overview

This is a full-stack expense tracker application that allows users to add, edit, delete, and visualize expenses in a structured and interactive way. Built using React (frontend) and Flask (backend), the app stores expenses in a SQLite database and provides a CSV import feature for bulk uploads.

🚀 Features

CRUD Functionality - Users can add, edit, and delete expenses.

Data Persistence – Expenses are stored in an SQLite database.

Real-Time Updates – The table updates automatically after modifications.

CSV File Upload – Users can upload a .csv file to import bulk expenses.

Data Visualization – Expenses are displayed using charts for better insights.

Mantine UI Components – Clean, modern UI built using Mantine.

Confirmations & Validations – Prevents incorrect inputs and accidental deletions.

🛠️ Tech Stack

Frontend:
React

Mantine UI

Axios

Chart.js

Backend:

Flask

SQLite

Pandas (for CSV processing)

Flask-CORS (for handling frontend-backend communication)


⚡ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/your-github-username/expense-tracker.git

cd expense-tracker

2️⃣ Backend Setup (Flask & SQLite)cd backend

python -m venv env

source env/bin/activate  # On Windows use `env\Scripts\activate`

pip install -r requirements.txt

python app.py  # Starts the backend server

3️⃣ Frontend Setup (React & Mantine UI)

cd frontend

npm install

npm start  # Runs the frontend on localhost:3000📊 

Screenshots

💰 Required Fields

![RequiredFields](https://github.com/user-attachments/assets/168088c4-7802-49a0-b0ec-2521f8e19d36)

💰 Delete / Edit Fields

![DeleteExpense](https://github.com/user-attachments/assets/f066473f-d908-4f97-8e4b-713d780f960f)

![EditFields](https://github.com/user-attachments/assets/0988fa0f-8b5a-44ec-8499-644db93e0b74)


📈 Expense Breakdown (Chart Visualization)

![ExpenseTracker](https://github.com/user-attachments/assets/982e46c4-85b9-40e4-9b5a-dc486cb82eae)


🎯 Future ImprovementsAuthentication – Add user accounts to track personal expenses.

Advanced Filtering – Allow filtering expenses by date, amount range, etc.

Deploy Online – Host the app for public use on Vercel/Render.

🏆 AcknowledgmentsThis project was my first full-stack application, built to practice React, Flask, API integration, and database handling. Special thanks to Mantine UI & Chart.js for making the UI and charts smooth!
