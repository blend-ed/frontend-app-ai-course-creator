import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';

import messages from '../messages';
import HistoryScreen from './HistoryScreen';
import '../AiStudioPage.scss';

const AiStudioHistoryPage = () => {
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage(messages.pageTitle, { siteName: process.env.SITE_NAME })}
        </title>
      </Helmet>
      <div className="ai-studio-page">
        <HistoryScreen />
      </div>
    </>
  );
};

export default AiStudioHistoryPage;
