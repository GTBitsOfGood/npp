export enum StageType {
  SUBMITTED = "SUBMITTED",
  AWAITING_SCHEDULE = "AWAITING_SCHEDULE",
  SCHEDULED = "SCHEDULED",
  REVIEW = "REVIEW",
  DECISION = "DECISION",
}

export const stageToIndex = {
  [StageType.SUBMITTED]: 0,
  [StageType.AWAITING_SCHEDULE]: 1,
  [StageType.SCHEDULED]: 2,
  [StageType.REVIEW]: 3,
  [StageType.DECISION]: 4,
};
