import { XPManager } from "../utils/Client";

export const Init = async (client: XPManager) => {
  console.log("\x1b[35m[XPManager] \x1b[36mLigado com sucesso!");
  //no explicit type so no linter :<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client.application?.commands.set(client.commands.map((v: any) => v.data));
  client.user?.setStatus("idle");
  client.user?.setActivity({
    name: "Follow my GitHub!",
    type: "PLAYING",
  });
};
