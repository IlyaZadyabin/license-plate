// Given an array of URLs and a MAX_CONCURRENCY integer, implement a 
// function that will asynchronously fetch each URL, not requesting 
// more than MAX_CONCURRENCY URLs at the same time. The URLs should be 
// fetched as soon as possible. The function should return an array of
// responses for each URL. 

// How would you write a test for such a function?

/**
 * Fetch multiple URLs with a concurrency cap.
 * Returns results in the same order as input (Response | Error per position).
 */
export async function fetchWithConcurrency(
    urls: string[],
    maxConcurrency: number
): Promise<(Response | Error)[]> {
    if (!Number.isInteger(maxConcurrency) || maxConcurrency < 1) {
        throw new Error('maxConcurrency must be a positive integer');
    }

    const results: (Response | Error)[] = new Array(urls.length);
    const executing: Promise<void>[] = [];

    for (let i = 0; i < urls.length; i++) {
        const index = i;

        const promise = fetch(urls[index])
            .then(res => { results[index] = res; })
            .catch(err => { results[index] = err instanceof Error ? err : new Error(String(err)); })
            .finally(() => {
                const pos = executing.indexOf(promise);
                if (pos !== -1) executing.splice(pos, 1);
            });

        executing.push(promise);
        if (executing.length >= maxConcurrency) {
            await Promise.race(executing);
        }
    }

    await Promise.all(executing);
    return results;
}


export default fetchWithConcurrency;
