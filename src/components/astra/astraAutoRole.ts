import { GuildMember } from "discord.js";
import { AstraLuna } from "../../client";
import { GuildDatabases } from "./astraDBManager";

export class AutoRole extends AstraLuna {
  db: GuildDatabases | null = null;

  setDB(guild_id: string) {
    this.db = new GuildDatabases({ guild_id: guild_id });
  }
  async addRole(member: GuildMember | undefined) {
    if (!member) return;
    this.setDB(member.guild.id);

    if (!this.db) return;

    const database = await this.db.find();
    const roleId = database.get("settings.autorole_settings.role_id");
    const role = member.guild.roles.cache.get(roleId);

    if (!role) return;
    member.roles.add(role);
  }
}
