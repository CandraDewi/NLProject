import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, MessageCircle, Grape, MapPin, Clock, Camera, Leaf, Sun, Star } from 'lucide-react';


import photoHero from './assets/gallery/garden_1.jpg'; 
import photoGaleri2 from './assets/gallery/garden_2.jpg';
import photoGaleri3 from './assets/gallery/garden_3.jpg';
import photoGaleri4 from './assets/gallery/garden_4.jpg';
import photoGaleri5 from './assets/gallery/garden_5.jpg';
import photoGaleri6 from './assets/gallery/garden_6.jpg';
import photoGaleri7 from './assets/gallery/garden_7.jpg';
import photoGaleri8 from './assets/gallery/garden_8.jpg';
import photoGaleri9 from './assets/gallery/garden_9.jpg';
import photoGaleri10 from './assets/gallery/garden_10.jpg';
import photoGaleri11 from './assets/gallery/garden_11.jpg';
import photoGaleri12 from './assets/gallery/garden_12.jpg';
import photoGaleri13 from './assets/gallery/garden_13.jpg';




function App() {
  // --- STATE CHATBOT ---
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Halo! 👋 Selamat datang di layanan asisten KD Garden. Ada yang bisa saya bantu terkait lokasi, tiket, atau info lainnya?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- EFEK SCROLL ---
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // --- FUNGSI KIRIM PESAN ---
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://acaa212-kd-garden.hf.space/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pertanyaan: userMsg })
      });
      
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      
      if (data && typeof data.jawaban === 'string') {
          setMessages(prev => [...prev, { role: 'bot', text: data.jawaban }]);
      } else {
          setMessages(prev => [...prev, { role: 'bot', text: "Maaf, balasan server tidak dapat dibaca." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Gagal terhubung ke AI. Pastikan server lokal menyala. 🙏" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- DATA GALERI ---
  
  const galleryImages = [
    { id: 2, src: photoGaleri2, alt: 'Suasana lorong anggur ninel' },
    { id: 3, src: photoGaleri3, alt: 'Buah anggur siap petik' },
    { id: 4, src: photoGaleri4, alt: 'Aktivitas pengunjung memetik anggur' },
    { id: 5, src: photoGaleri5, alt: 'Pemandangan kebun dari atas' },
    { id: 6, src: photoGaleri6, alt: 'Bibit anggur premium siap jual' },
    { id: 7, src: photoGaleri7, alt: 'Detail buah anggur ninel yang besar' },
    { id: 8, src: photoGaleri8, alt: 'Lorong edukasi budidaya anggur' },
    { id: 9, src: photoGaleri9, alt: 'Fasilitas area parkir dan loket' },
    { id: 10, src: photoGaleri10, alt: 'Spot foto ikonik daun anggur' },
    { id: 11, src: photoGaleri11, alt: 'Spot foto ikonik daun anggur' },
    { id: 12, src: photoGaleri12, alt: 'Spot foto ikonik daun anggur' },
    { id: 13, src: photoGaleri13, alt: 'Spot foto ikonik daun anggur' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800 selection:bg-purple-200 scroll-smooth">
      
      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-purple-50 shadow-sm">
        <div className="flex items-center gap-2 text-purple-900 font-bold text-2xl tracking-tight">
          <Grape className="text-purple-600" size={32} /> K.D Garden
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-500">
          <a href="#beranda" className="hover:text-purple-600 transition-colors">Beranda</a>
          <a href="#fasilitas" className="hover:text-purple-600 transition-colors">Fasilitas</a>
          <a href="#galeri" className="hover:text-purple-600 transition-colors">Galeri</a>
        </div>
       
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section id="beranda" className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-xs tracking-wide uppercase">
            🌿 Agrowisata Edukasi Banyumas 
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1]">
            Petik Anggur <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
              Langsung dari Pohonnya
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
            Satu-satunya kebun anggur di Baturraden. Nikmati manisnya varietas premium Ninel asal Ukraina, udara segar pegunungan, dan pengalaman panen tak terlupakan bersama keluarga.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => setIsOpen(true)}
              className="w-full justify-center bg-purple-600 text-white px-8 py-4 text-lg rounded-full font-bold shadow-lg shadow-purple-200 hover:-translate-y-1 hover:bg-purple-700 transition-all duration-300 flex items-center gap-3"
            >
              <MessageCircle size={35}/> Tanya Asisten Kebun (BOT)
            </button>
          </div>
        </div>

        {/* Gambar Hero */}
        <div className="relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl group">
          <img 
            src={photoHero} 
            alt="Kebun Anggur KD Garden Asli" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
             <p className="font-bold text-xl flex items-center gap-2"><MapPin size={20}/> Desa Karangsalam</p>
             <p className="text-sm opacity-90 text-gray-200">Kecamatan Baturraden, Banyumas</p>
          </div>
        </div>
      </section>

      {/* ================= FASILITAS SECTION ================= */}
      <section id="fasilitas" className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pengalaman di KD Garden</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-16">Lebih dari sekadar berwisata, kami menawarkan pengalaman edukatif yang menyatu dengan alam lereng Gunung Slamet.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-purple-50 hover:bg-purple-100 transition-colors text-left">
              <div className="w-14 h-14 bg-purple-200 text-purple-700 rounded-2xl flex items-center justify-center mb-6"><Grape size={28}/></div>
              <h3 className="text-xl font-bold mb-3">Petik Buah Mandiri</h3>
              <p className="text-gray-600 leading-relaxed">Rasakan sensasi memanen anggur segar berukuran besar dengan daging padat langsung dari rangkainya.</p>
            </div>
            <div className="p-8 rounded-3xl bg-green-50 hover:bg-green-100 transition-colors text-left">
              <div className="w-14 h-14 bg-green-200 text-green-700 rounded-2xl flex items-center justify-center mb-6"><Leaf size={28}/></div>
              <h3 className="text-xl font-bold mb-3">Edukasi Budidaya</h3>
              <p className="text-gray-600 leading-relaxed">Pelajari cara menanam dan merawat bibit anggur langsung dari ahlinya untuk Anda terapkan di rumah.</p>
            </div>
            <div className="p-8 rounded-3xl bg-yellow-50 hover:bg-yellow-100 transition-colors text-left">
              <div className="w-14 h-14 bg-yellow-200 text-yellow-700 rounded-2xl flex items-center justify-center mb-6"><Camera size={28}/></div>
              <h3 className="text-xl font-bold mb-3">Spot Foto Estetik</h3>
              <p className="text-gray-600 leading-relaxed">Abadikan momen liburan Anda di bawah rindangnya lorong daun anggur dengan latar cahaya natural.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GALERI SECTION (BARU & AESTHETIC) ================= */}
      <section id="galeri" className="py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Galeri Kebun K.D Garden</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Lihat langsung keindahan lorong anggur ninel dan aktivitas panen yang autentik dari kebun kami.</p>
        </div>

        {/* Grid Foto yang Responsif dan Aesthetic */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {galleryImages.map((image) => (
            <div key={image.id} className="relative aspect-square rounded-3xl overflow-hidden shadow-md group border-4 border-white hover:border-purple-100 transition-all shadow-purple-50">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay Efek Teks saat Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                 <p className="text-white text-xs font-semibold text-center leading-snug">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONI SECTION ================= */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12 border-t border-gray-100">
        <div className="flex flex-col md:flex-row gap-12 items-center">
           <div className="md:w-1/3">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">Kata Mereka</h2>
             <p className="text-gray-500 mb-6">Ribuan pengunjung telah membuktikan manisnya pengalaman di K.D Garden.</p>
             <div className="flex items-center gap-2 text-yellow-500 mb-2">
               <Star fill="currentColor" size={20}/><Star fill="currentColor" size={20}/><Star fill="currentColor" size={20}/><Star fill="currentColor" size={20}/><Star fill="currentColor" size={20}/>
             </div>
             <p className="font-bold text-xl">5.0 / 5.0 <span className="text-sm font-normal text-gray-400">(Google Reviews)</span></p>
           </div>
           <div className="md:w-2/3 grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                 <p className="italic text-gray-600 mb-4 text-[13px] leading-relaxed">"Kebun anggur buah segar 🤩😋 puas bisa petik langsung dari pohonnya sungguh pengalaman yg blm pernah saya rasakan🍇🍇🍇🍇 pasti kesini lagi pas panen  banyak. Temen temen ini tempatnya enak bngt loh bersih enak buat nyantai di pinggir sawah.🤩"</p>
                 <p className="font-bold text-xs text-purple-900 uppercase tracking-wide">— Abyan Zainul Arifin</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                 <p className="italic text-gray-600 mb-4 text-[13px] leading-relaxed">"Anggurnya seger bngt crunchy beda sama yang di toko toko. Apalagi sensasi petiknya 🤩🍇✂️ Kesini sama ibu,lain kali pasti kesini lagi sama keluarga deh..😁 Walaupun jauh tapi jalannya enak ngga nanjak nanjak amat. Yang sedang di lokawisata Baturraden wajib mampir kesini deh buat oleh oleh petik anggurnya."</p>
                 <p className="font-bold text-xs text-purple-900 uppercase tracking-wide">— Tian Manuel</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                 <p className="italic text-gray-600 mb-4 text-[13px] leading-relaxed">"Mbaeh dodolan bakso neng kebun anggur Alhamdulillah laris y Mbah 😄 Acara PKK dari Banjaranyardi taman anggur Alhamdulillah berjalan lancar dan membawa manfaat.. ibu dapet beli bibit anggurnya juga di sini🍇🍇🍇 …"</p>
                 <p className="font-bold text-xs text-purple-900 uppercase tracking-wide">— Daffa Putra</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                 <p className="italic text-gray-600 mb-4 text-[13px] leading-relaxed">"tempatnya nyaman, fasilitasnya juga lengkap ada mushola, tempat duduk, dll, apalagi anggurnya enak bangett, next pasti bakalan kesini lagi 🤩 …"</p>
                 <p className="font-bold text-xs text-purple-900 uppercase tracking-wide">— Nanda</p>
              </div>
           </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6 lg:px-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Grape className="text-purple-400" size={24} /> K.D Garden
            </div>
            <p className="text-xs max-w-xs">Destinasi agrowisata edukasi petik anggur pertama di Karangsalam, Baturraden. Menghadirkan kesejukan alam lereng Gunung Slamet.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Informasi</h4>
            <ul className="space-y-2 text-xs">
              <li><Clock size={12} className="inline mr-2"/> Buka: 08.00 - 17.00 WIB</li>
              <li><MapPin size={12} className="inline mr-2"/> Desa Karangsalam, Baturraden</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Kontak</h4>
            <a href="https://wa.me/6288215085888" target="_blank" rel="noreferrer" className="bg-green-600 text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-green-700 transition">
              WhatsApp Kami
            </a>
            <p className="text-xs mt-4">Instagram: @kebun_kdgarden</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center text-[11px] border-t border-gray-800 pt-8 mt-8">
          © {new Date().getFullYear()} Wisata Taman Anggur K.D Garden. Banyumas, Central Java.
        </div>
      </footer>


      {/* ================= WIDGET CHATBOT AI ================= */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(147,51,234,0.4)] hover:bg-purple-700 transition-all z-50 hover:scale-110 active:scale-95 group"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {/* Tooltip */}
        {!isOpen && (
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-xl shadow-lg border border-purple-50 w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Tanya Assist KD Garden 👋
          </span>
        )}
      </button>

     
<>
 
          <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            }`}
            onClick={() => setIsOpen(false)} 
          ></div>

          
          <div 
            className={`fixed top-1/2 left-1/2 z-50 flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 
                        w-[95vw] md:w-[600px] lg:w-[700px] 
                        h-[80vh] md:h-[700px] 
                        shadow-[0_20px_60px_rgba(0,0,0,0.5)] 
                        transform -translate-x-1/2 transition-all duration-300 ease-out
                        ${isOpen ? "-translate-y-1/2 scale-100 opacity-100 visible" : "-translate-y-[40%] scale-90 opacity-0 invisible pointer-events-none"}
                      `}
          >
            
            <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm"><Bot size={24} /></div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Asisten K.D Garden</h3>
                  <p className="text-[11px] text-purple-100 flex items-center gap-1.5 mt-1 font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Didukung oleh AI RAG
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-[#FAFAFA] flex flex-col gap-4 scroll-smooth">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${msg.role === 'user' ? 'bg-purple-100 text-purple-700' : 'bg-gradient-to-br from-green-100 to-green-200 text-green-700'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Grape size={16} />}
                  </div>
                  <div className={`p-3.5 text-[14px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-gray-700 rounded-2xl rounded-tl-sm border border-gray-100'}`}>
                    {typeof msg.text === 'string' 
                      ? msg.text.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)
                      : String(msg.text)
                    }
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="self-start flex gap-3 max-w-[80%] animate-in fade-in">
                  <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><Grape size={16} /></div>
                  <div className="p-4 bg-white rounded-2xl rounded-tl-sm border border-gray-100 flex gap-1.5 shadow-sm">
                    <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Ketik pertanyaan Anda..." 
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-[14px] transition-all hover:bg-gray-100 focus:bg-white" 
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </div>
        </>
      </div>
  );
}

export default App;