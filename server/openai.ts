import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEmotionDevotional(emotion: string): Promise<{
  title: string;
  content: string;
  verse: string;
  reference: string;
  prayer: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um pastor cristão experiente que cria devocionais personalizados. Responda sempre em português brasileiro com uma abordagem bíblica sólida e carinhosa."
        },
        {
          role: "user",
          content: `Crie um devocional completo para uma pessoa que está se sentindo ${emotion}. O devocional deve incluir:
          - Um título inspirador
          - Um conteúdo devocional de 2-3 parágrafos com reflexão bíblica
          - Um versículo bíblico relevante
          - A referência bíblica do versículo
          - Uma oração pessoal relacionada ao sentimento
          
          Responda em formato JSON com as chaves: title, content, verse, reference, prayer`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating emotion devotional:", error);
    throw new Error("Falha ao gerar devocional. Tente novamente.");
  }
}

export async function generatePrayerResponse(userMessage: string): Promise<{
  prayer: string;
  verse: string;
  reference: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um conselheiro cristão amoroso que responde a pedidos de oração. Sempre responda em português brasileiro com compaixão e base bíblica."
        },
        {
          role: "user",
          content: `A pessoa está compartilhando: "${userMessage}"
          
          Por favor, responda com:
          - Uma oração personalizada e carinhosa para a situação
          - Um versículo bíblico de encorajamento
          - A referência bíblica do versículo
          
          Responda em formato JSON com as chaves: prayer, verse, reference`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating prayer response:", error);
    throw new Error("Falha ao gerar resposta de oração. Tente novamente.");
  }
}

export async function generatePrayerRequestResponse(subject: string, content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um pastor que responde a pedidos de oração com amor e sabedoria bíblica. Sempre responda em português brasileiro."
        },
        {
          role: "user",
          content: `Alguém enviou este pedido de oração:
          Assunto: ${subject}
          Conteúdo: ${content}
          
          Escreva uma resposta pastoral carinhosa e encorajadora, incluindo uma oração específica para a situação e um versículo bíblico relevante.`
        }
      ],
      temperature: 0.8,
    });

    return response.choices[0].message.content || "Que Deus abençoe e console seu coração neste momento.";
  } catch (error) {
    console.error("Error generating prayer request response:", error);
    throw new Error("Falha ao gerar resposta. Tente novamente.");
  }
}

export async function generateSponsorCertificate(sponsorName: string): Promise<{
  message: string;
  verse: string;
  reference: string;
  prayer: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você cria certificados cristãos de agradecimento para patrocinadores. Sempre responda em português brasileiro com gratidão e bênçãos."
        },
        {
          role: "user",
          content: `Crie um certificado de agradecimento para o patrocinador "${sponsorName}" que apoia o aplicativo cristão "Fé em Jesus BR". Inclua:
          - Uma mensagem de agradecimento inspiradora
          - Um versículo sobre generosidade ou bênçãos
          - A referência bíblica
          - Uma oração de bênção para o patrocinador
          
          Responda em formato JSON com as chaves: message, verse, reference, prayer`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating sponsor certificate:", error);
    throw new Error("Falha ao gerar certificado. Tente novamente.");
  }
}

export async function generateContributorCertificate(contributorName: string, contributionType: string, amount?: string): Promise<{
  prayer: string;
  verse: string;
  reference: string;
  title: string;
  certificateText: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "Você é um especialista em criar certificados de agradecimento cristãos personalizados para colaboradores de ministérios. Crie conteúdo exclusivo, carinhoso e bíblico em português brasileiro."
        },
        {
          role: "user",
          content: `Crie um certificado de agradecimento para o colaborador:
          Nome: ${contributorName}
          Tipo de contribuição: ${contributionType}
          ${amount ? `Valor: ${amount}` : ''}
          
          O certificado deve incluir:
          - Uma oração exclusiva de agradecimento e bênção para a pessoa
          - Um versículo bíblico apropriado sobre generosidade/servir ao próximo
          - Um título elegante para o certificado
          - Um texto principal do certificado expressando gratidão pela contribuição
          
          Responda em formato JSON com as chaves: prayer, verse, reference, title, certificateText`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating contributor certificate:", error);
    throw new Error("Falha ao gerar certificado de colaborador.");
  }
}

export async function generateExclusivePrayerAndVerse(recipientName: string, recipientType: 'sponsor' | 'contributor', context?: string): Promise<{
  prayer: string;
  verse: string;
  reference: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "Você é um pastor experiente que cria orações exclusivas e seleciona versículos bíblicos personalizados para pessoas que apoiam ministérios cristãos. Sempre em português brasileiro."
        },
        {
          role: "user",
          content: `Crie uma oração exclusiva e selecione um versículo bíblico para:
          Nome: ${recipientName}
          Tipo: ${recipientType === 'sponsor' ? 'Patrocinador/Empresa' : 'Colaborador/Contribuinte'}
          ${context ? `Contexto adicional: ${context}` : ''}
          
          A oração deve ser:
          - Pessoal e exclusiva para esta pessoa/empresa
          - Cheia de bênçãos e gratidão
          - Apropriada para quem apoia o trabalho de Deus
          
          O versículo deve ser:
          - Relevante para generosidade, parceria no evangelho ou bênçãos
          - Encorajador e edificante
          
          Responda em formato JSON com as chaves: prayer, verse, reference`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating exclusive prayer and verse:", error);
    throw new Error("Falha ao gerar oração e versículo exclusivos.");
  }
}

export async function generateChallengeCertificate(userName: string, challengeTitle: string): Promise<{
  message: string;
  verse: string;
  reference: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você cria certificados cristãos de conclusão de desafios espirituais. Sempre responda em português brasileiro com encorajamento."
        },
        {
          role: "user",
          content: `Crie um certificado de conclusão para ${userName} que completou o desafio "${challengeTitle}". Inclua:
          - Uma mensagem parabenizando pela dedicação espiritual
          - Um versículo sobre perseverança na fé
          - A referência bíblica
          
          Responda em formato JSON com as chaves: message, verse, reference`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating challenge certificate:", error);
    throw new Error("Falha ao gerar certificado. Tente novamente.");
  }
}

export async function generateNightDevotional(): Promise<{
  title: string;
  content: string;
  verse: string;
  reference: string;
  prayer: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você cria devocionais noturnos especiais para o 'Modo Noite com Deus'. Foque em paz, descanso e entrega a Deus. Sempre responda em português brasileiro."
        },
        {
          role: "user",
          content: `Crie um devocional noturno especial para o final do dia. Deve transmitir paz, gratidão e confiança em Deus. Inclua:
          - Um título suave e reconfortante
          - Conteúdo devocional focado em descanso e entrega a Deus
          - Um versículo sobre paz ou proteção divina
          - A referência bíblica
          - Uma oração noturna de gratidão e entrega
          
          Responda em formato JSON com as chaves: title, content, verse, reference, prayer`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating night devotional:", error);
    throw new Error("Falha ao gerar devocional noturno. Tente novamente.");
  }
}

// Generate Daily Devotional for Users
export async function generateDailyDevotional(userId: string): Promise<{
  title: string;
  content: string;
  verse: string;
  reference: string;
  application: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `Você é um pastor e escritor cristão brasileiro experiente. Crie um devocional diário em português brasileiro para fortalecer a fé e inspirar crescimento espiritual. O devocional deve ser:
          
          1. Pessoal e tocante, falando diretamente ao coração
          2. Baseado em verdades bíblicas sólidas
          3. Prático com aplicação para o dia a dia
          4. Cheio de esperança e encorajamento
          5. Adequado para qualquer idade ou fase da vida cristã
          
          Responda em JSON com este formato exato:
          {
            "title": "Título inspirador para o devocional",
            "content": "Texto principal do devocional (3-4 parágrafos)",
            "verse": "Versículo bíblico relevante",
            "reference": "Referência bíblica (ex: João 3:16)",
            "application": "Aplicação prática para hoje"
          }`
        },
        {
          role: "user",
          content: "Gere um devocional diário inspirador e edificante para hoje."
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      title: result.title || "Palavra de Deus para Hoje",
      content: result.content || "Deus tem uma palavra especial para você hoje.",
      verse: result.verse || "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
      reference: result.reference || "Jeremias 29:11",
      application: result.application || "Confie nos planos de Deus para sua vida hoje."
    };
  } catch (error) {
    console.error("Error generating daily devotional:", error);
    // Fallback devotional
    return {
      title: "Confiança em Deus",
      content: "Hoje é um novo dia que o Senhor preparou para você. Independentemente dos desafios que possa enfrentar, lembre-se de que Deus está no controle de todas as coisas. Ele conhece cada detalhe da sua vida e tem um plano perfeito para você. Quando as dificuldades surgirem, não se desespere, mas confie no amor infinito do seu Criador.",
      verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
      reference: "Jeremias 29:11",
      application: "Hoje, a cada decisão que tomar, lembre-se de buscar a direção de Deus em oração. Confie que Ele está guiando seus passos."
    };
  }
}

// Generate Personalized Prayer
export async function generatePersonalizedPrayer(userMessage: string): Promise<{
  prayer: string;
  verse: string;
  reference: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `Você é um pastor cristão brasileiro compassivo e sábio. Baseado na mensagem do usuário, crie uma oração personalizada e um versículo bíblico de apoio em português brasileiro.

          A oração deve:
          1. Ser calorosa e pessoal, falando diretamente com Deus
          2. Abordar especificamente os sentimentos e situações mencionados
          3. Pedir sabedoria, força e direção divina
          4. Incluir gratidão e esperança
          5. Ser escrita em uma linguagem acolhedora e de fé

          Responda em JSON com este formato exato:
          {
            "prayer": "Oração personalizada baseada na mensagem do usuário",
            "verse": "Versículo bíblico relevante à situação",
            "reference": "Referência bíblica"
          }`
        },
        {
          role: "user",
          content: `Por favor, crie uma oração personalizada para esta situação: ${userMessage}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      prayer: result.prayer || "Pai celestial, venho diante de Ti com um coração que busca Tua presença. Obrigado por me ouvir e por estar sempre comigo. Concede-me sabedoria e força para enfrentar este dia. Em nome de Jesus, amém.",
      verse: result.verse || "Não andeis ansiosos por coisa alguma; antes, em tudo, sejam conhecidas, diante de Deus, as vossas petições, pela oração e pela súplica, com ações de graças.",
      reference: result.reference || "Filipenses 4:6"
    };
  } catch (error) {
    console.error("Error generating personalized prayer:", error);
    return {
      prayer: "Pai celestial, venho diante de Ti com um coração que busca Tua presença e direção. Tu conheces cada detalhe da minha vida e cada necessidade do meu coração. Peço que me concedas paz em meio às tempestades e sabedoria para tomar as decisões certas. Ajuda-me a confiar em Teus planos, mesmo quando não compreendo o caminho. Que Tua vontade seja feita em minha vida, e que eu possa ser um instrumento de Teu amor para outros. Obrigado por Teu amor incondicional e por nunca me abandonar. Em nome de Jesus, amém.",
      verse: "Não andeis ansiosos por coisa alguma; antes, em tudo, sejam conhecidas, diante de Deus, as vossas petições, pela oração e pela súplica, com ações de graças.",
      reference: "Filipenses 4:6"
    };
  }
}