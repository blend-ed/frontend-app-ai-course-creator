import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { METADATA_GROUPS } from '../data/metadataGroups';
import './MetadataSummaryCard.scss';

// Map each metadata key to its label descriptor, reusing the same labels the
// right-panel Course Brief uses so the inline confirmation card stays in sync.
const LABEL_BY_KEY = METADATA_GROUPS
  .flatMap((g) => g.slots)
  .reduce((acc, slot) => {
    acc[slot.key] = slot.label;
    return acc;
  }, {});

// Render order follows the brief's slot order; keys not in the config fall to
// the end in payload order.
const KEY_ORDER = METADATA_GROUPS.flatMap((g) => g.slots).map((s) => s.key);

const humanize = (value) => {
  if (Array.isArray(value)) { return value.map(humanize).join(', '); }
  if (value == null) { return ''; }
  if (typeof value === 'string') {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return String(value);
};

const MetadataSummaryCard = ({ summary }) => {
  const intl = useIntl();
  if (!summary || typeof summary !== 'object') { return null; }

  const entries = Object.entries(summary)
    .filter(([, v]) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0))
    .sort(([a], [b]) => {
      const ia = KEY_ORDER.indexOf(a);
      const ib = KEY_ORDER.indexOf(b);
      return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
    });

  if (entries.length === 0) { return null; }

  return (
    <div className="ai-studio-summary-card">
      {entries.map(([key, value]) => {
        const labelDescriptor = LABEL_BY_KEY[key];
        const label = labelDescriptor
          ? intl.formatMessage(labelDescriptor)
          : humanize(key);
        return (
          <div key={key} className="ai-studio-summary-card__row">
            <span className="ai-studio-summary-card__label">{label}</span>
            <span className="ai-studio-summary-card__value">{humanize(value)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MetadataSummaryCard;
