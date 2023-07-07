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
  console.log("[ASTRA LUNA] -> Logado na Steam com sucesso.");
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
    console.log(`
    ._________________________________________________.
    |                                                 | 
    |             &##BBB#########BBB##&               |
    |          &BB##&@@@@@@@@@@@@@@@&##BB&            |
    |        &BB#&@@@@@@@@@@@@@@@@@@@@@@@&#BB&        |
    |      &BB&@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&BB&      |
    |     #G#@@@@@@@@@@#BG5YG@@@@@@@@@@@@@@@@@#G#     |
    |    GG@@@@@@@@@#GPGB55#@@@@@@@@@@@@@@@@@@@@GG    |
    |   GG@@@@@@@@&PG#@&5B@@@@&&@@&@@@@@@@@@@@@@@GG   |
    |  #P@@@@@@@@B5#@@@5B@@@@&?5@G!#@@@@@@@@@@@@@@P#  |
    |  5#@@@@@@@#5@@@@&Y@@@@@@@BY~:!5#@@@@@@@@@@@@#5  |
    |  5@@@@@@@@5#@@@@&5&@@@@@@?5P~B@@@@@@@@@@@@@@@5  |
    |  P@@@@@@@&5&@@@@@GG@@@@@@B#@#@@@@@@@@@@@@@@@@P  |
    |  5@@@@@@@@P#@@@@@@GG@@@@@@@@@@@@@@@@@@@@@@@@@5  |
    |  Y#@@@@@@@#P@@@@@@@#GB&@@@@@@@@@@@@@&@@@@@@@#Y  |
    |  B5@@@@@@@@#G&@@@@@@@&BBB##&&&&&##GPB@@@@@@@5B  |
    |   GP@@@@@@@@&BB&@@@@@@@@&&#######BG#@@@@@@@PG   |
    |    GP@@@@@@@@@&BB#&&@@@@@@@@@&#BB#@@@@@@@@PG    |
    |    BP#@@@@@@@@@@&############&@@@@@@@@@#PB      |
    |     &GP#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#PG&       |
    |       &GPB&@@@@@@@@@@@@@@@@@@@@@@@&BPG&         |
    |           #GGB#&&@@@@@@@@@@@@@&&#BGG#           |
    |              &#BGGGGBBBBBBBGGGGB#&              |
    ._________________________________________________.
    
[ASTRA LUNA] -> Sistema iniciado com sucesso.`);
    return super.login(process.env.TOKEN);
  }
  mongoConnect() {
    set("strictQuery", true);
    return connect(process.env.MONGO_URI ?? "").then(() =>
      console.log("[ASTRA LUNA] -> Conexão com Mongoose iniciada.")
    );
  }
}
export { AstraLuna, CSGOClient, SteamClient };
