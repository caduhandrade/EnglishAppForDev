# English Dev Corporate MCP

Servidor MCP em TypeScript para alimentar a aplicacao `EnglishAppForDev` com massas de dados focadas em ingles de desenvolvedor e comunicacao corporativa.

## O que ele entrega

- `categories`: categorias de estudo usadas pela UI.
- `flashcards`: cards com ingles, traducao, exemplo, tempo verbal, dificuldade e contexto.
- `sentenceExercises`: frases para montar/praticar com dica gramatical.
- `providers`: catalogo dos providers gratuitos usados para enriquecer o conteudo.

A massa curada principal fica em:

```txt
MCP/data/developer-corporate-english.dataset.json
```

Esse JSON segue o mesmo contrato de `types/index.ts` da aplicacao Next.js.

## Providers gratuitos

Este MCP consome apenas providers sem chave de API:

- Free Dictionary API: definicoes, fonetica, exemplos e sinonimos.
- Datamuse API: termos relacionados, sinonimos, sugestoes e colocacoes.
- Tatoeba API: frases reais em ingles e traducoes quando disponiveis.
- WiktApi: definicoes estruturadas do Wiktionary, pronuncia, formas e traducoes.

## Ferramentas MCP

- `get_app_data_contract`: retorna o contrato de dados necessario para a aplicacao rodar.
- `get_developer_english_dataset`: retorna a massa completa ou filtrada por categoria.
- `get_free_english_provider_manifest`: lista providers e uso dentro da app.
- `search_free_english_providers`: busca online nos providers gratuitos.
- `build_learning_pack`: monta um pacote de estudo por topico/dificuldade e pode enriquecer com providers online.

## Instalar e gerar dados

```bash
cd MCP
npm install
npm run prepare:data
```

## Rodar o servidor MCP

```bash
cd MCP
npm run build
node build/index.js
```

## Configuracao de cliente MCP via stdio

Use o caminho absoluto do projeto:

```json
{
  "mcpServers": {
    "english-dev-corporate": {
      "command": "node",
      "args": [
        "/Users/carlos.landrade/Desktop/EnglishAppForDev/MCP/build/index.js"
      ]
    }
  }
}
```

## Base documental usada

- MCP quickstart/build server: https://modelcontextprotocol.io/docs/develop/build-server
- MCP intro: https://modelcontextprotocol.io/docs/getting-started/intro
- Free Dictionary API: https://dictionaryapi.dev/
- Datamuse API: https://www.datamuse.com/api/
- Tatoeba API: https://api.tatoeba.org/
- WiktApi: https://wiktapi.dev/

