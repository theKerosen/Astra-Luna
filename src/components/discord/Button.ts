import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentEmojiResolvable,
} from "discord.js";

export class BButton extends ActionRowBuilder<ButtonBuilder> {
  private button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder();
  }

  addButton(ButtonStuff: {
    customId: string;
    label?: string;
    style?: ButtonStyle;
    disabled?: boolean;
    emoji?: ComponentEmojiResolvable;
  }) {
    this.button
      .setCustomId(ButtonStuff?.customId)
      .setDisabled(ButtonStuff?.disabled ?? false)
      .setLabel(ButtonStuff?.label ?? "\u200b")
      .setStyle(ButtonStuff.style ?? ButtonStyle.Primary);
    if (ButtonStuff.emoji) this.button.setEmoji(ButtonStuff.emoji);
    return super.addComponents(this.button);
  }
}
