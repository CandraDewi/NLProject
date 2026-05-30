import chromadb
from chromadb.utils import embedding_functions
from google import genai
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import time

# KONFIGURASI API
GOOGLE_API_KEY = "AIzaSyChmUFQOV-YPnKhsdzso976bB3JmZjio5g"
client = genai.Client(api_key=GOOGLE_API_KEY)

multilingual_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="paraphrase-multilingual-MiniLM-L12-v2"
)
chroma_client = chromadb.PersistentClient(path="./chroma_db")
faq_collection = chroma_client.get_collection(name="kd_garden_faq", embedding_function=multilingual_ef)

# DATASET UJI (10 Sampel Emas - Golden Dataset)
data_uji = [
    # 1. Konteks Identitas & Keunikan (Paling sering ditanyakan)
    {
        "kategori": "Identitas Wisata",
        "tanya": "Apa itu wisata KD Garden dan apa keunikannya?",
        "referensi_benar": "KD Garden adalah agrowisata edukasi di Karangsalam, Baturraden. Keunikannya adalah menawarkan pengalaman petik anggur langsung varietas Ninel premium, serta menjadi satu-satunya kebun anggur di kawasan tersebut dengan harga tiket terjangkau."
    },
    
    # 2. Konteks Operasional & Aksesibilitas
    {
        "kategori": "Jam Operasional",
        "tanya": "Jam berapa KD Garden buka setiap harinya?",
        "referensi_benar": "KD Garden beroperasi dan buka setiap hari mulai pukul 07.00 hingga pukul 15.00 WIB."
    },
    
    # 3. Konteks Finansial (Harga Tiket)
    {
        "kategori": "Harga Tiket",
        "tanya": "Berapa biaya tiket masuk ke dalam KD Garden?",
        "referensi_benar": "Harga tiket masuk KD Garden adalah Rp 5.000 untuk anak-anak dan Rp 10.000 untuk dewasa."
    },
    
    # 4. Konteks Finansial (Harga Produk)
    {
        "kategori": "Harga Produk",
        "tanya": "Berapa harga buah anggur jika saya ingin petik sendiri dan membawanya pulang?",
        "referensi_benar": "Buah anggur yang dipetik sendiri dan dibawa pulang oleh pengunjung dijual seharga Rp 70.000 per kilogram."
    },
    
    # 5. Konteks Geospasial (Lokasi)
    {
        "kategori": "Lokasi & Alamat",
        "tanya": "Di mana letak alamat pasti KD Garden?",
        "referensi_benar": "Alamat KD Garden berada di Desa Karangsalam, Kecamatan Baturraden, Kabupaten Banyumas, Provinsi Jawa Tengah."
    },

    # 6. Konteks Fungsional (Fasilitas & Aktivitas)
    {
        "kategori": "Fasilitas & Aktivitas",
        "tanya": "Apa saja aktivitas wisata dan fasilitas yang tersedia di sana?",
        "referensi_benar": "Pengunjung dapat melakukan aktivitas memetik dan mencicipi anggur, berfoto di spot estetik, serta belajar edukasi budidaya. Fasilitas yang tersedia meliputi area kebun anggur, spot foto, dan tempat penjualan buah serta bibit."
    },
    
    # 7. Konteks Pengetahuan Khusus (Domain Knowledge)
    {
        "kategori": "Domain Knowledge",
        "tanya": "Jenis anggur apa yang ditanam dan apa saja keunggulannya?",
        "referensi_benar": "KD Garden menanam varietas anggur Ninel asal Ukraina. Keunggulannya meliputi buah besar berbentuk oval, warna ungu gelap, daging yang padat dan manis, serta tahan terhadap penyakit jamur."
    },
    
    # 8. Konteks Geografi Pertanian (Kesesuaian Lahan)
    {
        "kategori": "Geografi Pertanian",
        "tanya": "Kenapa tanaman anggur tersebut bisa tumbuh subur di wilayah Baturraden?",
        "referensi_benar": "Anggur dapat tumbuh subur karena wilayah Baturraden memiliki hawa sejuk dan tanah yang subur, kondisi ini sangat cocok dengan varietas anggur Ninel yang mampu beradaptasi pada iklim sejuk."
    },
    
    # 9. Konteks Akademik (Kemitraan Mahasiswa) -> Sangat penting untuk laporan Kakak!
    {
        "kategori": "Kemitraan Mahasiswa",
        "tanya": "Apakah mahasiswa diizinkan untuk melakukan penelitian tugas kuliah di kebun ini?",
        "referensi_benar": "Ya, KD Garden sangat terbuka bagi mahasiswa yang ingin melakukan penelitian, observasi, atau wawancara tugas kuliah dengan dikenakan biaya fee sebesar Rp 50.000 per sesi wawancara."
    },

    # 10. Konteks Sosial & Reservasi
    {
        "kategori": "Kontak & Reservasi",
        "tanya": "Bagaimana cara menghubungi pihak KD Garden jika saya ingin datang bersama rombongan?",
        "referensi_benar": "Untuk kedatangan rombongan, sangat disarankan untuk melakukan reservasi dan konfirmasi terlebih dahulu dengan menghubungi pihak KD Garden melalui WhatsApp di nomor +6288215085888."
    }
]

def tanya_bot(pertanyaan):
    hasil_faq = faq_collection.query(query_texts=[pertanyaan], n_results=2)
    konteks_faq = "\n".join(hasil_faq['documents'][0])
    
    prompt = f"Berdasarkan info ini:\n{konteks_faq}\n\nJawab pertanyaan: {pertanyaan}\nJawab secara natural."
    
    try:
        response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
        return response.text
    except:
        time.sleep(5)
        return tanya_bot(pertanyaan)

print("PENGUJIAN PERFORMA MODEL (COSINE SIMILARITY)")
print("-"*60)

skor_cosine_all = []

for i, data in enumerate(data_uji):
    print(f"\n[{i+1}/{len(data_uji)}] Tanya: '{data['tanya']}'")
    
    jawaban_ai = tanya_bot(data['tanya'])
    print(f"Jawaban AI : {jawaban_ai}")
    
    # --- HITUNG COSINE SIMILARITY ---
    vektor_referensi = multilingual_ef([data['referensi_benar']])[0]
    vektor_ai = multilingual_ef([jawaban_ai])[0]
    cosine_sim = cosine_similarity([vektor_referensi], [vektor_ai])[0][0] * 100
    skor_cosine_all.append(cosine_sim)
    
    print(f"Skor Cosine (Makna) : {cosine_sim:.2f}%")

# HASIL AKHIR
print("\n" + "-"*60)
print(f"HASIL EVALUASI AKHIR:")
print(f"Rata-rata Skor Cosine (Semantic Match): {np.mean(skor_cosine_all):.2f}%")
