export const asset = (name: string, frame = "271-15607", extension = "svg") =>
  `/combat/${frame}-${name}.${extension}`;
export const rankNames = ["back rank", "mid rank", "front rank"];

export function stateIcon(state: string) {
  const index = [
    "Off-balance",
    "Soaked",
    "Burning",
    "Stunned",
    "Marked",
    "Blinded",
  ].indexOf(state);
  return asset(`imgPillGlyph${index > 0 ? index : ""}`, "271-19260");
}
