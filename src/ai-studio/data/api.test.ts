import { getConfig } from '@edx/frontend-platform';
import {
  aiStudioBaseUrl,
  chatUrl,
  chatDetailUrl,
  chatMessagesUrl,
  chatStructureUrl,
  structureReorderUrl,
  deleteCourseCreation,
  reorderNodes,
  componentPlanGenerateUrl,
  componentPlanUrl,
  buildUrl,
  buildProgressUrl,
  structureNodeUrl,
  refineScriptUrl,
  refineStructureUrl,
  promptOverridesUrl,
  promptOverrideUrl,
  promptAddendaUrl,
  promptAddendumUrl,
  refineScript,
  refineStructure,
  fetchPromptOverrides,
  savePromptOverride,
  deletePromptOverride,
  savePromptAddendum,
} from './api';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
  camelCaseObject: (x: unknown) => x,
}));

// Prefixed with `mock` so the jest.mock factory may reference it.
const mockHttpClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: () => mockHttpClient,
}));

describe('ai-studio api urls', () => {
  beforeEach(() => {
    (getConfig as jest.Mock).mockReturnValue({ STUDIO_BASE_URL: 'https://studio.test' });
  });

  it('builds the base URL', () => {
    expect(aiStudioBaseUrl()).toBe('https://studio.test/ai_course_creator');
  });

  it('builds chat URL', () => {
    expect(chatUrl()).toBe('https://studio.test/ai_course_creator/chat/');
  });

  it('builds messages URL with id', () => {
    expect(chatMessagesUrl('abc-123'))
      .toBe('https://studio.test/ai_course_creator/chat/abc-123/messages/');
  });

  it('builds chat detail URL with id', () => {
    expect(chatDetailUrl('abc-123'))
      .toBe('https://studio.test/ai_course_creator/chat/abc-123/');
  });

  it('builds structure reorder URL', () => {
    expect(structureReorderUrl())
      .toBe('https://studio.test/ai_course_creator/scripts/structure/reorder/');
  });

  it('deleteCourseCreation DELETEs the detail URL', async () => {
    mockHttpClient.delete.mockResolvedValue({});
    await deleteCourseCreation('abc-123');
    expect(mockHttpClient.delete)
      .toHaveBeenCalledWith('https://studio.test/ai_course_creator/chat/abc-123/');
  });

  it('reorderNodes POSTs the ordered ids', async () => {
    mockHttpClient.post.mockResolvedValue({ data: { status: 'success' } });
    await reorderNodes(['n1', 'n2', 'n3']);
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'https://studio.test/ai_course_creator/scripts/structure/reorder/',
      { node_ids: ['n1', 'n2', 'n3'] },
    );
  });

  it('builds structure URL with id', () => {
    expect(chatStructureUrl('abc-123'))
      .toBe('https://studio.test/ai_course_creator/chat/abc-123/structure/');
  });

  it('builds component-plan URLs', () => {
    expect(componentPlanGenerateUrl())
      .toBe('https://studio.test/ai_course_creator/scripts/component-plan/generate/');
    expect(componentPlanUrl('abc'))
      .toBe('https://studio.test/ai_course_creator/scripts/abc/component-plan/');
  });

  it('builds build URLs', () => {
    expect(buildUrl()).toBe('https://studio.test/ai_course_creator/build/');
    expect(buildProgressUrl('abc'))
      .toBe('https://studio.test/ai_course_creator/build/progress/abc/');
  });

  it('builds structure-node URL', () => {
    expect(structureNodeUrl('node-1'))
      .toBe('https://studio.test/ai_course_creator/scripts/structure/node/node-1/');
  });

  it('builds refine URLs', () => {
    expect(refineScriptUrl()).toBe('https://studio.test/ai_course_creator/scripts/refine/');
    expect(refineStructureUrl())
      .toBe('https://studio.test/ai_course_creator/scripts/refine-structure/');
  });

  it('builds prompt URLs', () => {
    expect(promptOverridesUrl()).toBe('https://studio.test/ai_course_creator/prompts/overrides/');
    expect(promptOverrideUrl('p1')).toBe('https://studio.test/ai_course_creator/prompts/overrides/p1/');
    expect(promptAddendaUrl()).toBe('https://studio.test/ai_course_creator/prompts/addenda/');
    expect(promptAddendumUrl('a1')).toBe('https://studio.test/ai_course_creator/prompts/addenda/a1/');
  });
});

describe('ai-studio refine + prompt requests', () => {
  beforeEach(() => {
    (getConfig as jest.Mock).mockReturnValue({ STUDIO_BASE_URL: 'https://studio.test' });
    mockHttpClient.get.mockReset();
    mockHttpClient.post.mockReset();
    mockHttpClient.put.mockReset();
    mockHttpClient.delete.mockReset();
  });

  it('refineScript posts component_id + instruction', async () => {
    mockHttpClient.post.mockResolvedValue({ data: { status: 'ok' } });
    await refineScript('comp-1', 'make it shorter');
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'https://studio.test/ai_course_creator/scripts/refine/',
      { component_id: 'comp-1', instruction: 'make it shorter' },
    );
  });

  it('refineStructure posts course_creation_id + instruction', async () => {
    mockHttpClient.post.mockResolvedValue({ data: {} });
    await refineStructure('course-1', 'add a section on testing');
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'https://studio.test/ai_course_creator/scripts/refine-structure/',
      { course_creation_id: 'course-1', instruction: 'add a section on testing' },
    );
  });

  it('fetchPromptOverrides GETs the list URL scoped to the org', async () => {
    mockHttpClient.get.mockResolvedValue({ data: [] });
    await fetchPromptOverrides('');
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      'https://studio.test/ai_course_creator/prompts/overrides/?organisation_id=',
    );
  });

  it('savePromptOverride POSTs (snake_case body) when there is no id', async () => {
    mockHttpClient.post.mockResolvedValue({ data: { id: 'p1' } });
    await savePromptOverride({
      key: 'system', organisationId: 'acme', body: 'B', isActive: true,
    });
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'https://studio.test/ai_course_creator/prompts/overrides/',
      {
        key: 'system', organisation_id: 'acme', body: 'B', is_active: true,
      },
    );
    expect(mockHttpClient.put).not.toHaveBeenCalled();
  });

  it('savePromptOverride PUTs the detail URL when id is present', async () => {
    mockHttpClient.put.mockResolvedValue({ data: { id: 'p1' } });
    await savePromptOverride({
      id: 'p1', key: 'olx_generation', organisationId: '', body: 'B2', isActive: false,
    });
    expect(mockHttpClient.put).toHaveBeenCalledWith(
      'https://studio.test/ai_course_creator/prompts/overrides/p1/',
      {
        key: 'olx_generation', organisation_id: '', body: 'B2', is_active: false,
      },
    );
    expect(mockHttpClient.post).not.toHaveBeenCalled();
  });

  it('savePromptAddendum POSTs without id and PUTs with id', async () => {
    mockHttpClient.post.mockResolvedValue({ data: {} });
    await savePromptAddendum({ organisationId: 'acme', body: 'X', isActive: true });
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'https://studio.test/ai_course_creator/prompts/addenda/',
      { organisation_id: 'acme', body: 'X', is_active: true },
    );

    mockHttpClient.put.mockResolvedValue({ data: {} });
    await savePromptAddendum({
      id: 'a1', organisationId: '', body: 'Y', isActive: false,
    });
    expect(mockHttpClient.put).toHaveBeenCalledWith(
      'https://studio.test/ai_course_creator/prompts/addenda/a1/',
      { organisation_id: '', body: 'Y', is_active: false },
    );
  });

  it('deletePromptOverride DELETEs the detail URL', async () => {
    mockHttpClient.delete.mockResolvedValue({});
    await deletePromptOverride('p1');
    expect(mockHttpClient.delete).toHaveBeenCalledWith(
      'https://studio.test/ai_course_creator/prompts/overrides/p1/',
    );
  });
});
