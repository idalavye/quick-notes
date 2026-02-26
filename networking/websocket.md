---
title: WebSocket
parent: Networking
nav_order: 8
---

# WebSocket (WS)

## WebSocket Nedir?

**WebSocket**, uygulama katmanında **kalıcı, çift yönlü (full-duplex)** bir iletişim kanalı sağlayan protokoldür. Önce **HTTP** ile “upgrade” isteği yapılır; aynı **TCP** bağlantısı WebSocket’e dönüştürülür. Sonrasında hem client hem server, bu kanal üzerinden sürekli mesaj gönderebilir.

### Temel Özellikler

- **Kalıcı bağlantı**: Bir kez kurulunca uzun süre açık kalır; her mesaj için yeni HTTP isteği gerekmez.
- **Çift yönlü**: Sunucu da istemciye kendi inisiyatifiyle veri gönderebilir (HTTP’de genelde sadece client istek atar).
- **TCP üzerinde**: Taşıma hâlâ TCP; sadece uygulama katmanındaki protokol WebSocket’tir.
- **HTTP ile başlar**: İlk el sıkışma HTTP Upgrade üzerinden yapılır; tarayıcı ve sunucu “WebSocket’e geçelim” der.

### Neden Önemli?

- Canlı bildirimler, sohbet, borsa fiyatları, oyun, gerçek zamanlı dashboard gibi **anlık veri** gereken yerlerde kullanılır.
- HTTP’nin istek–cevap modeli yerine “açık kanal” modeli sunar; böylece sunucu push ve düşük gecikme mümkün olur.

### Örnek: WebSocket protokolünde el sıkışma (handshake)

WebSocket, **HTTP ile başlar**: client bir HTTP isteği atar, server "protokolü değiştiriyoruz" der; aynı TCP bağlantısı WebSocket kanalına dönüşür. Aşağıda bu el sıkışmanın ham (raw) hali var.

**Client'ın gönderdiği istek (HTTP Upgrade):**

```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

```

- **Upgrade: websocket** ve **Connection: Upgrade** = "Bu bağlantıyı WebSocket'e çevirmek istiyorum."
- **Sec-WebSocket-Key**: El sıkışmayı doğrulamak için kullanılan rastgele base64 değer.
- **Sec-WebSocket-Version**: Protokol sürümü (13 yaygın).

**Server'ın döndüğü cevap (101 Switching Protocols):**

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

```

- **101 Switching Protocols** = "Kabul, artık bu bağlantıda WebSocket konuşuyoruz."
- **Sec-WebSocket-Accept**: Client'ın key'inden üretilen doğrulama; böylece gerçek bir WebSocket sunucusu olduğu anlaşılır.

Bu noktadan sonra aynı TCP bağlantısı üzerinden **WebSocket frame'leri** (küçük başlık + payload) gidip gelir; artık HTTP formatı kullanılmaz. Protokol, bu upgrade kuralları ve frame formatını tanımlar.

## HTTP vs WebSocket (özet)

| Özellik     | HTTP                                   | WebSocket                    |
| ----------- | -------------------------------------- | ---------------------------- |
| Model       | İstek–cevap                            | Açık kanal, çift yönlü       |
| Bağlantı    | İstek başına veya keep-alive           | Uzun süre açık               |
| Sunucu push | Polling veya benzeri yöntemler gerekir | Doğrudan sunucu gönderebilir |

## Özet

- WebSocket = TCP üzerinde, HTTP upgrade ile başlayan, kalıcı ve çift yönlü uygulama protokolü.
- Gerçek zamanlı ve anlık iletişim senaryolarında HTTP’ye alternatif veya tamamlayıcı olarak kullanılır.

---

**Önceki:** [SSE (Server-Sent Events)](sse.md) · **Başa dön:** [Networking](README.md)
