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

const guildStuff = new Schema({
  GuildId: String,
  userId: String,
  Users: Array,
  XP: Number,
  Level: Number,
  cooldown: Number,
  channels: {
    suggestions: String,
    reports: String,
    updatesCS: String,
    csStatus: String,
    feedbacks: String,
  },
  defaultMentionRole: String,
  toggleCommands: Array,
  XPRoles: Array,
});

const defaultGuildConfig = model("guildStuff", guildStuff);

const Rep = new Schema({
  UserId: String,
  createdAt: Date,
  isPositive: {
    type: Boolean,
    default: false,
  },
  Comments: Object,
  goodRep: {
    type: Number,
    default: 0,
  },
  badRep: {
    type: Number,
    default: 0,
  },
});
const RepSchem = model("Rep", Rep);

const shadowBan = new Schema({
  userId: String,
  GuildId: String,
});

const shadowBanSchema = model("blacklist", shadowBan);

export { WPSDB, defaultGuildConfig, RepSchem, shadowBanSchema };
