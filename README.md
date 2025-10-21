# Technical Assignment Solutions

This repo contains my solutions to take-home exercises: a license plate generator and a concurrency helper. The TypeScript sources live in `LicensePlateProblem.ts` and `ConcurrencyExercise.ts`, with matching `node:test` specs.

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run individual solution
npx tsx LicensePlateProblem.ts
```

---

## 1. License Plate Problem

**Problem:** See `LicensePlateProblem.ts` for the full problem statement.

### Solution

1. Divides the sequence into 7 groups based on letter count (0-6 letters)
2. Calculates group boundaries
3. Determines which group contains the nth plate
4. Converts position to number and letter parts using base-10 and base-26 arithmetic

### Running

```bash
npx tsx LicensePlateProblem.ts
```

**Time Complexity:** O(1) - constant time  
**Space Complexity:** O(1) - constant space

---

## 2. Concurrency Exercise

**Problem:** See `ConcurrencyExercise.ts` for the full problem statement.

### Solution

1. Maintains a pool of executing promises (max size = `maxConcurrency`)
2. When pool is full, waits for the fastest promise to complete using `Promise.race`
3. Removes completed promises from the pool to make room for new requests
4. Returns both successful responses and errors without blocking


**Time Complexity:** O(n) where n = number of URLs  
**Space Complexity:** O(c) where c = maxConcurrency

---

## Running Tests

```bash
npm test
```
---

## Technical Decisions

### Design Choices

**Concurrency Exercise:**
- Return `Error` objects rather than throwing to handle partial failures gracefully

---

## Requirements

- **Node.js**: v18+ (for native fetch support)
- **TypeScript**: Included in dev dependencies
- **tsx**: For running TypeScript files directly

---
