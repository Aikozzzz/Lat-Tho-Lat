export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export function getProgress(raised: number, goal: number) {
  return Math.min(100, Math.round((raised / goal) * 100));
}
