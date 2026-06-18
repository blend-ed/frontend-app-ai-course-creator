import React from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';

import messages from './messages';
import CourseCreatorFlow from './CourseCreatorFlow';
import './AiStudioPage.scss';

const AiStudioPage = () => {
  const intl = useIntl();
  const { courseCreationId } = useParams();

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage(messages.pageTitle, { siteName: process.env.SITE_NAME })}
        </title>
      </Helmet>
      <div className="ai-studio-page">
        <CourseCreatorFlow courseCreationId={courseCreationId} />
      </div>
    </>
  );
};

export default AiStudioPage;
