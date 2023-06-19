import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  inlineCode,
  PermissionFlagsBits,
} from "discord.js";
import { Command } from "../utils/command";
import { defaultGuildConfig } from "../Schem/Schematica";
import { BEmbed } from "../Constructors/Embed";

export = {
  data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("Veja informações sobre seu XP!")
    .addSubcommand((s) =>
      s
        .setName("ver")
        .setDescription("Veja o XP de alguém ou o seu próprio")
        .addUserOption((s) => s.setName("usuário").setDescription("o usuário"))
    )
    .addSubcommand((s) =>
      s.setName("ranking").setDescription("Veja o ranking do servidor!")
    )
    .addSubcommandGroup((s) =>
      s
        .setName("cargos")
        .setDescription("Configure cargos de XP para o seu servidor")
        .addSubcommand((sub) =>
          sub
            .setName("adicionar")
            .setDescription("Configure cargos de XP para o seu servidor")
            .addRoleOption((r) =>
              r
                .setName("cargo")
                .setDescription("cargo que será dado ao usuário")
                .setRequired(true)
            )
            .addIntegerOption((i) =>
              i
                .setName("level")
                .setDescription(
                  "o nível que o usuário precisa ter para receber esse cargo"
                )
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("remover")
            .setDescription("Configure cargos de XP para o seu servidor")
            .addRoleOption((r) =>
              r
                .setName("cargo")
                .setDescription("cargo que será dado ao usuário")
                .setRequired(true)
            )
        )
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    const usuário = interaction.options.getUser("usuário");

    if (interaction.options.getSubcommand() === "adicionar") {
      const role = interaction.options.getRole("cargo");
      const level = interaction.options.getInteger("level");
      const Guild = client.guilds.cache.get(interaction.guildId ?? "");
      const User = Guild?.members.cache.get(interaction.user.id);
      if (!User?.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({
          content: "[❌] Sem permissão.",
          ephemeral: true,
        });
      await defaultGuildConfig.findOneAndUpdate(
        { GuildId: interaction.guildId },
        { $push: { XPRoles: { role: role?.id, level: level } } },
        { upsert: true }
      );
      return interaction.reply({
        content: "Cargo adicionado com sucesso!",
        ephemeral: true,
      });
    }
    if (interaction.options.getSubcommand() === "remover") {
      const role = interaction.options.getRole("cargo");
      const Guild = client.guilds.cache.get(interaction.guildId ?? "");
      const User = Guild?.members.cache.get(interaction.user.id);
      if (!User?.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({
          content: "[❌] Sem permissão.",
          ephemeral: true,
        });
      await defaultGuildConfig.findOneAndUpdate(
        { GuildId: interaction.guildId },
        { $pull: { XPRoles: { role: role?.id } } },
        { upsert: true }
      );
      return interaction.reply({
        content: "Cargo removido com sucesso!",
        ephemeral: true,
      });
    }

    if (interaction.options.getSubcommand() === "ranking") {
      const leaderboard = await defaultGuildConfig
        .find({ GuildId: interaction.guildId })
        .sort({
          "Users.XP": -1,
        });
      const Embed = new BEmbed()
        .setAuthor({ name: interaction.guild?.name ?? "\u200b" })
        .setColor("#e43d37")
        .setDescription(`Leaderboard do Servidor`);

      for (let i = 0; i < Math.min(5, leaderboard[0].Users.length); i++) {
        Embed.addFields({
          name: `${
            (await client.users.fetch(leaderboard[0].Users[i].userId)).username
          }`,
          value: `${leaderboard[0].Users[i].XP}`,
        });
      }

      return interaction.reply({ embeds: [Embed] });
    }

    defaultGuildConfig.findOne(
      {
        GuildId: interaction.guildId,
        "Users.userId": usuário ? usuário.id : interaction.user.id,
      },
      { "Users.$": 1 },
      {},
      async (err, data) => {
        if (err) throw err;
        if (!data)
          return interaction.reply({
            content: "esse usuário não tem XP.",
            ephemeral: true,
          });

        const user = data.Users[0];
        const level = user.Level;
        const xp = user.XP;
        const solvedFormula =
          (5 / 6) *
          (level + 1) *
          (2 * (level + 1) * (level + 1) + 27 * (level + 1) + 91);
        const progressPercent = Math.round((xp / solvedFormula) * 100);
        const filledBarLength = Math.round((20 * progressPercent) / 100);
        const filledBar = "▰".repeat(filledBarLength);
        const emptyBar = "▱".repeat(20 - filledBarLength);

        const Embed = new BEmbed()
          .setAuthor({ name: interaction.guild?.name ?? "\u200b" })
          .setThumbnail(
            usuário
              ? usuário.avatarURL()
              : interaction.user.avatarURL() ||
                  "https://cdn.discordapp.com/attachments/943547363031670785/1116163222748270592/huh.png"
          )
          .setColor("#e43d37")
          .setDescription(
            `[ *${interaction.user.username}* ]\n${filledBar}${emptyBar} **${progressPercent}%**`
          )
          .addFields(
            {
              name: "\u200b",
              value: `<:lv:1107514022997274654> ${inlineCode(level)}`,
              inline: true,
            },
            {
              name: "\u200b",
              value: `<:XP:1107514024427536416> ${inlineCode(
                xp.toLocaleString()
              )}`,
              inline: true,
            },
            {
              name: "\u200b",
              value: `<:levelup:1107514020241621133> ${inlineCode(
                (
                  (5 / 6) *
                    (level + 1) *
                    (2 * (level + 1) * (level + 1) + 27 * (level + 1) + 91) -
                  xp
                ).toLocaleString()
              )}`,
              inline: true,
            }
          );

        interaction.reply({ embeds: [Embed], ephemeral: true });
      }
    );
  },
} as Command;
