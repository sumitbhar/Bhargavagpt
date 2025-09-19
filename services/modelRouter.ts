import type { Attachment } from '../types';

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

  // 2. General/Default: For all other queries.
  return 'gemini-2.5-flash'; // Fast and capable for general purpose queries
};