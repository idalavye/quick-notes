---
title: Big O Notation
parent: Best Practices
nav_order: 3
---

# Big O Notation (Büyük O Notasyonu)

## Big O Nedir?

**Big O notation**, bir algoritmanın girdi (input) büyüdükçe **zaman** (time) ve **bellek** (space) kullanımının nasıl arttığını ifade etmek için kullanılan matematiksel bir gösterimdir. Algoritmanın tam süresini değil, **büyüme hızını** (growth rate) tanımlar.

### Neden Önemli?

- **Ölçeklenebilirlik**: Veri arttıkça kodun nasıl davranacağını tahmin edebiliriz.
- **Karşılaştırma**: İki çözümden hangisinin daha verimli olduğunu söyleyebiliriz.
- **Mülakat ve kod incelemesi**: Performans hakkında net iletişim kurarız.

---

## Temel Kavramlar

- **n**: Genelde girdi boyutu (dizi uzunluğu, liste eleman sayısı vb.).
- **O(f(n))**: En kötü senaryoda (worst case) karmaşıklık; sabit çarpanlar ve düşük dereceli terimler göz ardı edilir.

---

## Yaygın Zaman Karmaşıklıkları (Worst → Best)

Aşağıda yaygın Big O türleri, hız sırasına göre (en yavaştan en hızlıya) listelenmiştir.

| Big O       | İsim           | Açıklama                    | Örnek                    |
|------------|----------------|-----------------------------|--------------------------|
| O(n!)      | Factorial      | Çok yavaş, pratikte nadir   | Tüm permütasyonlar       |
| O(2^n)     | Exponential    | Çok yavaş                   | Naive recursive Fibonacci |
| O(n²)      | Quadratic      | İç içe döngüler             | Kabarcık sıralama        |
| O(n log n) | Linearithmic   | İyi sıralama algoritmaları  | Merge sort, Quick sort   |
| O(n)       | Linear         | Dizi üzerinde tek geçiş     | Dizide max bulma         |
| O(log n)   | Logarithmic    | Her adımda yarıya inme      | İkili arama              |
| O(1)       | Constant       | Girdiye bağlı değil         | Dizide indeksle erişim   |

---

## Örneklerle Açıklama

### O(1) — Sabit Zaman

Girdi ne kadar büyük olursa olsun, işlem süresi sabittir.

```typescript
// Dizide indeksle erişim
function getFirst(arr: number[]): number {
  return arr[0];
}

// Objede key ile erişim
function getByName(users: Record<string, User>, name: string): User {
  return users[name];
}
```

### O(n) — Doğrusal Zaman

Girdi 2 katına çıkarsa süre de kabaca 2 katına çıkar. Genelde tek bir döngü.

```typescript
// Dizide maksimum bulma
function findMax(arr: number[]): number {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// Dizide arama
function indexOf(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

### O(log n) — Logaritmik Zaman

Her adımda problem boyutu önemli ölçüde küçülür (örn. yarıya). Sıralı dizide ikili arama tipik örnektir.

```typescript
// Sıralı dizide ikili arama
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

### O(n²) — Kuadratik Zaman

İç içe iki döngü (veya her eleman için tüm liste üzerinde işlem). Küçük n için kabul edilebilir, büyük n için pahalıdır.

```typescript
// Kabarcık sıralama (Bubble Sort)
function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length - 1 - i; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }
  return result;
}

// Tüm çiftleri yazdırma
function printPairs(arr: number[]): void {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}
```

### O(n log n) — Linearithmic

Birçok verimli sıralama algoritması bu sınıftadır. **Merge Sort** tipik örnektir: diziyi sürekli ikiye böler (log n seviye), her seviyede tüm elemanlar üzerinden birleştirme yapar (n işlem).

Detaylı örnek için: **[big-o-examples.ts](big-o-examples.ts)** (Merge Sort + Fibonacci karşılaştırması).

```typescript
// Merge Sort — özet yapı
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);  // merge: O(n)
}
```

### O(2^n) — Üstel Zaman

Örneğin naive recursive Fibonacci: her çağrı iki yeni çağrı açtığı için katlanarak büyür. Büyük n için pratikte kullanılmaz. **Optimize versiyonlar** (iterative veya memoization) ile O(n) yapılabilir.

Tam örnek (naive vs iterative vs memoized): **[big-o-examples.ts](big-o-examples.ts)**.

```typescript
// Dikkat: Büyük n için çok yavaş! O(2^n)
function fibNaive(n: number): number {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// O(n) — iterative veya memoized kullanın
function fibIterative(n: number): number {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}
```

---

## Bellek Karmaşıklığı (Space Complexity)

Big O aynı zamanda **ek bellek** kullanımını da ifade edebilir.

- **O(1) space**: Sadece sabit sayıda değişken (ör. iki pointer).
- **O(n) space**: Girdi boyutunda ek dizi veya yapı (ör. sonuç dizisi, hash map).

```typescript
// O(1) space — sadece birkaç değişken
function sum(arr: number[]): number {
  let total = 0;
  for (const x of arr) total += x;
  return total;
}

// O(n) space — yeni dizi oluşturuluyor
function doubleEach(arr: number[]): number[] {
  return arr.map((x) => x * 2);
}
```

---

## Pratik Kurallar

1. **Döngü sayısı**: Tek döngü genelde O(n), iç içe iki döngü O(n²).
2. **Yarıya bölme**: İkili arama gibi her adımda yarıya inme → O(log n).
3. **Sabit indeks/key erişimi**: O(1).
4. **Sıralama**: Karşılaştırmalı sıralamalar genelde O(n log n); basit algoritmalar O(n²).

---

## Özet Tablo (Hızlı Referans)

| İşlem / Veri yapısı     | Ortalama / Yaygın |
|-------------------------|-------------------|
| Dizide indeks erişimi   | O(1)              |
| Dizide arama (sırasız)  | O(n)              |
| Sıralı dizide ikili arama | O(log n)       |
| Hash table ekleme/arama | O(1) ortalama     |
| Merge / Quick sort      | O(n log n)        |
| Kabarcık sıralama       | O(n²)             |

Bu notasyon, algoritma seçerken ve kodun ölçeklenebilirliğini konuşurken temel referans olarak kullanılabilir.
