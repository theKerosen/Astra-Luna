/* import { Command } from "../command";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  TextInputStyle,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { BModal } from "../components/discord/Modal";
import { BEmbed } from "../components/discord//Embed";
import { defaultGuildConfig } from "../schematicas/Schematica";

export = {
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("► Feedback")
    .addSubcommand((sub) =>
      sub
        .setName("canal")
        .setDescription("► Configure um canal para receber Feedback!")
        .addChannelOption((c) =>
          c
            .setName("canal")
            .setDescription("► O canal que irá receber feedbacks.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("enviar")
        .setDescription("► Envie um Feedback para o Servidor")
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    if (interaction.options.getSubcommand() === "canal") {
      const Guild = client.guilds.cache.get(interaction.guildId ?? "");
      const User = Guild?.members.cache.get(interaction.user.id);
      if (!User?.permissions.has(PermissionFlagsBits.BanMembers))
        return interaction.reply({
          content: "[❌] Sem permissão.",
        });
      const channel = interaction.options.getChannel("canal", true, [
        ChannelType.GuildText,
      ]);
      await defaultGuildConfig.findOneAndUpdate(
        {
          GuildId: interaction.guild?.id,
        },
        {
          "channels.feedbacks": channel?.id,
        },
        {
          upsert: true,
        }
      );
      interaction.reply({
        content: "O canal de sugestões foi alterado!",
      });
      channel.send({
        embeds: [
          new BEmbed()
            .setAuthor({ name: `${interaction.guild?.name} — Feedbacks` })
            .setColor("Aqua")
            .setDescription(
              `Como funciona?\n
                *Para enviar feedbacks à equipe de moderação do servidor, apenas utilize o comando "/feedback enviar" e responda o formulário.*`
            )
            .setFooter({
              text: 'Feedbacks (ou "dar um retorno") são utilizados para compreender melhor uma comunidade torná-la um local mais formidável.',
            })
            .setThumbnail(client.user?.avatarURL() || null),
        ],
      });
    }
    if (interaction.options.getSubcommand() === "enviar") {
      const modal = new BModal()
        .createModal({ custom_id: "feedback", title: "Feedback" })
        .addText({
          custom_id: "feedbackField",
          label: "Dê um feedback construtivo sobre o servidor!",
          style: TextInputStyle.Paragraph,
          max_length: 255,
          min_length: 3,
          placeholder: "falta um toque de alecrim...",
        });
      await interaction.showModal(modal);
    }
  },
} as Command;
 */