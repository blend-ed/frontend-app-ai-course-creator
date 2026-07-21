import { getConfig } from '@edx/frontend-platform';
import {
  RiFileTextLine,
  RiImage2Line,
  RiVideoLine,
  RiListCheck2,
  RiCheckboxMultipleLine,
  RiInputCursorMove,
  RiArrowDownSLine,
  RiCalculatorLine,
  RiPuzzleLine,
} from '@remixicon/react';
import messages from '../messages';

export const STAGES = {
  INIT: 'init',
  METADATA_COLLECTION: 'metadata_collection',
  OUTLINE_CREATION: 'outline_creation',
  COMPONENT_PLAN: 'component_plan',
  SCRIPT_GENERATION: 'script_generation',
  BUILDING: 'building',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export const COMPONENT_TYPES = [
  { id: 'html', label: messages.componentTypeText, icon: RiFileTextLine },
  { id: 'image', label: messages.componentTypeImage, icon: RiImage2Line },
  { id: 'video', label: messages.componentTypeVideo, icon: RiVideoLine },
  { id: 'multiple_choice', label: messages.componentTypeMultipleChoice, icon: RiListCheck2 },
  { id: 'checkbox', label: messages.componentTypeCheckbox, icon: RiCheckboxMultipleLine },
  { id: 'text_input', label: messages.componentTypeTextInput, icon: RiInputCursorMove },
  { id: 'dropdown', label: messages.componentTypeDropdown, icon: RiArrowDownSLine },
  { id: 'numerical', label: messages.componentTypeNumerical, icon: RiCalculatorLine },
  { id: 'interactive', label: messages.componentTypeInteractive, icon: RiPuzzleLine },
] as const;

export const componentTypeMeta = (id: string) => (
  COMPONENT_TYPES.find((c) => c.id === id) ?? { id, label: null, icon: RiFileTextLine }
);

export const ACCEPTED_FILE_TYPES = '.pdf,.docx,.txt';

// Overridable prompt keys with display labels — mirror PromptOverride.Key in
// the backend model (and PROMPT_KEYS in data/types.ts). Order = display order.
//
// `structured: true` means the generator parses that prompt's response as a
// machine format the pipeline depends on — JSON for `component_plan`,
// `script_generation` and `structure_refinement`, OLX for `olx_generation`, and
// a tool-calling contract for `system`. A free-text replacement silently breaks
// course creation, which is why those are not editable by default.
export const PROMPT_KEY_FIELDS = [
  {
    id: 'system', label: messages.promptKeySystem, help: messages.promptKeySystemHelp, structured: true,
  },
  {
    id: 'component_plan', label: messages.promptKeyComponentPlan, help: messages.promptKeyComponentPlanHelp, structured: true,
  },
  {
    id: 'script_generation', label: messages.promptKeyScriptGeneration, help: messages.promptKeyScriptGenerationHelp, structured: true,
  },
  {
    id: 'script_refinement', label: messages.promptKeyScriptRefinement, help: messages.promptKeyScriptRefinementHelp, structured: false,
  },
  {
    id: 'structure_refinement', label: messages.promptKeyStructureRefinement, help: messages.promptKeyStructureRefinementHelp, structured: true,
  },
  {
    id: 'olx_generation', label: messages.promptKeyOlxGeneration, help: messages.promptKeyOlxGenerationHelp, structured: true,
  },
] as const;

// Only prompts whose response is consumed as plain text are editable out of the
// box; everything else is shown read-only so an override cannot break course
// generation.
export const DEFAULT_EDITABLE_PROMPT_KEYS: string[] = PROMPT_KEY_FIELDS
  .filter((f) => !f.structured)
  .map((f) => f.id);

const ALL_PROMPT_KEYS: string[] = PROMPT_KEY_FIELDS.map((f) => f.id);

/**
 * Prompt keys the editor lets staff override, from `AI_STUDIO_EDITABLE_PROMPT_KEYS`.
 *
 * Set it in `MFE_CONFIG` (or the build `.env`) to a comma-separated list of keys,
 * or `*` for every key. Unset falls back to the plain-text-only default above.
 * Widening this to a structured prompt means whatever is saved must keep
 * producing the exact format the builder parses.
 */
export const editablePromptKeys = (): string[] => {
  const raw = (getConfig() as Record<string, unknown>).AI_STUDIO_EDITABLE_PROMPT_KEYS;
  if (Array.isArray(raw)) {
    return raw.map(String).filter((k) => ALL_PROMPT_KEYS.includes(k));
  }
  if (typeof raw === 'string' && raw.trim()) {
    if (raw.trim() === '*') { return ALL_PROMPT_KEYS; }
    return raw.split(',').map((k) => k.trim()).filter((k) => ALL_PROMPT_KEYS.includes(k));
  }
  return DEFAULT_EDITABLE_PROMPT_KEYS;
};
