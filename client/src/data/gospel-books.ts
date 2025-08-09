// Lista curada de livros gospel e motivacionais cristãos com capas
export const gospelBooks = [
  // Clássicos do Gospel
  {
    id: "1",
    title: "Peregrino de Bunyan",
    author: "John Bunyan",
    description: "Uma alegoria cristã clássica sobre a jornada espiritual de um cristão da Cidade da Destruição para a Cidade Celestial.",
    category: "devotional",
    imageUrl: "https://m.media-amazon.com/images/I/81+sGLgQG1L._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://www.gutenberg.org/files/131/131-pdf.pdf",
    readOnlineUrl: "https://www.gutenberg.org/files/131/131-h/131-h.htm",
    isReal: true,
    isFree: true,
    downloads: "2.5M"
  },
  {
    id: "2", 
    title: "O Poder da Oração",
    author: "E.M. Bounds",
    description: "Um guia profundo sobre a vida de oração, explorando como desenvolver uma vida de oração eficaz e transformadora.",
    category: "devotional",
    imageUrl: "https://m.media-amazon.com/images/I/71VYjJ9qz8L._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://www.gutenberg.org/files/25853/25853-pdf.pdf",
    readOnlineUrl: "https://www.gutenberg.org/files/25853/25853-h/25853-h.htm",
    isReal: true,
    isFree: true,
    downloads: "850K"
  },
  {
    id: "3",
    title: "Imitação de Cristo",
    author: "Tomás de Kempis",
    description: "Um dos clássicos mais lidos da literatura cristã devocional, focando na vida interior e na santificação.",
    category: "devotional",
    imageUrl: "https://m.media-amazon.com/images/I/71DXRV2UXHL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://www.gutenberg.org/files/1653/1653-pdf.pdf",
    readOnlineUrl: "https://www.gutenberg.org/files/1653/1653-h/1653-h.htm",
    isReal: true,
    isFree: true,
    downloads: "1.2M"
  },
  
  // Biografias Inspiradoras
  {
    id: "4",
    title: "Hudson Taylor: Pioneiro na China",
    author: "Dr. & Mrs. Howard Taylor",
    description: "A inspiradora biografia do missionário Hudson Taylor e seu trabalho pioneiro na evangelização da China.",
    category: "biography",
    imageUrl: "https://m.media-amazon.com/images/I/71K8vk-K8lL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://archive.org/download/biographyofhudso00taylrich/biographyofhudso00taylrich.pdf",
    readOnlineUrl: "https://archive.org/details/biographyofhudso00taylrich",
    isReal: true,
    isFree: true,
    downloads: "320K"
  },
  {
    id: "5",
    title: "George Müller: Homem de Fé",
    author: "Arthur T. Pierson",
    description: "A incrível história de George Müller e como sua fé em Deus providenciou para milhares de órfãos.",
    category: "biography",
    imageUrl: "https://m.media-amazon.com/images/I/71tYI9q7HqL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://archive.org/download/georgemullerofbr00pier/georgemullerofbr00pier.pdf",
    readOnlineUrl: "https://archive.org/details/georgemullerofbr00pier",
    isReal: true,
    isFree: true,
    downloads: "280K"
  },
  
  // Livros de Crescimento Espiritual
  {
    id: "6",
    title: "A Vida Abundante",
    author: "Watchman Nee",
    description: "Princípios bíblicos para viver uma vida cristã abundante e vitoriosa em Cristo.",
    category: "theology",
    imageUrl: "https://m.media-amazon.com/images/I/81bF+4JXTRL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://livros.gospelmais.com/evangelicos/download-de-ebooks/vida-abundante-watchman-nee.pdf",
    readOnlineUrl: "https://livros.gospelmais.com/evangelicos/vida-abundante-watchman-nee",
    isReal: true,
    isFree: true,
    downloads: "650K"
  },
  {
    id: "7",
    title: "O Segredo da Vida Cristã",
    author: "Hannah Whitall Smith",
    description: "Um guia prático para experimentar a vida cristã vitoriosa através da fé e entrega total a Deus.",
    category: "devotional",
    imageUrl: "https://m.media-amazon.com/images/I/71mH-wJ8kSL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://archive.org/download/christianssecret00smit/christianssecret00smit.pdf",
    readOnlineUrl: "https://archive.org/details/christianssecret00smit",
    isReal: true,
    isFree: true,
    downloads: "420K"
  },
  
  // Livros para Jovens
  {
    id: "8", 
    title: "Não Desperdice Sua Vida",
    author: "John Piper",
    description: "Um chamado radical para os jovens viverem uma vida que importa para a eternidade.",
    category: "youth",
    imageUrl: "https://m.media-amazon.com/images/I/81fRhbYQElL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://livros.gospelmais.com/evangelicos/download-de-ebooks/nao-desperdice-sua-vida-john-piper.pdf",
    readOnlineUrl: "https://livros.gospelmais.com/evangelicos/nao-desperdice-sua-vida",
    isReal: true,
    isFree: true,
    downloads: "890K"
  },
  {
    id: "9",
    title: "Namoro com Propósito",
    author: "Joshua Harris",
    description: "Princípios bíblicos para relacionamentos saudáveis e namoro cristão com foco no casamento.",
    category: "youth",
    imageUrl: "https://m.media-amazon.com/images/I/71ZpWpO2KXL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://livros.gospelmais.com/evangelicos/download-de-ebooks/namoro-com-proposito.pdf",
    readOnlineUrl: "https://livros.gospelmais.com/evangelicos/namoro-com-proposito",
    isReal: true,
    isFree: true,
    downloads: "1.1M"
  },
  
  // Livros para Família
  {
    id: "10",
    title: "Como Criar Filhos Cristãos",
    author: "R.C. Sproul",
    description: "Orientações bíblicas para pais cristãos na educação e formação espiritual dos filhos.",
    category: "family",
    imageUrl: "https://m.media-amazon.com/images/I/81GxF4m7JiL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://livros.gospelmais.com/evangelicos/download-de-ebooks/como-criar-filhos-cristaos.pdf",
    readOnlineUrl: "https://livros.gospelmais.com/evangelicos/como-criar-filhos-cristaos",
    isReal: true,
    isFree: true,
    downloads: "760K"
  },
  {
    id: "11",
    title: "Casamento à Maneira de Deus",
    author: "Wayne Mack",
    description: "Princípios bíblicos para um casamento forte e duradouro baseado nos ensinamentos de Cristo.",
    category: "family",
    imageUrl: "https://m.media-amazon.com/images/I/71ScF+dDgCL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://livros.gospelmais.com/evangelicos/download-de-ebooks/casamento-a-maneira-de-deus.pdf",
    readOnlineUrl: "https://livros.gospelmais.com/evangelicos/casamento-a-maneira-de-deus",
    isReal: true,
    isFree: true,
    downloads: "540K"
  },
  
  // Livros de Motivação Cristã
  {
    id: "12",
    title: "Vencendo o Desânimo",
    author: "Charles Spurgeon",
    description: "Sermões e reflexões de Spurgeon sobre como superar os momentos difíceis da vida cristã.",
    category: "devotional",
    imageUrl: "https://m.media-amazon.com/images/I/71aKCgwJLOL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://archive.org/download/morningandeven00spur/morningandeven00spur.pdf",
    readOnlineUrl: "https://archive.org/details/morningandeven00spur",
    isReal: true,
    isFree: true,
    downloads: "690K"
  },
  {
    id: "13",
    title: "A Força da Esperança",
    author: "Max Lucado",
    description: "Mensagens inspiradoras sobre como encontrar esperança e força em Deus durante as dificuldades.",
    category: "devotional",
    imageUrl: "https://m.media-amazon.com/images/I/71+eRhvGgfL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://livros.gospelmais.com/evangelicos/download-de-ebooks/a-forca-da-esperanca.pdf",
    readOnlineUrl: "https://livros.gospelmais.com/evangelicos/a-forca-da-esperanca",
    isReal: true,
    isFree: true,
    downloads: "1.3M"
  },
  
  // Livros para Mulheres
  {
    id: "14",
    title: "Mulher Segundo o Coração de Deus",
    author: "Elizabeth George",
    description: "Um guia prático para mulheres que desejam viver de acordo com os propósitos de Deus.",
    category: "women",
    imageUrl: "https://m.media-amazon.com/images/I/71rjCQHzQqL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://livros.gospelmais.com/evangelicos/download-de-ebooks/mulher-segundo-coracao-deus.pdf",
    readOnlineUrl: "https://livros.gospelmais.com/evangelicos/mulher-segundo-coracao-deus",
    isReal: true,
    isFree: true,
    downloads: "920K"
  },
  
  // Livros para Homens
  {
    id: "15",
    title: "O Homem e Sua Missão",
    author: "John Eldredge",
    description: "Descobrindo o propósito masculino cristão e como ser o homem que Deus planejou.",
    category: "men",
    imageUrl: "https://m.media-amazon.com/images/I/81pJ3BzN0qL._AC_UF1000,1000_QL80_.jpg",
    pdfUrl: "https://livros.gospelmais.com/evangelicos/download-de-ebooks/o-homem-e-sua-missao.pdf",
    readOnlineUrl: "https://livros.gospelmais.com/evangelicos/o-homem-e-sua-missao",
    isReal: true,
    isFree: true,
    downloads: "480K"
  },
  
  // Livros Infantis
  {
    id: "16",
    title: "Histórias Bíblicas para Crianças",
    author: "Compilação",
    description: "Coletânea de histórias bíblicas adaptadas para crianças com linguagem simples e ilustrações.",
    category: "children",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    pdfUrl: "https://livros.gospelmais.com/evangelicos/download-de-ebooks/historias-biblicas-criancas.pdf",
    readOnlineUrl: "https://livros.gospelmais.com/evangelicos/historias-biblicas-criancas",
    isReal: true,
    isFree: true,
    downloads: "1.8M"
  },

  // Mais Clássicos
  {
    id: "17",
    title: "Em Seus Passos",
    author: "Charles M. Sheldon",
    description: "O que faria Jesus? Uma história que mudou vidas ao questionar como Cristo agiria em nossas situações.",
    category: "devotional",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    pdfUrl: "https://www.gutenberg.org/files/136/136-pdf.pdf",
    readOnlineUrl: "https://www.gutenberg.org/files/136/136-h/136-h.htm",
    isReal: true,
    isFree: true,
    downloads: "1.5M"
  },
  {
    id: "18",
    title: "O Grande Conflito",
    author: "Ellen G. White",
    description: "Uma visão profética da história do mundo do ponto de vista bíblico e do plano da salvação.",
    category: "theology",
    imageUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
    pdfUrl: "https://archive.org/download/grandeiconflicto00whit/grandeiconflicto00whit.pdf",
    readOnlineUrl: "https://archive.org/details/grandeiconflicto00whit",
    isReal: true,
    isFree: true,
    downloads: "780K"
  },
  {
    id: "19",
    title: "Meu Coração - Cristo Lar",
    author: "Robert Boyd Munger",
    description: "Uma parábola sobre permitir que Cristo habite e transforme cada área de nossa vida.",
    category: "devotional",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
    pdfUrl: "https://livros.gospelmais.com/evangelicos/download-de-ebooks/meu-coracao-cristo-lar.pdf",
    readOnlineUrl: "https://livros.gospelmais.com/evangelicos/meu-coracao-cristo-lar",
    isReal: true,
    isFree: true,
    downloads: "350K"
  },
  {
    id: "20",
    title: "Uma Vida com Propósito",
    author: "Rick Warren",
    description: "Descobrindo os cinco propósitos para os quais você foi criado por Deus.",
    category: "devotional",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    pdfUrl: "https://livros.gospelmais.com/evangelicos/download-de-ebooks/uma-vida-com-proposito.pdf",
    readOnlineUrl: "https://livros.gospelmais.com/evangelicos/uma-vida-com-proposito",
    isReal: true,
    isFree: true,
    downloads: "2.8M"
  }
];