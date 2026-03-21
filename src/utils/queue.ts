import { logger } from "./logger";

type Task = () => Promise<void>;

class HumanQueue {
  private queue: Task[] = [];
  private isProcessing = false;

  add(task: Task) {
    this.queue.push(task);
    if (!this.isProcessing) {
      this.process();
    }
  }

  private async process() {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        try {
          await task();
        } catch (e) {
          logger.error("Erro na fila de ações anti-raid: " + String(e));
        }
      }
      
      // Cooldown humano aleatório de 2.5 a 5 segundos entre cada ação
      const delay = Math.floor(Math.random() * 2500) + 2500;
      await new Promise(r => setTimeout(r, delay));
    }
    this.isProcessing = false;
  }
}

// Instância global para todas as execuções do bot
export const antispamQueue = new HumanQueue();
