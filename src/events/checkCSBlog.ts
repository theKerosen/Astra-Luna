import axios from "axios";
import { ChannelType } from "discord.js";
import { BEmbed } from "../Constructors/Embed";
import { defaultGuildConfig, WPSDB } from "../Schem/Schematica";
import { AstraLuna } from "../utils/Client";
import { schedule } from "node-cron";

export async function blogCheck(client: AstraLuna) {
  schedule("*/45 * * * * *", async () => {
    const getAllChannels = await defaultGuildConfig.find();
    const WPSearch = await WPSDB.findOne({ Name: "CSGO-Blog-Scanner" });

    if (WPSearch?.LastId != undefined) {
      for (let i = 0; i < 10; i++) {
        const response = await axios.get(
          `https://blog.counter-strike.net/wp-json/wp/v2/categories?post=${
            WPSearch?.LastId + 1 + i
          }`
        );

        if (response?.data?.code === "rest_forbidden_context") {
          console.log(
            "[ASTRA LUNA] -> Novo asset encontrado no blog.counter-strike.net"
          );

          const embed = new BEmbed()
            .setAuthor({
              name: `Movimentação de Postagens no BLOG do Counter-Strike 🕵️`,
            })
            .setDescription(
              ` Novo asset encontrado! (Número do ASSET: ${
                WPSearch?.LastId + 1 + i
              })`
            )
            .setFooter({
              text: "Isso significa que os desenvolvedores do Counter-Strike estão preparando uma página nova no BLOG!",
            })
            .setColor("Green")
            .setThumbnail(
              "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
            );

          for (const chid of getAllChannels) {
            const channels = await client.channels.cache.get(
              chid?.channels?.updatesCS ?? ""
            );
            if (channels && channels.type === ChannelType.GuildText)
              await channels.send({ embeds: [embed] });
          }

          await WPSDB.findOneAndUpdate(
            { Name: "CSGO-Blog-Scanner" },
            { LastId: WPSearch?.LastId + 1 + i }
          );
        }
      }
    }
  });
}
