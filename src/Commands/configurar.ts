import { Command } from "../utils/command";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Interaction,
  ButtonStyle,
} from "discord.js";
import { Channels } from "../Schem/Schematica";
import { BChannelMenu } from "../Constructors/SelectMenu";
import { BButton } from "../Constructors/Button";

enum MenuInicial {
  Canais = 1,
  Notificar = 2,
  XP = 3,
  Cargo = 4,
}
enum MenuCanais {
  Sugestões = 1,
  Notificações = 2,
}

export = {
  data: new SlashCommandBuilder()
    .setName("configurar")
    .setDescription("configuração do BOT > ..."),

  async execute(interaction: ChatInputCommandInteraction, client) {
    await interaction.deferReply({ ephemeral: true });
    const Guild = client.guilds.cache.get(interaction.guildId ?? "");
    const User = Guild?.members.cache.get(interaction.user.id);
    if (!User?.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.editReply({
        content: "[❌] Sem permissão.",
      });

    const ListMenu: string[] = [
      "Configurar Canais?",
      "Configurar Notificações do Blog?",
      "Configurar sistema de XP?",
    ];
    const Canais: string[] = ["Sugestões", "Notificações"];

    const line = {} as { [key: string]: number };
    line[interaction.user.id] = line[interaction.user.id] || 0;

    const Rows = (id: string) => {
      return new BButton()
        .addButton({
          customId: "button_up",
          emoji: "<:previous_page:1098891318572363877>",
          style: ButtonStyle.Success,
          disabled: line[id] === 0,
        })
        .addButton({
          customId: "button_down",
          emoji: "<:next_page:1098891315611193364>",
          style: ButtonStyle.Success,
          disabled:
            line[id] === ListMenu.length - 1 || line[id] === Canais.length - 1,
        })
        .addButton({
          customId: "button_enter",
          emoji: "<:scan_nextpage:1098891319658692714>",
          style: ButtonStyle.Danger,
          disabled: false,
        });
    };

    await interaction.editReply({
      content: ListMenu[line[interaction.user.id]],
      components: [Rows(interaction.user.id)],
    });

    /*     const filterIn = (i: Interaction) => i.user.id === interaction.user.id;
    const collector = interaction.channel?.createMessageComponentCollector({
      filter: filterIn,
      time: 50 * 60000,
    });
    
    collector?.on("collect", async (buttonI: ButtonInteraction) => {
      await buttonI.deferUpdate();

      if (buttonI.customId === "button_up" && line[interaction.user.id] > 0)
        --line[interaction.user.id];

      if (
        buttonI.customId === "button_down" &&
        line[interaction.user.id] < ListMenu.length - 1
      )
        ++line[interaction.user.id];
      if (buttonI.customId === "button_enter")
        if (line[interaction.user.id] === MenuInicial.Canais) {
          interaction.editReply({
            content: Canais[line[interaction.user.id]],
            components: [Rows(interaction.user.id)],
          });
        }
    }); */
  },
} as Command;
