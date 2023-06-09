import { Schema, model } from "mongoose";

const WPScanner = new Schema({
  Name: { type: String, default: "CSGO-Blog-Scanner" },
  LastId: {
    type: Number,
    default: 0,
  },
  LastPostId: {
    type: Number,
    default: 0,
  },
});
const WPSDB = model("WordPressScan", WPScanner);

const Guilds = new Schema({
  GuildId: String,
  BlogChannelId: String,
  NotifyRoleId: String,
  RolesNXP: Array,
  ToggleCommands: Array,
  suggestionChannelId: String,
});
const Channels = model("Guilds", Guilds);

const XPSchema = new Schema({
  GuildId: String,
  userId: String,
  Users: Array,
  XP: Number,
  Level: Number,
  cooldown: Number,
});

const XP = model("XP", XPSchema);
export { WPSDB, XP, Channels };
