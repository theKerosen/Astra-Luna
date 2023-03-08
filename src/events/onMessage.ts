import { Message } from "discord.js";
import { XPManager } from "../utils/Client";
import levels from "mee6-levels-api";
export const onMessage = async (client: XPManager, message: Message) => {
  function applyRole(id: string) {
    return message.guild?.members
      .fetch(message.author.id)
      .then((usr) => usr.roles.add(id));
  }
  levels.getUserXp("728049308976545792", message.author.id).then((usr) => {
    try {
      if (usr!.level >= 5) applyRole("1006719636659769454");
      if (usr!.level >= 15) applyRole("876576515792461824");
      if (usr!.level >= 30) applyRole("876576366328426587");
      if (usr!.level >= 50) applyRole("876574595409379398");
      if (usr!.level >= 70) applyRole("1006732112138879036");
      if (usr!.level >= 100) applyRole("1009567733710598334");
      //
      // This is not the best way of adding roles and it occasionally spits out errors.
      //
    } catch (e) {
      console.log(e);
    }
  });
};
