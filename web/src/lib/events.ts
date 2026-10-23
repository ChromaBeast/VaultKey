export const CREATE_SECRET_EVENT = 'vk_create_secret';

export const CMD_OPEN_EVENT = 'vk_cmd_open';

export const openCommandPalette = () => {
  window.dispatchEvent(new CustomEvent(CMD_OPEN_EVENT));
};
