// Teste rápido das funcionalidades de IA
const { generateAssistantResponse, generateEmotionalGuidance, generatePrayerResponse } = require('./advanced-ai-service');

async function testAI() {
  console.log('🤖 Testando sistema de IA...\n');
  
  // Teste 1: Resposta assistente
  console.log('📝 Teste 1: Assistente IA Cristo');
  const response1 = await generateAssistantResponse('Estou passando por dificuldades financeiras');
  console.log('Resposta:', response1.response);
  console.log('Versículo:', response1.verse);
  console.log('Referência:', response1.reference);
  console.log('Oração:', response1.prayer);
  console.log('\n---\n');
  
  // Teste 2: Orientação emocional
  console.log('😢 Teste 2: Orientação emocional');
  const response2 = await generateEmotionalGuidance('ansioso', 7, 'sobre meu futuro');
  console.log('Resposta:', response2.response);
  console.log('Versículo:', response2.verse);
  console.log('Referência:', response2.reference);
  console.log('Oração:', response2.prayer);
  console.log('\n---\n');
  
  // Teste 3: Resposta de oração
  console.log('🙏 Teste 3: Resposta de oração');
  const response3 = await generatePrayerResponse('Preciso de sabedoria para tomar uma decisão importante');
  console.log('Resposta:', response3.response);
  console.log('Versículo:', response3.verse);
  console.log('Referência:', response3.reference);
  console.log('Oração:', response3.prayer);
  
  console.log('\n✅ Todos os testes concluídos com sucesso!');
}

testAI().catch(console.error);