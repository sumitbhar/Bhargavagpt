import type { Attachment } from '../types';

// Keywords to detect coding-related prompts
const CODE_KEYWORDS = [
  'javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'php', 'swift', 'kotlin', 'ruby', 'go', 'rust',
  'html', 'css', 'sql', 'bash', 'shell',
  'function', 'variable', 'class', 'object', 'array', 'loop', 'if/else', 'switch', 'case', 'import', 'export',
  'debug', 'error', 'bug', 'fix', 'code', 'snippet', 'algorithm', 'data structure',
  'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring', 'laravel',
  'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
  'api', 'json', 'xml', 'regex', 'query',
  '```' // Code block markdown
];

/**
 * Routes the user's request to the most appropriate model based on the prompt.
 *
 * @param text The user's text prompt.
 * @param attachment The user's file attachment, if any.
 * @returns The ID of the selected model.
 */
export const routeModel = (text: string, attachment: Attachment | null): string => {
  // 1. Image Editing: If there's an image and the prompt seems to be an editing instruction.
  if (attachment && attachment.mimeType.startsWith('image/')) {
    // A simple heuristic: if there's text along with the image, it's likely an editing request.
    if (text.trim().length > 0) {
      return 'gemini-2.5-flash-image-preview'; // Nano Banana for image edits
    }
  }

  const lowerCaseText = text.toLowerCase();

  // 2. Coding: If the prompt contains coding keywords.
  if (CODE_KEYWORDS.some(keyword => lowerCaseText.includes(keyword))) {
    return 'deepseek-coder'; // Specialized model for coding
  }
  
  // 3. Complex/Creative Tasks: If the prompt is long or asks for creative output.
  if (text.length > 300 || lowerCaseText.includes('plan') || lowerCaseText.includes('write a story') || lowerCaseText.includes('brainstorm')) {
      return 'gemini-2.5-pro'; // The most powerful model for complex tasks
  }

  // 4. General/Default: For all other queries.
  return 'gemini-2.5-flash'; // Fast and capable for general purpose queries
};
