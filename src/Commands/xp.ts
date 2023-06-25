import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  inlineCode,
  PermissionFlagsBits,
  ButtonStyle,
  Interaction,
} from "discord.js";
import { Command } from "../utils/command";
import { defaultGuildConfig } from "../Schem/Schematica";
import { BEmbed } from "../Constructors/Embed";
import { BButton } from "../Constructors/Button";

interface Ranks {
  userid: string;
  XP: number;
  Level: number;
}

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
    if (interaction.options.getSubcommand() === "adicionar") {
      await interaction.deferReply({ ephemeral: true });
      const role = interaction.options.getRole("cargo");
      const level = interaction.options.getInteger("level");
      const Guild = client.guilds.cache.get(interaction.guildId ?? "");
      const User = Guild?.members.cache.get(interaction.user.id);
      if (!User?.permissions.has(PermissionFlagsBits.Administrator))
        return await interaction.editReply({
          content: "[❌] Sem permissão.",
        });
      await defaultGuildConfig.findOneAndUpdate(
        { GuildId: interaction.guildId },
        { $push: { XPRoles: { role: role?.id, level: level } } },
        { upsert: true }
      );
      return await interaction.editReply({
        content: "Cargo adicionado com sucesso!",
      });
    }
    if (interaction.options.getSubcommand() === "remover") {
      await interaction.deferReply({ ephemeral: true });
      const role = interaction.options.getRole("cargo");
      const Guild = client.guilds.cache.get(interaction.guildId ?? "");
      const User = Guild?.members.cache.get(interaction.user.id);
      if (!User?.permissions.has(PermissionFlagsBits.Administrator))
        return await interaction.editReply({
          content: "[❌] Sem permissão.",
        });
      await defaultGuildConfig.findOneAndUpdate(
        { GuildId: interaction.guildId },
        { $pull: { XPRoles: { role: role?.id } } },
        { upsert: true }
      );
      return await interaction.editReply({
        content: "Cargo removido com sucesso!",
      });
    }

    if (interaction.options.getSubcommand() === "ranking") {
      await interaction.deferReply({ ephemeral: true });
      const leaderboard = await defaultGuildConfig
        .find({ GuildId: interaction.guildId })
        .sort({
          "Users.XP": -1,
        });
      const sortedRanks: Ranks[] = [];
      const slicedRanks: Ranks[][] = [];
      leaderboard[0].Users.forEach((User) => {
        sortedRanks.push({
          userid: User.userId,
          XP: User.XP,
          Level: User.Level,
        });
      });
      sortedRanks.sort((a, b) => b.Level - a.Level);
      for (let i = 0; i < Math.min(sortedRanks.length, 40); i += 5)
        slicedRanks.push(sortedRanks.slice(i, i + 5));

      const GlobalPages: BEmbed[] = [];
      for (let i = 0; i < slicedRanks.length; i++) {
        const embed = new BEmbed()
          .setAuthor({
            name: `${interaction.guild?.name} — Leaderboard`,
          })
          .setColor("#e43d37")
          .setThumbnail(
            interaction.guild?.iconURL() ??
              "https://cdn.discordapp.com/attachments/943547363031670785/1116163222748270592/huh.png"
          )
          .setFooter({ text: `Página ${i + 1} de ${slicedRanks.length}` });
        for (let a = 0; a < Math.min(slicedRanks[i].length, 5); a++) {
          const level = slicedRanks[i][a].Level;
          const xp = slicedRanks[i][a].XP;
          const solvedFormula =
            (5 / 6) *
            (level + 1) *
            (2 * (level + 1) * (level + 1) + 27 * (level + 1) + 91);
          const progressPercent = Math.round((xp / solvedFormula) * 100);
          const filledBarLength = Math.round((20 * progressPercent) / 100);
          const filledBar = "▰".repeat(filledBarLength);
          const emptyBar = "▱".repeat(20 - filledBarLength);
          embed.addFields({
            name: `${
              (await client.users.fetch(slicedRanks[i][a].userid)).username
            } [Lv.${slicedRanks[i][a].Level}] #${
              slicedRanks
                .flat(1)
                .findIndex((usr) => usr.userid === slicedRanks[i][a].userid) + 1
            }`,
            value: `< ${slicedRanks[i][
              a
            ].XP.toLocaleString()} / ${solvedFormula.toLocaleString()} XP >\n${filledBar}${emptyBar} **${progressPercent}%**\n\u200b`,
          });
        }
        GlobalPages.push(embed);
      }

      const pages = {} as { [key: string]: number };
      pages[interaction.user.id] = pages[interaction.user.id] || 0;

      const Rows = (id: string) => {
        return new BButton()
          .addButton({
            customId: "previous",
            emoji: "<:previous_page:1098891318572363877>",
            style: ButtonStyle.Success,
            disabled: pages[id] === 0,
          })
          .addButton({
            customId: "next",
            emoji: "<:next_page:1098891315611193364>",
            style: ButtonStyle.Success,
            disabled: pages[id] === GlobalPages.length - 1,
          });
      };
      const filterIn = (i: Interaction) => i.user.id === interaction.user.id;
      const collector = interaction.channel?.createMessageComponentCollector({
        filter: filterIn,
        time: 50 * 60000,
      });
      await interaction.editReply({
        embeds: [GlobalPages[pages[interaction.user.id]]],
        components: [Rows(interaction.user.id)],
      });

      collector?.on("collect", async (buttonI) => {
        if (!buttonI) return;
        buttonI.deferUpdate();
        if (buttonI.customId === "previous" && pages[interaction.user.id] > 0)
          --pages[interaction.user.id];
        await interaction.editReply({
          embeds: [GlobalPages[pages[interaction.user.id]]],
          components: [Rows(interaction.user.id)],
        });

        if (
          buttonI.customId === "next" &&
          pages[interaction.user.id] < GlobalPages.length - 1
        )
          ++pages[interaction.user.id];
        await interaction.editReply({
          embeds: [GlobalPages[pages[interaction.user.id]]],
          components: [Rows(interaction.user.id)],
        });
      });
    }
    if (interaction.options.getSubcommand() === "ver") {
      await interaction.deferReply({ ephemeral: true });
      const usuário = interaction.options.getUser("usuário");
      defaultGuildConfig.findOne(
        {
          GuildId: interaction.guildId,
          "Users.userId": usuário ? usuário.username : interaction.user.id,
        },
        { "Users.$": 1 },
        {},
        async (err, data) => {
          if (err) throw err;
          if (!data)
            return await interaction.editReply({
              content: "esse usuário não tem XP.",
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
              `[ *${
                usuário ? usuário.id : interaction.user.username
              }* ]\n${filledBar}${emptyBar} **${progressPercent}%**`
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

          await interaction.editReply({ embeds: [Embed] });
        }
      );
    }
  },
} as Command;
