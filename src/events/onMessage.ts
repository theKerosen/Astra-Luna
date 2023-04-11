import { Message, TextChannel } from "discord.js";
import { XPManager } from "../utils/Client";

import { Channels } from "../Schem/Schematica";

export const onMessage = async (client: XPManager, message: Message) => {
  const findChannelStuff = await Channels.findOne({ GuildId: message.guildId });
  if (message.channel.id !== findChannelStuff?.BlogChannelId)
    (await import(`../utils/applyRole`)).execute(message);
  if (
    message.channel.id === findChannelStuff?.BlogChannelId &&
    message.author.id === "890753656331325480"
  ) {
    console.log("NEW UPDATE!");
    const channel = client.channels.cache.get(
      findChannelStuff?.BlogChannelId
    ) as TextChannel;
    channel.send({ content: `Ping <@&${findChannelStuff?.NotifyRoleId}>` });
  }
};
