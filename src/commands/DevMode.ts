import {
  CacheType,
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { AstraLuna } from "../Client";
import { Command } from "../command";
import { BEmbed } from "../components/discord/Embed";

class DevMode implements Command {
  client: AstraLuna | null = null;
  data: SlashCommandBuilder = new SlashCommandBuilder();
  interaction: ChatInputCommandInteraction<CacheType> | null = null;

  constructor() {
    this.data
      .setName("devmode")
      .setDescription("-> Habilita o modo ")
      .addBooleanOption((b) =>
        b.setName("dev_talk").setDescription("true para sim, false para não")
      );
  }

  devTalk() {
    if (!this.interaction || !this.client)
      return console.error("NO INTERACTION/CLIENT!");

    const filter = (m: Message) => m.author.id === process.env.OWNER_ID;
    const collector = this.interaction.channel?.createMessageCollector({
      filter: filter,
    });

    const bool = this.interaction.options.getBoolean("dev_talk");

    if (!bool) {
      this.interaction.reply({
        content: "[DevTalk] Módulo desabilitado.",
        ephemeral: true,
      });

      return collector?.stop();
    }

    if (bool) {
      collector?.on("collect", (m) => {
        const content = m.content;
        m.delete();

        const embed = new BEmbed()
          .setTitle(m.author.globalName ?? m.author.username)
          .setURL("https://lunxi.dev")
          .setDescription(content)
          .setColor("Blurple")
          .setFooter({ text: "Mensagem do desenvolvedor!" });

        m.channel.send({ embeds: [embed] });
      });
      this.interaction.reply({
        content: "[DevTalk] Módulo habilitado.",
        ephemeral: true,
      });
    }
  }

  async execute() {
    if (!this.interaction || !this.client)
      return console.error("NO INTERACTION/CLIENT!");

    if (this.interaction?.user.id !== process.env.OWNER_ID)
      this.interaction?.reply({
        content: "Você não é o desenvolvedor para usar isso!",
        ephemeral: true,
      });

    this.devTalk();
  }

  setClient(client: AstraLuna) {
    this.client = client;
    return this;
  }
  setInteraction(interaction: ChatInputCommandInteraction<CacheType>) {
    this.interaction = interaction;
    return this;
  }
}

export default new DevMode();
