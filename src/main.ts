import { AstraLuna } from "./Client";
import { Inicializar, ClientInteraction } from "./components/astra/events";
import { BaseHandler } from "./components/astra/loader";
import { Mensagem } from "./components/astra/xp";
import { StatusCS } from "./components/astra/counterStrike";
import { Rastreador } from "./components/astra/updateSniffer";
import { schedule } from "node-cron";

export class Main extends AstraLuna {
  public eventHandler: EventHandler;
  public inicializar: Inicializar;
  public status: StatusCS;
  public rastreador: Rastreador;

  constructor() {
    super();
    this.inicializar = new Inicializar({ client: this });
    this.eventHandler = new EventHandler(this.inicializar, this);
    this.status = new StatusCS();
    this.rastreador = new Rastreador(10);
  }

  async main() {
    this.login();
    this.mongoConnect();
    schedule("*/50 * * * * *", () => {
      this.status.checkAll();
      this.rastreador.rastrearIdentificador();
    });

    this.eventHandler.ready().interaction().message();
  }
}

export class EventHandler {
  private inicializar: Inicializar;
  private client: AstraLuna;
  private handler: BaseHandler;
  constructor(inicializar: Inicializar, client: AstraLuna) {
    this.inicializar = inicializar;
    this.client = client;
    this.handler = new BaseHandler(this.client);
  }

  ready() {
    this.client.once("ready", async () => {
      await this.handler.loadCommands();
      this.inicializar.run();
      await this.handler.sendCommands();
    });

    return this;
  }

  interaction() {
    this.client.on("interactionCreate", (i) =>
      new ClientInteraction({
        client: this.client,
        interaction: i,
      }).run(this.handler)
    );
    return this;
  }

  message() {
    this.client.on("messageCreate", (m) => new Mensagem(m).run());
    return this;
  }
}

new Main().main();
