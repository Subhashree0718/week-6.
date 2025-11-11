export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
  },
  
  // Teams
  TEAMS: {
    BASE: '/teams',
    BY_ID: (id) => `/teams/${id}`,
    MEMBERS: (teamId) => `/teams/${teamId}/members`,
    MEMBER: (teamId, userId) => `/teams/${teamId}/members/${userId}`,
  },
  
  // Objectives
  OBJECTIVES: {
    BASE: '/objectives',
    BY_ID: (id) => `/objectives/${id}`,
  },
  
  // Key Results
  KEY_RESULTS: {
    BY_OBJECTIVE: (objectiveId) => `/objectives/${objectiveId}/keyresults`,
    BY_ID: (id) => `/keyresults/${id}`,
  },
  
  // Updates
  UPDATES: {
    BASE: '/updates',
    BY_ID: (id) => `/updates/${id}`,
    BY_OBJECTIVE: (objectiveId) => `/updates/objectives/${objectiveId}`,
    SUMMARY: (objectiveId) => `/updates/objectives/${objectiveId}/summary`,
  },
};
