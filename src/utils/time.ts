import moment from "moment";

/**
 * Relative time in Nepali. moment's own locale data would render Devanagari
 * numerals inconsistently across platforms, so the few buckets a news feed
 * actually needs are spelled out here.
 */
export function relativeTime(createdOn?: string): string {
  if (!createdOn) {
    return "";
  }

  const then = moment(createdOn);
  if (!then.isValid()) {
    return "";
  }

  const minutes = moment().diff(then, "minutes");

  if (minutes < 1) {
    return "भर्खरै";
  }
  if (minutes < 60) {
    return `${minutes} मिनेट अघि`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} घण्टा अघि`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} दिन अघि`;
  }

  return then.format("YYYY-MM-DD");
}
