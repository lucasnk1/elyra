export type ElyraCategory = {
  name: string;
  slug: string;
  label: string;
};

export type ElyraStory = {
  id: string;
  title: string;
  summary: string;
  content: string[];
  imageUrl?: string;
  source: string;
  sourceUrl: string;
  time: string;
  readTime: string;
  tag: string;
  impact: "High" | "Medium" | "Emerging";
  category: string;
};

export type PipelineStage = {
  name: string;
  description: string;
};

export type TrendSignal = {
  title: string;
  value: string;
  direction: string;
  detail: string;
};

export const categories: ElyraCategory[] = [
  { name: "Inteligência Artificial", slug: "ai", label: "AI" },
  { name: "Startups", slug: "startups", label: "Startups" },
  { name: "Big Tech", slug: "big-tech", label: "Big Tech" },
  { name: "Programação", slug: "programming", label: "Code" },
  { name: "Open Source", slug: "open-source", label: "OSS" },
  { name: "Cybersecurity", slug: "cybersecurity", label: "Security" },
  { name: "Cloud Computing", slug: "cloud", label: "Cloud" },
  { name: "Desenvolvimento", slug: "development", label: "Dev" },
  { name: "Robótica", slug: "robotics", label: "Robotics" },
  { name: "Ciência", slug: "science", label: "Science" },
  { name: "Hardware", slug: "hardware", label: "Hardware" },
  { name: "Gadgets", slug: "gadgets", label: "Gadgets" },
  { name: "Espaço", slug: "space", label: "Space" },
  { name: "Criptomoedas", slug: "crypto", label: "Crypto" },
  { name: "Pesquisa acadêmica", slug: "research", label: "Research" },
  { name: "DevOps", slug: "devops", label: "DevOps" },
  { name: "Infraestrutura", slug: "infra", label: "Infra" },
  { name: "Engenharia de Software", slug: "software-engineering", label: "SWE" },
];

export const trendSignals: TrendSignal[] = [
  {
    title: "AI momentum",
    value: "+42%",
    direction: "vs. last 24h",
    detail: "Model releases, agent frameworks, and inference updates are accelerating.",
  },
  {
    title: "Developer attention",
    value: "18.4k",
    direction: "mentions tracked",
    detail: "Open source launches and toolchains are outperforming generic product news.",
  },
  {
    title: "Emerging topics",
    value: "7",
    direction: "new clusters",
    detail: "Space, robotics, and infrastructure are breaking into the top rank.",
  },
];

export const featuredStory: ElyraStory = {
  id: "featured",
  title: "The next wave of AI products is becoming a real-time operating layer for the internet.",
  summary:
    "Elyra surfaces a shift from isolated models to connected intelligence systems that summarize, rank, and predict what matters before it trends.",
  content: [
    "A tecnologia de IA esta saindo do formato de produto isolado e entrando em uma camada operacional continua, conectada aos fluxos reais de decisao de empresas e usuarios.",
    "Em vez de abrir uma ferramenta para fazer uma tarefa, plataformas modernas estao distribuindo modelos ao longo de toda a jornada digital, desde descoberta ate suporte e automacao de processos.",
    "Esse movimento aumenta a velocidade de resposta, mas tambem exige governanca, observabilidade e contexto de negocio para que a inteligencia gere impacto sem criar ruido.",
    "A proposta da Elyra acompanha essa transicao com curadoria de sinais de alta relevancia, priorizando lancamentos e mudancas com efeito pratico para builders, equipes de produto e liderancas tecnicas.",
  ],
  source: "Elyra Intelligence",
  sourceUrl: "https://elyra.news/editorial/future-operating-layer",
  time: "Live",
  readTime: "4 min",
  tag: "Future Signals",
  impact: "High",
  category: "AI",
};

export const trendingStories: ElyraStory[] = [
  {
    id: "1",
    title: "OpenAI, Anthropic, and Google are pushing agents closer to production-grade workflows.",
    summary:
      "The competitive frontier is shifting from chat interfaces toward reliable tool use, orchestration, and contextual memory.",
    content: [
      "A corrida entre laboratorios de IA entrou em uma fase menos centrada em interface e mais focada em confiabilidade operacional de agentes.",
      "As evolucoes recentes mostram avanços em uso de ferramentas, memoria de contexto e cadeias de execucao que reduzem falhas em tarefas compostas.",
      "Para equipes de produto, o diferencial agora nao e apenas qualidade de resposta, mas previsibilidade em cenarios reais de trabalho.",
      "Esse amadurecimento aproxima os agentes de ambientes de producao em suporte tecnico, analise de dados e automacao de backoffice.",
    ],
    source: "AI Revolution",
    sourceUrl: "https://www.theverge.com/ai-artificial-intelligence",
    time: "8m ago",
    readTime: "6 min",
    tag: "Trending Now",
    impact: "High",
    category: "AI",
  },
  {
    id: "2",
    title: "Startups are building thinner software stacks and moving faster with AI-native infrastructure.",
    summary:
      "A new generation of teams is compressing product cycles, shipping with fewer engineers, and leaning on automation.",
    content: [
      "Startups AI-native estao operando com times menores e ciclos de entrega mais curtos, apoiadas por stacks enxutas e alto nivel de automacao.",
      "Esse modelo reduz overhead de operacao e permite experimentar com mais frequencia sem comprometer a qualidade tecnica.",
      "A vantagem competitiva passa a depender da capacidade de integrar ferramentas rapidamente e medir impacto em tempo real.",
      "Investidores e lideres de engenharia observam esse padrao como um novo baseline de eficiencia para produtos digitais.",
    ],
    source: "Startup Radar",
    sourceUrl: "https://techcrunch.com/startups/",
    time: "17m ago",
    readTime: "5 min",
    tag: "Startups",
    impact: "High",
    category: "Startups",
  },
  {
    id: "3",
    title: "Developer feeds are rewarding sharp technical insights, benchmark data, and open source momentum.",
    summary:
      "Articles with clear technical depth, runnable examples, and strong source quality continue to rise fastest.",
    content: [
      "Conteudo tecnico com benchmark, codigo executavel e contexto de arquitetura tem ganho destaque no consumo de informacao para desenvolvedores.",
      "A atencao da comunidade migrou de headlines para materiais com densidade pratica e aplicabilidade imediata.",
      "Esse comportamento aumenta o valor de curadoria editorial que diferencia sinal tecnico real de ruido de tendencia.",
      "Na pratica, os melhores resultados de audiencia aparecem quando ha combinacao de profundidade, clareza e fonte confiavel.",
    ],
    source: "Developer Feed",
    sourceUrl: "https://news.ycombinator.com/",
    time: "29m ago",
    readTime: "4 min",
    tag: "Engineering",
    impact: "Medium",
    category: "Programming",
  },
];

export const feedCollections: Array<{ title: string; description: string; stories: ElyraStory[] }> = [
  {
    title: "For You",
    description: "Personalized stories ranked by topic fit, velocity, and editorial importance.",
    stories: trendingStories,
  },
  {
    title: "Most Discussed",
    description: "Signals with strong social velocity, comments, and cross-source amplification.",
    stories: [
      {
        id: "4",
        title: "Cloudflare, Vercel, and edge-native platforms are redefining what 'fast' feels like.",
        summary:
          "The new benchmark is not just load time, but perceived immediacy across search, content, and interaction layers.",
        content: [
          "Plataformas edge-native estao redefinindo a percepcao de performance, com foco em resposta instantanea ao usuario final.",
          "A discussao atual vai alem de milissegundos de carregamento e inclui fluidez de interacao, busca sem latencia e renderizacao progressiva.",
          "Para produtos de conteudo e SaaS, essa camada de experiencia torna-se decisiva para retencao e conversao.",
          "O movimento reforca a importancia de arquitetura distribuida, cache inteligente e observabilidade ponta a ponta.",
        ],
        source: "Cloud Infra",
        sourceUrl: "https://blog.cloudflare.com/",
        time: "41m ago",
        readTime: "5 min",
        tag: "Infrastructure",
        impact: "High",
        category: "Infrastructure",
      },
      {
        id: "5",
        title: "GitHub Trending shows a clear rise in agent tooling, observability, and Rust-based systems.",
        summary:
          "The most active repositories are increasingly centered on automation, safety, and developer experience.",
        content: [
          "Os repositorios com maior tracao tem convergido em automacao de fluxos, seguranca por padrao e melhoria de experiencia para devs.",
          "Isso indica maturidade do ecossistema open source, com foco em ferramentas que resolvem gargalos reais de times tecnicos.",
          "Projetos com documentacao clara e exemplos reproduziveis continuam acelerando adoção.",
          "A tendencia confirma o papel da comunidade como motor de inovacao em infraestrutura e produtividade.",
        ],
        source: "Open Source Radar",
        sourceUrl: "https://github.com/trending",
        time: "52m ago",
        readTime: "3 min",
        tag: "Open Source",
        impact: "Medium",
        category: "Open Source",
      },
    ],
  },
  {
    title: "Future Signals",
    description: "Emerging topics detected by semantic clustering and trend acceleration.",
    stories: [
      {
        id: "6",
        title: "Robotics and spatial computing are starting to show the same distribution pattern as early AI tooling.",
        summary:
          "When adjacent ecosystems begin sharing vocabulary, funding, and launches, a new cycle is often forming.",
        content: [
          "Robotica e computacao espacial apresentam sinais iniciais de convergencia semelhantes ao inicio do ciclo recente de IA aplicada.",
          "A aproximacao de linguagem entre comunidades tecnicas e de produto sugere formacao de mercado com velocidade crescente.",
          "Quando financiamento, talento e distribuicao alinham ao mesmo tempo, a probabilidade de novos vencedores aumenta.",
          "Para observadores de tendencia, esse tipo de cluster costuma antecipar fases de crescimento estrutural.",
        ],
        source: "Emerging Cluster",
        sourceUrl: "https://www.technologyreview.com/topic/robotics/",
        time: "1h ago",
        readTime: "7 min",
        tag: "Hype Detection",
        impact: "Emerging",
        category: "Robotics",
      },
      {
        id: "7",
        title: "Academic papers around multimodal retrieval are converging on practical product use cases.",
        summary:
          "Better indexing, retrieval, and context assembly are making research output directly useful for builders.",
        content: [
          "Pesquisas em recuperacao multimodal estao saindo do laboratorio com aplicacoes diretas em produtos de busca, assistentes e analise.",
          "Avancos em indexacao e montagem de contexto permitem respostas mais consistentes em dominios tecnicos.",
          "Para equipes de engenharia, isso reduz o gap entre paper e implementacao comercial.",
          "O resultado e uma nova onda de produtos que combinam rigor cientifico com ritmo de entrega de startup.",
        ],
        source: "Research Radar",
        sourceUrl: "https://arxiv.org/list/cs.AI/recent",
        time: "2h ago",
        readTime: "8 min",
        tag: "Research",
        impact: "Emerging",
        category: "Research",
      },
    ],
  },
];

export const pipelineStages: PipelineStage[] = [
  {
    name: "Coleta",
    description: "RSS, APIs oficiais, scraping inteligente, and source monitoring.",
  },
  {
    name: "Limpeza",
    description: "Navbar, sidebar, and ad removal with main-content extraction.",
  },
  {
    name: "Classificação",
    description: "Semantic clustering, category assignment, and relevance scoring.",
  },
  {
    name: "Resumo",
    description: "Short, complete, and insight-focused AI-generated summaries.",
  },
  {
    name: "Ranking",
    description: "Trend velocity, authority, freshness, and user affinity ranking.",
  },
  {
    name: "Publicação",
    description: "Fast delivery to feed, search, alerts, and future newsletter surfaces.",
  },
];

export const sourceHighlights = [
  "TechCrunch",
  "The Verge",
  "Wired",
  "Ars Technica",
  "Hacker News",
  "GitHub Trending",
  "OpenAI Blog",
  "Anthropic",
  "Google AI Blog",
  "Vercel Blog",
  "Cloudflare Blog",
  "MIT Technology Review",
  "Elyra Assets",
];

export const allStories: ElyraStory[] = [
  featuredStory,
  ...trendingStories,
  ...feedCollections.flatMap((collection) => collection.stories),
].filter((story, index, array) => array.findIndex((item) => item.id === story.id) === index);

export function getStoryById(id: string): ElyraStory | undefined {
  return allStories.find((story) => story.id === id);
}