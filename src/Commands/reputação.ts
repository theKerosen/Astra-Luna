import { Command } from "../utils/command";
import { RepSchem, shadowBanSchema } from "../Schem/Schematica";
import { BEmbed } from "../Constructors/Embed";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  codeBlock,
} from "discord.js";
const softbannedUsers = new Map();
export = {
  data: new SlashCommandBuilder()
    .setName("reputação")
    .setDescription("► De uma reputação...")
    .addSubcommand((sub) =>
      sub
        .setName("ajuda")
        .setDescription("Caso você não entenda como funciona...")
    )
    .addSubcommand((sub) =>
      sub
        .setName("remover")
        .setDescription("► Adicione pontos negativos para um usuário...")
        .addUserOption((usr) =>
          usr
            .setName("usuário")
            .setDescription("► Usuário...")
            .setRequired(true)
        )
        .addStringOption((string) =>
          string
            .setName("comentário")
            .setDescription("► Comentário..?")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("blacklist")
        .setDescription("Dê um shadowban em um usuário malandro!")
        .addUserOption((s) =>
          s
            .setName("usuário")
            .setDescription("usuário para entrar na blacklist")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("adicionar")
        .setDescription("► Adicione pontos positivos para um usuário...")
        .addUserOption((usr) =>
          usr
            .setName("usuário")
            .setDescription("► Usuário...")
            .setRequired(true)
        )
        .addStringOption((string) =>
          string
            .setName("comentário")
            .setDescription("► Comentário..?")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("comentários")
        .setDescription("► Veja uma lista de comentários sobre um usuário...")
        .addUserOption((usr) =>
          usr
            .setName("usuário")
            .setDescription("► Usuário...")
            .setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "ajuda") {
      return interaction.reply({
        embeds: [
          new BEmbed()
            .setAuthor({ name: "Sessão de ajuda" })
            .setDescription(
              "O sistema de reputação foi feito com a intenção de ajudar pessoas que vendem/trocam items dentro do servidor a passar maior confiança para o outro usuário."
            )
            .addFields(
              {
                name: "O sistema de comentários",
                value:
                  "O sistema de comentários tem foco em deixar um feedback sobre a venda/troca para outros usuários.\n",
              },
              {
                name: 'O sistema de "Anti-Rep Bombing"',
                value:
                  "Para ter um melhor equilíbrio entre as reputações, usuários que derem 3 pontos de reputação negativa em menos uma hora serão punidos automaticamente.\n",
              },
              {
                name: "O sistema de Fator de Confiança",
                value:
                  "Todo usuário tem uma porcentagem% de confiança, caso tenha mais pontos de reputação ruins do que boas, essa porcentagem cai, caso contrário, sobe.\nQuando um usuário tem uma porcentagem% de reputação muito baixa, um aviso óbvio será emitido ao lado de sua porcentagem% de confiança.\n",
              },
              {
                name: "/reputação adicionar <usuário> (Slash Command)",
                value:
                  "Esse comando é utilizado para adicionar pontos de reputação para um usuário",
              },
              {
                name: "/reputação remover <usuário> (Slash Command)",
                value:
                  "Esse comando é utilizado para remover pontos de reputação para um usuário",
              },
              {
                name: "/reputação comentários <usuário> (Slash Command)",
                value:
                  "Esse comando é utilizado para ver informações de reputação para um usuário",
              }
            )
            .setColor("Blurple")
            .setThumbnail(interaction.user.avatarURL()),
        ],
        ephemeral: true,
      });
    }
    if (subcommand === "blacklist") {
      const Guild = client.guilds.cache.get(interaction.guildId ?? "");
      const User = Guild?.members.cache.get(interaction.user.id);
      if (User?.id != "434360273726341160")
        return interaction.reply({
          content: "[❌] Sem permissão.",
          ephemeral: true,
        });
      const usuário = interaction.options.getUser("usuário");
      await shadowBanSchema.create({ userId: usuário?.id });
      return interaction.reply({
        content: "Usuário banido com sucesso.",
        ephemeral: true,
      });
    }

    const shadowban = await shadowBanSchema.findOne({
      userId: interaction.user.id,
    });
    if (shadowban)
      return interaction.reply({
        content:
          "[❌] Você está permanentemente banido de usar o sistema de reputações.",
        ephemeral: true,
      });
    if (
      softbannedUsers.has(interaction.user.id) &&
      softbannedUsers.get(interaction.user.id) > Date.now()
    ) {
      const remainingTime = Math.ceil(
        (softbannedUsers.get(interaction.user.id) - Date.now()) / 1000
      );
      return interaction.reply({
        content: `[❌] Você está sendo limitado de usar o sistema de Reputação. Aguarde ${remainingTime} segundos.`,
        ephemeral: true,
      });
    }
    if (subcommand === "adicionar" || subcommand === "remover") {
      const comment = interaction.options.getString("comentário");
      const user = interaction.options.getUser("usuário");

      if (user?.id === interaction.user.id) {
        const content =
          subcommand === "adicionar"
            ? "[❌] Você não pode adicionar pontos de reputação a si mesmo."
            : "[❌] Você não pode remover pontos de reputação a si mesmo.";

        return interaction.reply({ content, ephemeral: true });
      }
      const isPositive = subcommand === "adicionar";
      if (!isPositive && user?.id) {
        const currentTimestamp = Date.now();
        const index = await RepSchem.findOne({ UserId: user.id });

        if (index) {
          const negativeReviews = index.Comments.filter(
            (comment: {
              isPositive: boolean;
              createdAt: number;
              userId: string;
            }) =>
              !comment.isPositive &&
              comment.userId === interaction.user.id &&
              comment.createdAt >= currentTimestamp - 3600000 &&
              comment.createdAt <= currentTimestamp
          );
          console.log(negativeReviews);
          if (negativeReviews.length >= 2) {
            const softbanExpiration = Date.now() + 3600000;
            if (!softbannedUsers.has(interaction.user.id))
              softbannedUsers.set(interaction.user.id, softbanExpiration);
          }
        }
      }
      await RepSchem.findOneAndUpdate(
        {
          UserId: user?.id,
        },
        {
          $push: {
            Comments: {
              $each: [
                {
                  userId: interaction.user.id,
                  comment: comment,
                  createdAt: new Date(),
                  isPositive,
                },
              ],
              $sort: {
                createdAt: -1,
              },
            },
          },
          $inc: {
            goodRep: isPositive ? 1 : 0,
            badRep: isPositive ? 0 : 1,
          },
        },

        { upsert: true }
      );
      const embed = new BEmbed()
        .setAuthor({
          name: `${user?.username}${isPositive ? "🤝" : "🖕"}${
            interaction.user.username
          }`,
        })
        .setDescription(
          `**${
            isPositive
              ? "🤑 | REPUTAÇÃO ADICIONADA!"
              : "💸 | REPUTAÇÃO REMOVIDA!"
          } **\n${codeBlock(
            `${isPositive ? user?.username : interaction.user.username} ${
              isPositive ? "recebeu" : "removeu"
            } ponto de reputação de ${
              isPositive ? interaction.user.username : user?.username
            }.\n${interaction.user.username} comentou: "${comment}"`
          )}`
        )
        .setColor(isPositive ? "Green" : "Red");

      interaction.reply({ embeds: [embed] });
    }
    if (subcommand === "comentários") {
      const user = interaction.options.getUser("usuário");
      const index = await RepSchem.findOne({ UserId: user?.id });

      if (!index) {
        return interaction.reply({
          content: "[❌] Este usuário não tem reputação alguma.",
          ephemeral: true,
        });
      }

      const trustPercentage =
        (index.goodRep / (index.goodRep + index.badRep)) * 100;

      const confidenceLevels = [
        { range: [0, 20], level: "⚠️ Muito Baixa ⚠️" },
        { range: [21, 40], level: "⚠️ Baixa ⚠️" },
        { range: [41, 60], level: "Moderada" },
        { range: [61, 80], level: "Alta" },
        { range: [81, 100], level: "Muito Alta" },
      ];

      const trustLevel = confidenceLevels.find((level) => {
        const [min, max] = level.range;
        return trustPercentage >= min && trustPercentage <= max;
      });

      const embed = new BEmbed()
        .setAuthor({ name: user?.username ?? "Sem nick" })
        .setDescription(
          `✅ ${index.goodRep} Reputações boa(s)\n❌ ${
            index.badRep
          } Reputações ruim(s)\n📜 ${
            index.Comments.length
          } comentário(s)\n❓ ${trustPercentage.toFixed(2)}% (${
            trustLevel?.level
          }).`
        )
        .setColor("Blurple");

      for (const comment of index.Comments.slice(0, 5)) {
        const fetchUser = await client?.users.fetch(comment.userId);

        embed.addFields({
          name: fetchUser?.username ?? "Sem nick",
          value: `> \`${comment.isPositive ? "✅" : "❌"} ${comment.comment}\``,
          inline: true,
        });
      }

      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
} as Command;
