import { Command } from "../utils/command";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { Channels } from "../Schem/Schematica";

export = {
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription("channel notifications > ...")
    .addRoleOption((sub) =>
      sub
        .setName("role")
        .setDescription("channel notifications > Role mention")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    const Guild = client.guilds.cache.get(interaction?.guildId ?? "");
    const User = Guild?.members.cache.get(interaction.user.id);
    if (!User?.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({
        content: "[❌] Sem permissão.",
        ephemeral: true,
      });
    const role = interaction.options.getRole("role");
    await Channels.findOneAndUpdate({
      GuildId: interaction.guildId,
      NotifyRoleId: role?.id,
    });
    interaction.reply({
      content:
        "Pronto, agora esse cargo será mencionado quando haver uma mensagem no canal de menções.",
      ephemeral: true,
    });
  },
} as Command;
