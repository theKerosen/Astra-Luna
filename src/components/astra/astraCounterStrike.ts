import { AstraLuna } from "../../client";
import { ColorResolvable, REST } from "discord.js";
import { BEmbed } from "../discord/Embed";
import { GuildCollection } from "../../schematicas/schematica";
import { AstraEvents } from "./astraEvents";
import { Cache } from "./astraCache";

export class StatusChannel extends AstraLuna {
  async send(Embed: BEmbed) {
    const guilds = await GuildCollection.find();
    for (const guild of guilds) {
      if (guild.settings?.notification_settings?.counterstrike_status) {
        const rest = new REST().setToken(process.env.TOKEN ?? "");
        await rest
          .post(
            `/channels/${guild.settings?.notification_settings?.counterstrike_status}/messages`,
            {
              body: {
                embeds: [Embed],
              },
            }
          )
          .catch(() =>
            console.error(
              `[Astra Luna] Channel ${guild.settings?.notification_settings?.counterstrike_status} is nonexistent or unreachable, ignoring...`
            )
          );
      }
    }
  }
}

export class StatusCS extends AstraEvents {
  private sessionEmbed: BEmbed;
  private cache: Cache;
  private channel: StatusChannel;

  private img =
    "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg";

  constructor() {
    super();
    this.status();
    this.cache = new Cache();
    this.channel = new StatusChannel();
    this.sessionEmbed = new BEmbed()
      .setTitle("🚨 Sessões — Counter-Strike")
      .setThumbnail(this.img);
    this.setMaxListeners(12);
  }

  sendStatusMessage(event: string, status: string, color: ColorResolvable) {
    this.cache.put(event, status);

    if (this.cache.get(event) === status) {
      Promise.resolve(
        this.channel.send(
          this.sessionEmbed
            .setDescription(`O ${event} do Counter-Strike está ${status}.`)
            .setColor(color)
        )
      );
    }
  }

  async checkAll() {
    this.checkSessions();
    this.checkCommunity();
    this.checkMatchmaker();
  }

  private checkSessions() {
    [
      "sessionsNormal",
      "sessionsDelayed",
      "sessionsSurge",
      "sessionsOffline",
    ].forEach((event) => {
      const status =
        {
          sessionsNormal: "online",
          sessionsDelayed: "lento",
          sessionsSurge: "extremamente lento",
          sessionsOffline: "offline",
        }[event] ?? "???";

      this.once(event, () => this.sendStatusMessage(event, status, "Green"));
    });

    return this;
  }

  private checkCommunity() {
    [
      "communityNormal",
      "communityDelayed",
      "communitySurge",
      "communityOffline",
    ].forEach((event) => {
      const status =
        {
          communityNormal: "online",
          communityDelayed: "lento",
          communitySurge: "extremamente lento",
          communityOffline: "offline",
        }[event] ?? "???";

      this.once(event, () => this.sendStatusMessage(event, status, "Green"));
    });

    return this;
  }

  private async checkMatchmaker() {
    [
      "matchmakerNormal",
      "matchmakerDelayed",
      "matchmakerSurge",
      "matchmakerOffline",
    ].forEach((event) => {
      const status =
        {
          matchmakerNormal: "online",
          matchmakerDelayed: "lento",
          matchmakerSurge: "extremamente lento",
          matchmakerOffline: "offline",
        }[event] ?? "???";

      this.once(event, () => this.sendStatusMessage(event, status, "Green"));
    });

    return this;
  }
}
