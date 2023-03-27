import { Command } from "../utils/command";
import { BButton } from "../Constructors/Button";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonStyle,
} from "discord.js";
import { BEmbed } from "../Constructors/Embed";

export = {
  data: new SlashCommandBuilder()
    .setName("enquete")
    .setDescription("Inicie uma enquete > ...")
    .addStringOption((s) =>
      s
        .setName("título")
        .setDescription("Título da enquete")
        .setRequired(true)
        .setMaxLength(125)
    )
    .addStringOption((s) =>
      s
        .setName("opção_1")
        .setDescription("Primeira opção")
        .setRequired(true)
        .setMaxLength(125)
    )
    .addStringOption((s) =>
      s
        .setName("opção_2")
        .setDescription("Segunda opção")
        .setRequired(true)
        .setMaxLength(125)
    )
    .addNumberOption((s) =>
      s
        .setName("tempo")
        .setDescription("tempo (em milisegundos) de duração.")
        .setMaxValue(604800000)
        .setMinValue(5000)
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    const title = interaction.options.getString("título") as string;
    const opção_1 = interaction.options.getString("opção_1") as string;
    const opção_2 = interaction.options.getString("opção_2") as string;
    const tempo = interaction.options.getNumber("tempo") ?? 120000;
    function regExLinkCheck(string: string) {
      return string?.search(
        /(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([\\/\w \\.-]*)/gu
      );
    }
    function regExEmojiCheck(string: string) {
      return string?.search(/<a?:.+:\d{1,100}>/gu);
    }
    if (
      regExLinkCheck(title) == 0 ||
      regExLinkCheck(opção_1) == 0 ||
      regExLinkCheck(opção_2) == 0
    )
      return interaction.reply({
        content: "Enquetes não podem conter emojis.",
        ephemeral: true,
      });
    if (
      regExEmojiCheck(title) == 0 ||
      regExEmojiCheck(opção_1) == 0 ||
      regExEmojiCheck(opção_2) == 0
    )
      return interaction.reply({
        content: "Enquetes não podem conter um link.",
        ephemeral: true,
      });

    const Embed = new BEmbed()
      .setAuthor({
        name: `ENQUETE!`,
        iconURL: interaction?.user?.avatarURL() ?? "",
      })
      .setDescription(title)
      .addFields([
        {
          name: `${opção_1}`,
          value: "0",
          inline: true,
        },
        {
          name: `${opção_2}`,
          value: "0",
          inline: true,
        },
      ])
      .setFooter({
        text: `Essa votação acaba em ${tempo / 1000}s`,
      })
      .setColor("Blurple");

    const Button = new BButton()
      .addButton("poll_btn_1", `${opção_1}`, ButtonStyle.Primary, false)
      .addButton("poll_btn_2", `${opção_2}`, ButtonStyle.Secondary, false);
    interaction.reply({
      components: [Button],
      embeds: [Embed],
    });
    setTimeout(() => {
      Button.components[0].setDisabled(true);
      Button.components[1].setDisabled(true);
      interaction.editReply({ components: [Button] });
      client.votes.clear;
    }, tempo);
  },
} as Command;
