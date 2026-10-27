/** Presentation only. Combat radius, duration, cooldown and damage stay in anomalies.ts. */
export const ANOMALY_VFX = {
  texture: 'anomaly-vfx', poolCap: 96, segments: 16,
  stroke: 3.2, underStroke: 5.5, bracketSize: 15, bracketGap: 9,
  glyphSize: 15, imminentFraction: 0.35,
  groundDepth: 0.96, feedbackDepth: 1.16, projectileDepth: 1.55,
  feedbackDuration: 0.32, sealDuration: 0.24,
  source: 0xedf7f5, prepare: 0xff6f87, imminent: 0xffe599, edge: 0x090d19, relay: 0xc399ff,
} as const;
export const ANOMALY_FRAMES = {
  stormRune: 'stormRune', stormBolt: 'stormBolt', groundCracks: 'groundCracks', groundBurst: 'groundBurst',
  bloodCrescent: 'bloodCrescent', energy: 'energy', pursuit: 'pursuit', staticArc: 'staticArc',
  forkShot: 'forkShot', sealBreak: 'sealBreak', resistance: 'resistance', relay: 'relay',
  echoArcs: 'echoArcs', bracket: 'bracket', sparks: 'sparks', echoRune: 'echoRune',
} as const;
