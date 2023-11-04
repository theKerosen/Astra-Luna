import { defaultGuildConfig } from "../../schematicas/Schematica";

interface IUser {
  userId: string;
  XP: number;
  Level: number;
  cooldown: Date;
}

export class GuildDatabases {
  public guild_id: string | null;
  constructor(options: { guild_id: string | null }) {
    this.guild_id = options.guild_id;
    if (!options.guild_id) return;
  }
  

  async find() {
    const data = await Promise.resolve(
      defaultGuildConfig.findOne({ GuildId: this.guild_id })
    );
    
    if (!data) {
      const newData = await defaultGuildConfig.create({
        GuildId: this.guild_id,
        Users: [],
      });
      return newData;
    }
    return data;
  }

  async sort(order: 1 | -1) {
    const data = this.find();
    await Promise.resolve(
      defaultGuildConfig.updateOne(
        { GuildId: this.guild_id },
        { $push: { Users: { $each: [], $sort: { Level: order, XP: order } } } }
      )
    );
    return data;
  }

  async validateUser(userId: string) {
    const data = await this.find();
    const user = data.Users.find((user) => user.userId === userId);
    if (!user) {
      const newUser: IUser = await Promise.resolve(
        data.updateOne({
          $push: {
            Users: {
              userId: userId,
              Level: 0,
              XP: 0,
              cooldown: Date.now(),
            },
          },
        })
      );
      return newUser;
    }
    return user as IUser;
  }
}
