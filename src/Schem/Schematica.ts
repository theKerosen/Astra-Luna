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
const saveGiveaways = new Schema({
  userId: String,
  gaveItem: Array,
  Winner: String,
});
const Giveaway = model("GiveAways", saveGiveaways);
export { WPSDB, Channels, Giveaway };
