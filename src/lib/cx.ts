/** Une clases condicionales: `cx("btn", primary && "btn-primary")`. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
