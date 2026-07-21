import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import type {
  ChatResponse,
  CourseCreationMessage,
  CourseCreationSummary,
  StructureNode,
  ComponentPlanEntry,
  UnitComponents,
  BuildProgress,
  PromptOverride,
  PromptOverrideInput,
  PromptAddendum,
  PromptAddendumInput,
  AuditRunFilters,
  AuditRunPage,
  AuditRunDetail,
  AuditSummary,
} from './types';

export const aiStudioBaseUrl = () => `${getConfig().STUDIO_BASE_URL}/ai_course_creator`;

export const chatUrl = () => `${aiStudioBaseUrl()}/chat/`;
export const chatDetailUrl = (id: string) => `${aiStudioBaseUrl()}/chat/${id}/`;
export const chatMessagesUrl = (id: string) => `${aiStudioBaseUrl()}/chat/${id}/messages/`;
export const chatMetadataUrl = (id: string) => `${aiStudioBaseUrl()}/chat/${id}/metadata/`;
export const chatStructureUrl = (id: string) => `${aiStudioBaseUrl()}/chat/${id}/structure/`;

export const componentPlanGenerateUrl = () => `${aiStudioBaseUrl()}/scripts/component-plan/generate/`;
export const componentPlanUrl = (id: string) => `${aiStudioBaseUrl()}/scripts/${id}/component-plan/`;
export const componentPlanUpdateUnitUrl = () => `${aiStudioBaseUrl()}/scripts/component-plan/update-unit/`;
export const componentsUrl = (id: string) => `${aiStudioBaseUrl()}/scripts/${id}/components/`;
export const unitsStatusUrl = (id: string) => `${aiStudioBaseUrl()}/scripts/${id}/units/`;
export const generateUnitUrl = () => `${aiStudioBaseUrl()}/scripts/generate-unit/`;
export const componentUpdateUrl = (componentId: string) => `${aiStudioBaseUrl()}/scripts/component/${componentId}/`;

export const structureNodeUrl = (nodeId: string) => `${aiStudioBaseUrl()}/scripts/structure/node/${nodeId}/`;
export const structureAddUrl = () => `${aiStudioBaseUrl()}/scripts/structure/add/`;
export const structureReorderUrl = () => `${aiStudioBaseUrl()}/scripts/structure/reorder/`;

export const buildUrl = () => `${aiStudioBaseUrl()}/build/`;
export const buildProgressUrl = (id: string) => `${aiStudioBaseUrl()}/build/progress/${id}/`;

// Studio Home payload — the canonical Open edX source for the orgs a user is
// allowed to create courses in (replaces the Blend-ed `orgName` cookie).
export const studioHomeUrl = () => `${getConfig().STUDIO_BASE_URL}/api/contentstore/v1/home`;

// Studio's org list (short names) — the same source its new-course form
// autocompletes from. Used as a fallback, see `fetchAllowedOrgs`.
export const organizationsUrl = () => `${getConfig().STUDIO_BASE_URL}/organizations`;

export interface SendChatParams {
  message: string;
  courseCreationId?: string;
  organisationId?: string;
  files?: File[];
}

export async function sendChat(params: SendChatParams): Promise<ChatResponse> {
  const fd = new FormData();
  fd.append('message', params.message);
  if (params.courseCreationId) { fd.append('course_creation_id', params.courseCreationId); }
  if (params.organisationId) { fd.append('organisation_id', params.organisationId); }
  (params.files || []).forEach((f) => fd.append('files', f));
  const { data } = await getAuthenticatedHttpClient().post(chatUrl(), fd);
  return camelCaseObject(data) as ChatResponse;
}

export async function fetchCourseCreations(organisationId?: string): Promise<CourseCreationSummary[]> {
  const url = organisationId
    ? `${chatUrl()}?organisation_id=${encodeURIComponent(organisationId)}`
    : chatUrl();
  const { data } = await getAuthenticatedHttpClient().get(url);
  return camelCaseObject(data) as CourseCreationSummary[];
}

// Delete a course-creation thread and everything hanging off it (messages,
// metadata, structure, components, video jobs). A course already built from
// the thread survives — the built course is referenced by a plain key, not an
// FK, so there is no cascade into the modulestore.
export async function deleteCourseCreation(id: string): Promise<void> {
  await getAuthenticatedHttpClient().delete(chatDetailUrl(id));
}

export interface AllowedOrgs {
  /** Orgs the user may create courses in. */
  allowedOrganizations: string[];
  /** When true, the instance lets the user create a course under any org. */
  allowToCreateNewOrg: boolean;
}

export async function fetchAllowedOrgs(): Promise<AllowedOrgs> {
  const client = getAuthenticatedHttpClient();
  const { data } = await client.get(studioHomeUrl());
  const home = camelCaseObject(data) as {
    allowedOrganizations?: string[];
    allowedOrganizationsForLibraries?: string[];
    allowToCreateNewOrg?: boolean;
  };

  // Studio only populates `allowed_organizations` when
  // FEATURES['ENABLE_CREATOR_GROUP'] is enabled — otherwise it hard-returns [].
  // Fall back to the library-scoped list, then to the full org list, so the org
  // selector is never empty on instances that don't use creator groups.
  let orgs = home.allowedOrganizations || [];
  if (!orgs.length) { orgs = home.allowedOrganizationsForLibraries || []; }
  if (!orgs.length) {
    try {
      const { data: all } = await client.get(organizationsUrl());
      orgs = Array.isArray(all) ? all.filter((o): o is string => typeof o === 'string') : [];
    } catch {
      orgs = [];
    }
  }

  return {
    allowedOrganizations: orgs,
    allowToCreateNewOrg: !!home.allowToCreateNewOrg,
  };
}

export async function fetchMessages(id: string): Promise<CourseCreationMessage[]> {
  const { data } = await getAuthenticatedHttpClient().get(chatMessagesUrl(id));
  return camelCaseObject(data) as CourseCreationMessage[];
}

export async function fetchStructure(id: string): Promise<StructureNode[]> {
  const { data } = await getAuthenticatedHttpClient().get(chatStructureUrl(id));
  return camelCaseObject(data) as StructureNode[];
}

/**
 * Aggregate metadata for the Course Brief panel.
 *
 * Backend preserves original snake_case keys (`topic_summary`,
 * `component_types`, etc.) which the brief-panel config references directly,
 * so we intentionally skip `camelCaseObject` here.
 */
export async function fetchMetadata(id: string): Promise<Record<string, unknown>> {
  const { data } = await getAuthenticatedHttpClient().get(chatMetadataUrl(id));
  return (data || {}) as Record<string, unknown>;
}

/**
 * Update a single Course Brief field (save-on-blur). Keys are the raw
 * snake_case metadata keys the brief panel renders (see metadataGroups), so —
 * like fetchMetadata — we intentionally skip camelCase conversion here.
 */
export async function updateMetadataField(id: string, key: string, value: unknown) {
  const { data } = await getAuthenticatedHttpClient().patch(chatMetadataUrl(id), { key, value });
  return data as { key: string; value: unknown };
}

export async function generateComponentPlan(courseCreationId: string) {
  const { data } = await getAuthenticatedHttpClient().post(componentPlanGenerateUrl(), {
    course_creation_id: courseCreationId,
  });
  return camelCaseObject(data);
}

export async function fetchComponentPlan(id: string): Promise<{ plan: ComponentPlanEntry[] }> {
  const { data } = await getAuthenticatedHttpClient().get(componentPlanUrl(id));
  return camelCaseObject(data) as { plan: ComponentPlanEntry[] };
}

export interface UpdateUnitPlanParams {
  courseCreationId: string;
  unitId: string;
  componentTypes: string[];
}

export async function updateUnitPlan(params: UpdateUnitPlanParams) {
  const { data } = await getAuthenticatedHttpClient().put(componentPlanUpdateUnitUrl(), {
    course_creation_id: params.courseCreationId,
    unit_id: params.unitId,
    component_types: params.componentTypes,
  });
  return camelCaseObject(data);
}

export async function fetchComponents(id: string): Promise<UnitComponents[]> {
  const { data } = await getAuthenticatedHttpClient().get(componentsUrl(id));
  return camelCaseObject(data) as UnitComponents[];
}

export interface GenerateUnitParams {
  courseCreationId: string;
  unitId: string;
  // Optional cancellation: the Scripts panel aborts a stalled unit request
  // when the user clicks resume, so the loop can restart cleanly.
  signal?: AbortSignal;
}

// A single unit's script generation is one LLM round-trip. Cap the wait so a
// hung request fails fast (axios throws ECONNABORTED) instead of blocking the
// Scripts panel's sequential loop forever — the user can then resume the
// remaining units. The backend is idempotent (force=false), so a unit that
// actually finished server-side after a client timeout is simply skipped on
// the next pass.
export const GENERATE_UNIT_TIMEOUT_MS = 150000;

export async function generateUnit(params: GenerateUnitParams) {
  const { data } = await getAuthenticatedHttpClient().post(
    generateUnitUrl(),
    {
      course_creation_id: params.courseCreationId,
      unit_id: params.unitId,
    },
    { timeout: GENERATE_UNIT_TIMEOUT_MS, signal: params.signal },
  );
  return camelCaseObject(data);
}

export async function updateComponentScript(componentId: string, script: string) {
  const { data } = await getAuthenticatedHttpClient().put(componentUpdateUrl(componentId), { script });
  return camelCaseObject(data);
}

export async function renameNode(nodeId: string, name: string) {
  const { data } = await getAuthenticatedHttpClient().put(structureNodeUrl(nodeId), { name });
  return camelCaseObject(data);
}

export async function deleteNode(nodeId: string) {
  const { data } = await getAuthenticatedHttpClient().delete(structureNodeUrl(nodeId));
  return camelCaseObject(data);
}

export interface AddStructureNodeParams {
  courseCreationId: string;
  parentId: string | null;
  hierarchy: 'section' | 'subsection' | 'unit';
  name: string;
}

export async function addStructureNode(params: AddStructureNodeParams) {
  const { data } = await getAuthenticatedHttpClient().post(structureAddUrl(), {
    course_creation_id: params.courseCreationId,
    parent_id: params.parentId,
    hierarchy: params.hierarchy,
    name: params.name,
  });
  return camelCaseObject(data);
}

// Reorder sibling nodes. `nodeIds` must all share the same parent and be in
// the desired order — the backend writes each node's `order` to its index.
export async function reorderNodes(nodeIds: string[]) {
  const { data } = await getAuthenticatedHttpClient().post(structureReorderUrl(), { node_ids: nodeIds });
  return camelCaseObject(data);
}

export interface StartBuildParams {
  courseCreationId: string;
  org: string;
  number: string;
  run: string;
}

export async function startBuild(params: StartBuildParams) {
  const { data } = await getAuthenticatedHttpClient().post(buildUrl(), {
    course_creation_id: params.courseCreationId,
    org: params.org,
    number: params.number,
    run: params.run,
  });
  return camelCaseObject(data);
}

export async function fetchBuildProgress(id: string): Promise<BuildProgress> {
  const { data } = await getAuthenticatedHttpClient().get(buildProgressUrl(id));
  return camelCaseObject(data) as BuildProgress;
}

// --- AI refine actions (regenerate a script / restructure the outline from a
// natural-language instruction) ---
export const refineScriptUrl = () => `${aiStudioBaseUrl()}/scripts/refine/`;
export const refineStructureUrl = () => `${aiStudioBaseUrl()}/scripts/refine-structure/`;

export async function refineScript(componentId: string, instruction: string) {
  const { data } = await getAuthenticatedHttpClient().post(refineScriptUrl(), {
    component_id: componentId,
    instruction,
  });
  return camelCaseObject(data);
}

export async function refineStructure(courseCreationId: string, instruction: string) {
  const { data } = await getAuthenticatedHttpClient().post(refineStructureUrl(), {
    course_creation_id: courseCreationId,
    instruction,
  });
  return camelCaseObject(data);
}

// --- Prompt customization (staff-only admin) ---
export const promptOverridesUrl = () => `${aiStudioBaseUrl()}/prompts/overrides/`;
export const promptOverrideUrl = (pk: string) => `${aiStudioBaseUrl()}/prompts/overrides/${pk}/`;
export const promptAddendaUrl = () => `${aiStudioBaseUrl()}/prompts/addenda/`;
export const promptAddendumUrl = (pk: string) => `${aiStudioBaseUrl()}/prompts/addenda/${pk}/`;
export const promptDefaultsUrl = () => `${aiStudioBaseUrl()}/prompts/defaults/`;

// `organisationId` is always sent (blank ⇒ global scope) so a scope never
// leaks rows from another org.
const withOrgQuery = (base: string, organisationId: string) => (
  `${base}?organisation_id=${encodeURIComponent(organisationId)}`
);

// Tolerate either a bare array or a DRF paginated `{ results: [] }` envelope.
const asList = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }
  const results = (data as { results?: unknown })?.results;
  return Array.isArray(results) ? (results as T[]) : [];
};

export async function fetchPromptOverrides(organisationId: string): Promise<PromptOverride[]> {
  const { data } = await getAuthenticatedHttpClient().get(withOrgQuery(promptOverridesUrl(), organisationId));
  return asList<PromptOverride>(camelCaseObject(data));
}

// Built-in default template per prompt key, for pre-filling the editor. Keyed
// by the snake_case prompt keys, so intentionally NOT run through camelCase.
export async function fetchPromptDefaults(): Promise<Record<string, string>> {
  const { data } = await getAuthenticatedHttpClient().get(promptDefaultsUrl());
  return (data || {}) as Record<string, string>;
}

export async function savePromptOverride(p: PromptOverrideInput): Promise<PromptOverride> {
  const body = {
    key: p.key,
    organisation_id: p.organisationId || '',
    body: p.body,
    is_active: p.isActive,
  };
  const { data } = p.id
    ? await getAuthenticatedHttpClient().put(promptOverrideUrl(p.id), body)
    : await getAuthenticatedHttpClient().post(promptOverridesUrl(), body);
  return camelCaseObject(data) as PromptOverride;
}

export async function deletePromptOverride(pk: string): Promise<void> {
  await getAuthenticatedHttpClient().delete(promptOverrideUrl(pk));
}

export async function fetchPromptAddenda(organisationId: string): Promise<PromptAddendum[]> {
  const { data } = await getAuthenticatedHttpClient().get(withOrgQuery(promptAddendaUrl(), organisationId));
  return asList<PromptAddendum>(camelCaseObject(data));
}

export async function savePromptAddendum(p: PromptAddendumInput): Promise<PromptAddendum> {
  const body = {
    organisation_id: p.organisationId || '',
    body: p.body,
    is_active: p.isActive,
  };
  const { data } = p.id
    ? await getAuthenticatedHttpClient().put(promptAddendumUrl(p.id), body)
    : await getAuthenticatedHttpClient().post(promptAddendaUrl(), body);
  return camelCaseObject(data) as PromptAddendum;
}

export async function deletePromptAddendum(pk: string): Promise<void> {
  await getAuthenticatedHttpClient().delete(promptAddendumUrl(pk));
}

// --- Audit (staff-only) ---------------------------------------------------

export const auditRunsUrl = () => `${aiStudioBaseUrl()}/audit/runs/`;
export const auditRunUrl = (id: string) => `${aiStudioBaseUrl()}/audit/runs/${id}/`;
export const auditSummaryUrl = () => `${aiStudioBaseUrl()}/audit/summary/`;

/**
 * One page of course-creation runs across every user and organisation.
 *
 * Server-side paged and filtered — the run table grows without bound, so the
 * client never holds the full set.
 */
export async function fetchAuditRuns(filters: AuditRunFilters = {}): Promise<AuditRunPage> {
  const params = new URLSearchParams();
  if (filters.organisationId) { params.set('organisation_id', filters.organisationId); }
  if (filters.stage) { params.set('stage', filters.stage); }
  if (filters.search) { params.set('search', filters.search); }
  if (filters.failedOnly) { params.set('failed_only', 'true'); }
  if (filters.page) { params.set('page', String(filters.page)); }
  if (filters.pageSize) { params.set('page_size', String(filters.pageSize)); }

  const query = params.toString();
  const { data } = await getAuthenticatedHttpClient().get(
    query ? `${auditRunsUrl()}?${query}` : auditRunsUrl(),
  );
  return camelCaseObject(data) as AuditRunPage;
}

export async function fetchAuditRun(id: string): Promise<AuditRunDetail> {
  const { data } = await getAuthenticatedHttpClient().get(auditRunUrl(id));
  // `metadata` holds backend-authored keys (topic_summary, component_types, …)
  // that the brief panel matches on verbatim, so it must survive camelCasing.
  const detail = camelCaseObject(data) as AuditRunDetail;
  return { ...detail, metadata: (data as { metadata?: Record<string, unknown> }).metadata || {} };
}

export async function fetchAuditSummary(organisationId?: string): Promise<AuditSummary> {
  const url = organisationId
    ? `${auditSummaryUrl()}?organisation_id=${encodeURIComponent(organisationId)}`
    : auditSummaryUrl();
  const { data } = await getAuthenticatedHttpClient().get(url);
  // by_stage keys are stage slugs (`metadata_collection`), not field names —
  // camelCasing them would break the lookup against STAGES.
  const summary = camelCaseObject(data) as AuditSummary;
  return { ...summary, byStage: (data as { by_stage?: AuditSummary['byStage'] }).by_stage || {} };
}
