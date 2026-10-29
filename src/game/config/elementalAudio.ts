/** Q12C presentation tuning only. Mono synthesis, seconds/Hz; no combat config. */
export const ELEMENTAL_AUDIO = { secondaryPerRoot: 2, rootHistory: 512, familyCooldown: 90, secondaryCooldown: 35, secondaryGain: 0.32, primaryGain: 0.68, peak: 0.22 } as const;
// frequency, duration, end/start pitch, noise mix, FM index, filter cutoff
export const ELEMENTAL_TONES = {
  ignite: [380, .12, 2.1, .35, 1, 1900], wildfire: [620, .14, .6, .8, 2, 1600], furnace: [120, .23, .35, .35, 2, 1200],
  soaked: [420, .18, .55, .1, .2, 850], undertow: [540, .20, .25, .3, .3, 1000], flowState: [720, .22, 1.25, 0, .4, 2400],
  staticCharge: [1450, .045, 1.2, .1, 2, 3200], discharge: [920, .075, .3, .45, 4, 2800], arcRelay: [1350, .065, .75, .15, 3, 2700], overclock: [360, .24, 2.8, 0, 1, 2200],
  frostbite: [1150, .15, 1.05, 0, 2.7, 3200], shatter: [780, .14, .7, .18, 5, 3400], brittle: [470, .085, .4, .45, 3, 2300], crystalEcho: [1580, .18, .95, 0, 2, 3000],
  shadowMark: [260, .18, .55, .25, 1.4, 900], ambush: [185, .11, .5, .15, 2.2, 1300], nightfall: [280, .23, .65, .1, 1.7, 1100], veilstep: [330, .14, .5, .85, .2, 800],
  momentum: [580, .1, 1.2, .7, .1, 1700], windSlash: [1000, .16, .35, .95, .1, 2400], tailwind: [680, .13, 1.3, .45, .2, 1600], cyclone: [650, .23, .65, .9, .3, 2100],
} as const;
export type ElementalCue = keyof typeof ELEMENTAL_TONES;
export const elementalFamily = (cue: ElementalCue): string => {
  const index = Object.keys(ELEMENTAL_TONES).indexOf(cue);
  return index < 3 ? 'fire' : index < 6 ? 'water' : index < 10 ? 'lightning' : index < 14 ? 'ice' : index < 18 ? 'shadow' : 'wind';
};
