import {
  ButtonBuilder,
  ActionRowBuilder,
  APIButtonComponent,
  ButtonComponentData,
  ButtonStyle,
  ComponentEmojiResolvable,
} from "discord.js";

class ButtonBuilding extends ButtonBuilder {
  constructor(
    data?: Partial<ButtonComponentData> | Partial<APIButtonComponent>
  ) {
    super(data);
  }
}
export class BButton extends ActionRowBuilder<ButtonBuilder> {
  constructor(
    data?: Partial<ButtonComponentData> | Partial<APIButtonComponent>
  ) {
    super(data);
  }
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
