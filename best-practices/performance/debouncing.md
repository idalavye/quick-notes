---
title: Debouncing
parent: Best Practices
nav_order: 1
---

# Debouncing (Geciktirme/Erteleme)

## Debouncing Nedir?

**Debouncing**, bir fonksiyonun çok sık çağrılmasını engellemek için kullanılan bir tekniktir. Temel mantığı, bir fonksiyonun belirli bir süre boyunca tekrar çağrılmaması durumunda ancak o zaman çalıştırılmasıdır.

### Gerçek Hayat Örneği

Asansör düğmesini düşünün. Düğmeye sürekli basarsanız, asansör her basışta hareket etmez. Bunun yerine, son basıştan sonra kısa bir süre bekler ve sonra hareket eder.

## Neden Kullanılır?

1. **Performans Optimizasyonu**: Gereksiz API çağrılarını önler
2. **Kullanıcı Deneyimi**: Arama kutularında anlık sonuçlar için
3. **Kaynak Yönetimi**: Server yükünü azaltır
4. **Rate Limiting**: Çok sık işlem yapılmasını engeller

## Yaygın Kullanım Alanları

### 1. Arama Kutuları (Search Input)

```typescript
// Kullanıcı yazmayı bıraktıktan 300ms sonra arama yap
const searchInput = document.getElementById('search');
let debounceTimer: NodeJS.Timeout;

searchInput.addEventListener('input', (event) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    performSearch(event.target.value);
  }, 300);
});
```

### 2. Resize Event'leri

```typescript
// Pencere boyutu değişikliği bitince layout'u güncelle
let resizeTimer: NodeJS.Timeout;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateLayout();
  }, 250);
});
```

### 3. Button Click'leri

```typescript
// Çift tıklamayı önle
let clickTimer: NodeJS.Timeout;

button.addEventListener('click', () => {
  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => {
    submitForm();
  }, 300);
});
```

## Debounce Fonksiyonu Implementasyonu

### Basit Debounce

```typescript
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Kullanım
const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);
```

### Gelişmiş Debounce (Immediate Option)

```typescript
function debounce<T extends (...args: any[]) => any>(func: T, delay: number, immediate: boolean = false): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    const callNow = immediate && !timeoutId;

    clearTimeout(timeoutId!);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) func.apply(this, args);
    }, delay);

    if (callNow) func.apply(this, args);
  };
}
```

## React Hook Örneği

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Kullanım
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // API çağrısı yap
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Arama yapın..." />;
}
```

## Debouncing vs Throttling

### Debouncing

- **Ne zaman**: Son çağrıdan sonra belirli süre bekler
- **Kullanım**: Arama kutuları, form validasyonu
- **Örnek**: Kullanıcı yazmayı bıraktıktan 300ms sonra ara

### Throttling

- **Ne zaman**: Belirli aralıklarla çağrı yapar
- **Kullanım**: Scroll events, resize events
- **Örnek**: Her 100ms'de bir scroll pozisyonunu kontrol et

## Avantajları

1. **Performans Artışı**: Gereksiz işlemler azalır
2. **Kaynak Tasarrufu**: CPU ve network kullanımı optimize olur
3. **Kullanıcı Deneyimi**: Daha akıcı arayüz
4. **Server Yükü**: API çağrıları azalır

## Dezavantajları

1. **Gecikme**: İşlemler gecikmeli gerçekleşir
2. **Karmaşıklık**: Kod karmaşıklığı artar
3. **Memory**: Timer referansları memory'de tutulur

## Best Practices

1. **Uygun Süre Seçimi**:
   - Arama: 300-500ms
   - Resize: 100-250ms
   - Button click: 300ms

2. **Cleanup**: Component unmount olurken timer'ları temizle

3. **Context Binding**: `this` context'ini doğru şekilde bind et

4. **TypeScript**: Generic tipler kullanarak type safety sağla

## Özet

Debouncing, kullanıcı deneyimini artıran ve performansı optimize eden önemli bir tekniktir. Özellikle kullanıcı input'larında ve event handling'de sıkça kullanılır. Doğru implementasyon ile hem performans hem de kullanıcı deneyimi önemli ölçüde iyileşir.
