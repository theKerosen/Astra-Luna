import * as dotenv from "dotenv";
dotenv.config();
import { Client, Collection } from "discord.js";
import { Command } from "./command";
import { connect, set } from "mongoose";
import Steam from "steam-user";
import csgo from "globaloffensive";

const SteamClient = new Steam({
  autoRelogin: true,
});
SteamClient.logOn({
  accountName: process.env.steamName,
  password: process.env.steamPassword,
});
SteamClient.on("loggedOn", async () => {
  SteamClient.setPersona(Steam.EPersonaState.Online);
  await SteamClient.gamesPlayed([730]);
  console.log("\x1b[35m[Steam] \x1b[36mLogado na Steam");
});

const CSGOClient = new csgo(SteamClient);
class AstraLuna extends Client {
  commands: Collection<string, Command> = new Collection();
  misc: Collection<unknown, unknown> = new Collection();
  votes: Collection<unknown, unknown> = new Collection();
  toggleModules: Collection<string, boolean> = new Collection();
  giveaways: Collection<string, string[]> = new Collection();
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
export { AstraLuna, CSGOClient, SteamClient };
