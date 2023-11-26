import { GuildCollection } from "../../schematicas/Schematica";

export class GuildDatabases {
  public guild_id: string | null;
  constructor(options: { guild_id: string | null }) {
    this.guild_id = options.guild_id;
    if (!options.guild_id) return;
  }

  async find() {
    const data = await GuildCollection.findOne({ guild_id: this.guild_id });

    if (!data) {
      const data = await GuildCollection.create({
        guild_id: this.guild_id,
        guild_users: [],
        settings: [],
      }).then((e) => e);
      return data;
    }
    return data;
  }

  async sort(order: 1 | -1) {
    const data = this.find();
    await GuildCollection.updateOne(
      { guild_id: this.guild_id },
      {
        $push: {
          guild_users: {
            $each: [],
            $sort: { level: order, user_xp: order },
          },
        },
      },
      { new: true }
    );

    return data;
  }

  async validateUser(userId: string) {
    const data = await this.find();
    const user = data.guild_users.find((user) => user.user_id === userId);
    if (!user) {
      const newUser = await data.updateOne(
        {
          $push: {
            guild_users: {
              user_id: userId,
              xp: {
                level: 0,
                user_xp: 0,
                cooldown: Date.now(),
              },
            },
          },
        },
        { new: true }
      );
      return newUser;
    }
    return user;
  }
}
