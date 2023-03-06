export function ConvertNumberToCommaString(num: number | string | undefined) {
  if (num) {
    return num.toLocaleString("en-US");
  } else {
    return "0";
  }
}
