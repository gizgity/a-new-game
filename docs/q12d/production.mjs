// Production only. score.mjs (including its prototype presets) stays immutable.
export const REVISION = 'Phase B production 1';
export const presets = {
 bass:{gain:.245,attack:.004,decay:.075,sustain:.60,release:.025,cutoff:780,highpass:32},
 riff:{gain:.105,attack:.003,decay:.045,sustain:.46,release:.018,cutoff:1950,highpass:175},
 pad:{gain:.030,attack:.035,decay:.12,sustain:.5,release:.055,cutoff:850,highpass:220},
 stab:{gain:.078,attack:.004,decay:.050,sustain:.38,release:.025,cutoff:1650,highpass:240},
 lead:{gain:.125,attack:.004,decay:.065,sustain:.62,release:.045,cutoff:2350,highpass:240},
 bell:{gain:.062,attack:.003,decay:.045,sustain:.3,release:.035,cutoff:1650,highpass:350},
 kick:{gain:.36,attack:.0015,decay:.13,sustain:0,release:.02,cutoff:2400,highpass:28},
 snare:{gain:.28,attack:.002,decay:.105,sustain:0,release:.025,cutoff:3400,highpass:130},
 hat:{gain:.022,attack:.0015,decay:.024,sustain:0,release:.012,cutoff:6200,highpass:4500},
};
// One fixed gain for ALL pieces and combinations; never normalize stems.
export const outputGain=.85;
