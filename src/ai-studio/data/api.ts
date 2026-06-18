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
} from './types';

export const aiStudioBaseUrl = () => `${getConfig().STUDIO_BASE_URL}/ai_course_creator`;

export const chatUrl = () => `${aiStudioBaseUrl()}/chat/`;
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

export const buildUrl = () => `${aiStudioBaseUrl()}/build/`;
export const buildProgressUrl = (id: string) => `${aiStudioBaseUrl()}/build/progress/${id}/`;

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
}

export async function generateUnit(params: GenerateUnitParams) {
  const { data } = await getAuthenticatedHttpClient().post(generateUnitUrl(), {
    course_creation_id: params.courseCreationId,
    unit_id: params.unitId,
  });
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
