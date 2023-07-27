import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ButtonStyle,
  Interaction,
} from "discord.js";
import { Command } from "../utils/command";
import { defaultGuildConfig } from "../mongooseSchemas/Schematica";
import { AstraLuna } from "../utils/Client";
import { XPRank, displayInformation } from "../astraComponents/xpSystem";
import { BButton } from "../discordComponents/Button";

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
      s.setName("ranking").setDescription("► (desativado)!")
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
      if (role?.name === "@everyone")
        return interaction.editReply({
          content:
            "Cargos com o nome de @everyone são desabilitados por motivos de segurança.",
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

    if (interaction.options.getSubcommand() === "ver") {
      await interaction.deferReply();
      const usuário = interaction.options.getUser("usuário");
      const embed = await new displayInformation({
        client: client,
        interaction: interaction,
      }).generateDisplay(usuário ? usuário?.id : interaction.user.id);
      interaction.editReply({
        embeds: [embed],
      });
    }

    if (interaction.options.getSubcommand() === "ranking") {
      await interaction.deferReply();
      client.xpRankingPages.set(`${interaction.user.id}_rankingPage`, {
        usrIndex: 5,
      });
      const pageInformation = client.xpRankingPages.get(
        `${interaction.user.id}_rankingPage`
      );

      const guild = await new XPRank({
        client: client,
        interaction: interaction,
      }).findAndSaveServer();
      const embed = await new XPRank({
        client: client,
        interaction: interaction,
      }).generatePage(interaction.user.id);
      const Buttons = () =>
        new BButton()
          .addButton({
            customId: "rank_prev",
            emoji: "<:previous_page:1098891318572363877>",
            style: ButtonStyle.Primary,
            disabled: pageInformation?.usrIndex === 5,
          })
          .addButton({
            customId: "rank_x",
            emoji: "❌",
            style: ButtonStyle.Secondary,
            disabled: true,
          })
          .addButton({
            customId: "rank_next",
            emoji: "<:next_page:1098891315611193364>",
            style: ButtonStyle.Primary,
            disabled: pageInformation
              ? 0 >
                guild.Users.slice(
                  pageInformation.usrIndex,
                  pageInformation.usrIndex + 5
                ).length -
                  1
              : true,
          });

      if (embed)
        await interaction
          .editReply({
            embeds: [embed],
            components: [Buttons()],
          })

          .then((r) => {
            const filterIn = (i: Interaction) =>
              i.user.id === interaction.user.id;

            const collector = r.createMessageComponentCollector({
              filter: filterIn,
              time: 120000,
            });

            collector.on("collect", async (button) => {
              await button.deferUpdate();
              switch (button.customId) {
                case "rank_prev":
                  {
                    if (pageInformation) {
                      client.xpRankingPages.set(
                        `${interaction.user.id}_rankingPage`,
                        {
                          usrIndex: (pageInformation.usrIndex -= 5),
                        }
                      );
                      const embed = await new XPRank({
                        client: client,
                        interaction: interaction,
                      }).generatePage(interaction.user.id);
                      if (embed)
                        await interaction.editReply({
                          embeds: [embed],
                          components: [Buttons()],
                        });
                    }
                  }
                  break;
                case "rank_next": {
                  if (pageInformation) {
                    client.xpRankingPages.set(
                      `${interaction.user.id}_rankingPage`,
                      {
                        usrIndex: (pageInformation.usrIndex += 5),
                      }
                    );
                    const embed = await new XPRank({
                      client: client,
                      interaction: interaction,
                    }).generatePage(interaction.user.id);
                    if (embed)
                      await interaction.editReply({
                        embeds: [embed],
                        components: [Buttons()],
                      });
                  }
                }
              }
            });
            collector.on("end", () => {
              client.xpRankingPages.delete(
                `${interaction.user.id}_rankingPage`
              );
            });
          });
    }
  },
} as Command;
