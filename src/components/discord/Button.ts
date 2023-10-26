import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentEmojiResolvable,
} from "discord.js";

class ButtonBuilding extends ButtonBuilder { }

export class BButton extends ActionRowBuilder<ButtonBuilder> {
  addButton(ButtonStuff: {
    customId: string;
    label?: string;
    style?: ButtonStyle;
    disabled?: boolean;
    emoji?: ComponentEmojiResolvable;
  }) {
    const Button = new ButtonBuilding()
      .setCustomId(ButtonStuff?.customId)
      .setDisabled(ButtonStuff?.disabled ?? false)
      .setLabel(ButtonStuff?.label ?? "​")
      .setStyle(ButtonStuff.style ?? ButtonStyle.Primary);
    if (ButtonStuff.emoji) Button.setEmoji(ButtonStuff.emoji);
    return super.addComponents(Button);
  }
}
