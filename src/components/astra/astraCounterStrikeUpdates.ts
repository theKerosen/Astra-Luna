/*

    Essa classe é utilizada para rastrear o site blog.counter-strike.net e counter-strike.net
    para encontrar novas postagens utilizando a API do Wordpress.

    >> https://joaopcos.xyz/post.php?id=1

*/

import axios, { AxiosError } from "axios";
import fs from "fs";
import { BEmbed } from "../discord/Embed";
import { GuildCollection } from "../../schematicas/schematica";
import { REST } from "discord.js";
import { AstraLuna } from "../../client";
import root from "app-root-path";

interface Config {
  lastId: number;
  lastIdDate: Date;
}

export class Rastreador extends AstraLuna {
  public request_hops: number;
  private img =
    "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg";

  constructor(request_hops: number) {
    super();
    this.request_hops = request_hops;
  }

  private enviarIdentificador(id: number) {
    console.log(
      `[Astra Luna] > New ID detected in the Counter-Strike's blog, sending it to everybody...`
    );
    const Embed = new BEmbed()
      .setTitle(`Post rastreado 🕵️`)
      .setDescription(`Identificador rastreado: ${id}`)
      .setColor("DarkGold")
      .setThumbnail(this.img);

    GuildCollection.find().then(async (e) => {
      for (let i = 0; e.length > i; i++) {
        const channelid =
          e[i].settings?.notification_settings?.counterstrike_updates;

        const rest = new REST({ version: "10" }).setToken(
          process.env.TOKEN ?? ""
        );
        if (channelid) {
          await rest
            .post(`/channels/${channelid}/messages`, {
              body: {
                embeds: [Embed],
              },
            })
            .catch(() =>
              console.error(
                `[Astra Luna] Channel ${channelid} is nonexistent or unreachable, ignoring...`
              )
            );
        }
      }
    });
    return true;
  }

  rastrearIdentificador() {
    const config: Config = JSON.parse(
      fs.readFileSync(`${root}/blog/blogData.json`).toString()
    );

    for (let i = 0; i < this.request_hops; i++) {
      const promise = Promise.resolve(
        axios.get(
          `https://blog.counter-strike.net/wp-json/wp/v2/categories?post=${
            config.lastId + 1 + i
          }`
        )
      );

      promise.catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          config.lastId = config.lastId + 1 + i;
          config.lastIdDate = new Date();

          fs.writeFileSync(
            `${root}/blog/blogData.json`,
            JSON.stringify(config)
          );
          this.enviarIdentificador(config.lastId);
        }
      });
    }

    return true;
  }
}
