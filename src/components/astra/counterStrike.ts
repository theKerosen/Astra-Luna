import axios, {  AxiosResponse } from "axios";
import { AstraLuna } from "../../Client";
import { ColorResolvable, REST } from "discord.js";
import { BEmbed } from "../../components/discord/Embed";
import { defaultGuildConfig } from "../../schematicas/Schematica";
import { Cache } from "./Cache";
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
    const guilds = await defaultGuildConfig.find();
    for (const guild of guilds) {
      if (guild.channels) {
        const rest = new REST({ version: "10" }).setToken(
          process.env.TOKEN ?? ""
        );
        if (guild.channels?.csStatus) {
          await rest
            .post(`/channels/${guild.channels?.csStatus}/messages`, {
              body: {
                embeds: [Embed],
              },
            })
            .catch(() =>
              console.error(
                `[Astra Luna] Channel ${guild.channels?.csStatus} is nonexistent or unreachable, ignoring...`
              )
            );
        }
      }
    }
  }
}

export class StatusCS extends StatusChannel {
  private cache: Cache;
  private img =
    "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg";

  constructor() {
    super();
    this.cache = new Cache();
  }

  async checkAll() {
    const data = await axios.get(`https://ares.lunxi.dev/status`).catch();

    this.cache.put("sessions", 0);
    this.cache.put("community", 0);
    this.cache.put("matchmaker", 0);

    await this.checkSessions(data.data);
    await this.checkCommunity(data.data);
    await this.checkMatchmaker(data.data);
  }

  private async checkSessions(r: AxiosResponse) {
    const response = mensagens[r.data.status.services.SessionsLogon];
    const getCurrentCache = this.cache.get("sessions");

    if (getCurrentCache !== response.value)
      await this.send(
        new BEmbed()
          .setTitle("🚨 Sessões — Counter-Strike")
          .setDescription(response.description)
          .setColor(response.color)
          .setThumbnail(this.img)
      );
    this.cache.put("sessions", response.value);
  }

  private async checkCommunity(r: AxiosResponse) {
    const response = mensagens[r.data.status.services.SteamCommunity];

    const getCurrentCache = this.cache.get("community");

    if (getCurrentCache !== response.value)
      await this.send(
        new BEmbed()
          .setTitle("🚨 Comunidade — Counter-Strike")
          .setDescription(response.description)
          .setColor(response.color)
          .setThumbnail(this.img)
      );
    this.cache.put("community", response.value);
  }

  private async checkMatchmaker(r: AxiosResponse) {
    const response = mensagens[r.data.status.matchmaker.scheduler];
    const getCurrentCache = this.cache.get("matchmaker");

    if (getCurrentCache !== response.value)
      await this.send(
        new BEmbed()
          .setTitle("🚨 Matchmaker — Counter-Strike")
          .setDescription(response.description)
          .setColor(response.color)
          .setThumbnail(this.img)
      );
    this.cache.put("matchmaker", response.value);
  }
}
