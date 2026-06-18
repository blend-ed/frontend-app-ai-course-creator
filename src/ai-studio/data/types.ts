export type Stage =
  | 'init'
  | 'metadata_collection'
  | 'outline_creation'
  | 'component_plan'
  | 'script_generation'
  | 'building'
  | 'success'
  | 'failed';

export type Role = 'user' | 'assistant' | 'system';

export interface AttachedFile {
  name: string;
  type: string;
  size: number;
}

export interface CourseCreationSummary {
  id: string;
  title: string;
  stage: Stage;
  organisationId: string;
  courseKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCreationMessage {
  id: string;
  role: Role;
  content: string;
  toolCalls: Array<{ name: string; args: Record<string, unknown> }> | null;
  createdAt: string;
}

export interface OptionChoice {
  id: string;
  label: string;
  description?: string;
}

export interface OptionsPayload {
  type: 'single' | 'multi';
  question: string;
  choices: OptionChoice[];
  skippable?: boolean;
  metadataKey?: string;
}

export interface StructureNode {
  id: string;
  name: string;
  hierarchy?: 'section' | 'subsection' | 'unit';
  children?: StructureNode[];
}

export interface ChatResponse {
  message: string;
  courseCreationId: string;
  stage: Stage;
  metadataSummary?: Record<string, unknown>;
  options?: OptionsPayload;
  structure?: StructureNode[];
}

export interface ComponentPlanEntry {
  unitId: string;
  unitName: string;
  sectionName?: string;
  subsectionName?: string;
  componentTypes: string[];
}

export interface GeneratedComponent {
  id: string;
  componentType: string;
  unitOrder: number;
  script: string;
  updatedAt: string;
}

export interface UnitComponents {
  unitId: string;
  unitName: string;
  components: GeneratedComponent[];
}

export interface BuildProgress {
  stage: Stage;
  progressCurrent: number;
  progressTotal: number;
  progressDetail: string;
  courseKey?: string;
  errorMessage?: string;
}
