# Composite Pattern

**Ne yapar?** Hem tek elemanı hem de eleman gruplarını **aynı şekilde** kullanmana yarar. Klasör içinde dosya var, dosyanın içi yok — ama ikisine de "boyutunu ver" diyebilirsin. İşte Composite bu ağaç yapısını tek tip gibi kullanmayı sağlar.

**3 şey var:**

- **Component** → Ortak interface (herkesin uyduğu sözleşme)
- **Leaf** → Altı olmayan eleman (dosya, tek ürün)
- **Composite** → İçinde başka component'ler olan kutu (klasör, kutu)

---

## Örnek: Dosya ve Klasör

Dosya tek başına, klasör içinde dosya veya başka klasörler olabilir. İkisi de "boyut ver" diyebileceğimiz bir interface'e uyar.

```typescript
interface FileSystemComponent {
  getSize(): number;
}

// Leaf: sadece kendi boyutu
class File implements FileSystemComponent {
  constructor(
    private name: string,
    private size: number,
  ) {}
  getSize(): number {
    return this.size;
  }
}

// Composite: içindekilerin toplamı
class Folder implements FileSystemComponent {
  private children: FileSystemComponent[] = [];
  constructor(private name: string) {}

  add(c: FileSystemComponent) {
    this.children.push(c);
  }

  getSize(): number {
    return this.children.reduce((toplam, c) => toplam + c.getSize(), 0);
  }
}

// Kullanım
const f1 = new File('readme.txt', 100);
const f2 = new File('index.ts', 500);

const src = new Folder('src');
src.add(f2);

const root = new Folder('root');
root.add(f1);
root.add(src);

console.log(root.getSize()); // 600
```

Dosya mı klasör mü bilmeden `getSize()` çağırıyorsun — Composite'ın özü bu.

---

## Ne Zaman Kullanılır?

- İç içe yapı var: klasör/dosya, kutu/ürün, menü/alt menü.
- Tek bir tip ile hem tek elemanı hem grubu işlemek istiyorsun.

**Çalışan örnekler:** Aynı klasördeki [composite-examples.ts](./composite-examples.ts) — dosya/klasör, ürün/kutu, menü, görev/süre örnekleri. Çalıştırmak: `npx ts-node design-patterns/structural/composite/composite-examples.ts`

Daha fazla structural kavram için → [Composition ve Inheritance](../composition-inheritance.md).
