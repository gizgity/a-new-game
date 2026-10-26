import type Phaser from 'phaser';
import type { Enemy } from './combat';
import { artDirection } from './ActorPose';

export const ACTOR_TEXTURE = 'occult-actors';
export type ActorKind = 'player' | Enemy['kind'];
export const ART_SIZE = { player: 40, grunt: 36, archer: 38, volatile: 36, bulwark: 50, boss: 76 } as const;

export function preloadActorArt(scene: Phaser.Scene): void {
  const base = `${import.meta.env.BASE_URL}assets/actors/`;
  scene.load.atlas(ACTOR_TEXTURE, `${base}occult-actors.png`, `${base}occult-actors.json`);
}

export function actorFrame(kind: ActorKind, angle: number, pose: string): string {
  return `${kind}/${artDirection(angle)}/${pose}`;
}
