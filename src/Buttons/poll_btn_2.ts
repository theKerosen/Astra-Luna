import { ButtonInteraction } from "discord.js";
import { XPManager } from "../utils/Client";
export async function execute(
  interaction: ButtonInteraction,
  client: XPManager
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
  Embed.fields[1].value = (parseInt(Embed.fields[1].value) + 1).toString();
  interaction.message.edit({ embeds: [Embed] });
  interaction.reply({ content: "Obrigado por ter votado.", ephemeral: true });
}
