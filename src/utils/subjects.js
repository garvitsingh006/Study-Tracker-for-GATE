export const exams = {
  CSIT: {
    id: 'CSIT',
    name: 'CS & IT',
    color: 'from-blue-600 to-cyan-500',
    subjects: [
      { id: 'eng_math', name: 'Engineering Mathematics', shortName: 'Eng Math', color: '#3b82f6' },
      { id: 'disc_math', name: 'Discrete Mathematics', shortName: 'Disc Math', color: '#8b5cf6' },
      { id: 'digital_logic', name: 'Digital Logic', shortName: 'Digital Logic', color: '#06b6d4' },
      { id: 'coa', name: 'Computer Organization & Architecture', shortName: 'COA', color: '#f59e0b' },
      { id: 'pds', name: 'Programming & Data Structures', shortName: 'PDS', color: '#10b981' },
      { id: 'algorithms', name: 'Algorithms', shortName: 'Algorithms', color: '#ef4444' },
      { id: 'toc', name: 'Theory of Computation', shortName: 'TOC', color: '#ec4899' },
      { id: 'compiler', name: 'Compiler Design', shortName: 'Compiler', color: '#f97316' },
      { id: 'os', name: 'Operating Systems', shortName: 'OS', color: '#14b8a6' },
      { id: 'dbms', name: 'Databases', shortName: 'DBMS', color: '#6366f1' },
      { id: 'cn', name: 'Computer Networks', shortName: 'Networks', color: '#84cc16' },
    ],
  },
  DSAI: {
    id: 'DSAI',
    name: 'Data Science & AI',
    color: 'from-purple-600 to-pink-500',
    subjects: [
      { id: 'linear_algebra', name: 'Linear Algebra', shortName: 'Lin Algebra', color: '#3b82f6' },
      { id: 'calculus', name: 'Calculus & Optimization', shortName: 'Calculus', color: '#8b5cf6' },
      { id: 'prob_stat', name: 'Probability & Statistics', shortName: 'Prob & Stats', color: '#06b6d4' },
      { id: 'disc_math_ai', name: 'Discrete Mathematics', shortName: 'Disc Math', color: '#f59e0b' },
      { id: 'pds_ai', name: 'Programming, Data Structures & Algorithms', shortName: 'PDSA', color: '#10b981' },
      { id: 'dbms_ai', name: 'Database Management Systems', shortName: 'DBMS', color: '#ef4444' },
      { id: 'ml', name: 'Machine Learning', shortName: 'ML', color: '#ec4899' },
      { id: 'ai', name: 'Artificial Intelligence', shortName: 'AI', color: '#f97316' },
      { id: 'data_vis', name: 'Data Visualization', shortName: 'Data Viz', color: '#14b8a6' },
      { id: 'dl', name: 'Deep Learning', shortName: 'DL', color: '#6366f1' },
    ],
  },
};

export function getExamList() {
  return Object.values(exams);
}

export function getExamById(id) {
  return exams[id] || null;
}
