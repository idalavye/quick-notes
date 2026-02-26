---
title: HTTP
parent: Networking
nav_order: 6
---

# HTTP (HyperText Transfer Protocol)

## HTTP Nedir?

**HTTP**, uygulama katmanında çalışan bir **istek–cevap (request–response)** protokolüdür. Genelde **TCP üzerinde** kullanılır: istemci (client) bir istek gönderir, sunucu (server) cevap döner.

### Temel Özellikler

- **Request–Response**: Her etkileşimde client istek atar, server yanıt verir.
- **Stateless**: Sunucu, önceki istekleri “hatırlamak” zorunda değildir; state cookie, session veya token ile uygulama tarafında tutulur.
- **Metodlar**: GET (okuma), POST (gönderme), PUT, PATCH, DELETE vb. ile ne yapılacağı belirtilir.
- **Bağlantı**: HTTP/1.0’da istek sonrası bağlantı kapanabilir; HTTP/1.1’de aynı TCP bağlantısı tekrar kullanılabilir (keep-alive).

### Neden Önemli?

- Web sayfaları, REST API’ler ve çoğu mobil/ web uygulaması HTTP (ve HTTPS) kullanır.
- WebSocket, başlangıçta HTTP üzerinden “upgrade” isteğiyle aynı TCP tünelini WebSocket’e çevirir; bu yüzden HTTP’yi bilmek WebSocket’i anlamaya yardımcı olur.

### Örnek: HTTP protokolünde istek ve cevap

Protokolün "kurallar seti" dediğimiz şey, ağda gidip gelen mesajların **formatı**dır. Aşağıda HTTP kurallarına uyan ham (raw) bir istek ve cevap örneği var.

**Client'ın gönderdiği istek (request):**

```http
GET /api/users/1 HTTP/1.1
Host: example.com
Accept: application/json

```

- İlk satır: **metod** (GET), **path** (/api/users/1), **HTTP sürümü** (1.1).
- Sonraki satırlar: **header'lar** (Host, Accept vb.).
- Boş satır: header'ların bittiğini gösterir; GET'te body yok.

**Server'ın döndüğü cevap (response):**

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 28

{"id":1,"name":"Ali"}
```

- İlk satır: **HTTP sürümü**, **status kodu** (200), **status metni** (OK).
- Header'lar: Content-Type, Content-Length.
- Boş satır sonrası: **body** (JSON gövde).

Bu yapı (ilk satır + header'lar + boş satır + body) HTTP protokolünün tanımladığı **format**dır; tarayıcı ve sunucu bu kurallara uyarak mesaj üretir ve yorumlar.

## HTTP vs WebSocket (kısa)

| Özellik       | HTTP                                             | WebSocket                                            |
| ------------- | ------------------------------------------------ | ---------------------------------------------------- |
| Model         | İstek–cevap                                      | Kalıcı, çift yönlü kanal                             |
| Kim başlatır? | Her seferinde client                             | Client başlatır; sonra her iki taraf da gönderebilir |
| Bağlantı      | İstek bitince kapanabilir veya tekrar kullanılır | Uzun süre açık kalır                                 |

## HTTPS nedir?

**HTTPS**, HTTP’nin **şifreli (güvenli)** halidir. Protokol mantığı (istek/cevap, header, body) aynıdır; fark, verinin ağda **şifrelenerek** taşınmasıdır.

- **HTTP** + **S**ecure: İstek ve cevap **açık metin** değil; araya giren biri paketleri görse bile içeriği okuyamaz.
- **TLS** (önceden SSL) kullanılır: Önce client–server arasında el sıkışma (handshake) yapılır, şifreleme anahtarları paylaşılır; sonra tüm HTTP trafiği bu anahtarlarla şifrelenir.
- Yine **TCP üzerinde** çalışır; TLS, HTTP mesajlarını TCP’ye vermeden önce şifreler.
- Tarayıcıda **kilit simgesi** ve **https://** = bağlantının şifreli olduğunu gösterir.

| Özellik   | HTTP             | HTTPS                 |
| --------- | ---------------- | --------------------- |
| Şifreleme | Yok (açık metin) | Var (TLS ile)         |
| Port      | 80               | 443                   |
| Kullanım  | Test / eski      | Ödeme, giriş, API’ler |

Özet: **HTTPS = HTTP + TLS şifrelemesi**; aynı protokol, ek güvenlik.

## Özet

- HTTP = TCP üzerinde çalışan, stateless, istek–cevap tabanlı uygulama protokolü.
- Web’in ve API’lerin büyük kısmı HTTP/HTTPS ile çalışır.

---

**Sonraki:** [SSE (Server-Sent Events)](sse.md)
