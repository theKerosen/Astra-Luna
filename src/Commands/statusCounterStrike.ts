import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../utils/command";
import protobuf from "protobufjs";
import { SteamClient } from "../utils/Client";
import { Protos } from "../utils/Proto2ID";
import { BEmbed } from "../Constructors/Embed";

export = {
  data: new SlashCommandBuilder()
    .setName("csstatus")
    .setDescription("Veja o estado dos servidores do Counter-Strike."),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    SteamClient.sendToGC(
      730,
      Protos.MatchmakingClient2GCHello,
      {},
      Buffer.alloc(0)
    );
    SteamClient.on("receivedFromGC", async (appid, msgType, payload) => {
      if (msgType === 9110)
        protobuf.load(
          `${__dirname}/../../CMsgGCCStrike15_v2.proto`,
          async (err, root) => {
            if (err) throw err;
            await interaction.editReply({
              embeds: [
                new BEmbed()
                  .setAuthor({
                    name: `Counter-Strike (${appid} — ${msgType})`,
                    iconURL: interaction.user.avatarURL() || undefined,
                  })
                  .setThumbnail(
                    "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
                  )
                  .setColor("Orange")
                  .addFields(
                    {
                      name: "Jogadores Online",
                      value: `${root
                        ?.lookupType(
                          "CMsgGCCStrike15_v2_MatchmakingGC2ClientHello"
                        )
                        .decode(payload)
                        .toJSON()
                        .globalStats.playersOnline.toLocaleString()} Jogadores`,
                      inline: true,
                    },
                    {
                      name: "Servidores Online",
                      value: `${root
                        ?.lookupType(
                          "CMsgGCCStrike15_v2_MatchmakingGC2ClientHello"
                        )
                        .decode(payload)
                        .toJSON()
                        .globalStats.serversAvailable.toLocaleString()} Servidores`,
                      inline: true,
                    },
                    {
                      name: "Tempo de busca estimado",
                      value: `${(
                        root
                          ?.lookupType(
                            "CMsgGCCStrike15_v2_MatchmakingGC2ClientHello"
                          )
                          .decode(payload)
                          .toJSON().globalStats.searchTimeAvg / 60000
                      ).toFixed(2)} minuto(s)`,
                      inline: true,
                    }
                  ),
              ],
            });
          }
        );
    });
  },
} as Command;
