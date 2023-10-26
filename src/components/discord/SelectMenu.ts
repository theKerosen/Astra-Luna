import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  APISelectMenuOption,
  ChannelSelectMenuBuilder,
  UserSelectMenuBuilder,
  RoleSelectMenuBuilder,
} from "discord.js";

export class StringMenuBuilding extends StringSelectMenuBuilder {

  createStringMenu(StringMenu: {
    customId: string;
    placeholder: string;
    disabled?: boolean;
  }) {
    return super
      .setCustomId(StringMenu.customId)
      .setPlaceholder(StringMenu.placeholder)
      .setDisabled(StringMenu.disabled ?? false);
  }
  setOptions(Options: APISelectMenuOption[]) {
    return super.addOptions(Options);
  }
  MaxValues(value: number) {
    return super.setMaxValues(value);
  }
  MinValues(value: number) {
    return super.setMinValues(value);
  }
}

export class UserMenuBuilding extends UserSelectMenuBuilder {

  UserMenu(User: {
    customId: string;
    placeholder: string;
    disabled?: boolean;
  }) {
    return super
      .setCustomId(User.customId)
      .setPlaceholder(User.placeholder)
      .setDisabled(User.disabled ?? false);
  }
  MaxValues(value: number) {
    return super.setMaxValues(value);
  }
  MinValues(value: number) {
    return super.setMinValues(value);
  }
}

export class RoleMenuBuilding extends RoleSelectMenuBuilder {

  createRoleMenu(Role: {
    customId: string;
    placeholder: string;
    disabled?: boolean;
  }) {
    return super
      .setCustomId(Role.customId)
      .setPlaceholder(Role.placeholder)
      .setDisabled(Role.disabled ?? false);
  }
  MaxValues(value: number) {
    return super.setMaxValues(value);
  }
  MinValues(value: number) {
    return super.setMinValues(value);
  }
}

export class ChannelMenuBuilding extends ChannelSelectMenuBuilder {

  createChannelMenu(ChannelMenu: {
    customId: string;
    placeholder: string;
    disabled?: boolean;
  }) {
    return super
      .setCustomId(ChannelMenu.customId)
      .setPlaceholder(ChannelMenu.placeholder)
      .setDisabled(ChannelMenu.disabled ?? false);
  }
  MaxValues(value?: number) {
    return super.setMaxValues(value ?? 5);
  }
  MinValues(value?: number) {
    return super.setMinValues(value ?? 1);
  }
}

export class BStringMenu extends ActionRowBuilder<StringMenuBuilding> {

  createStringMenu(StringMenu: {
    custom_id: string;
    placeholder: string;
    disabled?: boolean;
  }) {
    return super.addComponents(
      new StringMenuBuilding()
        .setCustomId(StringMenu.custom_id)
        .setPlaceholder(StringMenu.placeholder ?? "...")
        .setDisabled(StringMenu.disabled ?? false)
    );
  }
  setOptions(Options: APISelectMenuOption[]) {
    return super.setComponents(this.components[0].setOptions(Options));
  }
  MaxValues(value?: number) {
    return super.setComponents(this.components[0].setMaxValues(value ?? 5));
  }
  MinValues(value?: number) {
    return super.setComponents(this.components[0].setMinValues(value ?? 1));
  }
}

export class BChannelMenu extends ActionRowBuilder<ChannelMenuBuilding> {

  createChannelMenu(ChannelMenu: {
    customId: string;
    placeholder: string;
    disabled?: boolean;
  }) {
    return super.addComponents(
      new ChannelMenuBuilding()
        .setCustomId(ChannelMenu.customId)
        .setPlaceholder(ChannelMenu.placeholder ?? "...")
        .setDisabled(ChannelMenu.disabled ?? false)
    );
  }
  MaxValues(value?: number) {
    return super.setComponents(this.components[0].setMaxValues(value ?? 5));
  }
  MinValues(value?: number) {
    return super.setComponents(this.components[0].setMinValues(value ?? 1));
  }
}

export class BUserMenu extends ActionRowBuilder<UserMenuBuilding> {

  createChannelMenu(UserMenu: {
    customId: string;
    placeholder: string;
    disabled?: boolean;
  }) {
    return super.addComponents(
      new UserMenuBuilding()
        .setCustomId(UserMenu.customId)
        .setPlaceholder(UserMenu.placeholder ?? "...")
        .setDisabled(UserMenu.disabled ?? false)
    );
  }
  MaxValues(value?: number) {
    return super.setComponents(this.components[0].setMaxValues(value ?? 5));
  }
  MinValues(value?: number) {
    return super.setComponents(this.components[0].setMinValues(value ?? 1));
  }
}
export class BRoleMenu extends ActionRowBuilder<RoleMenuBuilding> {
  createRoleMenu(ChannelMenu: {
    customId: string;
    placeholder: string;
    disabled?: boolean;
  }) {
    return super.addComponents(
      new RoleMenuBuilding()
        .setCustomId(ChannelMenu.customId)
        .setPlaceholder(ChannelMenu.placeholder ?? "...")
        .setDisabled(ChannelMenu.disabled ?? false)
    );
  }
  MaxValues(value?: number) {
    return super.setComponents(this.components[0].setMaxValues(value ?? 5));
  }
  MinValues(value?: number) {
    return super.setComponents(this.components[0].setMinValues(value ?? 1));
  }
}
