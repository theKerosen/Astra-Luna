/* import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../command";
import { WarnSystem } from "../components/astra/warnSystem";

export = {
  data: new SlashCommandBuilder()
    .setName("aviso")
    .setDescription("► Sistema de avisos!")
    .addSubcommand((s) =>
      s
        .setName("adicionar")
        .setDescription("► Adicione um aviso para um usuário")
        .addUserOption((u) =>
          u
            .setName("usuário")
            .setDescription("► O usuário que receberá o aviso")
            .setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction, client) {
    if (interaction.options.getSubcommand() === "adicionar") {
      const warnSystem = new WarnSystem({
        client: client,
        interaction: interaction,
      });
      const user = interaction.options.getUser("usuário", true);
      const issueWarn = await warnSystem.applyWarn(user.id);
      const getWarns = await warnSystem.scanForWarns(user.id);
      console.log(issueWarn, getWarns);
    }
  },
} as Command;
 */