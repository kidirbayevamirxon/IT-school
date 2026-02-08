export const cn = (...a: Array<string | false | undefined | null>) =>
  a.filter(Boolean).join(" ");