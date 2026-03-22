import { WASocket, WAMessage } from "baileys";
import { isAntispamActive } from "../utils/db";
import { getGroupAdmins } from "../utils/group";
import { logger } from "../utils/logger";
import { antispamQueue } from "../utils/queue";

const CallHandler = async (bot: WASocket, calls: any[]) => {
  for (const call of calls) {
    if (call.status === "offer") {
      const jid = call.chatId; // O JID do grupo ou da pessoa
      const participant = call.from; // Quem está ligando

      if (jid.endsWith("@g.us")) {
        if (isAntispamActive(jid)) {
          const admins = await getGroupAdmins(bot, jid);

          // Se não for admin, remove do grupo
          if (!admins.includes(participant)) {
            antispamQueue.add(async () => {
              try {
                logger.info(`Removendo ${participant} por ligar para o grupo ${jid}`);
                
                // Enviar mensagem avisando o motivo da remoção
                await bot.sendMessage(jid, { 
                  text: `@${participant.split("@")[0]} foi removido por ligar para o grupo. Chamadas não são permitidas.`,
                  mentions: [participant]
                });

                // Remover o participante
                await bot.groupParticipantsUpdate(jid, [participant], "remove");
              } catch (e) {
                logger.error("Falha ao remover participante por chamada: " + e);
              }
            });
          }
        }
      }
    }
  }
};

export default CallHandler;
