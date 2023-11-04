import { ClientInteraction } from "./events";
import { GuildDatabases } from "./dbManager";

export enum warnTypes {
  NOTHING = 0,
  MUTE = 1,
  KICK = 2,
  BAN = 3,
}

interface WarnInfo {
  warnLevel: number;
  punishmentType: warnTypes;
  wearTime: number;
}

interface IUser {
  userId: string;
  XP: number;
  Level: number;
  cooldown: Date;
  warnLevel: number;
}

export class WarnSystem extends ClientInteraction {
  db = new GuildDatabases({ guild_id: this.interaction.guildId });

  async setWarnSize(size: number) {
    const db = await this.db.find();
    await db.updateOne({ $set: { maxWarnLevels: size } });
    return true;
  }

  async createWarnRule(warnLevel: number, warnType: warnTypes) {
    const db = await this.db.find();
    await db.updateOne(
      {
        $push: {
          perWarnPunishment: {
            warnLevel: warnLevel,
            punishmentType: warnType,
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
        "warnLevel.$": warnLevel,
        punishmentType: warnType,
      },
    });

    return true;
  }

  async applyWarn(userId: string) {
    const db = await this.db.find();
    db.updateOne(
      {
        $inc: { ["Users.$[outer].warnlevel"]: 1 },
      },
      { arrayFilters: [{ "outer.userId": userId }] }
    );

    return true;
  }

  async scanForWarns(userId: string) {
    const data = await this.db.find();
    const user = data.Users.find((user) => user.userId === userId) as IUser;
    const getWarnPunishment = data.perWarnPunishment;
    const warnInfo = getWarnPunishment.filter(
      (p) => p.warnLevel === user.warnLevel
    );
    console.log(user.warnLevel, warnInfo);
    return { userWarnLevel: user.warnLevel, warnInfo: warnInfo as WarnInfo[] };
  }
}
