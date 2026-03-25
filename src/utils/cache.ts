import NodeCache from "node-cache";

/**
 * Shared cache for group metadata to prevent rate limiting.
 * stdTTL: 5 minutes (300 seconds)
 */
export const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });
