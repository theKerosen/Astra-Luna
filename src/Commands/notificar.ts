import { Command } from "../utils/command";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { Channels } from "../Schem/Schematica";

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
    const selectedChannel = interaction.options.getChannel("channel");

    await Channels.findOneAndUpdate({
      GuildId: interaction.guildId,
      NotifyRoleId: role?.id,
    });
    interaction.reply({
      content:
        "Pronto, agora esse cargo será mencionado quando haver uma mensagem no canal de menções.",
      ephemeral: true,
    });
    
    if (selectedChannel?.type !== ChannelType.GuildText)
      return interaction.reply({
        content: "Esse canal não é um canal de texto.",
        ephemeral: true,
      });
    await Channels.create({
      GuildId: interaction.guildId,
      BlogChannelId: selectedChannel?.id,
    });
    interaction.reply({
      content: "Canal salvo com sucesso, agora você irá ser notificado!",
      ephemeral: true,
    });
  },
} as Command;
