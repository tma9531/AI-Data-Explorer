from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI Data Explorer API is running!"}