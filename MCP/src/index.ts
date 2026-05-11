#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  appDataset,
  buildStaticLearningPack,
  categories,
  dataContract,
  getDatasetSlice,
  providers as providerManifest
} from "./curriculum.js";
import {
  lookupFreeEnglishProviders,
  providerNames,
  type ProviderName
} from "./providers.js";

const server = new McpServer({
  name: "english-dev-corporate-mcp",
  version: appDataset.metadata.version
});

const providerSchema = z.enum(["dictionaryapi", "datamuse", "tatoeba", "wiktapi"]);

function jsonResponse(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(value, null, 2)
      }
    ]
  };
}

server.registerTool(
  "get_app_data_contract",
  {
    description: "Return the exact data masses required by the EnglishAppForDev application and the current dataset counts.",
    inputSchema: {}
  },
  async () => jsonResponse(dataContract)
);

server.registerTool(
  "get_developer_english_dataset",
  {
    description: "Return the complete developer/corporate English dataset in the same shape used by the Next.js app.",
    inputSchema: {
      categoryId: z
        .number()
        .int()
        .min(1)
        .max(categories.length)
        .optional()
        .describe("Optional category id to return a smaller slice."),
      includeProviderManifest: z
        .boolean()
        .optional()
        .describe("Include the list of free providers used for online enrichment. Defaults to true.")
    }
  },
  async ({ categoryId, includeProviderManifest }) =>
    jsonResponse(getDatasetSlice(categoryId, includeProviderManifest ?? true))
);

server.registerTool(
  "get_free_english_provider_manifest",
  {
    description: "Return the no-auth English providers used by this MCP and how each one contributes to the app.",
    inputSchema: {}
  },
  async () => jsonResponse(providerManifest)
);

server.registerTool(
  "search_free_english_providers",
  {
    description: "Search multiple free English providers for definitions, related words, examples and translations.",
    inputSchema: {
      query: z
        .string()
        .min(2)
        .describe("Word, phrase or developer/corporate topic, for example: latency, code review, follow up."),
      providers: z
        .array(providerSchema)
        .optional()
        .describe("Optional provider subset. Defaults to all providers."),
      maxItems: z
        .number()
        .int()
        .min(1)
        .max(20)
        .optional()
        .describe("Maximum normalized items per provider. Defaults to 5."),
      timeoutMs: z
        .number()
        .int()
        .min(1000)
        .max(30000)
        .optional()
        .describe("Timeout per provider request in milliseconds. Defaults to 8000.")
    }
  },
  async ({ query, providers, maxItems, timeoutMs }) => {
    const results = await lookupFreeEnglishProviders({
      query,
      maxItems: maxItems ?? 5,
      timeoutMs: timeoutMs ?? 8000,
      providers: (providers as ProviderName[] | undefined) ?? providerNames
    });

    return jsonResponse({
      query,
      focus: appDataset.metadata.focus,
      results
    });
  }
);

server.registerTool(
  "build_learning_pack",
  {
    description: "Build a focused learning pack from the curated app dataset, optionally enriched by live free providers.",
    inputSchema: {
      topic: z
        .string()
        .optional()
        .describe("Topic filter such as standup, incident, code review, planning, latency, stakeholder."),
      difficulty: z
        .number()
        .int()
        .min(1)
        .max(3)
        .optional()
        .describe("Optional difficulty filter from 1 to 3."),
      maxItems: z
        .number()
        .int()
        .min(1)
        .max(30)
        .optional()
        .describe("Maximum flashcards and exercises returned from the curated dataset. Defaults to 10."),
      includeLiveProviders: z
        .boolean()
        .optional()
        .describe("When true, enrich the pack with live provider lookups for the topic and key terms."),
      providerLookupTerms: z
        .array(z.string().min(2))
        .max(5)
        .optional()
        .describe("Optional explicit terms for provider enrichment.")
    }
  },
  async ({ topic, difficulty, maxItems, includeLiveProviders, providerLookupTerms }) => {
    const itemLimit = maxItems ?? 10;
    const staticPack = buildStaticLearningPack(topic, difficulty, itemLimit);
    const inferredTerms = [
      topic,
      ...staticPack.flashcards.map((flashcard) => flashcard.englishText),
      ...staticPack.sentenceExercises.map((exercise) => exercise.contextTag)
    ]
      .filter((term): term is string => Boolean(term))
      .map((term) => term.replace(/\.\.\.$/, "").trim())
      .filter((term, index, terms) => term.length > 1 && terms.indexOf(term) === index)
      .slice(0, 5);

    const lookupTerms = providerLookupTerms?.length ? providerLookupTerms : inferredTerms;
    const liveProviderResults = includeLiveProviders
      ? await Promise.all(
          lookupTerms.map((term) =>
            lookupFreeEnglishProviders({
              query: term,
              maxItems: 3,
              providers: ["dictionaryapi", "datamuse", "tatoeba", "wiktapi"]
            })
          )
        )
      : [];

    return jsonResponse({
      ...staticPack,
      liveProviderResults: lookupTerms.map((term, index) => ({
        term,
        results: liveProviderResults[index] || []
      }))
    });
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("English developer/corporate MCP server running on stdio");
}

main().catch((error: unknown) => {
  console.error("Fatal error in English developer/corporate MCP server:", error);
  process.exit(1);
});

