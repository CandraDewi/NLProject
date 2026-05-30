import chromadb
from google import genai
from chromadb.utils import embedding_functions
import time  # <-- Pustaka baru untuk memberikan jeda waktu

# 1. Konfigurasi API Gemini
GOOGLE_API_KEY = "MASUKKAN_API_KEY_ANDA_DI_SINI"
client = genai.Client(api_key=GOOGLE_API_KEY)

# 2. Koneksi Database dengan Model Multilingual
multilingual_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="paraphrase-multilingual-MiniLM-L12-v2"
)

chroma_client = chromadb.PersistentClient(path="./chroma_db")
faq_collection = chroma_client.get_collection(name="kd_garden_faq", embedding_function=multilingual_ef)
intent_collection = chroma_client.get_collection(name="kd_garden_intents", embedding_function=multilingual_ef)

def tanya_chatbot(pertanyaan):
    # Tahap A: Cek Intent (Sapaan dll)
    hasil_intent = intent_collection.query(query_texts=[pertanyaan], n_results=1)
    skor_jarak = hasil_intent['distances'][0][0]
    
    if skor_jarak < 0.2: 
        return hasil_intent['metadatas'][0][0]['respons_baku']

    # Tahap B: RAG
    hasil_faq = faq_collection.query(query_texts=[pertanyaan], n_results=2)
    konteks = "\n".join(hasil_faq['documents'][0])
    
    # Tahap C: Gemini merangkai jawaban
    prompt = f"""
    Anda adalah asisten virtual resmi K.D Garden.
    Jawab pertanyaan HANYA berdasarkan informasi berikut:
    {konteks}
    
    Pertanyaan Pengunjung: {pertanyaan}
    
    Jawab dengan ramah, natural, dan gunakan emoji. Jika informasi tidak ada di atas, arahkan ke WA +6288215085888.
    """
    
    # TAHAP D: Sistem Auto-Retry (Anti-Macet 503)
    maksimal_coba = 3
    for percobaan in range(maksimal_coba):
        try:
            # Kita coba gunakan model gemini-2.0-flash yang biasanya lebih stabil dari 2.5
            response = client.models.generate_content(
                model='gemini-2.0-flash', 
                contents=prompt,
            )
            return response.text
        
        except Exception as e:
            pesan_error = str(e)
            if '503' in pesan_error or '429' in pesan_error:
                if percobaan < maksimal_coba - 1:
                    print(f"  [Sistem] Server Google sibuk. Mengulang dalam 3 detik... (Percobaan {percobaan+1}/{maksimal_coba})")
                    time.sleep(3) # Tunggu 3 detik sebelum mencoba lagi
                else:
                    return "Maaf Kak, server AI kami sedang sangat penuh. Mohon tunggu beberapa menit dan coba lagi ya! 🙏"
            else:
                return f"Terjadi gangguan teknis: {e}"

if __name__ == "__main__":
    print("=======================================")
    print("🤖 Chatbot KD Garden Siap Digunakan!")
    print("Ketik 'exit' untuk menghentikan program.")
    print("=======================================\n")
    while True:
        p = input("Anda: ")
        if p.lower() in ['exit', 'keluar']: break
        
        # Cetak jawaban dari fungsi
        jawaban = tanya_chatbot(p)
        print(f"KD Garden: {jawaban}\n")