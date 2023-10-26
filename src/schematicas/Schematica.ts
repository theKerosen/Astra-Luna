import { Schema, model } from "mongoose";

const guildStuff = new Schema({
  GuildId: String,
  userId: String,
  maxWarnLevels: {
    type: Number,
    default: 4
  },
  perWarnPunishment: [
    {
      warnLevel: Number,
      punishmentType: Number,
    }
  ],
  xpAlertConfig: {
    message: {
      type: String,
      default: "O usuário {@user} avançou para o nível {@level}!",
    },
  },
  Users: [
    {
      userId: String,
      XP: Number,
      Level: Number,
      cooldown: Date,
      warnlevel: Number,
    },
  ],

  channels: {
    suggestions: String,
    reports: String,
    updatesCS: String,
    csStatus: String,
    feedbacks: String,
    xpAlerts: String,
  },
  defaultMentionRole: String,
  toggleCommands: Array,
  XPRoles: [
    {
      role: String,
      level: Number,
    },
  ],
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

export { defaultGuildConfig, RepSchem, shadowBanSchema };
