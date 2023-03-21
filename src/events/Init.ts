import { XPManager } from "../utils/Client";
import axios from "axios";
import { WPSDB, Channels } from "../Schem/Schematica";
import { TextChannel } from "discord.js";
import { BEmbed } from "../Constructors/Embed";

export const Init = async (client: XPManager) => {
  const wait = (await import("node:timers/promises")).setTimeout;
  console.log("\x1b[35m[XPManager] \x1b[36mLigado com sucesso!");
  //no explicit type so no linter :<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client.application?.commands.set(client.commands.map((v: any) => v.data));
  client.user?.setStatus("idle");
  client.user?.setActivity({
    name: "Follow my GitHub!",
  });
  const blogCheck = async () => {
    for (let i = 0; i < 10; i++) {
      const getAllChannels = await Channels.find();
      const WPSearch = await WPSDB.findOne({ Name: "CSGO-Blog-Scanner" });
      if (WPSearch?.LastId != undefined) {
        await axios
          .get(
            `https://blog.counter-strike.net/wp-json/wp/v2/categories?post=${
              WPSearch?.LastId + 1 + i
            }`
          )
          .then(async () => {
            console.log("FOUND NEW POST!");
            await axios
              .get(
                `https://blog.counter-strike.net/wp-json/wp/v2/posts/${
                  WPSearch?.LastId + 1 + i
                }`
              )
              .then(async (e) => {
                const embed = new BEmbed().setADC(
                  {
                    name: `[NOVO LINK ENCONTRADO NO BLOG DO CSGO]`,
                    url: e?.data?.guid?.rendered,
                    iconURL:
                      "https://media.discordapp.net/attachments/943547363031670785/1086143752311160882/pngaaa.com-3271363.png?width=630&height=630",
                  },
                  "NOVO LINK ENCONTRADO!",
                  "Yellow"
                );
                await getAllChannels.forEach(async (chid) => {
                  const sendchannel = client.channels.cache.get(
                    chid?.BlogChannelId ?? ""
                  );
                  await (sendchannel as TextChannel)
                    .send({
                      embeds: [embed],
                    })
                    .catch();
                });
                await WPSDB.findOneAndUpdate({
                  Name: "CSGO-Blog-Scanner",
                  LastId: WPSearch?.LastPostId + 1 + i,
                });
              });
          })
          .catch(async function (e) {
            if (e?.response?.data?.code == "rest_forbidden_context") {
              console.log("FOUND NEW HIDDEN POST!");
              const embed = new BEmbed().setADC(
                {
                  name: `🕵️ [NOVO POST ESCONDIDO NO BLOG DO CSGO]`,
                  iconURL:
                    "https://media.discordapp.net/attachments/943547363031670785/1086143752311160882/pngaaa.com-3271363.png?width=630&height=630",
                },
                `NOVO POST ENCONTRADO! (${WPSearch?.LastId + 1 + i})`,
                "Yellow"
              );
              await getAllChannels.forEach(async (chid) => {
                const sendchannel = client.channels.cache.get(
                  chid?.BlogChannelId ?? ""
                );
                await (sendchannel as TextChannel)
                  .send({
                    embeds: [embed],
                  })
                  .catch();
              });
              await WPSDB.findOneAndUpdate({
                Name: "CSGO-Blog-Scanner",
                LastId: WPSearch?.LastId + 1 + i,
              });
            }
          });
      }
    }
  };
  const csgoStatusCheck = async () => {
    const getAllChannels = await Channels.find();
    await wait(30000);
    await axios
      .get(
        `https://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v1/?key=${process.env.STEAMKEY}`
      )
      .then(async (res) => {
        client.misc.set("sessionsoffline", false);
        client.misc.set("matchmakeroffline", false);
        client.misc.set("communityoffline", false);
        const Sessions = res?.data?.result?.services?.SessionsLogon;
        const Community = res?.data?.result?.services?.SteamCommunity;
        const Matchmaker = res?.data?.result?.matchmaking?.scheduler;
        const SessionsFell = new BEmbed().setADC(
          {
            name: "🚨 ATENÇÃO 🚨",
            iconURL:
              "https://media.discordapp.net/attachments/943547363031670785/1086143752311160882/pngaaa.com-3271363.png?width=630&height=630",
          },
          "AS SESSÕES DO CSGO ACABARAM DE CAIR.",
          "Red"
        );
        const MatchmakerFell = new BEmbed().setADC(
          {
            name: "🚨 ATENÇÃO 🚨",
            iconURL:
              "https://media.discordapp.net/attachments/943547363031670785/1086143752311160882/pngaaa.com-3271363.png?width=630&height=630",
          },
          "O MATCHMAKER ACABOU DE CAIR.",
          "Red"
        );
        const CommunityFell = new BEmbed().setADC(
          {
            name: "🚨 ATENÇÃO 🚨",
            iconURL:
              "https://media.discordapp.net/attachments/943547363031670785/1086143752311160882/pngaaa.com-3271363.png?width=630&height=630",
          },
          "OS SERVIDORES DE INVENTÁRIOS ACABARAM DE CAIR.",
          "Red"
        );

        //----------------------------------------------------------------------//

        if (
          Sessions === "offline" &&
          client.misc.get("sessionsoffline") === false
        ) {
          client.misc.set("sessionsoffline", true);
          await getAllChannels.forEach(async (chid) => {
            const sendchannel = client.channels.cache.get(
              chid?.BlogChannelId ?? ""
            );
            await (sendchannel as TextChannel)
              .send({
                embeds: [SessionsFell],
              })
              .catch();
          });
          if (Sessions === "normal") client.misc.set("sessionsoffline", false);

          //----------------------------------------------------------------------//

          if (
            Matchmaker === "offline" &&
            client.misc.get("matchmakeroffline") === false
          ) {
            client.misc.set("matchmakeroffline", true);
            await getAllChannels.forEach(async (chid) => {
              const sendchannel = client.channels.cache.get(
                chid?.BlogChannelId ?? ""
              );
              await (sendchannel as TextChannel)
                .send({
                  embeds: [MatchmakerFell],
                })
                .catch();
            });
          }
          if (Matchmaker === "normal")
            client.misc.set("matchmakeroffline", false);

          //----------------------------------------------------------------------//

          if (
            Community === "offline" &&
            client.misc.get("communityoffline") === false
          ) {
            client.misc.set("matchmakeroffline", true);
            await getAllChannels.forEach(async (chid) => {
              const sendchannel = client.channels.cache.get(
                chid?.BlogChannelId ?? ""
              );
              await (sendchannel as TextChannel)
                .send({
                  embeds: [CommunityFell],
                })
                .catch();
            });
          }
          if (Community === "normal")
            client.misc.set("communityoffline", false);
        }
      })
      .catch(() => {
        console.log("Steam WebAPI Timed out.");
      });
  };
  for (;;) {
    csgoStatusCheck();
    await wait(3000);
    blogCheck();
  }
};
