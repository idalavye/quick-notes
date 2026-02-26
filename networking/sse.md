---
title: SSE (Server-Sent Events)
parent: Networking
nav_order: 7
---

# SSE (Server-Sent Events)

## SSE Nedir?

**SSE (Server-Sent Events)**, **tek yönlü** (sadece sunucu → istemci) bir akış protokolüdür. **HTTP üzerinde** çalışır: client bir GET isteği açar, sunucu bağlantıyı açık tutup **uzun süre** metin tabanlı olaylar (event) gönderir. Yeni bir protokol değil; HTTP’nin belirli header’ları ve metin formatı kullanılır.

### Temel Özellikler

- **Tek yönlü**: Sadece sunucu client’a veri gönderir; client’tan sunucuya veri göndermek için ayrı bir istek (örn. POST) gerekir.
- **HTTP tabanlı**: Ayrı port veya upgrade yok; normal HTTP/HTTPS, `Content-Type: text/event-stream` ve uzun süre açık bağlantı.
- **Metin tabanlı**: Olaylar `data:`, `event:`, `id:` satırlarıyla kodlanır; JSON veya düz metin kullanılabilir.
- **Yeniden bağlanma**: Tarayıcı `EventSource` API’si ile bağlantı koptuğunda otomatik tekrar bağlanabilir (Last-Event-ID ile).

### Neden Önemli?

- Canlı bildirimler, hisse senedi fiyatları, log akışı gibi **sunucudan gelen sürekli güncellemeler** için basit bir çözümdür.
- WebSocket’ten daha basittir; çift yönlü iletişim gerekmiyorsa SSE yeterli olabilir.

## SSE vs WebSocket (kısa)

| Özellik     | SSE                         | WebSocket                           |
| ----------- | --------------------------- | ----------------------------------- |
| Yön         | Tek yönlü (server → client) | Çift yönlü                          |
| Taşıma      | HTTP (mevcut)               | HTTP upgrade, sonra kendi protokolü |
| Karmaşıklık | Düşük                       | Daha yüksek                         |
| Kullanım    | Bildirim, feed, log         | Sohbet, oyun, iki yönlü veri        |

## Özet

- SSE = HTTP üzerinde, sunucudan client’a sürekli olay akışı; tek yönlü, basit.
- Çift yönlü iletişim gerekiyorsa WebSocket tercih edilir.

---

**Sonraki:** [WebSocket (WS)](websocket.md)
