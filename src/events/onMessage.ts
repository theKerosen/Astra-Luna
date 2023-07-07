import { Message, TextChannel } from "discord.js";
import { AstraLuna } from "../utils/Client";
import { defaultGuildConfig } from "../Schem/Schematica";

export const onMessage = async (client: AstraLuna, message: Message) => {
  if (message.author.id === "890753656331325480") {
    const data = await defaultGuildConfig.findOne({ GuildId: message.guildId });
    if (data?.channels?.updatesCS && data?.defaultMentionRole) {
      const channel = client.channels.cache.get(
        data.channels.updatesCS
      ) as TextChannel;
      channel.send({ content: `<@&${data.defaultMentionRole}>` });
    }
  }

  if (message.author.bot) return;

  const data = await defaultGuildConfig.findOne({ GuildId: message.guildId });
  if (!data) {
    defaultGuildConfig.create({
      GuildId: message.guildId,
      Users: [],
    });
    return;
  }

  const user = data.Users.find((user) => user.userId === message.author.id);
  if (!user)
    await data.updateOne({
      $push: {
        Users: { userId: message.author.id, Level: 0, XP: 0, cooldown: 0 },
      },
    });
  if (message.content.length < 5) return;
  if (message.content.search(/\b(\w{2})\w*\1\b/g) === 0) return;
  if (user?.cooldown * 60000 - Date.now() < 0) {
    await data.updateOne(
      {
        $inc: { ["Users.$[outer].XP"]: 20 },
        ["Users.$[outer].cooldown"]: new Date().getMinutes(),
      },
      { arrayFilters: [{ "outer.userId": message.author.id }] }
    );
  }

  const toNewNextLevel =
    (5 / 6) *
      (user?.Level + 1) *
      (2 * (user?.Level + 1) * (user?.Level + 1) +
        27 * (user?.Level + 1) +
        91) -
    user?.XP;
  if (toNewNextLevel <= 0 && user?.cooldown < new Date().getMinutes()) {
    await data.updateOne(
      {
        $inc: { ["Users.$[outer].Level"]: 1 },
        ["Users.$[outer].cooldown"]: new Date().getMinutes(),
      },
      { arrayFilters: [{ "outer.userId": message.author.id }] }
    );
  }

  const data2 = await defaultGuildConfig.findOne({ GuildId: message.guildId });
  if (data2) {
    data2.XPRoles.forEach((Roles) => {
      const getRole = message.member?.guild.roles.cache.get(Roles?.role);

      if (getRole && user?.Level >= Roles?.level) {
        message.guild?.members.cache.get(message.author.id)?.roles.add(getRole);

        if (getRole && user?.Level < Roles?.level) {
          message.guild?.members.cache
            .get(message.author.id)
            ?.roles.remove(getRole);
        }
      }
    });
  }
};
