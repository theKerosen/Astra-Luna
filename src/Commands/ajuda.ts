import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../utils/command";
import { BEmbed } from "../Constructors/Embed";

export = {
  data: new SlashCommandBuilder()
    .setName("ajuda")
    .setDescription("► Ajuda geral sobre os comandos"),
  async execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({
      embeds: [
        new BEmbed()
          .setTitle("Seção de AJUDA — Astra Luna")
          .setColor("Blurple")
          .setThumbnail(interaction.user.avatarURL())
          .addFields(
            {
              name: "/xp ver",
              value:
                "(Slash Command)\nEsse comando é utilizado para seu XP ou de outro usuário.",
              inline: true,
            },
            {
              name: "/xp ranking",
              value:
                "(Slash Command)\nEsse comando é utilizado para ver o RANKING do servidor.",
              inline: true,
            },
            {
              name: "/reputação adicionar",
              value:
                "(Slash Command)\nEsse comando é utilizado para adicionar um ponto positivo de reputação para um usuário.",
              inline: true,
            },
            {
              name: "/reputação remover",
              value:
                "(Slash Command)\nEsse comando é utilizado para adicionar um ponto negativo de reputação para um usuário.",
              inline: true,
            },
            {
              name: "/reputação comentários",
              value:
                "(Slash Command)\nEsse comando é utilizado para ver informações de reputação de um usuário.",
              inline: true,
            },
            {
              name: "/reputação ajuda",
              value:
                "(Slash Command)\nEsse comando é utilizado para ver a seção de ajuda do sistema de reputação.",
              inline: true,
            },
            {
              name: "/sugestão sugerir",
              value:
                "(Slash Command)\n Esse comando é utilizado para sugerir alguma adição ao servidor.",
              inline: true,
            },
            {
              name: "/feedback",
              value:
                "(Slash Command)\nEsse comando é utilizado para dar um feedback para o servidor.",
              inline: true,
            },
            {
              name: "/csstatus",
              value:
                "(Slash Command)\nEsse comando é utilizado para ver algumas informações sobre o Counter-Strike.",
              inline: true,
            },
            {
              name: "/enquete",
              value:
                "(Slash Command)\nEsse comando é utilizado para fazer uma enquete de votação no chat.",
              inline: true,
            }
          ),
      ],
    });
  },
} as Command;
