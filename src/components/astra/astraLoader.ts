import { readdirSync } from "fs";
import { AstraLuna } from "../../client";
import {
  ChatInputCommandInteraction,
  Collection,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import root from "app-root-path";

export class BaseHandler extends AstraLuna {
  CommandData: Collection<string, SlashCommandBuilder> = new Collection();
  async loadCommands() {
    const files = readdirSync(`${root}/dist/commands`);

    for (const file of files) {
      if (file.endsWith("js")) {
        const module = await import(`${root}/dist/commands/${file}`);
        const cmdClass = module.default;
        if (cmdClass) {
          this.commands.set(cmdClass.data.name, cmdClass);
          this.CommandData.set(cmdClass.data.name, cmdClass.data.toJSON());
        }
      }
    }

    return this;
  }

  async sendCommands() {
    const rest = new REST().setToken(process.env.TOKEN ?? "");

    await rest
      .put(Routes.applicationCommands(process.env.ID ?? ""), {
        body: this.CommandData.map((v) => v),
      })
      .catch((e) =>
        console.log(`[Astra Luna] Commands were not registered, error: \n${e}`)
      );

    return this;
  }

  async runCommand(
    interaction: ChatInputCommandInteraction,
    client: AstraLuna
  ) {
    if (!interaction.isChatInputCommand()) return;

    const command = this.commands.get(interaction.commandName);

    if (!command) return;
    await command.setClient(client).setInteraction(interaction).execute();
  }
}
