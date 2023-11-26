import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { AstraLuna } from "./client";

export interface Command {
  data: SlashCommandBuilder;
  client: AstraLuna | null;
  interaction: ChatInputCommandInteraction | null;

  setClient(client: AstraLuna): this;
  setInteraction(interaction: ChatInputCommandInteraction): this;
  execute(): Promise<void>;
}
