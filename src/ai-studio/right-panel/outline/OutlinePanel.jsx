import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Form, Skeleton, Spinner,
} from '@openedx/paragon';
import { RiFileList3Line, RiSparkling2Line } from '@remixicon/react';
import messages from '../../messages';
import {
  useStructure,
  useComponentPlan,
  useGenerateComponentPlan,
  useRefineStructure,
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
  const refine = useRefineStructure();
  const [refineOpen, setRefineOpen] = useState(false);
  const [instruction, setInstruction] = useState('');

  const submitRefine = () => {
    if (!instruction.trim()) { return; }
    refine.mutate(
      { courseCreationId, instruction: instruction.trim() },
      { onSuccess: () => { setRefineOpen(false); setInstruction(''); } },
    );
  };

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
      <div className="ai-studio-outline__refine">
        {!refineOpen ? (
          <Button
            variant="link"
            size="sm"
            onClick={() => setRefineOpen(true)}
            disabled={busy || structure.length === 0}
            className="ai-studio-outline__refine-toggle"
          >
            <RiSparkling2Line size={16} />
            {intl.formatMessage(messages.refineOutlineCta)}
          </Button>
        ) : (
          <div className="ai-studio-outline__refine-box">
            <Form.Control
              as="textarea"
              rows={2}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={intl.formatMessage(messages.refineOutlinePlaceholder)}
              disabled={refine.isPending}
            />
            <div className="ai-studio-outline__refine-actions">
              <Button
                size="sm"
                variant="tertiary"
                onClick={() => { setRefineOpen(false); setInstruction(''); }}
                disabled={refine.isPending}
              >
                {intl.formatMessage(messages.actionCancel)}
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={submitRefine}
                disabled={refine.isPending || !instruction.trim()}
                iconBefore={refine.isPending ? undefined : RiSparkling2Line}
              >
                {refine.isPending
                  ? <Spinner animation="border" size="sm" screenReaderText={intl.formatMessage(messages.refineSubmit)} />
                  : intl.formatMessage(messages.refineSubmit)}
              </Button>
            </div>
          </div>
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
