import {
  CacheType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  User,
} from "discord.js";
import { Command } from "../command";
import { AstraLuna } from "../client";
import { BEmbed } from "../components/discord/Embed";
import { GuildDatabases } from "../components/astra/astraDBManager";
class Reputation implements Command {
  public data: SlashCommandBuilder = new SlashCommandBuilder();
  public interaction: ChatInputCommandInteraction | null = null;
  public client: AstraLuna | null = null;
  private comment: string | null = null;
  private user: User | null = null;
  private database: GuildDatabases | null = null;

  constructor() {
    this.data
      .setName("reputação")
      .setDescription("► De uma reputação...")
      .addSubcommand((sub) =>
        sub
          .setName("ajuda")
          .setDescription("► Caso você não entenda como funciona...")
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
          .setDescription("► Dê um shadowban em um usuário malandro!")
          .addUserOption((s) =>
            s
              .setName("usuário")
              .setDescription("► Usuário para entrar na blacklist")
              .setRequired(true)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("whitelist")
          .setDescription("► Remova usuários da blacklist do seu servidor!")
          .addUserOption((s) =>
            s
              .setName("usuário")
              .setDescription("► Usuário para remover da blacklist")
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
          .setName("ver")
          .setDescription("► Veja uma lista de comentários sobre um usuário...")
          .addUserOption((usr) =>
            usr
              .setName("usuário")
              .setDescription("► Usuário...")
              .setRequired(true)
          )
      );
  }

  setClient(client: AstraLuna) {
    this.client = client;
    return this;
  }

  setInteraction(interaction: ChatInputCommandInteraction<CacheType>) {
    this.interaction = interaction;
    return this;
  }

  setDatabase() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");
    this.database = new GuildDatabases({ guild_id: this.interaction?.guildId });
  }

  permissionCheck() {
    if (!this.interaction || !this.client) {
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");
    }

    const User = this.interaction.guild?.members.cache.get(
      this.interaction.user.id
    );
    if (!User?.permissions.has(PermissionFlagsBits.Administrator)) return false;
    return true;
  }

  setMisc() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    this.comment = this.interaction.options.getString("comentário");
    this.user = this.interaction.options.getUser("usuário");
  }

  async ajuda() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    return this.interaction.reply({
      ephemeral: true,
      embeds: [
        new BEmbed()
          .setAuthor({ name: "Seção de ajuda" })
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
          .setThumbnail(this.interaction.user.avatarURL()),
      ],
    });
  }

  async blacklist() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");
    await this.interaction.deferReply();

    const hasPermissions = this.permissionCheck();
    if (!hasPermissions)
      return this.interaction.editReply({
        content: "Você não tem permissão para isso.",
      });

    const usuário = this.interaction.options.getUser("usuário");

    const db = await this.database?.find();
    db?.updateOne(
      { $set: { ["guild_users.$[outer].banned"]: true } },
      { arrayFilters: [{ "outer.user_id": usuário?.id }] }
    );

    return await this.interaction.editReply({
      content: `O usuário ${
        usuário?.globalName ? usuário.globalName : usuário?.username
      } foi permanentemente banido de utilizar esse BOT dentro do servidor.`,
    });
  }

  async whitelist() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    const hasPermissions = this.permissionCheck();
    if (!hasPermissions)
      return this.interaction.editReply({
        content: "Você não tem permissão para isso.",
      });

    const db = await this.database?.find();

    const ban = db?.get(`guild_users.${this.user?.id}.banned`);

    if (!ban) {
      return await this.interaction.editReply({
        content: "Esse usuário não está na blacklist!",
      });
    }

    db?.set(`guild_users.${this.user?.id}.banned`, false);

    return await this.interaction.editReply({
      content: "Usuário desbanido com sucesso.",
    });
  }

  validateOperation() {
    if (this.user?.id === this.interaction?.user.id) return false;

    if (this.user?.bot) return false;

    return true;
  }

  async adicionar() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    await this.interaction.deferReply();

    const validate = this.validateOperation();
    if (!validate) {
      return this.interaction.editReply({ content: "Operação inválida." });
    }

    const db = await this.database?.find();

    const upda = db?.updateOne(
      {
        $push: {
          "guild_users.$[outer].reputation.comments": {
            $each: [
              {
                user_id: this.interaction.user.id,
                comment: this.comment,
                created_at: new Date(),
                positive: true,
              },
            ],
            $sort: {
              created_at: -1,
            },
          },
        },
        $inc: {
          "guild_users.$[outer].reputation.good_reps": 1,
        },
      },
      {
        upsert: true,
        arrayFilters: [{ "outer.user_id": this.user?.id }],
      }
    );
    console.log(upda);
    const embed = new BEmbed()
      .setAuthor({
        name: `${this.user?.globalName}🤝${this.interaction.user.globalName}`,
      })
      .setDescription(
        `**🤑 | REPUTAÇÃO ADICIONADA!**\n${this.user?.globalName} recebeu um ponto de reputação de ${this.interaction.user.globalName}.\n${this.interaction.user.globalName} comentou: "${this.comment}"`
      )
      .setColor("Green");

    await this.interaction.editReply({
      embeds: [embed],
    });
  }

  async remover() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    await this.interaction.deferReply();

    const validate = this.validateOperation();
    if (!validate)
      return this.interaction.editReply({ content: "Operação inválida." });

    const db = await this.database?.find();

    const dbUser = db?.get(`guild_users.$[outer].reputation.bad_reps`);
    if (!dbUser)
      return this.interaction.editReply({
        content: "[❌] Este usuário não tem reputação alguma.",
      });

    db?.updateOne(
      {
        $push: {
          "guild_users.$[outer].reputation.comments": {
            $each: [
              {
                user_id: this.interaction.user.id,
                comment: this.comment,
                created_at: new Date(),
                positive: true,
              },
            ],
            $sort: {
              created_at: -1,
            },
          },
        },
        $inc: {
          "guild_users.$[outer].reputation.bad_reps": 1,
        },
      },
      {
        upsert: true,
        arrayFilters: [{ "outer.user_id": this.user?.id }],
      }
    );

    const embed = new BEmbed()
      .setAuthor({
        name: `${this.user?.globalName}🖕${this.interaction.user.globalName}`,
      })
      .setDescription(
        `**💸 | REPUTAÇÃO REMOVIDA!**\n$${this.interaction.user.globalName} removeu um ponto de reputação de ${this.user?.globalName}.\n${this.interaction.user.globalName} comentou: "${this.comment}"`
      )
      .setColor("Red");

    await this.interaction.editReply({
      embeds: [embed],
    });
  }

  async comentarios() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    await this.interaction.deferReply();

    const validate = this.validateOperation();

    if (!validate) {
      return this.interaction.editReply({ content: "Operação inválida." });
    }

    const db = await this.database?.find();

    const dbUser = db?.get(`guild_users.$[outer].reputation`);
    if (!dbUser) {
      return this.interaction.editReply({
        content: "[❌] Este usuário não tem reputação alguma.",
      });
    }

    const trustPercentage =
      (dbUser.good_reps / (dbUser.good_reps + dbUser.bad_Reps)) * 100;

    const confidenceLevels = [
      { range: [0, 20], level: "⚠️ Muito Baixa ⚠️" },
      { range: [21, 40], level: "⚠️ Baixa" },
      { range: [41, 60], level: "Moderada" },
      { range: [61, 80], level: "Alta" },
      { range: [81, 100], level: "Muito Alta" },
    ];

    const trustLevel = confidenceLevels.find((level) => {
      const [min, max] = level.range;
      return trustPercentage >= min && trustPercentage <= max;
    });

    const embed = new BEmbed()
      .setAuthor({ name: this.user?.globalName ?? "Sem nick" })
      .setDescription(
        `✅ ${dbUser.good_reps} Reputações boa(s)\n❌ ${
          dbUser.bad_Reps
        } Reputações ruim(s)\n📜 ${
          dbUser.comments.length
        } comentário(s)\n❓ ${trustPercentage.toFixed(
          2
        )}% (${trustLevel?.level}).`
      )
      .setColor("Blurple");

    for (const comment of dbUser.comments.slice(0, 5)) {
      const fetchUser = await this.interaction.client?.users.fetch(
        comment.user_id
      );

      embed.addFields({
        name: fetchUser?.globalName ?? "Sem nick",
        value: `> \`${comment.positive ? "✅" : "❌"} ${comment.comment}\``,
        inline: true,
      });
    }

    await this.interaction.editReply({ embeds: [embed] });
  }

  async execute() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    this.setMisc();

    switch (this.interaction.options.getSubcommand()) {
      case "ajuda":
        await this.ajuda();
        break;
      case "blacklist":
        await this.blacklist();
        break;
      case "whitelist":
        await this.whitelist();
        break;
      case "adicionar":
        await this.adicionar();
        break;
      case "remover":
        await this.remover();
        break;
      case "ver":
        await this.comentarios();
        break;
    }
  }
}

export default new Reputation();
