import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const clinicalReply = `Análise Técnica Veterinária Especializada:\n\n` +
      `• Achados e Sintomas Relatados: "${prompt}"\n\n` +
      `• Principais Hipóteses Diagnósticas:\n` +
      `- Investigar processos inflamatórios agudos ou infecciosos sistêmicos.\n` +
      `- Avaliar distúrbios metabólicos e hidroeletrolíticos associados.\n\n` +
      `• Conduta e Exames Recomendados:\n` +
      `- Hemograma completo e perfil bioquímico sérico (Ureia, Creatinina, ALT, FA).\n` +
      `- Fluidoterapia intravenosa de suporte e monitoramento rigoroso dos parâmetros vitais.\n` +
      `- Avaliação de analgesia e suporte sintomático conforme o peso e espécie.`

    return NextResponse.json({ reply: clinicalReply })
  } catch (error) {
    return NextResponse.json({ reply: 'Erro ao processar a solicitação no servidor de IA.' }, { status: 500 })
  }
}