frontend-app-ai-course-creator
##############################

A bare Open edX micro-frontend (MFE) that hosts the **AI Course Creator**
workspace — the same chat → outline → scripts → build flow shipped inside the
authoring MFE, extracted into a standalone app.

Built from the Open edX ``frontend-template-application`` (Node 24). On the
``verawood`` branch it builds against Open edX Verawood
(``@edx/frontend-platform`` 8.7, ``@openedx/paragon`` aliased to
``@blend-ed/blendxui``); see "Verawood" below. It has no
``blendxplatform`` package and no Blend-ed app shell.

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
* One helper ported into ``src/generic/``: ``aiErrorMessage``.
* The Blend-ed ``orgName`` cookie (a tenant marker, not an Open edX concept) was
  removed. At build time the user picks an org from a dropdown populated by the
  Studio Home API (``/api/contentstore/v1/home`` → ``allowed_organizations``);
  chat / history no longer scope by org (single-tenant: list all the user's
  sessions).
* ``src/index.jsx`` is a minimal shell (``AppProvider`` + React Query +
  ``RouterProvider``) — the Blend-ed ``AppWrapper`` / ``AiChatModal`` /
  ``RequirePermission`` / ``StaffShellGuard`` / ``Header`` were dropped.
* "View course" links point to Studio (``${STUDIO_BASE_URL}/course/<key>``)
  instead of the in-MFE authoring route.
* ``@openedx/paragon`` resolved to the real package on Ulmo; on ``verawood``
  it is aliased to ``@blend-ed/blendxui`` like the other Blend-ed MFEs.

Verawood
********

This app is Blend-ed's own (generated from ``frontend-template-application``),
not a fork of an Open edX repo, so there is no upstream ``release/verawood.1``
tag to merge. Instead its Open edX dependencies were moved to the Verawood set
used by ``frontend-app-learner-dashboard``'s ``verawood`` branch (blendxapi#830).

What changed
============

* ``@edx/frontend-platform`` ``^8.5.1`` → ``^8.7.0``.
* ``@openedx/paragon`` ``^23.4.5`` (stock Paragon, locked at 23.22.0) →
  ``npm:@blend-ed/blendxui@~23.3.2`` (Design System 2.0, the version every
  Verawood fork uses).
* ``@openedx/frontend-build`` ``14.6.3`` → ``^14.6.6``;
  ``@edx/browserslist-config`` → ``^1.3.0``.
* ``package-lock.json`` updated from the base lock with a targeted
  ``npm install`` of those four packages only; everything else stays pinned.
* ``src/_paragon-compat.scss`` removed: blendxui defines the tokens it set.
* Not added: ``@blend-ed/blendxplatform`` and the header/footer components.
  The app imports none of them (it has no Blend-ed shell, header or footer).

GitHub Packages token
=====================

``@openedx/paragon`` is now an alias for ``@blend-ed/blendxui``, which is
published on GitHub Packages (``npm.pkg.github.com``), not npmjs. So:

* Local ``npm ci`` / ``npm install`` needs a GitHub token with
  ``read:packages`` in ``~/.npmrc``::

     @blend-ed:registry=https://npm.pkg.github.com
     //npm.pkg.github.com/:_authToken=<token>

* The Tutor image build needs it too. ai-course-creator is not yet in
  tutor-blendxconfig's ``V5_MFE_FORKS`` (the list ``blendx_private_npm_mfes``
  is built from). Whoever registers this MFE in Tutor must add it there, or
  the build fails with a 401.

How to repeat it
================

Do not delete the lockfile. Install only the packages you are changing, so
the rest of the tree stays pinned:

.. code-block:: bash

   nvm use                        # Node 24
   npm ci
   npm install "@edx/frontend-platform@^8.7.0" \
     "@openedx/paragon@npm:@blend-ed/blendxui@~23.3.2"
   npm install -D "@edx/browserslist-config@^1.3.0" \
     "@openedx/frontend-build@^14.6.6"
   npm run build && npm run lint && npm test

Translations are not pulled in this repo (``src/i18n/index.ts`` is the
template placeholder), so there is no ``make pull_translations`` step.

Branch policy
=============

Decided 19 Oct 2026: ``verawood`` is a long-lived branch for v5 (Verawood),
cut from ``master``. ``master`` and ``production`` stay on Ulmo. v5 work goes
into ``verawood`` through PRs.

Hasura / DDN GraphQL calls left for later
=========================================

None. The app makes no Hasura or DDN GraphQL calls; every request goes to the
``ai_course_creator`` Studio plugin REST API, the Studio Home API or Studio
``/organizations``. Moving that backend plugin to the standalone branch is
blendxapi P94.
