import { XPManager } from "./Client";
import { handler } from "./handler";
import { onInteraction } from "../events/onInteraction";
import { Init } from "../events/Init";
import { Events } from "discord.js";
import { onMessage } from "../events/onMessage";
const client = new XPManager();
client.mongoConnect();
client.login();
handler();
client.once(Events.ClientReady, async () => await Init(client));
client.on(Events.InteractionCreate, async (interaction) => {
  await onInteraction(interaction, client);
});
client.on("messageCreate", async (message) => await onMessage(client, message));
export { client };
