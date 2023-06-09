import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  inlineCode,
} from "discord.js";
import { Command } from "../utils/command";
import { Channels } from "../Schem/Schematica";

export = {
  data: new SlashCommandBuilder()
    .setName("alternar")
    .setDescription("Desabilitar/Habilitar Módulo > ...")
    .addSubcommand((s) =>
      s
        .setName("módulo")
        .setDescription("Desabilitar/Habilitar Módulo > Módulo")
        .addStringOption((r) =>
          r
            .setName("módulo")
            .setDescription("escreva o nome do módulo...")
            .setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    const Guild = client.guilds.cache.get(interaction.guildId ?? "");
    const User = Guild?.members.cache.get(interaction.user.id);
    if (!User?.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({
        content: "[❌] Sem permissão.",
        ephemeral: true,
      });

    const GuildProps = await Channels.findOne({ GuildId: interaction.guildId });

    const selectedModule = interaction.options
      .getString("módulo")
      ?.toLowerCase() as string;

    if (selectedModule === "alternar")
      return interaction.reply({
        content: "Esse módulo não pode ser desabilitado.",
        ephemeral: true,
      });

    if (!client.commands.has(selectedModule))
      return interaction.reply({
        content: "Esse módulo não existe.",
        ephemeral: true,
      });

    if (!GuildProps?.ToggleCommands.includes(selectedModule)) {
      interaction.reply({
        content: `Módulo ${inlineCode(
          selectedModule
        )} desabilitado com sucesso.`,
        ephemeral: true,
      });
      return GuildProps?.updateOne({
        $push: { ToggleCommands: selectedModule },
      });
    }

    if (GuildProps?.ToggleCommands.includes(selectedModule)) {
      interaction.reply({
        content: `Módulo ${inlineCode(selectedModule)} habilitado com sucesso.`,
        ephemeral: true,
      });
      return GuildProps.updateOne({
        $unset: { ToggleCommands: selectedModule },
      });
    }
  },
} as Command;
