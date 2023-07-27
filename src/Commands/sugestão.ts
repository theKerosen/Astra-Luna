import { Command } from "../utils/command";
import { defaultGuildConfig } from "../mongooseSchemas/Schematica";
import { BModal } from "../discordComponents/Modal";
import {
  ChannelType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextInputStyle,
} from "discord.js";
import { BEmbed } from "../discordComponents/Embed";
export = {
  data: new SlashCommandBuilder()
    .setName("sugestão")
    .setDescription("► Enviar sugestão...")
    .addSubcommand((sub) =>
      sub
        .setName("sugerir")
        .setDescription("► Mande uma sugestão para o servidor!")
    )
    .addSubcommand((s) =>
      s
        .setName("canal")
        .setDescription(
          "► Configure um canal para receber sugestões para o servidor"
        )
        .addChannelOption((s) =>
          s.setName("canal").setDescription("► O canal").setRequired(true)
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
      const channel = interaction.options.getChannel("canal", true, [
        ChannelType.GuildText,
      ]);
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
      interaction.reply({
        content: "O canal de sugestões foi alterado!",
        ephemeral: true,
      });
      channel.send({
        embeds: [
          new BEmbed()
            .setAuthor({ name: `${interaction.guild?.name} — Sugestões` })
            .setColor("Aqua")
            .setDescription(
              `Como funciona?\n
              *Para sugerir adições/remoções, utilize o comando "/sugestão sugerir" e responda o formulário.*\n
              Após sugerir sua sugestão, o Astra Luna irá automaticamente enviar ela neste canal, e então, outros membros podem votar.
              `
            )
            .setThumbnail(client.user?.avatarURL() || null),
        ],
      });
    }
    if (interaction.options.getSubcommand() === "sugerir") {
      const modal = new BModal()
        .createModal({ custom_id: "sugestão", title: "Sugestão" })
        .addText({
          custom_id: "TextField_1",
          label: `Qual é a ideia, ${interaction.user.globalName}?`,
          style: TextInputStyle.Short,
          placeholder: "Uma sugestão sobre móveis.",
          min_length: 24,
          max_length: 150,
          required: true,
        })
        .addText({
          custom_id: "TextField_2",
          label: `Conte me mais, ${interaction.user.globalName}!`,
          style: TextInputStyle.Paragraph,
          placeholder:
            "Sugiro mover aquela cadeira de lugar, tá me incomodando bastante!",
          min_length: 68,
          max_length: 250,
          required: true,
        });
      await interaction.showModal(modal);
    }
  },
} as Command;
