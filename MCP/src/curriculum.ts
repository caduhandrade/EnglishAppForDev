export interface Category {
  id: number;
  name: string;
  namePT: string;
  icon: string;
  color: string;
  description: string;
}

export interface Flashcard {
  id: number;
  categoryId: number;
  englishText: string;
  portugueseText: string;
  exampleSentence: string;
  exampleTranslation: string;
  verbTense: string;
  type: string;
  difficulty: number;
  contextTag: string;
}

export interface SentenceExercise {
  id: number;
  categoryId: number;
  englishSentence: string;
  portugueseSentence: string;
  verbTense: string;
  contextTag: string;
  difficulty: number;
  tip: string;
}

export interface ProviderManifestItem {
  id: string;
  name: string;
  url: string;
  auth: "none";
  bestFor: string[];
  appUse: string;
}

export interface AppDataset {
  metadata: {
    id: string;
    version: string;
    focus: string;
    languagePair: string;
    contract: {
      categories: string;
      flashcards: string;
      sentenceExercises: string;
    };
    counts: {
      categories: number;
      flashcards: number;
      sentenceExercises: number;
    };
  };
  providers: ProviderManifestItem[];
  categories: Category[];
  flashcards: Flashcard[];
  sentenceExercises: SentenceExercise[];
}

type FlashcardInput = Omit<Flashcard, "id">;
type SentenceExerciseInput = Omit<SentenceExercise, "id">;

export const categories: Category[] = [
  { id: 1, name: "Daily Standup", namePT: "Daily Standup", icon: "☀️", color: "#64FFDA", description: "Status, bloqueios e proximos passos" },
  { id: 2, name: "Retrospective", namePT: "Retrospectiva", icon: "🔄", color: "#FF7B7B", description: "Aprendizados, causa raiz e acoes" },
  { id: 3, name: "Sprint Planning", namePT: "Sprint Planning", icon: "📋", color: "#7BED9F", description: "Escopo, estimativas e prioridades" },
  { id: 4, name: "Quarter Planning", namePT: "Quarter Planning", icon: "📊", color: "#FFD32A", description: "OKRs, roadmap e trade-offs" },
  { id: 5, name: "Alignment", namePT: "Alinhamentos", icon: "🤝", color: "#A29BFE", description: "Decisoes, clarificacoes e consenso" },
  { id: 6, name: "Present Tenses", namePT: "Tempos do Presente", icon: "⚡", color: "#64FFDA", description: "Rotina, trabalho em andamento e resultados recentes" },
  { id: 7, name: "Past Tenses", namePT: "Tempos do Passado", icon: "⏪", color: "#FF7B7B", description: "Historico, incidentes e retrospectivas" },
  { id: 8, name: "Future Tenses", namePT: "Tempos do Futuro", icon: "⏩", color: "#7BED9F", description: "Planos, promessas e compromissos" },
  { id: 9, name: "Conditionals", namePT: "Condicionais", icon: "🔀", color: "#FFD32A", description: "Risco, hipotese e causa-consequencia" },
  { id: 10, name: "Modal Verbs", namePT: "Verbos Modais", icon: "🎯", color: "#A29BFE", description: "Pedidos, obrigacao, possibilidade e conselho" },
  { id: 11, name: "Contractions", namePT: "Contracoes", icon: "✂️", color: "#74B9FF", description: "Fala natural em reunioes e mensagens" },
  { id: 12, name: "Tech Vocabulary", namePT: "Vocabulario Tech", icon: "💻", color: "#FD79A8", description: "Termos tecnicos de engenharia de software" },
  { id: 13, name: "Code Review", namePT: "Revisao de Codigo", icon: "🔍", color: "#A29BFE", description: "Feedback tecnico claro e educado" },
  { id: 14, name: "Incident Management", namePT: "Gestao de Incidentes", icon: "🚨", color: "#FF7B7B", description: "Alertas, impacto, rollback e pos-mortem" },
  { id: 15, name: "Business Communication", namePT: "Comunicacao Profissional", icon: "💼", color: "#00D9FF", description: "Email, Slack, follow-up e stakeholders" },
  { id: 16, name: "Tense Tips & Tricks", namePT: "Dicas de Tempos Verbais", icon: "🎓", color: "#FFB800", description: "Regras praticas para escolher o tempo verbal certo" }
];

export const providers: ProviderManifestItem[] = [
  {
    id: "dictionaryapi",
    name: "Free Dictionary API",
    url: "https://dictionaryapi.dev/",
    auth: "none",
    bestFor: ["definitions", "phonetics", "examples", "synonyms"],
    appUse: "Enriquecer flashcards de vocabulario tecnico com definicao, pronuncia e exemplos."
  },
  {
    id: "datamuse",
    name: "Datamuse API",
    url: "https://www.datamuse.com/api/",
    auth: "none",
    bestFor: ["related words", "synonyms", "collocations", "word suggestions"],
    appUse: "Gerar termos relacionados a software, negocio e comunicacao corporativa."
  },
  {
    id: "tatoeba",
    name: "Tatoeba API",
    url: "https://api.tatoeba.org/",
    auth: "none",
    bestFor: ["real sentences", "translations", "short examples"],
    appUse: "Buscar frases reais em ingles e traducoes em portugues quando existirem."
  },
  {
    id: "wiktapi",
    name: "WiktApi",
    url: "https://wiktapi.dev/",
    auth: "none",
    bestFor: ["Wiktionary definitions", "pronunciation", "forms", "translations"],
    appUse: "Consultar definicoes estruturadas de Wiktionary sem parsear HTML."
  }
];

const flashcardInputs: FlashcardInput[] = [
  { categoryId: 1, englishText: "I'm blocked on...", portugueseText: "Estou bloqueado em...", exampleSentence: "I'm blocked on the API integration because I still need production credentials.", exampleTranslation: "Estou bloqueado na integracao da API porque ainda preciso das credenciais de producao.", verbTense: "Present Continuous", type: "Phrase", difficulty: 1, contextTag: "standup" },
  { categoryId: 1, englishText: "No blockers for me today.", portugueseText: "Sem bloqueios pra mim hoje.", exampleSentence: "No blockers for me today, so I'll keep working on the checkout migration.", exampleTranslation: "Sem bloqueios pra mim hoje, entao vou continuar trabalhando na migracao do checkout.", verbTense: "Simple Present", type: "Phrase", difficulty: 1, contextTag: "standup" },
  { categoryId: 1, englishText: "Yesterday I worked on...", portugueseText: "Ontem trabalhei em...", exampleSentence: "Yesterday I worked on the authentication module and fixed two failing tests.", exampleTranslation: "Ontem trabalhei no modulo de autenticacao e corrigi dois testes falhando.", verbTense: "Simple Past", type: "Phrase", difficulty: 1, contextTag: "standup" },
  { categoryId: 1, englishText: "Today I'm going to...", portugueseText: "Hoje vou...", exampleSentence: "Today I'm going to finish the unit tests and open the pull request.", exampleTranslation: "Hoje vou terminar os testes unitarios e abrir o pull request.", verbTense: "Going To", type: "Phrase", difficulty: 1, contextTag: "standup" },
  { categoryId: 1, englishText: "I'll sync with...", portugueseText: "Vou alinhar com...", exampleSentence: "I'll sync with the platform team after standup to confirm the rollout plan.", exampleTranslation: "Vou alinhar com o time de plataforma depois da daily para confirmar o plano de rollout.", verbTense: "Simple Future", type: "Phrase", difficulty: 2, contextTag: "standup" },

  { categoryId: 2, englishText: "What went well?", portugueseText: "O que foi bem?", exampleSentence: "What went well this sprint was our code review turnaround time.", exampleTranslation: "O que foi bem nesta sprint foi nosso tempo de resposta em code review.", verbTense: "Simple Past", type: "Question", difficulty: 1, contextTag: "retro" },
  { categoryId: 2, englishText: "What didn't go well?", portugueseText: "O que nao foi bem?", exampleSentence: "What didn't go well was the amount of rework caused by unclear requirements.", exampleTranslation: "O que nao foi bem foi a quantidade de retrabalho causada por requisitos pouco claros.", verbTense: "Simple Past", type: "Question", difficulty: 1, contextTag: "retro" },
  { categoryId: 2, englishText: "The root cause was...", portugueseText: "A causa raiz foi...", exampleSentence: "The root cause was a missing index on the orders table.", exampleTranslation: "A causa raiz foi um indice ausente na tabela de pedidos.", verbTense: "Simple Past", type: "Phrase", difficulty: 2, contextTag: "retro" },
  { categoryId: 2, englishText: "We should have...", portugueseText: "Deveriamos ter...", exampleSentence: "We should have added monitoring before enabling the feature flag.", exampleTranslation: "Deveriamos ter adicionado monitoramento antes de habilitar a feature flag.", verbTense: "Modal Perfect", type: "Phrase", difficulty: 3, contextTag: "retro" },
  { categoryId: 2, englishText: "Going forward...", portugueseText: "Daqui para frente...", exampleSentence: "Going forward, we should document rollout risks before the release.", exampleTranslation: "Daqui para frente, devemos documentar os riscos de rollout antes do release.", verbTense: "Simple Present", type: "Expression", difficulty: 1, contextTag: "retro" },

  { categoryId: 3, englishText: "acceptance criteria", portugueseText: "criterios de aceitacao", exampleSentence: "Let's define the acceptance criteria before estimating this story.", exampleTranslation: "Vamos definir os criterios de aceitacao antes de estimar esta historia.", verbTense: "Imperative", type: "Vocabulary", difficulty: 1, contextTag: "planning" },
  { categoryId: 3, englishText: "story points", portugueseText: "story points / pontos da historia", exampleSentence: "I'd estimate this at five story points because it touches two services.", exampleTranslation: "Eu estimaria isso em cinco story points porque toca em dois servicos.", verbTense: "Conditional", type: "Vocabulary", difficulty: 1, contextTag: "planning" },
  { categoryId: 3, englishText: "This story is too big.", portugueseText: "Esta historia esta grande demais.", exampleSentence: "This story is too big for one sprint; let's split it into smaller tasks.", exampleTranslation: "Esta historia esta grande demais para uma sprint; vamos dividi-la em tarefas menores.", verbTense: "Simple Present", type: "Phrase", difficulty: 1, contextTag: "planning" },
  { categoryId: 3, englishText: "Let's split this ticket.", portugueseText: "Vamos dividir este ticket.", exampleSentence: "Let's split this ticket so backend and frontend work can move in parallel.", exampleTranslation: "Vamos dividir este ticket para que backend e frontend possam avancar em paralelo.", verbTense: "Imperative", type: "Phrase", difficulty: 2, contextTag: "planning" },
  { categoryId: 3, englishText: "What's the priority order?", portugueseText: "Qual e a ordem de prioridade?", exampleSentence: "What's the priority order if we cannot finish the whole scope this sprint?", exampleTranslation: "Qual e a ordem de prioridade se nao conseguirmos terminar todo o escopo nesta sprint?", verbTense: "Simple Present", type: "Question", difficulty: 2, contextTag: "planning" },

  { categoryId: 4, englishText: "key result", portugueseText: "resultado-chave", exampleSentence: "The key result is to reduce checkout latency by thirty percent.", exampleTranslation: "O resultado-chave e reduzir a latencia do checkout em trinta por cento.", verbTense: "Simple Present", type: "Vocabulary", difficulty: 2, contextTag: "quarter-planning" },
  { categoryId: 4, englishText: "roadmap trade-off", portugueseText: "trade-off de roadmap", exampleSentence: "This is a roadmap trade-off between platform stability and new features.", exampleTranslation: "Este e um trade-off de roadmap entre estabilidade da plataforma e novas funcionalidades.", verbTense: "Simple Present", type: "Expression", difficulty: 2, contextTag: "quarter-planning" },
  { categoryId: 4, englishText: "stretch goal", portugueseText: "meta aspiracional", exampleSentence: "The mobile redesign is a stretch goal, not a committed deliverable.", exampleTranslation: "O redesign mobile e uma meta aspiracional, nao uma entrega comprometida.", verbTense: "Simple Present", type: "Vocabulary", difficulty: 2, contextTag: "quarter-planning" },
  { categoryId: 4, englishText: "We are tracking behind.", portugueseText: "Estamos atrasados em relacao ao plano.", exampleSentence: "We are tracking behind on the migration because the vendor API changed.", exampleTranslation: "Estamos atrasados na migracao porque a API do fornecedor mudou.", verbTense: "Present Continuous", type: "Phrase", difficulty: 2, contextTag: "quarter-planning" },
  { categoryId: 4, englishText: "dependency risk", portugueseText: "risco de dependencia", exampleSentence: "The biggest dependency risk is waiting for legal approval.", exampleTranslation: "O maior risco de dependencia e aguardar aprovacao juridica.", verbTense: "Simple Present", type: "Expression", difficulty: 2, contextTag: "quarter-planning" },

  { categoryId: 5, englishText: "Let's align on...", portugueseText: "Vamos alinhar sobre...", exampleSentence: "Let's align on the expected behavior before we change the API contract.", exampleTranslation: "Vamos alinhar sobre o comportamento esperado antes de alterarmos o contrato da API.", verbTense: "Imperative", type: "Phrase", difficulty: 1, contextTag: "alignment" },
  { categoryId: 5, englishText: "Can you clarify...?", portugueseText: "Voce pode esclarecer...?", exampleSentence: "Can you clarify whether this requirement applies to existing customers?", exampleTranslation: "Voce pode esclarecer se este requisito se aplica a clientes existentes?", verbTense: "Modal", type: "Question", difficulty: 1, contextTag: "alignment" },
  { categoryId: 5, englishText: "My understanding is that...", portugueseText: "Meu entendimento e que...", exampleSentence: "My understanding is that we will keep the old endpoint for ninety days.", exampleTranslation: "Meu entendimento e que manteremos o endpoint antigo por noventa dias.", verbTense: "Simple Present", type: "Phrase", difficulty: 2, contextTag: "alignment" },
  { categoryId: 5, englishText: "Let's document the decision.", portugueseText: "Vamos documentar a decisao.", exampleSentence: "Let's document the decision so we do not revisit the same debate next week.", exampleTranslation: "Vamos documentar a decisao para nao revisitar o mesmo debate na proxima semana.", verbTense: "Imperative", type: "Phrase", difficulty: 1, contextTag: "alignment" },
  { categoryId: 5, englishText: "We're on the same page.", portugueseText: "Estamos alinhados.", exampleSentence: "I want to make sure we're on the same page before I update the ticket.", exampleTranslation: "Quero garantir que estamos alinhados antes de atualizar o ticket.", verbTense: "Simple Present", type: "Expression", difficulty: 1, contextTag: "alignment" },

  { categoryId: 6, englishText: "I usually review code in the morning.", portugueseText: "Eu normalmente reviso codigo de manha.", exampleSentence: "I usually review code in the morning before picking up new work.", exampleTranslation: "Eu normalmente reviso codigo de manha antes de pegar trabalho novo.", verbTense: "Present Simple", type: "Grammar", difficulty: 1, contextTag: "present-tenses" },
  { categoryId: 6, englishText: "I'm currently working on the migration.", portugueseText: "Estou trabalhando atualmente na migracao.", exampleSentence: "I'm currently working on the payment migration and should finish today.", exampleTranslation: "Estou trabalhando atualmente na migracao de pagamentos e devo terminar hoje.", verbTense: "Present Continuous", type: "Grammar", difficulty: 1, contextTag: "present-tenses" },
  { categoryId: 6, englishText: "This service handles retries.", portugueseText: "Este servico lida com retentativas.", exampleSentence: "This service handles retries when the downstream API times out.", exampleTranslation: "Este servico lida com retentativas quando a API downstream expira.", verbTense: "Present Simple", type: "Grammar", difficulty: 2, contextTag: "present-tenses" },
  { categoryId: 6, englishText: "We have shipped the fix.", portugueseText: "Nos entregamos a correcao.", exampleSentence: "We have shipped the fix, but we are still monitoring the error rate.", exampleTranslation: "Nos entregamos a correcao, mas ainda estamos monitorando a taxa de erros.", verbTense: "Present Perfect", type: "Grammar", difficulty: 2, contextTag: "present-tenses" },
  { categoryId: 6, englishText: "The test is failing intermittently.", portugueseText: "O teste esta falhando de forma intermitente.", exampleSentence: "The test is failing intermittently only on the CI environment.", exampleTranslation: "O teste esta falhando de forma intermitente apenas no ambiente de CI.", verbTense: "Present Continuous", type: "Grammar", difficulty: 2, contextTag: "present-tenses" },

  { categoryId: 7, englishText: "We deployed the hotfix last night.", portugueseText: "Fizemos deploy do hotfix ontem a noite.", exampleSentence: "We deployed the hotfix last night and verified the metrics afterwards.", exampleTranslation: "Fizemos deploy do hotfix ontem a noite e verificamos as metricas depois.", verbTense: "Simple Past", type: "Grammar", difficulty: 1, contextTag: "past-tenses" },
  { categoryId: 7, englishText: "We were investigating the outage.", portugueseText: "Estavamos investigando a queda.", exampleSentence: "We were investigating the outage when the alerts started to recover.", exampleTranslation: "Estavamos investigando a queda quando os alertas comecaram a recuperar.", verbTense: "Past Continuous", type: "Grammar", difficulty: 2, contextTag: "past-tenses" },
  { categoryId: 7, englishText: "We had already rolled back.", portugueseText: "Ja tinhamos feito rollback.", exampleSentence: "We had already rolled back before the vendor confirmed the issue.", exampleTranslation: "Ja tinhamos feito rollback antes de o fornecedor confirmar o problema.", verbTense: "Past Perfect", type: "Grammar", difficulty: 3, contextTag: "past-tenses" },
  { categoryId: 7, englishText: "The bug was introduced in the last release.", portugueseText: "O bug foi introduzido no ultimo release.", exampleSentence: "The bug was introduced in the last release during the pricing refactor.", exampleTranslation: "O bug foi introduzido no ultimo release durante a refatoracao de precos.", verbTense: "Passive Voice", type: "Grammar", difficulty: 2, contextTag: "past-tenses" },
  { categoryId: 7, englishText: "We had been seeing higher latency.", portugueseText: "Estavamos vendo latencia mais alta.", exampleSentence: "We had been seeing higher latency for two hours before the incident was declared.", exampleTranslation: "Estavamos vendo latencia mais alta por duas horas antes de o incidente ser declarado.", verbTense: "Past Perfect Continuous", type: "Grammar", difficulty: 3, contextTag: "past-tenses" },

  { categoryId: 8, englishText: "We'll roll out the change gradually.", portugueseText: "Vamos liberar a mudanca gradualmente.", exampleSentence: "We'll roll out the change gradually using feature flags.", exampleTranslation: "Vamos liberar a mudanca gradualmente usando feature flags.", verbTense: "Simple Future", type: "Grammar", difficulty: 1, contextTag: "future-tenses" },
  { categoryId: 8, englishText: "We're going to migrate the service.", portugueseText: "Vamos migrar o servico.", exampleSentence: "We're going to migrate the service after the database backup finishes.", exampleTranslation: "Vamos migrar o servico depois que o backup do banco terminar.", verbTense: "Going To", type: "Grammar", difficulty: 1, contextTag: "future-tenses" },
  { categoryId: 8, englishText: "The feature will have shipped by Friday.", portugueseText: "A funcionalidade tera sido entregue ate sexta.", exampleSentence: "The feature will have shipped by Friday if QA signs off tomorrow.", exampleTranslation: "A funcionalidade tera sido entregue ate sexta se QA aprovar amanha.", verbTense: "Future Perfect", type: "Grammar", difficulty: 3, contextTag: "future-tenses" },
  { categoryId: 8, englishText: "I'll follow up after the meeting.", portugueseText: "Vou fazer follow-up depois da reuniao.", exampleSentence: "I'll follow up after the meeting with the action items.", exampleTranslation: "Vou fazer follow-up depois da reuniao com os itens de acao.", verbTense: "Simple Future", type: "Phrase", difficulty: 1, contextTag: "future-tenses" },
  { categoryId: 8, englishText: "We are meeting the client tomorrow.", portugueseText: "Vamos nos reunir com o cliente amanha.", exampleSentence: "We are meeting the client tomorrow to review the implementation plan.", exampleTranslation: "Vamos nos reunir com o cliente amanha para revisar o plano de implementacao.", verbTense: "Present Continuous for Future", type: "Grammar", difficulty: 2, contextTag: "future-tenses" },

  { categoryId: 9, englishText: "If this fails, we will roll back.", portugueseText: "Se isso falhar, faremos rollback.", exampleSentence: "If this fails, we will roll back to the previous version immediately.", exampleTranslation: "Se isso falhar, faremos rollback para a versao anterior imediatamente.", verbTense: "First Conditional", type: "Grammar", difficulty: 1, contextTag: "conditionals" },
  { categoryId: 9, englishText: "If we add caching, latency should drop.", portugueseText: "Se adicionarmos cache, a latencia deve cair.", exampleSentence: "If we add caching at the edge, latency should drop for international users.", exampleTranslation: "Se adicionarmos cache na borda, a latencia deve cair para usuarios internacionais.", verbTense: "First Conditional + Modal", type: "Grammar", difficulty: 2, contextTag: "conditionals" },
  { categoryId: 9, englishText: "If I had known, I would have flagged it earlier.", portugueseText: "Se eu soubesse, teria sinalizado antes.", exampleSentence: "If I had known about the dependency, I would have flagged it earlier.", exampleTranslation: "Se eu soubesse da dependencia, teria sinalizado antes.", verbTense: "Third Conditional", type: "Grammar", difficulty: 3, contextTag: "conditionals" },
  { categoryId: 9, englishText: "If the API is down, the worker retries.", portugueseText: "Se a API fica fora, o worker tenta novamente.", exampleSentence: "If the API is down, the worker retries with exponential backoff.", exampleTranslation: "Se a API fica fora, o worker tenta novamente com backoff exponencial.", verbTense: "Zero Conditional", type: "Grammar", difficulty: 2, contextTag: "conditionals" },
  { categoryId: 9, englishText: "If we were to delay, what would be impacted?", portugueseText: "Se fossemos adiar, o que seria impactado?", exampleSentence: "If we were to delay the launch, what would be impacted downstream?", exampleTranslation: "Se fossemos adiar o lancamento, o que seria impactado downstream?", verbTense: "Second Conditional", type: "Question", difficulty: 3, contextTag: "conditionals" },

  { categoryId: 10, englishText: "Could you review this PR?", portugueseText: "Voce poderia revisar este PR?", exampleSentence: "Could you review this PR when you have a moment?", exampleTranslation: "Voce poderia revisar este PR quando tiver um momento?", verbTense: "Modal", type: "Phrase", difficulty: 1, contextTag: "modals" },
  { categoryId: 10, englishText: "We should add tests.", portugueseText: "Devemos adicionar testes.", exampleSentence: "We should add tests for this edge case before merging.", exampleTranslation: "Devemos adicionar testes para este caso de borda antes de fazer merge.", verbTense: "Modal", type: "Phrase", difficulty: 1, contextTag: "modals" },
  { categoryId: 10, englishText: "This endpoint must be idempotent.", portugueseText: "Este endpoint deve ser idempotente.", exampleSentence: "This endpoint must be idempotent because clients may retry the request.", exampleTranslation: "Este endpoint deve ser idempotente porque os clientes podem tentar a requisicao novamente.", verbTense: "Modal", type: "Requirement", difficulty: 2, contextTag: "modals" },
  { categoryId: 10, englishText: "It might be a race condition.", portugueseText: "Pode ser uma condicao de corrida.", exampleSentence: "It might be a race condition because the failure only happens under load.", exampleTranslation: "Pode ser uma condicao de corrida porque a falha so acontece sob carga.", verbTense: "Modal", type: "Hypothesis", difficulty: 2, contextTag: "modals" },
  { categoryId: 10, englishText: "Would it make sense to...?", portugueseText: "Faria sentido...?", exampleSentence: "Would it make sense to move this validation to the service layer?", exampleTranslation: "Faria sentido mover esta validacao para a camada de servico?", verbTense: "Modal", type: "Question", difficulty: 2, contextTag: "modals" },

  { categoryId: 11, englishText: "I'm not sure.", portugueseText: "Nao tenho certeza.", exampleSentence: "I'm not sure this behavior is intentional; let me check the spec.", exampleTranslation: "Nao tenho certeza se este comportamento e intencional; vou checar a especificacao.", verbTense: "Present Simple", type: "Contraction", difficulty: 1, contextTag: "contractions" },
  { categoryId: 11, englishText: "We don't need to change the API.", portugueseText: "Nao precisamos mudar a API.", exampleSentence: "We don't need to change the API if we can handle this in the client.", exampleTranslation: "Nao precisamos mudar a API se conseguirmos tratar isso no cliente.", verbTense: "Present Simple", type: "Contraction", difficulty: 1, contextTag: "contractions" },
  { categoryId: 11, englishText: "It won't break existing users.", portugueseText: "Isso nao vai quebrar usuarios existentes.", exampleSentence: "It won't break existing users because the new field is optional.", exampleTranslation: "Isso nao vai quebrar usuarios existentes porque o novo campo e opcional.", verbTense: "Simple Future", type: "Contraction", difficulty: 1, contextTag: "contractions" },
  { categoryId: 11, englishText: "We haven't tested that path yet.", portugueseText: "Ainda nao testamos esse fluxo.", exampleSentence: "We haven't tested that path yet, so I do not want to merge today.", exampleTranslation: "Ainda nao testamos esse fluxo, entao nao quero fazer merge hoje.", verbTense: "Present Perfect", type: "Contraction", difficulty: 2, contextTag: "contractions" },
  { categoryId: 11, englishText: "They'd prefer a phased rollout.", portugueseText: "Eles prefeririam um rollout faseado.", exampleSentence: "They'd prefer a phased rollout because the change affects enterprise clients.", exampleTranslation: "Eles prefeririam um rollout faseado porque a mudanca afeta clientes enterprise.", verbTense: "Conditional", type: "Contraction", difficulty: 2, contextTag: "contractions" },

  { categoryId: 12, englishText: "idempotent", portugueseText: "idempotente", exampleSentence: "An idempotent request can be retried without changing the final result.", exampleTranslation: "Uma requisicao idempotente pode ser repetida sem alterar o resultado final.", verbTense: "Simple Present", type: "Vocabulary", difficulty: 3, contextTag: "tech-vocabulary" },
  { categoryId: 12, englishText: "latency", portugueseText: "latencia", exampleSentence: "Latency increased after we added an extra network call.", exampleTranslation: "A latencia aumentou depois que adicionamos uma chamada de rede extra.", verbTense: "Simple Past", type: "Vocabulary", difficulty: 1, contextTag: "tech-vocabulary" },
  { categoryId: 12, englishText: "throughput", portugueseText: "vazao / capacidade de processamento", exampleSentence: "Throughput improved after we batched database writes.", exampleTranslation: "A vazao melhorou depois que agrupamos escritas no banco de dados.", verbTense: "Simple Past", type: "Vocabulary", difficulty: 2, contextTag: "tech-vocabulary" },
  { categoryId: 12, englishText: "memory leak", portugueseText: "vazamento de memoria", exampleSentence: "The memory leak caused the worker to crash every few hours.", exampleTranslation: "O vazamento de memoria fez o worker travar a cada poucas horas.", verbTense: "Simple Past", type: "Vocabulary", difficulty: 2, contextTag: "tech-vocabulary" },
  { categoryId: 12, englishText: "feature flag", portugueseText: "flag de funcionalidade", exampleSentence: "We enabled the feature flag for five percent of traffic.", exampleTranslation: "Habilitamos a feature flag para cinco por cento do trafego.", verbTense: "Simple Past", type: "Vocabulary", difficulty: 1, contextTag: "tech-vocabulary" },

  { categoryId: 13, englishText: "Nit: ...", portugueseText: "Pequeno detalhe: ...", exampleSentence: "Nit: could we rename this variable to make the intent clearer?", exampleTranslation: "Pequeno detalhe: poderiamos renomear esta variavel para deixar a intencao mais clara?", verbTense: "Modal", type: "Code Review", difficulty: 1, contextTag: "code-review" },
  { categoryId: 13, englishText: "Could we extract this into a helper?", portugueseText: "Poderiamos extrair isso para um helper?", exampleSentence: "Could we extract this into a helper to avoid duplicating the validation logic?", exampleTranslation: "Poderiamos extrair isso para um helper para evitar duplicar a logica de validacao?", verbTense: "Modal", type: "Code Review", difficulty: 2, contextTag: "code-review" },
  { categoryId: 13, englishText: "This logic is hard to follow.", portugueseText: "Esta logica esta dificil de acompanhar.", exampleSentence: "This logic is hard to follow because the conditions are nested too deeply.", exampleTranslation: "Esta logica esta dificil de acompanhar porque as condicoes estao aninhadas demais.", verbTense: "Simple Present", type: "Code Review", difficulty: 1, contextTag: "code-review" },
  { categoryId: 13, englishText: "Please add a test for this edge case.", portugueseText: "Por favor adicione um teste para este caso de borda.", exampleSentence: "Please add a test for this edge case before we merge the PR.", exampleTranslation: "Por favor adicione um teste para este caso de borda antes de fazermos merge do PR.", verbTense: "Imperative", type: "Code Review", difficulty: 1, contextTag: "code-review" },
  { categoryId: 13, englishText: "Approved with minor suggestions.", portugueseText: "Aprovado com pequenas sugestoes.", exampleSentence: "Approved with minor suggestions; feel free to address them in a follow-up.", exampleTranslation: "Aprovado com pequenas sugestoes; fique a vontade para resolve-las em um follow-up.", verbTense: "Past Participle", type: "Code Review", difficulty: 2, contextTag: "code-review" },

  { categoryId: 14, englishText: "The service is degraded.", portugueseText: "O servico esta degradado.", exampleSentence: "The service is degraded in the EU region, but the US region is healthy.", exampleTranslation: "O servico esta degradado na regiao EU, mas a regiao US esta saudavel.", verbTense: "Simple Present", type: "Incident", difficulty: 1, contextTag: "incident" },
  { categoryId: 14, englishText: "We are rolling back.", portugueseText: "Estamos fazendo rollback.", exampleSentence: "We are rolling back the deployment while we investigate the elevated error rate.", exampleTranslation: "Estamos fazendo rollback do deploy enquanto investigamos a taxa de erros elevada.", verbTense: "Present Continuous", type: "Incident", difficulty: 1, contextTag: "incident" },
  { categoryId: 14, englishText: "We identified the root cause.", portugueseText: "Identificamos a causa raiz.", exampleSentence: "We identified the root cause and are preparing a permanent fix.", exampleTranslation: "Identificamos a causa raiz e estamos preparando uma correcao permanente.", verbTense: "Simple Past", type: "Incident", difficulty: 2, contextTag: "incident" },
  { categoryId: 14, englishText: "Customer impact is limited to...", portugueseText: "O impacto aos clientes esta limitado a...", exampleSentence: "Customer impact is limited to delayed email notifications.", exampleTranslation: "O impacto aos clientes esta limitado a notificacoes de email atrasadas.", verbTense: "Simple Present", type: "Incident", difficulty: 2, contextTag: "incident" },
  { categoryId: 14, englishText: "All systems are operational.", portugueseText: "Todos os sistemas estao operacionais.", exampleSentence: "All systems are operational, and we will publish the post-mortem tomorrow.", exampleTranslation: "Todos os sistemas estao operacionais, e publicaremos o post-mortem amanha.", verbTense: "Simple Present", type: "Incident", difficulty: 1, contextTag: "incident" },

  { categoryId: 15, englishText: "Just following up on...", portugueseText: "Apenas fazendo follow-up sobre...", exampleSentence: "Just following up on the proposal we discussed last Tuesday.", exampleTranslation: "Apenas fazendo follow-up sobre a proposta que discutimos na ultima terca.", verbTense: "Present Continuous", type: "Business", difficulty: 1, contextTag: "business-communication" },
  { categoryId: 15, englishText: "I appreciate your feedback.", portugueseText: "Agradeco seu feedback.", exampleSentence: "I appreciate your feedback and will incorporate it into the next draft.", exampleTranslation: "Agradeco seu feedback e vou incorpora-lo no proximo rascunho.", verbTense: "Simple Present", type: "Business", difficulty: 1, contextTag: "business-communication" },
  { categoryId: 15, englishText: "Could we move this meeting?", portugueseText: "Poderiamos mover esta reuniao?", exampleSentence: "Could we move this meeting to Thursday due to the release window?", exampleTranslation: "Poderiamos mover esta reuniao para quinta por causa da janela de release?", verbTense: "Modal", type: "Business", difficulty: 1, contextTag: "business-communication" },
  { categoryId: 15, englishText: "I'll get back to you by...", portugueseText: "Eu te retorno ate...", exampleSentence: "I'll get back to you by end of day with a more accurate estimate.", exampleTranslation: "Eu te retorno ate o fim do dia com uma estimativa mais precisa.", verbTense: "Simple Future", type: "Business", difficulty: 1, contextTag: "business-communication" },
  { categoryId: 15, englishText: "Thanks for the context.", portugueseText: "Obrigado pelo contexto.", exampleSentence: "Thanks for the context; that changes how we should prioritize the bug.", exampleTranslation: "Obrigado pelo contexto; isso muda como devemos priorizar o bug.", verbTense: "Simple Present", type: "Business", difficulty: 1, contextTag: "business-communication" },

  { categoryId: 16, englishText: "Use Present Continuous with currently/right now.", portugueseText: "Use Present Continuous com currently/right now.", exampleSentence: "I'm currently debugging the payment issue.", exampleTranslation: "Estou debugando o problema de pagamento agora.", verbTense: "Present Continuous", type: "Tip", difficulty: 1, contextTag: "tense-tips" },
  { categoryId: 16, englishText: "Use Present Perfect for recent completed work.", portugueseText: "Use Present Perfect para trabalho concluido recentemente.", exampleSentence: "We have deployed the fix and are monitoring production.", exampleTranslation: "Fizemos deploy da correcao e estamos monitorando producao.", verbTense: "Present Perfect", type: "Tip", difficulty: 2, contextTag: "tense-tips" },
  { categoryId: 16, englishText: "Use could to soften requests.", portugueseText: "Use could para suavizar pedidos.", exampleSentence: "Could you take another look at this query?", exampleTranslation: "Voce poderia dar outra olhada nesta query?", verbTense: "Modal", type: "Tip", difficulty: 1, contextTag: "tense-tips" },
  { categoryId: 16, englishText: "Avoid doubt for questions.", portugueseText: "Evite doubt para perguntas.", exampleSentence: "Say 'I have a question' instead of 'I have a doubt' in most corporate contexts.", exampleTranslation: "Diga 'I have a question' em vez de 'I have a doubt' na maioria dos contextos corporativos.", verbTense: "Usage", type: "Tip", difficulty: 2, contextTag: "tense-tips" },
  { categoryId: 16, englishText: "By means deadline; until means duration.", portugueseText: "By indica prazo final; until indica duracao.", exampleSentence: "Send it by Friday, but keep the old endpoint until June.", exampleTranslation: "Envie ate sexta, mas mantenha o endpoint antigo ate junho.", verbTense: "Usage", type: "Tip", difficulty: 2, contextTag: "tense-tips" }
];

const sentenceExerciseInputs: SentenceExerciseInput[] = [
  { categoryId: 1, englishSentence: "I am waiting for the credentials before I can finish the integration", portugueseSentence: "Estou aguardando as credenciais antes de conseguir terminar a integracao", verbTense: "Present Continuous", contextTag: "standup", difficulty: 1, tip: "Use 'am waiting' for an ongoing blocker." },
  { categoryId: 1, englishSentence: "Yesterday I fixed the failing tests and updated the PR", portugueseSentence: "Ontem corrigi os testes falhando e atualizei o PR", verbTense: "Simple Past", contextTag: "standup", difficulty: 1, tip: "Use Simple Past for completed work from yesterday." },
  { categoryId: 1, englishSentence: "I will sync with the backend team after standup", portugueseSentence: "Vou alinhar com o time de backend depois da daily", verbTense: "Simple Future", contextTag: "standup", difficulty: 1, tip: "Use 'will' for a commitment made now." },

  { categoryId: 2, englishSentence: "We should have clarified the requirements before starting the implementation", portugueseSentence: "Deveriamos ter esclarecido os requisitos antes de iniciar a implementacao", verbTense: "Modal Perfect", contextTag: "retro", difficulty: 3, tip: "'Should have' expresses a missed action in the past." },
  { categoryId: 2, englishSentence: "The root cause was a missing validation in the checkout service", portugueseSentence: "A causa raiz foi uma validacao ausente no servico de checkout", verbTense: "Simple Past", contextTag: "retro", difficulty: 2, tip: "Use Simple Past to report a finding from the retrospective." },
  { categoryId: 2, englishSentence: "Going forward we will add monitoring to every new endpoint", portugueseSentence: "Daqui para frente adicionaremos monitoramento a cada novo endpoint", verbTense: "Simple Future", contextTag: "retro", difficulty: 2, tip: "'Going forward' introduces an action item." },

  { categoryId: 3, englishSentence: "This story needs to be split before we estimate it", portugueseSentence: "Esta historia precisa ser dividida antes de a estimarmos", verbTense: "Passive Voice", contextTag: "planning", difficulty: 2, tip: "'Needs to be + past participle' is common for requirements." },
  { categoryId: 3, englishSentence: "What are the acceptance criteria for this task", portugueseSentence: "Quais sao os criterios de aceitacao para esta tarefa", verbTense: "Simple Present", contextTag: "planning", difficulty: 1, tip: "Use 'What are' for plural nouns like criteria." },
  { categoryId: 3, englishSentence: "We cannot commit to the whole scope this sprint", portugueseSentence: "Nao conseguimos nos comprometer com todo o escopo nesta sprint", verbTense: "Modal", contextTag: "planning", difficulty: 2, tip: "'Commit to' means assumir compromisso com uma entrega." },

  { categoryId: 4, englishSentence: "The key result is to reduce latency by thirty percent", portugueseSentence: "O resultado-chave e reduzir a latencia em trinta por cento", verbTense: "Simple Present", contextTag: "quarter-planning", difficulty: 2, tip: "Use 'is to + verb' to state an objective." },
  { categoryId: 4, englishSentence: "We are tracking behind because the dependency was delayed", portugueseSentence: "Estamos atrasados porque a dependencia foi adiada", verbTense: "Present Continuous", contextTag: "quarter-planning", difficulty: 2, tip: "'Tracking behind' is a business-friendly way to say atrasado." },
  { categoryId: 4, englishSentence: "If we cut scope we can still hit the committed goal", portugueseSentence: "Se reduzirmos escopo ainda conseguimos atingir a meta comprometida", verbTense: "First Conditional", contextTag: "quarter-planning", difficulty: 2, tip: "Use conditionals to discuss planning trade-offs." },

  { categoryId: 5, englishSentence: "My understanding is that the old endpoint will stay available for ninety days", portugueseSentence: "Meu entendimento e que o endpoint antigo ficara disponivel por noventa dias", verbTense: "Simple Present", contextTag: "alignment", difficulty: 2, tip: "'My understanding is that' checks alignment without sounding confrontational." },
  { categoryId: 5, englishSentence: "Can you clarify whether this applies to existing customers", portugueseSentence: "Voce pode esclarecer se isso se aplica a clientes existentes", verbTense: "Modal", contextTag: "alignment", difficulty: 1, tip: "'Whether' introduces two possible interpretations." },
  { categoryId: 5, englishSentence: "Let's document the decision in the architecture record", portugueseSentence: "Vamos documentar a decisao no registro de arquitetura", verbTense: "Imperative", contextTag: "alignment", difficulty: 1, tip: "'Let's' is a collaborative imperative." },

  { categoryId: 6, englishSentence: "I usually review pull requests before opening my editor", portugueseSentence: "Eu normalmente reviso pull requests antes de abrir meu editor", verbTense: "Present Simple", contextTag: "present-tenses", difficulty: 1, tip: "Use Present Simple for habits and routines." },
  { categoryId: 6, englishSentence: "We are monitoring the error rate after the release", portugueseSentence: "Estamos monitorando a taxa de erros depois do release", verbTense: "Present Continuous", contextTag: "present-tenses", difficulty: 1, tip: "Use Present Continuous for actions happening around now." },
  { categoryId: 6, englishSentence: "We have already shipped the fix to production", portugueseSentence: "Ja entregamos a correcao em producao", verbTense: "Present Perfect", contextTag: "present-tenses", difficulty: 2, tip: "Use Present Perfect when the completed action matters now." },

  { categoryId: 7, englishSentence: "The deployment failed because the configuration was missing", portugueseSentence: "O deploy falhou porque a configuracao estava ausente", verbTense: "Simple Past", contextTag: "past-tenses", difficulty: 1, tip: "Use Simple Past for a finished event." },
  { categoryId: 7, englishSentence: "We were debugging the worker when the queue recovered", portugueseSentence: "Estavamos debugando o worker quando a fila recuperou", verbTense: "Past Continuous", contextTag: "past-tenses", difficulty: 2, tip: "Past Continuous sets the background for another past event." },
  { categoryId: 7, englishSentence: "By the time we noticed the spike customers had already been affected", portugueseSentence: "Quando percebemos o pico os clientes ja tinham sido afetados", verbTense: "Past Perfect", contextTag: "past-tenses", difficulty: 3, tip: "Past Perfect shows which past event happened first." },

  { categoryId: 8, englishSentence: "We are going to migrate the service after the backup finishes", portugueseSentence: "Vamos migrar o servico depois que o backup terminar", verbTense: "Going To", contextTag: "future-tenses", difficulty: 1, tip: "Use 'going to' for planned work." },
  { categoryId: 8, englishSentence: "I will send the summary by end of day", portugueseSentence: "Enviarei o resumo ate o fim do dia", verbTense: "Simple Future", contextTag: "future-tenses", difficulty: 1, tip: "Use 'will' for promises and commitments." },
  { categoryId: 8, englishSentence: "By Friday we will have completed the rollout", portugueseSentence: "Ate sexta teremos concluido o rollout", verbTense: "Future Perfect", contextTag: "future-tenses", difficulty: 3, tip: "Future Perfect = will have + past participle." },

  { categoryId: 9, englishSentence: "If the job fails the scheduler retries it automatically", portugueseSentence: "Se o job falha o scheduler tenta novamente automaticamente", verbTense: "Zero Conditional", contextTag: "conditionals", difficulty: 2, tip: "Zero Conditional describes system behavior or facts." },
  { categoryId: 9, englishSentence: "If we add more logs we will debug this faster", portugueseSentence: "Se adicionarmos mais logs vamos debuggar isso mais rapido", verbTense: "First Conditional", contextTag: "conditionals", difficulty: 1, tip: "First Conditional talks about realistic future outcomes." },
  { categoryId: 9, englishSentence: "If we had caught this earlier we would have avoided the incident", portugueseSentence: "Se tivessemos detectado isso antes teriamos evitado o incidente", verbTense: "Third Conditional", contextTag: "conditionals", difficulty: 3, tip: "Third Conditional expresses regret about the past." },

  { categoryId: 10, englishSentence: "Could you take a look at the failing test", portugueseSentence: "Voce poderia dar uma olhada no teste falhando", verbTense: "Modal", contextTag: "modals", difficulty: 1, tip: "'Could you' is polite and direct." },
  { categoryId: 10, englishSentence: "The endpoint must validate the request before writing to the database", portugueseSentence: "O endpoint deve validar a requisicao antes de escrever no banco de dados", verbTense: "Modal", contextTag: "modals", difficulty: 2, tip: "'Must' expresses a hard requirement." },
  { categoryId: 10, englishSentence: "It might be caused by a race condition", portugueseSentence: "Pode ser causado por uma condicao de corrida", verbTense: "Modal Passive", contextTag: "modals", difficulty: 2, tip: "'Might be caused' is useful for cautious technical hypotheses." },

  { categoryId: 11, englishSentence: "We haven't tested the rollback path yet", portugueseSentence: "Ainda nao testamos o fluxo de rollback", verbTense: "Present Perfect", contextTag: "contractions", difficulty: 2, tip: "Use contractions in speech and chat for natural rhythm." },
  { categoryId: 11, englishSentence: "It won't affect customers because the flag is disabled", portugueseSentence: "Isso nao afetara clientes porque a flag esta desabilitada", verbTense: "Simple Future", contextTag: "contractions", difficulty: 1, tip: "'Won't' means 'will not'." },
  { categoryId: 11, englishSentence: "I'm not convinced this belongs in the controller", portugueseSentence: "Nao estou convencido de que isso pertence ao controller", verbTense: "Present Simple", contextTag: "contractions", difficulty: 2, tip: "'I'm not convinced' is softer than 'this is wrong'." },

  { categoryId: 12, englishSentence: "The memory leak caused the worker to restart every hour", portugueseSentence: "O vazamento de memoria fez o worker reiniciar a cada hora", verbTense: "Simple Past", contextTag: "tech-vocabulary", difficulty: 2, tip: "'Caused + object + to + verb' explains technical impact." },
  { categoryId: 12, englishSentence: "This endpoint must be idempotent because clients may retry requests", portugueseSentence: "Este endpoint deve ser idempotente porque clientes podem tentar requisicoes novamente", verbTense: "Modal", contextTag: "tech-vocabulary", difficulty: 3, tip: "Idempotent means repeated calls produce the same final state." },
  { categoryId: 12, englishSentence: "Feature flags let us roll out changes gradually", portugueseSentence: "Feature flags nos permitem liberar mudancas gradualmente", verbTense: "Present Simple", contextTag: "tech-vocabulary", difficulty: 1, tip: "'Let us' means 'allow us to'." },

  { categoryId: 13, englishSentence: "Could we extract this validation into a reusable helper", portugueseSentence: "Poderiamos extrair esta validacao para um helper reutilizavel", verbTense: "Modal", contextTag: "code-review", difficulty: 2, tip: "Use 'Could we' to make review feedback collaborative." },
  { categoryId: 13, englishSentence: "This logic is hard to follow because the conditions are nested", portugueseSentence: "Esta logica esta dificil de acompanhar porque as condicoes estao aninhadas", verbTense: "Simple Present", contextTag: "code-review", difficulty: 1, tip: "'Hard to follow' means difficult to understand." },
  { categoryId: 13, englishSentence: "Please add unit tests before merging this pull request", portugueseSentence: "Por favor adicione testes unitarios antes de fazer merge deste pull request", verbTense: "Imperative", contextTag: "code-review", difficulty: 1, tip: "Imperative is acceptable when polite and specific." },

  { categoryId: 14, englishSentence: "We are rolling back the deployment to reduce customer impact", portugueseSentence: "Estamos fazendo rollback do deploy para reduzir o impacto aos clientes", verbTense: "Present Continuous", contextTag: "incident", difficulty: 1, tip: "Use Present Continuous for active incident response." },
  { categoryId: 14, englishSentence: "The service has been degraded since the last release", portugueseSentence: "O servico esta degradado desde o ultimo release", verbTense: "Present Perfect", contextTag: "incident", difficulty: 2, tip: "Present Perfect + since connects past start and current state." },
  { categoryId: 14, englishSentence: "All systems are operational and the incident is resolved", portugueseSentence: "Todos os sistemas estao operacionais e o incidente esta resolvido", verbTense: "Simple Present", contextTag: "incident", difficulty: 1, tip: "Use clear simple language in incident updates." },

  { categoryId: 15, englishSentence: "I wanted to follow up on the proposal we discussed yesterday", portugueseSentence: "Queria fazer follow-up sobre a proposta que discutimos ontem", verbTense: "Simple Past", contextTag: "business-communication", difficulty: 1, tip: "'I wanted to follow up' is a polite opener." },
  { categoryId: 15, englishSentence: "Could we move the meeting to Thursday afternoon", portugueseSentence: "Poderiamos mover a reuniao para quinta a tarde", verbTense: "Modal", contextTag: "business-communication", difficulty: 1, tip: "Use 'Could we' for scheduling changes." },
  { categoryId: 15, englishSentence: "I appreciate the context and will adjust the timeline accordingly", portugueseSentence: "Agradeco o contexto e ajustarei o cronograma conforme necessario", verbTense: "Simple Present + Future", contextTag: "business-communication", difficulty: 2, tip: "'Accordingly' means based on that information." },

  { categoryId: 16, englishSentence: "I am currently working on the migration", portugueseSentence: "Estou trabalhando atualmente na migracao", verbTense: "Present Continuous", contextTag: "tense-tips", difficulty: 1, tip: "Currently is a strong clue for Present Continuous." },
  { categoryId: 16, englishSentence: "We have already deployed the fix", portugueseSentence: "Ja fizemos deploy da correcao", verbTense: "Present Perfect", contextTag: "tense-tips", difficulty: 2, tip: "Already often appears with Present Perfect." },
  { categoryId: 16, englishSentence: "Send the report by Friday and keep the branch open until Monday", portugueseSentence: "Envie o relatorio ate sexta e mantenha a branch aberta ate segunda", verbTense: "Usage", contextTag: "tense-tips", difficulty: 2, tip: "'By Friday' is deadline; 'until Monday' is duration." }
];

export const flashcards: Flashcard[] = flashcardInputs.map((flashcard, index) => ({
  ...flashcard,
  id: index + 1
}));

export const sentenceExercises: SentenceExercise[] = sentenceExerciseInputs.map((exercise, index) => ({
  ...exercise,
  id: index + 1
}));

export const appDataset: AppDataset = {
  metadata: {
    id: "developer-corporate-english",
    version: "2026-05-11",
    focus: "English for software developers, engineering rituals, incidents, code review, planning and corporate communication.",
    languagePair: "en-US <-> pt-BR",
    contract: {
      categories: "Category[]: id, name, namePT, icon, color, description",
      flashcards: "Flashcard[]: id, categoryId, englishText, portugueseText, exampleSentence, exampleTranslation, verbTense, type, difficulty, contextTag",
      sentenceExercises: "SentenceExercise[]: id, categoryId, englishSentence, portugueseSentence, verbTense, contextTag, difficulty, tip"
    },
    counts: {
      categories: categories.length,
      flashcards: flashcards.length,
      sentenceExercises: sentenceExercises.length
    }
  },
  providers,
  categories,
  flashcards,
  sentenceExercises
};

export function getDatasetSlice(categoryId?: number, includeProviderManifest = true): AppDataset {
  const filteredFlashcards = categoryId
    ? flashcards.filter((flashcard) => flashcard.categoryId === categoryId)
    : flashcards;
  const filteredExercises = categoryId
    ? sentenceExercises.filter((exercise) => exercise.categoryId === categoryId)
    : sentenceExercises;
  const filteredCategories = categoryId
    ? categories.filter((category) => category.id === categoryId)
    : categories;

  return {
    metadata: {
      ...appDataset.metadata,
      counts: {
        categories: filteredCategories.length,
        flashcards: filteredFlashcards.length,
        sentenceExercises: filteredExercises.length
      }
    },
    providers: includeProviderManifest ? providers : [],
    categories: filteredCategories,
    flashcards: filteredFlashcards,
    sentenceExercises: filteredExercises
  };
}

export function buildStaticLearningPack(topic: string | undefined, difficulty: number | undefined, maxItems: number) {
  const normalizedTopic = topic?.trim().toLowerCase();
  const matchesTopic = (value: string) => !normalizedTopic || value.toLowerCase().includes(normalizedTopic);
  const matchesDifficulty = (value: number) => !difficulty || value === difficulty;
  const categoryIds = new Set(
    categories
      .filter((category) =>
        matchesTopic(category.name) ||
        matchesTopic(category.namePT) ||
        matchesTopic(category.description)
      )
      .map((category) => category.id)
  );

  const matchedFlashcards = flashcards
    .filter((flashcard) =>
      matchesDifficulty(flashcard.difficulty) &&
      (
        categoryIds.has(flashcard.categoryId) ||
        matchesTopic(flashcard.contextTag) ||
        matchesTopic(flashcard.englishText) ||
        matchesTopic(flashcard.exampleSentence)
      )
    )
    .slice(0, maxItems);

  const matchedExercises = sentenceExercises
    .filter((exercise) =>
      matchesDifficulty(exercise.difficulty) &&
      (
        categoryIds.has(exercise.categoryId) ||
        matchesTopic(exercise.contextTag) ||
        matchesTopic(exercise.englishSentence)
      )
    )
    .slice(0, maxItems);

  return {
    topic: topic || "developer corporate English",
    difficulty: difficulty || "all",
    categories: categories.filter((category) => categoryIds.has(category.id)).slice(0, maxItems),
    flashcards: matchedFlashcards,
    sentenceExercises: matchedExercises
  };
}

export const dataContract = {
  requiredForApp: ["categories", "flashcards", "sentenceExercises"],
  optionalClientOnly: ["userProgress", "stats", "categoryStats"],
  notes: [
    "The current Next.js app serves static learning data from lib/seed-data.ts through API routes.",
    "User progress is not part of the seed mass because it is created in the browser IndexedDB.",
    "The MCP dataset uses the same shapes from types/index.ts so it can be transformed into seed-data.ts or served by an import script."
  ],
  counts: appDataset.metadata.counts
};

