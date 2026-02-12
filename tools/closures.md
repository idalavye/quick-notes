---
title: Closures
parent: Tools
nav_order: 1
---

# Closures (Kapanışlar) - Kapsamlı Rehber

## Closures Nedir?

Closure (kapanış), bir fonksiyonun kendi lexical scope'u dışındaki değişkenlere erişebilme yeteneğidir. Basitçe söylemek gerekirse, bir fonksiyon kendi tanımlandığı yerden daha geniş bir scope'taki değişkenleri "hatırlar" ve bunlara erişebilir.

## Temel Kavramlar

### Lexical Scoping (Sözcüksel Kapsam)

JavaScript'te fonksiyonlar, tanımlandıkları yerdeki değişkenlere erişebilir. Bu duruma lexical scoping denir.

```javascript
function outerFunction() {
  const outerVariable = 'Dış değişken';

  function innerFunction() {
    console.log(outerVariable); // Dış değişkene erişebilir
  }

  return innerFunction;
}

const myFunction = outerFunction();
myFunction(); // "Dış değişken" yazdırır
```

## Closure Örnekleri

### 1. Temel Closure Örneği

```javascript
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (ayrı bir closure)
console.log(counter1()); // 3
```

### 2. Private Variables (Özel Değişkenler)

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit: function (amount) {
      balance += amount;
      return balance;
    },
    withdraw: function (amount) {
      if (amount <= balance) {
        balance -= amount;
        return balance;
      }
      return 'Yetersiz bakiye';
    },
    getBalance: function () {
      return balance;
    },
  };
}

const account = createBankAccount(1000);
console.log(account.getBalance()); // 1000
console.log(account.deposit(500)); // 1500
console.log(account.withdraw(200)); // 1300
// account.balance; // undefined - doğrudan erişilemez
```

### 3. Function Factory (Fonksiyon Fabrikası)

```javascript
function createMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

### 4. Event Handlers ve Callbacks

```javascript
function setupButton(buttonId, message) {
  const button = document.getElementById(buttonId);

  button.addEventListener('click', function () {
    alert(message); // Closure sayesinde message'a erişebilir
  });
}

setupButton('myButton', 'Merhaba Dünya!');
```

### 5. Module Pattern

```javascript
const myModule = (function () {
  let privateVariable = 'Bu özel';

  function privateFunction() {
    return 'Bu da özel fonksiyon';
  }

  return {
    publicMethod: function () {
      return privateVariable + ' - ' + privateFunction();
    },
    setPrivateVariable: function (value) {
      privateVariable = value;
    },
  };
})();

console.log(myModule.publicMethod()); // "Bu özel - Bu da özel fonksiyon"
myModule.setPrivateVariable('Yeni değer');
console.log(myModule.publicMethod()); // "Yeni değer - Bu da özel fonksiyon"
```

## TypeScript ile Closure Örnekleri

### 1. Generic Closure

```typescript
function createCache<T>(key: string): {
  get: () => T | undefined;
  set: (value: T) => void;
  clear: () => void;
} {
  let cachedValue: T | undefined;

  return {
    get: (): T | undefined => cachedValue,
    set: (value: T): void => {
      cachedValue = value;
    },
    clear: (): void => {
      cachedValue = undefined;
    },
  };
}

const stringCache = createCache<string>('myString');
stringCache.set('Merhaba');
console.log(stringCache.get()); // "Merhaba"
```

### 2. Async Closure

```typescript
function createAsyncCounter(): {
  increment: () => Promise<number>;
  getValue: () => number;
} {
  let count = 0;

  return {
    increment: async (): Promise<number> => {
      // Simüle edilmiş async işlem
      await new Promise((resolve) => setTimeout(resolve, 100));
      count++;
      return count;
    },
    getValue: (): number => count,
  };
}

const asyncCounter = createAsyncCounter();
asyncCounter.increment().then((value) => {
  console.log(value); // 1
});
```

### 3. Configuration Closure

```typescript
interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
}

function createApiClient(config: Config) {
  const { apiUrl, timeout, retries } = config;

  return {
    get: async <T>(endpoint: string): Promise<T> => {
      const url = `${apiUrl}${endpoint}`;
      // API çağrısı implementasyonu
      return fetch(url).then((response) => response.json());
    },
    post: async <T>(endpoint: string, data: any): Promise<T> => {
      const url = `${apiUrl}${endpoint}`;
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((response) => response.json());
    },
    getConfig: (): Config => ({ apiUrl, timeout, retries }),
  };
}

const apiClient = createApiClient({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
});
```

## Closure'ların Avantajları

### 1. Data Encapsulation (Veri Kapsülleme)

- Private değişkenler oluşturabilirsiniz
- Dışarıdan doğrudan erişimi engelleyebilirsiniz

### 2. State Management (Durum Yönetimi)

- Fonksiyonlar arasında durum paylaşabilirsiniz
- Global değişkenlerden kaçınabilirsiniz

### 3. Function Factories (Fonksiyon Fabrikası)

- Dinamik olarak fonksiyonlar oluşturabilirsiniz
- Parametreli fonksiyonlar üretebilirsiniz

### 4. Module Pattern

- Kod organizasyonu sağlar
- Namespace pollution'ı önler

## Dikkat Edilmesi Gerekenler

### 1. Memory Leaks (Bellek Sızıntıları)

```javascript
// Kötü örnek - memory leak
function createBadClosure() {
  const largeData = new Array(1000000).fill('data');

  return function () {
    // largeData hala bellekte tutuluyor
    return 'Hello';
  };
}

// İyi örnek
function createGoodClosure() {
  const largeData = new Array(1000000).fill('data');

  return function () {
    // largeData'yı kullanıp temizle
    const result = largeData.length;
    largeData.length = 0; // Temizle
    return result;
  };
}
```

### 2. Loop Problemleri

```javascript
// Kötü örnek
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // Hep 3 yazdırır
  }, 100);
}

// Çözüm 1: let kullan
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // 0, 1, 2 yazdırır
  }, 100);
}

// Çözüm 2: IIFE kullan
for (var i = 0; i < 3; i++) {
  (function (index) {
    setTimeout(function () {
      console.log(index); // 0, 1, 2 yazdırır
    }, 100);
  })(i);
}
```

## Pratik Kullanım Senaryoları

### 1. Debouncing

```javascript
function createDebounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedSearch = createDebounce((query) => {
  console.log('Arama yapılıyor:', query);
}, 300);

// Kullanım
debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc'); // Sadece bu çalışır
```

### 2. Throttling

```javascript
function createThrottle(func, limit) {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const throttledScroll = createThrottle(() => {
  console.log('Scroll event');
}, 100);
```

### 3. Memoization

```javascript
function createMemoize(func) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveFunction = createMemoize((n) => {
  console.log('Hesaplama yapılıyor:', n);
  return n * n;
});

console.log(expensiveFunction(5)); // Hesaplama yapılıyor: 5, 25
console.log(expensiveFunction(5)); // 25 (cache'den)
```

## Özet

Closures, JavaScript'in en güçlü özelliklerinden biridir ve şu durumlarda kullanılır:

1. **Private değişkenler** oluşturmak için
2. **Function factories** yapmak için
3. **Module pattern** implementasyonu için
4. **Event handlers** ve **callbacks** için
5. **State management** için
6. **Performance optimizasyonları** (debouncing, throttling, memoization) için

Closures'ları anlamak, JavaScript'te daha temiz, güvenli ve modüler kod yazmanızı sağlar. Ancak memory leak'lere dikkat etmek ve gereksiz closure'lar oluşturmaktan kaçınmak önemlidir.
