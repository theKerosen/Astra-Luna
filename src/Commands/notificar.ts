import { Command } from "../utils/command";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { defaultGuildConfig } from "../Schem/Schematica";

export = {
  data: new SlashCommandBuilder()
    .setName("notificar")
    .setDescription("notificação de atualizações > ...")
    .addChannelOption((sub) =>
      sub
        .setName("canal")
        .setDescription("notificação de atualizações > canal")
        .setRequired(true)
    )
    .addRoleOption((sub) =>
      sub
        .setName("cargo")
        .setDescription("notificação de canais > menção de cargos")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    const Guild = client.guilds.cache.get(interaction.guildId ?? "");
    const User = Guild?.members.cache.get(interaction.user.id);
    if (!User?.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({
        content: "[❌] Sem permissão.",
        ephemeral: true,
      });
    const role = interaction.options.getRole("role");
    const selectedChannel = interaction.options.getChannel("canal");
    if (selectedChannel?.type !== ChannelType.GuildText)
      return interaction.reply({
        content: "Esse canal não é um canal de texto.",
        ephemeral: true,
      });
    await defaultGuildConfig.findOneAndUpdate(
      { GuildId: interaction.guildId },
      {
        GuildId: interaction.guildId,
        "channels.updatesCS": selectedChannel?.id,
        NotifyRoleId: role?.id,
      },
      { upsert: true }
    );
    interaction.reply({
      content:
        "Canal & Cargo salvo com sucesso, agora você irá ser notificado!",
      ephemeral: true,
    });
  },
} as Command;
