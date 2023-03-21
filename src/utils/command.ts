import {
  CommandInteraction,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { XPManager } from "../utils/Client";

export interface Command {
  data: SlashCommandBuilder;
  execute(
    interaction: CommandInteraction | ChatInputCommandInteraction,
    client: XPManager
  ): Promise<void>;
}
