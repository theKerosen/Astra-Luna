import { EventEmitter } from "events";
import { AstraLuna } from "../../client";
import { BaseHandler } from "./astraLoader";
import { Mensagem } from "./astraXP";
import { CacheType, GuildMember, Interaction, Message } from "discord.js";
import { schedule } from "node-cron";
import { Rastreador } from "./astraCounterStrikeUpdates";
import { StatusCS } from "./astraCounterStrike";
import { AutoRole } from "./astraAutoRole";
import { AstraEvents } from "./astraEvents";

export class AHandler extends AstraLuna {
  public i_handler: BaseHandler;
  private event: EventEmitter;

  constructor() {
    super();
    this.event = new EventEmitter();
    this.i_handler = new BaseHandler();
  }

  async ready() {
    this.event.emit("aHandlerReadyEvent");
    this.user?.setStatus("idle");
    await this.i_handler.loadCommands();
    await this.i_handler.sendCommands();
  }

  message(message: Message<boolean>) {
    new Mensagem(message).run();
    this.event.emit("aHandlerMessageEvent");
  }

  async interaction(interaction: Interaction<CacheType>) {
    this.event.emit("aHandlerInteractionEvent");

    if (interaction.isChatInputCommand())
      await this.i_handler.runCommand(interaction, this);
  }
  async memberJoin(member: GuildMember) {
    new AutoRole().addRole(member);
    this.event.emit("aGuildJoinEvent");
  }
}

export class AController extends AstraLuna {
  private event: EventEmitter;
  private handler: AHandler;

  constructor() {
    super();
    this.event = new EventEmitter();
    this.handler = new AHandler();
  }

  main() {
    this.p_Client();

    this.event.once("aClientStart", () => {
      console.log("[Astra Luna] Internal Client Started.");

      this.p_Handler();
      this.p_Database();
      this.p_Misc();
    });

    this.event.once("aClientDatabaseStart", () =>
      console.log("[Astra Luna] Database connection Established.")
    );

    this.event.once("aHandlerStart", () =>
      console.log("[Astra Luna] Handler is now running.")
    );

    this.event.once("aMiscStart", () =>
      console.log("[Astra Luna] Misc modules are now running.")
    );
  }
  p_Client() {
    this.event.emit("aClientBoot");
    this.login().then(async () => {
      this.event.emit("aClientStart");
    });
  }

  p_Database() {
    this.event.emit("aClientDatabaseBoot");
    this.mongoConnect().then(() => {
      this.event.emit("aClientDatabaseStart");
    });
  }

  p_Handler() {
    this.event.emit("aHandlerBoot");

    this.on("ready", async () => await this.handler.ready());
    this.on(
      "interactionCreate",
      async (i) => await this.handler.interaction(i)
    );
    this.on("messageCreate", (m) => this.handler.message(m));

    this.on("guildMemberAdd", (m) => this.handler.memberJoin(m));

    this.event.emit("aHandlerStart");
  }

  p_Misc() {
    this.event.emit("aMiscBoot");
    schedule("*/50 * * * * *", () => {
      new AstraEvents().status();
      new StatusCS().checkAll();
      new Rastreador(10).rastrearIdentificador();
    });
    this.event.emit("aMiscStart");
  }
}
