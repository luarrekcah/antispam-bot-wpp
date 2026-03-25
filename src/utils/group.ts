import { WASocket } from "baileys";
import { logger } from "./logger";
import { groupCache } from "./cache";

/**
 * Gets the list of admin IDs for a given group.
 * @param bot The socket instance.
 * @param groupId The group JID.
 * @returns A promise that resolves to an array of admin JIDs.
 */
export const getGroupAdmins = async (bot: WASocket, groupId: string): Promise<string[]> => {
  try {
    let metadata = groupCache.get(groupId) as any;
    if (!metadata) {
      logger.info(`Fetching metadata for ${groupId} (Cache MISS)`);
      metadata = await bot.groupMetadata(groupId);
      groupCache.set(groupId, metadata);
    } else {
      logger.info(`Using cached metadata for ${groupId} (Cache HIT)`);
    }

    return metadata.participants
      .filter((p: any) => p.admin === "admin" || p.admin === "superadmin")
      .map((p: any) => p.id);
  } catch (e) {
    logger.error("Error getting group metadata: " + e);
    return [];
  }
};
