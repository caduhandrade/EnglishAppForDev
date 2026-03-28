# 🎓 English Tech App

Uma aplicação Next.js para aprender English focado em termos técnicos e comunicação profissional.

## ✨ Features

- 📚 **16 Categorias** de aprendizado (Daily Standup, Code Review, Incident Management, etc)
- 💡 **200+ Flashcards** com exemplos em contexto
- 🎯 **80+ Exercícios** de sentença
- 📊 **Estatísticas** de progresso em tempo real
- 💾 **IndexedDB** para armazenamento offline no navegador
- 🐳 **Docker** pronto para produção
- 📱 **Responsive Design** com Tailwind CSS

## 🚀 Quick Start

### Opção 1: Docker Compose (Recomendado)
```bash
# Windows
quickstart.bat

# Linux/Mac
chmod +x quickstart.sh
./quickstart.sh
```

Ou manualmente:
```bash
docker-compose up -d
```

### Opção 2: Desenvolvimento Local
```bash
npm install
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────┐
│         Next.js Web Application         │
├─────────────────────────────────────────┤
│                                         │
│  Client (Browser)          Server       │
│  ┌──────────────────┐    ┌────────────┐ │
│  │                  │    │    API     │ │
│  │  IndexedDB       │◄──►│  Routes    │ │
│  │ (user progress)  │    │            │ │
│  │                  │    │ data-store │ │
│  │  UI Components   │    │(static)    │ │
│  └──────────────────┘    └────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Componentes Principais

- **lib/client-db.ts** - IndexedDB para progresso do usuário
- **lib/data-store.ts** - Dados estáticos (categories, flashcards, exercises)
- **lib/seed-data.ts** - Base de dados em código
- **app/api/** - API routes (categories, flashcards, sentences, progress, stats)

## 📖 Categorias

1. ☀️ Daily Standup
2. 🔄 Retrospectiva
3. 📋 Sprint Planning
4. 📊 Quarter Planning
5. 🤝 Alinhamentos
6. ⚡ Present Tenses
7. ⏪ Past Tenses
8. ⏩ Future Tenses
9. 🔀 Conditionals
10. 🎯 Modal Verbs
11. ✂️ Contractions
12. 💻 Tech Vocabulary
13. 🔍 Code Review
14. 🚨 Incident Management
15. 💼 Business Communication
16. 🎓 Tense Tips & Tricks

## 🗄️ Armazenamento de Dados

### Dados Estáticos (Servidor)
- Categories, Flashcards, Exercises
- Servidos via API (`/api/categories`, `/api/flashcards`, etc)

### Progresso do Usuário (Cliente)
- Armazenado em **IndexedDB** no navegador
- Sem sincronização com servidor
- Persiste entre sessões
- Funciona offline

## 🐳 Docker

### Build
```bash
docker build -t english-tech-app:latest .
```

### Run
```bash
docker run -p 3000:3000 english-tech-app:latest
```

### Compose
```bash
docker-compose up -d
```

## 📊 Estatísticas

A aplicação rastreia:
- Total de respostas
- Total de acertos
- Acurácia geral
- Streak (dias consecutivos)
- Progresso por categoria

Dados salvos em IndexedDB: `EnglishTechApp > user_progress`

## 🔧 Desenvolvimento

### Dependências
```json
{
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0"
  }
}
```

### Scripts
```bash
npm run dev      # Desenvolvimento
npm run build    # Build production
npm start        # Run production
npm run lint     # Linter
```

## 📚 Documentação

- [INDEXEDDB_DOCKER_GUIDE.md](INDEXEDDB_DOCKER_GUIDE.md) - Guia completo de IndexedDB e Docker
- [MIGRACAO_RESUMO.md](MIGRACAO_RESUMO.md) - Resumo da migração SQLite → IndexedDB
- [NOVO_CONTEUDO_LIVROS.md](NOVO_CONTEUDO_LIVROS.md) - Conteúdo dos livros integrados

## 🔄 Estrutura de Arquivos

```
proyecto/
├── app/
│   ├── api/
│   │   ├── categories/
│   │   ├── flashcards/
│   │   ├── sentences/
│   │   ├── progress/
│   │   └── stats/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── flashcards/
│   ├── progress/
│   └── sentences/
├── components/
│   ├── TabBar.tsx
│   ├── FlashCard.tsx
│   ├── CategorySelector.tsx
│   ├── SentenceBuilder.tsx
│   └── SpeechButton.tsx
├── lib/
│   ├── client-db.ts       # IndexedDB service
│   ├── data-store.ts      # Dados estáticos
│   └── seed-data.ts       # Base de dados
├── types/
│   └── index.ts
├── public/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🚀 Deployment

### Quick Deploy (Docker Compose)
```bash
docker-compose up -d
```

### Production (Kubernetes)
```bash
docker build -t seu-registry/english-tech-app .
docker push seu-registry/english-tech-app
# Configure seus manifests k8s
```

### Environment Variables
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://seu-dominio.com
```

## 🐛 Troubleshooting

### IndexedDB não funciona
1. Abra DevTools: `F12`
2. Vá para: `Application > IndexedDB > EnglishTechApp`
3. Verifique a store `user_progress`
4. Se vazio, limpe cache e recarregue

### Docker não inicia
```bash
# Ver logs
docker-compose logs -f

# Limpar e reconstruir
docker-compose down -v
docker-compose up -d --build
```

### Porta 3000 já em uso
```bash
# Usar porta diferente
docker run -p 8000:3000 english-tech-app:latest
```

## 📞 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [IndexedDB MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Docker Docs](https://docs.docker.com)
- [Tailwind CSS](https://tailwindcss.com)

## 📝 Licença

MIT

## 👨‍💻 Contribuindo

Sugestões and pull requests são bem-vindos!

---

**Última atualização**: Março 2026
**Versão**: 0.1.0
**Status**: ✅ Production Ready
