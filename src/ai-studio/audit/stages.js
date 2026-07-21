import messages from '../messages';
import { STAGES } from '../data/constants';

// Stage labels are shared with the history screen — one wording per stage.
export const STAGE_LABEL_KEYS = {
  [STAGES.INIT]: 'historyStageInit',
  [STAGES.METADATA_COLLECTION]: 'historyStageMetadata',
  [STAGES.OUTLINE_CREATION]: 'historyStageOutline',
  [STAGES.COMPONENT_PLAN]: 'historyStageComponentPlan',
  [STAGES.SCRIPT_GENERATION]: 'historyStageScripts',
  [STAGES.BUILDING]: 'historyStageBuilding',
  [STAGES.SUCCESS]: 'historyStageCompleted',
  [STAGES.FAILED]: 'historyStageFailed',
};

export const STAGE_ORDER = [
  STAGES.INIT,
  STAGES.METADATA_COLLECTION,
  STAGES.OUTLINE_CREATION,
  STAGES.COMPONENT_PLAN,
  STAGES.SCRIPT_GENERATION,
  STAGES.BUILDING,
  STAGES.SUCCESS,
  STAGES.FAILED,
];

export const stageLabel = (intl, stage) => intl.formatMessage(
  messages[STAGE_LABEL_KEYS[stage] || 'historyStageInit'],
);

/** Badge colour per stage: terminal states carry meaning, in-flight stays neutral. */
export const stageColor = (stage) => {
  if (stage === STAGES.SUCCESS) { return 'success'; }
  if (stage === STAGES.FAILED) { return 'danger'; }
  return 'info';
};

/** Compact duration for table cells: `4m 12s`, `1h 03m`, `8s`. */
export const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined) { return '—'; }
  const total = Math.max(0, Math.round(seconds));
  if (total < 60) { return `${total}s`; }
  const mins = Math.floor(total / 60);
  if (mins < 60) { return `${mins}m ${String(total % 60).padStart(2, '0')}s`; }
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
};
