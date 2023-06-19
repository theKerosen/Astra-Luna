import {
  CommandInteraction,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { AstraLuna } from "../utils/Client";

export interface Command {
  data: SlashCommandBuilder;
  execute(
    interaction: CommandInteraction | ChatInputCommandInteraction,
    client: AstraLuna
  ): Promise<void>;
}
