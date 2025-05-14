import {DateTime, Duration, DurationObjectUnits} from 'luxon';

export const getTimeDuration = (time: string): string => {
  const createdAt = DateTime.fromISO(time);

  const now = DateTime.utc();

  const diff: Duration = now.diff(createdAt, [
    'years',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
  ]);

  function formatDiff(duration: Duration): string {
    const diffObject: DurationObjectUnits = duration.toObject();

    if (diffObject.years && diffObject.years > 0) {
      return `${diffObject.years}y`;
    }
    if (diffObject.months && diffObject.months > 0) {
      return `${diffObject.months}m`;
    }
    if (diffObject.weeks && diffObject.weeks > 0) {
      return `${diffObject.weeks}w`;
    }
    if (diffObject.days && diffObject.days > 0) {
      return `${diffObject.days}d`;
    }
    if (diffObject.hours && diffObject.hours > 0) {
      return `${diffObject.hours}h`;
    }
    if (diffObject.minutes && Math.floor(diffObject.minutes) > 0) {
      return `${Math.floor(diffObject.minutes)}min`;
    }
    if (diffObject.seconds && Math.floor(diffObject.seconds) > 0) {
      return `${Math.floor(diffObject.seconds)}s`;
    }
    return 'just now';
  }

  return formatDiff(diff);
};
