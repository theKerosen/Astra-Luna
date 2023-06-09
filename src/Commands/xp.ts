import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  inlineCode,
} from "discord.js";
import { Command } from "../utils/command";
import { XP } from "../Schem/Schematica";
import { BEmbed } from "../Constructors/Embed";

export = {
  data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("Veja informações sobre seu XP!")
    .addSubcommand((s) =>
      s
        .setName("ver")
        .setDescription("veja o XP de alguém ou o seu próprio")
        .addUserOption((s) => s.setName("usuário").setDescription("o usuário"))
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    const usuário = interaction.options.getUser("usuário");
    if (!usuário) {
      XP.findOne(
        {
          GuildId: interaction.guildId,
          "Users.userId": interaction.user.id,
        },
        { "Users.$": 1 },
        {},
        async (err, data) => {
          if (err) throw err;
          if (!data) return;

          const solvedFormula =
            (5 / 6) *
            (data?.Users[0].Level + 1) *
            (2 * (data?.Users[0].Level + 1) * (data?.Users[0].Level + 1) +
              27 * (data?.Users[0].Level + 1) +
              91);

          const progressPercent = Math.round(
            (data.Users[0].XP / solvedFormula) * 100
          );
          console.log(progressPercent);

          const filledBarLength = Math.round((20 * progressPercent) / 100);
          console.log(filledBarLength);
          const filledBar = "▰".repeat(filledBarLength);
          const emptyBar = "▱".repeat(20 - filledBarLength);
          console.log(filledBar + emptyBar);
          const Embed = new BEmbed()
            .setAuthor({ name: interaction.guild?.name ?? "\u200b" })
            .setThumbnail(interaction.user.avatarURL())
            .setColor("#e43d37")
            .setDescription(`${filledBar}${emptyBar}`)
            .setFields([
              {
                name: "\u200b",
                value: `<:lv:1107514022997274654> ${inlineCode(
                  data?.Users[0].Level
                )}`,
                inline: true,
              },
              {
                name: "\u200b",
                value: `<:XP:1107514024427536416> ${inlineCode(
                  data?.Users[0].XP.toLocaleString()
                )}`,
                inline: true,
              },
              {
                name: "\u200b",
                value: `<:levelup:1107514020241621133> ${inlineCode(
                  //5 / 6 * lvl * (2 * lvl * lvl + 27 * lvl + 91)
                  (
                    (5 / 6) *
                      (data?.Users[0].Level + 1) *
                      (2 *
                        (data?.Users[0].Level + 1) *
                        (data?.Users[0].Level + 1) +
                        27 * (data?.Users[0].Level + 1) +
                        91) -
                    data?.Users[0].XP
                  ).toLocaleString()
                )}`,
                inline: true,
              },
            ]);
          interaction.reply({ embeds: [Embed], ephemeral: true });
        }
      );
    }
    if(usuário) {
      XP.findOne(
        {
          GuildId: interaction.guildId,
          "Users.userId": usuário.id,
        },
        { "Users.$": 1 },
        {},
        async (err, data) => {
          if (err) throw err;
          if (!data) return;

          const solvedFormula =
            (5 / 6) *
            (data?.Users[0].Level + 1) *
            (2 * (data?.Users[0].Level + 1) * (data?.Users[0].Level + 1) +
              27 * (data?.Users[0].Level + 1) +
              91);

          const progressPercent = Math.round(
            (data.Users[0].XP / solvedFormula) * 100
          );
          console.log(progressPercent);

          const filledBarLength = Math.round((20 * progressPercent) / 100);
          console.log(filledBarLength);
          const filledBar = "▰".repeat(filledBarLength);
          const emptyBar = "▱".repeat(20 - filledBarLength);
          console.log(filledBar + emptyBar);
          const Embed = new BEmbed()
            .setAuthor({ name: interaction.guild?.name ?? "\u200b" })
            .setThumbnail(usuário.avatarURL())
            .setColor("#e43d37")
            .setDescription(`${filledBar}${emptyBar}`)
            .setFields([
              {
                name: "\u200b",
                value: `<:lv:1107514022997274654> ${inlineCode(
                  data?.Users[0].Level
                )}`,
                inline: true,
              },
              {
                name: "\u200b",
                value: `<:XP:1107514024427536416> ${inlineCode(
                  data?.Users[0].XP.toLocaleString()
                )}`,
                inline: true,
              },
              {
                name: "\u200b",
                value: `<:levelup:1107514020241621133> ${inlineCode(
                  //5 / 6 * lvl * (2 * lvl * lvl + 27 * lvl + 91)
                  (
                    (5 / 6) *
                      (data?.Users[0].Level + 1) *
                      (2 *
                        (data?.Users[0].Level + 1) *
                        (data?.Users[0].Level + 1) +
                        27 * (data?.Users[0].Level + 1) +
                        91) -
                    data?.Users[0].XP
                  ).toLocaleString()
                )}`,
                inline: true,
              },
            ]);
          interaction.reply({ embeds: [Embed], ephemeral: true });
        }
      );
    }
  },
} as Command;
