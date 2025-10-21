import test from 'node:test';
import assert from 'node:assert/strict';
import fetchWithConcurrency from './ConcurrencyExercise.ts';

function createMockFetch(failOn?: (url: string) => boolean) {
  let active = 0;
  let maxActive = 0;

  const fetch = async (url: string) => {
    active++;
    maxActive = Math.max(maxActive, active);
    await new Promise(r => setTimeout(r, 15));
    active--;
    if (failOn?.(url)) throw new Error(`Failed: ${url}`);
    return { url };
  };

  return { fetch, get maxActive() { return maxActive; } };
}

const originalFetch = globalThis.fetch;

test('respects concurrency limit', async (t) => {
  const mock = createMockFetch();
  globalThis.fetch = mock.fetch as typeof fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  const urls = Array.from({ length: 10 }, (_, i) => `https://t/${i}`);
  await fetchWithConcurrency(urls, 3);
  assert.ok(mock.maxActive <= 3);
});

test('preserves order', async (t) => {
  const mock = createMockFetch();
  globalThis.fetch = mock.fetch as typeof fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  const urls = ['https://a.com', 'https://b.com', 'https://c.com'];
  const results = await fetchWithConcurrency(urls, 2);

  results.forEach((r, i) => {
    assert.ok(!(r instanceof Error));
    assert.equal((r as any).url, urls[i]);
  });
});

test('handles errors without blocking successes', async (t) => {
  const mock = createMockFetch((url) => url.includes('fail'));
  globalThis.fetch = mock.fetch as typeof fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  const urls = ['https://ok1.com', 'https://fail.com', 'https://ok2.com'];
  const results = await fetchWithConcurrency(urls, 2);

  assert.ok(!(results[0] instanceof Error));
  assert.ok(results[1] instanceof Error);
  assert.ok(!(results[2] instanceof Error));
});

test('handles empty input', async (t) => {
  const mock = createMockFetch();
  globalThis.fetch = mock.fetch as typeof fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  const results = await fetchWithConcurrency([], 4);
  assert.deepEqual(results, []);
});

test('throws on invalid concurrency', async (t) => {
  globalThis.fetch = createMockFetch().fetch as typeof fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  await assert.rejects(() => fetchWithConcurrency(['a'], 0));
});