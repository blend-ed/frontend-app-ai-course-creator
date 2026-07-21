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

// --- Prompt customization (staff admin) ---
// Keys must match PromptOverride.Key on the backend (models.py).
export const PROMPT_KEYS = [
  'system',
  'component_plan',
  'script_generation',
  'script_refinement',
  'structure_refinement',
  'olx_generation',
] as const;
export type PromptKey = typeof PROMPT_KEYS[number];

export interface PromptOverride {
  id: string;
  key: PromptKey;
  organisationId: string;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptOverrideInput {
  id?: string;
  key: PromptKey;
  organisationId: string;
  body: string;
  isActive: boolean;
}

export interface PromptAddendum {
  id: string;
  organisationId: string;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptAddendumInput {
  id?: string;
  organisationId: string;
  body: string;
  isActive: boolean;
}

// --- Audit (staff-only) ---------------------------------------------------
// Reconstructed from the course-creation tables by the plugin's /audit/ API;
// there is no audit-event store, so everything here is derived state.

export interface AuditRunSummary {
  id: string;
  title: string;
  organisationId: string;
  userId: number | null;
  username: string;
  email: string;
  stage: Stage;
  errorMessage: string;
  courseKey: string;
  buildTaskId: string;
  buildProgressCurrent: number;
  buildProgressTotal: number;
  buildProgressDetail: string;
  attachedFileCount: number;
  messageCount: number;
  componentCount: number;
  unitCount: number;
  durationSeconds: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditOutlineNode {
  id: string;
  parentId: string | null;
  hierarchy: 'section' | 'subsection' | 'unit';
  name: string;
  order: number;
}

export interface AuditComponent {
  id: string;
  componentType: string;
  unitId: string;
  unitName: string;
  unitOrder: number;
  script: string;
  wasEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditVideoJob {
  id: string;
  componentId: string;
  provider: string;
  providerJobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl: string;
  durationSeconds: number | null;
  errorMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditRunDetail extends AuditRunSummary {
  attachedFiles: AttachedFile[];
  metadata: Record<string, unknown>;
  outline: {
    counts: { section: number; subsection: number; unit: number };
    nodes: AuditOutlineNode[];
  };
  messages: CourseCreationMessage[];
  components: AuditComponent[];
  videoJobs: AuditVideoJob[];
}

export interface AuditRunPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: AuditRunSummary[];
}

export interface AuditSummary {
  total: number;
  byStage: Partial<Record<Stage, number>>;
  succeeded: number;
  failed: number;
  /** Share of *finished* runs that succeeded; null when nothing has finished. */
  successRate: number | null;
  organisations: string[];
}

export interface AuditRunFilters {
  organisationId?: string;
  stage?: string;
  search?: string;
  failedOnly?: boolean;
  page?: number;
  pageSize?: number;
}
