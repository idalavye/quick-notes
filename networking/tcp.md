---
title: TCP
parent: Networking
nav_order: 4
---

# TCP (Transmission Control Protocol)

## TCP Nedir?

**TCP**, taşıma katmanında kullanılan **bağlantılı (connection-oriented)** ve **güvenilir** bir protokoldür. Veri göndermeden önce iki uç arasında bağlantı kurulur; veri sıralı ve kayıpsız (veya hatalar düzeltilerek) iletilir.

### Temel Özellikler

- **Bağlantılı**: Önce 3-way handshake ile bağlantı kurulur, sonra veri akar.
- **Güvenilir**: Kaybolan veya bozulan paketler yeniden gönderilir; sıra korunur.
- **Akış (stream)**: Byte akışı olarak veri taşınır; “mesaj sınırları” uygulama katmanında belirlenir.
- **Çift yönlü**: Aynı bağlantı üzerinden her iki yönde de veri gidebilir.

### Neden Önemli?

- HTTP, HTTPS, WebSocket, SSH, veritabanı bağlantıları ve çoğu web/API trafiği **TCP üzerinde** çalışır.
- TCP’yi anlamak, HTTP ve WebSocket’in “bağlantı” ve “güvenilirlik” davranışını anlamanın temelidir.

## TCP vs (bir sonraki konu: UDP)

| Özellik      | TCP                        | UDP                     |
| ------------ | -------------------------- | ----------------------- |
| Bağlantı     | Evet (connection-oriented) | Hayır (connectionless)  |
| Güvenilirlik | Yüksek; kayıp düzeltilir   | Yok; kayıp kabul edilir |
| Sıra         | Garanti                    | Garanti değil           |
| Kullanım     | Web, API, SSH, DB          | Oyun, canlı yayın, DNS  |

## Özet

- TCP = Bağlantılı, güvenilir taşıma protokolü.
- HTTP ve WebSocket, TCP üzerinde çalışan uygulama protokolleridir.

---

**Sonraki:** [UDP](udp.md)
