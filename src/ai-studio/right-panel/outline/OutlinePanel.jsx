import React, { useEffect, useMemo } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Skeleton } from '@openedx/paragon';
import { RiFileList3Line } from '@remixicon/react';
import messages from '../../messages';
import {
  useStructure,
  useComponentPlan,
  useGenerateComponentPlan,
} from '../../data/apiHooks';
import StructureTree from './StructureTree';
import './OutlinePanel.scss';

const buildPlanMap = (entries = []) => Object.fromEntries(
  entries.map((e) => [e.unitId, e.componentTypes || []]),
);

const OutlinePanel = ({ courseCreationId, onScriptsReady }) => {
  const intl = useIntl();
  const { data: structure = [], isLoading: sLoading } = useStructure(courseCreationId);
  const { data: planResp, isLoading: pLoading } = useComponentPlan(courseCreationId);
  const genPlan = useGenerateComponentPlan();

  const planEntries = planResp?.plan || [];
  const planByUnit = useMemo(() => buildPlanMap(planEntries), [planEntries]);

  // The backend returns one plan entry per unit even before components are
  // created — each with an empty `componentTypes` array. So "no plan yet"
  // means zero total component types across all entries, NOT zero entries.
  const totalTypes = useMemo(
    () => planEntries.reduce((n, e) => n + (e.componentTypes?.length || 0), 0),
    [planEntries],
  );

  useEffect(() => {
    if (
      !pLoading
      && totalTypes === 0
      && structure.length > 0
      && !genPlan.isPending
      && !genPlan.isError
    ) {
      genPlan.mutate(courseCreationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pLoading, totalTypes, structure.length, courseCreationId]);

  const busy = sLoading || pLoading || genPlan.isPending;

  return (
    <div className="ai-studio-outline">
      <h3 className="ai-studio-outline__title">
        {intl.formatMessage(messages.courseOutlineTitle)}
      </h3>
      <div className="ai-studio-outline__scroll">
        {busy ? (
          <>
            <Skeleton height={30} className="mb-2" />
            <Skeleton height={60} className="mb-2" />
            <Skeleton height={60} className="mb-2" />
            <Skeleton height={60} className="mb-2" />
          </>
        ) : (
          <StructureTree
            structure={structure}
            courseCreationId={courseCreationId}
            planByUnit={planByUnit}
          />
        )}
      </div>
      <div className="ai-studio-outline__footer">
        <Button
          variant="soft-primary"
          onClick={() => onScriptsReady?.()}
          disabled={busy || structure.length === 0 || totalTypes === 0}
          className="ai-studio-outline__cta"
        >
          <RiFileList3Line size={18} />
          {intl.formatMessage(messages.generateScriptCta)}
        </Button>
      </div>
    </div>
  );
};

export default OutlinePanel;
