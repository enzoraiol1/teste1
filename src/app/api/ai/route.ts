import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { type, data } = body

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY não configurada. Configure no arquivo .env.local" },
      { status: 503 }
    )
  }

  let prompt = ""

  if (type === "ddx") {
    const { modality, region, findings, age, gender } = data
    prompt = `Você é um radiologista e ortopedista especialista. Com base nos achados abaixo, forneça um diagnóstico diferencial detalhado e estruturado.

DADOS DO CASO:
- Modalidade: ${modality}
- Região anatômica: ${region}
- Paciente: ${age ? `${age} anos` : "Idade não informada"}, ${gender || "Sexo não informado"}
- Achados: ${findings}

Por favor, forneça:
1. **Diagnóstico Diferencial** (liste de 3 a 6 hipóteses, da mais para a menos provável)
   Para cada hipótese inclua:
   - Nome da condição
   - Probabilidade estimada (alta/média/baixa)
   - Achados que apoiam esta hipótese
   - Achados que se espera encontrar adicionalmente

2. **Diagnóstico Mais Provável** com justificativa

3. **Exames Complementares Sugeridos** para confirmar/afastar hipóteses

4. **Pearls Radiológicas** relevantes para este caso

Responda em português, de forma objetiva e clinicamente relevante.`
  } else if (type === "report") {
    const { modality, region, findings } = data
    prompt = `Você é um radiologista especialista em musculoesquelético. Elabore um laudo radiológico estruturado e profissional com base nas seguintes informações:

MODALIDADE: ${modality}
REGIÃO: ${region}
ACHADOS RELATADOS PELO MÉDICO: ${findings}

Estruture o laudo com:
1. **TÉCNICA** (descreva brevemente a técnica de exame)
2. **ACHADOS** (descreva os achados de forma organizada e sistemática, do normal ao patológico)
3. **IMPRESSÃO** (conclusão diagnóstica objetiva)

Use linguagem técnica adequada, termine com sugestões de correlação clínica quando pertinente. Responda em português.`
  } else if (type === "description") {
    const { modality, region, findings } = data
    prompt = `Você é um radiologista especialista. Com base nos achados informados, reescreva uma descrição radiológica estruturada, detalhada e profissional.

Modalidade: ${modality}
Região: ${region}
Achados brutos: ${findings}

Forneça:
1. Uma descrição semiológica completa e padronizada
2. Terminologia técnica apropriada
3. Aspectos que merecem destaque (tamanho, localização, características)

Responda em português.`
  } else if (type === "pearls") {
    const { topic } = data
    prompt = `Você é um especialista em radiologia musculoesquelética e ortopedia. Forneça as principais "pearls" (pontas de diamante clínicas) sobre o tema: ${topic}

Inclua:
1. **Achados patognomônicos** ou muito sugestivos
2. **Armadilhas diagnósticas** (pitfalls) mais comuns
3. **Dicas de técnica** de exame
4. **Correlações clínicas** importantes
5. **Referências bibliográficas** (principais artigos ou livros)

Seja conciso, use bullets e organize de forma didática. Responda em português.`
  } else {
    return NextResponse.json({ error: "Tipo de IA desconhecido" }, { status: 400 })
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""
    return NextResponse.json({ result: text })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
