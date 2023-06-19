import axios from "axios";
import { BEmbed } from "../Constructors/Embed";
import { schedule } from "node-cron";
import { defaultGuildConfig } from "../Schem/Schematica";
import { client } from "../utils";
import { ChannelType, inlineCode } from "discord.js";

export async function checkStatus() {
  const find = await defaultGuildConfig.find({
    "channels.updatesCS": { $exists: true },
  });
  const data = find.map((e) => e.channels);
  schedule("*/45 * * * * *", () => {
    axios
      .get(
        `https://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v1/?key=${process.env.KEY}`
      )
      .then(async (r) => {
        if (r.status === 409) return console.error("API RATE LIMIT REACHED!");

        const embed = new BEmbed()
          .setAuthor({
            name: "Status — Counter-Strike",
          })
          .setThumbnail(
            "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
          )
          .setColor("Red");
        switch (r.data.result.services.SessionsLogon) {
          case "normal":
            client.misc.set("SessionResult", 0);
            break;
          case "surge":
            {
              if (client.misc.get("SessionResult") === 1) return;
              client.misc.set("SessionResult", 1);
              embed
                .setDescription(
                  `O Serviço de ${inlineCode(
                    "Sessões de logon"
                  )} acabou de iniciar! (lentidão é esperado.)`
                )
                .setColor("Yellow");
              data.forEach((e) => {
                const channel = client.channels.cache.get(e?.updatesCS ?? "");
                if (channel?.type === ChannelType.GuildText)
                  channel.send({ embeds: [embed] });
              });
            }
            break;
          case "offline":
            {
              if (client.misc.get("SessionResult") === 2) return;
              client.misc.set("SessionResult", 2);
              embed
                .setDescription(
                  `O Serviço de ${inlineCode("Sessões de logon")} está Offline.`
                )
                .setColor("Red");
              data.forEach((e) => {
                const channel = client.channels.cache.get(e?.updatesCS ?? "");
                if (channel?.type === ChannelType.GuildText)
                  channel.send({ embeds: [embed] });
              });
            }
            break;
          case "delayed":
            {
              if (client.misc.get("SessionResult") === 3) return;
              client.misc.set("SessionResult", 3);
              embed
                .setDescription(
                  `O Serviço de ${inlineCode("Sessões de logon")} está lento.`
                )
                .setColor("Yellow");
              data.forEach((e) => {
                const channel = client.channels.cache.get(e?.updatesCS ?? "");
                if (channel?.type === ChannelType.GuildText)
                  channel.send({ embeds: [embed] });
              });
            }
            break;
        }

        switch (r.data.result.services.SteamCommunity) {
          case "normal":
            client.misc.set("CommunityResult", 0);
            break;
          case "surge":
            {
              if (client.misc.get("CommunityResult") === 1) return;
              client.misc.set("CommunityResult", 1);
              embed
                .setDescription(
                  `O Serviço de ${inlineCode(
                    "Comunidade"
                  )} acabou de iniciar! (lentidão é esperado.)`
                )
                .setColor("Yellow");
              data.forEach((e) => {
                const channel = client.channels.cache.get(e?.updatesCS ?? "");
                if (channel?.type === ChannelType.GuildText)
                  channel.send({ embeds: [embed] });
              });
            }
            break;
          case "offline":
            {
              if (client.misc.get("CommunityResult") === 2) return;
              client.misc.set("CommunityResult", 2);
              embed
                .setDescription(
                  `O Serviço de ${inlineCode("Comunidade")} está Offline.`
                )
                .setColor("Red");
              data.forEach((e) => {
                const channel = client.channels.cache.get(e?.updatesCS ?? "");
                if (channel?.type === ChannelType.GuildText)
                  channel.send({ embeds: [embed] });
              });
            }
            break;
          case "delayed":
            {
              if (client.misc.get("CommunityResult") === 3) return;
              client.misc.set("CommunityResult", 3);
              embed
                .setDescription(
                  `O Serviço de ${inlineCode("Comunidade")} está lento.`
                )
                .setColor("Yellow");
              data.forEach((e) => {
                const channel = client.channels.cache.get(e?.updatesCS ?? "");
                if (channel?.type === ChannelType.GuildText)
                  channel.send({ embeds: [embed] });
              });
            }
            break;
        }
        switch (r.data.result.matchmaking.scheduler) {
          case "normal":
            client.misc.set("MatchmakingResult", 0);
            break;
          case "surge":
            if (client.misc.get("MatchmakingResult") === 1) return;
            client.misc.set("MatchmakingResult", 1);
            {
              embed
                .setDescription(
                  `O Serviço de ${inlineCode(
                    "Matchmaking"
                  )} acabou de iniciar. (lentidão é esperado)`
                )
                .setColor("Yellow");
              data.forEach((e) => {
                const channel = client.channels.cache.get(e?.updatesCS ?? "");
                if (channel?.type === ChannelType.GuildText)
                  channel.send({ embeds: [embed] });
              });
            }
            break;
          case "offline":
            if (client.misc.get("MatchmakingResult") === 2) return;
            client.misc.set("MatchmakingResult", 2);
            {
              embed
                .setDescription(
                  `O Serviço de ${inlineCode("Matchmaking")} está Offline.`
                )
                .setColor("Red");
              data.forEach((e) => {
                const channel = client.channels.cache.get(e?.updatesCS ?? "");
                if (channel?.type === ChannelType.GuildText)
                  channel.send({ embeds: [embed] });
              });
            }
            break;
          case "delayed":
            {
              if (client.misc.get("MatchmakingResult") === 3) return;
              client.misc.set("MatchmakingResult", 3);
              embed
                .setDescription(
                  `O Serviço de ${inlineCode("Matchmaking")} está lento.`
                )
                .setColor("Yellow");
              data.forEach((e) => {
                const channel = client.channels.cache.get(e?.updatesCS ?? "");
                if (channel?.type === ChannelType.GuildText)
                  channel.send({ embeds: [embed] });
              });
            }
            break;
        }
      });
  });
}
