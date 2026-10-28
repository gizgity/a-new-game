import { t, type TranslationKey } from '../i18n';
import { challenges, type RunSummary } from '../game/collection';
import { SIGILS, BRANCHES, ANOMALIES, LEGACY_IDS, type LegacyId, type BranchId, type SigilId, type AnomalyId } from '../game/config/legacy';
import { ascensionAvailable } from '../game/ascension';
import type { Profile } from '../game/progression';
const tr = (key: string) => t(key as TranslationKey);
const name = (id: LegacyId) => tr(`legacy_${id}`);
export function summaryMarkup(r: RunSummary): string {
  return `<article class="collection-item"><strong>${new Date(r.at).toLocaleString(document.documentElement.lang)} · ${t(r.result)}</strong><p>${t('sealBadge').replace('{n}',String(r.seal))} · ${r.duration}s · ${t('qKills')}: ${r.kills} · ${t('bossName')}: ${t(r.boss?'qBossWon':'qBossNotWon')}</p><p>${t('qBuild')}: ${r.legacy ? name(r.legacy.sigil)+' / '+(r.legacy.branch?name(r.legacy.branch):t('legacyCore')):t('qNone')} · ${r.anomaly?name(r.anomaly):t('qNone')}</p><p>${[...r.mutations,...r.curses].map(id=>t(id)).join(' · ') || t('qNone')}</p><p>${t('victoryRewards')}: ${r.rewards.map(name).join(' · ')||t('qNone')}</p></article>`;
}
export function renderCodex(profile: Profile, category: string): string {
  const owned=profile.legacy.unlocks;
  const group=(id:LegacyId)=>SIGILS.includes(id as SigilId)?'sigils':ANOMALIES.includes(id as AnomalyId)?'anomalies':'branches';
  const counts=[['sigils',SIGILS],['branches',Object.keys(BRANCHES)],['anomalies',ANOMALIES]] as const;
  return `<p>${counts.map(([label,ids])=>`${tr('q_'+label)} ${ids.filter(id=>owned.includes(id as LegacyId)).length}/${ids.length}`).join(' · ')} · ${t('q_seals')} ${ascensionAvailable(owned)?profile.legacy.ascension.highest+1:0}/5</p>`+
    LEGACY_IDS.filter(id=>category==='all'||category===group(id)).map(id=>`<article class="collection-item"><strong>${name(id)}</strong><small>${t(owned.includes(id)?'unlocked':'legacyLocked')} · ${owned.includes(id)?1:0}/1</small><p>${tr(`legacy_${id}Desc`)}</p><p>${t('qDependency')}: ${Object.hasOwn(BRANCHES,id)?name(BRANCHES[id as BranchId]):ANOMALIES.includes(id as AnomalyId)?t('qAnomalyDependency'):t('qSigilDependency')}</p></article>`).join('')+
    (category==='all'||category==='seals'?[0,1,2,3,4].map(n=>`<article class="collection-item"><strong>${t('sealBadge').replace('{n}',String(n))} · ${tr(`sealName${n}`)}</strong><small>${t(ascensionAvailable(owned)&&n<=profile.legacy.ascension.highest?'unlocked':'legacyLocked')} · ${profile.legacy.ascension.clears.includes(n)?1:0}/1 ${t('qClear')}</small><p>${tr(`sealMod${n}`)}</p><p>${t('qDependency')}: ${n===0?t('sealRequirement'):t('qPreviousSeal').replace('{n}',String(n-1))}</p></article>`).join(''):'');
}
export function challengeMarkup(profile: Profile): string {
  return `<p>${t('qBadgeOnly')}</p>`+challenges(profile.legacy,profile.collection).map(c=>`<article class="collection-item"><strong>${tr('q_'+c.id)} ${c.value===c.target?'◇':''}</strong><p>${tr('q_'+c.id+'Desc')}</p><span>${c.value}/${c.target} · ${t(c.value===c.target?'qCompleted':'qInProgress')}</span></article>`).join('');
}
export function nextGoal(profile: Profile): string {
  const c=challenges(profile.legacy,profile.collection).find(c=>c.value<c.target);
  return `${t('qNextGoal')}: ${c?tr('q_'+c.id)+` ${c.value}/${c.target}`:t('qAllComplete')}`;
}
