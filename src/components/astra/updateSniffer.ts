/*
    Feito por Lunx © 2023
    

    Essa classe é utilizada para rastrear o site blog.counter-strike.net e counter-strike.net
    para encontrar novas postagens utilizando a API do Wordpress.

    >> https://joaopcos.xyz/post.php?id=1
    (Créditos de quem originalmente descobriu esse método)

*/

import axios from "axios";
import fs from "fs";
import { BEmbed } from "../discord/Embed";
import { defaultGuildConfig } from "../../schematicas/Schematica";
import { ChannelType } from "discord.js";
import { AstraLuna } from "../../Client";
import root from "app-root-path";

interface Config {
  lastId: number;
  lastPostId: number;
  lastIdDate: Date;
  lastPostDate: Date;
}

export class Rastreador extends AstraLuna {
  public request_hops: number;
  private img =
    "https:///cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg";

  constructor(request_hops: number) {
    super();
    this.request_hops = request_hops;
  }

  private async enviarIdentificador(id: number) {
    const Embed = new BEmbed()
      .setTitle(`Post rastreado 🕵️`)
      .setDescription(`Identificador rastreado: ${id}`)
      .setThumbnail(this.img);

    defaultGuildConfig.find().then((e) =>
      e.forEach((ch) => {
        if (ch.channels?.updatesCS) {
          const channel = this.channels.cache.get(ch.channels?.updatesCS);
          if (channel?.type === ChannelType.GuildText)
            channel.send({ embeds: [Embed] });
        }
      })
    );
  }

  async rastrearIdentificador() {
    const config: Config = JSON.parse(
      fs.readFileSync(`${root}/blogConfig/blog_lastId.json`).toString()
    );

    for (let i = 0; i < this.request_hops; i++) {
      await axios
        .get(
          `https://blog.counter-strike.net/wp-json/wp/v2/categories?post=${
            config.lastPostId + 1 + i
          }`
        )
        .catch((error) => {
          if (error.response.data.code === "rest_forbidden_context") {
            config.lastPostId = config.lastPostId + 1 + i;
            config.lastPostDate = new Date();

            fs.writeFileSync(
              `${root}/blogConfig/blog_lastId.json`,
              JSON.stringify(config)
            );
            this.enviarIdentificador(config.lastId);
          }
        });
    }
  }
}
