from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
from google import genai
from chromadb.utils import embedding_functions
import time # Diperlukan untuk sistem delay/retry
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="KD Garden Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MASUKKAN API KEY DI SINI
api_key = os.environ.get("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

multilingual_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="paraphrase-multilingual-MiniLM-L12-v2"
)

chroma_client = chromadb.PersistentClient(path="./chroma_db")
faq_collection = chroma_client.get_collection(name="kd_garden_faq", embedding_function=multilingual_ef)
intent_collection = chroma_client.get_collection(name="kd_garden_intents", embedding_function=multilingual_ef)

class ChatRequest(BaseModel):
    pertanyaan: str

def proses_chatbot(pertanyaan: str):
    try:
        konteks_tambahan = ""

        # 1. Cek Intent (Sapaan/Perpisahan) - JANGAN RETURN LANGSUNG!
        hasil_intent = intent_collection.query(query_texts=[pertanyaan], n_results=1)
        if hasil_intent['distances'] and hasil_intent['distances'][0][0] < 0.2:
            # Ambil pesannya, tapi jadikan sebagai panduan/konteks saja
            # Sesuaikan nama key 'respons_baku' atau 'respons' sesuai format JSON Anda
            pesan_intent = hasil_intent['metadatas'][0][0].get('respons', '') 
            konteks_tambahan += f"[Panduan Niat Pengunjung: {pesan_intent}]\n"

        # 2. Ambil Pengetahuan (Fakta) dari Database RAG
        hasil_faq = faq_collection.query(query_texts=[pertanyaan], n_results=2)
        konteks_faq = "\n".join(hasil_faq['documents'][0])

        # 3. Prompt Engineering (Memaksa AI agar tidak kaku)
        prompt = f"""
        Anda adalah asisten virtual resmi K.D Garden yang asyik, ramah, dan sangat membantu.
        Tugas Anda adalah menjawab pertanyaan pengunjung HANYA berdasarkan informasi berikut:
        
        Informasi Referensi:
        {konteks_tambahan}
        {konteks_faq}

        Pertanyaan Pengunjung: {pertanyaan}

        ATURAN PENULISAN (SANGAT PENTING):
        1. Jangan menjawab dengan kalimat kaku atau seperti robot yang membaca template. 
        2. Rangkai kata-katamu sendiri agar terasa seperti manusia asli yang sedang chatting secara langsung.
        3. Gunakan bahasa Indonesia yang luwes, santai tapi sopan, dan berikan variasi kata.
        4. Gunakan emoji yang sesuai secara natural.
        5. Jika informasi tidak ada di referensi, arahkan dengan sopan ke WA +6288215085888.
        """

        #Panggil Gemini dengan Auto-Retry (Anti 503 / Limit)
        maksimal_coba = 3
        for percobaan in range(maksimal_coba):
            try:
                
                response = client.models.generate_content(
                    model='gemini-2.5-flash', 
                    contents=prompt,
                )
                return response.text
            
            except Exception as e:
                pesan_error = str(e)
                
                if '503' in pesan_error or '429' in pesan_error:
                    if percobaan < maksimal_coba - 1:
                        print(f"[Sistem] Server Google sibuk. Mengulang dalam 3 detik... (Percobaan {percobaan+1}/{maksimal_coba})")
                        time.sleep(3)
                        continue 
                
                
                raise e

    except Exception as e:
        # Menangkap semua error (baik dari Google maupun Python) dan mengamankan React
        print(f"DEBUG ERROR SISTEM: {e}")
        return "Mohon maaf Kak, sistem kecerdasan buatan kami sedang sibuk/penuh. Silakan tanyakan lagi dalam beberapa detik! 🙏"

@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    try:
        jawaban = proses_chatbot(request.pertanyaan)
        return {"status": "success", "jawaban": jawaban}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Fatal Server Error")