/* import { Command } from "../command";
import { BButton } from "../components/discord/Button";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonStyle,
} from "discord.js";
import { BEmbed } from "../components/discord/Embed";
import { setTimeout } from "timers/promises";

export = {
  data: new SlashCommandBuilder()
    .setName("enquete")
    .setDescription("Inicie uma enquete > ...")
    .addStringOption((s) =>
      s
        .setName("título")
        .setDescription("► Título da enquete (pode conter markdown.)")
        .setRequired(true)
        .setMaxLength(125)
    )
    .addStringOption((s) =>
      s
        .setName("opção_1")
        .setDescription("► Primeira opção")
        .setRequired(true)
        .setMaxLength(125)
    )
    .addStringOption((s) =>
      s
        .setName("opção_2")
        .setDescription("► Segunda opção")
        .setRequired(true)
        .setMaxLength(125)
    )
    .addNumberOption((s) =>
      s
        .setName("tempo")
        .setDescription("► tempo (em segundos) de duração.")
        .setMaxValue(604800)
        .setMinValue(5)
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    const title = interaction.options.getString("título") as string;
    const opção_1 = interaction.options.getString("opção_1") as string;
    const opção_2 = interaction.options.getString("opção_2") as string;
    const tempo = interaction.options.getNumber("tempo") ?? 120;

    const Embed = new BEmbed()
      .setAuthor({
        name: `📊 | ENQUETE`,
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
      .setColor("Blurple")
      .setFooter({ text: `Enquete feita por: ${interaction.user.globalName}` });

    const Button = new BButton()
      .addButton({
        customId: "poll_btn_1",
        label: `${opção_1}`,
        style: ButtonStyle.Primary,
        disabled: false,
      })
      .addButton({
        customId: "poll_btn_2",
        label: `${opção_2}`,
        style: ButtonStyle.Primary,
        disabled: false,
      });
    interaction
      .reply({
        components: [Button],
        embeds: [Embed],
      })
      .then(async () => {
        for (let i = 0; i < tempo + 1; i++) {
          const timeleft = tempo - i;
          await setTimeout(1000);

          interaction.editReply({
            content: `*Essa votação acaba em ${timeleft} segundos*`,
          });
          if (timeleft == 0) {
            Button.components[0].setDisabled(true);
            Button.components[1].setDisabled(true);
            interaction.editReply({ components: [Button] });
            client.votes.clear();
          }
        }
      });
  },
} as Command;
 */