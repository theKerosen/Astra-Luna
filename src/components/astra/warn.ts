import { ClientInteraction } from "./events";
import { AstraLuna } from "../../Client";
import { Interaction } from "discord.js";
import { GuildDatabases } from "./dbManager";

enum warnTypes {
  NOTHING = 0,
  MUTE = 1,
  KICK = 2,
  BAN = 3,
}

interface WarnInfo {
  warnLevel: number;
  punishmentType: warnTypes;
  wearTime: Date;
}

interface IUser {
  userId: string;
  XP: number;
  Level: number;
  cooldown: Date;
  warnLevel: number;
}

export class WarnSystem extends ClientInteraction {
  public client: AstraLuna;
  public interaction: Interaction;
  public db: GuildDatabases;

  constructor(options: { client: AstraLuna; interaction: Interaction }) {
    super({ client: options.client, interaction: options.interaction });
    this.interaction = options.interaction;
    this.client = options.client;
    this.db = new GuildDatabases({ guild_id: this.interaction.guildId });
  }

  async setWarnSize(size: number) {
    const db = await this.db.find();
    db.updateOne({ $set: { maxWarnLevels: size } });
    return true;
  }

  async setPerWarnPunishment(
    warnLevel: number,
    warnType: warnTypes,
    wearTime: Date
  ) {
    const db = await this.db.find();
    db.updateOne({
      $push: {
        perWarnPunishment: {
          warnLevel: warnLevel,
          punishmentType: warnType,
          wearTime: wearTime,
        },
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
