/** Create a hash code from a string */
export const hash = (from: string) =>
  (
    from.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0) >>> 0
  ).toString();
