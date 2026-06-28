/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper: Check if Gemini is initialized
function getAiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in Settings > Secrets.");
  }
  return ai;
}

// Helper: Call Gemini API with model fallback and exponential backoff for extreme resilience
async function generateGeminiContentWithFallback(
  params: Omit<GenerateContentParameters, "model">,
  retries = 3,
  delay = 1000
) {
  const client = getAiClient();
  const models = ["gemini-3.5-flash", "gemini-2.5-flash"];
  let lastError: any = null;

  for (const modelName of models) {
    let currentDelay = delay;
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Attempting generateContent using model: ${modelName} (attempt ${i + 1}/${retries})`);
        const response = await client.models.generateContent({
          ...params,
          model: modelName,
        });
        return response;
      } catch (error: any) {
        lastError = error;
        const errMsg = error?.toString() || error?.message || "";
        console.warn(`Gemini error using model ${modelName}: ${errMsg}`);

        const isTemporaryError = 
          errMsg.includes("503") || 
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("Resource exhausted") ||
          errMsg.includes("rate limit") ||
          errMsg.includes("limit") ||
          errMsg.includes("429");

        if (isTemporaryError && i < retries - 1) {
          console.warn(`Temporary error. Retrying in ${currentDelay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          currentDelay *= 2; // exponential backoff
        } else {
          // If it's a non-temporary/rate limit error (e.g. key issue, bad parameters) OR we exhausted retries,
          // break out of this model's retry loop and fall back to the next model immediately
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to contact Gemini API after attempting multiple models.");
}

// Endpoint 1: Generate Poetry
app.post("/api/generate-poem", async (req, res) => {
  try {
    const { topic, poemType, stanzaCount = 2, additionalInstructions = "" } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const client = getAiClient();

    const systemInstruction = `You are an acclaimed Master Khmer Poet (កវីឯកភាសាខ្មែរ) with deep knowledge of traditional poetry laws (ច្បាប់កាព្យកាព្យឃ្លោងខ្មែរ) and the Chuon Nath Khmer Dictionary. 
Your goal is to compose highly authentic, meaningful, and phonetically perfect Khmer poetry (កំណាព្យខ្មែរ) based on the user's topic and selected style.

Traditional Khmer Poetry Rules:
1. Bot Pake 4 (បទពាក្យ៤):
   - 4 syllables per line, 4 lines per stanza.
   - Line 1, Syllable 4 rhymes with Line 2, Syllable 2.
   - Line 2, Syllable 4 rhymes with Line 3, Syllable 4.
   - Line 3, Syllable 4 rhymes with Line 4, Syllable 2.
   - Inter-stanza rhyme: Line 4, Syllable 4 of Stanza N rhymes with Line 2, Syllable 4 of Stanza N+1.

2. Bot Pathyavatta (បទបថ្យាវត្ត):
   - 8 syllables per line, 4 lines per stanza.
   - Line 1, Syllable 8 rhymes with Line 2, Syllable 4.
   - Line 2, Syllable 8 rhymes with Line 3, Syllable 8.
   - Line 3, Syllable 8 rhymes with Line 4, Syllable 4.
   - Inter-stanza rhyme: Line 4, Syllable 8 of Stanza N rhymes with Line 2, Syllable 8 of Stanza N+1.

3. Bot Kaka Keti (បទកាកគតិ):
   - 7 lines per stanza. Syllables: Line 1 (4), Line 2 (4), Line 3 (4), Line 4 (6), Line 5 (4), Line 6 (4), Line 7 (6).
   - Line 1, Syllable 4 rhymes with Line 2, Syllable 4 AND Line 3, Syllable 4.
   - Line 3, Syllable 4 rhymes with Line 4, Syllable 2.
   - Line 4, Syllable 6 rhymes with Line 5, Syllable 4 AND Line 6, Syllable 4.
   - Line 6, Syllable 4 rhymes with Line 7, Syllable 2.
   - Inter-stanza rhyme: Line 7, Syllable 6 of Stanza N rhymes with Line 4, Syllable 6 of Stanza N+1.

4. Bot Pumnol (បទពំនោល):
   - 3 lines per stanza. Syllables: Line 1 (6), Line 2 (4), Line 3 (6).
   - Line 1, Syllable 6 rhymes with Line 2, Syllable 4.
   - Line 2, Syllable 4 rhymes with Line 3, Syllable 2.
   - Inter-stanza rhyme: Line 3, Syllable 6 of Stanza N rhymes with Line 1, Syllable 6 of Stanza N+1.

5. Bot Prohm Geeti (បទ្រពហ្មគីតិ):
   - 4 lines per stanza. Syllables: Line 1 (5), Line 2 (6), Line 3 (5), Line 4 (6).
   - Line 1, Syllable 5 rhymes with Line 2, Syllable 3.
   - Line 2, Syllable 6 rhymes with Line 3, Syllable 5 AND Line 4, Syllable 3.
   - Inter-stanza rhyme: Line 4, Syllable 6 of Stanza N rhymes with Line 2, Syllable 6 of Stanza N+1.

6. Bot Bantoal Kaka (បទបន្ទោលកាក):
   - 4 lines per stanza. Syllables: Line 1 (4), Line 2 (6), Line 3 (4), Line 4 (6).
   - Line 1, Syllable 4 rhymes with Line 2, Syllable 2 or 4.
   - Line 2, Syllable 6 rhymes with Line 3, Syllable 4 AND Line 4, Syllable 2 or 4.
   - Inter-stanza rhyme: Line 4, Syllable 6 of Stanza N rhymes with Line 2, Syllable 6 of Stanza N+1.

7. Bot Phujong Leela (បទភុជង្គលីលា):
   - 3 lines per stanza. Syllables: Line 1 (6), Line 2 (4), Line 3 (4).
   - Line 1, Syllable 6 rhymes with Line 2, Syllable 4.
   - Inter-stanza rhyme: Line 3, Syllable 4 of Stanza N rhymes with Line 1, Syllable 6 of Stanza N+1.

8. Bot Pake 6 (បទពាក្យ៦):
   - 6 syllables per line, 4 lines per stanza.
   - Line 1, Syllable 6 rhymes with Line 2, Syllable 2 or 4.
   - Line 2, Syllable 6 rhymes with Line 3, Syllable 6.
   - Line 3, Syllable 6 rhymes with Line 4, Syllable 2 or 4.
   - Inter-stanza rhyme: Line 4, Syllable 6 of Stanza N rhymes with Line 2, Syllable 6 of Stanza N+1.

9. Bot Pake 7 (បទពាក្យ៧):
   - 7 syllables per line, 4 lines per stanza.
   - Line 1, Syllable 7 rhymes with Line 2, Syllable 2 or 4.
   - Line 2, Syllable 7 rhymes with Line 3, Syllable 7.
   - Line 3, Syllable 7 rhymes with Line 4, Syllable 2 or 4.
   - Inter-stanza rhyme: Line 4, Syllable 7 of Stanza N rhymes with Line 2, Syllable 7 of Stanza N+1.

10. Bot Pake 8 (បទពាក្យ៨):
    - 8 syllables per line, 4 lines per stanza.
    - Line 1, Syllable 8 rhymes with Line 2, Syllable 3 or 5.
    - Line 2, Syllable 8 rhymes with Line 3, Syllable 8.
    - Line 3, Syllable 8 rhymes with Line 4, Syllable 3 or 5.
    - Inter-stanza rhyme: Line 4, Syllable 8 of Stanza N rhymes with Line 2, Syllable 8 of Stanza N+1.

11. Bot Pake 9 (បទពាក្យ៩):
    - 9 syllables per line, 4 lines per stanza.
    - Line 1, Syllable 9 rhymes with Line 2, Syllable 3 or 6.
    - Line 2, Syllable 9 rhymes with Line 3, Syllable 9.
    - Line 3, Syllable 9 rhymes with Line 4, Syllable 3 or 6.
    - Inter-stanza rhyme: Line 4, Syllable 9 of Stanza N rhymes with Line 2, Syllable 9 of Stanza N+1.

12. Bot Pake 10 (បទពាក្យ១០):
    - 10 syllables per line, 4 lines per stanza.
    - Line 1, Syllable 10 rhymes with Line 2, Syllable 5.
    - Line 2, Syllable 10 rhymes with Line 3, Syllable 10.
    - Line 3, Syllable 10 rhymes with Line 4, Syllable 5.
    - Inter-stanza rhyme: Line 4, Syllable 10 of Stanza N rhymes with Line 2, Syllable 10 of Stanza N+1.

13. Bot Pake 11 (បទពាក្យ១១):
    - 11 syllables per line, 4 lines per stanza.
    - Line 1, Syllable 11 rhymes with Line 2, Syllable 3.
    - Line 2, Syllable 11 rhymes with Line 3, Syllable 11.
    - Line 3, Syllable 11 rhymes with Line 4, Syllable 3.
    - Inter-stanza rhyme: Line 4, Syllable 11 of Stanza N rhymes with Line 2, Syllable 11 of Stanza N+1.

Instructions for splitting syllables and identifying rhymes:
- Split each line's Khmer text into clear phonetic syllables (ព្យាង្គ) and place them in the 'syllables' array. E.g., for "ស្រឡាញ់ទឹកដី", the syllables are ["ស្រ", "ឡាញ់", "ទឹក", "ដី"].
- The syllable count of the array MUST EXACTLY match the required syllables per line of that poetry style.
- Identify the 0-indexed syllable index of rhyming words inside each line and specify them in 'rhymeIndices'.
- Declare where these syllables rhyme in the 'rhymesWith' array, referencing the line index (0 to lines.length - 1) and the syllable index in that line.

Return the response in a structured JSON schema representing the composed poem, its overall meaning, and a glossary of key/poetic vocabulary words used. All responses must be entirely written in clear, elegant Khmer language.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A beautifully elegant title for the poem in Khmer." },
        poemType: { type: Type.STRING, description: "The poetry type requested, e.g., 'bot_pake_4'." },
        poemTypeKhmer: { type: Type.STRING, description: "The Khmer name of the poetry style, e.g., 'បទពាក្យ៤'." },
        meaning: { type: Type.STRING, description: "A summary explaining the poetic message, theme, and moral of the poem in Khmer." },
        stanzas: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              lines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "The complete natural text of the line in Khmer." },
                    syllables: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Array of syllables making up the line, e.g., ['ស្រ', 'ឡាញ់', 'ទឹក', 'ដី']."
                    },
                    rhymeIndices: {
                      type: Type.ARRAY,
                      items: { type: Type.INTEGER },
                      description: "Indices of syllables in this line that form rhymes."
                    },
                    rhymesWith: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          lineIndex: { type: Type.INTEGER, description: "The 0-based line index this syllable rhymes with within the stanza." },
                          syllableIndex: { type: Type.INTEGER, description: "The 0-based syllable index in that target line." },
                          isCrossStanza: { type: Type.BOOLEAN, description: "True if this is an inter-stanza (ចួនឆ្លងល្បះ) rhyme." },
                          crossStanzaOffset: { type: Type.INTEGER, description: "Offset of the target stanza, e.g., -1 for the previous stanza." }
                        }
                      }
                    }
                  },
                  required: ["text", "syllables", "rhymeIndices"]
                }
              }
            },
            required: ["lines"]
          }
        },
        vocabulary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING, description: "A difficult or poetic Khmer word used in the poem." },
              definition: { type: Type.STRING, description: "The definition or explanation of the word based on Chuon Nath dictionary." }
            },
            required: ["word", "definition"]
          }
        }
      },
      required: ["title", "poemType", "poemTypeKhmer", "meaning", "stanzas", "vocabulary"]
    };

    const prompt = `Compose a traditional Khmer poem following these specifications:
- Theme / Topic: "${topic}"
- Poetry Style: "${poemType}"
- Number of Stanzas (ល្បះ): ${stanzaCount}
- Additional constraints/mood: "${additionalInstructions}"

Ensure perfect rhyming (ពាក្យជួនចុងចួន និងចួនឆ្លងល្បះ) as per traditional rules, precise syllable counts per line, and highly accurate classical spelling from the Khmer dictionary. Provide definitions for any poetic or rich vocabulary used.`;

    const response = await generateGeminiContentWithFallback({
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating poem:", error);
    const errMsg = error?.message || error?.toString() || "";
    let friendlyMessage = "ការបង្កើតកំណាព្យបានបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។";
    if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE")) {
      friendlyMessage = "សេវាកម្មកំពុងមមាញឹកខ្លាំង ឬកំពុងមានការប្រើប្រាស់ខ្ពស់ជាបណ្ដោះអាសន្ន (Spikes in demand)។ សូមរង់ចាំបន្តិច រួចចុចព្យាយាមម្ដងទៀត។";
    } else if (errMsg.includes("API_KEY") || errMsg.includes("missing")) {
      friendlyMessage = "សូមពិនិត្យមើលកូដសម្ងាត់ API Key នៅក្នុងការកំណត់ Settings > Secrets។";
    }
    res.status(500).json({ error: friendlyMessage, debug: errMsg });
  }
});

// Endpoint 2: Analyze & Check User Written Poetry
app.post("/api/analyze-poem", async (req, res) => {
  try {
    const { poemText, poemType } = req.body;

    if (!poemText) {
      return res.status(400).json({ error: "Poem text is required to analyze" });
    }

    const client = getAiClient();

    const systemInstruction = `You are an expert Khmer poetry critic and orthography editor. Your role is to analyze a user-written Khmer poem for:
1. Syllable count correctness (verify each line's syllable count against standard rules of the requested poetry type).
2. Rhyming integrity (check if internal and cross-line/cross-stanza rhymes rhyme correctly phonetically in Khmer).
3. Khmer dictionary spelling (អក្ខរាវិរុទ្ធ) correctness (detect spelling errors and suggest correct spelling with references to Chuon Nath dictionary).
4. Provide constructive general advice in Khmer to help the writer improve.

Poetry Styles and Rules:
- Bot Pake 4: 4 syllables/line, 4 lines/stanza.
- Bot Pathyavatta: 8 syllables/line, 4 lines/stanza.
- Bot Kaka Keti: 7 lines/stanza. Syllables: 4, 4, 4, 6, 4, 4, 6.
- Bot Pumnol: 3 lines/stanza. Syllables: 6, 4, 6.
- Bot Prohm Geeti: 4 lines/stanza. Syllables: 5, 6, 5, 6.
- Bot Bantoal Kaka: 4 lines/stanza. Syllables: 4, 6, 4, 6.
- Bot Phujong Leela: 3 lines/stanza. Syllables: 6, 4, 4.
- Bot Pake 6: 6 syllables/line, 4 lines/stanza.
- Bot Pake 7: 7 syllables/line, 4 lines/stanza.
- Bot Pake 8: 8 syllables/line, 4 lines/stanza.
- Bot Pake 9: 9 syllables/line, 4 lines/stanza.
- Bot Pake 10: 10 syllables/line, 4 lines/stanza.
- Bot Pake 11: 11 syllables/line, 4 lines/stanza.

Return a highly precise analysis response in JSON format. Provide detailed spelling and rhyming reports. Keep explanations warm, encouraging, and educational, all written in Khmer.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        isValid: { type: Type.BOOLEAN, description: "True if the poem follows the requested rules and spelling perfectly." },
        overallScore: { type: Type.INTEGER, description: "A quality rating from 0 to 100 based on rhythm, meaning, and spelling." },
        spellingFeedback: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING, description: "The misspelled word found in the user's text." },
              correction: { type: Type.STRING, description: "The correct spelling based on Chuon Nath dictionary." },
              explanation: { type: Type.STRING, description: "Brief explanation in Khmer of why it was incorrect and what it means." }
            },
            required: ["word", "correction", "explanation"]
          }
        },
        rhymeFeedback: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stanzaIndex: { type: Type.INTEGER, description: "0-based index of the stanza containing the rhyme issue." },
              lineIndex: { type: Type.INTEGER, description: "0-based index of the line containing the issue." },
              syllableIndex: { type: Type.INTEGER, description: "0-based index of the syllable containing the issue." },
              message: { type: Type.STRING, description: "An explanation of why this rhyme is weak or incorrect in Khmer." },
              isCorrect: { type: Type.BOOLEAN, description: "True if it is a correct rhyme, false if it is broken." },
              suggestedRhymes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of alternative Khmer words that would rhyme perfectly."
              }
            },
            required: ["stanzaIndex", "lineIndex", "message", "isCorrect"]
          }
        },
        syllableFeedback: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stanzaIndex: { type: Type.INTEGER, description: "0-based stanza index." },
              lineIndex: { type: Type.INTEGER, description: "0-based line index." },
              expectedCount: { type: Type.INTEGER, description: "Expected number of syllables." },
              actualCount: { type: Type.INTEGER, description: "Actual syllables detected." },
              message: { type: Type.STRING, description: "Feedback on the line's rhythm, e.g. too long or short." }
            },
            required: ["stanzaIndex", "lineIndex", "expectedCount", "actualCount", "message"]
          }
        },
        generalFeedback: { type: Type.STRING, description: "A summary of constructive guidance, comments on meaning, and encouragement written in Khmer." }
      },
      required: ["isValid", "overallScore", "spellingFeedback", "rhymeFeedback", "syllableFeedback", "generalFeedback"]
    };

    const prompt = `Analyze this user's poem:
Poem Type requested: "${poemType}"
User Poem Text:
"""
${poemText}
"""

Please parse it stanza by stanza, line by line. Verify if syllables match the requested poetry style, if rhymes connect correctly (including cross-stanza rhymes if multiple stanzas), and check if there are any spelling mistakes. Provide constructive and educational suggestions in Khmer.`;

    const response = await generateGeminiContentWithFallback({
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // low temp for accurate analysis
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error analyzing poem:", error);
    const errMsg = error?.message || error?.toString() || "";
    let friendlyMessage = "ការវិភាគកំណាព្យបានបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។";
    if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE")) {
      friendlyMessage = "សេវាកម្មកំពុងមមាញឹកខ្លាំង ឬកំពុងមានការប្រើប្រាស់ខ្ពស់ជាបណ្ដោះអាសន្ន (Spikes in demand)។ សូមរង់ចាំបន្តិច រួចចុចព្យាយាមម្ដងទៀត។";
    } else if (errMsg.includes("API_KEY") || errMsg.includes("missing")) {
      friendlyMessage = "សូមពិនិត្យមើលកូដសម្ងាត់ API Key នៅក្នុងការកំណត់ Settings > Secrets។";
    }
    res.status(500).json({ error: friendlyMessage, debug: errMsg });
  }
});

// Endpoint 3: Rhyme Helper Suggestion
app.post("/api/rhyme-helper", async (req, res) => {
  try {
    const { word, poemType, linePosition } = req.body;

    if (!word) {
      return res.status(400).json({ error: "Word is required to suggest rhymes" });
    }

    const client = getAiClient();

    const response = await generateGeminiContentWithFallback({
      contents: `suggest list of 10-15 traditional Khmer words that rhyme perfectly with the word "${word}". 
Also, provide a tiny definition for each word so the user knows what they mean, and categorize them by emotional tone or usage (e.g., descriptive, emotional, nature).
Format the response strictly as a JSON object with this schema:
{
  "rhymingWord": string, // original word
  "suggestions": [
    { "word": string, "meaning": string, "tone": string }
  ]
}
Return only JSON. Do not write any markdown outside the JSON.`,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in rhyme helper:", error);
    const errMsg = error?.message || error?.toString() || "";
    let friendlyMessage = "ការស្វែងរកពាក្យជួនបានបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។";
    if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE")) {
      friendlyMessage = "សេវាកម្មកំពុងមមាញឹកខ្លាំង ឬកំពុងមានការប្រើប្រាស់ខ្ពស់ជាបណ្ដោះអាសន្ន (Spikes in demand)។ សូមរង់ចាំបន្តិច រួចចុចព្យាយាមម្ដងទៀត។";
    } else if (errMsg.includes("API_KEY") || errMsg.includes("missing")) {
      friendlyMessage = "សូមពិនិត្យមើលកូដសម្ងាត់ API Key នៅក្នុងការកំណត់ Settings > Secrets។";
    }
    res.status(500).json({ error: friendlyMessage, debug: errMsg });
  }
});

// Setup Vite Dev Server / Static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
