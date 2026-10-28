import { SIGILS, BRANCHES, ANOMALIES, LEGACY_IDS, validLegacy, type SigilId, type AnomalyId, type LegacyOffer, type LegacyId } from './config/legacy.js';
import { MUTATIONS, CURSES, type MutationId, type CurseId } from './builds.js';
import type { LegacyProgress, LegacyTicket } from './legacy.js';
export interface RunSummary {
  runId: number; at: number; result: 'victory' | 'defeat'; duration: number; seal: number;
  legacy: LegacyOffer | null; anomaly: AnomalyId | null; mutations: MutationId[]; curses: CurseId[];
  kills: number; boss: boolean; rewards: LegacyId[]; trailUnlocked?: SigilId | null;
}
export interface CollectionProgress { version: 1; lastRunId: number; sigilWins: SigilId[]; anomalyWins: AnomalyId[]; history: RunSummary[] }
export const emptyCollection = (): CollectionProgress => ({version:1,lastRunId:0,sigilWins:[],anomalyWins:[],history:[]});
const obj = (v: unknown): Record<string, unknown> => v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {};
const count = (v: unknown, max=1_000_000): number => typeof v==='number' && Number.isFinite(v) && v>=0 ? Math.min(Math.floor(v),max) : 0;
const ids = <T extends string>(v: unknown, pool: readonly T[]): T[] => pool.filter(id=>Array.isArray(v)&&v.includes(id));
export function validateCollection(value: unknown, nextRunId: number): CollectionProgress {
  const raw=obj(value), out=emptyCollection();
  if(raw.version!==1) return out;
  out.lastRunId=Math.min(count(raw.lastRunId),nextRunId-1);
  out.sigilWins=ids(raw.sigilWins,SIGILS);out.anomalyWins=ids(raw.anomalyWins,ANOMALIES);
  for(const entry of Array.isArray(raw.history)?raw.history.slice(0,20):[]) {
    const r=obj(entry), runId=count(r.runId);
    if(!runId || runId>out.lastRunId || out.history.some(h=>h.runId===runId) || (r.result!=='victory' && r.result!=='defeat')) continue;
    const legacy=validLegacy(r.legacy)?{sigil:r.legacy.sigil,branch:r.legacy.branch}:null;
    out.history.push({runId,at:count(r.at,8_640_000_000_000_000),result:r.result as RunSummary['result'],duration:count(r.duration,3600),seal:count(r.seal,4),legacy,
      anomaly:ids([r.anomaly],ANOMALIES)[0]??null,mutations:ids(r.mutations,MUTATIONS).slice(0,4),curses:ids(r.curses,CURSES).slice(0,2),kills:count(r.kills),boss:r.boss===true,trailUnlocked:r.result==='victory'?ids([r.trailUnlocked],SIGILS)[0]??null:null,rewards:ids(r.rewards,LEGACY_IDS).slice(0,2)});
  }
  out.history.sort((a,b)=>b.runId-a.runId);return out;
}
/** Called in the same transaction as finishLegacy, before its ticket is discarded. */
export function recordCollection(state: CollectionProgress, legacy: LegacyProgress, ticket: LegacyTicket, run: Omit<RunSummary,'runId'|'result'|'seal'|'legacy'|'anomaly'|'rewards'>): void {
  const receipt=legacy.receipt;
  if(!receipt || receipt.runId!==ticket.runId || receipt.runId<=state.lastRunId) return;
  state.lastRunId=receipt.runId;
  const trailUnlocked=receipt.result==='victory' && ticket.selected && !state.sigilWins.includes(ticket.selected.sigil) ? ticket.selected.sigil : null;
  if(receipt.result==='victory') {
    if(ticket.selected && !state.sigilWins.includes(ticket.selected.sigil)) state.sigilWins.push(ticket.selected.sigil);
    if(ticket.anomalySelected && !state.anomalyWins.includes(ticket.anomalySelected)) state.anomalyWins.push(ticket.anomalySelected);
  }
  state.history.unshift({...run,trailUnlocked,duration:count(run.duration,3600),runId:ticket.runId,result:receipt.result,seal:ticket.seal,legacy:ticket.selected?{...ticket.selected}:null,anomaly:ticket.anomalySelected,rewards:[...receipt.rewards]});
  state.history=state.history.slice(0,20);
}
export function challenges(legacy: LegacyProgress, collection: CollectionProgress) {
  return [
    {id:'firstVictory',value:Math.min(1,legacy.victories),target:1},
    {id:'elementalExplorer',value:SIGILS.filter(id=>legacy.unlocks.includes(id)).length,target:SIGILS.length},
    {id:'branchMaster',value:Object.keys(BRANCHES).filter(id=>legacy.unlocks.includes(id as LegacyId)).length,target:Object.keys(BRANCHES).length},
    {id:'anomalySurvivor',value:collection.anomalyWins.length,target:ANOMALIES.length},
    {id:'sealBreaker',value:legacy.ascension.clears.includes(4)?1:0,target:1},
    {id:'elementalConqueror',value:collection.sigilWins.length,target:SIGILS.length},
  ] as const;
}
