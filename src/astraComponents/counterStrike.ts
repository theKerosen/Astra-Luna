/*

    Feito por Lunx © 2023

*/

import axios, { AxiosResponse } from "axios";
import { AstraLuna } from "../utils/Client";
import { ChannelType, ColorResolvable } from "discord.js";
import { BEmbed } from "../discordComponents/Embed";
import { defaultGuildConfig } from "../mongooseSchemas/Schematica";
import GlobalOffensive from "globaloffensive";

const mensagens: Record<
  string,
  {
    value: number;
    description: string;
    color: ColorResolvable;
  }
> = {
  normal: {
    value: 0,
    color: "Green",
    description: "O Serviço está de volta.",
  },
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

export class statusChannel {
  public client: AstraLuna;
  constructor(options: { client: AstraLuna }) {
    this.client = options.client;
  }
  async send(Embed: BEmbed) {
    (
      await defaultGuildConfig.find({
        "channels.csStatus": { $exists: true },
      })
    ).forEach((ch) => {
      if (ch.channels?.csStatus) {
        const channels = this.client.channels.cache.get(ch.channels?.csStatus);
        if (channels?.type === ChannelType.GuildText)
          channels.send({ embeds: [Embed] });
      }
    });
  }
}

export class StatusCS {
  public client: AstraLuna;
  public globalOffensive: GlobalOffensive;

  constructor(options: {
    client: AstraLuna;
    globalOffensive: GlobalOffensive;
  }) {
    this.client = options.client;
    this.globalOffensive = options.globalOffensive;
  }
  async checkAll() {
    const data = await axios.get(
      `https://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v1/?key=${process.env.KEY}`
    );
    this.checkSessions(data);
    this.checkCommunity(data);
    this.checkMatchmaker(data);
    this.checkGameCoordinator(this.globalOffensive);
    this.client.misc.set("webAPI_Sessions", 0);
    this.client.misc.set("webAPI_Community", 0);
    this.client.misc.set("webAPI_Matchmaker", 0);
  }

  private async checkSessions(r: AxiosResponse) {
    const response = mensagens[r.data.result.services.SessionsLogon];
    this.client.misc.set("webAPI_Sessions", response.value);

    if (response && this.client.misc.get("webAPI_Sessions") !== response.value)
      await new statusChannel({ client: this.client }).send(
        new BEmbed()
          .setTitle("Sessões — Counter-Strike")
          .setDescription(response.description)
          .setColor(response.color)
          .setThumbnail(
            "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
          )
      );
  }

  private async checkCommunity(r: AxiosResponse) {
    const response = mensagens[r.data.result.services.SteamCommunity];
    this.client.misc.set("webAPI_Community", response.value);

    if (r && this.client.misc.get("webAPI_Community") !== response.value)
      await new statusChannel({ client: this.client }).send(
        new BEmbed()
          .setTitle("Comunidade — Counter-Strike")
          .setDescription(response.description)
          .setColor(response.color)
          .setThumbnail(
            "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
          )
      );
  }

  private async checkMatchmaker(r: AxiosResponse) {
    const response = mensagens[r.data.result.matchmaking.scheduler];
    this.client.misc.set("webAPI_Matchmaker", response.value);

    if (r && this.client.misc.get("webAPI_Matchmaker") !== response.value)
      await new statusChannel({ client: this.client }).send(
        new BEmbed()
          .setTitle("Matchmaker — Counter-Strike")
          .setDescription(response.description)
          .setColor(response.color)
          .setThumbnail(
            "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
          )
      );
  }
  private checkGameCoordinator(c: GlobalOffensive) {
    c.on("disconnectedFromGC", async (disconnectReason) => {
      if (disconnectReason === GlobalOffensive.GCConnectionStatus.GC_GOING_DOWN)
        await new statusChannel({ client: this.client }).send(
          new BEmbed()
            .setTitle("Status — Counter-Strike")
            .setDescription(`O Game Coordinator está Offline.`)
            .setThumbnail(
              "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
            )
            .setColor("Red")
            .setFooter({
              text: "Game Coordinator é o que permite que seu cliente conecte-se com o servidores da Valve.",
            })
        );
    });
  }
}
