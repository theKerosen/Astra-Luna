import {
  ApplicationCommandOption,
  CommandInteraction,
  MessageComponentType,
} from "discord.js";
import { XPManager } from "./Client";

export interface Command {
  data: {
    name: string;
    description: string;
    type?: MessageComponentType;
    options?: ApplicationCommandOption[];
  };
  execute(client: XPManager, interaction: CommandInteraction): void;
}
