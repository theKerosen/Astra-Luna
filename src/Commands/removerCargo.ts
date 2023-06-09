import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { Command } from "../utils/command";

export = {
  data: new SlashCommandBuilder()
    .setName("remover")
    .setDescription("a")
    .addUserOption((s) => s.setName("a").setDescription("a"))
    .addRoleOption((s) => s.setName("b").setDescription("a")),
  async execute(interaction: ChatInputCommandInteraction, client) {
    const Guild = client.guilds.cache.get(interaction.guildId ?? "");
    const User = Guild?.members.cache.get(interaction.user.id);
    if (!User?.permissions.has(PermissionFlagsBits.BanMembers))
      return interaction.reply({
        content: "[❌] Sem permissão.",
        ephemeral: true,
      });

    const usuario = interaction.options.getUser("a");
    const cargo = interaction.options.getRole("b");
    if (usuario && cargo !== null) {
      interaction.guild?.members.cache.get(usuario.id)?.roles.remove(cargo.id);
    }
  },
} as Command;
