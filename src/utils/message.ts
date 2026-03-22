import { proto, WAMessage } from "baileys";
import { logger } from "./logger";

export type FormattedMessage = {
  key: proto.IMessageKey;
  messageTimestamp: Number | Long | null;
  pushName: string | null;
  content: string | null;
  isSticker: boolean;
  isGroup: boolean;
  participant?: string | null;
};

/**
 * @param message
 * @returns a message vindo do Baileys para algo mais amigável.
 */
export const getMessage = (message: WAMessage): FormattedMessage | undefined => {
  try {
    const isGroup = message.key.remoteJid?.endsWith("@g.us") || false;
    const isSticker = !!message.message?.stickerMessage;
    return {
      key: message.key,
      messageTimestamp: message.messageTimestamp || null,
      pushName: message.pushName || null,
      content:
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        null,
      isSticker,
      isGroup,
      participant: message.key.participant || null,
    };
  } catch (error) {
    logger.error(error);
  }
};
