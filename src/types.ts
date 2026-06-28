/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PoemType = 'bot_pake_4' | 'bot_pathyavatta' | 'bot_kaka_keti' | 'bot_pumnol' | 'bot_prohm_geeti' | 'bot_bantoal_kaka' | 'bot_phujong_leela' | 'bot_pake_6' | 'bot_pake_7' | 'bot_pake_8' | 'bot_pake_9' | 'bot_pake_10' | 'bot_pake_11';

export interface PoemTypeDetail {
  id: PoemType;
  nameKhmer: string;
  nameEnglish: string;
  description: string;
  rulesDescription: string;
  syllablesPattern: string; // e.g. "4-4-4-4" or "4-4-4-6-4-4-6"
  linesPerStanza: number;
}

export interface PoemLine {
  text: string;                  // The standard line text, e.g., "ស្រឡាញ់ទឹកដី"
  syllables: string[];          // Array of syllables, e.g., ["ស្រ", "ឡាញ់", "ទឹក", "ដី"]
  rhymeIndices: number[];       // Index of syllables in this line that rhyme (0-indexed)
  rhymesWith?: {
    lineIndex: number;          // 0-indexed line index within the stanza (or cross-stanza indicator)
    syllableIndex: number;      // 0-indexed syllable index in that line
    isCrossStanza?: boolean;    // true if rhyming with a line in another stanza
    crossStanzaOffset?: number; // offset to previous/next stanza (e.g. -1 for previous)
  }[];
}

export interface PoemStanza {
  lines: PoemLine[];
}

export interface PoemResponse {
  title: string;
  poemType: PoemType;
  poemTypeKhmer: string;
  meaning: string;
  stanzas: PoemStanza[];
  vocabulary: { word: string; definition: string }[];
}

export interface AnalysisResponse {
  isValid: boolean;
  overallScore: number; // 0 to 100
  spellingFeedback: {
    word: string;
    correction: string;
    explanation: string;
    index: number; // index in line or poem
  }[];
  rhymeFeedback: {
    stanzaIndex: number;
    lineIndex: number;
    syllableIndex: number;
    message: string;
    isCorrect: boolean;
    suggestedRhymes?: string[];
  }[];
  syllableFeedback: {
    stanzaIndex: number;
    lineIndex: number;
    expectedCount: number;
    actualCount: number;
    message: string;
  }[];
  generalFeedback: string;
}

export interface SavedPoem {
  id: string;
  title: string;
  poemType: PoemType;
  createdAt: string;
  topic?: string;
  content: PoemResponse;
}
