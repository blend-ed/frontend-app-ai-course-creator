import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiStudioKeys } from './queryKeys';
import * as api from './api';

export const useCourseCreations = (organisationId?: string) => useQuery({
  queryKey: aiStudioKeys.creations(organisationId),
  queryFn: () => api.fetchCourseCreations(organisationId),
});

/** Orgs the signed-in user may build a course under (from Studio Home). */
export const useAllowedOrgs = () => useQuery({
  queryKey: aiStudioKeys.allowedOrgs(),
  queryFn: () => api.fetchAllowedOrgs(),
  staleTime: Infinity,
});

export const useMessages = (id?: string) => useQuery({
  queryKey: aiStudioKeys.messages(id || ''),
  queryFn: () => api.fetchMessages(id as string),
  enabled: !!id,
});

/**
 * Aggregate course metadata for the Course Brief panel.
 * Always reflects the DB snapshot (not per-turn chat fragments).
 */
export const useCourseMetadata = (id?: string) => useQuery({
  queryKey: aiStudioKeys.metadata(id || ''),
  queryFn: () => api.fetchMetadata(id as string),
  enabled: !!id,
});

/**
 * Save a single Course Brief field on blur. Optimistically patches the raw
 * (snake_case) metadata cache so the value doesn't flicker, rolling back on
 * error. `title` also refreshes the creations list (history shows the title).
 */
export const useUpdateMetadataField = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { courseCreationId: string; key: string; value: unknown }) => (
      api.updateMetadataField(p.courseCreationId, p.key, p.value)
    ),
    onMutate: async ({ courseCreationId, key, value }) => {
      const queryKey = aiStudioKeys.metadata(courseCreationId);
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData(queryKey);
      qc.setQueryData(
        queryKey,
        (old: Record<string, unknown> | undefined) => ({ ...(old || {}), [key]: value }),
      );
      return { previous, queryKey };
    },
    onError: (_e, _vars, context) => {
      if (context && context.previous !== undefined) {
        qc.setQueryData(context.queryKey, context.previous);
      }
    },
    onSettled: (_d, _e, vars) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.metadata(vars.courseCreationId) });
      if (vars.key === 'title') {
        qc.invalidateQueries({ queryKey: [...aiStudioKeys.all, 'creations'] });
      }
    },
  });
};

export const useStructure = (id?: string) => useQuery({
  queryKey: aiStudioKeys.structure(id || ''),
  queryFn: () => api.fetchStructure(id as string),
  enabled: !!id,
});

export const useComponentPlan = (id?: string, enabled = true) => useQuery({
  queryKey: aiStudioKeys.componentPlan(id || ''),
  queryFn: () => api.fetchComponentPlan(id as string),
  enabled: !!id && enabled,
});

export const useComponents = (id?: string, enabled = true) => useQuery({
  queryKey: aiStudioKeys.components(id || ''),
  queryFn: () => api.fetchComponents(id as string),
  enabled: !!id && enabled,
});

export const useBuildProgress = (id?: string, enabled = true) => useQuery({
  queryKey: aiStudioKeys.buildProgress(id || ''),
  queryFn: () => api.fetchBuildProgress(id as string),
  enabled: !!id && enabled,
  refetchInterval: (query) => {
    const stage = query.state.data?.stage;
    if (stage === 'success' || stage === 'failed') { return false; }
    return 1500;
  },
});

export const useSendChat = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.sendChat,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.messages(data.courseCreationId) });
      qc.invalidateQueries({ queryKey: aiStudioKeys.metadata(data.courseCreationId) });
      qc.invalidateQueries({ queryKey: [...aiStudioKeys.all, 'creations'] });
      if (data.structure) {
        qc.invalidateQueries({ queryKey: aiStudioKeys.structure(data.courseCreationId) });
      }
    },
  });
};

export const useGenerateComponentPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.generateComponentPlan,
    onSuccess: (_d, courseCreationId) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.componentPlan(courseCreationId) });
    },
  });
};

export const useUpdateUnitPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateUnitPlan,
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.componentPlan(vars.courseCreationId) });
    },
  });
};

export const useGenerateUnit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.generateUnit,
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.components(vars.courseCreationId) });
    },
  });
};

export const useUpdateComponentScript = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { componentId: string; script: string; courseCreationId: string }) => (
      api.updateComponentScript(p.componentId, p.script)
    ),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.components(vars.courseCreationId) });
    },
  });
};

export const useRenameNode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { nodeId: string; name: string; courseCreationId: string }) => (
      api.renameNode(p.nodeId, p.name)
    ),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.structure(vars.courseCreationId) });
    },
  });
};

export const useDeleteNode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { nodeId: string; courseCreationId: string }) => api.deleteNode(p.nodeId),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.structure(vars.courseCreationId) });
      qc.invalidateQueries({ queryKey: aiStudioKeys.componentPlan(vars.courseCreationId) });
    },
  });
};

export const useAddStructureNode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.addStructureNode,
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.structure(vars.courseCreationId) });
    },
  });
};

export const useStartBuild = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.startBuild,
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.buildProgress(vars.courseCreationId) });
      qc.invalidateQueries({ queryKey: aiStudioKeys.metadata(vars.courseCreationId) });
    },
  });
};

/** AI-refine a single component's script from a natural-language instruction. */
export const useRefineScript = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { componentId: string; instruction: string; courseCreationId: string }) => (
      api.refineScript(p.componentId, p.instruction)
    ),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.components(vars.courseCreationId) });
    },
  });
};

/** AI-refine the course outline; refreshes both the structure and the plan. */
export const useRefineStructure = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { courseCreationId: string; instruction: string }) => (
      api.refineStructure(p.courseCreationId, p.instruction)
    ),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: aiStudioKeys.structure(vars.courseCreationId) });
      qc.invalidateQueries({ queryKey: aiStudioKeys.componentPlan(vars.courseCreationId) });
    },
  });
};

// --- Prompt customization (staff admin) ---
export const usePromptOverrides = () => useQuery({
  queryKey: aiStudioKeys.promptOverrides(),
  queryFn: () => api.fetchPromptOverrides(),
});

export const useSavePromptOverride = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.savePromptOverride,
    onSuccess: () => qc.invalidateQueries({ queryKey: aiStudioKeys.promptOverrides() }),
  });
};

export const useDeletePromptOverride = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pk: string) => api.deletePromptOverride(pk),
    onSuccess: () => qc.invalidateQueries({ queryKey: aiStudioKeys.promptOverrides() }),
  });
};

export const usePromptAddenda = () => useQuery({
  queryKey: aiStudioKeys.promptAddenda(),
  queryFn: () => api.fetchPromptAddenda(),
});

export const useSavePromptAddendum = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.savePromptAddendum,
    onSuccess: () => qc.invalidateQueries({ queryKey: aiStudioKeys.promptAddenda() }),
  });
};

export const useDeletePromptAddendum = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pk: string) => api.deletePromptAddendum(pk),
    onSuccess: () => qc.invalidateQueries({ queryKey: aiStudioKeys.promptAddenda() }),
  });
};
