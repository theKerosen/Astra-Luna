import { Command } from "../utils/command";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ChannelType,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import { defaultGuildConfig } from "../Schem/Schematica";
import { BEmbed } from "../Constructors/Embed";

export = {
  data: new SlashCommandBuilder()
    .setName("notificar")
    .setDescription("► Notificação de atualizações > ...")
    .addSubcommandGroup((s) =>
      s
        .setName("configurar")
        .setDescription("configurações")
        .addSubcommand((sub) =>
          sub
            .setName("updates")
            .setDescription("► Updates do Counter-Strike")
            .addChannelOption((sub) =>
              sub
                .setName("canal")
                .setDescription("► Notificação de atualizações > canal")
                .setRequired(true)
            )
            .addRoleOption((sub) =>
              sub
                .setName("cargo")
                .setDescription("► Notificação de canais > menção de cargos")
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("status")
            .setDescription("► Status do Counter-Strike")
            .addChannelOption((sub) =>
              sub
                .setName("canal")
                .setDescription("► Notificação de atualizações > canal")
                .setRequired(true)
            )
        )
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    const Guild = client.guilds.cache.get(interaction.guildId ?? "");
    const User = Guild?.members.cache.get(interaction.user.id);
    if (!User?.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({
        content: "[❌] Sem permissão.",
        ephemeral: true,
      });
    if (interaction.options.getSubcommand() === "updates") {
      const role = interaction.options.getRole("cargo");
      const selectedChannel = interaction.options.getChannel("canal");
      if (selectedChannel?.type !== ChannelType.GuildText)
        return interaction.reply({
          content: "Esse canal não é um canal de texto.",
          ephemeral: true,
        });
      await defaultGuildConfig.findOneAndUpdate(
        { GuildId: interaction.guildId },
        {
          GuildId: interaction.guildId,
          "channels.updatesCS": selectedChannel?.id,
          NotifyRoleId: role?.id,
        },
        { upsert: true }
      );
      interaction.reply({
        content:
          "Canal & Cargo salvo com sucesso, agora você irá ser notificado!",
        ephemeral: true,
      });
      (selectedChannel as TextChannel).send({
        embeds: [
          new BEmbed()
            .setAuthor({ name: "Counter-Strike — Atualizações" })
            .setColor("Aqua")
            .setDescription(
              `Como funciona?\n
              *Quando o Astra Luna detecta novos POSTs (método de requisição HTTP) no [BLOG do Counter-Strike](https://blog.counter-strike.net), irá avisar aqui.*\n
              Tem integração com o BOT do SteamDB?\n
              *Sim, se o BOT do SteamDB estiver configurado para alertar nesse canal, o Astra Luna irá mencionar o cargo configurado automaticamente.*\n
              `
            )
            .setFooter({
              text: "métodos de requisição HTTP são utilizados para receber, aplicar alterações rápidas e adicionar/remover conteúdo de um website. O método mencionado (POST) é para adicionar/remover conteúdo.",
            })
            .setThumbnail(client.user?.avatarURL() || null),
        ],
      });
    }
    if (interaction.options.getSubcommand() === "status") {
      const role = interaction.options.getRole("cargo");
      const selectedChannel = interaction.options.getChannel("canal");
      if (selectedChannel?.type !== ChannelType.GuildText)
        return interaction.reply({
          content: "Esse canal não é um canal de texto.",
          ephemeral: true,
        });
      await defaultGuildConfig.findOneAndUpdate(
        { GuildId: interaction.guildId },
        {
          GuildId: interaction.guildId,
          "channels.csStatus": selectedChannel?.id,
          NotifyRoleId: role?.id,
        },
        { upsert: true }
      );
      interaction.reply({
        content: "Canal salvo com sucesso, agora você irá ser notificado!",
        ephemeral: true,
      });
      (selectedChannel as TextChannel).send({
        embeds: [
          new BEmbed()
            .setAuthor({ name: "Counter-Strike — Status Geral" })
            .setDescription(
              `Como funciona?\n
              *O Astra Luna irá avisar automaticamente (a cada 45 segundos) caso os servidores do Counter-Strike caírem, estiverem lentos ou até mesmo se acabaram de ligar.*\n
              `
            )
            .setFooter({
              text: "É melhor deixar esse canal silenciado pois as notificações podem acabar incomodando bastante.",
            })
            .setThumbnail(client.user?.avatarURL() || null),
        ],
      });
    }
  },
} as Command;
