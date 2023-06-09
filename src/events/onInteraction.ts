import { Interaction } from "discord.js";
import { XPManager } from "../utils/Client";
import { Channels } from "../Schem/Schematica";

export const onInteraction = async (
  interaction: Interaction,
  client: XPManager
) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (interaction.user.bot == true) return;
    if (!command) return;

    const Commands = await Channels.findOne({
      GuildId: interaction.guildId,
    });
    if (Commands?.ToggleCommands.includes(command.data.name))
      return interaction.reply({
        content: "Módulo desabilitado.",
        ephemeral: true,
      });
    try {
      command.execute(interaction, client);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content:
          "[❌] A não ser que os servidores do Discord tenham pegado fogo, isso é um erro.",
        ephemeral: true,
      });
    }
  }
  if (interaction.isButton()) {
    (await import(`../Buttons/${interaction?.customId}`)).execute(
      interaction,
      client
    );
  }
  if (interaction.isModalSubmit()) {
    (await import(`../Modals/${interaction?.customId}`)).execute(
      interaction,
      client
    );
  }
};
