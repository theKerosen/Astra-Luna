import { ChatInputCommandInteraction } from "discord.js";
import { GuildDatabases } from "./astraDBManager";

export enum warnTypes {
  NOTHING = 0,
  MUTE = 1,
  KICK = 2,
  BAN = 3,
}

export class WarnSystem {
  public db: GuildDatabases;
  public interaction: ChatInputCommandInteraction;

  constructor(interaction: ChatInputCommandInteraction) {
    this.interaction = interaction;
    this.db = new GuildDatabases({ guild_id: this.interaction.guildId });
  }

  async setWarnSize(size: number) {
    const db = await this.db.find();
    await db.updateOne({
      $set: { "settings.warn_settings.max_warn_level": size },
    });
    return true;
  }

  async createWarnRule(warnLevel: number, warnType: warnTypes) {
    const db = await this.db.find();
    await db.updateOne(
      {
        $push: {
          "settings.warn_settings.warn_rules": {
            warn_level: warnLevel,
            punishment_type: warnType,
          },
        },
      },
      { upsert: true }
    );
    return true;
  }

  async updateWarnRule(warnLevel: number, warnType: warnTypes) {
    const db = await this.db.find();

    await db.updateOne({
      $set: {
        "warn_level.$": warnLevel,
        punishment_type: warnType,
      },
    });

    return true;
  }

  async applyWarn(userId: string) {
    const db = await this.db.find();
    db.updateOne(
      {
        $inc: { ["guild_users.$[outer].warn.warn_count"]: 1 },
      },
      { arrayFilters: [{ "outer.user_id": userId }] }
    );

    return true;
  }

  async scanForWarns(userId: string) {
    const data = await this.db.find();
    const user = data.guild_users.find((user) => user.user_id === userId);
    const getWarnPunishment = data.settings?.warn_settings?.warn_rules;
    if (!getWarnPunishment) return;

    const warnInfo = getWarnPunishment.filter(
      (p) => p.warn_level === user?.warn?.warn_count
    );

    return { userWarnLevel: user?.warn?.warn_count, warnInfo: warnInfo };
  }
}
