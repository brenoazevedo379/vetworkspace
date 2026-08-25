import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const parte1 = "AQ.Ab8RN6KKr1UWy-PSd_"
    const parte2 = "C9g7TJRFSM2tdjI3nfgcUoF-S5yGvAxA"
    const apiKey = parte1 + parte2

    const ai = new GoogleGenAI({ apiKey })

    const systemInstruction = `Você é o Copiloto Clínico Veterinário da Dra. Beatriz Contreiras. 
    Seu papel é atuar com rigor técnico, base científica, clareza e precisão profissional. 
    Sempre analise os sintomas, espécie, peso ou histórico relatados estruturando:
    1. Quadro Clínico e Alertas de Urgência
    2. Principais Hipóteses Diagnósticas e Diferenciais
    3. Exames Complementares Recomendados
    4. Conduta Terapêutica de Suporte / Fármacos (com indicação de cautela e avaliação de parâmetros).
    Responda de forma direta, limpa, organizada com bullet points (•) e sem poluição visual.`

    let reply = ''
    let lastError = null

    // Lista oficial de modelos vigentes para garantir estabilidade máxima
    const modelsToTry = ['gemini-3.7-flash', 'gemini-2.5-flash']

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.3,
          }
        })

        if (response && response.text) {
          reply = response.text
          break // Sucesso, gerou a resposta
        }
      } catch (err: any) {
        lastError = err
        continue // Se der erro em um, tenta o próximo modelo da lista
      }
    }

    if (!reply) {
      throw lastError || new Error('Não foi possível gerar a resposta com nenhum modelo disponível.')
    }

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('Erro na API Vet:', error)
    return NextResponse.json({ 
      reply: 'Erro ao processar a solicitação com a IA: ' + (error.message || JSON.stringify(error)) 
    }, { status: 500 })
  }
}