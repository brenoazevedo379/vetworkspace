import { NextResponse } from 'next/server'

interface ChatMsg {
  sender: 'user' | 'ai'
  text: string
}

interface IncomingImage {
  name?: string
  mimeType?: string
  dataUrl?: string
}

interface GeminiPart {
  text?: string
  inline_data?: {
    mime_type: string
    data: string
  }
}

interface GeminiContent {
  role: 'user' | 'model'
  parts: GeminiPart[]
}

const DEFAULT_MODEL = 'gemini-2.0-flash'
const MAX_INLINE_IMAGE_BYTES = 8 * 1024 * 1024

function parseImageDataUrl(dataUrl?: string, fallbackMimeType?: string) {
  if (!dataUrl || typeof dataUrl !== 'string') return null

  const match = dataUrl.match(/^data:([^;,]+);base64,(.+)$/)
  if (!match) return null

  const mimeType = (match[1] || fallbackMimeType || 'image/jpeg').toLowerCase()
  const base64 = match[2]

  if (!mimeType.startsWith('image/')) return null

  const estimatedBytes = Math.ceil((base64.length * 3) / 4)
  if (estimatedBytes > MAX_INLINE_IMAGE_BYTES) {
    throw new Error('IMAGE_TOO_LARGE')
  }

  return {
    mimeType,
    base64,
  }
}

function buildGeminiContents(
  messages: ChatMsg[],
  imageData?: { mimeType: string; base64: string } | null
): GeminiContent[] {
  const contents: GeminiContent[] = messages.map((message) => ({
    role: message.sender === 'user' ? 'user' : 'model',
    parts: [{ text: message.text }],
  }))

  if (!imageData) return contents

  // A imagem pertence à solicitação atual. Ela é anexada à última mensagem do usuário,
  // preservando o restante do histórico apenas como texto.
  let lastUserIndex = -1

  for (let i = contents.length - 1; i >= 0; i -= 1) {
    if (contents[i].role === 'user') {
      lastUserIndex = i
      break
    }
  }

  if (lastUserIndex === -1) {
    contents.push({
      role: 'user',
      parts: [
        { text: 'Analise esta imagem no contexto clínico fornecido.' },
        {
          inline_data: {
            mime_type: imageData.mimeType,
            data: imageData.base64,
          },
        },
      ],
    })

    return contents
  }

  contents[lastUserIndex] = {
    ...contents[lastUserIndex],
    parts: [
      ...contents[lastUserIndex].parts,
      {
        inline_data: {
          mime_type: imageData.mimeType,
          data: imageData.base64,
        },
      },
    ],
  }

  return contents
}

async function callGeminiAPI(
  apiKey: string,
  messages: ChatMsg[],
  imageData?: { mimeType: string; base64: string } | null,
  retries = 2,
  delayMs = 2200
): Promise<Response> {
  const contents = buildGeminiContents(messages, imageData)

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL

  for (let i = 0; i <= retries; i += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45_000)

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [
                {
                  text: [
                    'Você é um copiloto clínico veterinário e assistente técnico da Dra. Beatriz Contreiras.',
                    'Responda em português do Brasil, com linguagem técnica, precisa, fundamentada, prática e sem inventar dados ausentes.',
                    'Mantenha o contexto das mensagens anteriores.',
                    'Quando houver imagem, descreva primeiro o que está efetivamente visível e depois apresente a interpretação clínica possível.',
                    'Diferencie observação visual de hipótese diagnóstica.',
                    'Não invente texto ilegível, resultados laboratoriais, medidas, estruturas, doses, diagnósticos ou achados que não possam ser sustentados pela imagem ou pelo contexto.',
                    'Se a imagem estiver desfocada, cortada, escura, ilegível ou insuficiente, informe a limitação explicitamente.',
                    'Para imagens clínicas, exames ou lesões, priorize achados relevantes, diferenciais razoáveis, sinais de alerta e próximos passos que a veterinária possa considerar.',
                    'Não substitua julgamento clínico, exame físico, laudos oficiais ou avaliação presencial.',
                  ].join(' '),
                },
              ],
            },
            generationConfig: {
              temperature: 0.25,
              topP: 0.9,
              maxOutputTokens: 1800,
            },
          }),
        }
      )

      if (response.status === 429 && i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)))
        continue
      }

      if (response.status >= 500 && i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)))
        continue
      }

      return response
    } finally {
      clearTimeout(timeout)
    }
  }

  throw new Error('Limite de requisições atingido. Tente novamente em instantes.')
}

function extractGeminiReply(data: any) {
  const parts = data?.candidates?.[0]?.content?.parts

  if (!Array.isArray(parts)) return ''

  return parts
    .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
    .filter(Boolean)
    .join('\n')
    .trim()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      prompt,
      messages,
      image,
      imageDataUrl,
      imageMimeType,
    }: {
      prompt?: string
      messages?: ChatMsg[]
      image?: IncomingImage | null
      imageDataUrl?: string | null
      imageMimeType?: string | null
    } = body

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Chave de API não configurada. Adicione GEMINI_API_KEY nas variáveis de ambiente da Vercel.',
        },
        { status: 500 }
      )
    }

    let chatHistory: ChatMsg[] = []

    if (Array.isArray(messages) && messages.length > 0) {
      chatHistory = messages.filter(
        (message): message is ChatMsg =>
          Boolean(
            message &&
              (message.sender === 'user' || message.sender === 'ai') &&
              typeof message.text === 'string'
          )
      )
    } else if (typeof prompt === 'string' && prompt.trim()) {
      chatHistory = [{ sender: 'user', text: prompt.trim() }]
    }

    const rawImageDataUrl =
      (typeof image?.dataUrl === 'string' && image.dataUrl) ||
      (typeof imageDataUrl === 'string' && imageDataUrl) ||
      ''

    const rawMimeType =
      (typeof image?.mimeType === 'string' && image.mimeType) ||
      (typeof imageMimeType === 'string' && imageMimeType) ||
      undefined

    let parsedImage: { mimeType: string; base64: string } | null = null

    if (rawImageDataUrl) {
      try {
        parsedImage = parseImageDataUrl(rawImageDataUrl, rawMimeType)
      } catch (error) {
        if (error instanceof Error && error.message === 'IMAGE_TOO_LARGE') {
          return NextResponse.json(
            {
              error:
                'A imagem ficou grande demais para ser enviada à IA. Tente uma foto menor ou recortada.',
            },
            { status: 413 }
          )
        }

        throw error
      }

      if (!parsedImage) {
        return NextResponse.json(
          {
            error:
              'A imagem enviada não está em um formato válido. Use JPG, PNG, WEBP ou outro formato de imagem compatível.',
          },
          { status: 415 }
        )
      }
    }

    if (chatHistory.length === 0 && !parsedImage) {
      return NextResponse.json(
        { error: 'Nenhuma mensagem ou imagem foi enviada.' },
        { status: 400 }
      )
    }

    if (chatHistory.length === 0 && parsedImage) {
      chatHistory = [
        {
          sender: 'user',
          text: 'Analise esta imagem e descreva os achados relevantes para o caso clínico.',
        },
      ]
    }

    // Limita o histórico para reduzir latência e tamanho da requisição.
    const recentHistory = chatHistory.slice(-16)

    const response = await callGeminiAPI(apiKey, recentHistory, parsedImage)

    const rawResponse = await response.text()

    let data: any = {}
    if (rawResponse) {
      try {
        data = JSON.parse(rawResponse)
      } catch {
        data = { rawText: rawResponse }
      }
    }

    if (!response.ok) {
      console.error('Gemini API error:', response.status, data)

      if (response.status === 400) {
        return NextResponse.json(
          {
            error:
              data?.error?.message ||
              'A IA recusou a requisição. Confira o formato da imagem e tente novamente.',
          },
          { status: 400 }
        )
      }

      if (response.status === 404) {
        return NextResponse.json(
          {
            error:
              'O modelo configurado para o Copiloto não foi encontrado. Verifique GEMINI_MODEL na Vercel.',
          },
          { status: 500 }
        )
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              '⏱️ O serviço de IA atingiu um limite temporário. Aguarde alguns segundos e tente novamente.',
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            `A API Gemini retornou erro ${response.status}. Tente novamente.`,
        },
        { status: response.status >= 500 ? 503 : response.status }
      )
    }

    const reply = extractGeminiReply(data)

    if (!reply) {
      const finishReason = data?.candidates?.[0]?.finishReason

      return NextResponse.json(
        {
          error: finishReason
            ? `A IA encerrou a resposta sem texto utilizável (${finishReason}).`
            : 'A IA respondeu, mas não retornou texto utilizável.',
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      reply,
      analyzedImage: Boolean(parsedImage),
    })
  } catch (error: any) {
    console.error('Erro na rota /api/vet:', error)

    if (error?.name === 'AbortError') {
      return NextResponse.json(
        { error: 'A IA demorou demais para responder. Tente novamente.' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      {
        error:
          'Erro ao conectar com a IA: ' +
          (error instanceof Error ? error.message : 'Tente novamente.'),
      },
      { status: 500 }
    )
  }
}
