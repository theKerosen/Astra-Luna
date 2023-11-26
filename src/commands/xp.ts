import {
  AttachmentBuilder,
  CacheType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { AstraLuna } from "../client";
import { GuildCollection } from "../schematicas/Schematica";
import { DisplayInformation } from "../components/astra/astraXP";
import { Command } from "../command";

class XPCommand implements Command {
  public data: SlashCommandBuilder = new SlashCommandBuilder();
  public interaction: ChatInputCommandInteraction | null = null;
  public client: AstraLuna | null = null;

  constructor() {
    this.data
      .setName("xp")

      .setDescription("► Veja informações sobre seu XP!")
      .addSubcommand((s) =>
        s
          .setName("ver")
          .setDescription("► Veja o XP de alguém ou o seu próprio")
          .addUserOption((s) =>
            s.setName("usuário").setDescription("o usuário")
          )
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

  async adicionar() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    await this.interaction.deferReply();
    const role = this.interaction.options.getRole("cargo");
    const level = this.interaction.options.getInteger("level");
    const User = this.interaction.guild?.members.cache.get(
      this.interaction.user.id
    );

    if (!User?.permissions.has(PermissionFlagsBits.Administrator))
      return await this.interaction.editReply({
        content: "[❌] Sem permissão.",
      });
    if (role?.name === "@everyone")
      return this.interaction.editReply({
        content:
          "Cargos com o nome de @everyone são desabilitados por motivos de segurança.",
      });

    await GuildCollection.findOneAndUpdate(
      { GuildId: this.interaction.guildId },
      { $push: { XPRoles: { role: role?.id, level: level } } },
      { upsert: true }
    );
    return await this.interaction.editReply({
      content: "Cargo adicionado com sucesso!",
    });
  }

  async remover() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    await this.interaction.deferReply();

    const role = this.interaction.options.getRole("cargo");
    const User = this.interaction.guild?.members.cache.get(
      this.interaction.user.id
    );

    if (!User?.permissions.has(PermissionFlagsBits.Administrator))
      return await this.interaction.editReply({
        content: "[❌] Sem permissão.",
      });

    await GuildCollection.findOneAndUpdate(
      { GuildId: this.interaction.guildId },
      { $pull: { XPRoles: { role: role?.id } } },
      { upsert: true }
    );
    return await this.interaction.editReply({
      content: "Cargo removido com sucesso!",
    });
  }

  async ver() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");

    await this.interaction.deferReply();
    const usuário = this.interaction.options.getUser("usuário");
    const buffer = await new DisplayInformation(
      this.interaction
    ).generateDisplay(usuário ? usuário?.id : this.interaction.user.id);
    const attachment = new AttachmentBuilder(Buffer.from(buffer), {
      name: "card.png",
    });
    this.interaction.editReply({
      files: [attachment],
    });
  }

  async execute() {
    if (!this.interaction || !this.client)
      return console.error("INTERACTION/CLIENT IS NOT DEFINED.");
    switch (this.interaction.options.getSubcommand()) {
      case "adicionar":
        this.adicionar();
        break;
      case "remover":
        this.remover();
        break;
      case "ver":
        this.ver();
        break;
    }
  }
}

export default new XPCommand();
