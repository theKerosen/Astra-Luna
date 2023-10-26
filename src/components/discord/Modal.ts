import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  APITextInputComponent,
  Equatable,
  JSONEncodable,
} from "discord.js";

export class TextInputBuilding
  extends TextInputBuilder
  implements
    Equatable<APITextInputComponent | JSONEncodable<APITextInputComponent>>
{
  setInput(Input: {
    custom_id: string;
    label: string;
    style: TextInputStyle;
    placeholder?: string;
    min_length?: number;
    max_length?: number;
    required?: boolean;
  }) {
    return super
      .setCustomId(Input.custom_id)
      .setLabel(Input.label)
      .setStyle(Input.style)
      .setMinLength(Input.min_length ?? 1)
      .setMaxLength(Input.max_length ?? 250)
      .setPlaceholder(Input.placeholder ?? "...")
      .setRequired(Input.required);
  }
}
export class ActionAdd extends ActionRowBuilder<TextInputBuilder> {}
export class ModalBuilding extends ModalBuilder {
  addText(Modal: {
    custom_id: string;
    label: string;
    style: TextInputStyle;
    placeholder?: string;
    min_length?: number;
    max_length?: number;
    required?: boolean;
  }) {
    return super.addComponents(
      new ActionAdd().addComponents(
        new TextInputBuilding().setInput({
          custom_id: Modal.custom_id,
          label: Modal.label,
          style: Modal.style,
          placeholder: Modal.placeholder,
          min_length: Modal.min_length,
          max_length: Modal.max_length,
          required: Modal.required,
        })
      )
    );
  }
}
export class BModal extends ActionRowBuilder<ModalActionRowComponentBuilder> {
  createModal(Modal: { custom_id: string; title: string }) {
    return new ModalBuilding()
      .setCustomId(Modal.custom_id)
      .setTitle(Modal.title);
  }
}
