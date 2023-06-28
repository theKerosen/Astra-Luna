import { schedule } from "node-cron";
import { defaultGuildConfig } from "../Schem/Schematica";
import { AstraLuna } from "../utils/Client";
import { ChannelType } from "discord.js";
import { BEmbed } from "../Constructors/Embed";

export async function xpReset(client: AstraLuna) {
  schedule(
    "1 * */22 * * TUE",
    async () => {
      const find = await defaultGuildConfig.find({
        "channels.csStatus": { $exists: true },
      });
      const data = find.map((e) => e.channels);

      data.forEach((e) => {
        if (e?.updatesCS) {
          const channel = client.channels.cache.get(e?.updatesCS);
          if (channel?.type === ChannelType.GuildText)
            channel.send({
              embeds: [
                new BEmbed()
                  .setAuthor({
                    name: "Bônus de XP Semanal resetado! (22h)",
                  })
                  .setDescription(
                    "O bônus de XP semanal foi resetado, aproveite!"
                  )
                  .setThumbnail(
                    "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
                  )
                  .setColor("Green"),
              ],
            });
        }
      });
    },
    { timezone: "America/Sao_Paulo" }
  );
}
