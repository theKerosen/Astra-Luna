import { ChatInputCommandInteraction, Interaction, Message } from "discord.js";
import { Canvas, loadFont, loadImage } from "canvas-constructor/napi-rs";
import { request } from "undici";
import root from "app-root-path";
import { GuildDatabases } from "./astraDBManager";

interface Roles {
  role: string;
  level: number;
}

export class Mensagem {
  public mensagem: Message;
  public db: GuildDatabases;

  constructor(mensagem: Message) {
    this.mensagem = mensagem;
    this.db = new GuildDatabases({ guild_id: this.mensagem.guildId });
  }
  async run() {
    await new XPUser(this.mensagem).run();
  }
}

export class XPSystem extends Mensagem {
  async validateXP() {
    if (this.mensagem.author.bot) return false;
    const user = await this.db.validateUser(this.mensagem.author.id);

    if (this.mensagem.content.length < 5) return false;
    if (this.mensagem.content.search(/(\p{Lu}{2,})/g) === 0) return false;
    if (this.mensagem.content.search(/(\w{2,})+(\w*)\1/g) === 0) return false;
    if (Date.now() - parseInt(user?.cooldown) >= 150000) return false;

    return true;
  }
}

class CalculateStuff extends GuildDatabases {
  constructor(guildid: string) {
    super({ guild_id: guildid });
  }
  async calculateLevel(id: string, minusXP: true | undefined = undefined) {
    const user = await this.validateUser(id);

    const level = user.xp.level ?? 0 + 1;
    const levelUp =
      (5 / 6) * level * (2 * level ** 2 + 27 * level + 91) -
      (minusXP ? user.xp.user_xp : 0);
    return levelUp;
  }
}

export class XPUser extends XPSystem {
  public calculateStuff: CalculateStuff;
  constructor(mensagem: Message) {
    super(mensagem);

    this.calculateStuff = new CalculateStuff(this.mensagem.guildId as string);
  }

  async run() {
    await this.updateUserXP();
    await this.updateUserLevel();
    await this.updateUserRole();
  }

  private async updateUserXP() {
    const data = await this.db.find();
    const isValid = await this.validateXP();

    if (isValid) {
      await data.updateOne(
        {
          $inc: {
            [`guild_users.$[outer].xp.user_xp`]: 20,
          },
          ["guild_users.$[outer].xp.cooldown"]: Date.now(),
        },
        { arrayFilters: [{ "outer.user_id": this.mensagem.author.id }] }
      );
    }
  }

  private async updateUserLevel() {
    const data = await this.db.find();
    const level = await this.calculateStuff.calculateLevel(
      this.mensagem.author.id,
      true
    );

    if (level <= 0) {
      data.updateOne(
        {
          $inc: { ["guild_users.$[outer].xp.level"]: 1 },
          ["guild_users.$[outer].xp.cooldown"]: Date.now(),
        },
        { arrayFilters: [{ "outer.user_id": this.mensagem.author.id }] }
      );
    }
  }

  private async updateUserRole() {
    const data = await this.db.find();

    const user = await this.db.validateUser(this.mensagem.author.id);

    const xpRoles = data.settings?.xp_settings?.xp_roles as Roles[];

    xpRoles.forEach((r) => {
      const userRole = this.mensagem.member?.guild.roles.cache.get(r.role);

      if (userRole && user.Level < r.level)
        this.mensagem.guild?.members.cache
          .get(this.mensagem.author.id)
          ?.roles.remove(userRole);

      if (userRole && !user)
        this.mensagem.guild?.members.cache
          .get(this.mensagem.author.id)
          ?.roles.remove(userRole);

      if (userRole && user.Level >= r.level)
        this.mensagem.guild?.members.cache
          .get(this.mensagem.author.id)
          ?.roles.add(userRole);
    });
  }
}

export class DisplayInformation {
  public calculateStuff: CalculateStuff;
  public db: GuildDatabases;
  public interaction: Interaction;

  constructor(interaction: ChatInputCommandInteraction) {
    this.interaction = interaction;
    this.db = new GuildDatabases({ guild_id: this.interaction.guildId });
    this.calculateStuff = new CalculateStuff(
      this.interaction.guildId as string
    );
  }

  async generateDisplay(id: string) {
    const user = await this.db.validateUser(id);

    const guild = await this.db.sort(-1);
    const level = await this.calculateStuff.calculateLevel(id);

    const discordUser = await this.interaction.client.users.fetch(id);

    const image = await loadImage(
      "https://cdn.discordapp.com/attachments/943547363031670785/1136447824083570728/Untitled-1.png"
    );
    loadFont(`${root}/public/Montserrat-SemiBold.ttf`, "MontSemi");
    const { body } = await request(
      discordUser.displayAvatarURL({ extension: "jpg", size: 4096 })
    );
    const avatar = await loadImage(await body.arrayBuffer());
    return new Canvas(700, 250)
      .setColor("#36393e")
      .printImage(avatar, 0, 0, 250, 250)
      .printImage(image, 0, 0, 700, 250)

      .setTextFont("30px MontSemi")
      .setStrokeWidth(2)

      .setColor("#000000")
      .setGlobalAlpha(0.6)
      .printText(discordUser.globalName ?? discordUser.username, 273, 173, 200) //dropshadow

      .setColor("#7289da")
      .setGlobalAlpha(1.0)
      .printStrokeText(
        discordUser.globalName ?? discordUser.username,
        270,
        170,
        200
      )
      .printText(discordUser.globalName ?? discordUser.username, 270, 170, 200)
      .setTextFont("20px MontSemi")
      .printStrokeText("XP", 537, 224, 100)
      .printText("XP", 537, 224, 100)
      .setColor("#7289da")

      .printStrokeText(`Lv.${user.xp.level}`, 250, 224, 100)
      .printText(`Lv.${user.xp.level}`, 250, 224, 100)

      .printStrokeText(
        `${Math.floor(user.xp.user_xp)}/${Math.floor(level)}`,
        572,
        224,
        115
      )
      .printText(
        `${Math.floor(user.xp.user_xp)}/${Math.floor(level)}`,
        572,
        224,
        115
      )
      .setTextFont("30px MontSemi")
      .printStrokeText(
        this.interaction.guild?.name.toUpperCase() ?? "Sem nome",
        354,
        60,
        300
      )
      .printText(
        this.interaction.guild?.name.toUpperCase() ?? "Sem nome",
        354,
        60,
        300
      )

      .printStrokeText(
        `#${guild.guild_users.findIndex((e) => e.user_id === id) + 1}`,
        620,
        170,
        65
      )
      .printText(
        `#${guild.guild_users.findIndex((e) => e.user_id === id) + 1}`,
        620,
        170,
        65
      )

      .setColor("#7289da")
      .setGlobalAlpha(1.0)
      .printRectangle(
        256,
        188,
        407 * (((user.xp.user_xp / level) * 100) / 100),
        11
      )
      .setColor("#000000")
      .setTextFont("15px MontSemi")
      .printText(
        `${Math.round((user.xp.user_xp / level) * 100)}%`,
        434,
        199,
        65
      )
      .pngAsync();
  }
}
