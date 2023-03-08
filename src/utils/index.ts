import { XPManager } from "./Client";
import { handler } from "./handler";
import { onInteraction } from "../events/onInteraction";
import { Init } from "../events/Init";
import { onMessage } from "../events/onMessage";
const client = new XPManager();
client.login();
handler();
client.once("ready", async () => await Init(client));
client.on(
  "interactionCreate",
  async (interaction) => await onInteraction(interaction, client)
);
client.on("messageCreate", async (message) => await onMessage(client, message));
export { client };
