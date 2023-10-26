import * as dotenv from "dotenv";
dotenv.config();
import { Client, Collection } from "discord.js";
import { connect, set } from "mongoose";
import { Command } from "./command";

export class AstraLuna extends Client {
  commands: Collection<string, Command> = new Collection();
  misc: Collection<unknown, unknown> = new Collection();
  votes: Collection<unknown, unknown> = new Collection();
  roles: Collection<string, { role: string; level: number }> = new Collection();

  constructor() {
    super({ intents: 3276799 });
  }

  login() {
    return super.login(process.env.TOKEN);
  }
  async mongoConnect() {
    set("strictQuery", true);
    await connect(process.env.MONGO_URI ?? "");
    return console.log("[Astra Luna] -> Conexão com Mongoose iniciada.");
  }
}
