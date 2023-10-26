import axios, { AxiosResponse } from "axios";
import { AstraLuna } from "../../Client";
import { ChannelType, ColorResolvable } from "discord.js";
import { BEmbed } from "../../components/discord/Embed";
import { defaultGuildConfig } from "../../schematicas/Schematica";

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

export class StatusChannel extends AstraLuna {
  async send(Embed: BEmbed) {
    const channels = await defaultGuildConfig.find();
    channels.forEach((ch) => {
      if (ch.channels?.csStatus) {
        const channel = this.channels.cache.get(ch.channels?.csStatus);
        if (channel?.type === ChannelType.GuildText)
          channel.send({ embeds: [Embed] });
      }
    });
  }
}

export class StatusCS extends StatusChannel {
  private img =
    "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg";
  async checkAll() {
    const data = await axios.get(`https://ares.lunxi.dev/status`).catch();
    await this.checkSessions(data.data);
    await this.checkCommunity(data.data);
    await this.checkMatchmaker(data.data);

    this.misc.set("webAPI_Sessions", 0);
    this.misc.set("webAPI_Community", 0);
    this.misc.set("webAPI_Matchmaker", 0);
  }

  private async checkSessions(r: AxiosResponse) {
    const response = mensagens[r.data.status.services.SessionsLogon];
    const getCurrentCache = this.misc.get("webAPI_Sessions");

    this.misc.set("webAPI_Sessions", response.value);

    if (getCurrentCache !== response.value)
      await this.send(
        new BEmbed()
          .setTitle("Sessões — Counter-Strike")
          .setDescription(response.description)
          .setColor(response.color)
          .setThumbnail(this.img)
      );
  }

  private async checkCommunity(r: AxiosResponse) {
    const response = mensagens[r.data.status.services.SteamCommunity];

    const getCurrentCache = this.misc.get("webAPI_Community");

    this.misc.set("webAPI_Community", response.value);

    if (getCurrentCache !== response.value)
      await this.send(
        new BEmbed()
          .setTitle("Comunidade — Counter-Strike")
          .setDescription(response.description)
          .setColor(response.color)
          .setThumbnail(this.img)
      );
  }

  private async checkMatchmaker(r: AxiosResponse) {
    const response = mensagens[r.data.status.matchmaker.scheduler];
    const getCurrentCache = this.misc.get("webAPI_Matchmaker");

    this.misc.set("webAPI_Matchmaker", response.value);

    if (getCurrentCache !== response.value)
      await this.send(
        new BEmbed()
          .setTitle("Matchmaker — Counter-Strike")
          .setDescription(response.description)
          .setColor(response.color)
          .setThumbnail(this.img)
      );
  }
}
