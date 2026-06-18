import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from '../../messages';
import { METADATA_GROUPS } from '../../data/metadataGroups';
import { useUpdateMetadataField } from '../../data/apiHooks';
import BriefSlot from './BriefSlot';
import './CourseBriefPanel.scss';

// Flatten the 6-group config into a single ordered list of slots — matches the
// Figma mock (no visible group headers). The variant key is rendered separately
// below as one or two dropdowns, so drop it from the flat list.
const FLAT_SLOTS = METADATA_GROUPS
  .flatMap((g) => g.slots)
  .filter((s) => s.key !== 'component_type_variant');

// `source` mirrors the uploaded files (derived on the backend), so it stays
// read-only. Everything else is editable inline.
const READ_ONLY_KEYS = ['source'];

// Slots edited as a fixed-choice dropdown. Values are stored as-is (lowercase
// to match the backend enums); labels are message descriptors.
const SELECT_OPTIONS = {
  style_template: [
    { value: 'default', label: messages.styleTemplateDefault },
    { value: 'modern', label: messages.styleTemplateModern },
  ],
};

// Variant is stored as an object {video_variant, interactive_variant}; the GET
// endpoint may return it as an object or a JSON string.
const parseVariant = (raw) => {
  if (!raw) { return {}; }
  if (typeof raw === 'object') { return raw; }
  try { return JSON.parse(raw); } catch { return {}; }
};

const controlFor = (slot) => {
  if (slot.key === 'component_types') { return 'chips'; }
  if (SELECT_OPTIONS[slot.key]) { return 'select'; }
  if (slot.type === 'number') { return 'number'; }
  return 'text';
};

const CourseBriefPanel = ({
  metadataSummary = {},
  activeSlotKey,
  courseCreationId,
}) => {
  const intl = useIntl();
  const updateField = useUpdateMetadataField();

  const stateOf = (key) => {
    if (key === activeSlotKey) { return 'active'; }
    const v = metadataSummary[key];
    if (v == null || v === '') { return 'pending'; }
    if (Array.isArray(v) && v.length === 0) { return 'pending'; }
    return 'filled';
  };

  // The AI-avatar video option is org-specific; only offer it when the backend
  // reports the org has it configured.
  const aiAvatarEnabled = metadataSummary.ai_avatar_enabled === true;
  const componentTypes = Array.isArray(metadataSummary.component_types)
    ? metadataSummary.component_types
    : [];
  const variant = parseVariant(metadataSummary.component_type_variant);

  // Merge a single sub-key into the stored variant object and persist it.
  const writeVariant = (patch) => updateField.mutate({
    courseCreationId,
    key: 'component_type_variant',
    value: { ...variant, ...patch },
  });

  const videoVariantOptions = [
    { value: 'static_link', label: intl.formatMessage(messages.videoVariantStaticLink) },
    ...(aiAvatarEnabled
      ? [{ value: 'avatar_generated', label: intl.formatMessage(messages.videoVariantAvatar) }]
      : []),
  ];
  const interactiveVariantOptions = [
    { value: 'scenario_based', label: intl.formatMessage(messages.interactiveVariantScenario) },
    { value: 'roleplay', label: intl.formatMessage(messages.interactiveVariantRoleplay) },
    { value: 'simulation', label: intl.formatMessage(messages.interactiveVariantSimulation) },
  ];

  return (
    <div className="ai-studio-brief">
      <h3 className="ai-studio-brief__title">
        {intl.formatMessage(messages.courseBriefTitle)}
      </h3>
      <div className="ai-studio-brief__scroll">
        {FLAT_SLOTS.map((slot) => {
          const isEditable = courseCreationId && !READ_ONLY_KEYS.includes(slot.key);
          const options = SELECT_OPTIONS[slot.key]?.map((o) => ({
            value: o.value,
            label: intl.formatMessage(o.label),
          }));
          return (
            <BriefSlot
              key={slot.key}
              slotKey={slot.key}
              label={intl.formatMessage(slot.label)}
              value={metadataSummary[slot.key]}
              type={slot.type}
              state={stateOf(slot.key)}
              control={controlFor(slot)}
              options={options}
              onEdit={isEditable
                ? (value) => updateField.mutate({ courseCreationId, key: slot.key, value })
                : undefined}
            />
          );
        })}
        {courseCreationId && componentTypes.includes('video') && (
          <BriefSlot
            slotKey="video_variant"
            label={intl.formatMessage(messages.videoVariantLabel)}
            value={variant.video_variant || 'static_link'}
            type="string"
            state={variant.video_variant ? 'filled' : 'pending'}
            control="select"
            options={videoVariantOptions}
            onEdit={(v) => writeVariant({ video_variant: v })}
          />
        )}
        {courseCreationId && componentTypes.includes('interactive') && (
          <BriefSlot
            slotKey="interactive_variant"
            label={intl.formatMessage(messages.interactiveVariantLabel)}
            value={variant.interactive_variant || ''}
            type="string"
            state={variant.interactive_variant ? 'filled' : 'pending'}
            control="select"
            options={interactiveVariantOptions}
            onEdit={(v) => writeVariant({ interactive_variant: v })}
          />
        )}
      </div>
    </div>
  );
};

export default CourseBriefPanel;
