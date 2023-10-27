import { ButtonInteraction } from "discord.js";
import { AstraLuna } from "../utils/Client";

export class Buttons {
  public client: AstraLuna;
  public interaction: ButtonInteraction;
  constructor(options: { client: AstraLuna; interaction: ButtonInteraction }) {
    this.client = options.client;
    this.interaction = options.interaction;
  }
  PollButton(options: { vote1?: number; vote2?: number }) {
    if (
      this.client.votes.has(
        `vote_${this.interaction.user.id}_${this.interaction.message.embeds[0].description}`
      )
    )
      return this.interaction.reply({
        content: "Você já votou.",
        ephemeral: true,
      });
    this.client.votes.set(
      `vote_${this.interaction.user.id}_${this.interaction.message.embeds[0].description}`,
      true
    );
    const Embed = this.interaction.message.embeds[0];
    const votes1 =
      parseInt(Embed.fields[0].value) + (options.vote1 ? options.vote1 : 0);
    const votes2 =
      parseInt(Embed.fields[1].value) + (options.vote2 ? options.vote2 : 0);
    const percentage1 = (votes1 / (votes1 + votes2)) * 100;
    const percentage2 = (votes2 / (votes1 + votes2)) * 100;
    Embed.fields[0].value = `${votes1} (${percentage1.toFixed(2)}%)`;
    Embed.fields[1].value = `${votes2} (${percentage2.toFixed(2)}%)`;
    this.interaction.message.edit({ embeds: [Embed] });
    return this.interaction.reply({
      content: "Obrigado por ter votado.",
      ephemeral: true,
    });
  }
}
