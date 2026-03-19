import Settings from '../models/settings.model';
import { ISettings } from '../models/types';

export const getSettings = async (): Promise<ISettings> => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings({});
    await settings.save();
  }
  return settings;
};

export const updateSettings = async (data: Partial<ISettings>): Promise<ISettings> => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings(data);
  } else {
    Object.assign(settings, data);
  }
  return await settings.save();
};
