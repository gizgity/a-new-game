/** Presentation budgets only; no gameplay clocks or RNG. 2 frame slots reserved for danger. */
export const AUDIO = { voiceCap: 8, perFrame: 5, regularPerFrame: 3, combatGain: 0.4, bufferPeak: 0.22, rootHistory: 512, trebleCutoff: 1800, impactBody: 0.055, regularBody: 0.018 } as const;
export function cuePolicy(cue: string): { priority: number; cooldown: number } {
  switch (cue) {
    case 'arrival': return { priority: 5, cooldown: 0 };
    case 'hurt': return { priority: 4, cooldown: 85 };
    case 'boss': case 'defeat': return { priority: 4, cooldown: 200 };
    case 'heavy': case 'chargedBlast': case 'detonate': return { priority: 3, cooldown: 140 };
    case 'perfect': return { priority: 3, cooldown: 100 };
    case 'light3': case 'chargedGun': return { priority: 3, cooldown: 90 };
    case 'chain': return { priority: 1, cooldown: 85 };
    case 'stack1': case 'stack2': case 'stack3': return { priority: 1, cooldown: 70 };
    case 'charge': return { priority: 1, cooldown: 0 };
    case 'shotHit': return { priority: 2, cooldown: 55 };
    case 'gun': return { priority: 2, cooldown: 100 };
    case 'dash': return { priority: 2, cooldown: 80 };
    case 'heavySwing': return { priority: 2, cooldown: 160 };
    case 'light': case 'swing': return { priority: 2, cooldown: 60 };
    case 'light2': case 'swing2': return { priority: 2, cooldown: 75 };
    case 'swing3': case 'chargedHit': return { priority: 2, cooldown: 95 };
    default: return { priority: 0, cooldown: 120 };
  }
}
