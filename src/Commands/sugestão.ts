import { Command } from "../utils/command";
import { defaultGuildConfig } from "../Schem/Schematica";
import { BModal } from "../Constructors/Modal";
import {
  ChannelType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextInputStyle,
} from "discord.js";
export = {
  data: new SlashCommandBuilder()
    .setName("sugestão")
    .setDescription("Enviar sugestão...")
    .addSubcommand((s) =>
      s
        .setName("canal")
        .setDescription(
          "Configure um canal para receber sugestões para o servidor"
        )
        .addChannelOption((s) =>
          s.setName("canal").setDescription("O canal").setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    if (interaction.options.getSubcommand() === "canal") {
      const Guild = client.guilds.cache.get(interaction.guildId ?? "");
      const User = Guild?.members.cache.get(interaction.user.id);
      if (!User?.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({
          content: "[❌] Sem permissão.",
          ephemeral: true,
        });
      const channel = interaction.options.getChannel("canal");
      if (channel?.type != ChannelType.GuildText)
        return interaction.reply({
          content: "Esse canal não é de texto!",
          ephemeral: true,
        });
      await defaultGuildConfig.findOneAndUpdate(
        {
          GuildId: interaction.guild?.id,
        },
        {
          "channels.suggestions": channel?.id,
        },
        {
          upsert: true,
        }
      );
      return interaction.reply({
        content: "O canal de sugestões foi alterado!",
        ephemeral: true,
      });
    }

    const modal = new BModal()
      .createModal({ custom_id: "sugestão", title: "Sugestão" })
      .addText({
        custom_id: "TextField_1",
        label: `Qual é a ideia, ${interaction.user.username}?`,
        style: TextInputStyle.Short,
        placeholder: "Uma sugestão sobre móveis.",
        min_length: 24,
        max_length: 150,
        required: true,
      })
      .addText({
        custom_id: "TextField_2",
        label: `Conte me mais, ${interaction.user.username}!`,
        style: TextInputStyle.Paragraph,
        placeholder:
          "Sugiro mover aquela cadeira de lugar, tá me incomodando bastante!",
        min_length: 68,
        max_length: 250,
        required: true,
      });
    await interaction.showModal(modal);
  },
} as Command;
