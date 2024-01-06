import {
  CacheType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { AstraLuna } from "../client";
import { Command } from "../command";
import { GuildDatabases } from "../components/astra/astraDBManager";

class AutoRole implements Command {
  client: AstraLuna | null = null;
  data: SlashCommandBuilder = new SlashCommandBuilder();
  interaction: ChatInputCommandInteraction<CacheType> | null = null;

  constructor() {
    this.data
      .setName("autorole")
      .setDescription("Configure um cargo para membros novos receberem.")
      .addRoleOption((r) =>
        r
          .setName("cargo")
          .setDescription("Cargo para o auto-role.")
          .setRequired(true)
      );
  }

  setClient(client: AstraLuna) {
    this.client = client;
    return this;
  }

  setInteraction(interaction: ChatInputCommandInteraction<CacheType>) {
    this.interaction = interaction;
    return this;
  }

  async execute() {
    if (!this.interaction || !this.client) {
      throw new Error("NO INTERACTION/CLIENT.");
    }
    const db = await new GuildDatabases({
      guild_id: this.interaction.guildId,
    }).find();

    const User = this.interaction.guild?.members.cache.get(
      this.interaction.user.id
    );
    if (!User?.permissions.has(PermissionFlagsBits.Administrator)) {
      await this.interaction.reply({
        content: "Sem permissão.",
        ephemeral: true,
      });
      return;
    }

    db.updateOne(
      {
        settings: {
          autorole_settings: {
            role_id: this.interaction.options.getRole("cargo", true).id,
          },
        },
      },
      { upsert: true }
    );

    await this.interaction.reply({
      content: "Auto-role configurado com sucesso.",
      ephemeral: true,
    });
  }
}

export default new AutoRole();
