import { Schema, model } from "mongoose";

const guildStuff = new Schema({
  guild_id: String,

  guild_users: [
    {
      user_id: String,
      banned: Boolean,
      xp: {
        user_xp: {
          type: Number,
          default: 0,
        },
        level: {
          type: Number,
          default: 0,
        },
        cooldown: Date,
      },
      warn: {
        warn_count: Number,
      },
      reputation: {
        bad_reps: {
          type: Number,
          default: 0,
        },
        good_reps: {
          type: Number,
          default: 0,
        },
        comments: {
          user_id: String,
          comment: String,
          created_at: Date,
          positive: Boolean,
        },
      },
    },
  ],

  settings: {
    autorole_settings: {
      role_id: String,
    },

    warn_settings: {
      warn_rules: [
        {
          warn_level: Number,
          punishment_type: Number,
        },
      ],
      max_warn_level: {
        type: Number,
        default: 4,
      },
    },

    xp_settings: {
      xp_roles: [
        {
          role: String,
          level: Number,
        },
      ],
    },

    notification_settings: {
      astra_suggestions: String,
      astra_reports: String,
      astra_feedbacks: String,
      counterstrike_updates: String,
      counterstrike_status: String,
      notification_roles: {
        counterstrike_id: String,
      },
    },
  },
});

const GuildCollection = model("guild", guildStuff);

export { GuildCollection };
