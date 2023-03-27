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

const warnChannel = new Schema({
  GuildId: String,
  GuildName: String,
  BlogChannelId: String,
  NotifyRoleId: String,
});
const Channels = model("NotifyChannel", warnChannel);
export { WPSDB, Channels };
