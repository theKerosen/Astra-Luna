import { Interaction } from "discord.js";
import { AstraLuna } from "../../Client";
import { GuildDatabases } from "./dbManager";
import { Modals } from "./Modals";
import { BaseHandler } from "./loader";

export class ClientInteraction extends AstraLuna {
  public interaction: Interaction;
  public db: GuildDatabases;

  constructor(options: { client: AstraLuna; interaction: Interaction }) {
    super();

    this.interaction = options.interaction;
    this.db = new GuildDatabases({ guild_id: this.interaction.guildId });
  }

  async run(handler: BaseHandler) {
    if (this.interaction.isChatInputCommand()) {
      await handler.runCommand(this.interaction, this);
    }
    if (this.interaction.isModalSubmit()) {
      switch (this.interaction.customId) {
        case "feedback":
          new Modals({
            client: this,
            interaction: this.interaction,
          }).FeedbackModal();
          break;
        case "sugestão":
          new Modals({
            client: this,
            interaction: this.interaction,
          }).sugestãoModal();
          break;
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
    console.log("[Astra Luna] -> Client pronto.");
    this.client.user?.setStatus("idle");
  }
}
