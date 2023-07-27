import { readdirSync } from "fs";
import { AstraLuna } from "../utils/Client";

export class Handler {
  public client: AstraLuna;
  constructor(options: { client: AstraLuna }) {
    this.client = options.client;
  }
  run() {
    readdirSync(`${__dirname}/../Commands`).forEach(async (cmd) => {
      const command = await import(`../Commands/${cmd}`);
      if (!command || !command?.data?.name) return;
      this.client.commands.set(command.data.name, command);
    });
  }
}
