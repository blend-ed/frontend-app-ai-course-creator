import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert, Button, ProgressBar } from '@openedx/paragon';
import { Error as ErrorIcon } from '@openedx/paragon/icons';
import { RiCheckboxCircleFill, RiLoopLeftLine } from '@remixicon/react';
import messages from '../messages';
import { useBuildProgress, useStartBuild, useAllowedOrgs } from '../data/apiHooks';
import { randomCourseNumber, randomCourseRun } from '../data/randomRun';
import { STAGES } from '../data/constants';
import './BuildingScreen.scss';

const BuildingScreen = ({ courseCreationId }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { data } = useBuildProgress(courseCreationId);
  const startBuild = useStartBuild();
  const { data: orgInfo } = useAllowedOrgs();

  const stage = data?.stage;
  const isSuccess = stage === STAGES.SUCCESS;
  const isFailed = stage === STAGES.FAILED;
  const pct = data?.progressTotal
    ? Math.min(100, Math.max(0, Math.round((data.progressCurrent / data.progressTotal) * 100)))
    : 0;

  // Show a "still working" hint if progress hasn't changed for 60s.
  const [stalled, setStalled] = useState(false);
  const sig = `${data?.progressCurrent}|${data?.progressTotal}|${data?.progressDetail}`;
  const lastSigRef = useRef(sig);
  const lastChangeRef = useRef(Date.now());

  useEffect(() => {
    if (sig !== lastSigRef.current) {
      lastSigRef.current = sig;
      lastChangeRef.current = Date.now();
      setStalled(false);
    }
  }, [sig]);

  useEffect(() => {
    if (stage !== STAGES.BUILDING) {
      setStalled(false);
      return undefined;
    }
    const timer = setInterval(() => {
      if (Date.now() - lastChangeRef.current > 60000) {
        setStalled(true);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [stage]);

  const onRetry = () => {
    const allowedOrgs = orgInfo?.allowedOrganizations || [];
    startBuild.mutate({
      courseCreationId,
      org: allowedOrgs[0] || 'default',
      number: randomCourseNumber(),
      run: randomCourseRun(),
    });
  };

  return (
    <div className="ai-studio-building">
      <div className="ai-studio-building__content">
        {isSuccess && (
          <>
            <div className="ai-studio-building__check">
              <RiCheckboxCircleFill size={56} color="var(--pgn-color-success-500)" />
            </div>
            <h1 className="ai-studio-building__title">
              {intl.formatMessage(messages.buildSuccessTitle)}
            </h1>
            <div className="ai-studio-building__actions">
              <Button
                variant="tertiary"
                className="ai-studio-building__btn-secondary"
                onClick={() => navigate('/ai-studio')}
              >
                {intl.formatMessage(messages.goToAiStudio)}
              </Button>
              {data?.courseKey && (
                <Button
                  as="a"
                  variant="primary"
                  className="ai-studio-building__btn-primary"
                  href={`${getConfig().STUDIO_BASE_URL}/course/${data.courseKey}`}
                >
                  {intl.formatMessage(messages.viewCourseCta)}
                </Button>
              )}
            </div>
          </>
        )}

        {isFailed && (
          <>
            <h1 className="ai-studio-building__title">
              {intl.formatMessage(messages.buildFailedTitle)}
            </h1>
            <Alert variant="danger" icon={ErrorIcon}>
              {data?.errorMessage || intl.formatMessage(messages.buildFailedFallback)}
            </Alert>
            <div className="ai-studio-building__actions">
              <Button
                variant="tertiary"
                className="ai-studio-building__btn-secondary"
                onClick={() => navigate('/ai-studio')}
              >
                {intl.formatMessage(messages.goToAiStudio)}
              </Button>
              <Button
                variant="primary"
                className="ai-studio-building__btn-primary"
                iconBefore={RiLoopLeftLine}
                onClick={onRetry}
                disabled={startBuild.isPending}
              >
                {intl.formatMessage(messages.retryCta)}
              </Button>
            </div>
          </>
        )}

        {!isSuccess && !isFailed && (
          <>
            <div className="ai-studio-building__text">
              <h1 className="ai-studio-building__title">
                {intl.formatMessage(messages.buildingTitle)}
              </h1>
              <p className="ai-studio-building__subtitle">
                {intl.formatMessage(stalled ? messages.buildingStillWorking : messages.buildingSubtitle)}
              </p>
            </div>
            <ProgressBar
              now={pct}
              className="ai-studio-building__progress"
            />
            <div className="ai-studio-building__actions">
              <Button
                variant="tertiary"
                className="ai-studio-building__btn-secondary"
                onClick={() => navigate('/ai-studio')}
              >
                {intl.formatMessage(messages.goToAiStudio)}
              </Button>
              <Button
                variant="primary"
                className="ai-studio-building__btn-primary"
                size="lg"
                onClick={() => navigate('/ai-studio/history')}
              >
                {intl.formatMessage(messages.history)}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuildingScreen;
