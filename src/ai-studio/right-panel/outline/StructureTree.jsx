import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { IconButton } from '@openedx/paragon';
import { RiDeleteBinLine } from '@remixicon/react';
import InlineRename from './InlineRename';
import UnitRow from './UnitRow';
import AddStructureMenu from './AddStructureMenu';
import MoveControls from './MoveControls';
import messages from '../../messages';
import {
  useRenameNode,
  useDeleteNode,
  useAddStructureNode,
} from '../../data/apiHooks';

// Subsection wraps its units inside `.ai-studio-outline__units-wrapper` so
// the vertical divider + L-shape connectors can be drawn with CSS pseudo-
// elements anchored to that wrapper (see OutlinePanel.scss).
const Subsection = ({
  node, courseCreationId, planByUnit, siblingIds, index,
}) => {
  const intl = useIntl();
  const rename = useRenameNode();
  const del = useDeleteNode();
  const add = useAddStructureNode();
  const unitIds = (node.children || []).map((u) => u.id);

  return (
    <div className="ai-studio-outline__subsection">
      <div className="ai-studio-outline__row">
        <InlineRename
          as="h5"
          className="ai-studio-outline__subsection-title"
          value={node.name}
          onSave={(v) => rename.mutate({ nodeId: node.id, name: v, courseCreationId })}
        />
        <MoveControls siblingIds={siblingIds} index={index} courseCreationId={courseCreationId} />
        <IconButton
          iconAs={RiDeleteBinLine}
          alt={intl.formatMessage(messages.deleteSubsection)}
          size="sm"
          variant="ghost-secondary"
          onClick={() => del.mutate({ nodeId: node.id, courseCreationId })}
        />
      </div>
      <div className="ai-studio-outline__units-wrapper">
        {(node.children || []).map((unit, i) => (
          <UnitRow
            key={unit.id}
            courseCreationId={courseCreationId}
            unitId={unit.id}
            name={unit.name}
            componentTypes={planByUnit[unit.id] || []}
            siblingIds={unitIds}
            index={i}
          />
        ))}
        <div className="ai-studio-outline__unit-add">
          <AddStructureMenu
            hierarchy="unit"
            onAdd={() => add.mutate({
              courseCreationId,
              parentId: node.id,
              hierarchy: 'unit',
              name: 'New Unit',
            })}
          />
        </div>
      </div>
    </div>
  );
};

const Section = ({
  node, courseCreationId, planByUnit, siblingIds, index,
}) => {
  const intl = useIntl();
  const rename = useRenameNode();
  const del = useDeleteNode();
  const add = useAddStructureNode();
  const subIds = (node.children || []).map((s) => s.id);

  return (
    <section className="ai-studio-outline__section">
      <div className="ai-studio-outline__section-header">
        <InlineRename
          as="h4"
          className="ai-studio-outline__section-title"
          value={node.name}
          onSave={(v) => rename.mutate({ nodeId: node.id, name: v, courseCreationId })}
        />
        <MoveControls siblingIds={siblingIds} index={index} courseCreationId={courseCreationId} />
        <IconButton
          iconAs={RiDeleteBinLine}
          alt={intl.formatMessage(messages.deleteSection)}
          size="sm"
          variant="ghost-secondary"
          onClick={() => del.mutate({ nodeId: node.id, courseCreationId })}
        />
      </div>
      <div className="ai-studio-outline__subsections-wrapper">
        {(node.children || []).map((sub, i) => (
          <Subsection
            key={sub.id}
            node={sub}
            courseCreationId={courseCreationId}
            planByUnit={planByUnit}
            siblingIds={subIds}
            index={i}
          />
        ))}
        <div className="ai-studio-outline__subsection-add">
          <AddStructureMenu
            hierarchy="subsection"
            onAdd={() => add.mutate({
              courseCreationId,
              parentId: node.id,
              hierarchy: 'subsection',
              name: 'New Subsection',
            })}
          />
        </div>
      </div>
    </section>
  );
};

const StructureTree = ({
  structure = [],
  courseCreationId,
  planByUnit = {},
}) => {
  const add = useAddStructureNode();
  const sectionIds = structure.map((s) => s.id);
  return (
    <div className="ai-studio-outline__tree">
      {structure.map((section, i) => (
        <Section
          key={section.id}
          node={section}
          courseCreationId={courseCreationId}
          planByUnit={planByUnit}
          siblingIds={sectionIds}
          index={i}
        />
      ))}
      <div className="ai-studio-outline__section-add">
        <AddStructureMenu
          hierarchy="section"
          onAdd={() => add.mutate({
            courseCreationId,
            parentId: null,
            hierarchy: 'section',
            name: 'New Section',
          })}
        />
      </div>
    </div>
  );
};

export default StructureTree;
