import { BEmbed } from "../Constructors/Embed";
import { Channels } from "../Schem/Schematica";
import { ChannelType, codeBlock, ModalSubmitInteraction } from "discord.js";
import { XPManager } from "../utils/Client";
export async function execute(
  interaction: ModalSubmitInteraction,
  client: XPManager
) {
  const findChannel = await Channels.findOne({
    guildId: interaction.guildId,
  });
  const suggestionChannel = client.channels.cache.get(
    findChannel?.suggestionChannelId ?? ""
  );
  if (suggestionChannel?.type !== ChannelType.GuildText) return;
  const embed = new BEmbed().setADC({
    author: {
      name: `${
        interaction.user.username
      } > ${interaction.fields.getTextInputValue("SuggestionInput1")}`,
    },
    description: `${codeBlock(
      interaction.fields.getTextInputValue("SuggestionInput2")
    )}`,
    color: "Blue",
  });

  const message = await suggestionChannel.send({
    embeds: [embed],
  });
  message.react("👍");
  message.react("👎");
  return interaction.reply({
    content: `[✔️] Ação executada com sucesso. (<#${findChannel?.suggestionChannelId}>)`,
    ephemeral: true,
  });
}
