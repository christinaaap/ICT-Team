export interface DslngArticle {
  id: string;
  title: string;
  category: 'Operasi & Bisnis' | 'Inovasi & Lingkungan' | 'CSR & Masyarakat' | 'HSE & Keselamatan' | 'ICT & Digital';
  date: string;
  author: string;
  summary: string;
  content: string[];
  sourceUrl: string;
  sourceLabel: string;
  readTime: string;
  featured?: boolean;
  tags: string[];
}

export const DSLNG_OFFICIAL_ARTICLES: DslngArticle[] = [
  {
    id: 'dslng-news-01',
    title: 'Komitmen Pasokan Gas Domestik: DSLNG Siapkan Pengiriman Kargo LNG untuk Mendukung Ketahanan Energi Nasional',
    category: 'Operasi & Bisnis',
    date: '18 Agustus 2024',
    author: 'Corporate Communication PT Donggi-Senoro LNG',
    readTime: '4 menit baca',
    featured: true,
    sourceUrl: 'https://dslng.com',
    sourceLabel: 'Portal Resmi dslng.com',
    tags: ['LNG Cargo', 'Pasar Domestik', 'PGN', 'Operasional Kilang'],
    summary: 'PT Donggi-Senoro LNG (DSLNG) secara konsisten memperkuat pasokan gas cair untuk kebutuhan dalam negeri, merencanakan kelanjutan pengiriman kargo LNG ke terminal regasifikasi domestik.',
    content: [
      'PT Donggi-Senoro LNG (DSLNG) menegaskan komitmennya dalam memperkuat ketahanan energi nasional melalui pasokan Liquefied Natural Gas (LNG) ke sektor domestik. Kilang LNG yang beroperasi di Desa Uso, Kecamatan Batui, Kabupaten Banggai, Sulawesi Tengah ini memiliki kapasitas desain produksi hingga 2,1 juta ton LNG per tahun (setara dengan sekitar 36-40 kargo LNG standar).',
      'Pengiriman kargo LNG domestik dialokasikan untuk memenuhi kebutuhan pasokan pembangkit listrik strategis nasional dan industri domestik melalui kerja sama dengan pembeli dalam negeri seperti PT Perusahaan Gas Negara (PGN) dan PT Nusantara Regas.',
      'Manajemen DSLNG menyatakan bahwa pemenuhan komitmen domestik senantiasa berjalan beriringan dengan pemenuhan kontrak jangka panjang kepada mitra internasional di Jepang (JERA, Kyushu Electric) dan Korea Selatan (KOGAS), dengan standar keandalan operasional terbaik.',
      'Didukung oleh keandalan teknologi otomatisasi kilang dan sistem pemantauan data real-time yang dikelola oleh Departemen ICT dan Engineering, proses pemuatan kargo di dermaga khusus Donggi Port terlaksana dengan standar keselamatan maritim internasional.'
    ]
  },
  {
    id: 'dslng-news-02',
    title: 'Inovasi Efisiensi Energi di IPA Convex: DSLNG Paparkan Pemanfaatan Boil-Off Gas (BOG) Reduksi 2.209 Ton Emisi CO2',
    category: 'Inovasi & Lingkungan',
    date: '16 Mei 2024',
    author: 'Technical & Engineering Division DSLNG',
    readTime: '5 menit baca',
    featured: true,
    sourceUrl: 'https://dslng.com',
    sourceLabel: 'Portal Resmi dslng.com',
    tags: ['IPA Convex', 'Boil-Off Gas', 'Reduksi Emisi', 'Decarbonization'],
    summary: 'DSLNG mempresentasikan inovasi teknik defrosting menggunakan Boil-Off Gas (BOG) pada forum migas bergengsi IPA Convex, berhasil menghemat 44,2 MMSCF gas umpan dan menurunkan emisi gas rumah kaca.',
    content: [
      'Pada ajang Indonesian Petroleum Association (IPA) Convention and Exhibition (IPA Convex), delegasi teknis PT Donggi-Senoro LNG mempresentasikan makalah inovasi efisiensi energi bertajuk "Optimization of Defrost Gas Utilization by Recycling Boil-Off Gas in Single-Train LNG Liquefaction".',
      'Inovasi ini memanfaatkan Boil-Off Gas (BOG) terkompresi yang dihasilkan dari tangki penyimpanan LNG untuk menggantikan sebagian gas umpan (feed gas) panas dalam proses defrost siklus pencairan. Langkah rekayasa ini terbukti mampu menghemat hingga 44,2 MMSCF gas alam yang bernilai ekonomis tinggi.',
      'Selain efisiensi biaya bahan bakar, inovasi ramah lingkungan ini secara terukur berhasil menurunkan emisi karbon dioksida (CO2) sebesar 2.209 ton per tahun, selaras dengan komitmen DSLNG mendukung target Net Zero Emission pemerintah Indonesia.',
      'Sistem instrumentasi digital dan supervisory control berbasis telemetri yang dikawal tim ICT dan Instrumentasi memastikan pengendalian aliran gas berlangsung aman, presisi, dan terintegrasi penuh dengan Central Control Room (CCR).'
    ]
  },
  {
    id: 'dslng-news-03',
    title: 'Pemberdayaan Berkelanjutan: DSLNG Raih Penghargaan TOP CSR Awards Bintang 4 & Konservasi Burung Maleo',
    category: 'CSR & Masyarakat',
    date: '12 Juli 2024',
    author: 'Corporate Social Responsibility (CSR) DSLNG',
    readTime: '4 menit baca',
    featured: false,
    sourceUrl: 'https://dslng.com',
    sourceLabel: 'Portal Resmi dslng.com',
    tags: ['CSR Awards', 'Burung Maleo', 'Banggai', 'Community Development'],
    summary: 'DSLNG kembali membuktikan dedikasi terhadap kelestarian lingkungan dan kemandirian masyarakat lokal Kabupaten Banggai lewat konservasi satwa langka Maleo dan pemberdayaan ekonomi.',
    content: [
      'PT Donggi-Senoro LNG kembali meraih pengakuan bergengsi dalam ajang TOP CSR Awards dengan predikat Bintang Empat (Very Good), serta penghargaan khusus bagi pimpinan perusahaan atas komitmen tinggi dalam program Tanggung Jawab Sosial dan Lingkungan (TJSL) terpadu.',
      'Salah satu program unggulan keanekaragaman hayati DSLNG adalah Pusat Konservasi Eks-Situ Burung Maleo (Macrocephalon maleo), satwa endemik Sulawesi yang dilindungi. Sejak program digulirkan, puluhan anakan burung Maleo hasil penetasan alami terkelola telah berhasil dilepasliarkan kembali ke habitat alaminya di Suaka Margasatwa Bakiriang.',
      'Di bidang kemasyarakatan, DSLNG terus menyalurkan bantuan beasiswa pendidikan, donasi armada bus sekolah untuk pelajar di Kecamatan Batui, serta pelatihan kemandirian wirausaha dan UMKM binaan di desa-desa sekitar area operasi kilang seperti Desa Uso dan Sinorang.',
      'Pendekatan Creating Shared Value (CSV) yang diterapkan memastikan bahwa pertumbuhan bisnis energi DSLNG senantiasa memberi nilai tambah yang harmonis bagi masyarakat lingkar kilang di Kabupaten Banggai.'
    ]
  },
  {
    id: 'dslng-news-04',
    title: 'Keunggulan Keselamatan Kilang Batui: DSLNG Pertahankan Jutaan Jam Kerja Selamat (Zero LTI) & Raih Subroto Award',
    category: 'HSE & Keselamatan',
    date: '20 Februari 2024',
    author: 'HSE & Quality Assurance Directorate',
    readTime: '3 menit baca',
    featured: false,
    sourceUrl: 'https://dslng.com',
    sourceLabel: 'Portal Resmi dslng.com',
    tags: ['HSE Excellence', 'Zero LTI', 'Subroto Award', 'Safety First'],
    summary: 'Kilang DSLNG mencatatkan rekor jutaan jam kerja tanpa kecelakaan fatal (Zero Lost Time Injury) dan dianugerahi Penghargaan Subroto dari Kementerian ESDM RI.',
    content: [
      'Penerapan budaya keselamatan tanpa kompromi (Safety First) di lingkungan operasional Kilang Donggi-Senoro LNG di Batui membuahkan hasil membanggakan. Perusahaan berhasil mempertahankan jutaan jam kerja kerja selamat tanpa insiden kehilangan hari kerja (Zero Lost Time Injury / LTI).',
      'Atas kepatuhan regulasi ketat dan keunggulan pengelolaan keselamatan minyak dan gas bumi, DSLNG dianugerahi Penghargaan Keselamatan Migas "Penghargaan Subroto" dari Kementerian Energi dan Sumber Daya Mineral (ESDM) Republik Indonesia.',
      'Pencapaian ini ditopang oleh sistem izin kerja digital (Electronic Permit to Work), pemantauan gas otomatis di seluruh unit proses, simulasi tanggap darurat rutin, serta sistem peringatan dini terintegrasi jaringan telekomunikasi darurat fiber optic & radio DMR.'
    ]
  },
  {
    id: 'dslng-news-05',
    title: 'Peran Strategis Departemen ICT dalam Menjaga Keandalan Komunikasi Single-Train LNG Plant & Donggi Port Jetty',
    category: 'ICT & Digital',
    date: '15 Januari 2024',
    author: 'ICT Department PT Donggi-Senoro LNG',
    readTime: '4 menit baca',
    featured: false,
    sourceUrl: 'https://dslng.com',
    sourceLabel: 'Portal Resmi dslng.com',
    tags: ['ICT Infrastructure', 'Zero Trust', 'Marine Comms', 'Fiber Optic'],
    summary: 'Integrasi jaringan satelit VSAT kecepatan tinggi, kabel laut fiber optic, dan arsitektur Zero-Trust memastikan kelancaran komunikasi kilang 24/7 tanpa henti.',
    content: [
      'Departemen ICT PT Donggi-Senoro LNG memainkan peran vital dalam menjamin ketersediaan jaringan telekomunikasi dan sistem enterprise hingga 99.98% availability antara Plant Site Batui (Sulawesi Tengah) dan Head Office Sentral Senayan II (Jakarta).',
      'Infrastruktur ICT mencakup jalur interkoneksi redundan serat optik berkecepatan tinggi, backup stasiun bumi satelit VSAT, jaringan radio trunking UHF DMR untuk komunikasi marine jetty di Donggi Port, serta sistem manajemen aset TI terkomputerisasi.',
      'Di era digitalisasi industri energi, Departemen ICT terus mengimplementasikan standar keamanan siber ISO/IEC 27001 dan pemisahan arsitektur OT/IT untuk melindungi Industrial Control System (ICS) kilang dari potensi ancaman siber eksternal.',
      'Melalui aplikasi Helpdesk & Asset Management terpadu ini, seluruh karyawan dan staf teknis dapat melakukan pelaporan insiden, peminjaman perangkat kerja, hingga pelacakan SLA secara cepat dan transparan.'
    ]
  },
  {
    id: 'dslng-news-06',
    title: 'DSLNG Raih 7 Penghargaan di Eco-Tech Pioneer and Sustainability Award (EPSA) untuk Inovasi Berkelanjutan',
    category: 'Inovasi & Lingkungan',
    date: '08 November 2023',
    author: 'Environment & Sustainability Department',
    readTime: '3 menit baca',
    featured: false,
    sourceUrl: 'https://dslng.com',
    sourceLabel: 'Portal Resmi dslng.com',
    tags: ['EPSA Award', 'Eco-Siklus', 'Low Carbon', 'Sustainability'],
    summary: 'DSLNG meraih 7 penghargaan prestisius dalam ajang EPSA, termasuk predikat Emas pada kategori Inovasi Rendah Karbon dan Pengembangan Komunitas.',
    content: [
      'PT Donggi-Senoro LNG berhasil memborong 7 trofi penghargaan dalam ajang Eco-Tech Pioneer and Sustainability Award (EPSA). Penghargaan ini diberikan atas dedikasi nyata perusahaan dalam menerapkan teknologi ramah lingkungan dan program pelestarian alam terukur.',
      'Di antara kategori penghargaan yang diraih adalah Inovasi Rendah Karbon (Predikat Emas) atas keberhasilan menekan flaring gas suar dan pemanfaatan BOG, Inovasi Eco-Siklus pengolahan air limbah terpadu kilang, serta Program Pemberdayaan Komunitas Berkelanjutan di Kecamatan Batui.',
      'Penghargaan ini mempertegas posisi PT Donggi-Senoro LNG sebagai pelopor kilang LNG model independen di Asia Pasifik yang memadukan keunggulan operasi dengan kepedulian lingkungan tinggi.'
    ]
  }
];
