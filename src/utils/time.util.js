export function timeToSeconds(time) {
  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds;
}