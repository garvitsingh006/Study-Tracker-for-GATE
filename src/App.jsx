import { useState } from 'react';
import { getExam, setExam } from './utils/storage';
import ExamSelection from './components/ExamSelection';
import Dashboard from './components/Dashboard';
import SubjectWorkspace from './components/SubjectWorkspace';

function getInitialState() {
  const saved = getExam();
  if (saved) return { exam: saved, view: 'dashboard' };
  return { exam: null, view: 'examSelect' };
}

export default function App() {
  const [initial] = useState(getInitialState);
  const [exam, setExamState] = useState(initial.exam);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [view, setView] = useState(initial.view);

  const handleSelectExam = (examId) => {
    setExam(examId);
    setExamState(examId);
    setView('dashboard');
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setView('workspace');
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
    setView('dashboard');
  };

  const handleBackToExamSelect = () => {
    setExamState(null);
    setSelectedSubject(null);
    setView('examSelect');
  };

  if (view === 'examSelect') {
    return <ExamSelection onSelect={handleSelectExam} />;
  }

  if (view === 'workspace' && selectedSubject) {
    return (
      <SubjectWorkspace
        exam={exam}
        subject={selectedSubject}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <Dashboard
      exam={exam}
      onSelectSubject={handleSelectSubject}
      onSwitchExam={handleBackToExamSelect}
    />
  );
}
