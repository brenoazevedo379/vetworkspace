import { NextResponse } from 'next/server'

interface ChatMsg {
  sender: 'user' | 'ai'
  text: string
}

async function callGeminiAPI(apiKey: string, messages: ChatMsg[], retries = 2, delayMs = 2500): Promise<Response> {
  const contents = messages.map((m) => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }))

  for (let i = 0; i <= retries; i++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [
              {
                text: 'Você é um copiloto clínico veterinário especializado e assistente técnico da Dra. Beatriz Contreiras. Seja técnico, preciso, fundamentado em evidências, direto, acolhedor e prático. Mantenha o contexto das mensagens anteriores da conversa.'
              }
            ]
          }
        })
      }
    )

    if (response.status === 429 && i < retries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      continue
    }

    return response
  }

  throw new Error('Limite de requisições atingido. Tente novamente em instantes.')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt, messages } = body

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { reply: 'Chave de API não configurada nas variáveis do ambiente (GEMINI_API_KEY).' },
        { status: 200 }
      )
    }

    let chatHistory: ChatMsg[] = []
    if (Array.isArray(messages) && messages.length > 0) {
      chatHistory = messages
    } else if (prompt) {
      chatHistory = [{ sender: 'user', text: prompt }]
    } else {
      return NextResponse.json({ error: 'Nenhuma mensagem enviada.' }, { status: 400 })
    }

    const recentHistory = chatHistory.slice(-20)

    const response = await callGeminiAPI(apiKey, recentHistory)

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: '⏱️ O servidor de IA está processando muitas mensagens. Aguarde 10 segundos e tente novamente.' },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { error: 'A API de IA retornou um erro temporário. Tente novamente.' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não consegui gerar uma resposta.'

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('Erro na rota /api/vet:', error)
    return NextResponse.json(
      { error: 'Erro ao conectar com a IA: ' + (error.message || 'Tente novamente.') },
      { status: 500 }
    )
  }
}