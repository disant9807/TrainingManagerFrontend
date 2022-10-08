import * as languages from '@/localization'
import _Vue from 'vue'

export type localizationGroups =
  'trainingProgramm' | 'validation';

type localizationDictionary = {
  [key: string]: any;
};

export class Localization {
  private static readonly language = 'ru';

  static localize (key: string, group: localizationGroups): string {
    const localizationGroup: { [key: string]: any } = languages[Localization.language][group]

    return key.includes('.')
      ? Localization.getLocalizationByObjectKey(key, localizationGroup)
      : localizationGroup[key]
  }

  private static getLocalizationByObjectKey (key: string, localizationGroup: { [key: string]: any }) {
    const keyParts = key.split('.')
    return this.reduce(keyParts, localizationGroup)
  }

  private static reduce (keyParts: string[], localizationGroup: localizationDictionary): localizationDictionary | any {
    if (keyParts.length > 1) {
      const key = keyParts.pop() || ''
      const dictionary = this.reduce(keyParts, localizationGroup)
      return dictionary[key]
    }
    return localizationGroup[keyParts[0]]
  }
}

export default function localizePlugin (Vue: typeof _Vue): void {
  Vue.prototype.$localize = Localization.localize
}
