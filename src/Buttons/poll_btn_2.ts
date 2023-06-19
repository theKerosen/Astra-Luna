import { ButtonInteraction } from "discord.js";
import { AstraLuna } from "../utils/Client";
export async function execute(
  interaction: ButtonInteraction,
  client: AstraLuna
) {
    if (
    client.votes.has(
      `vote_${interaction.user.id}_${interaction.message.embeds[0].description}`
    )
  )
    return interaction.reply({ content: "Você já votou.", ephemeral: true }); 
  client.votes.set(
    `vote_${interaction.user.id}_${interaction.message.embeds[0].description}`,
    true
  );
  const Embed = interaction.message.embeds[0];
  const votes1 = parseInt(Embed.fields[0].value)
  const votes2 = parseInt(Embed.fields[1].value) + 1
  const percentage1 = votes1 / (votes1+votes2) * 100
  const percentage2 = votes2 / (votes1+votes2) * 100
  Embed.fields[0].value = `${votes1} (${percentage1.toFixed(2)}%)`;
  Embed.fields[1].value = `${votes2} (${percentage2.toFixed(2)}%)`;
  interaction.message.edit({ embeds: [Embed] }).catch(() => {
    console.log("Unable to edit poll message.")
  });
  interaction.reply({ content: "Obrigado por ter votado.", ephemeral: true });
}
