export const aiStudioKeys = {
  all: ['ai-studio'] as const,
  allowedOrgs: () => [...aiStudioKeys.all, 'allowed-orgs'] as const,
  creations: (organisationId?: string) => [...aiStudioKeys.all, 'creations', organisationId || ''] as const,
  messages: (id: string) => [...aiStudioKeys.all, 'messages', id] as const,
  metadata: (id: string) => [...aiStudioKeys.all, 'metadata', id] as const,
  structure: (id: string) => [...aiStudioKeys.all, 'structure', id] as const,
  componentPlan: (id: string) => [...aiStudioKeys.all, 'component-plan', id] as const,
  components: (id: string) => [...aiStudioKeys.all, 'components', id] as const,
  buildProgress: (id: string) => [...aiStudioKeys.all, 'build', id] as const,
  promptOverrides: (organisationId: string) => [...aiStudioKeys.all, 'prompt-overrides', organisationId] as const,
  promptAddenda: (organisationId: string) => [...aiStudioKeys.all, 'prompt-addenda', organisationId] as const,
  promptDefaults: () => [...aiStudioKeys.all, 'prompt-defaults'] as const,
};
