import { getConfig } from '@edx/frontend-platform';
import {
  aiStudioBaseUrl,
  chatUrl,
  chatMessagesUrl,
  chatStructureUrl,
  componentPlanGenerateUrl,
  componentPlanUrl,
  buildUrl,
  buildProgressUrl,
  structureNodeUrl,
} from './api';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
  camelCaseObject: (x: unknown) => x,
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
});
