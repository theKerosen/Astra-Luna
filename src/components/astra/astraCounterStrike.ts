import { AstraLuna } from "../../client";
import { REST } from "discord.js";
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

  async checkAll() {
    this.checkSessions();
    this.checkCommunity();
    this.checkMatchmaker();
  }

  private checkSessions() {
    this.once("sessionsNormal", () => {
      this.cache.put("sessions", 0);

      if (this.cache.get("sessions") === 0)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription("As sessões do Counter-Strike estão online.")
              .setColor("Green")
          )
        );
    });

    this.once("sessionsDelayed", () => {
      this.cache.put("sessions", 1);

      if (this.cache.get("sessions") === 1)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription("As sessões do Counter-Strike estão lentas.")
              .setColor("Yellow")
          )
        );
    });

    this.once("sessionsSurge", () => {
      this.cache.put("sessions", 2);

      if (this.cache.get("sessions") === 2)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription(
                "As sessões do Counter-Strike estão extremamente lentas."
              )
              .setColor("Red")
          )
        );
    });

    this.once("sessionsOffline", () => {
      this.cache.put("sessions", 3);

      if (this.cache.get("sessions") === 3)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription("As sessões do Counter-Strike estão offline.")
              .setColor("Grey")
          )
        );
    });

    return this;
  }

  private checkCommunity() {
    this.once("communityNormal", () => {
      this.cache.put("community", 0);

      if (this.cache.get("community") === 0)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription("A comunidade do Counter-Strike está online.")
              .setColor("Green")
          )
        );
    });

    this.once("communityDelayed", () => {
      this.cache.put("community", 1);

      if (this.cache.get("community") === 1)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription("A comunidade do Counter-Strike está lentas.")
              .setColor("Yellow")
          )
        );
    });

    this.once("communitySurge", () => {
      this.cache.put("community", 2);

      if (this.cache.get("community") === 2)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription(
                "A comunidade do Counter-Strike está extremamente lentas."
              )
              .setColor("Red")
          )
        );
    });

    this.once("communityOffline", () => {
      this.cache.put("community", 3);

      if (this.cache.get("community") === 3)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription("A comunidade do Counter-Strike está offline.")
              .setColor("Grey")
          )
        );
    });

    return this;
  }

  private async checkMatchmaker() {
    this.once("matchmakerNormal", () => {
      this.cache.put("matchmaker", 0);

      if (this.cache.get("matchmaker") === 0)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription("O Matchmaker do Counter-Strike está online.")
              .setColor("Green")
          )
        );
    });

    this.once("matchmakerDelayed", () => {
      this.cache.put("matchmaker", 1);

      if (this.cache.get("matchmaker") === 1)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription("O Matchmaker do Counter-Strike está lentas.")
              .setColor("Yellow")
          )
        );
    });

    this.once("matchmakerSurge", () => {
      this.cache.put("matchmaker", 2);

      if (this.cache.get("matchmaker") === 2)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription(
                "O Matchmaker do Counter-Strike está extremamente lentas."
              )
              .setColor("Red")
          )
        );
    });

    this.once("matchmakerOffline", () => {
      this.cache.put("matchmaker", 3);
      if (this.cache.get("matchmaker") === 3)
        Promise.resolve(
          this.channel.send(
            this.sessionEmbed
              .setDescription("O Matchmaker do Counter-Strike está offline.")
              .setColor("Grey")
          )
        );
    });

    return this;
  }
}
