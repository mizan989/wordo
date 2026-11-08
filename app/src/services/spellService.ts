// Client-side Spell & Grammar Checking Engine
import { SpellIssue } from '../types';

const COMMON_TYPOS: Record<string, string[]> = {
  teh: ['the'],
  recieve: ['receive'],
  seperate: ['separate'],
  definately: ['definitely'],
  occured: ['occurred'],
  untill: ['until'],
  truely: ['truly'],
  accomodate: ['accommodate'],
  adress: ['address'],
  calender: ['calendar'],
  wierd: ['weird'],
  alot: ['a lot'],
  goverment: ['government'],
  experiance: ['experience'],
  neccessary: ['necessary'],
  succesful: ['successful'],
  tommorrow: ['tomorrow'],
  maintainance: ['maintenance'],
  enviroment: ['environment'],
  embarass: ['embarrass'],
  acheive: ['achieve'],
  beleive: ['believe'],
  writting: ['writing'],
  comming: ['coming'],
  dont: ["don't"],
  cant: ["can't"],
  wont: ["won't"],
  hasnt: ["hasn't"],
  havent: ["haven't"],
  didnt: ["didn't"],
  shouldnt: ["shouldn't"],
  couldnt: ["couldn't"],
  wouldnt: ["wouldn't"],
};

export class SpellService {
  /**
   * Scan plain text content for spelling and grammar anomalies.
   */
  public static checkText(text: string): SpellIssue[] {
    const issues: SpellIssue[] = [];
    if (!text || text.trim().length === 0) return issues;

    // 1. Repeated words check (e.g., "the the")
    const repeatedWordRegex = /\b([a-zA-Z]+)\s+\1\b/gi;
    let match: RegExpExecArray | null;
    while ((match = repeatedWordRegex.exec(text)) !== null) {
      issues.push({
        id: `repeat_${match.index}`,
        word: match[0],
        index: match.index,
        length: match[0].length,
        type: 'grammar',
        message: `Repeated word: "${match[1]}" appears twice in succession.`,
        suggestions: [match[1]],
      });
    }

    // 2. Common typo and spelling check
    const wordRegex = /\b[a-zA-Z']+\b/g;
    while ((match = wordRegex.exec(text)) !== null) {
      const originalWord = match[0];
      const lower = originalWord.toLowerCase();

      if (COMMON_TYPOS[lower]) {
        const replacement = COMMON_TYPOS[lower][0];
        // Preserve title case if original was capitalized
        const formattedSuggestion =
          originalWord[0] === originalWord[0].toUpperCase() && originalWord.length > 1
            ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
            : replacement;

        issues.push({
          id: `spell_${match.index}`,
          word: originalWord,
          index: match.index,
          length: originalWord.length,
          type: 'spelling',
          message: `Possible spelling error: "${originalWord}".`,
          suggestions: [formattedSuggestion, ...COMMON_TYPOS[lower].slice(1)],
        });
      }
    }

    // 3. Grammar rule: "a" vs "an" before vowel sounds
    const aAnRegex = /\b(a)\s+([aeiou][a-z]+)\b/gi;
    while ((match = aAnRegex.exec(text)) !== null) {
      const article = match[1];
      const nextWord = match[2];
      issues.push({
        id: `gram_an_${match.index}`,
        word: `${article} ${nextWord}`,
        index: match.index,
        length: match[0].length,
        type: 'grammar',
        message: `Consider using "an" before words starting with a vowel sound: "${nextWord}".`,
        suggestions: [`an ${nextWord}`],
      });
    }

    // 4. Missing space after comma or period
    const punctuationRegex = /([.,!?;])([A-Za-z])/g;
    while ((match = punctuationRegex.exec(text)) !== null) {
      issues.push({
        id: `punct_${match.index}`,
        word: match[0],
        index: match.index,
        length: match[0].length,
        type: 'style',
        message: `Missing space after punctuation: "${match[1]} ${match[2]}".`,
        suggestions: [`${match[1]} ${match[2]}`],
      });
    }

    return issues;
  }
}
