import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { AstraLuna } from "../Client";
import { Command } from "../command";
import { WarnSystem, warnTypes } from "../components/astra/warn";

class Warn implements Command {
  client: AstraLuna | null = null;
  data: SlashCommandBuilder = new SlashCommandBuilder();
  interaction: ChatInputCommandInteraction<CacheType> | null = null;
  warnSystem: WarnSystem | null = null;

  constructor() {
    this.data
      .setName("aviso")
      .setDescription("► Sistema de avisos!")
      .addSubcommand((s) =>
        s
          .setName("adicionar")
          .setDescription("► Adicione um aviso para um usuário")
          .addUserOption((u) =>
            u
              .setName("usuário")
              .setDescription("► O usuário que receberá o aviso")
              .setRequired(true)
          )
      )
      .addSubcommandGroup((sg) =>
        sg
          .setName("configurar")
          .setDescription("► Configure o sistema de wanrs para o seu gosto!")
          .addSubcommand((s) =>
            s
              .setName("quantidade")
              .setDescription("► Quantidade de avisos possíveis no servidor")
              .addIntegerOption((i) =>
                i
                  .setName("quantidade")
                  .setDescription("► Quantidade de avisos...")
                  .setRequired(true)
              )
          )
          .addSubcommand((s) =>
            s
              .setName("punições_por_aviso")
              .setDescription(
                "► Configure as punições que serão aplicadas a cada X avisos"
              )
              .addIntegerOption((s) =>
                s
                  .setName("quantidade")
                  .setDescription(
                    "► Com quantos avisos o usuário receberá essa punição?"
                  )
                  .setRequired(true)
              )
              .addIntegerOption((s) =>
                s
                  .setName("punições")
                  .setDescription("► Escolha uma das opções")
                  .addChoices(
                    {
                      name: "Nada",
                      value: 0,
                    },
                    {
                      name: "Silenciar",
                      value: 1,
                    },
                    {
                      name: "Expulsar",
                      value: 2,
                    },
                    {
                      name: "Banir",
                      value: 3,
                    }
                  )
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

  setWarnSystem() {
    if (!this.interaction || !this.client)
      throw console.log("NO INTERACTION/CLIENT!");

    this.warnSystem = new WarnSystem({
      client: this.client,
      interaction: this.interaction,
    });

    return this;
  }

  async adicionar() {
    if (!this.interaction || !this.client || !this.warnSystem)
      throw console.log("NO INTERACTION/CLIENT!");

    const user = this.interaction.options.getUser("usuário", true);
    const issueWarn = await this.warnSystem.applyWarn(user.id);
    const getWarns = await this.warnSystem.scanForWarns(user.id);
    console.log(issueWarn, getWarns);
  }

  async warnSize() {
    if (!this.interaction || !this.client || !this.warnSystem)
      throw console.log("NO INTERACTION/CLIENT!");
    const warnSize = this.interaction.options.getInteger("quantidade", true);

    await this.warnSystem.setWarnSize(warnSize);
    this.interaction.reply({
      content: `A quantidade de avisos agora é ${warnSize}.`,
      ephemeral: true,
    });
  }

  async setWarnPunishment() {
    if (!this.interaction || !this.client || !this.warnSystem)
      throw console.log("NO INTERACTION/CLIENT!");

    const warnSize = this.interaction.options.getInteger("quantidade", true);
    const punishmentType = this.interaction.options.getInteger(
      "punições",
      true
    ) as warnTypes;

    await this.warnSystem.createWarnRule(warnSize, punishmentType);
    this.interaction.reply({
      content: `Nova regra de aviso adicionada.`,
      ephemeral: true,
    });
  }

  async execute() {
    if (!this.interaction || !this.client)
      throw console.log("NO INTERACTION/CLIENT!");

    this.setWarnSystem();

    switch (this.interaction.options.getSubcommand()) {
      case "adicionar":
        this.adicionar();
        break;
      case "quantidade":
        this.warnSize();
        break;
      case "punições_por_aviso":
        this.setWarnPunishment();
    }
  }
}

export default new Warn();
