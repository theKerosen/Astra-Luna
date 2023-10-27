import {
  APIRole,
  CacheType,
  ChannelType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { AstraLuna } from "../Client";
import { Command } from "../command";
import { BEmbed } from "../components/discord/Embed";
import { defaultGuildConfig } from "../schematicas/Schematica";

class Notify implements Command {
  client: AstraLuna | null = null;
  data: SlashCommandBuilder = new SlashCommandBuilder();
  interaction: ChatInputCommandInteraction<CacheType> | null = null;
  role: Role | APIRole | null = null;
  channel: TextChannel | null = null;

  constructor() {
    this.data
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
      );
  }
  setMisc() {
    if (!this.interaction || !this.client)
      throw console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    this.role = this.interaction.options.getRole("cargo");
    this.channel = this.interaction.options.getChannel("canal", true, [
      ChannelType.GuildText,
    ]);
  }

  setClient(client: AstraLuna) {
    this.client = client;
    return this;
  }

  setInteraction(interaction: ChatInputCommandInteraction<CacheType>) {
    this.interaction = interaction;
    return this;
  }

  async updates() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    await defaultGuildConfig.findOneAndUpdate(
      { GuildId: this.interaction.guildId },
      {
        GuildId: this.interaction.guildId,
        "channels.updatesCS": this.channel?.id,
        NotifyRoleId: this.role?.id,
      },
      { upsert: true }
    );
    this.interaction.reply({
      content:
        "Canal & Cargo salvo com sucesso, agora você irá ser notificado!",
    });
    this.channel?.send({
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
          .setThumbnail(this.client.user?.avatarURL() ?? null),
      ],
    });
  }
  async status() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    await defaultGuildConfig.findOneAndUpdate(
      { GuildId: this.interaction.guildId },
      {
        GuildId: this.interaction.guildId,
        "channels.csStatus": this.channel?.id,
        NotifyRoleId: this.role?.id,
      },
      { upsert: true }
    );
    this.interaction.reply({
      content: "Canal salvo com sucesso, agora você irá ser notificado!",
    });
    this.channel?.send({
      embeds: [
        new BEmbed()
          .setAuthor({ name: "Counter-Strike — Status Geral" })
          .setColor("Aqua")
          .setDescription(
            `Como funciona?\n
              *O Astra Luna irá avisar automaticamente (a cada 45 segundos) caso os servidores do Counter-Strike caírem, estiverem lentos ou até mesmo se acabaram de ligar.*\n
              `
          )
          .setFooter({
            text: "É melhor deixar esse canal silenciado pois as notificações podem acabar incomodando bastante.",
          })
          .setThumbnail(this.client.user?.avatarURL() ?? null),
      ],
    });
  }

  async execute() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    this.setMisc();

    const Guild = this.client.guilds.cache.get(this.interaction.guildId ?? "");
    const User = Guild?.members.cache.get(this.interaction.user.id);
    if (!User?.permissions.has(PermissionFlagsBits.Administrator)) {
      this.interaction.reply({
        content: "[❌] Sem permissão.",
      });
      return;
    }

    switch (this.interaction.options.getSubcommand()) {
      case "updates":
        this.updates();
        break;
      case "status":
        this.status();
        break;
    }
  }
}

export default new Notify();
