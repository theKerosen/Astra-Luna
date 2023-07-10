import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ButtonStyle,
  Interaction,
} from "discord.js";
import { Command } from "../utils/command";
import { defaultGuildConfig } from "../Schem/Schematica";
import { BEmbed } from "../Constructors/Embed";
import { BButton } from "../Constructors/Button";
import { AstraLuna } from "../utils/Client";

interface Ranks {
  userid: string;
  XP: number;
  Level: number;
}
interface Roles {
  role: string;
  level: number;
}

export = {
  data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("► Veja informações sobre seu XP!")
    .addSubcommand((s) =>
      s
        .setName("ver")
        .setDescription("► Veja o XP de alguém ou o seu próprio")
        .addUserOption((s) => s.setName("usuário").setDescription("o usuário"))
    )
    .addSubcommand((s) =>
      s.setName("ranking").setDescription("► Veja o ranking do servidor!")
    )
    .addSubcommandGroup((s) =>
      s
        .setName("cargos")
        .setDescription("► Configure cargos de XP para o seu servidor")
        .addSubcommand((sub) =>
          sub
            .setName("adicionar")
            .setDescription("► Configure cargos de XP para o seu servidor")
            .addRoleOption((r) =>
              r
                .setName("cargo")
                .setDescription("► Cargo que será dado ao usuário")
                .setRequired(true)
            )
            .addIntegerOption((i) =>
              i
                .setName("level")
                .setDescription(
                  "► O nível que o usuário precisa ter para receber esse cargo"
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
                .setDescription("Cargo que será dado ao usuário")
                .setRequired(true)
            )
        )
    ),
  async execute(interaction: ChatInputCommandInteraction, client: AstraLuna) {
    if (interaction.options.getSubcommand() === "adicionar") {
      await interaction.deferReply();
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
      await interaction.deferReply();
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
      await interaction.deferReply();
      const leaderboard = await defaultGuildConfig
        .find({ GuildId: interaction.guildId })
        .sort({
          "Users.XP": -1,
        });
      const roles = await defaultGuildConfig.findOne({
        GuildId: interaction.guildId,
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
      sortedRanks.sort((a, b) => b.Level - a.Level).sort((a, b) => b.XP - a.XP);
      for (let i = 0; i < Math.min(sortedRanks.length, 40); i += 5)
        slicedRanks.push(sortedRanks.slice(i, i + 5));
      const GlobalPages: BEmbed[] = [];
      for (let i = 0; i < slicedRanks.length; i++) {
        const embed = new BEmbed()
          .setTitle(interaction.guild?.name ?? null)
          .setColor("NotQuiteBlack")
          .setThumbnail(interaction.guild?.iconURL() ?? null)
          .setFooter({ text: `Página ${i + 1} de ${slicedRanks.length}` });
        for (let a = 0; a < Math.min(slicedRanks[i].length, 5); a++) {
          const level = slicedRanks[i][a].Level;
          const solvedFormula =
            (5 / 6) *
            (level + 1) *
            (2 * (level + 1) * (level + 1) + 27 * (level + 1) + 91);
          const user = await client.users.fetch(slicedRanks[i][a].userid);
          const member = await interaction.guild?.members
            .fetch(user.id)
            .catch(() =>
              console.log(
                "[ASTRA LUNA] -> GuildMember#fetch() falhou, ignorando membro..."
              )
            );
          if (member && roles) {
            for (let i = 0; roles?.XPRoles.length > i; i++) {
              const memberRoles = member.roles.cache.get(
                roles?.XPRoles[i].role
              );
              if (memberRoles?.id === roles?.XPRoles[i].role)
                client.roles
                  .set(user.id, roles?.XPRoles[i])
                  .sort((a: Roles, b: Roles) => b.level - a.level);
            }
          }
          embed.addFields({
            name: `#${
              slicedRanks
                .flat(1)
                .findIndex((usr) => usr.userid === slicedRanks[i][a].userid) + 1
            } ${user.globalName ?? user.username}`,
            value: `├ [Lv.${slicedRanks[i][a].Level}]\n├ [${slicedRanks[i][
              a
            ].XP.toLocaleString()} / ${solvedFormula.toLocaleString()} XP]\n└ ${
              client.roles.get(user.id)
                ? `<@&${client.roles.get(user.id)?.role}>`
                : "Sem Cargo"
            }`,
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
            style: ButtonStyle.Primary,
            disabled: pages[id] === 0,
          })
          .addButton({
            customId: "blank1",
            emoji: "❌",
            style: ButtonStyle.Secondary,
            disabled: true,
          })
          .addButton({
            customId: "next",
            emoji: "<:next_page:1098891315611193364>",
            style: ButtonStyle.Primary,
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
      await interaction.deferReply();
      const usuário = interaction.options.getUser("usuário");
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
          const sortedRoles: Roles[] = [];
          const data2 = await defaultGuildConfig.findOne({
            GuildId: interaction.guildId,
          });
          if (data2?.XPRoles)
            for (let i = 0; data2?.XPRoles.length > i; i++)
              await interaction.guild?.members
                .fetch(usuário ? usuário.id : interaction.user.id)
                .then((user) => user.roles.cache.get(data2.XPRoles[i].role))
                .then((role) => {
                  if (role && role.id === data2.XPRoles[i].role)
                    sortedRoles.push(data2.XPRoles[i]);
                  sortedRoles.sort((a, b) => b.level - a.level);
                });

          const Embed = new BEmbed()
            .setTitle(
              `${
                usuário
                  ? usuário.globalName ?? usuário.username
                  : interaction.user.globalName ?? interaction.user.username
              } [Lv.${level}]`
            )
            .setThumbnail(
              usuário
                ? usuário.avatarURL()
                : interaction.user.avatarURL() ||
                    "https://cdn.discordapp.com/attachments/943547363031670785/1116163222748270592/huh.png"
            )
            .setColor("Purple")
            .setDescription(
              `<@&${sortedRoles[0].role}> [${xp.toLocaleString()}/${(
                (5 / 6) *
                  (level + 1) *
                  (2 * (level + 1) * (level + 1) + 27 * (level + 1) + 91) -
                xp
              ).toLocaleString()} XP]\n${filledBar}${emptyBar} **${progressPercent}%**`
            );

          return await interaction.editReply({ embeds: [Embed] });
        }
      );
    }
  },
} as Command;
