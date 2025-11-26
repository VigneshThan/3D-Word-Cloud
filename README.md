Overview

This application allows the user to:

Enter any article URL

Extract readable article text automatically

Generate TF-IDF–based keywords

Visualize them in a rotating 3D word cloud powered by Three.js

Toggle the visibility of the keyword list

The interface is designed to be simple, interactive, and user-friendly.

Tech Stack
Backend (FastAPI)

FastAPI

Newspaper4k (article extraction)

Scikit-learn (TF-IDF keyword extraction)

NumPy

CORS support enabled

Frontend (React + TypeScript)

React

Vite

Three.js

React-Three-Fiber

Drei

Custom animations for 3D rendering

Project Structure
3D-Word-Cloud/
│── backend/
│   ├── app/main.py
│   ├── venv/
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── WordCloud.tsx
    │   ├── styles.css
    └── package.json

How to Run the Application
1. Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

2. Frontend
cd frontend
npm install
npm run dev

Features

Article text extraction

TF-IDF keyword generation

Floating 3D visualization

Color-based keyword weighting

Responsive layout

Keyword list toggle (show/hide)
