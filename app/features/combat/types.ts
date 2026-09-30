export type Phase = "intent" | "planning" | "locked" | "resolution";
export type SkillId =
  "wave" | "lightning" | "fireball" | "arcane" | "defend" | "swap";
export interface Fighter {
  id: string;
  name: string;
  role: string;
  rank: number;
  hp: number;
  maxHp: number;
  speed: number;
  sprite: string;
  state?: string;
  intent?: string;
  threat?: string;
}
export interface Skill {
  id: SkillId;
  name: string;
  glyph: string;
  speed: number;
  tone: string;
  target: "enemy" | "ally" | "self";
  sets?: string;
  consumes?: string;
  combo?: string;
  damage: number;
}
export interface Combo {
  name: string;
  state: string;
  setter: string;
  consumer: string;
  effect: string;
  found: string;
  role: string;
  secret?: boolean;
  unknown?: boolean;
}

export interface CombatEvent {
  actor: string;
  action: string;
  effect: string;
  speed: number;
}
export interface ActionPreview {
  combo: string | undefined;
  damage: number;
  resonance: number;
}
