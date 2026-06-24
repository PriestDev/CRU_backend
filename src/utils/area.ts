const ABUJA_CAMPUS_MATCHER = /\babuja\b/i;

export const isAbujaCampusLocation = (location: unknown): boolean => {
  if (!location || typeof location !== 'string') return false;
  return ABUJA_CAMPUS_MATCHER.test(location.trim().toLowerCase());
};

export const validateAbujaCampusRoute = (locations: Array<unknown>) => {
  return locations.every((location) => isAbujaCampusLocation(location));
};
