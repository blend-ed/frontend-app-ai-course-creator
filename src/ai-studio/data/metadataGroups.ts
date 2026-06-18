import messages from '../messages';

// MessageDescriptor shape from react-intl. Kept loose to avoid pulling react-intl types here.
type MessageDescriptor = { id: string; defaultMessage: string };

export interface MetadataSlot {
  key: string;
  label: MessageDescriptor;
  type?: 'string' | 'array' | 'number';
}

export interface MetadataGroup {
  id: string;
  title: MessageDescriptor;
  slots: MetadataSlot[];
}

export const METADATA_GROUPS: MetadataGroup[] = [
  {
    id: 'source',
    title: messages.metadataGroupSource,
    slots: [
      { key: 'source', label: messages.metadataSlotSource, type: 'string' },
      { key: 'topic_summary', label: messages.metadataSlotTopic, type: 'string' },
      { key: 'title', label: messages.metadataSlotTitle, type: 'string' },
    ],
  },
  {
    id: 'audience',
    title: messages.metadataGroupAudience,
    slots: [
      { key: 'audience', label: messages.metadataSlotTargetAudience, type: 'string' },
      { key: 'proficiency', label: messages.metadataSlotProficiency, type: 'string' },
      { key: 'course_language', label: messages.metadataSlotLanguage, type: 'string' },
    ],
  },
  {
    id: 'tone',
    title: messages.metadataGroupTone,
    slots: [
      { key: 'tone', label: messages.metadataSlotTone, type: 'string' },
      { key: 'style_template', label: messages.metadataSlotStyleTemplate, type: 'string' },
    ],
  },
  {
    id: 'structure',
    title: messages.metadataGroupStructure,
    slots: [
      { key: 'sections_total', label: messages.metadataSlotSections, type: 'number' },
      { key: 'subsections_per_section', label: messages.metadataSlotSubsectionsPerSection, type: 'number' },
      { key: 'units_per_subsection', label: messages.metadataSlotUnitsPerSubsection, type: 'number' },
      { key: 'structure_source', label: messages.metadataSlotSourceType, type: 'string' },
    ],
  },
  {
    id: 'strategy',
    title: messages.metadataGroupStrategy,
    slots: [
      { key: 'instructional_strategy', label: messages.metadataSlotInstructionalStrategy, type: 'string' },
      { key: 'component_types', label: messages.metadataSlotComponentTypes, type: 'array' },
      { key: 'component_type_variant', label: messages.metadataSlotVariant, type: 'string' },
    ],
  },
  {
    id: 'goals',
    title: messages.metadataGroupGoals,
    slots: [
      { key: 'learning_objectives', label: messages.metadataSlotLearningObjectives, type: 'array' },
      { key: 'course_outcome', label: messages.metadataSlotCourseOutcome, type: 'string' },
    ],
  },
];
