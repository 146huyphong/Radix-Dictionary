from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from radix_trie import RadixTrie
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI(title="Trie Engine Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

trie = RadixTrie()

class WordEntry(BaseModel):
    word: str
    offset: int


@app.post("/api/words/memory")
def insert_to_memory(entry: WordEntry):
    trie.insert(entry.word, entry.offset)
    return {
        "status": "success",
        "message": f"Word '{entry.word}' inserted with offset {entry.offset}."
    }

@app.get("/api/search/{word}")
def search_word(word: str):
    offset = trie.search(word)
    
    if offset == -1:
        raise HTTPException(status_code=404, detail=f"Word '{word}' not found.")
    
    return {
        "status": "success",
        "word": word,
        "offset": offset
    }

@app.delete("/api/words/memory/{word}")
def delete_from_memory(word: str):
    success = trie.delete(word)
    
    if not success:
        raise HTTPException(status_code=404, detail=f"Word '{word}' not found or already deleted.")
    
    return {
        "status": "success",
        "message": f"Word '{word}' deleted successfully."
    }

@app.get("/api/trie")
def get_trie_data():
    return trie.to_dict()
    
@app.on_event("startup")
def load_data_drom_db():
    print("Loading data from DB...")

    try:
        response = requests.get("https://radix-dictionary.onrender.com/api/db/words/all")
        if response.status_code == 200:
            words = response.json()
            for item in words:
                trie.insert(item['word'], item['id'])
            print(f"Loaded {len(words)} words into the trie.")
    except Exception as e:
        print(f"Error loading data from DB: {e}")