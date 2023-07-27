/*
    Feito por Lunx © 2023
    

    Essa classe é utilizada para rastrear o site blog.counter-strike.net e counter-strike.net
    para encontrar novas postagens utilizando a API do Wordpress.

    >> https://joaopcos.xyz/post.php?id=1
    (Créditos de quem originalmente descobriu esse método)

*/

import axios from "axios";
import fs from "fs";
import { BEmbed } from "../discordComponents/Embed";
import { defaultGuildConfig } from "../mongooseSchemas/Schematica";
import { ChannelType } from "discord.js";
import { AstraLuna } from "../utils/Client";

interface config {
  lastId: number;
  lastPostId: number;
  lastIdDate: Date;
  lastPostDate: Date;
}

export class Rastreador {
  public request_hops: number;
  public client: AstraLuna;

  constructor(options: { request_hops: number; client: AstraLuna }) {
    this.request_hops = options.request_hops;
    this.client = options.client;
  }

  private async enviarIdentificador(id: number) {
    const Embed = new BEmbed()
      .setTitle(`Post rastreado 🕵️`)
      .setDescription(`https://www.counter-strike.net/news/updates (${id})`)
      .setFooter({
        text: "Isso pode ser um sinal de uma futura atualização no Counter-Strike.",
      })
      .setColor("Green")
      .setThumbnail(
        "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
      );

    (await defaultGuildConfig.find()).forEach((ch) => {
      if (ch.channels?.updatesCS) {
        const channel = this.client.channels.cache.get(ch.channels?.updatesCS);
        if (channel?.type === ChannelType.GuildText)
          channel.send({ embeds: [Embed] });
      }
    });
  }

  private async enviarPost(id: number) {
    const Embed = new BEmbed()
      .setTitle(`Post rastreado 🕵️`)
      .setDescription(`Identificador rastreado: ${id}`)
      .setFooter({
        text: "Isso pode ser um sinal de uma futura atualização no Counter-Strike.",
      })
      .setColor("Green")
      .setThumbnail(
        "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
      );

    (await defaultGuildConfig.find()).forEach((ch) => {
      if (ch.channels?.updatesCS) {
        const channel = this.client.channels.cache.get(ch.channels?.updatesCS);
        if (channel?.type === ChannelType.GuildText)
          channel.send({ embeds: [Embed] });
      }
    });
  }

  async rastrearPost() {
    const config: config = JSON.parse(
      fs
        .readFileSync(`${__dirname}\\..\\..\\blogConfig\\blog_lastId.json`)
        .toString()
    );

    for (let i = 0; i < this.request_hops; i++) {
      await axios
        .get(
          `https://blog.counter-strike.net/wp-json/wp/v2/posts/${config.lastId}`
        )
        .catch((error) => {
          if (error.response.data.code != "rest_post_invalid_id") {
            (config.lastPostId = config.lastPostId + 1 + i),
              (config.lastPostDate = new Date()),
              fs.writeFileSync(
                `${__dirname}\\..\\..\\blogConfig\\blog_lastId.json`,
                JSON.stringify(config)
              );
            this.enviarPost(config.lastPostId);
          }
        });
    }
  }

  async rastrearIdentificador() {
    const config: config = JSON.parse(
      fs
        .readFileSync(`${__dirname}\\..\\..\\blogConfig\\blog_lastId.json`)
        .toString()
    );

    for (let i = 0; i < this.request_hops; i++) {
      await axios
        .get(
          `https://blog.counter-strike.net/wp-json/wp/v2/categories?post=${
            config.lastId + 1 + i
          }`
        )
        .catch((error) => {
          if (error.response.data.code === "rest_forbidden_context") {
            (config.lastId = config.lastId + 1 + i),
              (config.lastIdDate = new Date()),
              fs.writeFileSync(
                `${__dirname}\\..\\..\\blogConfig/blog_lastId.json`,
                JSON.stringify(config)
              );
            this.enviarIdentificador(config.lastId);
          }
        });
    }
  }
}
