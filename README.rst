frontend-app-ai-course-creator
##############################

A bare Open edX micro-frontend (MFE) that hosts the **AI Course Creator**
workspace — the same chat → outline → scripts → build flow shipped inside the
authoring MFE, extracted into a standalone app.

Built from the Open edX ``frontend-template-application`` (Ulmo: Node 24,
``@edx/frontend-platform`` 8.5, ``@openedx/paragon`` 23). Unlike the authoring
MFE, this app uses **stock** ``@openedx/paragon`` — no ``blendxui`` /
``blendxplatform`` packages and no Blend-ed app shell.

Backend
*******

All API calls resolve against the AI Course Creator CMS plugin
(``ai_course_creator``), mounted under Studio at
``${STUDIO_BASE_URL}/ai_course_creator/`` and authenticated with the standard
JWT cookie via ``getAuthenticatedHttpClient``.

Set ``STUDIO_BASE_URL`` in the environment (see ``.env.development``).

Routes
******

* ``/``                            → redirect to ``/ai-studio``
* ``/ai-studio``                   → landing / new session
* ``/ai-studio/history``           → past course-creation sessions
* ``/ai-studio/:courseCreationId`` → an active session

The router ``basename`` is derived from ``PUBLIC_PATH`` so the app can be
mounted at any sub-path.

Develop
*******

.. code-block:: bash

   nvm use            # Node 24 (see .nvmrc)
   npm install
   npm start          # dev server on :8080
   npm run build      # production bundle → dist/
   npm run lint
   npm test

What changed vs. the authoring source
**************************************

* ``src/ai-studio/`` copied verbatim from ``frontend-app-authoring``.
* Two small helpers ported into ``src/generic/``: ``aiErrorMessage`` and
  ``data/orgFromCookie``.
* ``src/index.jsx`` is a minimal shell (``AppProvider`` + React Query +
  ``RouterProvider``) — the Blend-ed ``AppWrapper`` / ``AiChatModal`` /
  ``RequirePermission`` / ``StaffShellGuard`` / ``Header`` were dropped.
* "View course" links point to Studio (``${STUDIO_BASE_URL}/course/<key>``)
  instead of the in-MFE authoring route.
* ``@openedx/paragon`` resolves to the real package (authoring aliases it to
  ``@blend-ed/blendxui``).
