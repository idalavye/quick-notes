/**
 * Composite Pattern - TypeScript örnekleri
 * Çalıştırmak için: npx ts-node design-patterns/structural/composite/composite-examples.ts
 */

// ============== Örnek 1: Dosya / Klasör ==============
console.log('--- Örnek 1: Dosya / Klasör ---');

interface FileSystemComponent {
  getSize(): number;
  getName(): string;
}

// Leaf (isim global File ile çakışmasın diye FileNode)
class FileNode implements FileSystemComponent {
  constructor(
    private name: string,
    private size: number,
  ) {}
  getSize() {
    return this.size;
  }
  getName() {
    return this.name;
  }
}

class Folder implements FileSystemComponent {
  private children: FileSystemComponent[] = [];
  constructor(private name: string) {}
  add(c: FileSystemComponent) {
    this.children.push(c);
  }
  getSize() {
    return this.children.reduce((t, c) => t + c.getSize(), 0);
  }
  getName() {
    return this.name;
  }
}

const file1 = new FileNode('readme.txt', 100);
const file2 = new FileNode('index.ts', 500);
const src = new Folder('src');
src.add(file2);
const root = new Folder('root');
root.add(file1);
root.add(src);

console.log('root.getSize() =', root.getSize()); // 600

// ============== Örnek 2: Ürün / Kutu (fiyat) ==============
console.log('\n--- Örnek 2: Ürün / Kutu ---');

interface PricedItem {
  getPrice(): number;
  getLabel(): string;
}

class Product implements PricedItem {
  constructor(
    private name: string,
    private price: number,
  ) {}
  getPrice() {
    return this.price;
  }
  getLabel() {
    return this.name;
  }
}

class Box implements PricedItem {
  private items: PricedItem[] = [];
  constructor(private name: string) {}
  add(item: PricedItem) {
    this.items.push(item);
  }
  getPrice() {
    return this.items.reduce((t, i) => t + i.getPrice(), 0);
  }
  getLabel() {
    return `${this.name} [${this.items.map((i) => i.getLabel()).join(', ')}]`;
  }
}

const laptop = new Product('Laptop', 1000);
const mouse = new Product('Mouse', 30);
const smallBox = new Box('Küçük kutu');
smallBox.add(mouse);
const mainBox = new Box('Ana kutu');
mainBox.add(laptop);
mainBox.add(smallBox);

console.log('mainBox.getPrice() =', mainBox.getPrice());
console.log('mainBox.getLabel() =', mainBox.getLabel());

// ============== Örnek 3: Menü / Alt menü (UI) ==============
console.log('\n--- Örnek 3: Menü / Alt menü ---');

interface MenuItem {
  render(): string;
}

class MenuLeaf implements MenuItem {
  constructor(
    private label: string,
    private action: string,
  ) {}
  render() {
    return `  [${this.label}] -> ${this.action}`;
  }
}

class MenuGroup implements MenuItem {
  private items: MenuItem[] = [];
  constructor(private label: string) {}
  add(item: MenuItem) {
    this.items.push(item);
  }
  render() {
    const children = this.items.map((i) => i.render()).join('\n');
    return `[${this.label}]\n${children}`;
  }
}

const saveItem = new MenuLeaf('Kaydet', 'save()');
const exitItem = new MenuLeaf('Çıkış', 'exit()');
const fileMenu = new MenuGroup('Dosya');
fileMenu.add(saveItem);
fileMenu.add(exitItem);

const copyItem = new MenuLeaf('Kopyala', 'copy()');
const editMenu = new MenuGroup('Düzenle');
editMenu.add(copyItem);

const mainMenu = new MenuGroup('Ana menü');
mainMenu.add(fileMenu);
mainMenu.add(editMenu);

console.log(mainMenu.render());

// ============== Örnek 4: Görev / Alt görev (toplam süre) ==============
console.log('\n--- Örnek 4: Görev / Alt görev ---');

interface Task {
  getDurationMinutes(): number;
  getTitle(): string;
}

class SimpleTask implements Task {
  constructor(
    private title: string,
    private minutes: number,
  ) {}
  getDurationMinutes() {
    return this.minutes;
  }
  getTitle() {
    return this.title;
  }
}

class TaskGroup implements Task {
  private tasks: Task[] = [];
  constructor(private title: string) {}
  add(t: Task) {
    this.tasks.push(t);
  }
  getDurationMinutes() {
    return this.tasks.reduce((t, task) => t + task.getDurationMinutes(), 0);
  }
  getTitle() {
    return this.title;
  }
}

const t1 = new SimpleTask('Tasarım', 60);
const t2 = new SimpleTask('Kod yaz', 120);
const frontend = new TaskGroup('Frontend');
frontend.add(t1);
frontend.add(t2);
const backend = new SimpleTask('API', 90);
const project = new TaskGroup('Proje');
project.add(frontend);
project.add(backend);

console.log('Proje toplam süre (dk) =', project.getDurationMinutes()); // 270
