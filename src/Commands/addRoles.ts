import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { Command } from "../utils/command";
import { Channels } from "../Schem/Schematica";

export = {
  data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("xp > ...")
    .addSubcommand((s) =>
      s
        .setName("cargos")
        .setDescription("Cargos de XP")
        .addRoleOption((r) =>
          r.setName("cargo").setDescription("Cargo de XP").setRequired(true)
        )
        .addIntegerOption((i) =>
          i
            .setName("level")
            .setDescription("XP para ganhar esse cargo")
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
    const role = interaction.options.getRole("cargo");
    const level = interaction.options.getInteger("level") as number;
    await Channels.findOneAndUpdate({
      GuildId: interaction.guildId,
      $push: { RolesNXP: { role: role?.id, level: level } },
    });
    interaction.reply({
      content: `Cargo <@&${role?.id}> adicionado.`,
      ephemeral: true,
    });
  },
} as Command;
