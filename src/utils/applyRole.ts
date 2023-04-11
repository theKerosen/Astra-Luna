import { Message } from "discord.js";
import levels from "mee6-levels-api";
import { Channels } from "../Schem/Schematica";

export async function execute(message: Message) {
  const cargos = await Channels.findOne({ GuildId: message?.guildId });
  const apply = (message: Message, roleID: string, userID: string) =>
    message.guild?.members.fetch(userID).then((user) => user.roles.add(roleID));

  levels.getUserXp(message?.guildId ?? "", message.author.id).then((user) => {
    if (user)
      cargos?.RolesNXP.forEach((cargo) => {
        if (user?.level >= cargo.nivel)
          return apply(message, cargo.role, user?.id ?? "")?.catch();
      });
  });
}
