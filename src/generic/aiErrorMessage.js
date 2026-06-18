const AI_CREDITS_EXHAUSTED_CODE = 'ai_credits_exhausted';

/**
 * Pull the backend's human-readable error from an axios error. blendxai AI
 * endpoints return `{ message, error, error_code }`; on an out-of-credits
 * (HTTP 402) failure this carries the user-facing "credits exhausted" text.
 * Falls back to the provided string when no backend body is present (network
 * error, timeout, etc.).
 *
 * @param {object} error - the caught axios error
 * @param {string} [fallback] - message to use when no backend body is present
 * @returns {string}
 */
export const getAiErrorMessage = (error, fallback = '') => {
  const data = error?.response?.data;
  return data?.message || data?.error || fallback;
};

/** True when the failure is an org-out-of-AI-credits (HTTP 402) response. */
export const isAiCreditsExhausted = (error) => (
  error?.response?.status === 402
  || error?.response?.data?.error_code === AI_CREDITS_EXHAUSTED_CODE
);
