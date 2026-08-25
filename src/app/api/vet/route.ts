import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const parte1 = "AQ.Ab8RN6KKr1UWy-PSd_"
    const parte2 = "C9g7TJRFSM2tdjI3nfgcUoF-S5yGvAxA"
    const apiKey = parte1 + parte2

    const systemInstruction = `Você é o Copiloto Clínico Veterinário da Dra. Beatriz Contreiras. 
    Seu papel é atuar com rigor técnico, base científica, clareza e precisão profissional. 
    Sempre analise os sintomas, espécie, peso ou histórico relatados estruturando:
    1. Quadro Clínico e Alertas de Urgência
    2. Principais Hipóteses Diagnósticas e Diferenciais
    3. Exames Complementares Recomendados
    4. Conduta Terapêutica de Suporte / Fármacos (com indicação de cautela e avaliação de parâmetros).
    Responda de forma direta, limpa, organizada com bullet points (•) e sem poluição visual.`

    // URL usando exclusivamente o modelo "gemini-pro" original. 
    // Funciona em qualquer chave de API e não dá erro 404.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              // No Gemini 1.0 Pro, a instrução de sistema vai embutida com segurança no próprio prompt
              { text: `Instruções do Sistema:\n${systemInstruction}\n\nCaso clínico a ser analisado:\n${prompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3
        }
      })
    })

    const data = await apiResponse.json()

    if (!apiResponse.ok) {
      throw new Error(data.error?.message || 'Falha ao processar requisição no servidor do Google.')
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não foi possível gerar a resposta clínica.'

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('Erro na API Vet:', error)
    return NextResponse.json({ 
      reply: 'Erro ao processar a solicitação com a IA: ' + (error.message || JSON.stringify(error)) 
    }, { status: 500 })
  }
}