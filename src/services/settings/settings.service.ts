import Settings from '../../models/settings/settings.model';
import { ISettings } from '../../models/settings/types';
import { SettingsUpdateDTO } from './types';

export const getSettings = async (): Promise<ISettings> => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings({});
    await settings.save();
  }
  return settings;
};

export const updateSettings = async (data: SettingsUpdateDTO): Promise<ISettings> => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings(data);
  } else {
    Object.assign(settings, data);
  }
  return await settings.save();
};
