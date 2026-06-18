import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, ProgressBar } from '@openedx/paragon';
import { RiCheckboxCircleFill } from '@remixicon/react';
import messages from '../messages';
import { useBuildProgress } from '../data/apiHooks';
import { STAGES } from '../data/constants';
import './BuildingScreen.scss';

const BuildingScreen = ({ courseCreationId }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { data } = useBuildProgress(courseCreationId);

  const isSuccess = data?.stage === STAGES.SUCCESS;
  const pct = data?.progressTotal
    ? Math.min(100, Math.max(0, Math.round((data.progressCurrent / data.progressTotal) * 100)))
    : 0;

  return (
    <div className="ai-studio-building">
      <div className="ai-studio-building__content">
        {isSuccess ? (
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
        ) : (
          <>
            <div className="ai-studio-building__text">
              <h1 className="ai-studio-building__title">
                {intl.formatMessage(messages.buildingTitle)}
              </h1>
              <p className="ai-studio-building__subtitle">
                {intl.formatMessage(messages.buildingSubtitle)}
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
