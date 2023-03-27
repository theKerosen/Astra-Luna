import { Message } from "discord.js";
import { XPManager } from "../utils/Client";
import levels, { User } from "mee6-levels-api";
import applyRole from "../utils/applyRole";

export const onMessage = async (client: XPManager, message: Message) => {
  levels.getUserXp("728049308976545792", message.author.id).then((user) => {
    applyRole(message, user as User);
  });
};
