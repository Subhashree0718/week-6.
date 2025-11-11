// const HEALTH_STATUS = {
//   ON_TRACK: 'on_track',
//   AT_RISK: 'at_risk',
//   OFF_TRACK: 'off_track',
// };

// const HEALTH_THRESHOLDS = {
//   PROGRESS: {
//     GOOD: 0.7,
//     WARNING: 0.5,
//   },
//   STALENESS_DAYS: {
//     FRESH: 7,
//     STALE: 14,
//   },
//   TREND_TOLERANCE: {
//     IMPROVING: 0.05,
//     FLAT: -0.01,
//   },
// };

// const STATUS_SCORE = {
//   [HEALTH_STATUS.ON_TRACK]: 2,
//   [HEALTH_STATUS.AT_RISK]: 1,
//   [HEALTH_STATUS.OFF_TRACK]: 0,
// };

// const SCORE_STATUS = {
//   2: HEALTH_STATUS.ON_TRACK,
//   1: HEALTH_STATUS.AT_RISK,
//   0: HEALTH_STATUS.OFF_TRACK,
// };

// const STATUS_EMOJI = {
//   [HEALTH_STATUS.ON_TRACK]: '🟢',
//   [HEALTH_STATUS.AT_RISK]: '🟡',
//   [HEALTH_STATUS.OFF_TRACK]: '🔴',
// };

// const STATUS_LABEL = {
//   [HEALTH_STATUS.ON_TRACK]: 'On-track',
//   [HEALTH_STATUS.AT_RISK]: 'At risk',
//   [HEALTH_STATUS.OFF_TRACK]: 'Off-track',
// };

// const uniquePush = (array, message) => {
//   if (message && !array.includes(message)) {
//     array.push(message);
//   }
// };

// const daysBetween = (dateA, dateB) => {
//   const diffMs = dateA.getTime() - dateB.getTime();
//   return Math.floor(diffMs / (1000 * 60 * 60 * 24));
// };

// const getAgeInDays = (keyResult) => daysBetween(new Date(), new Date(keyResult.createdAt));

// const toProgressRatio = (current, target) => {
//   if (!target || target <= 0) return 0;
//   return Math.min(current / target, 1);
// };

// const calculateProgressRatio = (keyResult) => {
//   const latestUpdate = keyResult.updates?.[0];
//   const currentValue = latestUpdate?.current ?? keyResult.current ?? 0;
//   return toProgressRatio(currentValue, keyResult.target);
// };

// const evaluateProgress = (keyResult, reasons) => {
//   const progressRatio = calculateProgressRatio(keyResult);

//   if (progressRatio >= HEALTH_THRESHOLDS.PROGRESS.GOOD) {
//     return STATUS_SCORE[HEALTH_STATUS.ON_TRACK];
//   }

//   if (progressRatio >= HEALTH_THRESHOLDS.PROGRESS.WARNING) {
//     uniquePush(reasons, 'Progress is below the expected trajectory.');
//     return STATUS_SCORE[HEALTH_STATUS.AT_RISK];
//   }

//   const ageInDays = getAgeInDays(keyResult);
//   const hasMomentum = (keyResult.updates?.length || 0) >= 2;

//   if (ageInDays <= HEALTH_THRESHOLDS.STALENESS_DAYS.STALE && !hasMomentum) {
//     uniquePush(reasons, 'Progress is still building momentum.');
//     return STATUS_SCORE[HEALTH_STATUS.AT_RISK];
//   }

//   uniquePush(reasons, 'Progress is significantly behind target.');
//   return STATUS_SCORE[HEALTH_STATUS.OFF_TRACK];
// };

// const latestUpdate = (keyResult) => keyResult.updates?.[0] || null;

// const evaluateStaleness = (keyResult, reasons) => {
//   const recentUpdate = latestUpdate(keyResult);

//   if (!recentUpdate) {
//     const ageInDays = getAgeInDays(keyResult);

//     if (ageInDays <= HEALTH_THRESHOLDS.STALENESS_DAYS.FRESH) {
//       return STATUS_SCORE[HEALTH_STATUS.ON_TRACK];
//     }

//     uniquePush(reasons, 'No updates have been logged recently.');
//     return STATUS_SCORE[HEALTH_STATUS.AT_RISK];
//   }

//   const daysSinceUpdate = daysBetween(new Date(), new Date(recentUpdate.createdAt));

//   if (daysSinceUpdate <= HEALTH_THRESHOLDS.STALENESS_DAYS.FRESH) {
//     return STATUS_SCORE[HEALTH_STATUS.ON_TRACK];
//   }

//   if (daysSinceUpdate <= HEALTH_THRESHOLDS.STALENESS_DAYS.STALE) {
//     uniquePush(reasons, 'Updates are becoming infrequent.');
//     return STATUS_SCORE[HEALTH_STATUS.AT_RISK];
//   }

//   uniquePush(reasons, 'No updates have been provided in a while.');
//   return STATUS_SCORE[HEALTH_STATUS.OFF_TRACK];
// };

// const evaluateTrend = (keyResult, reasons) => {
//   const updates = keyResult.updates || [];
//   if (updates.length < 2 || !keyResult.target) {
//     return STATUS_SCORE[HEALTH_STATUS.ON_TRACK];
//   }

//   const [latest, previous] = updates;
//   const latestRatio = toProgressRatio(latest.current, keyResult.target);
//   const previousRatio = toProgressRatio(previous.current, keyResult.target);
//   const delta = latestRatio - previousRatio;

//   if (delta >= HEALTH_THRESHOLDS.TREND_TOLERANCE.IMPROVING) {
//     return STATUS_SCORE[HEALTH_STATUS.ON_TRACK];
//   }

//   if (delta >= HEALTH_THRESHOLDS.TREND_TOLERANCE.FLAT) {
//     uniquePush(reasons, 'Progress trend has stalled.');
//     return STATUS_SCORE[HEALTH_STATUS.AT_RISK];
//   }

//   uniquePush(reasons, 'Progress trend is declining.');
//   return STATUS_SCORE[HEALTH_STATUS.OFF_TRACK];
// };

// const evaluateBlockers = (keyResult, reasons) => {
//   const recentUpdate = latestUpdate(keyResult);

//   if (!recentUpdate || !recentUpdate.blockers) {
//     return STATUS_SCORE[HEALTH_STATUS.ON_TRACK];
//   }

//   const blockers = recentUpdate.blockers.trim();

//   if (!blockers) {
//     return STATUS_SCORE[HEALTH_STATUS.ON_TRACK];
//   }

//   uniquePush(reasons, 'Active blockers reported.');
//   return STATUS_SCORE[HEALTH_STATUS.AT_RISK];
// };

// const combineScores = (scores) => {
//   const minScore = Math.min(...scores);
//   if (minScore === STATUS_SCORE[HEALTH_STATUS.OFF_TRACK]) {
//     return STATUS_SCORE[HEALTH_STATUS.OFF_TRACK];
//   }

//   const total = scores.reduce((sum, score) => sum + score, 0);
//   const average = Math.round(total / scores.length);
//   return Math.max(0, Math.min(2, average));
// };

// export const calculateHealthForKeyResult = (keyResult) => {
//   const reasons = [];

//   const scores = [
//     evaluateProgress(keyResult, reasons),
//     evaluateStaleness(keyResult, reasons),
//     evaluateTrend(keyResult, reasons),
//     evaluateBlockers(keyResult, reasons),
//   ];

//   const finalScore = combineScores(scores);
//   const status = SCORE_STATUS[finalScore];

//   return {
//     status,
//     score: finalScore,
//     emoji: STATUS_EMOJI[status],
//     label: STATUS_LABEL[status],
//     reasons,
//   };
// };

// export {
//   HEALTH_STATUS,
//   HEALTH_THRESHOLDS,
//   STATUS_SCORE,
//   STATUS_EMOJI,
//   STATUS_LABEL,
//   SCORE_STATUS,
// };

const HEALTH_STATUS = {
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  OFF_TRACK: 'off_track',
};

const HEALTH_THRESHOLDS = {
  PROGRESS: { GOOD: 0.7, WARNING: 0.5 },
  STALENESS_DAYS: { FRESH: 7, STALE: 14 },
  TREND_TOLERANCE: { IMPROVING: 0.05, FLAT: -0.01 },
};

const STATUS_SCORE = {
  [HEALTH_STATUS.ON_TRACK]: 2,
  [HEALTH_STATUS.AT_RISK]: 1,
  [HEALTH_STATUS.OFF_TRACK]: 0,
};

const SCORE_STATUS = {
  2: HEALTH_STATUS.ON_TRACK,
  1: HEALTH_STATUS.AT_RISK,
  0: HEALTH_STATUS.OFF_TRACK,
};

const STATUS_EMOJI = {
  [HEALTH_STATUS.ON_TRACK]: '🟢',
  [HEALTH_STATUS.AT_RISK]: '🟡',
  [HEALTH_STATUS.OFF_TRACK]: '🔴',
};

const STATUS_LABEL = {
  [HEALTH_STATUS.ON_TRACK]: 'On-track',
  [HEALTH_STATUS.AT_RISK]: 'At risk',
  [HEALTH_STATUS.OFF_TRACK]: 'Off-track',
};

const uniquePush = (array, message) => {
  if (message && !array.includes(message)) array.push(message);
};

const daysBetween = (a, b) => Math.floor((a - b) / (1000 * 60 * 60 * 24));

const getAgeInDays = (kr) => daysBetween(new Date(), new Date(kr.createdAt));

const toProgressRatio = (current, target) =>
  target > 0 ? Math.min(current / target, 1) : 0;

const calculateProgressRatio = (kr) => {
  const latest = kr.krUpdates?.[0];
  const current = latest?.progress ?? kr.current ?? 0;
  return toProgressRatio(current, kr.target);
};

const latestUpdate = (kr) => kr.krUpdates?.[0] || null;

const evaluateProgress = (kr, reasons) => {
  const ratio = calculateProgressRatio(kr);
  if (ratio >= HEALTH_THRESHOLDS.PROGRESS.GOOD) return STATUS_SCORE.on_track;
  if (ratio >= HEALTH_THRESHOLDS.PROGRESS.WARNING) {
    uniquePush(reasons, 'Progress is below expected trajectory.');
    return STATUS_SCORE.at_risk;
  }
  uniquePush(reasons, 'Progress is behind target.');
  return STATUS_SCORE.off_track;
};

const evaluateStaleness = (kr, reasons) => {
  const latest = latestUpdate(kr);
  if (!latest) {
    uniquePush(reasons, 'No updates yet.');
    return STATUS_SCORE.at_risk;
  }

  const daysSince = daysBetween(new Date(), new Date(latest.createdAt));
  if (daysSince <= HEALTH_THRESHOLDS.STALENESS_DAYS.FRESH) return STATUS_SCORE.on_track;
  if (daysSince <= HEALTH_THRESHOLDS.STALENESS_DAYS.STALE) {
    uniquePush(reasons, 'Updates are becoming infrequent.');
    return STATUS_SCORE.at_risk;
  }

  uniquePush(reasons, 'No updates recently.');
  return STATUS_SCORE.off_track;
};

const evaluateBlockers = (kr, reasons) => {
  const latest = latestUpdate(kr);
  if (latest?.blockers) {
    uniquePush(reasons, 'Active blockers reported.');
    return STATUS_SCORE.at_risk;
  }
  return STATUS_SCORE.on_track;
};

const evaluateTrend = (kr, reasons) => {
  const updates = kr.krUpdates || [];
  if (updates.length < 2) return STATUS_SCORE.on_track;

  const [latest, previous] = updates;
  const delta =
    toProgressRatio(latest.progress, kr.target) -
    toProgressRatio(previous.progress, kr.target);

  if (delta >= HEALTH_THRESHOLDS.TREND_TOLERANCE.IMPROVING) return STATUS_SCORE.on_track;
  if (delta >= HEALTH_THRESHOLDS.TREND_TOLERANCE.FLAT) {
    uniquePush(reasons, 'Progress trend is flat.');
    return STATUS_SCORE.at_risk;
  }

  uniquePush(reasons, 'Progress trend is declining.');
  return STATUS_SCORE.off_track;
};

const combineScores = (scores) => {
  const min = Math.min(...scores);
  if (min === STATUS_SCORE.off_track) return STATUS_SCORE.off_track;

  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  return Math.max(0, Math.min(2, avg));
};

export const calculateHealthForKeyResult = (kr) => {
  const reasons = [];
  const scores = [
    evaluateProgress(kr, reasons),
    evaluateStaleness(kr, reasons),
    evaluateTrend(kr, reasons),
    evaluateBlockers(kr, reasons),
  ];

  const score = combineScores(scores);
  const status = SCORE_STATUS[score];
  return {
    status,
    score,
    emoji: STATUS_EMOJI[status],
    label: STATUS_LABEL[status],
    reasons,
  };
};
