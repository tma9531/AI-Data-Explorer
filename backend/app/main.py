from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import BytesIO

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AI Data Explorer API is running!"}

@app.get("/api/health")
def check_health():
    return {"status": "ok"}

@app.post("/api/datasets/upload")
async def upload_dataset(file: UploadFile=File(...)):
    # check file extension
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Supported file types: .csv"
        )

    # read uploaded file (in bytes)
    contents = await file.read()

    # for now, limit uploads to 10MB
    LIMIT_MB = 10
    if len(contents) > LIMIT_MB * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"File is too large. Maximum file size is {LIMIT_MB}MB."
        )

    try:
        # convert contents to pd dataframe
        df = pd.read_csv(BytesIO(contents))

        # check df creation
        if df.empty or len(df) == 0:
            raise HTTPException(
                status_code=400,
                detail="The CSV file is empty."
            )

        # preview first 5 rows
        preview_df = df.head(5).astype(object)
        preview_df = preview_df.where(pd.notna(preview_df), None)

        return {
            "filename": file.filename,
            "row_count": len(df),
            "column_count": len(df.columns),
            "columns": df.columns.tolist(),
            "preview": preview_df.to_dict(orient="records") 
        }

    except HTTPException:
        raise

    except (pd.errors.ParserError, pd.errors.EmptyDataError, UnicodeDecodeError):
        raise HTTPException(
            status_code=400,
            detail="Unable to parse the CSV file."
        )