/**
 * Calculates pace in seconds per kilometer from moving time and distance.
 * @param {number} movingTime - Moving time in seconds.
 * @param {number} distance - Distance in meters.
 * @returns {number} Pace in seconds per kilometer.
 */
const getPaceSecondsPerKm = (movingTime: number, distance: number): number => {
  if (movingTime <= 0 || distance <= 0) {
    return 0;
  } else {
    return movingTime / (distance / 1000);
  }
};

export default getPaceSecondsPerKm;
