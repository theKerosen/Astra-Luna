import { BEmbed } from "../Constructors/Embed";
import { defaultGuildConfig } from "../Schem/Schematica";
import { ChannelType, codeBlock, ModalSubmitInteraction } from "discord.js";
import { AstraLuna } from "../utils/Client";
export async function execute(
  interaction: ModalSubmitInteraction,
  client: AstraLuna
) {
  const findChannel = await defaultGuildConfig.findOne({
    GuildId: interaction.guildId,
  });
  const suggestionChannel = client.channels.cache.get(
    findChannel?.channels?.suggestions ?? ""
  );
  if (suggestionChannel?.type !== ChannelType.GuildText) return;
  const embed = new BEmbed()
    .setAuthor({
      name: `Sugestão — ${interaction.user.username}`,
    })
    .setDescription(
      `Título da Sugestão:
      ${codeBlock(`${interaction.fields.getTextInputValue("TextField_2")}`)}
      Descrição da Sugestão:
          ${codeBlock(interaction.fields.getTextInputValue("TextField_2"))}`
    )
    .setColor("Blurple")
    .setThumbnail(interaction.user.avatarURL());

  const message = await suggestionChannel.send({
    embeds: [embed],
  });
  message.react("👍");
  message.react("👎");
  return interaction.reply({
    content: `[✔️] Ação executada com sucesso. (<#${findChannel?.channels?.suggestions}>)`,
    ephemeral: true,
  });
}
