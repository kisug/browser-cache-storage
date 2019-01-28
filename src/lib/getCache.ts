import {CACHE_KEYS} from '../constants/caches';
import {DAY} from '../constants/times';
import {TIdentifyKey, TStorageName} from '../types';

const getCache = (storageName: TStorageName) =>
  function get(identifyKey: TIdentifyKey, key: string, preserveTime = DAY) {
    if (typeof window !== 'undefined') {
      try {
        const storage = window[storageName];
        const parsed = JSON.parse(storage.getItem(key) || '{}');

        if (Object.keys(parsed).every(eachKey => CACHE_KEYS.indexOf(eachKey) !== -1)) {
          if (parsed.identifyKey !== identifyKey || parsed.cachedAt + preserveTime < new Date().getTime()) {
            storage.removeItem(key);

            return null;
          }

          return parsed.data;
        }
      } catch (err) {
        return null;
      }
    }

    return null;
  };

export default getCache;
