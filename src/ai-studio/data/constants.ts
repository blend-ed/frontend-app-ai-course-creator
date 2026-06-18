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
