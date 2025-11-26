from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import requests
from bs4 import BeautifulSoup

def extract_article_text(url: str) -> str:
    """
    Extracts clean text from any article URL using requests + BeautifulSoup.
    """
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Remove script, style, noscript tags
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()

        # Extract clean paragraphs
        paragraphs = [p.get_text(strip=True) for p in soup.find_all("p")]
        text = "\n".join(paragraphs)

        return text
    except Exception as e:
        print("Error extracting article:", e)
        return ""


def extract_keywords(text: str, top_n: int = 20):
    """
    Extracts top N keywords using TF-IDF.
    """
    try:
        vectorizer = TfidfVectorizer(stop_words='english', max_features=2000)
        tfidf_matrix = vectorizer.fit_transform([text])
        feature_names = vectorizer.get_feature_names_out()
        scores = tfidf_matrix.toarray()[0]

        top_indices = np.argsort(scores)[-top_n:][::-1]

        return [{"word": feature_names[i], "weight": float(scores[i])} for i in top_indices]
    except Exception as e:
        print("Keyword extraction error:", e)
        return []


# ---------- Models ----------
class AnalyzeRequest(BaseModel):
    url: str

class WordItem(BaseModel):
    word: str
    weight: float

class AnalyzeResponse(BaseModel):
    words: List[WordItem]


# ---------- App Setup ----------
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzeRequest):
    text = extract_article_text(payload.url)

    if not text.strip():
        return AnalyzeResponse(words=[WordItem(word="error_no_text", weight=1.0)])

    keywords = extract_keywords(text, top_n=25)

    if not keywords:
        keywords = [{"word": "no_keywords_found", "weight": 1.0}]

    return AnalyzeResponse(words=[WordItem(**k) for k in keywords])
