---
title: File Upload Checksum Validation
nav_order: 6
---

# File Upload Checksum Validation

Bir dosya bir sistemden diğerine (ör. istemciden sunucuya) yüklenirken, dosyanın bozulmadan veya değiştirilmeden gittiğinden emin olmak için yükleme sırasında hash (checksum) değerleri hesaplanır ve karşılaştırılır.

## Adım Adım Süreç

### 1. Checksum oluşturma (client tarafı)

- Dosyanın içeriği üzerinden belirli bir algoritma (örn. MD5, SHA-1, SHA-256) ile hash hesaplanır.
- Bu hash, dosya ile birlikte (örn. HTTP header'da Content-MD5, x-amz-content-sha256 gibi) sunucuya gönderilir.

### 2. Sunucu tarafında yeniden hesaplama

- Sunucu, yüklenen dosyayı kendi tarafında alır.
- Aynı algoritmayla tekrar hash hesaplar.

### 3. Karşılaştırma

- Eğer istemcinin gönderdiği checksum ile sunucunun hesapladığı checksum aynı ise dosya başarılı ve güvenli bir şekilde yüklenmiştir.
- Eğer farklı ise dosya yüklenirken bozulmuş, eksik gönderilmiş ya da değiştirilmiş demektir → sunucu yüklemeyi reddeder (ChecksumMismatch veya XAmzContentSHA256Mismatch hataları gibi).

## Kullanım Amaçları

- Veri bütünlüğünü sağlamak (dosya eksiksiz mi geldi?).
- Güvenlik (dosya transfer sırasında değiştirilmiş mi?).
- Hataları hızlı tespit etmek (örn. ağ hataları, paket kaybı, yanlış encoding).

## Örnek

**AWS S3'ye dosya yüklerken:**

- İstemci dosyanın SHA256 checksum'unu hesaplar ve x-amz-content-sha256 başlığıyla gönderir.
- S3 kendi tarafında checksum'u hesaplar.
- Eğer eşleşmezse XAmzContentSHA256Mismatch hatası döner.
