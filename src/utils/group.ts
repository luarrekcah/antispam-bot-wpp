import { WASocket } from "baileys";
import { logger } from "./logger";

/**
 * Gets the list of admin IDs for a given group.
 * @param bot The socket instance.
 * @param groupId The group JID.
 * @returns A promise that resolves to an array of admin JIDs.
 */
export const getGroupAdmins = async (bot: WASocket, groupId: string): Promise<string[]> => {
  try {
    const metadata = await bot.groupMetadata(groupId);
    return metadata.participants
      .filter((p: any) => p.admin === "admin" || p.admin === "superadmin")
      .map((p: any) => p.id);
  } catch (e) {
    logger.error("Error getting group metadata: " + e);
    return [];
  }
};
