const PREFIX = 'gate2027_';

export function getStore(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStore(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function removeStore(key) {
  localStorage.removeItem(PREFIX + key);
}

export function getExam() {
  return getStore('selectedExam');
}

export function setExam(exam) {
  setStore('selectedExam', exam);
}

export function getSubjectData(exam, subjectId) {
  return getStore(`${exam}_${subjectId}`) || {
    videoLectures: [],
    notes: [],
    pyqPractice: [],
  };
}

export function setSubjectData(exam, subjectId, data) {
  setStore(`${exam}_${subjectId}`, data);
}

export function getFuturePlans(exam) {
  return getStore(`${exam}_futurePlans`) || [];
}

export function setFuturePlans(exam, plans) {
  setStore(`${exam}_futurePlans`, plans);
}

export function getAllSubjectsData(exam, subjects) {
  return subjects.map((s) => ({
    ...s,
    data: getSubjectData(exam, s.id),
  }));
}

export function clearAllData() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}
