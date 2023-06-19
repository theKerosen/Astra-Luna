import GlobalOffensive from "globaloffensive";
import { AstraLuna, CSGOClient } from "../utils/Client";
import { defaultGuildConfig } from "../Schem/Schematica";
import { ChannelType, inlineCode } from "discord.js";
import { BEmbed } from "../Constructors/Embed";

export const gcStatus = async (client: AstraLuna) => {
  const data = await defaultGuildConfig.find({
    "channels.updatesCS": { $exists: true },
  });

  CSGOClient.on("disconnectedFromGC", (e) => {
    console.log(e);
    if (e === GlobalOffensive.GCConnectionStatus.GC_GOING_DOWN)
      data.forEach((e) => {
        const channel = client.channels.cache.get(e.channels?.updatesCS ?? "");
        if (channel?.type === ChannelType.GuildText)
          channel.send({
            embeds: [
              new BEmbed()
                .setTitle("Status — Counter-Strike")
                .setDescription(
                  `O Serviço ${inlineCode("Game Coordinator")} está Offline.`
                )
                .setThumbnail(
                  "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
                )
                .setColor("Red")
                .setFooter({
                  text: "Game Coordinator é o que permite que seu cliente conecte-se com o servidores da Valve.",
                }),
            ],
          });
      });
  });
};
