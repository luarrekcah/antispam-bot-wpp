// Cache to track user messages -> Map<participantId, UserCache>
interface UserCache {
  messages: string[];
  timestamp: number;
}
const userMessageCache = new Map<string, UserCache>();

export const hasLinks = (text: string): boolean => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|wa\.me\/[^\s]+)/gi;
  return urlRegex.test(text);
};

export const isTooLong = (text: string): boolean => {
  return text.length > 1000;
};

export const isRepeated = (participantId: string, text: string): boolean => {
  const now = Date.now();
  const cache = userMessageCache.get(participantId);

  // If there's no cache or the cache is older than 1 minute, create a new one
  if (!cache || (now - cache.timestamp > 60000)) {
    userMessageCache.set(participantId, { messages: [text], timestamp: now });
    return false;
  }

  cache.messages.push(text);
  
  // Keep only the last 3 messages
  if (cache.messages.length > 3) {
    cache.messages.shift();
  }

  userMessageCache.set(participantId, cache);

  // Check if the last 3 messages are identical
  if (cache.messages.length === 3 && cache.messages.every(m => m === text)) {
    return true;
  }

  return false;
};

export const isSpam = (participantId: string, text: string): boolean => {
  return hasLinks(text) || isTooLong(text) || isRepeated(participantId, text);
};
