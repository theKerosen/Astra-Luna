import axios, { AxiosError } from "axios";
import { BEmbed } from "../Constructors/Embed";
import { schedule } from "node-cron";
import { defaultGuildConfig } from "../Schem/Schematica";
import { client } from "../utils";
import { ChannelType, ColorResolvable, inlineCode } from "discord.js";

enum knownErrors {
  noConn = "read ENETUNREACH", //conexão OU API caiu
  unstableConn = "read ECONNRESET", //conexão OU API instável
  AkamaiFail = "connect ETIMEDOUT 23.196.31.69:443", //instabilidade com a Akamai
}

export async function checkStatus() {
  const apiResponseMap: Record<
    string,
    {
      value: number;
      description: string;
      color: ColorResolvable;
    }
  > = {
    delayed: {
      value: 1,
      description: "O Serviço está lento.",
      color: "Yellow",
    },
    surge: {
      value: 2,
      description: "O Serviço acabou de iniciar.",
      color: "Red",
    },
    offline: {
      value: 3,
      description: "O Serviço de  está Offline.",
      color: "Red",
    },
  };
  const find = await defaultGuildConfig.find({
    "channels.csStatus": { $exists: true },
  });
  const data = find.map((e) => e.channels);
  schedule("*/45 * * * * *", () => {
    axios
      .get(
        `https://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v1/?key=${process.env.KEY}`
      )
      .then(async (r) => {
        const embed = new BEmbed().setThumbnail(
          "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
        );

        const sessionsResponse =
          apiResponseMap[r.data.result.services.SessionsLogon];
        const communityResponse =
          apiResponseMap[r.data.result.services.SteamCommunity];
        const matchmakerResponse =
          apiResponseMap[r.data.result.matchmaking.scheduler];

        if (
          sessionsResponse &&
          client.misc.get("webAPI_Sessions") !== sessionsResponse.value
        ) {
          client.misc.set("webAPI_Sessions", sessionsResponse.value);

          embed.setAuthor({
            name: "Sessões — Counter-Strike",
          });
          embed.setDescription(sessionsResponse.description);
          embed.setColor(sessionsResponse.color);

          data.forEach((e) => {
            if (e?.csStatus) {
              const channel = client.channels.cache.get(e?.csStatus ?? "");

              if (channel?.type === ChannelType.GuildText)
                channel.send({ embeds: [embed] });
            }
          });
        }

        if (
          communityResponse &&
          client.misc.get("webAPI_Community") !== communityResponse.value
        ) {
          client.misc.set("webAPI_Community", communityResponse.value);

          embed.setAuthor({
            name: "Comunidade — Counter-Strike",
          });
          embed.setDescription(communityResponse.description);
          embed.setColor(communityResponse.color);

          data.forEach((e) => {
            if (e?.csStatus) {
              const channel = client.channels.cache.get(e?.csStatus ?? "");
              if (channel?.type === ChannelType.GuildText)
                channel.send({ embeds: [embed] });
            }
          });
        }

        if (
          matchmakerResponse &&
          client.misc.get("webAPI_Matchmaker") !== matchmakerResponse.value
        ) {
          client.misc.set("webAPI_Matchmaker", matchmakerResponse.value);

          embed.setAuthor({
            name: "Matchmaker — Counter-Strike",
          });
          embed.setDescription(matchmakerResponse.description);
          embed.setColor(matchmakerResponse.color);

          data.forEach((e) => {
            if (e?.csStatus) {
              const channel = client.channels.cache.get(e?.csStatus ?? "");
              if (channel?.type === ChannelType.GuildText)
                channel.send({ embeds: [embed] });
            }
          });
        }
      })
      .catch((error: AxiosError) => {
        const embed = new BEmbed()
          .setTitle("WebAPI — Counter-Strike")
          .setThumbnail(
            "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
          )
          .setColor("Red");
        switch (error.message) {
          case knownErrors.noConn:
            {
              embed.setDescription(
                `O Serviço de ${inlineCode(
                  "WebAPI"
                )} não está respondendo. (Erro: ${knownErrors.noConn})`
              );
            }
            break;
          case knownErrors.unstableConn:
            {
              embed.setDescription(
                `O Serviço de ${inlineCode(
                  "WebAPI"
                )} fechou a conexão repentinamente. (Erro: ${
                  knownErrors.unstableConn
                })`
              );
            }
            break;
          case knownErrors.AkamaiFail:
            {
              embed.setDescription(
                `O Cliente perdeu conexão com os serviços da Akamai. (Erro: ${knownErrors.AkamaiFail})`
              );
            }
            break;
          default: {
            embed.setDescription(
              `O Serviço de ${inlineCode("WebAPI")} não está respondendo.`
            );
          }
        }
        if (client.misc.get("WebAPI") === 1) return;
        client.misc.set("WebAPI", 1);
        data.forEach((e) => {
          const channel = client.channels.cache.get(e?.csStatus ?? "");
          if (channel?.type === ChannelType.GuildText)
            channel.send({ embeds: [embed] });
        });
      });
  });
}
