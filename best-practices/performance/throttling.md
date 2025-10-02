# Throttling (Sınırlama/Kısıtlama)

## Throttling Nedir?

**Throttling**, bir fonksiyonun belirli zaman aralıklarında maksimum bir kez çalışmasını sağlayan tekniktir. Debouncing'den farklı olarak, throttling fonksiyonu düzenli aralıklarla çalıştırır ve son çağrıyı beklemez.

### Gerçek Hayat Örneği

Su muslugu düşünün. Musluğu ne kadar hızlı açıp kapatırsanız kapatın, suyun akış hızı belirli bir limite sahiptir. Throttling da benzer şekilde, ne kadar sık çağrılırsa çağrılsın, fonksiyon belirli aralıklarla çalışır.

## Neden Kullanılır?

1. **Düzenli Güncelleme**: Belirli aralıklarla sürekli güncelleme gerektiğinde
2. **Performans Kontrolü**: Yoğun işlemlerin sıklığını kontrol eder
3. **Smooth Animation**: Akıcı animasyonlar için
4. **API Rate Limiting**: API çağrılarını sınırlar

## Yaygın Kullanım Alanları

### 1. Scroll Events

```typescript
// Her 100ms'de bir scroll pozisyonunu kontrol et
let lastScrollTime = 0;

window.addEventListener('scroll', () => {
  const now = Date.now();
  if (now - lastScrollTime >= 100) {
    handleScroll();
    lastScrollTime = now;
  }
});
```

### 2. Mouse Move Events

```typescript
// Mouse hareketlerini 50ms aralıklarla takip et
let lastMoveTime = 0;

document.addEventListener('mousemove', (event) => {
  const now = Date.now();
  if (now - lastMoveTime >= 50) {
    updateMousePosition(event.clientX, event.clientY);
    lastMoveTime = now;
  }
});
```

### 3. Button Clicks (Rate Limiting)

```typescript
// Saniyede maksimum 2 kez tıklama izni ver
let lastClickTime = 0;
const clickLimit = 500; // 500ms = saniyede 2 kez

button.addEventListener('click', () => {
  const now = Date.now();
  if (now - lastClickTime >= clickLimit) {
    handleButtonClick();
    lastClickTime = now;
  }
});
```

## Throttle Fonksiyonu Implementasyonu

### Basit Throttle

```typescript
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Kullanım
const throttledScroll = throttle(() => {
  console.log('Scroll event handled');
}, 100);

window.addEventListener('scroll', throttledScroll);
```

### Gelişmiş Throttle (Leading & Trailing)

```typescript
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;
  const { leading = true, trailing = true } = options;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (!previous && !leading) previous = now;

    const remaining = limit - (now - previous);

    if (remaining <= 0 || remaining > limit) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = !leading ? 0 : Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}
```

### RequestAnimationFrame ile Throttle

```typescript
function throttleRAF<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void {
  let ticking = false;

  return function (...args: Parameters<T>) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

// Smooth scroll handling için ideal
const smoothScrollHandler = throttleRAF(() => {
  updateScrollPosition();
});
```

## React Hook Örneği

```typescript
import { useCallback, useRef } from 'react';

function useThrottle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  const inThrottle = useRef<boolean>(false);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (!inThrottle.current) {
        func.apply(this, args);
        inThrottle.current = true;
        setTimeout(() => (inThrottle.current = false), limit);
      }
    }) as T,
    [func, limit]
  );
}

// Kullanım
function ScrollComponent() {
  const handleScroll = useThrottle(() => {
    console.log('Scroll handled');
  }, 100);

  return (
    <div onScroll={handleScroll} style={{ height: '200vh' }}>
      Scroll me!
    </div>
  );
}
```

## Throttling vs Debouncing Karşılaştırması

| Özellik           | Throttling          | Debouncing                |
| ----------------- | ------------------- | ------------------------- |
| **Çalışma Şekli** | Düzenli aralıklarla | Son çağrıdan sonra bekler |
| **Frekans**       | Sabit aralıklar     | Değişken (aktivite durur) |
| **Kullanım**      | Scroll, mousemove   | Search, resize            |
| **Performans**    | Sürekli kontrol     | Aktivite bitince çalışır  |
| **Yanıt Süresi**  | Hemen başlar        | Gecikmeli başlar          |

### Görsel Karşılaştırma

```
Throttling:  |---|---|---|---|---|   (düzenli aralıklar)
Debouncing:  |----------|             (son aktiviteden sonra)
```

## Pratik Örnekler

### 1. Infinite Scroll

```typescript
const throttledScrollCheck = throttle(() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadMoreContent();
  }
}, 200);

window.addEventListener('scroll', throttledScrollCheck);
```

### 2. Search Suggestions (Throttled)

```typescript
// Kullanıcı yazarken her 300ms'de bir öneri getir
const throttledSearch = throttle((query: string) => {
  if (query.length > 2) {
    fetchSuggestions(query);
  }
}, 300);

searchInput.addEventListener('input', (e) => {
  throttledSearch(e.target.value);
});
```

### 3. API Rate Limiting

```typescript
class APIClient {
  private throttledRequest = throttle(this.makeRequest.bind(this), 1000);

  private async makeRequest(endpoint: string, data: any) {
    return fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public async post(endpoint: string, data: any) {
    return this.throttledRequest(endpoint, data);
  }
}
```

## Avantajları

1. **Düzenli Güncelleme**: Sürekli ve öngörülebilir çalışma
2. **Performans Kontrolü**: CPU kullanımını kontrol altında tutar
3. **Kullanıcı Deneyimi**: Akıcı etkileşim sağlar
4. **Kaynak Yönetimi**: Sistem kaynaklarını verimli kullanır

## Dezavantajları

1. **Gecikme**: İlk çağrıdan sonra bekleme süresi
2. **Kayıp Çağrılar**: Bazı çağrılar işlenmeyebilir
3. **Karmaşıklık**: Implementasyon karmaşıklığı
4. **Memory**: Timer referansları memory'de tutulur

## Ne Zaman Hangisini Kullanmalı?

### Throttling Kullan:

- **Scroll events**: Sürekli pozisyon takibi
- **Mouse move**: Koordinat güncelleme
- **Animation**: Frame rate kontrolü
- **API calls**: Düzenli veri güncellemesi
- **Progress tracking**: İlerleme takibi

### Debouncing Kullan:

- **Search input**: Arama sorguları
- **Form validation**: Validasyon kontrolleri
- **Resize events**: Layout güncellemeleri
- **Auto-save**: Otomatik kaydetme
- **Button clicks**: Çift tıklama önleme

## Best Practices

1. **Uygun Limit Seçimi**:

   - Scroll: 16-100ms (60fps için 16ms)
   - Mouse move: 16-50ms
   - API calls: 1000-5000ms
   - Animation: 16ms (requestAnimationFrame kullan)

2. **RequestAnimationFrame**: Animasyon ve görsel güncellemeler için

3. **Memory Management**: Component unmount'ta temizlik yap

4. **Leading/Trailing Options**: İhtiyaca göre ayarla

5. **Performance Monitoring**: Throttle etkisini ölç

## Özet

Throttling, sürekli tetiklenen olayları kontrol altında tutmak için kullanılan güçlü bir tekniktir. Debouncing'den farklı olarak düzenli aralıklarla çalışır ve özellikle scroll, mouse move gibi sürekli olaylar için idealdir. Doğru kullanıldığında hem performansı artırır hem de kullanıcı deneyimini iyileştirir.
