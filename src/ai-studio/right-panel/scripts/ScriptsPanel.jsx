import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Badge, Form, IconButton,
} from '@openedx/paragon';
import { RiFileList3Line, RiInformationLine, RiRefreshLine } from '@remixicon/react';
import messages from '../../messages';
import {
  useStructure,
  useComponents,
  useComponentPlan,
  useGenerateUnit,
  useStartBuild,
  useUpdateUnitPlan,
  useAllowedOrgs,
} from '../../data/apiHooks';
import ScriptCard from './ScriptCard';
import AddComponentMenu from '../outline/AddComponentMenu';
import { randomCourseNumber, randomCourseRun } from '../../data/randomRun';
import '../outline/OutlinePanel.scss';
import './ScriptsPanel.scss';

const flattenUnits = (structure = []) => {
  const out = [];
  structure.forEach((sec) => (sec.children || []).forEach(
    (sub) => (sub.children || []).forEach((u) => out.push(u.id)),
  ));
  return out;
};

const ScriptsPanel = ({ courseCreationId }) => {
  const intl = useIntl();
  const { data: structure = [] } = useStructure(courseCreationId);
  const { data: componentsData = [] } = useComponents(courseCreationId);
  const { data: planResp } = useComponentPlan(courseCreationId);
  const genUnit = useGenerateUnit();
  const updatePlan = useUpdateUnitPlan();
  const startBuild = useStartBuild();
  const { data: orgInfo } = useAllowedOrgs();

  const allowedOrgs = orgInfo?.allowedOrganizations || [];
  const [currentUnitId, setCurrentUnitId] = useState(null);
  const [org, setOrg] = useState('');

  // autoStartedRef makes the initial generation run fire only once. A manual
  // "resume" click supersedes any pass already in progress via runIdRef, and
  // abortRef cancels that pass's in-flight request — so clicking resume on a
  // stalled run abandons the stuck request and continues from current state,
  // without ever running two overlapping loops (the backend has no per-unit
  // lock, so overlap would double-generate and waste credits).
  const autoStartedRef = useRef(false);
  const runIdRef = useRef(0);
  const abortRef = useRef(null);

  // Default to the user's first allowed org once Studio Home resolves.
  useEffect(() => {
    if (!org && allowedOrgs.length) { setOrg(allowedOrgs[0]); }
  }, [allowedOrgs, org]);

  const componentsByUnit = useMemo(
    () => Object.fromEntries(componentsData.map((u) => [u.unitId, u.components || []])),
    [componentsData],
  );
  const planByUnit = useMemo(
    () => Object.fromEntries((planResp?.plan || []).map((p) => [p.unitId, p.componentTypes || []])),
    [planResp],
  );

  const flatUnits = useMemo(() => flattenUnits(structure), [structure]);

  const totalPlanned = Object.values(planByUnit).reduce((a, v) => a + v.length, 0);
  const done = componentsData
    .flatMap((u) => u.components || [])
    .filter((c) => c.script && c.script.length > 0).length;
  const allReady = totalPlanned > 0 && done >= totalPlanned;

  // Generate scripts for every unit whose planned components don't yet all
  // have non-empty scripts, one unit at a time. The "pending" set is derived
  // from current server state, so this is safe to re-run: already-scripted
  // units are skipped here, and the backend skips them again (force=false,
  // idempotent). That makes it both the initial driver and the manual resume
  // handler for a stalled run — it continues from where it stopped, never from
  // the beginning.
  const runGeneration = useCallback(async () => {
    if (!flatUnits.length || !planResp) { return; }

    // Supersede any pass already in progress: claim a new run id and abort its
    // in-flight request. This is what makes the resume button work mid-stall —
    // the stuck request is cancelled and we restart from current server state,
    // never from the beginning, and two loops never overlap.
    const myRunId = runIdRef.current + 1;
    runIdRef.current = myRunId;
    if (abortRef.current) { abortRef.current.abort(); }

    const pending = flatUnits.filter((uid) => {
      const planned = planByUnit[uid] || [];
      if (planned.length === 0) { return false; }
      const existing = componentsByUnit[uid] || [];
      return !planned.every((t) => {
        const comp = existing.find((c) => c.componentType === t);
        return comp && comp.script && comp.script.length > 0;
      });
    });
    if (pending.length === 0) {
      setCurrentUnitId(null);
      return;
    }

    for (const uid of pending) {
      if (runIdRef.current !== myRunId) { return; } // a newer resume click took over
      const controller = new AbortController();
      abortRef.current = controller;
      setCurrentUnitId(uid);
      try {
        // eslint-disable-next-line no-await-in-loop
        await genUnit.mutateAsync({ courseCreationId, unitId: uid, signal: controller.signal });
      } catch {
        // Aborted, timed out (GENERATE_UNIT_TIMEOUT_MS), or errored — leave the
        // unit pending and move on; the user can click resume to retry it.
      }
    }
    if (runIdRef.current === myRunId) { setCurrentUnitId(null); }
  }, [flatUnits, planResp, planByUnit, componentsByUnit, courseCreationId, genUnit]);

  // Auto-start once, as soon as the plan + units are loaded. Subsequent runs
  // are triggered manually via the resume button.
  useEffect(() => {
    if (autoStartedRef.current) { return; }
    if (!flatUnits.length || !planResp) { return; }
    autoStartedRef.current = true;
    runGeneration();
  }, [flatUnits.length, planResp, runGeneration]);

  const pillStatus = (unitId, typeId) => {
    const comp = (componentsByUnit[unitId] || []).find((c) => c.componentType === typeId);
    if (comp && comp.script && comp.script.length > 0) { return 'done'; }
    if (unitId === currentUnitId) { return 'generating'; }
    return 'queued';
  };

  const onCreateCourse = () => {
    if (!org) { return; }
    startBuild.mutate({
      courseCreationId,
      org,
      number: randomCourseNumber(),
      run: randomCourseRun(),
    });
  };

  const removeType = (unitId, typeId) => {
    const current = planByUnit[unitId] || [];
    updatePlan.mutate({
      courseCreationId,
      unitId,
      componentTypes: current.filter((t) => t !== typeId),
    });
  };

  const addType = (unitId, typeId) => {
    const current = planByUnit[unitId] || [];
    if (current.includes(typeId)) { return; }
    updatePlan.mutate({
      courseCreationId,
      unitId,
      componentTypes: [...current, typeId],
    });
  };

  return (
    <div className="ai-studio-scripts">
      <div className="ai-studio-scripts__head">
        <h3 className="ai-studio-scripts__title">
          {intl.formatMessage(messages.scriptGenerationTitle)}
        </h3>
        {totalPlanned > 0 && !allReady && (
          <div className="ai-studio-scripts__progress">
            <Badge variant="soft" color="primary" size="md" className="ai-studio-scripts__counter">
              <RiInformationLine size={16} />
              <span>
                {intl.formatMessage(messages.scriptCounter, {
                  current: done,
                  total: totalPlanned,
                })}
              </span>
            </Badge>
            <IconButton
              iconAs={RiRefreshLine}
              alt={intl.formatMessage(messages.resumeScripts)}
              size="sm"
              variant="ghost-secondary"
              onClick={runGeneration}
              className="ai-studio-scripts__resume"
            />
          </div>
        )}
      </div>
      <div className="ai-studio-scripts__scroll">
        <div className="ai-studio-outline__tree">
          {structure.map((section) => (
            <section key={section.id} className="ai-studio-outline__section">
              <div className="ai-studio-outline__section-header">
                <h4 className="ai-studio-outline__section-title">{section.name}</h4>
              </div>
              <div className="ai-studio-outline__subsections-wrapper">
                {(section.children || []).map((sub) => (
                  <div key={sub.id} className="ai-studio-outline__subsection">
                    <div className="ai-studio-outline__row">
                      <h5 className="ai-studio-outline__subsection-title">{sub.name}</h5>
                    </div>
                    <div className="ai-studio-outline__units-wrapper">
                      {(sub.children || []).map((unit) => {
                        const planned = planByUnit[unit.id] || [];
                        const existing = componentsByUnit[unit.id] || [];
                        return (
                          <div key={unit.id} className="ai-studio-outline__unit">
                            <div className="ai-studio-outline__unit-header">
                              <span className="ai-studio-outline__unit-title">{unit.name}</span>
                            </div>
                            <div className="ai-studio-scripts__cards">
                              {planned.map((typeId) => {
                                const comp = existing.find((c) => c.componentType === typeId);
                                return (
                                  <ScriptCard
                                    key={`${unit.id}-${typeId}`}
                                    courseCreationId={courseCreationId}
                                    componentId={comp?.id}
                                    typeId={typeId}
                                    script={comp?.script}
                                    status={pillStatus(unit.id, typeId)}
                                    onRemove={() => removeType(unit.id, typeId)}
                                  />
                                );
                              })}
                              <div className="ai-studio-scripts__cards-add">
                                <AddComponentMenu
                                  existing={planned}
                                  onAdd={(t) => addType(unit.id, t)}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="ai-studio-scripts__footer">
        <Form.Group className="ai-studio-scripts__org">
          <Form.Label className="ai-studio-scripts__org-label">
            {intl.formatMessage(messages.buildOrgLabel)}
          </Form.Label>
          {allowedOrgs.length > 0 ? (
            <Form.Control
              as="select"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
            >
              {allowedOrgs.map((o) => <option key={o} value={o}>{o}</option>)}
            </Form.Control>
          ) : (
            <Form.Control
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder={intl.formatMessage(messages.buildOrgPlaceholder)}
            />
          )}
        </Form.Group>
        <Button
          variant="tertiary"
          onClick={onCreateCourse}
          disabled={!allReady || !org || startBuild.isPending}
          className="ai-studio-scripts__cta"
        >
          <RiFileList3Line size={18} />
          {intl.formatMessage(messages.createCourseCta)}
        </Button>
      </div>
    </div>
  );
};

export default ScriptsPanel;
