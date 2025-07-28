import { DatabaseStorage } from "./storage";

const storage = new DatabaseStorage();

// Dados de exemplo para a loja
const sampleProducts = [
  {
    name: "Bíblia de Estudo MacArthur",
    description: "Uma Bíblia completa com notas explicativas e comentários profundos para aprofundar seu estudo bíblico.",
    price: 89.90,
    originalPrice: 119.90,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1544716278-e513176f20a5?w=400",
    affiliateUrl: "https://amzn.to/bible-macarthur",
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 1234,
    discount: 25
  },
  {
    name: "Jesus Freak - Revolucionando sua fé",
    description: "Um livro transformador sobre como viver uma fé radical e autêntica nos dias de hoje.",
    price: 24.90,
    originalPrice: 34.90,
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    affiliateUrl: "https://amzn.to/jesus-freak",
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 567,
    discount: 29
  },
  {
    name: "Colar Cruz Feminino Banhado a Ouro",
    description: "Lindo colar com pingente de cruz, banhado a ouro 18k. Peça delicada e elegante para o dia a dia.",
    price: 49.90,
    originalPrice: 79.90,
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    affiliateUrl: "https://amzn.to/cross-necklace",
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 289,
    discount: 38
  },
  {
    name: "CD Diante do Trono - Águas Purificadoras",
    description: "Álbum de worship com 14 faixas inspiradoras para momentos de adoração e reflexão.",
    price: 19.90,
    originalPrice: 29.90,
    category: "worship",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    affiliateUrl: "https://amzn.to/diante-trono-cd",
    isActive: true,
    isFeatured: false,
    rating: 4.9,
    reviewCount: 892,
    discount: 33
  },
  {
    name: "Quadro Decorativo - Salmo 23",
    description: "Quadro decorativo com o texto do Salmo 23 em design moderno. Perfeito para sala ou quarto.",
    price: 59.90,
    originalPrice: 89.90,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    affiliateUrl: "https://amzn.to/psalm-23-frame",
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 156,
    discount: 33
  },
  {
    name: "Bíblia Infantil Ilustrada",
    description: "Bíblia com histórias adaptadas para crianças, com ilustrações coloridas e linguagem acessível.",
    price: 39.90,
    originalPrice: 54.90,
    category: "kids",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    affiliateUrl: "https://amzn.to/kids-bible",
    isActive: true,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 423,
    discount: 27
  }
];

// Dados de exemplo para vídeos do YouTube
const sampleVideos = [
  {
    youtubeId: "dQw4w9WgXcQ",
    title: "Devocional Matinal - A Força da Oração",
    description: "Começe seu dia com uma reflexão poderosa sobre o poder da oração na vida cristã. Uma mensagem de esperança e fé.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480",
    duration: "PT12M34S",
    publishedAt: new Date("2024-01-15"),
    viewCount: 15420,
    category: "devotional",
    isFeatured: true,
    tags: ["oração", "devocional", "matinal", "fé"]
  },
  {
    youtubeId: "abc123def456",
    title: "Testemunho: Como Deus Transformou Minha Vida",
    description: "Um testemunho emocionante de transformação através do amor de Cristo. História real de superação e fé.",
    thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=480",
    duration: "PT18M45S",
    publishedAt: new Date("2024-01-12"),
    viewCount: 8234,
    category: "testimony",
    isFeatured: false,
    tags: ["testemunho", "transformação", "superação"]
  },
  {
    youtubeId: "xyz789uvw012",
    title: "Momento de Adoração - Quão Grande é o Meu Deus",
    description: "Um momento especial de adoração com a música 'Quão Grande é o Meu Deus'. Prepare seu coração para adorar.",
    thumbnailUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=480",
    duration: "PT8M12S",
    publishedAt: new Date("2024-01-10"),
    viewCount: 23567,
    category: "worship",
    isFeatured: true,
    tags: ["adoração", "louvor", "música cristã"]
  },
  {
    youtubeId: "prayer456def",
    title: "Ensinamento: O Que Jesus Ensinou Sobre Perdão",
    description: "Estudo bíblico profundo sobre o perdão segundo os ensinamentos de Jesus Cristo. Transforme sua vida através do perdão.",
    thumbnailUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=480",
    duration: "PT25M30S",
    publishedAt: new Date("2024-01-08"),
    viewCount: 12890,
    category: "teaching",
    isFeatured: false,
    tags: ["ensinamento", "perdão", "jesus", "estudo bíblico"]
  },
  {
    youtubeId: "live789abc123",
    title: "Culto Especial Ao Vivo - Noite de Milagres",
    description: "Transmissão ao vivo de um culto especial com momentos de oração, adoração e pregação da Palavra. Deus quer fazer milagres!",
    thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=480",
    duration: "PT1H45M12S",
    publishedAt: new Date("2024-01-05"),
    viewCount: 45623,
    category: "live",
    isFeatured: true,
    tags: ["ao vivo", "culto", "milagres", "oração"]
  }
];

export async function seedData() {
  try {
    console.log("🌱 Iniciando seed dos dados de exemplo...");

    // Adicionar produtos da loja
    console.log("📦 Adicionando produtos da loja...");
    for (const product of sampleProducts) {
      try {
        await storage.createStoreProduct(product);
        console.log(`✅ Produto adicionado: ${product.name}`);
      } catch (error) {
        console.log(`⚠️  Produto já existe: ${product.name}`);
      }
    }

    // Adicionar vídeos do YouTube
    console.log("🎥 Adicionando vídeos do YouTube...");
    for (const video of sampleVideos) {
      try {
        await storage.createYoutubeVideo(video);
        console.log(`✅ Vídeo adicionado: ${video.title}`);
      } catch (error) {
        console.log(`⚠️  Vídeo já existe: ${video.title}`);
      }
    }

    console.log("🎉 Seed dos dados concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao fazer seed dos dados:", error);
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedData().then(() => process.exit(0));
}