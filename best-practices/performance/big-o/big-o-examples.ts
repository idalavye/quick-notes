/**
 * Big O Notation - Örnek Kodlar
 * Merge Sort ve Fibonacci (naive vs optimize)
 * Çalıştırmak: npx ts-node best-practices/performance/big-o/big-o-examples.ts
 *
 * İlgili not: best-practices/performance/big-o/big-o-notation.md
 */

// ============== Merge Sort — O(n log n) zaman, O(n) bellek ==============
console.log('--- Merge Sort (O(n log n)) ---');

/**
 * Merge Sort: Diziyi sürekli ikiye böl, sıralı parçaları birleştir.
 * - Bölme: log n seviye (her seviyede n işlem) → O(n log n)
 * - Birleştirme: her seviyede O(n) → toplam O(n log n)
 */
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

/** İki sıralı diziyi tek sıralı dizide birleştirir. O(n) */
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  result.push(...left.slice(i), ...right.slice(j));
  return result;
}

const unsorted = [38, 27, 43, 3, 9, 82, 10];
console.log('Önce:', unsorted);
console.log('Sonra:', mergeSort(unsorted));

// ============== Fibonacci — Karşılaştırma: O(2^n) vs O(n) ==============
console.log('\n--- Fibonacci karşılaştırması ---');

/**
 * Naive recursive Fibonacci — O(2^n) zaman, O(n) call stack
 * Aynı n değerleri tekrar tekrar hesaplanır (örn. fib(5) için fib(3) birçok kez).
 * n > 40 için pratikte çok yavaş.
 */
function fibNaive(n: number): number {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

/**
 * Iterative (döngü ile) Fibonacci — O(n) zaman, O(1) ek bellek
 * Her sayı bir kez hesaplanır; önceki iki değer tutulur.
 */
function fibIterative(n: number): number {
  if (n <= 1) return n;
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

/**
 * Memoized (önbellekli) recursive Fibonacci — O(n) zaman, O(n) bellek
 * Her alt problem bir kez hesaplanır, sonuç cache'de saklanır.
 */
function fibMemoized(n: number, cache: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n)!;
  const result = fibMemoized(n - 1, cache) + fibMemoized(n - 2, cache);
  cache.set(n, result);
  return result;
}

const n = 10;
console.log(`fib(${n}) — naive:    ${fibNaive(n)}`);
console.log(`fib(${n}) — iterative: ${fibIterative(n)}`);
console.log(`fib(${n}) — memoized:  ${fibMemoized(n)}`);

// Büyük n'de naive yavaşlar (isteğe bağlı: n=40 denemek için yorumu kaldır)
// console.log('fib(40) naive (yavaş):', fibNaive(40));
console.log('fib(40) iterative (hızlı):', fibIterative(40));
console.log('fib(40) memoized (hızlı):', fibMemoized(40));
