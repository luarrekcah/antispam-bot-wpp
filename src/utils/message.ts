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
    const msg = message.message;
    if (!msg) return undefined;

    const isSticker = !!msg.stickerMessage;

    // Extrair conteúdo de vários tipos de mensagens para o antispam validar
    const content =
      msg.conversation ||
      msg.extendedTextMessage?.text ||
      msg.imageMessage?.caption ||
      msg.videoMessage?.caption ||
      msg.documentMessage?.caption ||
      msg.orderMessage?.message ||
      msg.buttonsMessage?.contentText ||
      msg.buttonsResponseMessage?.selectedDisplayText ||
      msg.templateButtonReplyMessage?.selectedDisplayText ||
      msg.interactiveMessage?.body?.text ||
      msg.templateMessage?.hydratedTemplate?.hydratedContentText ||
      msg.templateMessage?.hydratedFourRowTemplate?.hydratedContentText ||
      msg.listResponseMessage?.title ||
      msg.listResponseMessage?.description ||
      (msg as any).requestPaymentMessage?.note || // faltando types
      null;

    return {
      key: message.key,
      messageTimestamp: message.messageTimestamp || null,
      pushName: message.pushName || null,
      content,
      isSticker,
      isGroup,
      participant: message.key.participant || null,
    };
  } catch (error) {
    logger.error(error);
  }
};
