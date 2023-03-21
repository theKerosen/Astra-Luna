import * as dotenv from "dotenv";
dotenv.config();
import { Client, Collection } from "discord.js";
import { Command } from "./command";
import { connect, set } from "mongoose";

class XPManager extends Client {
  commands: Collection<string, Command> = new Collection();
  misc: Collection<unknown, unknown> = new Collection();
  constructor() {
    super({ intents: 3276799 });
  }

  login() {
    return super.login(process.env.TOKEN);
  }
  mongoConnect() {
    set("strictQuery", true);
    return connect(process.env.MONGO_URI ?? "").then(() =>
      console.log("\x1b[35m[Mongoose] \x1b[36mConectado ao MongoDB")
    );
  }
}
export { XPManager };
