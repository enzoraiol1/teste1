import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const adapter = new PrismaLibSql({ url: "file:./prisma/dev.db" })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database with sample orthopedic radiology cases...")

  // Sample cases
  const cases = [
    {
      title: "Ruptura completa do LCA com edema ósseo subcondral",
      modality: "rm",
      region: "joelho",
      difficulty: "medio",
      findings: "RM do joelho sem contraste. LCA apresenta descontinuidade completa das fibras na região do côndilo femoral lateral, com sinal aumentado em T2 e ausência do trabeculado normal. Edema ósseo subcondral nas vertentes posterior do planalto tibial lateral (sinal de O'Donoghue) e na face anterior do côndilo femoral lateral (sinal do beijo ou impactação). Menisco lateral com sinal aumentado no corpo sem atingir a superfície articular (grau 2). LCP, menisco medial e compartimento patelofemoral preservados. Derrame articular moderado.",
      diagnosis: "Ruptura completa do LCA. Contusão óssea por impactação (sinal do pivot shift) - achado patognomônico de mecanismo de valgismo-rotação. DDx inclui entorse grave do LCA (sem ruptura completa) - diferenciado pela descontinuidade das fibras na RM.",
      pearls: "Pearl 1: O sinal do 'beijo' (bone bruise) na RM é altamente específico para ruptura do LCA por mecanismo de pivô. Pearl 2: Avaliar sempre estruturas associadas: menisco lateral, LCL e canto posterolateral. Pearl 3: Na radiografia, buscar o sinal de Segond (avulsão da cápsula lateral).",
      tags: JSON.stringify(["lca", "joelho", "ligamento", "esporte", "trauma"]),
      source: "Radiopaedia",
    },
    {
      title: "Lesão de Bankart com Hill-Sachs",
      modality: "rm",
      region: "ombro",
      difficulty: "dificil",
      findings: "RM do ombro sem contraste. Descontinuidade do lábio glenoidal anterior-inferior às 3-6h (lesão de Bankart), com perda da concavidade do lábio e edema ao redor. Impactação da face posterossuperior da cabeça umeral com depressão osteocondral de aproximadamente 1,5 x 0,8 cm (lesão de Hill-Sachs). Capsulolabral complex anterior comprometido. LGU médio e inferior com sinal aumentado em T2. Manguito rotador íntegro. Sem derrame articular significativo.",
      diagnosis: "Lesão de Bankart óssea com lesão de Hill-Sachs. Instabilidade glenoumeral anterior pós-luxação. DDx: lesão ALPSA (anterior labroligamentous periosteal sleeve avulsion), lesão SLAP associada.",
      pearls: "Pearl 1: Bankart engageable vs. não-engageable: a lesão de Hill-Sachs é engageable quando 'encaixa' na lesão de Bankart durante a rotação externa. Pearl 2: Regra dos 25%: perda óssea glenoidal >25% indica Latarjet em vez de Bankart artroscópico. Pearl 3: Calcular o índice ISIS antes da cirurgia.",
      tags: JSON.stringify(["ombro", "instabilidade", "bankart", "hill-sachs", "luxação"]),
      source: "Radiology Assistant",
    },
    {
      title: "Artrose Tricompartimental do Joelho com Varo",
      modality: "rx",
      region: "joelho",
      difficulty: "facil",
      findings: "Radiografias do joelho em ortostatismo AP, perfil e axial de patela. Redução do espaço articular medial (de 3 mm a 0 mm), com contato osso a osso no compartimento medial tibiofemorall. Esclerose subcondral e osteofitose marginal proeminentes no compartimento medial. Redução moderada do espaço lateral. Osteofitose nas eminências tibiais. Compartimento patelofemoral com redução do espaço lateral e osteofitose. Desvio em varo de 8 graus no eixo mecânico.",
      diagnosis: "Artrose tricompartimental do joelho, grau IV de Kellgren-Lawrence no compartimento medial, grau III lateral e patelofemoral. Deformidade em varo.",
      pearls: "Pearl 1: Sempre realizar radiografias em ortostatismo (carga) para avaliar o espaço articular real. Pearl 2: Critérios de Kellgren-Lawrence: I=dúvidoso, II=mínimo, III=moderado (osteofitose + redução espaço), IV=grave (contato osso a osso). Pearl 3: Medir o eixo mecânico para planejar artroplastia.",
      tags: JSON.stringify(["artrose", "joelho", "kellgren-lawrence", "varo", "osteoartrite"]),
      source: "Radiopaedia",
    },
    {
      title: "Hérnia Discal L4-L5 com Compressão Radicular",
      modality: "rm",
      region: "coluna-lombar",
      difficulty: "medio",
      findings: "RM da coluna lombar sem contraste. Em L4-L5: herniação discal paracentral direita de 8mm com migração caudal, comprimindo a raiz L5 direita no recesso lateral e no forame intervertebral. Sinal de Modic tipo 2 nos platôs vertebrais adjacentes. Estenose do recesso lateral direito. Estenose foraminal L4-L5 direita grau moderado. Hipertrofia facetária bilateral L4-L5. Espaços L1-L2 a L3-L4 com protrusões discais centrais sem compressão radicular significativa.",
      diagnosis: "Hérnia discal paracentral direita L4-L5 comprimindo a raiz L5 direita. Radiculopatia L5 direita. DDx: estenose de canal por hipertrofia facetária isolada, tumor extradural, neurite.",
      pearls: "Pearl 1: Distinguir protrusão (base > extensão) de extrusão (base < extensão) e sequestro (sem continuidade). Pearl 2: Sinal de Modic tipo 1 = edema/inflamação (hipossinal T1, hipersinal T2); tipo 2 = gorduroso (hipersinal T1 e T2). Pearl 3: A RM é o padrão-ouro para avaliação das hérnias discais e radiculopatia.",
      tags: JSON.stringify(["coluna", "hérnia-discal", "L4-L5", "radiculopatia", "lombalgia"]),
      source: "Radiopaedia",
    },
  ]

  for (const c of cases) {
    await prisma.case.create({ data: c })
  }

  // Sample flashcards
  const flashcards = [
    {
      question: "Quais são os critérios de Kellgren-Lawrence para artrose? Descreva cada grau.",
      answer: "Grau 0: Normal. Grau 1: Estreitamento duvidoso + possível osteofitose. Grau 2: Osteofitose definitiva + possível estreitamento. Grau 3: Osteofitose moderada + estreitamento definitivo + esclerose subcondral. Grau 4: Osteofitose importante + estreitamento grave (contato osso a osso) + esclerose acentuada.",
      category: "semiologia",
      difficulty: "medio",
    },
    {
      question: "Qual é o sinal radiológico de ruptura do LCA mais específico na radiografia simples?",
      answer: "Sinal de Segond: avulsão da cápsula articular lateral, aparecendo como pequeno fragmento ósseo à margem lateral do platô tibial lateral. É patognomônico de ruptura do LCA. Outros sinais: derrame articular, avulsão da eminência tibial.",
      category: "semiologia",
      difficulty: "medio",
    },
    {
      question: "Como classificar a lesão do manguito rotador na RM? Quais são os graus de rotura?",
      answer: "Grau 1 (tendinose): aumento de sinal intratendíneo sem rotura. Grau 2 (rotura parcial): pode ser na superfície articular (PASTA), bursal ou intratendinosa; expressar em % de espessura. Grau 3 (rotura completa): descontinuidade de toda a espessura; medir extensão craniocaudal e ântero-posterior. Achados associados: retração do tendão, atrofia muscular (Goutallier 0-4).",
      category: "patologia",
      difficulty: "dificil",
    },
    {
      question: "O que é o sinal de Modic e como interpretar cada tipo?",
      answer: "Alterações das placas vertebrais adjacentes ao disco: Tipo 1 (inflamação/edema): hipossinal T1, hipersinal T2 - ativo, pode causar dor. Tipo 2 (degeneração gordurosa): hipersinal T1 e T2 - estável, assintomático. Tipo 3 (esclerose): hipossinal T1 e T2 - inativo, esclerose subcondral. Conversão Modic 1→2 pode ocorrer com tratamento.",
      category: "semiologia",
      difficulty: "medio",
    },
    {
      question: "Qual sequência de RM é mais sensível para detecção de edema ósseo?",
      answer: "STIR (Short Time Inversion Recovery) ou DP fat-sat (densidade de prótons com supressão de gordura). Ambas suprimem o sinal da gordura e destacam o edema (hipersinal). A DP fat-sat tem melhor relação sinal-ruído. O T2 fat-sat também é excelente. T1 mostra hipossinal no edema.",
      category: "tecnica",
      difficulty: "facil",
    },
  ]

  for (const f of flashcards) {
    await prisma.flashcard.create({ data: f })
  }

  console.log(`✓ Created ${cases.length} cases and ${flashcards.length} flashcards`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
