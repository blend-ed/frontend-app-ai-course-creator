import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageTitle: {
    id: 'course-authoring.ai-studio.page.title',
    defaultMessage: 'AI Studio | {siteName}',
  },
  // Landing
  landingHeading: {
    id: 'course-authoring.ai-studio.landing.heading',
    defaultMessage: 'Create Engaging Courses<br></br>Using AI.',
  },
  landingSubtitle: {
    id: 'course-authoring.ai-studio.landing.subtitle',
    defaultMessage: 'Unlock the potential of AI to design interactive learning experiences for everyone.',
  },
  landingPromptPlaceholder: {
    id: 'course-authoring.ai-studio.landing.placeholder',
    defaultMessage: 'What should the course be about?…',
  },
  uploadLabel: {
    id: 'course-authoring.ai-studio.upload',
    defaultMessage: 'Upload',
  },
  sendAriaLabel: {
    id: 'course-authoring.ai-studio.send',
    defaultMessage: 'Send',
  },
  // Chat
  chatPlaceholder: {
    id: 'course-authoring.ai-studio.chat.placeholder',
    defaultMessage: 'Ask anything…',
  },
  typingIndicator: {
    id: 'course-authoring.ai-studio.chat.thinking',
    defaultMessage: 'AI is thinking…',
  },
  chatErrorFallback: {
    id: 'course-authoring.ai-studio.chat.error.fallback',
    defaultMessage: 'Could not send message. Please try again.',
  },
  selectAllThatApply: {
    id: 'course-authoring.ai-studio.options.multi',
    defaultMessage: 'Select all that apply',
  },
  submitOptions: {
    id: 'course-authoring.ai-studio.options.submit',
    defaultMessage: 'Submit',
  },
  // Course Brief
  courseBriefTitle: {
    id: 'course-authoring.ai-studio.brief.title',
    defaultMessage: 'Course Brief',
  },
  createOutlineCta: {
    id: 'course-authoring.ai-studio.brief.cta',
    defaultMessage: 'Create Outline',
  },
  // Outline
  courseOutlineTitle: {
    id: 'course-authoring.ai-studio.outline.title',
    defaultMessage: 'Course Outline',
  },
  generateScriptCta: {
    id: 'course-authoring.ai-studio.outline.cta',
    defaultMessage: 'Generate Script',
  },
  addSection: {
    id: 'course-authoring.ai-studio.outline.add.section',
    defaultMessage: 'Add Section',
  },
  addSubsection: {
    id: 'course-authoring.ai-studio.outline.add.subsection',
    defaultMessage: 'Add Subsection',
  },
  addUnit: {
    id: 'course-authoring.ai-studio.outline.add.unit',
    defaultMessage: 'Add Unit',
  },
  // Scripts
  scriptGenerationTitle: {
    id: 'course-authoring.ai-studio.scripts.title',
    defaultMessage: 'Script Generation',
  },
  scriptCounter: {
    id: 'course-authoring.ai-studio.scripts.counter',
    defaultMessage: 'Generating Scripts for Components ({current} of {total})',
  },
  scriptInQueue: {
    id: 'course-authoring.ai-studio.scripts.queue',
    defaultMessage: 'In queue',
  },
  createCourseCta: {
    id: 'course-authoring.ai-studio.scripts.cta',
    defaultMessage: 'Create Course',
  },
  resumeScripts: {
    id: 'course-authoring.ai-studio.scripts.resume',
    defaultMessage: 'Resume script generation',
  },
  buildOrgLabel: {
    id: 'course-authoring.ai-studio.scripts.buildOrgLabel',
    defaultMessage: 'Organization',
  },
  buildOrgPlaceholder: {
    id: 'course-authoring.ai-studio.scripts.buildOrgPlaceholder',
    defaultMessage: 'e.g. edX',
  },
  // Building
  buildingTitle: {
    id: 'course-authoring.ai-studio.building.title',
    defaultMessage: 'Your Course is being created',
  },
  buildingSubtitle: {
    id: 'course-authoring.ai-studio.building.subtitle',
    defaultMessage: 'The process will take a few minutes. We\u2019ll send you an email notification when your course is ready',
  },
  buildingStillWorking: {
    id: 'course-authoring.ai-studio.building.stillWorking',
    defaultMessage: 'This is taking longer than usual\u2026',
  },
  buildFailedTitle: {
    id: 'course-authoring.ai-studio.building.failedTitle',
    defaultMessage: 'Course creation failed',
  },
  buildFailedFallback: {
    id: 'course-authoring.ai-studio.building.failedFallback',
    defaultMessage: 'Something went wrong while building your course.',
  },
  retryCta: {
    id: 'course-authoring.ai-studio.retry.cta',
    defaultMessage: 'Retry',
  },
  goToAiStudio: {
    id: 'course-authoring.ai-studio.building.back',
    defaultMessage: 'Go to AI Studio',
  },
  history: {
    id: 'course-authoring.ai-studio.building.history',
    defaultMessage: 'History',
  },
  creationHistory: {
    id: 'course-authoring.ai-studio.landing.creationHistory',
    defaultMessage: 'Creation history',
  },
  historyTitle: {
    id: 'course-authoring.ai-studio.history.title',
    defaultMessage: 'Your creation history',
  },
  historyDeleteThread: {
    id: 'course-authoring.ai-studio.history.deleteThread',
    defaultMessage: 'Delete',
  },
  historyDeleteConfirmTitle: {
    id: 'course-authoring.ai-studio.history.deleteConfirmTitle',
    defaultMessage: 'Delete this course draft?',
  },
  historyDeleteConfirmBody: {
    id: 'course-authoring.ai-studio.history.deleteConfirmBody',
    defaultMessage: 'This removes “{title}” and its chat, outline and scripts. Any course already built from it is not affected. This cannot be undone.',
  },
  historyNewCourse: {
    id: 'course-authoring.ai-studio.history.newCourse',
    defaultMessage: 'New course',
  },
  historySearchPlaceholder: {
    id: 'course-authoring.ai-studio.history.searchPlaceholder',
    defaultMessage: 'Search your creation',
  },
  historyGroupToday: {
    id: 'course-authoring.ai-studio.history.groupToday',
    defaultMessage: 'Today',
  },
  historyGroupOlder: {
    id: 'course-authoring.ai-studio.history.groupOlder',
    defaultMessage: 'Older',
  },
  historyEmpty: {
    id: 'course-authoring.ai-studio.history.empty',
    defaultMessage: 'No course creations yet.',
  },
  historyEmptySearch: {
    id: 'course-authoring.ai-studio.history.emptySearch',
    defaultMessage: 'No creations match your search.',
  },
  historyLoading: {
    id: 'course-authoring.ai-studio.history.loading',
    defaultMessage: 'Loading',
    description: 'Screen reader label for the spinner shown while loading course creation history.',
  },
  historyStageInit: {
    id: 'course-authoring.ai-studio.history.stage.init',
    defaultMessage: 'Setting up…',
  },
  historyStageMetadata: {
    id: 'course-authoring.ai-studio.history.stage.metadata',
    defaultMessage: 'Collecting course details…',
  },
  historyStageOutline: {
    id: 'course-authoring.ai-studio.history.stage.outline',
    defaultMessage: 'Drafting outline…',
  },
  historyStageComponentPlan: {
    id: 'course-authoring.ai-studio.history.stage.componentPlan',
    defaultMessage: 'Planning components…',
  },
  historyStageScripts: {
    id: 'course-authoring.ai-studio.history.stage.scripts',
    defaultMessage: 'Generating scripts…',
  },
  historyStageBuilding: {
    id: 'course-authoring.ai-studio.history.stage.building',
    defaultMessage: 'Building course…',
  },
  historyStageCompleted: {
    id: 'course-authoring.ai-studio.history.stage.completed',
    defaultMessage: 'Completed',
  },
  historyStageFailed: {
    id: 'course-authoring.ai-studio.history.stage.failed',
    defaultMessage: 'Failed',
  },
  historyUntitled: {
    id: 'course-authoring.ai-studio.history.untitled',
    defaultMessage: 'Untitled course',
  },
  progressTitle: {
    id: 'course-authoring.ai-studio.history.progress.title',
    defaultMessage: 'Creation progress',
  },
  progressOutline: {
    id: 'course-authoring.ai-studio.history.progress.outline',
    defaultMessage: 'Course outline',
  },
  progressScripts: {
    id: 'course-authoring.ai-studio.history.progress.scripts',
    defaultMessage: 'Script generation',
  },
  progressAssembly: {
    id: 'course-authoring.ai-studio.history.progress.assembly',
    defaultMessage: 'Course assembly',
  },
  buildSuccessTitle: {
    id: 'course-authoring.ai-studio.building.success.title',
    defaultMessage: 'Course created successfully',
  },
  viewCourseCta: {
    id: 'course-authoring.ai-studio.building.success.cta',
    defaultMessage: 'View Course',
  },
  // Component types
  componentTypeText: {
    id: 'course-authoring.ai-studio.componentType.text',
    defaultMessage: 'Text',
  },
  componentTypeImage: {
    id: 'course-authoring.ai-studio.componentType.image',
    defaultMessage: 'Image',
  },
  componentTypeVideo: {
    id: 'course-authoring.ai-studio.componentType.video',
    defaultMessage: 'Video',
  },
  componentTypeMultipleChoice: {
    id: 'course-authoring.ai-studio.componentType.multipleChoice',
    defaultMessage: 'Multiple Choice',
  },
  componentTypeCheckbox: {
    id: 'course-authoring.ai-studio.componentType.checkbox',
    defaultMessage: 'Checkbox',
  },
  componentTypeTextInput: {
    id: 'course-authoring.ai-studio.componentType.textInput',
    defaultMessage: 'Text Input',
  },
  componentTypeDropdown: {
    id: 'course-authoring.ai-studio.componentType.dropdown',
    defaultMessage: 'Dropdown',
  },
  componentTypeNumerical: {
    id: 'course-authoring.ai-studio.componentType.numerical',
    defaultMessage: 'Numerical',
  },
  componentTypeInteractive: {
    id: 'course-authoring.ai-studio.componentType.interactive',
    defaultMessage: 'Interactive',
  },
  // Metadata group titles
  metadataGroupSource: {
    id: 'course-authoring.ai-studio.metadataGroup.source',
    defaultMessage: 'Source',
  },
  metadataGroupAudience: {
    id: 'course-authoring.ai-studio.metadataGroup.audience',
    defaultMessage: 'Audience',
  },
  metadataGroupTone: {
    id: 'course-authoring.ai-studio.metadataGroup.tone',
    defaultMessage: 'Tone & Style',
  },
  metadataGroupStructure: {
    id: 'course-authoring.ai-studio.metadataGroup.structure',
    defaultMessage: 'Structure',
  },
  metadataGroupStrategy: {
    id: 'course-authoring.ai-studio.metadataGroup.strategy',
    defaultMessage: 'Content Strategy',
  },
  metadataGroupGoals: {
    id: 'course-authoring.ai-studio.metadataGroup.goals',
    defaultMessage: 'Goals & Outcomes',
  },
  // Metadata slot labels
  metadataSlotSource: {
    id: 'course-authoring.ai-studio.metadataSlot.source',
    defaultMessage: 'Source',
  },
  metadataSlotTopic: {
    id: 'course-authoring.ai-studio.metadataSlot.topic',
    defaultMessage: 'Topic',
  },
  metadataSlotTitle: {
    id: 'course-authoring.ai-studio.metadataSlot.title',
    defaultMessage: 'Title',
  },
  metadataSlotTargetAudience: {
    id: 'course-authoring.ai-studio.metadataSlot.targetAudience',
    defaultMessage: 'Target Audience',
  },
  metadataSlotProficiency: {
    id: 'course-authoring.ai-studio.metadataSlot.proficiency',
    defaultMessage: 'Proficiency',
  },
  metadataSlotLanguage: {
    id: 'course-authoring.ai-studio.metadataSlot.language',
    defaultMessage: 'Language',
  },
  metadataSlotTone: {
    id: 'course-authoring.ai-studio.metadataSlot.tone',
    defaultMessage: 'Tone',
  },
  metadataSlotStyleTemplate: {
    id: 'course-authoring.ai-studio.metadataSlot.styleTemplate',
    defaultMessage: 'Style Template',
  },
  metadataSlotSections: {
    id: 'course-authoring.ai-studio.metadataSlot.sections',
    defaultMessage: 'Sections',
  },
  metadataSlotSubsectionsPerSection: {
    id: 'course-authoring.ai-studio.metadataSlot.subsectionsPerSection',
    defaultMessage: 'Subsections per Section',
  },
  metadataSlotUnitsPerSubsection: {
    id: 'course-authoring.ai-studio.metadataSlot.unitsPerSubsection',
    defaultMessage: 'Units per Subsection',
  },
  metadataSlotSourceType: {
    id: 'course-authoring.ai-studio.metadataSlot.sourceType',
    defaultMessage: 'Source Type',
  },
  metadataSlotInstructionalStrategy: {
    id: 'course-authoring.ai-studio.metadataSlot.instructionalStrategy',
    defaultMessage: 'Instructional Strategy',
  },
  metadataSlotComponentTypes: {
    id: 'course-authoring.ai-studio.metadataSlot.componentTypes',
    defaultMessage: 'Component Types',
  },
  metadataSlotVariant: {
    id: 'course-authoring.ai-studio.metadataSlot.variant',
    defaultMessage: 'Variant',
  },
  // Video variant dropdown (the AI-avatar option is shown only when the org
  // has AI avatar configured — see ai_avatar_enabled in the metadata summary).
  videoVariantLabel: {
    id: 'course-authoring.ai-studio.brief.videoVariant',
    defaultMessage: 'Video style',
  },
  videoVariantStaticLink: {
    id: 'course-authoring.ai-studio.brief.videoVariant.staticLink',
    defaultMessage: 'Static link (YouTube/Vimeo)',
  },
  videoVariantAvatar: {
    id: 'course-authoring.ai-studio.brief.videoVariant.avatar',
    defaultMessage: 'AI avatar',
  },
  // Interactive variant dropdown.
  interactiveVariantLabel: {
    id: 'course-authoring.ai-studio.brief.interactiveVariant',
    defaultMessage: 'Interactive style',
  },
  interactiveVariantScenario: {
    id: 'course-authoring.ai-studio.brief.interactiveVariant.scenario',
    defaultMessage: 'Scenario based',
  },
  interactiveVariantRoleplay: {
    id: 'course-authoring.ai-studio.brief.interactiveVariant.roleplay',
    defaultMessage: 'Roleplay',
  },
  interactiveVariantSimulation: {
    id: 'course-authoring.ai-studio.brief.interactiveVariant.simulation',
    defaultMessage: 'Simulation',
  },
  metadataSlotLearningObjectives: {
    id: 'course-authoring.ai-studio.metadataSlot.learningObjectives',
    defaultMessage: 'Learning Objectives',
  },
  metadataSlotCourseOutcome: {
    id: 'course-authoring.ai-studio.metadataSlot.courseOutcome',
    defaultMessage: 'Course Outcome',
  },
  // Style Template options (stored lowercase; see STYLE_TEMPLATE_VALUES backend).
  styleTemplateDefault: {
    id: 'course-authoring.ai-studio.styleTemplate.default',
    defaultMessage: 'Default',
  },
  styleTemplateModern: {
    id: 'course-authoring.ai-studio.styleTemplate.modern',
    defaultMessage: 'Modern',
  },
  // Common action labels (reused across components)
  actionEdit: {
    id: 'course-authoring.ai-studio.action.edit',
    defaultMessage: 'Edit',
  },
  actionSave: {
    id: 'course-authoring.ai-studio.action.save',
    defaultMessage: 'Save',
  },
  actionCancel: {
    id: 'course-authoring.ai-studio.action.cancel',
    defaultMessage: 'Cancel',
  },
  actionClose: {
    id: 'course-authoring.ai-studio.action.close',
    defaultMessage: 'Close',
  },
  // Landing
  removeFile: {
    id: 'course-authoring.ai-studio.landing.removeFile',
    defaultMessage: 'Remove file',
  },
  // Outline
  untitledPlaceholder: {
    id: 'course-authoring.ai-studio.outline.untitled',
    defaultMessage: 'Untitled',
  },
  deleteUnit: {
    id: 'course-authoring.ai-studio.outline.deleteUnit',
    defaultMessage: 'Delete unit',
  },
  deleteSubsection: {
    id: 'course-authoring.ai-studio.outline.deleteSubsection',
    defaultMessage: 'Delete subsection',
  },
  deleteSection: {
    id: 'course-authoring.ai-studio.outline.deleteSection',
    defaultMessage: 'Delete section',
  },
  moveUp: {
    id: 'course-authoring.ai-studio.outline.moveUp',
    defaultMessage: 'Move up',
  },
  moveDown: {
    id: 'course-authoring.ai-studio.outline.moveDown',
    defaultMessage: 'Move down',
  },
  removeComponent: {
    id: 'course-authoring.ai-studio.outline.removeComponent',
    defaultMessage: 'Remove {label}',
  },
  // AI refine (scripts + outline)
  actionRefine: {
    id: 'course-authoring.ai-studio.action.refine',
    defaultMessage: 'Refine with AI',
  },
  refineInstructionPlaceholder: {
    id: 'course-authoring.ai-studio.refine.script.placeholder',
    defaultMessage: 'Describe how to improve this script…',
  },
  refineSubmit: {
    id: 'course-authoring.ai-studio.refine.submit',
    defaultMessage: 'Refine',
  },
  refineOutlineCta: {
    id: 'course-authoring.ai-studio.refine.outline.cta',
    defaultMessage: 'Refine outline with AI',
  },
  refineOutlinePlaceholder: {
    id: 'course-authoring.ai-studio.refine.outline.placeholder',
    defaultMessage: 'Describe how to change the outline (e.g. "add a section on testing")…',
  },
  // Prompts admin
  promptsTitle: {
    id: 'course-authoring.ai-studio.prompts.title',
    defaultMessage: 'Prompt customization',
  },
  promptsSubtitle: {
    id: 'course-authoring.ai-studio.prompts.subtitle',
    defaultMessage: 'Override the built-in AI prompts or append company business-logic instructions. Staff only.',
  },
  promptsBackToStudio: {
    id: 'course-authoring.ai-studio.prompts.back',
    defaultMessage: 'Back to AI Studio',
  },
  promptsForbidden: {
    id: 'course-authoring.ai-studio.prompts.forbidden',
    defaultMessage: 'You need staff access to manage prompts.',
  },
  promptsOverridesHeading: {
    id: 'course-authoring.ai-studio.prompts.overrides.heading',
    defaultMessage: 'Prompt overrides',
  },
  promptsOverridesHelp: {
    id: 'course-authoring.ai-studio.prompts.overrides.help',
    defaultMessage: 'Replace a named prompt for one org or globally. Use $placeholders for dynamic values; the built-in default is used when no active override matches.',
  },
  promptsAddendaHeading: {
    id: 'course-authoring.ai-studio.prompts.addenda.heading',
    defaultMessage: 'Business-logic instructions',
  },
  promptsAddendaHelp: {
    id: 'course-authoring.ai-studio.prompts.addenda.help',
    defaultMessage: 'Extra instructions appended to the chat and generation prompts. A global entry applies to every org; a per-org entry is appended after it.',
  },
  promptsFieldKey: {
    id: 'course-authoring.ai-studio.prompts.field.key',
    defaultMessage: 'Prompt',
  },
  promptsFieldOrg: {
    id: 'course-authoring.ai-studio.prompts.field.org',
    defaultMessage: 'Organization (blank = global)',
  },
  promptsFieldBody: {
    id: 'course-authoring.ai-studio.prompts.field.body',
    defaultMessage: 'Body',
  },
  promptsFieldActive: {
    id: 'course-authoring.ai-studio.prompts.field.active',
    defaultMessage: 'Active',
  },
  promptsScopeGlobal: {
    id: 'course-authoring.ai-studio.prompts.scope.global',
    defaultMessage: 'Global',
  },
  promptsCreate: {
    id: 'course-authoring.ai-studio.prompts.create',
    defaultMessage: 'Add',
  },
  promptsUpdate: {
    id: 'course-authoring.ai-studio.prompts.update',
    defaultMessage: 'Save changes',
  },
  promptsEmpty: {
    id: 'course-authoring.ai-studio.prompts.empty',
    defaultMessage: 'None yet.',
  },
  promptsInactiveBadge: {
    id: 'course-authoring.ai-studio.prompts.inactive',
    defaultMessage: 'Inactive',
  },
  promptsDeleteTitle: {
    id: 'course-authoring.ai-studio.prompts.delete.title',
    defaultMessage: 'Delete this entry?',
  },
  promptsDeleteBody: {
    id: 'course-authoring.ai-studio.prompts.delete.body',
    defaultMessage: 'This removes the customization and the built-in default prompt is used again. This cannot be undone.',
  },
  actionDelete: {
    id: 'course-authoring.ai-studio.action.delete',
    defaultMessage: 'Delete',
  },
  // Prompt editor (card-based admin page)
  promptsBack: {
    id: 'course-authoring.ai-studio.prompts.back',
    defaultMessage: 'Back to AI Studio',
  },
  promptsHeading: {
    id: 'course-authoring.ai-studio.prompts.heading',
    defaultMessage: 'AI prompt settings',
  },
  promptsScopeLabel: {
    id: 'course-authoring.ai-studio.prompts.scope.label',
    defaultMessage: 'Organisation',
  },
  promptsScopeContext: {
    id: 'course-authoring.ai-studio.prompts.scope.context',
    defaultMessage: 'Editing prompts for {org}',
  },
  promptsNoOrg: {
    id: 'course-authoring.ai-studio.prompts.scope.none',
    defaultMessage: 'No organisation is available, so prompt settings cannot be edited here.',
  },
  promptsLoadError: {
    id: 'course-authoring.ai-studio.prompts.loadError',
    defaultMessage: 'Could not load prompt settings. Please try again.',
  },
  promptsOverridesHint: {
    id: 'course-authoring.ai-studio.prompts.overrides.hint',
    defaultMessage: 'Replace a built-in prompt template. Reference dynamic values with $placeholders (e.g. $course_title).',
  },
  promptsAddendumHeading: {
    id: 'course-authoring.ai-studio.prompts.addendum.heading',
    defaultMessage: 'Prompt addendum',
  },
  promptsAddendumHint: {
    id: 'course-authoring.ai-studio.prompts.addendum.hint',
    defaultMessage: 'Extra instructions appended to the chat and generation prompts, without replacing the base prompts.',
  },
  promptsBodyPlaceholder: {
    id: 'course-authoring.ai-studio.prompts.body.placeholder',
    defaultMessage: 'Using the default prompt. Type here to override it…',
  },
  promptsAddendumPlaceholder: {
    id: 'course-authoring.ai-studio.prompts.addendum.placeholder',
    defaultMessage: 'No additional instructions. Type here to add some…',
  },
  promptsActiveLabel: {
    id: 'course-authoring.ai-studio.prompts.active',
    defaultMessage: 'Active',
  },
  promptsActiveHint: {
    id: 'course-authoring.ai-studio.prompts.active.hint',
    defaultMessage: 'When off, this entry is saved but ignored (the default is used).',
  },
  promptsReset: {
    id: 'course-authoring.ai-studio.prompts.reset',
    defaultMessage: 'Reset to default',
  },
  promptsCustomizedBadge: {
    id: 'course-authoring.ai-studio.prompts.customized',
    defaultMessage: 'Customized',
  },
  promptsSaved: {
    id: 'course-authoring.ai-studio.prompts.saved',
    defaultMessage: 'Saved.',
  },
  promptsError: {
    id: 'course-authoring.ai-studio.prompts.error',
    defaultMessage: 'Could not save. Please try again.',
  },
  // Prompt key labels
  promptKeySystem: {
    id: 'course-authoring.ai-studio.prompts.key.system',
    defaultMessage: 'Chat system prompt',
  },
  promptKeySystemHelp: {
    id: 'course-authoring.ai-studio.prompts.key.system.help',
    defaultMessage: 'Governs the assistant that interviews the author and collects course metadata.',
  },
  promptKeyComponentPlan: {
    id: 'course-authoring.ai-studio.prompts.key.componentPlan',
    defaultMessage: 'Component plan',
  },
  promptKeyComponentPlanHelp: {
    id: 'course-authoring.ai-studio.prompts.key.componentPlan.help',
    defaultMessage: 'Decides which component types each unit should contain.',
  },
  promptKeyScriptGeneration: {
    id: 'course-authoring.ai-studio.prompts.key.scriptGeneration',
    defaultMessage: 'Script generation',
  },
  promptKeyScriptGenerationHelp: {
    id: 'course-authoring.ai-studio.prompts.key.scriptGeneration.help',
    defaultMessage: 'Turns a unit into the content scripts for each component.',
  },
  promptKeyScriptRefinement: {
    id: 'course-authoring.ai-studio.prompts.key.scriptRefinement',
    defaultMessage: 'Script refinement',
  },
  promptKeyScriptRefinementHelp: {
    id: 'course-authoring.ai-studio.prompts.key.scriptRefinement.help',
    defaultMessage: 'Revises an existing script in response to author feedback.',
  },
  promptKeyStructureRefinement: {
    id: 'course-authoring.ai-studio.prompts.key.structureRefinement',
    defaultMessage: 'Structure refinement',
  },
  promptKeyStructureRefinementHelp: {
    id: 'course-authoring.ai-studio.prompts.key.structureRefinement.help',
    defaultMessage: 'Revises the course outline in response to author feedback.',
  },
  promptKeyOlxGeneration: {
    id: 'course-authoring.ai-studio.prompts.key.olxGeneration',
    defaultMessage: 'OLX generation',
  },
  promptKeyOlxGenerationHelp: {
    id: 'course-authoring.ai-studio.prompts.key.olxGeneration.help',
    defaultMessage: 'Converts a content script into the OLX a component is built from.',
  },
});

export default messages;
