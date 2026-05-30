import json
import chromadb
import os
from chromadb.utils import embedding_functions


# INISIALISASI VECTOR DATABASE (MULTILINGUAL)
multilingual_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="paraphrase-multilingual-MiniLM-L12-v2"
)

chroma_client = chromadb.PersistentClient(path="./chroma_db")

faq_collection = chroma_client.get_or_create_collection(
    name="kd_garden_faq", 
    embedding_function=multilingual_ef
)
intent_collection = chroma_client.get_or_create_collection(
    name="kd_garden_intents", 
    embedding_function=multilingual_ef
)


# FUNGSI PREPROCESSING
def proses_dan_simpan_dataset(filepath):
    print("Memulai preprocessing dataset dengan model multilingual...")
    with open(filepath, 'r', encoding='utf-8') as file:
        data = json.load(file)

    print("Memproses Intents...")
    intent_docs = []
    intent_metadatas = []
    intent_ids = []

    for idx, item in enumerate(data['intents_chatbot']):
        for sub_idx, contoh in enumerate(item['contoh_kalimat']):
            intent_docs.append(contoh)
            intent_metadatas.append({
                "intent_name": item['intent'], 
                "respons_baku": item['respons']
            })
            intent_ids.append(f"intent_{idx}_{sub_idx}")

    if intent_docs:
        intent_collection.upsert(documents=intent_docs, metadatas=intent_metadatas, ids=intent_ids)
        print(f"Berhasil menyimpan {len(intent_docs)} vektor intent.")

    print("Memproses Dataset QA Utama & FAQ Tambahan...")
    faq_docs = []
    faq_metadatas = []
    faq_ids = []

    # Memproses dataset_qa
    for item in data.get('dataset_qa', []):
        semua_pertanyaan = [item['pertanyaan']] + item.get('variasi_pertanyaan', [])
        teks_pertanyaan = " | ".join(semua_pertanyaan)
        teks_chunk = f"Topik: {item['kategori']}\nPertanyaan Terkait: {teks_pertanyaan}\nInformasi/Jawaban: {item['jawaban']}"
        faq_docs.append(teks_chunk)
        faq_metadatas.append({"kategori": item['kategori'], "id_dokumen": item['id']})
        faq_ids.append(item['id'])

    # Memproses dataset_tambahan_faq
    for item in data.get('dataset_tambahan_faq', []):
        teks_chunk = f"Topik: FAQ Umum\nPertanyaan Terkait: {item['pertanyaan']}\nInformasi/Jawaban: {item['jawaban']}"
        faq_docs.append(teks_chunk)
        faq_metadatas.append({"kategori": "FAQ Tambahan", "id_dokumen": item['id']})
        faq_ids.append(item['id'])

    if faq_docs:
        faq_collection.upsert(documents=faq_docs, metadatas=faq_metadatas, ids=faq_ids)
        print(f"Berhasil menyimpan {len(faq_docs)} vektor pengetahuan FAQ.")

    print("Preprocessing selesai. Database pintar siap digunakan!")

if __name__ == "__main__":
    file_json = "Dataset_Chatbot_KDGarden.json" # Pastikan nama file sesuai
    if os.path.exists(file_json):
        proses_dan_simpan_dataset(file_json)
    else:
        print(f"File {file_json} tidak ditemukan.")