import {
  APIEmbed,
  EmbedBuilder,
  isJSONEncodable,
  JSONEncodable,
} from "discord.js";
export class BEmbed extends EmbedBuilder {
  static from(other: JSONEncodable<APIEmbed> | APIEmbed) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}
