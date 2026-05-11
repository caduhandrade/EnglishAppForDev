export const providerNames = ["dictionaryapi", "datamuse", "tatoeba", "wiktapi"] as const;

export type ProviderName = (typeof providerNames)[number];

export interface NormalizedProviderItem {
  label: string;
  definition?: string;
  example?: string;
  translationPT?: string;
  partOfSpeech?: string;
  phonetic?: string;
  score?: number;
  sourceUrl?: string;
  raw?: unknown;
}

export interface ProviderLookupResult {
  provider: ProviderName;
  ok: boolean;
  requestUrl: string;
  items: NormalizedProviderItem[];
  error?: string;
}

interface DictionaryDefinition {
  definition?: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface DictionaryMeaning {
  partOfSpeech?: string;
  definitions?: DictionaryDefinition[];
}

interface DictionaryEntry {
  word?: string;
  phonetic?: string;
  meanings?: DictionaryMeaning[];
}

interface DatamuseWord {
  word: string;
  score?: number;
  tags?: string[];
  defs?: string[];
}

interface WiktDefinitionSense {
  glosses?: string[];
  examples?: Array<{ text?: string } | string>;
  tags?: string[];
}

interface WiktDefinitionEntry {
  word?: string;
  pos?: string;
  senses?: WiktDefinitionSense[];
}

interface WiktDefinitionResponse {
  word?: string;
  entries?: WiktDefinitionEntry[];
}

interface TatoebaSentence {
  id?: number;
  text?: string;
  lang?: string;
  translations?: unknown[];
}

interface TatoebaResponse {
  data?: TatoebaSentence[];
}

const USER_AGENT = "EnglishAppForDev-MCP/1.0";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function firstUsefulWord(query: string): string {
  const word = query
    .trim()
    .split(/\s+/)
    .find((part) => /^[a-zA-Z][a-zA-Z'-]*$/.test(part));
  return word || query.trim();
}

async function fetchJson<T>(url: URL, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function providerError(provider: ProviderName, requestUrl: string, error: unknown): ProviderLookupResult {
  return {
    provider,
    ok: false,
    requestUrl,
    items: [],
    error: toErrorMessage(error)
  };
}

async function lookupDictionaryApi(query: string, maxItems: number, timeoutMs: number): Promise<ProviderLookupResult> {
  const word = firstUsefulWord(query);
  const url = new URL(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

  try {
    const entries = await fetchJson<DictionaryEntry[]>(url, timeoutMs);
    const items = entries
      .flatMap((entry) =>
        (entry.meanings || []).flatMap((meaning) =>
          (meaning.definitions || []).map((definition) => ({
            label: entry.word || word,
            definition: definition.definition,
            example: definition.example,
            partOfSpeech: meaning.partOfSpeech,
            phonetic: entry.phonetic,
            sourceUrl: url.toString(),
            raw: {
              synonyms: definition.synonyms?.slice(0, 8) || [],
              antonyms: definition.antonyms?.slice(0, 8) || []
            }
          }))
        )
      )
      .filter((item) => item.definition)
      .slice(0, maxItems);

    return { provider: "dictionaryapi", ok: true, requestUrl: url.toString(), items };
  } catch (error) {
    return providerError("dictionaryapi", url.toString(), error);
  }
}

async function lookupDatamuse(query: string, maxItems: number, timeoutMs: number): Promise<ProviderLookupResult> {
  const url = new URL("https://api.datamuse.com/words");
  url.searchParams.set("ml", query);
  url.searchParams.set("topics", "software engineering business communication");
  url.searchParams.set("md", "dp");
  url.searchParams.set("max", String(maxItems));

  try {
    const words = await fetchJson<DatamuseWord[]>(url, timeoutMs);
    const items = words.slice(0, maxItems).map((word) => ({
      label: word.word,
      definition: word.defs?.[0],
      partOfSpeech: word.tags?.find((tag) => ["n", "v", "adj", "adv"].includes(tag)),
      score: word.score,
      sourceUrl: url.toString(),
      raw: {
        tags: word.tags || []
      }
    }));

    return { provider: "datamuse", ok: true, requestUrl: url.toString(), items };
  } catch (error) {
    return providerError("datamuse", url.toString(), error);
  }
}

function flattenTranslations(translations: unknown[]): Array<{ text?: string; lang?: string }> {
  const flattened: Array<{ text?: string; lang?: string }> = [];

  for (const value of translations) {
    if (Array.isArray(value)) {
      flattened.push(...flattenTranslations(value));
    } else if (value && typeof value === "object") {
      const candidate = value as { text?: string; lang?: string };
      flattened.push({ text: candidate.text, lang: candidate.lang });
    }
  }

  return flattened;
}

async function lookupTatoeba(query: string, maxItems: number, timeoutMs: number): Promise<ProviderLookupResult> {
  const url = new URL("https://api.tatoeba.org/v1/sentences");
  url.searchParams.set("lang", "eng");
  url.searchParams.set("q", query);
  url.searchParams.set("sort", "relevance");
  url.searchParams.set("trans:lang", "por");
  url.searchParams.set("showtrans", "matching");
  url.searchParams.set("is_unapproved", "no");
  url.searchParams.set("limit", String(maxItems));

  try {
    const response = await fetchJson<TatoebaResponse>(url, timeoutMs);
    const items = (response.data || []).slice(0, maxItems).map((sentence) => {
      const translations = flattenTranslations(sentence.translations || []);
      const translationPT = translations.find((translation) => translation.lang === "por")?.text;

      return {
        label: sentence.text || "",
        example: sentence.text,
        translationPT,
        sourceUrl: sentence.id ? `https://tatoeba.org/en/sentences/show/${sentence.id}` : url.toString(),
        raw: {
          id: sentence.id,
          lang: sentence.lang
        }
      };
    });

    return { provider: "tatoeba", ok: true, requestUrl: url.toString(), items };
  } catch (error) {
    return providerError("tatoeba", url.toString(), error);
  }
}

async function lookupWiktApi(query: string, maxItems: number, timeoutMs: number): Promise<ProviderLookupResult> {
  const word = firstUsefulWord(query);
  const url = new URL(`https://api.wiktapi.dev/v1/en/word/${encodeURIComponent(word)}/definitions`);
  url.searchParams.set("lang", "en");

  try {
    const response = await fetchJson<WiktDefinitionResponse>(url, timeoutMs);
    const items = (response.entries || [])
      .flatMap((entry) =>
        (entry.senses || []).map((sense) => {
          const exampleValue = sense.examples?.[0];
          const example = typeof exampleValue === "string" ? exampleValue : exampleValue?.text;

          return {
            label: entry.word || response.word || word,
            definition: sense.glosses?.[0],
            example,
            partOfSpeech: entry.pos,
            sourceUrl: url.toString(),
            raw: {
              tags: sense.tags || []
            }
          };
        })
      )
      .filter((item) => item.definition)
      .slice(0, maxItems);

    return { provider: "wiktapi", ok: true, requestUrl: url.toString(), items };
  } catch (error) {
    return providerError("wiktapi", url.toString(), error);
  }
}

export async function lookupFreeEnglishProviders({
  query,
  maxItems = 5,
  timeoutMs = 8000,
  providers = [...providerNames]
}: {
  query: string;
  maxItems?: number;
  timeoutMs?: number;
  providers?: readonly ProviderName[];
}): Promise<ProviderLookupResult[]> {
  const uniqueProviders = [...new Set(providers)];

  const lookups = uniqueProviders.map((provider) => {
    switch (provider) {
      case "dictionaryapi":
        return lookupDictionaryApi(query, maxItems, timeoutMs);
      case "datamuse":
        return lookupDatamuse(query, maxItems, timeoutMs);
      case "tatoeba":
        return lookupTatoeba(query, maxItems, timeoutMs);
      case "wiktapi":
        return lookupWiktApi(query, maxItems, timeoutMs);
    }
  });

  return Promise.all(lookups);
}

