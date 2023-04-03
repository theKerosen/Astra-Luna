import {
  ButtonBuilder,
  ActionRowBuilder,
  APIButtonComponent,
  ButtonComponentData,
  ButtonStyle,
  ComponentEmojiResolvable,
} from "discord.js";

export class ButtonBuilding extends ButtonBuilder {
  constructor(
    data?: Partial<ButtonComponentData> | Partial<APIButtonComponent>
  ) {
    super(data);
  }
  setButton(
    customId: string,
    Label: string,
    Style?: ButtonStyle,
    Emoji?: ComponentEmojiResolvable,
    Disabled?: boolean | false
  ) {
    super
      .setCustomId(customId)
      .setDisabled(Disabled)
      .setEmoji(Emoji ?? "")
      .setLabel(Label)
      .setStyle(Style ?? ButtonStyle.Primary);
  }
}
export class BButton extends ActionRowBuilder<ButtonBuilder> {
  constructor(
    data?: Partial<ButtonComponentData> | Partial<APIButtonComponent>
  ) {
    super(data);
  }
  addButton(
    customId: string,
    Label: string,
    Style?: ButtonStyle,
    Disabled?: boolean | false
  ) {
    return super.addComponents(
      new ButtonBuilding()
        .setCustomId(customId)
        .setDisabled(Disabled)
        .setLabel(Label)
        .setStyle(Style ?? ButtonStyle.Primary)
    );
  }
}
