import { BEmbed } from "../Constructors/Embed";
import { defaultGuildConfig } from "../Schem/Schematica";
import { ChannelType, codeBlock, ModalSubmitInteraction } from "discord.js";
import { AstraLuna } from "../utils/Client";
export async function execute(
  interaction: ModalSubmitInteraction,
  client: AstraLuna
) {
  defaultGuildConfig.findOne(
    {
      GuildId: interaction.guildId,
    },
    {},
    {},
    async (err, data) => {
      if (err) throw err;
      const feedbackChannel = client.channels.cache.get(
        data?.channels?.feedbacks ?? ""
      );
      if (feedbackChannel?.type !== ChannelType.GuildText) return;
      const embed = new BEmbed()
        .setAuthor({
          name: `Feedback — ${interaction.user.globalName}`,
        })
        .setDescription(
          `
          ${codeBlock(
            `${interaction.fields.getTextInputValue("feedbackField")}`
          )}`
        )
        .setColor("Blurple")
        .setThumbnail(interaction.user.avatarURL());

      await feedbackChannel.send({
        embeds: [embed],
      });

      return interaction.reply({
        content: `[✔️] Feedback enviado.`,
        ephemeral: true,
      });
    }
  );
}
