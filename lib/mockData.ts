import { Memory } from '@/types/memory'

export const mockMemories: Memory[] = [
  {
    id: '1',
    raw_text: `Gue lagi mikirin ide bikin sistem yang bisa nyimpen semua percakapan gue sama AI. 
Masalahnya sekarang ide-ide gue nyebar di mana-mana — ada di Gemini, di Claude, di Notes, di WhatsApp sama diri sendiri. 
Gimana kalau ada satu tempat yang otomatis meringkas dan nge-tag semua itu? 
Kayak "Second Brain" tapi versi gue sendiri yang dihubungin ke Gemini API buat auto-processing.`,
    title: 'Sistem Second Brain',
    summary: 'Ide membangun aplikasi personal knowledge management yang terintegrasi dengan AI untuk mengorganisir percakapan dan pemikiran secara otomatis. Satu tempat untuk semua memori digital.',
    tags: ['#Teknologi', '#Ide', '#Produktivitas'],
    created_at: '2026-07-15T10:30:00Z',
    source_url: 'https://chatgpt.com/c/second-brain-idea',
  },
  {
    id: '2',
    raw_text: `Tadi ngobrol sama senior developer soal career path ke depan. 
Katanya kalau mau masuk ke ranah AI Engineering, harus solid dulu di fundamentals — math, statistics, dan distributed systems. 
Jangan terlalu cepat loncat ke tools tanpa paham underlying concept-nya. 
Target gue: dalam 2 tahun bisa handle end-to-end ML pipeline di production.`,
    title: 'Rencana Karir 2026',
    summary: 'Diskusi mendalam tentang arah karir software engineering dengan fokus ke AI/ML. Senior menekankan pentingnya fondasi matematika dan sistem terdistribusi sebelum masuk ke tools modern.',
    tags: ['#Karir', '#Growth', '#AI'],
    created_at: '2026-07-14T15:00:00Z',
    source_url: 'https://claude.ai/chat/career-path-ai',
  },
  {
    id: '3',
    raw_text: `Baca artikel soal compound interest dan kenapa orang kebanyakan underestimate kekuatannya. 
Kalau invest 1 juta per bulan dari umur 25, dengan return 12% per tahun, di umur 55 udah jadi sekitar 3.5 miliar. 
Key insight: yang paling penting bukan return-nya, tapi consistency dan time in market. 
Mulai sekarang, bukan nunggu "waktu yang tepat".`,
    title: 'Kekuatan Compound Interest',
    summary: 'Catatan penting tentang compound interest dan mengapa konsistensi jauh lebih krusial daripada mencari waktu terbaik untuk berinvestasi. Simulasi: 1 juta/bulan selama 30 tahun = 3.5 miliar.',
    tags: ['#Keuangan', '#Investasi'],
    created_at: '2026-07-13T09:00:00Z',
    source_url: 'https://www.notion.so/Compound-Interest-Notes',
  },
  {
    id: '4',
    raw_text: `Lagi belajar tentang RAG (Retrieval Augmented Generation) architecture. 
Intinya: daripada fine-tune LLM yang mahal, kita bisa kasih konteks yang relevan dari database ke LLM saat inference time. 
Tools yang populer: LangChain, LlamaIndex, Pinecone (vector DB). 
Use case yang menarik: chatbot yang bisa "baca" semua dokumentasi internal perusahaan.`,
    title: 'Belajar RAG Architecture',
    summary: 'Pemahaman mendalam tentang Retrieval Augmented Generation sebagai alternatif fine-tuning yang lebih cost-effective. RAG memungkinkan LLM mengakses pengetahuan spesifik tanpa training ulang.',
    tags: ['#Coding', '#AI', '#Belajar'],
    created_at: '2026-07-12T20:00:00Z',
    source_url: 'https://chatgpt.com/c/rag-architecture-learning',
  },
  {
    id: '5',
    raw_text: `Ngobrol sama temen soal ide bikin startup EdTech buat pelajar SMA di Indonesia. 
Problem: pelajar mau belajar coding tapi kurikulum sekolah ketinggalan zaman dan mentor mahal. 
Solusi: platform dengan AI tutor yang bisa jelasin konsep dengan bahasa anak muda, plus project-based learning yang gamified. 
Monetisasi: freemium, premium plan Rp 99k/bulan. Target awal: 10.000 user dalam 6 bulan.`,
    title: 'Ide Startup EdTech SMA',
    summary: 'Konsep platform belajar coding untuk pelajar SMA Indonesia dengan pendekatan gamifikasi dan AI tutor berbahasa lokal. Model freemium dengan target 10.000 pengguna di 6 bulan pertama.',
    tags: ['#Bisnis', '#Startup', '#EdTech'],
    created_at: '2026-07-11T14:00:00Z',
    source_url: 'obsidian://open?vault=Brain&file=Ide%20Startup%20EdTech',
  },
  {
    id: '6',
    raw_text: `Lagi ngerasain burnout yang cukup parah minggu ini. 
Kerja dari jam 8 pagi sampai jam 12 malem hampir tiap hari. 
Produktivitas justru turun, bukan naik. 
Deep work 4 jam yang focused jauh lebih efektif daripada shallow work 14 jam. 
Mulai besok: strict working hours, tidak ada laptop setelah jam 9 malam, dan olahraga minimal 3x seminggu.`,
    title: 'Melawan Burnout',
    summary: 'Refleksi jujur tentang burnout akibat jam kerja berlebihan dan kesadaran bahwa kualitas jauh lebih penting dari kuantitas. Komitmen baru: deep work 4 jam, batasan jam kerja ketat, dan rutinitas olahraga.',
    tags: ['#Kesehatan', '#Refleksi', '#Produktivitas'],
    created_at: '2026-07-10T21:00:00Z',
    // memory 6 intentionally has no source_url to test fallback
  },
]
