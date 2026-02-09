const RATE_LIMIT_KEY = 'nutterx_last_submission';
const RATE_LIMIT_DELAY_MS = 5000; // 5 seconds

/**
 * Check if the user can submit based on last submission
 */
export function canSubmit(): boolean {
  const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
  if (!lastSubmission) return true;

  const elapsed = Date.now() - parseInt(lastSubmission, 10);
  return elapsed >= RATE_LIMIT_DELAY_MS;
}

/**
 * Record the time of the current submission
 */
export function recordSubmission(): void {
  localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
}

/**
 * Get remaining time until next submission (in seconds)
 */
export function getTimeUntilNextSubmission(): number {
  const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
  if (!lastSubmission) return 0;

  const elapsed = Date.now() - parseInt(lastSubmission, 10);
  const remaining = RATE_LIMIT_DELAY_MS - elapsed;

  return Math.max(0, Math.ceil(remaining / 1000)); // always round up
}
