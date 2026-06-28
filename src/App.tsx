/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  CheckCircle, 
  FileText, 
  Save, 
  Trash2, 
  RefreshCw, 
  HelpCircle, 
  Info, 
  ChevronRight,
  BookMarked,
  Share2,
  Bookmark,
  Check,
  AlertTriangle,
  Lightbulb,
  Music,
  ArrowRight
} from 'lucide-react';
import { PoemType, PoemTypeDetail, PoemResponse, AnalysisResponse, SavedPoem } from './types';

// Predefined poetry style explanations and metadata
const POEM_STYLES: PoemTypeDetail[] = [
  {
    id: 'bot_pake_4',
    nameKhmer: 'បទពាក្យ៤',
    nameEnglish: 'Bot Pake 4 (Four-Syllable)',
    description: 'កាព្យដែលមានបួនព្យាង្គក្នុងមួយឃ្លា ពេញនិយមក្នុងកំណាព្យកុមារ និងការអប់រំខ្លីៗ។ មានលក្ខណៈរហ័សរហួន និងងាយចាំ។',
    rulesDescription: 'មួយវគ្គមាន ៤ ឃ្លា, មួយឃ្លាមាន ៤ ព្យាង្គ។ ព្យាង្គទី៤ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី២ នៃឃ្លាទី២។ ព្យាង្គទី៤ នៃឃ្លាទី២ ជួននឹងព្យាង្គទី៤ នៃឃ្លាទី៣។ ព្យាង្គទី៤ នៃឃ្លាទី៣ ជួននឹងព្យាង្គទី២ នៃឃ្លាទី៤។ ចំណែកឯការចួនឆ្លងល្បះ គឺព្យាង្គទី៤ នៃឃ្លាទី៤ នៃល្បះទី១ ត្រូវជួននឹងព្យាង្គទី២ នៃឃ្លាទី២ នៃល្បះទី២។',
    syllablesPattern: '៤-៤-៤-៤',
    linesPerStanza: 4
  },
  {
    id: 'bot_pathyavatta',
    nameKhmer: 'បទបថ្យាវត្ត',
    nameEnglish: 'Bot Pathyavatta (Eight-Syllable Devotional)',
    description: 'ពេញនិយមសម្រាប់ការអប់រំ សូត្រក្នុងពិធីបុណ្យកុសលផ្សេងៗ ផ្ដល់នូវសម្លេងផ្អែមល្ហែម និងពិរោះស្រទន់។',
    rulesDescription: 'មួយវគ្គមាន ៤ ឃ្លា, មួយឃ្លាមាន ៨ ព្យាង្គ។ ព្យាង្គទី៨ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី៤ នៃឃ្លាទី២។ ព្យាង្គទី៨ នៃឃ្លាទី២ ជួននឹងព្យាង្គទី៨ នៃឃ្លាទី៣។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី៨ នៃឃ្លាទី៤ នៃវគ្គទី១ ជួននឹងព្យាង្គទី៨ នៃឃ្លាទី២ នៃវគ្គទី២។',
    syllablesPattern: '៨-៨-៨-៨',
    linesPerStanza: 4
  },
  {
    id: 'bot_kaka_keti',
    nameKhmer: 'បទកាកគតិ',
    nameEnglish: 'Bot Kaka Keti (Chant of the Crow)',
    description: 'បទកាព្យបុរាណដ៏វិសេសវិសាល ដែលមានចលនាចង្វាក់ញាប់ ស្វាហាប់ ប្រើសម្រាប់ពិពណ៌នាការធ្វើដំណើរ ឬដំណើររឿងរំភើប។',
    rulesDescription: 'មួយវគ្គមាន ៧ ឃ្លា។ ឃ្លាទី១, ២, ៣, ៥, ៦ មាន ៤ ព្យាង្គ; ឃ្លាទី៤ និងទី៧ មាន ៦ ព្យាង្គ។ ព្យាង្គទី៤ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី៤ នៃឃ្លាទី២ និងឃ្លាទី៣។ ព្យាង្គទី៤ នៃឃ្លាទី៣ ជួននឹងព្យាង្គទី២ នៃឃ្លាទី៤។ ព្យាង្គទី៦ នៃឃ្លាទី៤ ជួននឹងព្យាង្គទី៤ នៃឃ្លាទី៥ និងឃ្លាទី៦។ ព្យាង្គទី៤ នៃឃ្លាទី៦ ជួននឹងព្យាង្គទី២ នៃឃ្លាទី៧។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី៦ នៃឃ្លាទី៧ នៃល្បះទី១ ជួននឹងព្យាង្គទី៦ នៃឃ្លាទី៤ នៃល្បះទី២។',
    syllablesPattern: '៤-៤-៤-៦-៤-៤-៦',
    linesPerStanza: 7
  },
  {
    id: 'bot_pumnol',
    nameKhmer: 'បទពំនោល',
    nameEnglish: 'Bot Pumnol (Narrative Verse)',
    description: 'ប្រើសម្រាប់ពោលរៀបរាប់ពីកំហឹងក្ដៅក្រហាយ ស្ទុះស្ទា ឬការគំរាមកំហែង និងការសន្ទនាបែបអង់អាច។',
    rulesDescription: 'មួយវគ្គមាន ៣ ឃ្លា។ ឃ្លាទី១ មាន ៦ ព្យាង្គ, ឃ្លាទី២ មាន ៤ ព្យាង្គ, ឃ្លាទី៣ មាន ៦ ព្យាង្គ។ ព្យាង្គទី៦ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី៤ នៃឃ្លាទី២។ ព្យាង្គទី៤ នៃឃ្លាទី២ ជួននឹងព្យាង្គទី២ នៃឃ្លាទី៣។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី៦ នៃឃ្លាទី៣ នៃវគ្គទី១ ជួននឹងព្យាង្គទី៦ នៃឃ្លាទី១ នៃវគ្គទី២។',
    syllablesPattern: '៦-៤-៦',
    linesPerStanza: 3
  },
  {
    id: 'bot_prohm_geeti',
    nameKhmer: 'បទ្រពហ្មគីតិ',
    nameEnglish: 'Bot Prohm Geeti (Chant of Brahma)',
    description: 'សម្រាប់សម្ដែងការសោកសៅ ទុក្ខសោក ការព្រាត់ប្រាស ឬការទូន្មានអប់រំចរិយាធម៌ដ៏ជ្រាលជ្រៅ។',
    rulesDescription: 'មួយវគ្គមាន ៤ ឃ្លា។ ឃ្លាទី១ និងទី៣ មាន ៥ ព្យាង្គ; ឃ្លាទី២ និងទី៤ មាន ៦ ព្យាង្គ។ ព្យាង្គទី៥ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី៣ នៃឃ្លាទី២។ ព្យាង្គទី៦ នៃឃ្លាទី២ ជួននឹងព្យាង្គទី៥ នៃឃ្លាទី៣ និងជួននឹងព្យាង្គទី៣ នៃឃ្លាទី៤។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី៦ នៃឃ្លាទី៤ នៃវគ្គទី១ ជួននឹងព្យាង្គទី៦ នៃឃ្លាទី២ នៃវគ្គទី២។',
    syllablesPattern: '៥-៦-៥-៦',
    linesPerStanza: 4
  },
  {
    id: 'bot_bantoal_kaka',
    nameKhmer: 'បទបន្ទោលកាក',
    nameEnglish: 'Bot Bantoal Kaka (Leaping Frog)',
    description: 'ប្រើសម្រាប់ពោលរៀបរាប់ដំណើររឿង សោកសៅ លន្លង់លន្លោច ព្រាត់ប្រាស និងការទូន្មានអប់រំចិត្តគំនិត។',
    rulesDescription: 'មួយវគ្គមាន ៤ ឃ្លា។ ឃ្លាទី១ និងទី៣ មាន ៤ ព្យាង្គ; ឃ្លាទី២ និងទី៤ មាន ៦ ព្យាង្គ។ ព្យាង្គទី៤ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី២ ឬទី៤ នៃឃ្លាទី២។ ព្យាង្គទី៦ នៃឃ្លាទី២ ជួននឹងព្យាង្គទី៤ នៃឃ្លាទី៣ និងជួននឹងព្យាង្គទី២ ឬទី៤ នៃឃ្លាទី៤។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី៦ នៃឃ្លាទី៤ នៃវគ្គទី១ ជួននឹងព្យាង្គទី៦ នៃឃ្លាទី២ នៃវគ្គទី២។',
    syllablesPattern: '៤-៦-៤-៦',
    linesPerStanza: 4
  },
  {
    id: 'bot_phujong_leela',
    nameKhmer: 'បទភុជង្គលីលា',
    nameEnglish: 'Bot Phujong Leela (Crawling Serpent)',
    description: 'ចង្វាក់ដង្ហក់ដូចជានាគលូន ប្រើប្រាស់ក្នុងការធ្វើដំណើរតាមព្រៃភ្នំ ពិពណ៌នាសម្រស់ធម្មជាតិ និងព្រៃព្រឹក្សា។',
    rulesDescription: 'មួយវគ្គមាន ៣ ឃ្លា។ ឃ្លាទី១ មាន ៦ ព្យាង្គ, ឃ្លាទី២ និងទី៣ មាន ៤ ព្យាង្គ។ ព្យាង្គទី៦ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី៤ នៃឃ្លាទី២។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី៤ នៃឃ្លាទី៣ នៃវគ្គទី១ ជួននឹងព្យាង្គទី៦ នៃឃ្លាទី១ នៃវគ្គទី២។',
    syllablesPattern: '៦-៤-៤',
    linesPerStanza: 3
  },
  {
    id: 'bot_pake_6',
    nameKhmer: 'បទពាក្យ៦',
    nameEnglish: 'Bot Pake 6 (Six-Syllable)',
    description: 'កាព្យដែលមានប្រាំមួយព្យាង្គក្នុងមួយឃ្លា ពេញនិយមបំផុតក្នុងការសរសេររឿងប្រលោមលោកបុរាណ និងទំនុកច្រៀង។',
    rulesDescription: 'មួយវគ្គមាន ៤ ឃ្លា, មួយឃ្លាមាន ៦ ព្យាង្គ។ ព្យាង្គទី៦ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី២ ឬទី៤ នៃឃ្លាទី២។ ព្យាង្គទី៦ នៃឃ្លាទី២ ជួននឹងព្យាង្គទី៦ នៃឃ្លាទី៣។ ព្យាង្គទី៦ នៃឃ្លាទី៣ ជួននឹងព្យាង្គទី២ ឬទី៤ នៃឃ្លាទី៤។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី៦ នៃឃ្លាទី៤ នៃល្បះទី១ ជួននឹងព្យាង្គទី៦ នៃឃ្លាទី២ នៃល្បះទី២។',
    syllablesPattern: '៦-៦-៦-៦',
    linesPerStanza: 4
  },
  {
    id: 'bot_pake_7',
    nameKhmer: 'បទពាក្យ៧',
    nameEnglish: 'Bot Pake 7 (Seven-Syllable)',
    description: 'កាព្យដែលមានប្រាំពីរព្យាង្គក្នុងមួយឃ្លា ជាបទកាព្យដ៏សំខាន់សម្រាប់តែងការទូន្មានប្រៀនប្រដៅ និងសោកនាដកម្ម។',
    rulesDescription: 'មួយវគ្គមាន ៤ ឃ្លា, មួយឃ្លាមាន ៧ ព្យាង្គ។ ព្យាង្គទី៧ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី២ ឬទី៤ នៃឃ្លាទី២។ ព្យាង្គទី៧ នៃឃ្លាទី២ ជួននឹងព្យាង្គទី៧ នៃឃ្លាទី៣។ ព្យាង្គទី៧ នៃឃ្លាទី៣ ជួននឹងព្យាង្គទី២ ឬទី៤ នៃឃ្លាទី៤។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី៧ នៃឃ្លាទី៤ នៃល្បះទី១ ជួននឹងព្យាង្គទី៧ នៃឃ្លាទី២ នៃល្បះទី២។',
    syllablesPattern: '៧-៧-៧-៧',
    linesPerStanza: 4
  },
  {
    id: 'bot_pake_8',
    nameKhmer: 'បទពាក្យ៨',
    nameEnglish: 'Bot Pake 8 (Eight-Syllable)',
    description: 'ពេញនិយមបំផុតក្នុងការតែងកំណាព្យទំនើប ទំនុកច្រៀង និងកាព្យអប់រំសីលធម៌ សច្ចធម៌សង្គម។',
    rulesDescription: 'មួយវគ្គមាន ៤ ឃ្លា, មួយឃ្លាមាន ៨ ព្យាង្គ។ ព្យាង្គទី៨ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី៣ ឬទី៥ នៃឃ្លាទី២។ ព្យាង្គទី៨ នៃឃ្លាទី២ ជួននឹងព្យាង្គទី៨ នៃឃ្លាទី៣។ ព្យាង្គទី៨ នៃឃ្លាទី៣ ជួននឹងព្យាង្គទី៤ ឬទី៥ នៃឃ្លាទី៤។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី៨ នៃឃ្លាទី៤ នៃល្បះទី១ ជួននឹងព្យាង្គទី៨ នៃឃ្លាទី២ នៃល្បះទី២។',
    syllablesPattern: '៨-៨-៨-៨',
    linesPerStanza: 4
  },
  {
    id: 'bot_pake_9',
    nameKhmer: 'បទពាក្យ៩',
    nameEnglish: 'Bot Pake 9 (Nine-Syllable)',
    description: 'ចង្វាក់បីៗព្យាង្គ (៣-៣-៣) ពិរោះរណ្ដំចិត្ត ប្រើសម្រាប់ពិពណ៌នារឿងរ៉ាវពិស្ដារ និងការរៀបរាប់ធំៗ។',
    rulesDescription: 'មួយវគ្គមាន ៤ ឃ្លា, មួយឃ្លាមាន ៩ ព្យាង្គ។ ព្យាង្គទី៩ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី៣ ឬទី៦ នៃឃ្លាទី២។ ព្យាង្គទី៩ នៃឃ្លាទី២ ជួននឹងព្យាង្គទី៩ នៃឃ្លាទី៣។ ព្យាង្គទី៩ នៃឃ្លាទី៣ ជួននឹងព្យាង្គទី៣ ឬទី៦ នៃឃ្លាទី៤។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី៩ នៃឃ្លាទី៤ នៃល្បះទី១ ជួននឹងព្យាង្គទី៩ នៃឃ្លាទី២ នៃល្បះទី២។',
    syllablesPattern: '៩-៩-៩-៩',
    linesPerStanza: 4
  },
  {
    id: 'bot_pake_10',
    nameKhmer: 'បទពាក្យ១០',
    nameEnglish: 'Bot Pake 10 (Ten-Syllable)',
    description: 'ចង្វាក់វែង ផ្ដល់នូវកម្លាំងសូត្ររៀបរាប់ពីច្បាប់រដ្ឋធម្មនុញ្ញ សិទ្ធិសេរីភាព និងទស្សនវិជ្ជាជ្រៅៗ។',
    rulesDescription: 'មួយវគ្គមាន ៤ ឃ្លា, មួយឃ្លាមាន ១០ ព្យាង្គ។ ព្យាង្គទី១០ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី៥ នៃឃ្លាទី២។ ព្យាង្គទី១០ នៃឃ្លាទី២ ជួននឹងព្យាង្គទី១០ នៃឃ្លាទី៣។ ព្យាង្គទី១០ នៃឃ្លាទី៣ ជួននឹងព្យាង្គទី៥ នៃឃ្លាទី៤។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី១០ នៃឃ្លាទី៤ នៃល្បះទី១ ជួននឹងព្យាង្គទី១០ នៃឃ្លាទី២ នៃល្បះទី២។',
    syllablesPattern: '១០-១០-១០-១០',
    linesPerStanza: 4
  },
  {
    id: 'bot_pake_11',
    nameKhmer: 'បទពាក្យ១១',
    nameEnglish: 'Bot Pake 11 (Eleven-Syllable)',
    description: 'ចង្វាក់វែងរណ្ដំដ៏ឧត្ដុង្គឧត្ដមបំផុត សម្រាប់ពិពណ៌នាធម៌អាថ៌ ឬកិច្ចការធំធេង និងសម្រស់ធម្មជាតិ។',
    rulesDescription: 'មួយវគ្គមាន ៤ ឃ្លា, មួយឃ្លាមាន ១១ ព្យាង្គ។ ព្យាង្គទី១១ នៃឃ្លាទី១ ជួននឹងព្យាង្គទី៣ នៃឃ្លាទី២។ ព្យាង្គទី១១ នៃឃ្លាទី២ ជួននឹងព្យាង្គទី១១ នៃឃ្លាទី៣។ ព្យាង្គទី១១ នៃឃ្លាទី៣ ជួននឹងព្យាង្គទី៣ នៃឃ្លាទី៤។ ចួនឆ្លងល្បះ៖ ព្យាង្គទី១១ នៃឃ្លាទី៤ នៃល្បះទី១ ជួននឹងព្យាង្គទី១១ នៃឃ្លាទី២ នៃល្បះទី២។',
    syllablesPattern: '១១-១១-១១-១១',
    linesPerStanza: 4
  }
];

// Sample default topics in Khmer
const SAMPLE_TOPICS = [
  'សេចក្ដីស្រឡាញ់ចំពោះមាតុភូមិខ្មែរ',
  'គុណូបការៈគុណឪពុកម្ដាយ',
  'សម្រស់ធម្មជាតិនៃខេត្តមណ្ឌលគិរី',
  'តម្លៃនៃការសិក្សាអប់រំ និងចំណេះដឹង',
  'វប្បធម៌ និងប្រាសាទអង្គរវត្តបុរាណ',
  'សាមគ្គីភាព និងសន្តិភាពក្នុងសង្គម'
];

export default function App() {
  // Tabs State
  const [activeTab, setActiveTab] = useState<'create' | 'analyze' | 'rules' | 'rhymes' | 'saved'>('create');

  // Generation Form States
  const [topic, setTopic] = useState('');
  const [poemType, setPoemType] = useState<PoemType>('bot_pake_7');
  const [stanzas, setStanzas] = useState<number>(2);
  const [additional, setAdditional] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedPoem, setGeneratedPoem] = useState<PoemResponse | null>(null);

  // Analysis Form States
  const [userPoem, setUserPoem] = useState('');
  const [analysisPoemType, setAnalysisPoemType] = useState<PoemType>('bot_pake_7');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  // Rhyme Helper States
  const [searchWord, setSearchWord] = useState('');
  const [isSearchingRhymes, setIsSearchingRhymes] = useState(false);
  const [rhymeSuggestions, setRhymeSuggestions] = useState<{
    rhymingWord: string;
    suggestions: { word: string; meaning: string; tone: string }[];
  } | null>(null);
  const [rhymeError, setRhymeError] = useState<string | null>(null);

  // Hover Interactions for Rhymes
  // Format: "stanzaIndex-lineIndex-syllableIndex"
  const [hoveredSyllableKey, setHoveredSyllableKey] = useState<string | null>(null);

  // Local Storage for Saved Scrolls
  const [savedPoems, setSavedPoems] = useState<SavedPoem[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize and load saved poems
  useEffect(() => {
    try {
      const stored = localStorage.getItem('khmer_poetry_saved');
      if (stored) {
        setSavedPoems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved poems", e);
    }
  }, []);

  // Save changes helper
  const updateSavedPoems = (newList: SavedPoem[]) => {
    setSavedPoems(newList);
    localStorage.setItem('khmer_poetry_saved', JSON.stringify(newList));
  };

  // Action: Save Current Poem
  const handleSavePoem = () => {
    if (!generatedPoem) return;
    
    // Check if already saved
    const exists = savedPoems.some(p => p.content.title === generatedPoem.title);
    if (exists) return;

    const newSaved: SavedPoem = {
      id: Date.now().toString(),
      title: generatedPoem.title,
      poemType: generatedPoem.poemType,
      createdAt: new Date().toLocaleDateString('kh-KH'),
      topic: topic || 'ប្រធានបទគំរូ',
      content: generatedPoem
    };

    const updated = [newSaved, ...savedPoems];
    updateSavedPoems(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Action: Delete Saved Poem
  const handleDeleteSaved = (id: string) => {
    const updated = savedPoems.filter(p => p.id !== id);
    updateSavedPoems(updated);
  };

  // API Call: Generate Poem
  const handleGeneratePoem = async (e: FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedPoem(null);

    try {
      const response = await fetch('/api/generate-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          poemType,
          stanzaCount: stanzas,
          additionalInstructions: additional
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'មានបញ្ហាក្នុងការទាក់ទងទៅកាន់ប្រព័ន្ធបង្កើតកំណាព្យ។');
      }

      const data = await response.json();
      setGeneratedPoem(data);
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'ការបង្កើតកំណាព្យបានបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។');
    } finally {
      setIsGenerating(false);
    }
  };

  // API Call: Analyze User Poem
  const handleAnalyzePoem = async (e: FormEvent) => {
    e.preventDefault();
    if (!userPoem.trim()) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poemText: userPoem,
          poemType: analysisPoemType
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'មានបញ្ហាក្នុងការទាក់ទងទៅកាន់ប្រព័ន្ធវិភាគកំណាព្យ។');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'ការវិភាគកំណាព្យបានបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // API Call: Rhyme Finder
  const handleSearchRhymes = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchWord.trim()) return;

    setIsSearchingRhymes(true);
    setRhymeError(null);
    setRhymeSuggestions(null);

    try {
      const response = await fetch('/api/rhyme-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: searchWord })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'មានបញ្ហាក្នុងការទាក់ទងទៅកាន់ប្រព័ន្ធស្វែងរកពាក្យជួន។');
      }

      const data = await response.json();
      setRhymeSuggestions(data);
    } catch (err: any) {
      console.error(err);
      setRhymeError(err.message || 'ការស្វែងរកពាក្យជួនបានបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។');
    } finally {
      setIsSearchingRhymes(false);
    }
  };

  // Check if a syllable is rhyming with the hovered one
  const getSyllableRhymeRelation = (stanzaIdx: number, lineIdx: number, sylIdx: number, lineData: any) => {
    if (!hoveredSyllableKey) return { isHovered: false, isRelated: false };

    const [hStanza, hLine, hSyl] = hoveredSyllableKey.split('-').map(Number);
    const isSelf = hStanza === stanzaIdx && hLine === lineIdx && hSyl === sylIdx;

    if (isSelf) return { isHovered: true, isRelated: false };

    // Check if the currently hovered syllable points to this item as a rhyme target
    // Or if this item points to the hovered one.
    let isRelated = false;

    // Check if the hovered syllable is in a line that has rhyming data
    const hoverStanzaData = generatedPoem?.stanzas[hStanza];
    const hoverLineData = hoverStanzaData?.lines[hLine];

    if (hoverLineData?.rhymesWith) {
      for (const rhyme of hoverLineData.rhymesWith) {
        // Calculate target stanza index based on offset if cross-stanza
        const targetStanzaIdx = rhyme.isCrossStanza 
          ? hStanza + (rhyme.crossStanzaOffset || 0) 
          : hStanza;

        if (targetStanzaIdx === stanzaIdx && rhyme.lineIndex === lineIdx && rhyme.syllableIndex === sylIdx) {
          isRelated = true;
          break;
        }
      }
    }

    // Check if this current syllable points to the hovered one
    if (!isRelated && lineData?.rhymesWith) {
      for (const rhyme of lineData.rhymesWith) {
        const targetStanzaIdx = rhyme.isCrossStanza 
          ? stanzaIdx + (rhyme.crossStanzaOffset || 0) 
          : stanzaIdx;

        if (targetStanzaIdx === hStanza && rhyme.lineIndex === hLine && rhyme.syllableIndex === hSyl) {
          isRelated = true;
          break;
        }
      }
    }

    return { isHovered: false, isRelated };
  };

  const selectedPoemStyleDetail = POEM_STYLES.find(s => s.id === poemType);

  return (
    <div className="min-h-screen bg-parchment-50 selection:bg-parchment-300 selection:text-parchment-900 pb-16">
      
      {/* Visual Header inspired by elegant Royal Khmer Manuscript */}
      <header id="app-header" className="relative overflow-hidden bg-parchment-900 text-parchment-100 border-b-4 border-parchment-500 py-10 px-6 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c49b35_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
        
        {/* Decorative corner borders */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-parchment-400"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-parchment-400"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-parchment-400"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-parchment-400"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center space-x-2 bg-parchment-500/10 border border-parchment-500/40 px-4 py-1.5 rounded-full text-parchment-300 text-sm mb-4 font-khmer-body">
            <Sparkles className="w-4 h-4 text-parchment-500 animate-pulse" />
            <span>ក្បួនច្បាប់កាព្យសាស្រ្តខ្មែរ - វចនានុក្រមជួនណាត</span>
          </div>
          
          <h1 id="app-title" className="font-khmer-display text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-parchment-200 via-parchment-400 to-parchment-200 drop-shadow-md tracking-wide mb-3">
            តាក់តែងកំណាព្យខ្មែរ
          </h1>
          
          <p id="app-subtitle" className="font-khmer-body text-parchment-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            ប្រព័ន្ធបញ្ញាសិប្បនិម្មិតដំបូងបង្អស់ ដែលជួយអ្នកសិក្សា និងតែងនិពន្ធកំណាព្យខ្មែរតាមរចនាបថបុរាណ 
            ដោយផ្ទៀងផ្ទាត់ក្បួនជួនជើង ព្យាង្គ និងអក្ខរាវិរុទ្ធវចនានុក្រមសម្ដេចព្រះសង្ឃរាជ ជួន ណាត យ៉ាងត្រឹមត្រូវខ្ជាប់ខ្ជួន។
          </p>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div className="sticky top-0 z-40 bg-parchment-100 border-b border-parchment-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <nav id="main-navigation" className="flex overflow-x-auto space-x-1 py-3 scrollbar-none" aria-label="Tabs">
            <button
              id="tab-create"
              onClick={() => setActiveTab('create')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 font-khmer-body ${
                activeTab === 'create'
                  ? 'bg-parchment-900 text-parchment-100 shadow'
                  : 'text-parchment-900 hover:bg-parchment-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>តែងនិពន្ធស្វ័យប្រវត្ត</span>
            </button>
            <button
              id="tab-analyze"
              onClick={() => setActiveTab('analyze')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 font-khmer-body ${
                activeTab === 'analyze'
                  ? 'bg-parchment-900 text-parchment-100 shadow'
                  : 'text-parchment-900 hover:bg-parchment-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>វិភាគកំណាព្យរបស់អ្នក</span>
            </button>
            <button
              id="tab-rhymes"
              onClick={() => setActiveTab('rhymes')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 font-khmer-body ${
                activeTab === 'rhymes'
                  ? 'bg-parchment-900 text-parchment-100 shadow'
                  : 'text-parchment-900 hover:bg-parchment-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>ជំនួយស្វែងរកពាក្យជួន</span>
            </button>
            <button
              id="tab-rules"
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 font-khmer-body ${
                activeTab === 'rules'
                  ? 'bg-parchment-900 text-parchment-100 shadow'
                  : 'text-parchment-900 hover:bg-parchment-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>ក្បួនច្បាប់កាព្យខ្មែរ</span>
            </button>
            <button
              id="tab-saved"
              onClick={() => setActiveTab('saved')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 font-khmer-body relative ${
                activeTab === 'saved'
                  ? 'bg-parchment-900 text-parchment-100 shadow'
                  : 'text-parchment-900 hover:bg-parchment-200'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              <span>ក្រាំងរក្សាទុក</span>
              {savedPoems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-parchment-500 text-parchment-900 font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {savedPoems.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-8">

        {/* ==================== TAB 1: GENERATE POETRY ==================== */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Input Form */}
            <div className="lg:col-span-5 bg-parchment-100 rounded-2xl border border-parchment-300 p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-5 pointer-events-none transform translate-x-8 -translate-y-8">
                <BookOpen className="w-64 h-64" />
              </div>

              <h2 className="font-khmer-display text-xl font-bold text-parchment-900 border-b border-parchment-300 pb-3 mb-5 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-parchment-500" />
                <span>បង្កើតកំណាព្យថ្មី</span>
              </h2>

              <form onSubmit={handleGeneratePoem} className="space-y-5 relative z-10">
                
                {/* Topic selection */}
                <div>
                  <label className="block text-sm font-semibold text-parchment-900 mb-2 font-khmer-body">
                    ប្រធានបទ ឬអត្ថន័យដែលចង់បាន *
                  </label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ សាមគ្គីភាព, ទឹកដី, មាសឪពុក, សន្តិភាព..."
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-xl px-4 py-3 font-khmer-body text-parchment-900 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-parchment-500 focus:border-transparent transition-all"
                  />
                  
                  {/* Sample suggestions */}
                  <div className="mt-3">
                    <span className="text-xs text-parchment-600 font-khmer-body block mb-1.5">គំនិតប្រធានបទពេញនិយម៖</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SAMPLE_TOPICS.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTopic(sample)}
                          className="bg-parchment-200/60 hover:bg-parchment-200 text-parchment-900 text-xs px-2.5 py-1.5 rounded-md font-khmer-body transition"
                        >
                          {sample}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Poetry style dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-parchment-900 mb-2 font-khmer-body">
                    ប្រភេទបទកំណាព្យ *
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {POEM_STYLES.map((style) => (
                      <label 
                        key={style.id}
                        className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                          poemType === style.id 
                            ? 'bg-parchment-200/50 border-parchment-500 shadow-sm' 
                            : 'bg-parchment-50 border-parchment-300 hover:bg-parchment-200/20'
                        }`}
                      >
                        <input
                          type="radio"
                          name="poemType"
                          value={style.id}
                          checked={poemType === style.id}
                          onChange={() => setPoemType(style.id)}
                          className="mt-1 mr-3 accent-parchment-600"
                        />
                        <div className="font-khmer-body">
                          <span className="font-bold text-parchment-900 text-sm block">{style.nameKhmer} ({style.syllablesPattern})</span>
                          <span className="text-xs text-parchment-600 line-clamp-1">{style.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stanzas Count Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-parchment-900 font-khmer-body">
                      ចំនួនល្បះ (Stanzas)
                    </label>
                    <span className="bg-parchment-900 text-parchment-100 text-xs px-2 py-0.5 rounded-full font-mono font-bold">
                      {stanzas} ល្បះ
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={stanzas}
                    onChange={(e) => setStanzas(parseInt(e.target.value))}
                    className="w-full accent-parchment-600 cursor-pointer h-2 bg-parchment-300 rounded-lg"
                  />
                  <div className="flex justify-between text-xxs text-parchment-600 px-1 mt-1 font-mono">
                    <span>២ ល្បះ</span>
                    <span>៤ ល្បះ</span>
                    <span>៦ ល្បះ</span>
                  </div>
                </div>

                {/* Additional Instructions */}
                <div>
                  <label className="block text-sm font-semibold text-parchment-900 mb-2 font-khmer-body">
                    បំណងប្រាថ្នាបន្ថែម (ជាជម្រើស)
                  </label>
                  <textarea
                    value={additional}
                    onChange={(e) => setAdditional(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ សុំទម្រង់បែបកម្សត់, សុំប្រើពាក្យខ្មែរបុរាណឱ្យបានច្រើន, ឬប្រើពាក្យ 'បុប្ផា'..."
                    rows={2}
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-xl px-4 py-3 font-khmer-body text-parchment-900 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-parchment-500 focus:border-transparent transition-all resize-none text-sm"
                  />
                </div>

                {/* Error Banner */}
                {generationError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-khmer-body flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{generationError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-parchment-900 hover:bg-parchment-800 active:bg-black text-parchment-100 font-bold py-3.5 px-4 rounded-xl font-khmer-body shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-parchment-400" />
                      <span>កំពុងតែងនិពន្ធជាភាសាខ្មែរ...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-parchment-400" />
                      <span>ចងក្រងកំណាព្យ</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Output Scroll Preview */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              
              {!generatedPoem && !isGenerating && (
                <div className="flex-1 min-h-[450px] bg-parchment-100 border border-parchment-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-md">
                  <div className="w-20 h-20 bg-parchment-200/50 border border-parchment-300 rounded-full flex items-center justify-center mb-4 text-parchment-500">
                    <BookOpen className="w-10 h-10" />
                  </div>
                  <h3 className="font-khmer-display text-lg font-bold text-parchment-900 mb-2">ក្រាំងកំណាព្យទំនេរ</h3>
                  <p className="font-khmer-body text-parchment-600 text-sm max-w-sm leading-relaxed">
                    បំពេញព័ត៌មាន និងជ្រើសរើសប្រភេទកំណាព្យនៅខាងឆ្វេង រួចចុចប៊ូតុង <span className="font-semibold text-parchment-900">“ចងក្រងកំណាព្យ”</span> ដើម្បីទទួលបានអត្ថបទកំណាព្យចុងចួនពិរោះរណ្តំចិត្ត។
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="flex-1 min-h-[450px] bg-parchment-100 border border-parchment-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-md">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 border-4 border-parchment-300 border-t-parchment-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-parchment-600">
                      <Sparkles className="w-8 h-8 animate-pulse text-parchment-500" />
                    </div>
                  </div>
                  <h3 className="font-khmer-display text-xl font-bold text-parchment-900 mb-2">កំពុងតែងកំណាព្យយ៉ាងផ្ចិតផ្ចង់</h3>
                  <p className="font-khmer-body text-parchment-600 text-sm max-w-sm leading-relaxed">
                    បញ្ញាសិប្បនិម្មិតកំពុងរៀបចំប្រគុំពាក្យជួនចុងចួន និងជួនឆ្លងល្បះ ផ្ទៀងផ្ទាត់អក្ខរាវិរុទ្ធជាមួយវចនានុក្រមខ្មែរ...
                  </p>
                </div>
              )}

              {generatedPoem && (
                <div className="space-y-6">
                  
                  {/* Scroll Container */}
                  <div className="bg-parchment-100 border-2 border-parchment-300 rounded-2xl p-6 md:p-10 shadow-lg relative overflow-hidden">
                    
                    {/* Top Wood Scroll Bar Visual */}
                    <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-b from-parchment-900 to-parchment-600 rounded-t-xl"></div>
                    <div className="absolute -top-1 left-4 w-6 h-3 bg-amber-800 rounded-b-md shadow-sm"></div>
                    <div className="absolute -top-1 right-4 w-6 h-3 bg-amber-800 rounded-b-md shadow-sm"></div>

                    {/* Scroll Corner Decors */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-parchment-400"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-parchment-400"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-parchment-400"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-parchment-400"></div>

                    {/* Action buttons on Scroll */}
                    <div className="flex justify-end space-x-2 relative z-10 -mt-2 mb-6">
                      <button
                        onClick={handleSavePoem}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-khmer-body border transition-all ${
                          saveSuccess 
                            ? 'bg-green-50 border-green-300 text-green-700' 
                            : 'bg-parchment-50 border-parchment-300 hover:bg-parchment-200 text-parchment-900'
                        }`}
                      >
                        {saveSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span>បានរក្សាទុកក្នុងក្រាំង!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-parchment-500" />
                            <span>រក្សាទុកក្នុងក្រាំង</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-center max-w-lg mx-auto relative z-10">
                      
                      {/* Poem Title */}
                      <h3 className="font-khmer-display text-2xl md:text-3xl font-black text-parchment-900 tracking-wide mb-2">
                        {generatedPoem.title}
                      </h3>
                      
                      {/* Sub-label */}
                      <span className="inline-block bg-parchment-200 text-parchment-900 border border-parchment-300 font-khmer-body text-xs px-3 py-1 rounded-full font-semibold mb-8">
                        {generatedPoem.poemTypeKhmer} • {selectedPoemStyleDetail?.nameEnglish}
                      </span>

                      {/* Interactive Instruction Tip */}
                      <div className="mb-6 flex justify-center">
                        <span className="inline-flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 text-parchment-600 text-xxs font-khmer-body px-2.5 py-1 rounded-md">
                          <Info className="w-3.5 h-3.5 text-parchment-500" />
                          <span>ដាក់ក្បុយម៉ៅលើព្យាង្គពណ៌មាស ដើម្បីមើលក្បួនពាក្យជួនចុងចួន</span>
                        </span>
                      </div>

                      {/* Poem Text - Interactive Render */}
                      <div className="space-y-8 my-6">
                        {generatedPoem.stanzas.map((stanza, stanzaIdx) => (
                          <div key={stanzaIdx} className="space-y-4">
                            {stanza.lines.map((line, lineIdx) => (
                              <div key={lineIdx} className="flex flex-wrap justify-center items-center space-x-1.5 md:space-x-2">
                                
                                {line.syllables.map((syllable, sylIdx) => {
                                  const isRhymeWord = line.rhymeIndices?.includes(sylIdx);
                                  const key = `${stanzaIdx}-${lineIdx}-${sylIdx}`;
                                  const { isHovered, isRelated } = getSyllableRhymeRelation(stanzaIdx, lineIdx, sylIdx, line);

                                  return (
                                    <span
                                      key={sylIdx}
                                      onMouseEnter={() => isRhymeWord && setHoveredSyllableKey(key)}
                                      onMouseLeave={() => isRhymeWord && setHoveredSyllableKey(null)}
                                      className={`px-1 py-0.5 text-base md:text-lg font-khmer-display transition-all duration-150 rounded ${
                                        isHovered 
                                          ? 'bg-parchment-900 text-parchment-100 scale-110 shadow-md font-bold' 
                                          : isRelated 
                                            ? 'bg-parchment-500 text-parchment-900 scale-110 ring-2 ring-parchment-500 shadow-sm font-bold animate-pulse'
                                            : isRhymeWord 
                                              ? 'text-parchment-600 font-bold underline decoration-parchment-400 decoration-2 cursor-pointer hover:bg-parchment-200' 
                                              : 'text-parchment-900'
                                      }`}
                                    >
                                      {syllable}
                                    </span>
                                  );
                                })}

                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Bottom Wood Scroll Bar Visual */}
                      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-parchment-400 to-transparent mx-auto mt-8 mb-6"></div>

                      {/* Poetic Meaning Summary */}
                      <div className="bg-parchment-50 rounded-xl p-4 border border-parchment-200 text-left mt-6">
                        <h4 className="font-khmer-display text-sm font-bold text-parchment-900 flex items-center space-x-1.5 mb-2">
                          <BookMarked className="w-4 h-4 text-parchment-500" />
                          <span>អត្ថន័យរួមនៃកំណាព្យ</span>
                        </h4>
                        <p className="font-khmer-body text-xs text-parchment-700 leading-relaxed">
                          {generatedPoem.meaning}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Glossary Vocabulary Breakdown */}
                  <div className="bg-parchment-100 border border-parchment-300 rounded-2xl p-6 shadow-md">
                    <h3 className="font-khmer-display text-base font-bold text-parchment-900 border-b border-parchment-300 pb-3 mb-4 flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-parchment-500" />
                      <span>វចនានុក្រមពាក្យពិបាក និងអក្សរសិល្ប៍ក្នុងកំណាព្យ</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedPoem.vocabulary.map((vocab, index) => (
                        <div key={index} className="p-3 bg-parchment-50 border border-parchment-200 rounded-xl">
                          <span className="font-khmer-display font-bold text-parchment-900 text-sm block border-b border-parchment-200 pb-1 mb-1.5">
                            {vocab.word}
                          </span>
                          <p className="font-khmer-body text-xs text-parchment-600 leading-relaxed">
                            {vocab.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}


        {/* ==================== TAB 2: ANALYZE POETRY ==================== */}
        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form Column */}
            <div className="lg:col-span-5 bg-parchment-100 rounded-2xl border border-parchment-300 p-6 shadow-md">
              <h2 className="font-khmer-display text-xl font-bold text-parchment-900 border-b border-parchment-300 pb-3 mb-5 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-parchment-500" />
                <span>ផ្ទៀងផ្ទាត់ និងកែលម្អ</span>
              </h2>

              <form onSubmit={handleAnalyzePoem} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-parchment-900 mb-2 font-khmer-body">
                    ជ្រើសរើសប្រភេទបទកំណាព្យ *
                  </label>
                  <select
                    value={analysisPoemType}
                    onChange={(e) => setAnalysisPoemType(e.target.value as PoemType)}
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-xl px-4 py-3 font-khmer-body text-parchment-900 focus:outline-none focus:ring-2 focus:ring-parchment-500 transition-all text-sm"
                  >
                    {POEM_STYLES.map((style) => (
                      <option key={style.id} value={style.id}>
                        {style.nameKhmer} ({style.syllablesPattern})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-parchment-900 mb-2 font-khmer-body">
                    បញ្ចូលអត្ថបទកំណាព្យរបស់អ្នក *
                  </label>
                  <textarea
                    required
                    value={userPoem}
                    onChange={(e) => setUserPoem(e.target.value)}
                    placeholder="សូមសរសេរ ឬចម្លងកំណាព្យរបស់អ្នកដាក់ទីនេះ..."
                    rows={10}
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-xl px-4 py-3 font-khmer-body text-parchment-900 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-parchment-500 focus:border-transparent transition-all text-sm leading-relaxed"
                  />
                </div>

                {analysisError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-khmer-body flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{analysisError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full bg-parchment-900 hover:bg-parchment-800 active:bg-black text-parchment-100 font-bold py-3.5 px-4 rounded-xl font-khmer-body shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-parchment-400" />
                      <span>កំពុងផ្ទៀងផ្ទាត់ និងស្វែងរកកំហុស...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-parchment-400" />
                      <span>ផ្ទៀងផ្ទាត់លក្ខណៈបច្ចេកទេស</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Analysis Result Column */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              
              {!analysisResult && !isAnalyzing && (
                <div className="flex-1 min-h-[450px] bg-parchment-100 border border-parchment-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-md">
                  <div className="w-20 h-20 bg-parchment-200/50 border border-parchment-300 rounded-full flex items-center justify-center mb-4 text-parchment-500">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h3 className="font-khmer-display text-lg font-bold text-parchment-900 mb-2">លទ្ធផលផ្ទៀងផ្ទាត់កាព្យ</h3>
                  <p className="font-khmer-body text-parchment-600 text-sm max-w-sm leading-relaxed">
                    បញ្ចូលអត្ថបទកំណាព្យរបស់អ្នក រួចចុចប៊ូតុង <span className="font-semibold text-parchment-900">“ផ្ទៀងផ្ទាត់លក្ខណៈបច្ចេកទេស”</span> ដើម្បីផ្ទៀងផ្ទាត់ចំនួនព្យាង្គ គំនូសជួនជើង និងអក្ខរាវិរុទ្ធវចនានុក្រមខ្មែរ។
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex-1 min-h-[450px] bg-parchment-100 border border-parchment-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-md">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 border-4 border-parchment-300 border-t-parchment-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-parchment-600">
                      <FileText className="w-8 h-8 animate-pulse text-parchment-500" />
                    </div>
                  </div>
                  <h3 className="font-khmer-display text-xl font-bold text-parchment-900 mb-2">កំពុងវិភាគកាព្យយ៉ាងហ្មត់ចត់</h3>
                  <p className="font-khmer-body text-parchment-600 text-sm max-w-sm leading-relaxed">
                    ប្រព័ន្ធកំពុងរាប់ព្យាង្គតាមឃ្លានីមួយៗ សិក្សាសូរសព្ទចុងចួន និងផ្ទៀងផ្ទាត់អក្ខរាវិរុទ្ធជាមួយវចនានុក្រមខ្មែរ Chuon Nath...
                  </p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6">
                  
                  {/* Score & General Advice */}
                  <div className="bg-parchment-100 border border-parchment-300 rounded-2xl p-6 shadow-md relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex items-center justify-center">
                      <div className="relative">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle cx="40" cy="40" r="34" stroke="#eadebc" strokeWidth="6" fill="transparent" />
                          <circle 
                            cx="40" 
                            cy="40" 
                            r="34" 
                            stroke="#c49b35" 
                            strokeWidth="6" 
                            fill="transparent" 
                            strokeDasharray={2 * Math.PI * 34}
                            strokeDashoffset={2 * Math.PI * 34 * (1 - analysisResult.overallScore / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-bold font-mono text-parchment-900">{analysisResult.overallScore}</span>
                          <span className="text-xxs font-khmer-body text-parchment-600">ពិន្ទុ</span>
                        </div>
                      </div>
                    </div>

                    <div className="pr-24">
                      <h3 className="font-khmer-display text-lg font-bold text-parchment-900 mb-2">
                        {analysisResult.isValid ? '🏆 កាព្យត្រឹមត្រូវតាមក្បួនខ្នាត!' : '📝 ត្រូវការកែលម្អបន្ថែម'}
                      </h3>
                      <p className="font-khmer-body text-xs text-parchment-700 leading-relaxed">
                        {analysisResult.generalFeedback}
                      </p>
                    </div>
                  </div>

                  {/* Orthography/Spelling Section */}
                  <div className="bg-parchment-100 border border-parchment-300 rounded-2xl p-6 shadow-md">
                    <h3 className="font-khmer-display text-base font-bold text-parchment-900 border-b border-parchment-300 pb-3 mb-4 flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span>កំហុសអក្ខរាវិរុទ្ធដែលបានរកឃើញ ({analysisResult.spellingFeedback.length})</span>
                    </h3>

                    {analysisResult.spellingFeedback.length === 0 ? (
                      <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-khmer-body flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>អបអរសាទរ! មិនមានកំហុសអក្ខរាវិរុទ្ធត្រូវបានរកឃើញនៅក្នុងកំណាព្យរបស់អ្នកឡើយ។</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {analysisResult.spellingFeedback.map((fb, idx) => (
                          <div key={idx} className="p-4 bg-amber-50 border border-amber-200 rounded-xl font-khmer-body">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <span className="text-sm font-bold text-red-600 bg-red-100 px-2.5 py-0.5 rounded-md">
                                {fb.word}
                              </span>
                              <div className="flex items-center space-x-1.5 text-xs text-green-700">
                                <ArrowRight className="w-3.5 h-3.5" />
                                <span className="font-bold bg-green-100 px-2.5 py-0.5 rounded-md">{fb.correction}</span>
                              </div>
                            </div>
                            <p className="text-xs text-parchment-700 leading-relaxed">
                              {fb.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Syllables Verification */}
                  <div className="bg-parchment-100 border border-parchment-300 rounded-2xl p-6 shadow-md">
                    <h3 className="font-khmer-display text-base font-bold text-parchment-900 border-b border-parchment-300 pb-3 mb-4 flex items-center space-x-2">
                      <Music className="w-5 h-5 text-parchment-500" />
                      <span>ការត្រួតពិនិត្យចំនួនព្យាង្គតាមឃ្លា</span>
                    </h3>

                    <div className="space-y-3">
                      {analysisResult.syllableFeedback.map((feedback, idx) => {
                        const isCorrect = feedback.expectedCount === feedback.actualCount;
                        return (
                          <div key={idx} className={`p-3.5 border rounded-xl font-khmer-body flex items-start justify-between ${
                            isCorrect 
                              ? 'bg-green-50/50 border-green-200 text-green-900' 
                              : 'bg-red-50/50 border-red-200 text-red-900'
                          }`}>
                            <div>
                              <span className="text-xs font-bold block text-parchment-800 mb-1">ល្បះទី {feedback.stanzaIndex + 1} • ឃ្លាទី {feedback.lineIndex + 1}</span>
                              <p className="text-xs text-parchment-600">{feedback.message}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-mono font-bold block">
                                {feedback.actualCount} / {feedback.expectedCount} ព្យាង្គ
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {isCorrect ? 'ត្រូវចង្វាក់' : 'ខុសចង្វាក់'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rhyme Feedback */}
                  <div className="bg-parchment-100 border border-parchment-300 rounded-2xl p-6 shadow-md">
                    <h3 className="font-khmer-display text-base font-bold text-parchment-900 border-b border-parchment-300 pb-3 mb-4 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-parchment-500" />
                      <span>ការពិនិត្យពាក្យជួនចុងចួន</span>
                    </h3>

                    <div className="space-y-3">
                      {analysisResult.rhymeFeedback.map((feedback, idx) => (
                        <div key={idx} className={`p-4 border rounded-xl font-khmer-body ${
                          feedback.isCorrect 
                            ? 'bg-green-50/50 border-green-200' 
                            : 'bg-red-50/50 border-red-200'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-parchment-800">ល្បះទី {feedback.stanzaIndex + 1} • ឃ្លាទី {feedback.lineIndex + 1}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {feedback.isCorrect ? 'ចួនល្អ' : 'ខុសច្បាប់ចួន'}
                            </span>
                          </div>
                          
                          <p className="text-xs text-parchment-700 leading-relaxed mb-3">
                            {feedback.message}
                          </p>

                          {!feedback.isCorrect && feedback.suggestedRhymes && feedback.suggestedRhymes.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-red-200">
                              <span className="text-xs font-semibold text-red-800 block mb-1">ពាក្យជំនួសដែលអាចជួនបានពិរោះ៖</span>
                              <div className="flex flex-wrap gap-1.5">
                                {feedback.suggestedRhymes.map((word, wIdx) => (
                                  <span key={wIdx} className="bg-green-100 text-green-900 text-xs px-2 py-1 rounded font-bold">
                                    {word}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}


        {/* ==================== TAB 3: RHYME SUGGESTIONS HELPER ==================== */}
        {activeTab === 'rhymes' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-parchment-100 border border-parchment-300 rounded-2xl p-6 md:p-8 shadow-md">
              <h2 className="font-khmer-display text-xl md:text-2xl font-bold text-parchment-900 border-b border-parchment-300 pb-3 mb-6 flex items-center space-x-2">
                <Search className="w-6 h-6 text-parchment-500" />
                <span>ស្វែងរកពាក្យជួនចុងចួន (Rhyme Suggestion Engine)</span>
              </h2>

              <p className="font-khmer-body text-xs text-parchment-600 leading-relaxed mb-6">
                តើអ្នកកំពុងទាល់គំនិតក្នុងការរកនឹកពាក្យចុងចួនមែនទេ? បញ្ចូលពាក្យខ្មែរណាមួយដែលអ្នកចង់ស្វែងរកដៃគូចុងចួន 
                ប្រព័ន្ធនឹងបង្ហាញពាក្យកំណាព្យពិរោះៗជាច្រើន ព្រមទាំងមាននិយមន័យពាក្យ និងសំនៀងមនោសញ្ចេតនាយ៉ាងលម្អិត។
              </p>

              <form onSubmit={handleSearchRhymes} className="flex flex-col sm:flex-row gap-3 mb-8">
                <input
                  type="text"
                  required
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  placeholder="ឧទាហរណ៍៖ សិក្សា, ស្នេហា, វាសនា, រាត្រី..."
                  className="flex-1 bg-parchment-50 border border-parchment-300 rounded-xl px-4 py-3.5 font-khmer-body text-parchment-900 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-parchment-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={isSearchingRhymes}
                  className="bg-parchment-900 hover:bg-parchment-800 active:bg-black text-parchment-100 font-bold px-6 py-3.5 rounded-xl font-khmer-body shadow-md hover:shadow-lg transition-all duration-150 disabled:opacity-50 flex items-center justify-center space-x-2 shrink-0"
                >
                  {isSearchingRhymes ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-parchment-400" />
                      <span>កំពុងរាវរកពាក្យជួន...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 text-parchment-400" />
                      <span>រកពាក្យជួន</span>
                    </>
                  )}
                </button>
              </form>

              {rhymeError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-khmer-body flex items-start space-x-2 mb-6">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{rhymeError}</span>
                </div>
              )}

              {/* Suggestions results block */}
              {rhymeSuggestions ? (
                <div className="space-y-6">
                  <div className="p-4 bg-parchment-200/50 border border-parchment-300 rounded-xl">
                    <span className="font-khmer-body text-xs text-parchment-600 block mb-1">ពាក្យដែលចង់ចួន៖</span>
                    <span className="font-khmer-display text-2xl font-bold text-parchment-900">
                      « {rhymeSuggestions.rhymingWord} »
                    </span>
                  </div>

                  <h3 className="font-khmer-display text-base font-bold text-parchment-900 flex items-center space-x-1.5">
                    <Lightbulb className="w-5 h-5 text-parchment-500" />
                    <span>លទ្ធផលពាក្យជួនចុងចួនដែលណែនាំ ({rhymeSuggestions.suggestions?.length || 0})</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rhymeSuggestions.suggestions?.map((item, idx) => (
                      <div key={idx} className="bg-parchment-50 border border-parchment-200 rounded-xl p-4 transition-all hover:border-parchment-300 hover:shadow-sm">
                        <div className="flex items-center justify-between border-b border-parchment-200 pb-2 mb-2">
                          <span className="font-khmer-display font-bold text-parchment-900 text-base">
                            {item.word}
                          </span>
                          <span className="bg-parchment-200/60 text-parchment-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-khmer-body">
                            {item.tone || 'ទូទៅ'}
                          </span>
                        </div>
                        <p className="font-khmer-body text-xs text-parchment-600 leading-relaxed">
                          {item.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                !isSearchingRhymes && (
                  <div className="p-8 text-center border-2 border-dashed border-parchment-300 rounded-xl">
                    <span className="text-sm font-khmer-body text-parchment-500 block">ពុំទាន់មានការស្វែងរកនៅឡើយទេ</span>
                  </div>
                )
              )}

            </div>
          </div>
        )}


        {/* ==================== TAB 4: POETRY RULES CATALOG ==================== */}
        {activeTab === 'rules' && (
          <div className="space-y-8">
            <div className="bg-parchment-100 border border-parchment-300 rounded-2xl p-6 md:p-8 shadow-md">
              <h2 className="font-khmer-display text-xl md:text-2xl font-bold text-parchment-900 border-b border-parchment-300 pb-3 mb-6 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-parchment-500" />
                <span>ក្បួនខ្នាតច្បាប់កាព្យខ្មែរ (Traditional Poetry Schemas)</span>
              </h2>

              <p className="font-khmer-body text-xs text-parchment-600 leading-relaxed mb-6">
                កំណាព្យខ្មែរមានច្រើនបែបច្រើនបទ ដោយនីមួយៗត្រូវបានកំណត់ទៅដោយចំនួនព្យាង្គ និងក្បួនជួន (ពាក្យជួនចុងចួន និងចួនឆ្លងល្បះ) យ៉ាងម៉ត់ចត់។ ស្វែងយល់ពីគ្រោងសាងនៃបទនីមួយៗខាងក្រោម៖
              </p>

              <div className="space-y-6">
                {POEM_STYLES.map((style) => (
                  <div key={style.id} className="bg-parchment-50 border border-parchment-200 rounded-xl p-5 md:p-6 transition-all hover:border-parchment-400">
                    <div className="flex flex-wrap items-center justify-between border-b border-parchment-200 pb-3 mb-4 gap-2">
                      <div>
                        <h3 className="font-khmer-display text-lg font-bold text-parchment-900 block">{style.nameKhmer}</h3>
                        <span className="text-xs text-parchment-600 font-khmer-body">{style.nameEnglish}</span>
                      </div>
                      <div className="bg-parchment-900 text-parchment-100 text-xs px-3 py-1 rounded-full font-mono font-bold">
                        ទម្រង់ព្យាង្គ៖ {style.syllablesPattern}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-khmer-body">
                      <div>
                        <span className="text-xs font-bold text-parchment-900 block mb-1.5">ព័ត៌មានលម្អិត៖</span>
                        <p className="text-xs text-parchment-700 leading-relaxed">
                          {style.description}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-parchment-900 block mb-1.5">ច្បាប់ជួនកាព្យ៖</span>
                        <p className="text-xs text-parchment-600 leading-relaxed">
                          {style.rulesDescription}
                        </p>
                      </div>
                    </div>

                    {/* Visual Syllables Rhyming Connection Diagrams */}
                    <div className="mt-5 pt-4 border-t border-parchment-200 bg-parchment-100/50 rounded-lg p-4">
                      <span className="text-xs font-bold text-parchment-900 block mb-3 font-khmer-body">រូបភាពគំនូសជើងកាព្យ (Rhyme Diagram Scheme) :</span>
                      
                      {style.id === 'bot_pake_4' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span className="bg-parchment-200 px-2 py-1 rounded">◯</span>
                            <span className="bg-parchment-200 px-2 py-1 rounded">◯</span>
                            <span className="bg-parchment-200 px-2 py-1 rounded">◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-1 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span className="bg-parchment-200 px-2 py-1 rounded">◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-1 rounded">❶</span>
                            <span className="bg-parchment-200 px-2 py-1 rounded">◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-1 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span className="bg-parchment-200 px-2 py-1 rounded">◯</span>
                            <span className="bg-parchment-200 px-2 py-1 rounded">◯</span>
                            <span className="bg-parchment-200 px-2 py-1 rounded">◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-1 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៤:</span>
                            <span className="bg-parchment-200 px-2 py-1 rounded">◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-1 rounded">❷</span>
                            <span className="bg-parchment-200 px-2 py-1 rounded">◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-1 rounded">❸</span>
                          </div>
                          <span className="block text-[10px] text-parchment-600 font-khmer-body mt-2">ព្យាង្គលេខដូចគ្នា (❶, ❷) ត្រូវតែជាពាក្យជួនគ្នា។ ❸ ជួនឆ្លងទៅល្បះបន្ទាប់។</span>
                        </div>
                      )}

                      {style.id === 'bot_pake_6' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                            <span>◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៤:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                            <span>◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❸</span>
                          </div>
                        </div>
                      )}

                      {style.id === 'bot_pake_7' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                            <span>◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៤:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                            <span>◯ ◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❸</span>
                          </div>
                        </div>
                      )}

                      {style.id === 'bot_pathyavatta' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៤:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❸</span>
                          </div>
                        </div>
                      )}

                      {style.id === 'bot_kaka_keti' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៤:</span>
                            <span>◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៥:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៦:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៧:</span>
                            <span>◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❸</span>
                          </div>
                        </div>
                      )}

                      {style.id === 'bot_pumnol' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❷</span>
                          </div>
                        </div>
                      )}

                      {style.id === 'bot_prohm_geeti' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                            <span>◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៤:</span>
                            <span>◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                            <span>◯ ◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❸</span>
                          </div>
                        </div>
                      )}

                      {style.id === 'bot_bantoal_kaka' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៤:</span>
                            <span>◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❸</span>
                          </div>
                        </div>
                      )}

                      {style.id === 'bot_phujong_leela' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❷</span>
                          </div>
                        </div>
                      )}

                      {style.id === 'bot_pake_8' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                            <span>◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៤:</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                            <span>◯ ◯ ◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❸</span>
                          </div>
                        </div>
                      )}

                      {style.id === 'bot_pake_9' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                            <span>◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៤:</span>
                            <span>◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                            <span>◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❸</span>
                          </div>
                        </div>
                      )}

                      {style.id === 'bot_pake_10' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                            <span>◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៤:</span>
                            <span>◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                            <span>◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❸</span>
                          </div>
                        </div>
                      )}

                      {style.id === 'bot_pake_11' && (
                        <div className="space-y-3 font-mono text-xs text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ១:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ២:</span>
                            <span>◯ ◯</span>
                            <span className="bg-amber-400 font-bold text-parchment-900 px-2 py-0.5 rounded">❶</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៣:</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                          </div>
                          <div className="flex justify-center items-center space-x-2">
                            <span>ឃ្លា ៤:</span>
                            <span>◯ ◯</span>
                            <span className="bg-amber-600 font-bold text-parchment-100 px-2 py-0.5 rounded">❷</span>
                            <span>◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯</span>
                            <span className="bg-red-500 font-bold text-white px-2 py-0.5 rounded">❸</span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}


        {/* ==================== TAB 5: SAVED SCROLLS ==================== */}
        {activeTab === 'saved' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-parchment-100 border border-parchment-300 rounded-2xl p-6 md:p-8 shadow-md">
              <h2 className="font-khmer-display text-xl md:text-2xl font-bold text-parchment-900 border-b border-parchment-300 pb-3 mb-6 flex items-center space-x-2">
                <BookMarked className="w-6 h-6 text-parchment-500" />
                <span>ក្រាំងរក្សាទុកកំណាព្យ (Your Saved Poetry scrolls)</span>
              </h2>

              {savedPoems.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-parchment-300 rounded-xl">
                  <Bookmark className="w-12 h-12 text-parchment-300 mx-auto mb-3" />
                  <span className="text-sm font-khmer-body text-parchment-600 block mb-2">ពុំទាន់មានកំណាព្យរក្សាទុកក្នុងក្រាំងនៅឡើយទេ</span>
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="inline-flex items-center space-x-1 bg-parchment-900 hover:bg-parchment-800 text-parchment-100 text-xs px-3.5 py-2 rounded-lg font-khmer-body font-semibold shadow transition"
                  >
                    <span>ទៅកាន់តែងនិពន្ធ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {savedPoems.map((item) => (
                    <div key={item.id} className="bg-parchment-50 border-2 border-parchment-300 rounded-xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-parchment-500"></div>
                      
                      {/* Saved scroll item header */}
                      <div className="flex flex-wrap items-center justify-between border-b border-parchment-200 pb-3 mb-4 gap-2">
                        <div>
                          <h3 className="font-khmer-display text-lg font-bold text-parchment-900 block">{item.title}</h3>
                          <span className="text-[10px] text-parchment-600 font-khmer-body block mt-0.5">ប្រធានបទ៖ {item.topic} • រក្សាទុកកាលពី៖ {item.createdAt}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-parchment-200/80 text-parchment-950 text-[10px] font-bold px-2.5 py-1 rounded-full font-khmer-body">
                            {POEM_STYLES.find(s => s.id === item.poemType)?.nameKhmer || item.poemType}
                          </span>
                          <button
                            onClick={() => handleDeleteSaved(item.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg border border-red-200 transition-all shadow-sm"
                            title="លុបចេញពីក្រាំង"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content representation */}
                      <div className="space-y-5 text-center my-4">
                        {item.content.stanzas?.map((stanza, sIdx) => (
                          <div key={sIdx} className="space-y-2 font-khmer-display text-base text-parchment-900 leading-relaxed">
                            {stanza.lines?.map((line, lIdx) => (
                              <p key={lIdx} className="hover:text-parchment-500 transition-colors">
                                {line.text}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Meaning breakdown */}
                      <div className="mt-4 pt-3 border-t border-parchment-200">
                        <span className="text-[11px] font-bold text-parchment-800 block mb-1 font-khmer-body">អត្ថន័យ៖</span>
                        <p className="font-khmer-body text-xs text-parchment-600 leading-relaxed">
                          {item.content.meaning}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* Decorative footer */}
      <footer className="mt-20 border-t border-parchment-300 pt-8 text-center max-w-4xl mx-auto px-4">
        <p className="font-khmer-body text-xs text-parchment-600 leading-relaxed">
          រក្សាសិទ្ធិគ្រប់យ៉ាង © ២០២៦ • រៀបចំដោយស្ថាបត្យកម្មប្រព័ន្ធកាព្យខ្មែរទំនើប <br />
          ផ្អែកលើវចនានុក្រមខ្មែរ សម្ដេចសង្ឃរាជ ជួន ណាត និងក្បួនកាព្យសាស្រ្តបុរាណ។
        </p>
      </footer>
    </div>
  );
}
