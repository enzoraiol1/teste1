export const MODALITIES = [
  { value: "rx", label: "Radiografia (Rx)" },
  { value: "tc", label: "Tomografia Computadorizada (TC)" },
  { value: "rm", label: "Ressonância Magnética (RM)" },
  { value: "us", label: "Ultrassonografia (US)" },
  { value: "fluoro", label: "Fluoroscopia" },
  { value: "cintilo", label: "Cintilografia" },
]

export const REGIONS = [
  { value: "coluna-cervical", label: "Coluna Cervical" },
  { value: "coluna-toracica", label: "Coluna Torácica" },
  { value: "coluna-lombar", label: "Coluna Lombar" },
  { value: "ombro", label: "Ombro" },
  { value: "cotovelo", label: "Cotovelo" },
  { value: "punho-mao", label: "Punho e Mão" },
  { value: "quadril", label: "Quadril" },
  { value: "joelho", label: "Joelho" },
  { value: "tornozelo-pe", label: "Tornozelo e Pé" },
  { value: "pelve", label: "Pelve" },
  { value: "musculo-esqueletico", label: "Músculo-Esquelético Geral" },
]

export const DIFFICULTIES = [
  { value: "facil", label: "Fácil", color: "green" },
  { value: "medio", label: "Médio", color: "yellow" },
  { value: "dificil", label: "Difícil", color: "red" },
]

export const FLASHCARD_CATEGORIES = [
  { value: "anatomia", label: "Anatomia" },
  { value: "semiologia", label: "Semiologia Radiológica" },
  { value: "patologia", label: "Patologia" },
  { value: "tecnica", label: "Técnica de Imagem" },
  { value: "tratamento", label: "Tratamento" },
]

export const REPORT_TEMPLATES: Record<string, Record<string, string>> = {
  rx: {
    "coluna-lombar": `TÉCNICA: Radiografias da coluna lombar em incidências ântero-posterior e perfil.

ACHADOS:
- Alinhamento vertebral:
- Altura dos corpos vertebrais:
- Espaços discais:
- Pedículos e lâminas:
- Articulações interapofisárias:
- Partes moles paravertebrais:

IMPRESSÃO:`,
    joelho: `TÉCNICA: Radiografias do joelho em incidências ântero-posterior, perfil e axial de patela.

ACHADOS:
- Alinhamento articular:
- Espaço articular medial:
- Espaço articular lateral:
- Espaço articular femoropatelar:
- Superfícies articulares:
- Osteófitos:
- Calcificações:
- Partes moles:

IMPRESSÃO:`,
    ombro: `TÉCNICA: Radiografias do ombro em incidências ântero-posterior (rotação neutra, interna e externa) e perfil de escápula.

ACHADOS:
- Alinhamento glenoumeral:
- Espaço subacromial:
- Cabeça umeral:
- Glenoide:
- Acrômio (tipo):
- Articulação acromioclavicular:
- Calcificações periarticulares:

IMPRESSÃO:`,
  },
  rm: {
    joelho: `TÉCNICA: RM do joelho sem contraste, sequências: DP fat-sat coronal, sagital e axial; T1 sagital.

MENISCOS:
- Menisco medial (corpo/cornos):
- Menisco lateral (corpo/cornos):

LIGAMENTOS:
- LCA:
- LCP:
- LCM:
- LCL:

CARTILAGEM ARTICULAR:
- Superfície femoral medial:
- Superfície femoral lateral:
- Superfície tibial medial:
- Superfície tibial lateral:
- Superfície patelar:
- Superfície troclear:

ESTRUTURAS PERIARTICULARES:
- Tendão patelar:
- Tendão quadricipital:
- Complexo posterolateral:
- Edema ósseo subcondral:
- Derrame articular:
- Cistos/bursas:

IMPRESSÃO:`,
    ombro: `TÉCNICA: RM do ombro sem contraste, sequências: DP fat-sat coronal oblíquo, sagital oblíquo e axial; T1 coronal oblíquo.

MANGUITO ROTADOR:
- Supraespinhal:
- Infraespinhal:
- Subescapular:
- Redondo menor:

TENDÃO DO BÍCEPS (PORÇÃO LONGA):
- Bainha:
- Intra-articular:
- Sulco bicipital:

ARTICULAÇÃO GLENOUMERAL:
- Lábio glenoidal:
- Cápsula articular:
- Cartilagem:
- Derrame intra-articular:

ESPAÇO SUBACROMIAL-SUBDELTÓIDEO:
- Bursa:
- Gordura:

ARTICULAÇÃO ACROMIOCLAVICULAR:
OSSOS:

IMPRESSÃO:`,
  },
  tc: {
    "coluna-lombar": `TÉCNICA: TC da coluna lombossacra com reconstruções multiplanares (sagital e coronal) e 3D.

ACHADOS:
- Lordose lombar:
- Corpos vertebrais (altura, densidade, morfologia):
- Espaços discais (L1-L2 a L5-S1):
- Forames intervertebrais:
- Canal vertebral central:
- Articulações interapofisárias:
- Elementos posteriores:
- Espondilolistese:
- Partes moles:

IMPRESSÃO:`,
  },
}

export const EXTERNAL_RESOURCES = [
  {
    category: "Portais de Casos e Referência",
    items: [
      {
        name: "Radiology Assistant",
        description: "Casos didáticos de radiologia musculoesquelética com alta qualidade de ensino",
        url: "https://www.radiologyassistant.nl",
        tags: ["casos", "MSK", "didático"],
        language: "EN",
      },
      {
        name: "Radiopaedia",
        description: "A maior enciclopédia colaborativa de radiologia com milhares de casos",
        url: "https://radiopaedia.org",
        tags: ["casos", "referência", "enciclopédia"],
        language: "EN",
      },
      {
        name: "STATdx (Elsevier)",
        description: "Base de dados diagnóstica premium para radiologistas",
        url: "https://my.statdx.com",
        tags: ["diagnóstico", "premium"],
        language: "EN",
      },
      {
        name: "Orthobullets",
        description: "Plataforma de educação ortopédica com casos de imagem",
        url: "https://www.orthobullets.com",
        tags: ["ortopedia", "casos", "educação"],
        language: "EN",
      },
    ],
  },
  {
    category: "MSK e Ortopedia",
    items: [
      {
        name: "MSK Ultrasound",
        description: "Recursos de ultrassonografia musculoesquelética",
        url: "https://www.mskultrasound.com",
        tags: ["USG", "MSK"],
        language: "EN",
      },
      {
        name: "Bone Tumor",
        description: "Referência específica para tumores ósseos e de partes moles",
        url: "https://www.bonetumor.org",
        tags: ["tumores", "ortopedia"],
        language: "EN",
      },
      {
        name: "Sports Medicine Imaging",
        description: "Imagens focadas em lesões esportivas e trauma",
        url: "https://radiopaedia.org/articles/musculoskeletal-radiology",
        tags: ["trauma", "esportes", "MSK"],
        language: "EN",
      },
    ],
  },
  {
    category: "Livros e Diretrizes",
    items: [
      {
        name: "ACR Appropriateness Criteria",
        description: "Critérios de adequação para solicitação de exames de imagem",
        url: "https://www.acr.org/Clinical-Resources/ACR-Appropriateness-Criteria",
        tags: ["diretrizes", "ACR"],
        language: "EN",
      },
      {
        name: "CFM - Diretrizes Brasileiras",
        description: "Conselho Federal de Medicina - orientações nacionais",
        url: "https://www.cfm.org.br",
        tags: ["diretrizes", "Brasil"],
        language: "PT",
      },
    ],
  },
  {
    category: "Ferramentas de IA",
    items: [
      {
        name: "Aidoc",
        description: "IA para detecção de achados críticos em imagens",
        url: "https://www.aidoc.com",
        tags: ["IA", "ferramenta"],
        language: "EN",
      },
      {
        name: "Viz.ai",
        description: "Plataforma de IA para análise de imagens médicas",
        url: "https://www.viz.ai",
        tags: ["IA", "ferramenta"],
        language: "EN",
      },
    ],
  },
]
