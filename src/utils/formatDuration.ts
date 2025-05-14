function formatDuration(durationInSeconds: number): string {
  const hours: number = Math.floor(durationInSeconds / 3600);
  const minutes: number = Math.floor((durationInSeconds % 3600) / 60);
  const seconds: number = Math.floor(durationInSeconds % 60);

  const formattedHours: string = hours.toString().padStart(2, '0');
  const formattedMinutes: string = minutes.toString().padStart(2, '0');
  const formattedSeconds: string = seconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export {formatDuration};
