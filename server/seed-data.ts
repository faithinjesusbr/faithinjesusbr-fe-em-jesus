import { storage } from "./storage";

export async function seedDatabase() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");
    
    // Seed Bible Verses
    const verses = [
      {
        text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
        reference: "João 3:16",
        book: "João",
        chapter: "3",
        verse: "16"
      },
      {
        text: "Tudo posso naquele que me fortalece.",
        reference: "Filipenses 4:13",
        book: "Filipenses",
        chapter: "4",
        verse: "13"
      },
      {
        text: "O Senhor é meu pastor, nada me faltará.",
        reference: "Salmos 23:1",
        book: "Salmos", 
        chapter: "23",
        verse: "1"
      },
      {
        text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
        reference: "Jeremias 29:11",
        book: "Jeremias",
        chapter: "29",
        verse: "11"
      },
      {
        text: "Não andeis ansiosos por coisa alguma; antes, em tudo, sejam conhecidas, diante de Deus, as vossas petições, pela oração e pela súplica, com ações de graças.",
        reference: "Filipenses 4:6",
        book: "Filipenses",
        chapter: "4",
        verse: "6"
      }
    ];

    for (const verse of verses) {
      try {
        await storage.createVerse(verse);
      } catch (error) {
        // Verse may already exist, skip
      }
    }

    // Seed Daily Devotionals
    const devotionals = [
      {
        id: "1",
        title: "Confiança em Deus",
        content: "Hoje é um novo dia que o Senhor preparou para você. Independentemente dos desafios que possa enfrentar, lembre-se de que Deus está no controle de todas as coisas. Ele conhece cada detalhe da sua vida e tem um plano perfeito para você. Quando as dificuldades surgirem, não se desespere, mas confie no amor infinito do seu Criador.",
        verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
        reference: "Jeremias 29:11",
        date: new Date().toISOString().split('T')[0],
        type: "daily"
      }
    ];

    for (const devotional of devotionals) {
      try {
        await storage.createDevotional(devotional);
      } catch (error) {
        // Devotional may already exist, skip
      }
    }

    // Seed Emotions
    const emotions = [
      { id: "1", name: "Feliz", description: "Sentimentos de alegria e contentamento", color: "#FFD700", icon: "😊" },
      { id: "2", name: "Triste", description: "Momentos de tristeza e melancolia", color: "#4169E1", icon: "😢" },
      { id: "3", name: "Ansioso", description: "Preocupações e ansiedades", color: "#FF6347", icon: "😰" },
      { id: "4", name: "Grato", description: "Sentimentos de gratidão", color: "#32CD32", icon: "🙏" },
      { id: "5", name: "Confuso", description: "Momentos de dúvida e confusão", color: "#9370DB", icon: "🤔" }
    ];

    for (const emotion of emotions) {
      try {
        await storage.createEmotion(emotion);
      } catch (error) {
        // Emotion may already exist, skip
      }
    }

    // Seed Challenges
    const challenges = [
      {
        title: "7 Dias com Jesus",
        description: "Uma semana de crescimento espiritual",
        duration: "7"
      },
      {
        title: "21 Dias de Oração",
        description: "Transforme sua vida através da oração",
        duration: "21"
      }
    ];

    for (const challenge of challenges) {
      try {
        await storage.createChallenge(challenge);
      } catch (error) {
        // Challenge may already exist, skip
      }
    }

    console.log("✅ Seed do banco de dados concluído com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
  }
}