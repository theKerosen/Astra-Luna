/*

    Feito por Lunx © 2023

*/

import { ChatInputCommandInteraction, Message } from "discord.js";
import { AstraLuna } from "../utils/Client";
import { Interação, Mensagem } from "./Events";
import { BEmbed } from "../discordComponents/Embed";
import { guildDatabases } from "./dbManager";

interface IUser {
  userId: string;
  XP: number;
  Level: number;
  cooldown: Date;
}
interface Roles {
  role: string;
  level: number;
}

export class XPSystem extends Mensagem {
  constructor(options: { client: AstraLuna; mensagem: Message }) {
    super({ client: options.client, mensagem: options.mensagem });
  }
  async validateXP() {
    const user = await await new guildDatabases({
      guild_id: this.mensagem.guildId,
    }).validateUser(this.mensagem.author.id);
    if (this.mensagem.author.bot) return false;
    if (this.mensagem.content.length < 5) return false;
    if (this.mensagem.content.search(/\b(\w{2})\w*\1\b/g) === 0) return false;
    if (Date.now() - parseInt(user.cooldown.toDateString()) >= 150000)
      return false;

    return true;
  }

  async calculateLevel(minusXP: true | undefined = undefined) {
    const user = await new guildDatabases({
      guild_id: this.mensagem.guildId,
    }).validateUser(this.mensagem.author.id);

    const level = user.Level + 1;
    const levelUp =
      (5 / 6) * level * (2 * level ** 2 + 27 * level + 91) -
      (minusXP ? user.XP : 0);
    return levelUp;
  }
}

export class XPUser extends XPSystem {
  constructor(options: { client: AstraLuna; mensagem: Message }) {
    super({ client: options.client, mensagem: options.mensagem });
  }

  async run() {
    await this.updateUserXP();
    await this.updateUserLevel();
    await this.updateUserRole();
  }

  private async updateUserXP() {
    const data = await new guildDatabases({
      guild_id: this.mensagem.guildId,
    }).find();

    const isValid = await this.validateXP();

    if (isValid) {
      await data.updateOne(
        {
          $inc: { ["Users.$[outer].XP"]: 20 },
          ["Users.$[outer].cooldown"]: Date.now(),
        },
        { arrayFilters: [{ "outer.userId": this.mensagem.author.id }] }
      );
    }
    return;
  }

  private async updateUserLevel() {
    const data = await new guildDatabases({
      guild_id: this.mensagem.guildId,
    }).find();
    const level = await this.calculateLevel(true);

    if (level <= 0) {
      await data.updateOne(
        {
          $inc: { ["Users.$[outer].Level"]: 1 },
          ["Users.$[outer].cooldown"]: Date.now(),
        },
        { arrayFilters: [{ "outer.userId": this.mensagem.author.id }] }
      );
    }
    return;
  }

  private async updateUserRole() {
    const data = await new guildDatabases({
      guild_id: this.mensagem.guildId,
    }).find();

    const user = await new guildDatabases({
      guild_id: this.mensagem.guildId,
    }).validateUser(this.mensagem.author.id);

    const xpRoles = data.XPRoles as Roles[];

    xpRoles.forEach((r) => {
      const userRole = this.mensagem.member?.guild.roles.cache.get(r.role);

      if (userRole && user.Level < r.level)
        this.mensagem.guild?.members.cache
          .get(this.mensagem.author.id)
          ?.roles.remove(userRole);
      return;
    });
  }
}

export class displayInformation extends Interação {
  constructor(options: {
    client: AstraLuna;
    interaction: ChatInputCommandInteraction;
  }) {
    super({ client: options.client, interaction: options.interaction });
    this.interaction = options.interaction;
  }
  async calculateLevel(minusXP: true | undefined = undefined, id: string) {
    const user = await new guildDatabases({
      guild_id: this.interaction.guildId,
    }).validateUser(id);
    const level = user.Level + 1;
    const levelUp =
      (5 / 6) * level * (2 * level ** 2 + 27 * level + 91) -
      (minusXP ? user.XP : 0);
    return levelUp;
  }

  async generateDisplay(id: string) {
    const user = await new guildDatabases({
      guild_id: this.interaction.guildId,
    }).validateUser(id);

    const guild = await new guildDatabases({
      guild_id: this.interaction.guildId,
    }).find();
    const level = await this.calculateLevel(undefined, id);

    const discordUser = await this.client.users.fetch(id);
    const xpRoles = guild.XPRoles as Roles[];
    const userRoles: Roles[] = [];

    const filledSteps = Math.round((user.XP / level) * 20);
    const emptySteps = 20 - filledSteps;
    const displayBar = "▰".repeat(filledSteps) + "▱".repeat(emptySteps);

    for (let i = 0; xpRoles.length > i; i++) {
      await this.interaction.guild?.members.fetch(id).then((member) => {
        const getUserRoles = member.roles.cache.get(xpRoles[i].role);

        if (getUserRoles && getUserRoles.id === xpRoles[i].role) {
          userRoles.push(xpRoles[i]);
          userRoles.sort((a, b) => b.level - a.level);
        }
      });
    }

    const Embed = new BEmbed()
      .setTitle(
        `${discordUser.globalName ?? discordUser.username} [Lv.${
          user.Level
        }] **#${
          guild.Users.findIndex((e) => e.userId === this.interaction.user.id) +
          1
        }**`
      )
      .setDescription(
        `
        [${user.XP.toLocaleString()}/${level.toLocaleString()} XP] ${
          userRoles[0] ? `<@&${userRoles[0].role}>` : "Sem cargo"
        }
        ${displayBar} ${Math.floor((user.XP / level) * 100)}%
        `
      )
      .setColor("NotQuiteBlack")
      .setThumbnail(discordUser.avatarURL());

    return Embed;
  }
}

export class XPRank extends Interação {
  constructor(options: {
    client: AstraLuna;
    interaction: ChatInputCommandInteraction;
  }) {
    super({ client: options.client, interaction: options.interaction });
    this.interaction = options.interaction;
  }

  async calculateLevel(minusXP: true | undefined = undefined, id: string) {
    const user = await new guildDatabases({
      guild_id: this.interaction.guildId,
    }).validateUser(id);
    const level = user.Level + 1;
    const levelUp =
      (5 / 6) * level * (2 * level ** 2 + 27 * level + 91) -
      (minusXP ? user.XP : 0);
    return levelUp;
  }

  async generatePage(id: string) {
    const guild = await new guildDatabases({
      guild_id: this.interaction.guildId,
    }).sort(-1);
    const Users = guild.Users as IUser[];
    const xpRoles = guild.XPRoles as Roles[];
    const userRoles: Roles[] = [];

    const pageInformation = this.client.xpRankingPages.get(`${id}_rankingPage`);

    const usersPerPage = Users.slice(
      (pageInformation?.usrIndex ?? 0) - 5,
      pageInformation?.usrIndex ?? 0 + 5
    );

    const Embed = new BEmbed()
      .setTitle(this.interaction.guild?.name ?? "Sem nome")
      .setColor("NotQuiteBlack")
      .setThumbnail(this.interaction.guild?.iconURL() ?? null)
      .setFooter({
        text: ` Você está na posição #${
          guild.Users.findIndex((e) => e.userId === this.interaction.user.id) +
          1
        } │ Página ${pageInformation ? pageInformation?.usrIndex / 5 : 0} `,
      });

    for (const user of usersPerPage) {
      const member = await this.interaction.guild?.members
        .fetch(user.userId)
        .catch(() =>
          console.log(
            "[ASTRA LUNA] -> GuildMember#fetch() falhou, ignorando membro..."
          )
        );
      if (member) {
        for (const roles of xpRoles) {
          if (user.Level && roles.level && user.Level >= roles.level)
            userRoles.push(roles);
        }
      }

      const levelUp = await this.calculateLevel(undefined, user.userId);
      const discordUser = await this.client.users.fetch(user.userId);
      userRoles.sort((a, b) => b.level - a.level);
      Embed.addFields({
        name:
          discordUser.id === this.interaction.user.id
            ? `${discordUser.globalName ?? discordUser.username} <-- Você 🎉`
            : discordUser.globalName ?? discordUser.username,
        value: `├ [Lv.${user.Level}]
        ├ [${user.XP.toLocaleString()} / ${Math.floor(
          levelUp
        ).toLocaleString()}]
        └ ${userRoles[0] ? `<@&${userRoles[0].role}>` : "Sem cargo"}
        `,
      });
    }
    return Embed;
  }
}
