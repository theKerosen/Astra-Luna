import { Handler } from "../astraComponents/Handler";
import { Events } from "discord.js";
import { StatusCS, statusChannel } from "../astraComponents/counterStrike";
import { Rastreador } from "../astraComponents/Rastreador";
import { CSGOClient, AstraLuna } from "./Client";
import cron from "node-cron";
import { BEmbed } from "../discordComponents/Embed";
import { XPUser } from "../astraComponents/xpSystem";
import { Inicializar, Interação } from "../astraComponents/Events";

const client = new AstraLuna();
client.mongoConnect();
client.login();

new Handler({ client: client }).run();

cron.schedule("*/45 * * * * *", async () => {
  await new StatusCS({
    client: client,
    globalOffensive: CSGOClient,
  }).checkAll();

  await new Rastreador({
    client: client,
    request_hops: 10,
  })
    .rastrearIdentificador()
    .then(async (e) => await e.rastrearPost());
});

cron.schedule("1 0 22 * * TUE", async () => {
  await new statusChannel({ client }).send(
    new BEmbed()
      .setAuthor({
        name: "Bônus de XP Semanal resetado! (22h)",
      })
      .setDescription("O bônus de XP semanal foi resetado, aproveite!")
      .setThumbnail(
        "https://images-ext-2.discordapp.net/external/O5C3rkJrjmLpvDHM_rHk13MBeIrYUJbFmg65j7z4O24/https/cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg?width=35&height=35"
      )
      .setColor("Green")
  );
});

client.once(Events.ClientReady, () =>
  new Inicializar({ client: client }).run()
);
client.on(Events.InteractionCreate, async (interaction) =>
  new Interação({ client: client, interaction: interaction }).run()
);
client.on("messageCreate", async (message) => {
  await new XPUser({ client: client, mensagem: message }).run();
});
export { client };
