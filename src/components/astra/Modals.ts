/*

    Feito por Lunx © 2023

*/

import { ModalSubmitInteraction, codeBlock, ChannelType } from "discord.js";
import { BEmbed } from "../../components/discord/Embed";
import { GuildCollection } from "../../schematicas/Schematica";
import { AstraLuna } from "../../Client";

export class Modals {
  public client: AstraLuna;
  public interaction: ModalSubmitInteraction;
  constructor(options: {
    client: AstraLuna;
    interaction: ModalSubmitInteraction;
  }) {
    this.client = options.client;
    this.interaction = options.interaction;
  }

  async sugestãoModal() {
    const sugestãoChannel = await this.findSugestãoChannel();
    if (typeof sugestãoChannel == "boolean") return;
    if (!sugestãoChannel) return;
    const embed = new BEmbed()
      .setAuthor({
        name: `Sugestão — ${this.interaction.user.username}`,
      })
      .setDescription(
        `Título da Sugestão:
      ${codeBlock(
        `${this.interaction.fields.getTextInputValue("TextField_1")}`
      )}
      Descrição da Sugestão:
          ${codeBlock(
            this.interaction.fields.getTextInputValue("TextField_2")
          )}`
      )
      .setColor("Blurple")
      .setThumbnail(this.interaction.user.avatarURL());

    const message = await sugestãoChannel.send({
      embeds: [embed],
    });

    message.react("👍");
    message.react("👎");

    return this.interaction.reply({
      content: `[✔️] Ação executada com sucesso. `,
      ephemeral: true,
    });
  }

  async findSugestãoChannel() {
    const data = await Promise.resolve(
      GuildCollection.findOne({
        GuildId: this.interaction.guildId,
      })
    );

    if (!data) return false;
    if (!data?.channels?.suggestions) return false;

    if (data?.channels?.suggestions) {
      const channel = this.client.channels.cache.get(
        data?.channels?.suggestions
      );

      if (channel?.type === ChannelType.GuildText) return channel;
    }
  }

  async FeedbackModal() {
    const feedbackChannel = await this.findFeedbackChannel();
    if (typeof feedbackChannel == "boolean") return;
    if (!feedbackChannel) return;

    const embed = new BEmbed()
      .setAuthor({
        name: `Feedback — ${this.interaction.user.globalName}`,
      })
      .setDescription(
        `
        ${codeBlock(
          `${this.interaction.fields.getTextInputValue("feedbackField")}`
        )}`
      )
      .setColor("Blurple")
      .setThumbnail(this.interaction.user.avatarURL());

    await feedbackChannel.send({
      embeds: [embed],
    });

    return this.interaction.reply({
      content: `[✔️] Feedback enviado.`,
      ephemeral: true,
    });
  }
  async findFeedbackChannel() {
    const data = await Promise.resolve(
      GuildCollection.findOne({
        GuildId: this.interaction.guildId,
      })
    );

    if (!data) return false;
    if (!data?.channels?.feedbacks) return false;

    if (data?.channels?.feedbacks) {
      const channel = this.client.channels.cache.get(data?.channels?.feedbacks);
      if (channel?.type === ChannelType.GuildText) return channel;
    }
  }
}
