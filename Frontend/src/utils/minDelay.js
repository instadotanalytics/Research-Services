/**
 * Wraps a promise so it resolves no sooner than `ms` milliseconds.
 * Prevents a flash of skeleton when the API responds very quickly.
 *
 *   withMinDelay(fetchData(), 400)
 *   withMinDelay(Promise.all([a, b, c]))
 */
export function withMinDelay(promise, ms = 400) {
  return Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]).then(([result]) => result);
}
