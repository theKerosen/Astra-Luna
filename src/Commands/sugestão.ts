import { Command } from "../utils/command";
import { BModal } from "../Constructors/Modal";
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextInputStyle,
} from "discord.js";
export = {
  data: new SlashCommandBuilder()
    .setName("sugestão")
    .setDescription("Enviar sugestão..."),
  async execute(interaction: ChatInputCommandInteraction, client) {
    const modal = new BModal()
      .createModal({ custom_id: "sugestão", title: "Sugestão" })
      .addText({
        custom_id: "TextField_1",
        label: `Qual é a ideia, ${interaction.user.username}?`,
        style: TextInputStyle.Short,
        placeholder: "Uma sugestão sobre móveis.",
        min_length: 24,
        max_length: 150,
        required: true,
      })
      .addText({
        custom_id: "TextField_2",
        label: `Conte me mais, ${interaction.user.username}!`,
        style: TextInputStyle.Paragraph,
        placeholder:
          "Sugiro mover aquela cadeira de lugar, tá me incomodando bastante!",
        min_length: 68,
        max_length: 250,
        required: true,
      });
    await interaction.showModal(modal);
  },
} as Command;
