from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from radix_trie import RadixTrie
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Trie Engine Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cho phép mọi frontend gọi vào
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
    