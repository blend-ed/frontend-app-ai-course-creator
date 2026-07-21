import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY,
  getConfig, getPath,
  initialize, mergeConfig,
  subscribe,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';

import AiStudioPage from './ai-studio';
import AiStudioHistoryPage from './ai-studio/history/AiStudioHistoryPage';
import PromptsAdminPage from './ai-studio/prompts/PromptsAdminPage';
import AuditPage from './ai-studio/audit/AuditPage';
import AuditRunPage from './ai-studio/audit/AuditRunPage';
import messages from './i18n';
import './index.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // If cache is up to one hour old, no need to re-fetch.
      staleTime: 60 * 60_000,
    },
  },
});

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Navigate to="/ai-studio" replace />} />
        <Route path="/ai-studio" element={<AiStudioPage />} />
        <Route path="/ai-studio/history" element={<AiStudioHistoryPage />} />
        <Route path="/ai-studio/prompts" element={<PromptsAdminPage />} />
        {/* Audit routes precede the :courseCreationId catch-all. */}
        <Route path="/ai-studio/audit" element={<AuditPage />} />
        <Route path="/ai-studio/audit/:courseCreationId" element={<AuditRunPage />} />
        <Route path="/ai-studio/:courseCreationId" element={<AiStudioPage />} />
      </Route>,
    ),
    {
      basename: getPath(getConfig().PUBLIC_PATH),
    },
  );

  return (
    <AppProvider wrapWithRouter={false}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppProvider>
  );
};

subscribe(APP_READY, () => {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <ErrorPage message={error.message} />
    </StrictMode>,
  );
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        // Studio (CMS) base — the AI Course Creator plugin is mounted here under
        // `/ai_course_creator`. All API calls resolve against this origin.
        STUDIO_BASE_URL: process.env.STUDIO_BASE_URL || null,
        SITE_NAME: process.env.SITE_NAME || null,
        // Comma-separated prompt keys the prompt-settings editor may override
        // (or `*` for all). Unset ⇒ plain-text prompts only, see
        // DEFAULT_EDITABLE_PROMPT_KEYS. Runtime MFE_CONFIG wins over the build
        // env, so don't clobber it with a null when the build env is unset.
        AI_STUDIO_EDITABLE_PROMPT_KEYS: process.env.AI_STUDIO_EDITABLE_PROMPT_KEYS
          || getConfig().AI_STUDIO_EDITABLE_PROMPT_KEYS
          || null,
      }, 'AiCourseCreatorConfig');
    },
  },
  messages,
  requireAuthenticatedUser: true,
  hydrateAuthenticatedUser: true,
});
