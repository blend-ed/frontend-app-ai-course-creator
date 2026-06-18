import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseMetadata, useMessages, useSendChat } from './data/apiHooks';
import { STAGES } from './data/constants';
import LandingScreen from './landing/LandingScreen';
import ChatColumn from './chat/ChatColumn';
import RightPanel from './right-panel/RightPanel';
import BuildingScreen from './building/BuildingScreen';
import './CourseCreatorFlow.scss';

// Pull the latest options payload out of the chat stream. Stage is NOT read
// from here — the backend doesn't save it into the message content. Stage
// comes from GET /chat/<id>/metadata/ instead (see useCourseMetadata).
const pickLatestOptions = (messages) => {
  if (!messages?.length) { return undefined; }
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const m = messages[i];
    if (m.role !== 'assistant') { continue; }
    try {
      const parsed = JSON.parse(m.content);
      return parsed.options;
    } catch {
      // Non-JSON assistant content — skip.
    }
  }
  return undefined;
};

const CourseCreatorFlow = ({ courseCreationId }) => {
  // --- All hooks declared up-front. React requires the hook call order to
  // stay stable across renders, so every hook lives above any conditional
  // return, regardless of whether the current branch will actually use it.
  const navigate = useNavigate();
  const composerRef = useRef(null);
  const splitRef = useRef(null);
  const dragging = useRef(false);
  const [splitPct, setSplitPct] = useState(50);
  // Local override: the backend only flips stage → script_generation after
  // ALL units have scripts, but the UI needs to swap to the Scripts panel
  // the moment the user clicks "Generate Script" on the outline.
  const [scriptsRequested, setScriptsRequested] = useState(false);

  const { data: messages } = useMessages(courseCreationId);
  const { data: metadataSummary } = useCourseMetadata(courseCreationId);
  const sendChat = useSendChat();

  // Stage comes from the metadata endpoint (authoritative — reflects DB).
  // Options come from the latest assistant message (the question card payload).
  const stage = metadataSummary?.stage || 'init';
  const latestOptions = useMemo(() => pickLatestOptions(messages), [messages]);

  const onDragStart = useCallback((e) => {
    dragging.current = true;
    e.preventDefault();
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current || !splitRef.current) { return; }
      const rect = splitRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.min(80, Math.max(20, pct)));
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  // --- Render branches below. No more hooks past this point.

  // Landing — no course yet.
  if (!courseCreationId) {
    const onLandingSubmit = ({ message, files }) => {
      if (sendChat.error) { sendChat.reset(); }
      sendChat.mutate(
        { message, files },
        {
          onSuccess: (res) => navigate(`/ai-studio/${res.courseCreationId}`, { replace: true }),
        },
      );
    };
    return (
      <LandingScreen
        onSubmit={onLandingSubmit}
        isSubmitting={sendChat.isPending}
        error={sendChat.error}
        onHistoryClick={() => navigate('/ai-studio/history')}
      />
    );
  }

  // Building / success / failed — full-screen progress.
  if (
    stage === STAGES.BUILDING
    || stage === STAGES.SUCCESS
    || stage === STAGES.FAILED
  ) {
    return <BuildingScreen courseCreationId={courseCreationId} />;
  }

  // Map stage → right-panel mode. Brief shows during init + metadata
  // collection; once `create_structure_tool` fires the stage flips to
  // `outline_creation` (or later) and the Outline panel takes over.
  let panelMode = 'brief';
  if (
    stage === STAGES.OUTLINE_CREATION
    || stage === STAGES.COMPONENT_PLAN
  ) {
    panelMode = 'outline';
  } else if (stage === STAGES.SCRIPT_GENERATION) {
    panelMode = 'scripts';
  }
  if (scriptsRequested && panelMode === 'outline') {
    panelMode = 'scripts';
  }
  const splitStyle = {
    gridTemplateColumns: `minmax(0, ${splitPct}fr) auto minmax(0, ${100 - splitPct}fr)`,
  };

  return (
    <div
      ref={splitRef}
      className="ai-studio-flow ai-studio-flow--split"
      style={splitStyle}
    >
      <div className="ai-studio-flow__chat">
        <ChatColumn
          courseCreationId={courseCreationId}
          latestOptions={latestOptions}
          composerRef={composerRef}
        />
      </div>
      <div
        className="ai-studio-flow__resizer"
        role="separator"
        aria-orientation="vertical"
        onMouseDown={onDragStart}
      >
        <span className="ai-studio-flow__resizer-grip" />
      </div>
      <div className="ai-studio-flow__panel">
        <RightPanel
          mode={panelMode}
          courseCreationId={courseCreationId}
          metadataSummary={metadataSummary || {}}
          activeSlotKey={latestOptions?.metadataKey}
          stage={stage}
          onScriptsReady={() => setScriptsRequested(true)}
        />
      </div>
    </div>
  );
};

export default CourseCreatorFlow;
