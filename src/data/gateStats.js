export const HISTORICAL_CUTOFFS = {
  CSE: [
    { year: 2026, general: 30.0, obc: 27.0, scSt: 20.0, ews: 27.0 },
    { year: 2025, general: 29.2, obc: 26.2, scSt: 19.4, ews: 26.2 },
    { year: 2024, general: 33.3, obc: 30.0, scSt: 22.2, ews: 30.0 },
    { year: 2023, general: 32.5, obc: 29.2, scSt: 21.6, ews: 29.2 },
    { year: 2022, general: 27.0, obc: 24.3, scSt: 18.0, ews: 24.3 },
    { year: 2021, general: 28.5, obc: 25.6, scSt: 19.0, ews: 25.6 },
    { year: 2020, general: 33.7, obc: 30.3, scSt: 22.5, ews: 30.3 },
  ],
  DSAI: [
    { year: 2026, general: 26.4, obc: 23.7, scSt: 17.5, ews: 23.7 },
    { year: 2025, general: 29.0, obc: 26.1, scSt: 19.3, ews: 26.1 },
    { year: 2024, general: 32.0, obc: 28.8, scSt: 21.3, ews: 28.8 },
  ],
}

export const EXAM_STATISTICS = [
  { year: 2026, totalReg: 1011719, cseReg: 259922, dsaiReg: 91764, cseAppeared: 211020, dsaiAppeared: 69242, avgMarks: 26.8, topperScore: 93.67 },
  { year: 2025, totalReg: 936019, cseReg: 207851, dsaiReg: 75854, cseAppeared: 170825, dsaiAppeared: 57054, avgMarks: 27.1, topperScore: 91.33 },
]

export const MARKS_VS_RANK = [
  { rank: '1 - 10', marks: '85 - 90', score: '900 - 1000' },
  { rank: '10 - 50', marks: '82 - 87', score: '850 - 976' },
  { rank: '50 - 100', marks: '80 - 85', score: '800 - 950' },
  { rank: '100 - 200', marks: '78 - 83', score: '750 - 900' },
  { rank: '200 - 500', marks: '76 - 81', score: '700 - 850' },
  { rank: '500 - 1000', marks: '74 - 79', score: '650 - 813' },
  { rank: '1000 - 2000', marks: '72 - 77', score: '600 - 797' },
  { rank: '2000 - 5000', marks: '70 - 75', score: '569 - 747' },
  { rank: '5000 - 10000', marks: '60 - 65', score: '463 - 652' },
]

export const COLLEGE_CUTOFFS = [
  { name: 'IISc Bangalore', type: 'IIT', score: { general: 903, obc: 812, scSt: 587, ews: 812 }, seats: 80 },
  { name: 'IIT Bombay', type: 'IIT', score: { general: 775, obc: 698, scSt: 504, ews: 698 }, seats: 63 },
  { name: 'IIT Delhi', type: 'IIT', score: { general: 745, obc: 670, scSt: 484, ews: 670 }, seats: 58 },
  { name: 'IIT Madras', type: 'IIT', score: { general: 755, obc: 680, scSt: 491, ews: 680 }, seats: 60 },
  { name: 'IIT Kanpur', type: 'IIT', score: { general: 730, obc: 657, scSt: 475, ews: 657 }, seats: 50 },
  { name: 'IIT Kharagpur', type: 'IIT', score: { general: 720, obc: 648, scSt: 468, ews: 648 }, seats: 55 },
  { name: 'IIT Roorkee', type: 'IIT', score: { general: 705, obc: 634, scSt: 458, ews: 634 }, seats: 48 },
  { name: 'IIT Hyderabad', type: 'IIT', score: { general: 690, obc: 621, scSt: 448, ews: 621 }, seats: 45 },
  { name: 'IIT Guwahati', type: 'IIT', score: { general: 680, obc: 612, scSt: 442, ews: 612 }, seats: 42 },
  { name: 'NIT Trichy', type: 'NIT', score: { general: 777, obc: 699, scSt: 505, ews: 699 }, seats: 60 },
  { name: 'NIT Warangal', type: 'NIT', score: { general: 761, obc: 685, scSt: 495, ews: 685 }, seats: 55 },
  { name: 'NIT Calicut', type: 'NIT', score: { general: 731, obc: 658, scSt: 475, ews: 658 }, seats: 48 },
  { name: 'NIT Surathkal', type: 'NIT', score: { general: 760, obc: 684, scSt: 494, ews: 684 }, seats: 50 },
  { name: 'IIIT Hyderabad', type: 'IIIT', score: { general: 720, obc: 648, scSt: 468, ews: 648 }, seats: 40 },
  { name: 'IIIT Allahabad', type: 'IIIT', score: { general: 680, obc: 612, scSt: 442, ews: 612 }, seats: 45 },
  { name: 'IIIT Delhi', type: 'IIIT', score: { general: 668, obc: 601, scSt: 434, ews: 601 }, seats: 35 },
]

export const COLLEGE_TYPES = ['All', 'IIT', 'NIT', 'IIIT']

export const CATEGORY_COLORS = {
  general: 'var(--accent-cyan)',
  obc: 'var(--accent-purple)',
  scSt: 'var(--accent-orange)',
  ews: 'var(--accent-green)',
}

export const CATEGORY_LABELS = {
  general: 'General',
  obc: 'OBC',
  scSt: 'SC/ST',
  ews: 'EWS',
}
