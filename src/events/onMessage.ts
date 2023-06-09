import { Message, TextChannel } from "discord.js";
import { XPManager } from "../utils/Client";

import { Channels, XP } from "../Schem/Schematica";

export const onMessage = async (client: XPManager, message: Message) => {
  if (message.author.id === "890753656331325480") {
    Channels.findOne(
      { GuildId: message.guildId },
      {},
      {},
      async (err, data) => {
        if (err) throw err;
        if (!data?.BlogChannelId || !data?.NotifyRoleId) return;

        const channel = client.channels.cache.get(
          data?.BlogChannelId
        ) as TextChannel;
        console.log(channel);
        channel.send({ content: `<@&${data.NotifyRoleId}>` });
      }
    );
  }
  if (message.author.bot) return;
  XP.findOne(
    {
      GuildId: message.guildId,
    },
    {},
    {},
    async (err, data) => {
      if (err) throw err;
      if (!data) {
        return await XP.create({
          GuildId: message.guildId,
          Users: [],
        });
      }
    }
  );
  XP.findOne(
    {
      GuildId: message.guildId,
      "Users.userId": message.author.id,
    },
    { "Users.$": 1 },
    {},
    async (err, data) => {
      if (err) throw err;
      if (data === null) {
        await XP.updateOne(
          { GuildId: message.guildId },
          {
            $push: {
              Users: {
                userId: message.author.id,
                Level: 0,
                XP: 0,
                cooldown: 0,
              },
            },
          }
        );
      }

      //
      // UPDATE THE XP
      //
      if (data?.Users[0].cooldown * 60000 - Date.now() < 0) {
        await data?.updateOne(
          {
            $inc: { ["Users.$[outer].XP"]: 20 },
            ["Users.$[outer].cooldown"]: new Date().getMinutes(),
          },
          {
            arrayFilters: [{ "outer.userId": message.author.id }],
          }
        );
      }

      //
      // UPDATE THE LEVEL
      //

      //5 / 6 * lvl * (2 * lvl * lvl + 27 * lvl + 91)

      const toNewNextLevel =
        (5 / 6) *
          (data?.Users[0].Level + 1) *
          (2 * (data?.Users[0].Level + 1) * (data?.Users[0].Level + 1) +
            27 * (data?.Users[0].Level + 1) +
            91) -
        data?.Users[0].XP;

      if (
        toNewNextLevel <= 0 &&
        data?.Users[0].cooldown < new Date().getMinutes()
      ) {
        await data?.updateOne(
          {
            $inc: { ["Users.$[outer].Level"]: 1 },
            ["Users.$[outer].cooldown"]: new Date().getMinutes(),
          },
          {
            arrayFilters: [{ "outer.userId": message.author.id }],
          }
        );
      }

      //
      // CHECK ROLES
      //

      Channels.findOne(
        { GuildId: message.guildId },
        {},
        {},
        async (err, data2) => {
          if (err) throw err;
          if (!data2) return;
          data2?.RolesNXP.forEach((Roles) => {
            if (!Roles) return;
            const getRole = message.member?.guild.roles.cache.find(
              (role) => role.id === Roles?.role
            );
            if (data?.Users[0].Level >= Roles.level && getRole) {
              message.guild?.members.cache
                .get(message.author.id)
                ?.roles.add(getRole);
            }
            if (data?.Users[0].Level <= Roles.level && getRole) {
              message.guild?.members.cache
                .get(message.author.id)
                ?.roles.remove(getRole);
            }
          });
        }
      );
    }
  );
};
