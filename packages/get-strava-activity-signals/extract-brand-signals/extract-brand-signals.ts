import { Input } from './types';

/**
 * Extracts brand signals from the Strava activity data.
 * @param {Input} input - Strava activity data containing gear information.
 * @returns {string[] | undefined} Array of brand signals derived from gear name and nickname, or undefined if no valid brands found.
 */
const extractBrandSignals = ({ gear }: Input): string[] | undefined => {
  const brands: string[] = [];
  const gearName = gear?.name ?? '';
  const gearNickname = gear?.nickname ?? '';
  const gearSignal = gearName || gearNickname ? `${gearName} ${gearNickname}`.trim() : undefined;

  if (gearSignal) {
    brands.push(gearSignal);
  }

  return brands.length > 0 ? brands : undefined;
};

export default extractBrandSignals;
