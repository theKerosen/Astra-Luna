/*

    Feito por Lunx © 2023

*/

import { Interaction, Message } from "discord.js";
import { AstraLuna } from "../utils/Client";
import { Command } from "../utils/command";
import { Modals } from "./Modals";
import { Buttons } from "./Buttons";

export class Mensagem {
  public client: AstraLuna;
  public mensagem: Message;

  constructor(options: { client: AstraLuna; mensagem: Message }) {
    this.client = options.client;
    this.mensagem = options.mensagem;
  }
}

export class Interação {
  public client: AstraLuna;
  public interaction: Interaction;

  constructor(options: { client: AstraLuna; interaction: Interaction }) {
    this.client = options.client;
    this.interaction = options.interaction;
  }
  async run() {
    if (this.interaction.isCommand()) {
      const command = this.client.commands.get(this.interaction.commandName);
      if (this.interaction.user.bot == true) return;
      if (!command) return;

      try {
        command.execute(this.interaction, this.client);
      } catch (error) {
        console.log(error);
        await this.interaction.reply({
          content:
            "[❌] A não ser que os servidores do Discord tenham pegado fogo, isso é um erro.",
          ephemeral: true,
        });
      }
    }
    if (this.interaction.isModalSubmit()) {
      switch (this.interaction.customId) {
        case "feedback":
          new Modals({
            client: this.client,
            interaction: this.interaction,
          }).FeedbackModal();
          break;
        case "sugestão":
          new Modals({
            client: this.client,
            interaction: this.interaction,
          }).sugestãoModal();
          break;
      }
    }
    if (this.interaction.isButton()) {
      switch (this.interaction.customId) {
        case "poll_btn_1":
          new Buttons({
            client: this.client,
            interaction: this.interaction,
          }).PollButton({ vote1: 1 });
          break;
        case "poll_btn_2": {
          new Buttons({
            client: this.client,
            interaction: this.interaction,
          }).PollButton({ vote2: 1 });
        }
      }
    }
  }
}

export class Inicializar {
  public client: AstraLuna;
  constructor(options: { client: AstraLuna }) {
    this.client = options.client;
  }
  run() {
    this.client.application?.commands.set(
      this.client.commands.map((v: Command) => v.data)
    );
    this.client.user?.setStatus("idle");
    setInterval(() => {
      const randomStatus = [
        "Olhando para o céu estrelado.",
        "Escrevendo códigos cheios de emojis.",
        "Descobrindo o significado da vida através de memes.",
        "Trocando ideias com o Game Coordinator sobre futuros eventos.",
        "Organizando pastas cheias de gifs engraçados.",
        "Pensando em como otimizar as respostas do Game Coordinator.",
        "Debatendo sobre a melhor estratégia para vencer um boss.",
        "Traduzindo mensagens misteriosas em código binário.",
        "Procurando o botão 'undo' na vida real.",
        "Contando histórias sobre bugs bizarros encontrados no código.",
        "Reiniciando as expectativas do Game Coordinator.",
        "Reescrevendo o código em linguagem de lolcats. Kthxbye!",
        "Conversando com NPCs mais interessantes que as pessoas reais.",
        "Descobrindo easter eggs em jogos nostálgicos.",
        "Trocando dicas secretas com o Game Coordinator.",
        "Desafiando o Game Coordinator para uma partida épica.",
        "Enganando o Game Coordinator com um disfarce de NPC.",
        "Rastreando os posts do blog do Counter-Strike em tempo real para ficar sempre atualizado.",
        "Conectando jogadores ao Game Coordinator do Counter-Strike para a melhor experiência.",
        "Desafie-se a alcançar novos níveis e conquistas com nosso sistema de XP.",
        "Navegue pelos recursos surpreendentes desenvolvidos por @neko.lunx.",
      ];
      this.client.user?.setActivity({
        name: randomStatus[Math.floor(Math.random() * randomStatus.length)],
      });
    }, 60000);
  }
}
