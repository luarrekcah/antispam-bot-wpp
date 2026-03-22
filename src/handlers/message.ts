import { WASocket } from "baileys";
import { FormattedMessage } from "../utils/message";
import { activateAntispam, deactivateAntispam, isAntispamActive } from "../utils/db";
import { isSpam } from "../utils/antispam";
import { antispamQueue } from "../utils/queue";
import { logger } from "../utils/logger";

import { getGroupAdmins } from "../utils/group";

const MessageHandler = async (bot: WASocket, message: FormattedMessage) => {
  const jid = message.key.remoteJid!;
  const participant = message.participant || jid;
  const content = message.content || "";

  if (content.trim() === "!antispam") {
    if (!message.isGroup) {
      await bot.sendMessage(jid, { text: "Este comando só pode ser usado em grupos." });
      return;
    }

    const admins = await getGroupAdmins(bot, jid);
    if (!admins.includes(participant)) {
      await bot.sendMessage(jid, { text: "Apenas administradores podem usar este comando." });
      return;
    }

    if (isAntispamActive(jid)) {
      deactivateAntispam(jid);
      await bot.sendMessage(jid, { text: "Antispam desativado para este grupo." });
    } else {
      activateAntispam(jid);
      await bot.sendMessage(jid, { text: "Antispam ativado para este grupo." });
    }
    return;
  }

  if (message.isGroup && isAntispamActive(jid) && content) {
    const admins = await getGroupAdmins(bot, jid);
    
    if (!admins.includes(participant)) {
      if (isSpam(participant, content)) {
        antispamQueue.add(async () => {
          try {
            await bot.sendMessage(jid, { delete: message.key });
            await bot.groupParticipantsUpdate(jid, [participant], "remove");
            logger.info(`Removed spammer ${participant} from ${jid}`);
          } catch (e) {
            logger.error("Failed to execute antispam actions. Is the bot admin? " + e);
          }
        });
        return;
      }
    }
  }

  if(content === '!bot' || content === '!ajuda') {
      await bot.sendMessage(jid, { text: '[BOT] Ativo e funcional\n\n!antispam - Ativar/Desativar antispam' });
  }
}

export default MessageHandler;