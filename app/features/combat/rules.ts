import type { Fighter, Skill } from "./types";
/** Presentation-only preview. A production combat outcome must come from the server. */
export function previewAction(
  skill: Skill | undefined,
  target: Fighter | undefined,
) {
  const combo = !!skill?.consumes && skill.consumes === target?.state;
  return {
    combo: combo ? skill?.combo : undefined,
    damage: (skill?.damage ?? 0) * (combo && skill?.id === "lightning" ? 2 : 1),
    resonance: combo ? 20 : 0,
  };
}
export function validTarget(
  skill: Skill | undefined,
  target: Fighter | undefined,
  isAlly: boolean,
) {
  if (!skill || !target || target.hp <= 0) return false;
  if (skill.target === "self") return target.id === "p1";
  if (skill.target === "ally") return isAlly && target.id !== "p1";
  return !isAlly;
}
