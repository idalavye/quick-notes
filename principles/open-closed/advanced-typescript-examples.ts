/**
 * Open-Closed Principle (OCP) - Advanced TypeScript Examples
 *
 * This file demonstrates complex scenarios where OCP is applied in real-world applications.
 * It includes plugin architectures, middleware systems, and enterprise-level patterns.
 */

// ============================================================================
// EXAMPLE 1: E-COMMERCE PRICING ENGINE
// ============================================================================

// Base interfaces for pricing
interface PricingRule {
  apply(cart: ShoppingCart): number;
  getRuleType(): string;
  getPriority(): number;
}

interface PricingContext {
  customer: Customer;
  cart: ShoppingCart;
  appliedRules: string[];
}

// Customer and cart models
interface Customer {
  id: string;
  type: 'regular' | 'premium' | 'vip';
  membershipDate: Date;
  totalPurchases: number;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface ShoppingCart {
  items: CartItem[];
  subtotal: number;
  customerId: string;
}

// Concrete pricing rules
class PercentageDiscountRule implements PricingRule {
  constructor(private percentage: number, private minAmount: number = 0, private category?: string) {}

  apply(cart: ShoppingCart): number {
    if (cart.subtotal < this.minAmount) return 0;

    const applicableItems = this.category ? cart.items.filter((item) => item.category === this.category) : cart.items;

    const applicableAmount = applicableItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return applicableAmount * (this.percentage / 100);
  }

  getRuleType(): string {
    return 'percentage_discount';
  }

  getPriority(): number {
    return 1;
  }
}

class FixedAmountDiscountRule implements PricingRule {
  constructor(private discountAmount: number, private minAmount: number = 0) {}

  apply(cart: ShoppingCart): number {
    if (cart.subtotal < this.minAmount) return 0;
    return Math.min(this.discountAmount, cart.subtotal);
  }

  getRuleType(): string {
    return 'fixed_amount_discount';
  }

  getPriority(): number {
    return 2;
  }
}

class CustomerTypeDiscountRule implements PricingRule {
  constructor(private customerType: string, private discountPercentage: number) {}

  apply(cart: ShoppingCart): number {
    // This would need customer context - simplified for example
    return cart.subtotal * (this.discountPercentage / 100);
  }

  getRuleType(): string {
    return 'customer_type_discount';
  }

  getPriority(): number {
    return 3;
  }
}

class BuyXGetYRule implements PricingRule {
  constructor(private buyQuantity: number, private getQuantity: number, private category: string) {}

  apply(cart: ShoppingCart): number {
    const categoryItems = cart.items.filter((item) => item.category === this.category);
    if (categoryItems.length === 0) return 0;

    const totalQuantity = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
    const freeItems = Math.floor(totalQuantity / (this.buyQuantity + this.getQuantity)) * this.getQuantity;

    if (freeItems === 0) return 0;

    const averagePrice = categoryItems.reduce((sum, item) => sum + item.price, 0) / categoryItems.length;
    return freeItems * averagePrice;
  }

  getRuleType(): string {
    return 'buy_x_get_y';
  }

  getPriority(): number {
    return 4;
  }
}

// New pricing rule can be added without modifying existing code
class VolumeDiscountRule implements PricingRule {
  constructor(private thresholds: { minQuantity: number; discountPercentage: number }[]) {}

  apply(cart: ShoppingCart): number {
    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    for (const threshold of this.thresholds.sort((a, b) => b.minQuantity - a.minQuantity)) {
      if (totalQuantity >= threshold.minQuantity) {
        return cart.subtotal * (threshold.discountPercentage / 100);
      }
    }

    return 0;
  }

  getRuleType(): string {
    return 'volume_discount';
  }

  getPriority(): number {
    return 5;
  }
}

// Pricing engine that's open for extension
class PricingEngine {
  private rules: PricingRule[] = [];

  addRule(rule: PricingRule): void {
    this.rules.push(rule);
    // Sort by priority for consistent application order
    this.rules.sort((a, b) => a.getPriority() - b.getPriority());
  }

  removeRule(ruleType: string): void {
    this.rules = this.rules.filter((rule) => rule.getRuleType() !== ruleType);
  }

  calculateDiscount(cart: ShoppingCart, context: PricingContext): number {
    let totalDiscount = 0;
    const appliedRules: string[] = [];

    for (const rule of this.rules) {
      const discount = rule.apply(cart);
      if (discount > 0) {
        totalDiscount += discount;
        appliedRules.push(rule.getRuleType());
      }
    }

    context.appliedRules = appliedRules;
    return totalDiscount;
  }

  getAvailableRules(): string[] {
    return this.rules.map((rule) => rule.getRuleType());
  }
}

// ============================================================================
// EXAMPLE 2: PLUGIN ARCHITECTURE FOR DATA PROCESSING
// ============================================================================

// Base plugin interface
interface DataProcessorPlugin {
  name: string;
  version: string;
  canProcess(data: any): boolean;
  process(data: any): Promise<any>;
  getConfiguration(): Record<string, any>;
  setConfiguration(config: Record<string, any>): void;
}

// Data processing context
interface ProcessingContext {
  source: string;
  destination: string;
  metadata: Record<string, any>;
  plugins: string[];
}

// Concrete plugins
class JSONProcessor implements DataProcessorPlugin {
  name = 'JSONProcessor';
  version = '1.0.0';
  private config: Record<string, any> = { prettyPrint: false };

  canProcess(data: any): boolean {
    return typeof data === 'object' && data !== null;
  }

  async process(data: any): Promise<any> {
    if (this.config.prettyPrint) {
      return JSON.stringify(data, null, 2);
    }
    return JSON.stringify(data);
  }

  getConfiguration(): Record<string, any> {
    return { ...this.config };
  }

  setConfiguration(config: Record<string, any>): void {
    this.config = { ...this.config, ...config };
  }
}

class XMLProcessor implements DataProcessorPlugin {
  name = 'XMLProcessor';
  version = '1.0.0';
  private config: Record<string, any> = { rootElement: 'data' };

  canProcess(data: any): boolean {
    return typeof data === 'object' && data !== null;
  }

  async process(data: any): Promise<any> {
    // Simplified XML conversion
    const rootElement = this.config.rootElement;
    return `<${rootElement}>${JSON.stringify(data)}</${rootElement}>`;
  }

  getConfiguration(): Record<string, any> {
    return { ...this.config };
  }

  setConfiguration(config: Record<string, any>): void {
    this.config = { ...this.config, ...config };
  }
}

class CSVProcessor implements DataProcessorPlugin {
  name = 'CSVProcessor';
  version = '1.0.0';
  private config: Record<string, any> = { delimiter: ',', headers: true };

  canProcess(data: any): boolean {
    return Array.isArray(data) && data.length > 0;
  }

  async process(data: any[]): Promise<any> {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('CSV processor requires array data');
    }

    const delimiter = this.config.delimiter;
    const headers = this.config.headers;

    if (headers && data.length > 0) {
      const headerRow = Object.keys(data[0]).join(delimiter);
      const dataRows = data.map((row) => Object.values(row).join(delimiter));
      return [headerRow, ...dataRows].join('\n');
    }

    return data.map((row) => Object.values(row).join(delimiter)).join('\n');
  }

  getConfiguration(): Record<string, any> {
    return { ...this.config };
  }

  setConfiguration(config: Record<string, any>): void {
    this.config = { ...this.config, ...config };
  }
}

// New plugin can be added without modifying existing code
class YAMLProcessor implements DataProcessorPlugin {
  name = 'YAMLProcessor';
  version = '1.0.0';
  private config: Record<string, any> = { indent: 2 };

  canProcess(data: any): boolean {
    return typeof data === 'object' && data !== null;
  }

  async process(data: any): Promise<any> {
    // Simplified YAML conversion
    const indent = ' '.repeat(this.config.indent);
    return this.convertToYAML(data, indent);
  }

  private convertToYAML(obj: any, indent: string): string {
    if (typeof obj !== 'object' || obj === null) {
      return JSON.stringify(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => `${indent}- ${this.convertToYAML(item, indent + '  ')}`).join('\n');
    }

    return Object.entries(obj)
      .map(([key, value]) => `${indent}${key}: ${this.convertToYAML(value, indent + '  ')}`)
      .join('\n');
  }

  getConfiguration(): Record<string, any> {
    return { ...this.config };
  }

  setConfiguration(config: Record<string, any>): void {
    this.config = { ...this.config, ...config };
  }
}

// Plugin manager that's open for extension
class DataProcessorManager {
  private plugins: Map<string, DataProcessorPlugin> = new Map();
  private processingHistory: ProcessingContext[] = [];

  registerPlugin(plugin: DataProcessorPlugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  unregisterPlugin(pluginName: string): void {
    this.plugins.delete(pluginName);
  }

  async processData(data: any, context: ProcessingContext): Promise<any> {
    const applicablePlugins = Array.from(this.plugins.values()).filter((plugin) => plugin.canProcess(data));

    if (applicablePlugins.length === 0) {
      throw new Error('No suitable processor found for the data');
    }

    // Use the first applicable plugin (could be enhanced with priority system)
    const processor = applicablePlugins[0];
    const result = await processor.process(data);

    // Record processing history
    this.processingHistory.push({
      ...context,
      plugins: [processor.name],
    });

    return result;
  }

  getAvailablePlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  getProcessingHistory(): ProcessingContext[] {
    return [...this.processingHistory];
  }
}

// ============================================================================
// EXAMPLE 3: MIDDLEWARE SYSTEM FOR WEB REQUESTS
// ============================================================================

// Request and response interfaces
interface Request {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: any;
  params: Record<string, string>;
  query: Record<string, string>;
}

interface Response {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
}

interface MiddlewareContext {
  request: Request;
  response: Response;
  next: () => Promise<void>;
  data: Record<string, any>;
}

// Middleware interface
interface Middleware {
  name: string;
  execute(context: MiddlewareContext): Promise<void>;
  getPriority(): number;
}

// Concrete middleware implementations
class AuthenticationMiddleware implements Middleware {
  name = 'AuthenticationMiddleware';

  constructor(private authService: AuthService) {}

  async execute(context: MiddlewareContext): Promise<void> {
    const token = context.request.headers['authorization'];

    if (!token) {
      context.response.statusCode = 401;
      context.response.body = { error: 'Authentication required' };
      return;
    }

    try {
      const user = await this.authService.validateToken(token);
      context.data.user = user;
      await context.next();
    } catch (error) {
      context.response.statusCode = 401;
      context.response.body = { error: 'Invalid token' };
    }
  }

  getPriority(): number {
    return 1;
  }
}

class LoggingMiddleware implements Middleware {
  name = 'LoggingMiddleware';

  constructor(private logger: Logger) {}

  async execute(context: MiddlewareContext): Promise<void> {
    const startTime = Date.now();

    this.logger.info(`Request started: ${context.request.method} ${context.request.url}`);

    await context.next();

    const duration = Date.now() - startTime;
    this.logger.info(`Request completed: ${context.response.statusCode} in ${duration}ms`);
  }

  getPriority(): number {
    return 10;
  }
}

class RateLimitingMiddleware implements Middleware {
  name = 'RateLimitingMiddleware';

  constructor(private rateLimiter: RateLimiter, private requestsPerMinute: number = 60) {}

  async execute(context: MiddlewareContext): Promise<void> {
    const clientId = context.request.headers['x-client-id'] || 'anonymous';

    if (!(await this.rateLimiter.isAllowed(clientId, this.requestsPerMinute))) {
      context.response.statusCode = 429;
      context.response.body = { error: 'Rate limit exceeded' };
      return;
    }

    await context.next();
  }

  getPriority(): number {
    return 2;
  }
}

class CachingMiddleware implements Middleware {
  name = 'CachingMiddleware';

  constructor(private cache: Cache) {}

  async execute(context: MiddlewareContext): Promise<void> {
    const cacheKey = this.generateCacheKey(context.request);
    const cachedResponse = await this.cache.get(cacheKey);

    if (cachedResponse) {
      context.response = cachedResponse;
      return;
    }

    await context.next();

    // Cache successful responses
    if (context.response.statusCode >= 200 && context.response.statusCode < 300) {
      await this.cache.set(cacheKey, context.response, 300); // 5 minutes
    }
  }

  private generateCacheKey(request: Request): string {
    return `${request.method}:${request.url}:${JSON.stringify(request.query)}`;
  }

  getPriority(): number {
    return 5;
  }
}

// New middleware can be added without modifying existing code
class CompressionMiddleware implements Middleware {
  name = 'CompressionMiddleware';

  constructor(private compressionService: CompressionService) {}

  async execute(context: MiddlewareContext): Promise<void> {
    await context.next();

    const acceptEncoding = context.request.headers['accept-encoding'] || '';

    if (acceptEncoding.includes('gzip') && this.shouldCompress(context.response)) {
      const compressed = await this.compressionService.compress(context.response.body, 'gzip');
      context.response.body = compressed;
      context.response.headers['content-encoding'] = 'gzip';
    }
  }

  private shouldCompress(response: Response): boolean {
    const contentType = response.headers['content-type'] || '';
    return contentType.includes('application/json') || contentType.includes('text/');
  }

  getPriority(): number {
    return 8;
  }
}

// Middleware pipeline that's open for extension
class MiddlewarePipeline {
  private middlewares: Middleware[] = [];

  addMiddleware(middleware: Middleware): void {
    this.middlewares.push(middleware);
    this.middlewares.sort((a, b) => a.getPriority() - b.getPriority());
  }

  removeMiddleware(name: string): void {
    this.middlewares = this.middlewares.filter((m) => m.name !== name);
  }

  async execute(request: Request): Promise<Response> {
    const response: Response = {
      statusCode: 200,
      headers: {},
      body: null,
    };

    const context: MiddlewareContext = {
      request,
      response,
      data: {},
      next: async () => {},
    };

    let currentIndex = 0;

    context.next = async () => {
      if (currentIndex < this.middlewares.length) {
        const middleware = this.middlewares[currentIndex++];
        await middleware.execute(context);
      }
    };

    await context.next();
    return response;
  }

  getMiddlewares(): string[] {
    return this.middlewares.map((m) => m.name);
  }
}

// ============================================================================
// EXAMPLE 4: REPORTING SYSTEM WITH MULTIPLE FORMATS
// ============================================================================

// Base report interface
interface ReportGenerator {
  generate(data: any[], config: ReportConfig): Promise<ReportResult>;
  getSupportedFormats(): string[];
  getReportType(): string;
}

interface ReportConfig {
  format: string;
  title: string;
  filters?: Record<string, any>;
  grouping?: string[];
  sorting?: { field: string; direction: 'asc' | 'desc' }[];
}

interface ReportResult {
  content: string;
  format: string;
  size: number;
  generatedAt: Date;
}

// Sample data interface
interface SalesData {
  id: string;
  date: Date;
  product: string;
  amount: number;
  region: string;
  salesperson: string;
}

// Concrete report generators
class PDFReportGenerator implements ReportGenerator {
  getSupportedFormats(): string[] {
    return ['pdf'];
  }

  getReportType(): string {
    return 'sales';
  }

  async generate(data: SalesData[], config: ReportConfig): Promise<ReportResult> {
    // Simplified PDF generation
    const content = this.generatePDFContent(data, config);
    return {
      content,
      format: 'pdf',
      size: content.length,
      generatedAt: new Date(),
    };
  }

  private generatePDFContent(data: SalesData[], config: ReportConfig): string {
    // Simplified PDF content generation
    let content = `%PDF-1.4\n`;
    content += `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
    content += `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
    content += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n`;
    content += `xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n`;
    content += `trailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n174\n%%EOF\n`;

    // Add report data as text (simplified)
    content += `\nReport: ${config.title}\n`;
    content += `Generated: ${new Date().toISOString()}\n`;
    content += `Total Records: ${data.length}\n`;

    return content;
  }
}

class ExcelReportGenerator implements ReportGenerator {
  getSupportedFormats(): string[] {
    return ['xlsx', 'xls'];
  }

  getReportType(): string {
    return 'sales';
  }

  async generate(data: SalesData[], config: ReportConfig): Promise<ReportResult> {
    // Simplified Excel generation
    const content = this.generateExcelContent(data, config);
    return {
      content,
      format: config.format,
      size: content.length,
      generatedAt: new Date(),
    };
  }

  private generateExcelContent(data: SalesData[], config: ReportConfig): string {
    // Simplified Excel content generation
    let content = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    content += `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">\n`;
    content += `<Worksheet Name="${config.title}">\n`;
    content += `<Table>\n`;

    // Headers
    content += `<Row>\n`;
    content += `<Cell><Data>ID</Data></Cell>\n`;
    content += `<Cell><Data>Date</Data></Cell>\n`;
    content += `<Cell><Data>Product</Data></Cell>\n`;
    content += `<Cell><Data>Amount</Data></Cell>\n`;
    content += `<Cell><Data>Region</Data></Cell>\n`;
    content += `<Cell><Data>Salesperson</Data></Cell>\n`;
    content += `</Row>\n`;

    // Data rows
    data.forEach((item) => {
      content += `<Row>\n`;
      content += `<Cell><Data>${item.id}</Data></Cell>\n`;
      content += `<Cell><Data>${item.date.toISOString()}</Data></Cell>\n`;
      content += `<Cell><Data>${item.product}</Data></Cell>\n`;
      content += `<Cell><Data>${item.amount}</Data></Cell>\n`;
      content += `<Cell><Data>${item.region}</Data></Cell>\n`;
      content += `<Cell><Data>${item.salesperson}</Data></Cell>\n`;
      content += `</Row>\n`;
    });

    content += `</Table>\n`;
    content += `</Worksheet>\n`;
    content += `</Workbook>\n`;

    return content;
  }
}

class CSVReportGenerator implements ReportGenerator {
  getSupportedFormats(): string[] {
    return ['csv'];
  }

  getReportType(): string {
    return 'sales';
  }

  async generate(data: SalesData[], config: ReportConfig): Promise<ReportResult> {
    const content = this.generateCSVContent(data, config);
    return {
      content,
      format: 'csv',
      size: content.length,
      generatedAt: new Date(),
    };
  }

  private generateCSVContent(data: SalesData[], config: ReportConfig): string {
    let content = 'ID,Date,Product,Amount,Region,Salesperson\n';

    data.forEach((item) => {
      content += `${item.id},${item.date.toISOString()},${item.product},${item.amount},${item.region},${item.salesperson}\n`;
    });

    return content;
  }
}

// New report generator can be added without modifying existing code
class JSONReportGenerator implements ReportGenerator {
  getSupportedFormats(): string[] {
    return ['json'];
  }

  getReportType(): string {
    return 'sales';
  }

  async generate(data: SalesData[], config: ReportConfig): Promise<ReportResult> {
    const reportData = {
      title: config.title,
      generatedAt: new Date().toISOString(),
      totalRecords: data.length,
      data: data,
      summary: this.generateSummary(data),
    };

    const content = JSON.stringify(reportData, null, 2);
    return {
      content,
      format: 'json',
      size: content.length,
      generatedAt: new Date(),
    };
  }

  private generateSummary(data: SalesData[]): any {
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
    const regions = [...new Set(data.map((item) => item.region))];
    const products = [...new Set(data.map((item) => item.product))];

    return {
      totalAmount,
      averageAmount: totalAmount / data.length,
      uniqueRegions: regions.length,
      uniqueProducts: products.length,
      topRegion: this.getTopRegion(data),
      topProduct: this.getTopProduct(data),
    };
  }

  private getTopRegion(data: SalesData[]): string {
    const regionTotals = data.reduce((acc, item) => {
      acc[item.region] = (acc[item.region] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(regionTotals).sort(([, a], [, b]) => b - a)[0][0];
  }

  private getTopProduct(data: SalesData[]): string {
    const productTotals = data.reduce((acc, item) => {
      acc[item.product] = (acc[item.product] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(productTotals).sort(([, a], [, b]) => b - a)[0][0];
  }
}

// Report manager that's open for extension
class ReportManager {
  private generators: Map<string, ReportGenerator> = new Map();

  addGenerator(generator: ReportGenerator): void {
    this.generators.set(generator.getReportType(), generator);
  }

  removeGenerator(reportType: string): void {
    this.generators.delete(reportType);
  }

  async generateReport(reportType: string, data: any[], config: ReportConfig): Promise<ReportResult> {
    const generator = this.generators.get(reportType);
    if (!generator) {
      throw new Error(`No generator found for report type: ${reportType}`);
    }

    if (!generator.getSupportedFormats().includes(config.format)) {
      throw new Error(`Format ${config.format} not supported by ${reportType} generator`);
    }

    return await generator.generate(data, config);
  }

  getSupportedReportTypes(): string[] {
    return Array.from(this.generators.keys());
  }

  getSupportedFormats(reportType: string): string[] {
    const generator = this.generators.get(reportType);
    return generator ? generator.getSupportedFormats() : [];
  }
}

// ============================================================================
// SUPPORTING INTERFACES AND CLASSES
// ============================================================================

// Mock services for demonstration
class AuthService {
  async validateToken(token: string): Promise<any> {
    // Mock implementation
    if (token === 'valid-token') {
      return { id: '1', name: 'John Doe', role: 'user' };
    }
    throw new Error('Invalid token');
  }
}

class Logger {
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  async isAllowed(clientId: string, maxRequests: number): Promise<boolean> {
    const now = Date.now();
    const minuteAgo = now - 60000;

    const clientRequests = this.requests.get(clientId) || [];
    const recentRequests = clientRequests.filter((time) => time > minuteAgo);

    if (recentRequests.length >= maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(clientId, recentRequests);
    return true;
  }
}

class Cache {
  private cache: Map<string, any> = new Map();

  async get(key: string): Promise<any> {
    return this.cache.get(key);
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    this.cache.set(key, value);
    // Simplified TTL implementation
    setTimeout(() => this.cache.delete(key), ttl * 1000);
  }
}

class CompressionService {
  async compress(data: any, algorithm: string): Promise<string> {
    // Mock compression
    return `compressed_${algorithm}_${JSON.stringify(data)}`;
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example usage of the pricing engine
async function demonstratePricingEngine() {
  console.log('=== E-Commerce Pricing Engine ===');

  const pricingEngine = new PricingEngine();

  // Add pricing rules
  pricingEngine.addRule(new PercentageDiscountRule(10, 100));
  pricingEngine.addRule(new FixedAmountDiscountRule(20, 50));
  pricingEngine.addRule(new BuyXGetYRule(2, 1, 'electronics'));
  pricingEngine.addRule(
    new VolumeDiscountRule([
      { minQuantity: 10, discountPercentage: 5 },
      { minQuantity: 50, discountPercentage: 10 },
      { minQuantity: 100, discountPercentage: 15 },
    ])
  );

  const cart: ShoppingCart = {
    items: [
      { productId: '1', name: 'Laptop', price: 1000, quantity: 1, category: 'electronics' },
      { productId: '2', name: 'Mouse', price: 50, quantity: 3, category: 'electronics' },
    ],
    subtotal: 1150,
    customerId: 'customer-1',
  };

  const context: PricingContext = {
    customer: { id: 'customer-1', type: 'regular', membershipDate: new Date(), totalPurchases: 0 },
    cart,
    appliedRules: [],
  };

  const discount = pricingEngine.calculateDiscount(cart, context);
  console.log(`Total discount: $${discount}`);
  console.log(`Applied rules: ${context.appliedRules.join(', ')}`);
}

// Example usage of the plugin system
async function demonstratePluginSystem() {
  console.log('\n=== Data Processing Plugin System ===');

  const processorManager = new DataProcessorManager();

  // Register plugins
  processorManager.registerPlugin(new JSONProcessor());
  processorManager.registerPlugin(new XMLProcessor());
  processorManager.registerPlugin(new CSVProcessor());
  processorManager.registerPlugin(new YAMLProcessor());

  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' },
  ];

  const context: ProcessingContext = {
    source: 'database',
    destination: 'file',
    metadata: { timestamp: new Date() },
    plugins: [],
  };

  // Process with different plugins
  const jsonResult = await processorManager.processData(data, context);
  console.log('JSON output:', jsonResult.substring(0, 100) + '...');

  const csvResult = await processorManager.processData(data, context);
  console.log('CSV output:', csvResult);

  console.log('Available plugins:', processorManager.getAvailablePlugins());
}

// Example usage of the middleware system
async function demonstrateMiddlewareSystem() {
  console.log('\n=== Middleware System ===');

  const pipeline = new MiddlewarePipeline();

  // Add middleware
  pipeline.addMiddleware(new LoggingMiddleware(new Logger()));
  pipeline.addMiddleware(new RateLimitingMiddleware(new RateLimiter(), 10));
  pipeline.addMiddleware(new AuthenticationMiddleware(new AuthService()));
  pipeline.addMiddleware(new CachingMiddleware(new Cache()));
  pipeline.addMiddleware(new CompressionMiddleware(new CompressionService()));

  const request: Request = {
    method: 'GET',
    url: '/api/users',
    headers: { authorization: 'valid-token' },
    body: null,
    params: {},
    query: {},
  };

  const response = await pipeline.execute(request);
  console.log('Response status:', response.statusCode);
  console.log('Response headers:', response.headers);

  console.log('Active middlewares:', pipeline.getMiddlewares());
}

// Example usage of the reporting system
async function demonstrateReportingSystem() {
  console.log('\n=== Reporting System ===');

  const reportManager = new ReportManager();

  // Add report generators
  reportManager.addGenerator(new PDFReportGenerator());
  reportManager.addGenerator(new ExcelReportGenerator());
  reportManager.addGenerator(new CSVReportGenerator());
  reportManager.addGenerator(new JSONReportGenerator());

  const salesData: SalesData[] = [
    { id: '1', date: new Date('2024-01-01'), product: 'Laptop', amount: 1000, region: 'North', salesperson: 'John' },
    { id: '2', date: new Date('2024-01-02'), product: 'Mouse', amount: 50, region: 'South', salesperson: 'Jane' },
    { id: '3', date: new Date('2024-01-03'), product: 'Keyboard', amount: 100, region: 'North', salesperson: 'John' },
  ];

  // Generate different report formats
  const pdfReport = await reportManager.generateReport('sales', salesData, {
    format: 'pdf',
    title: 'Sales Report Q1 2024',
  });

  const jsonReport = await reportManager.generateReport('sales', salesData, {
    format: 'json',
    title: 'Sales Report Q1 2024',
  });

  console.log('PDF report size:', pdfReport.size, 'bytes');
  console.log('JSON report size:', jsonReport.size, 'bytes');
  console.log('Supported formats for sales:', reportManager.getSupportedFormats('sales'));
}

// Run all demonstrations
async function runAllAdvancedDemonstrations() {
  await demonstratePricingEngine();
  await demonstratePluginSystem();
  await demonstrateMiddlewareSystem();
  await demonstrateReportingSystem();
}

// Export for use in other modules
export {
  // Pricing Engine
  PricingRule,
  PricingEngine,
  PercentageDiscountRule,
  FixedAmountDiscountRule,
  CustomerTypeDiscountRule,
  BuyXGetYRule,
  VolumeDiscountRule,

  // Plugin System
  DataProcessorPlugin,
  DataProcessorManager,
  JSONProcessor,
  XMLProcessor,
  CSVProcessor,
  YAMLProcessor,

  // Middleware System
  Middleware,
  MiddlewarePipeline,
  AuthenticationMiddleware,
  LoggingMiddleware,
  RateLimitingMiddleware,
  CachingMiddleware,
  CompressionMiddleware,

  // Reporting System
  ReportGenerator,
  ReportManager,
  PDFReportGenerator,
  ExcelReportGenerator,
  CSVReportGenerator,
  JSONReportGenerator,

  // Supporting types
  Customer,
  ShoppingCart,
  CartItem,
  PricingContext,
  ProcessingContext,
  Request,
  Response,
  MiddlewareContext,
  ReportConfig,
  ReportResult,
  SalesData,
  runAllAdvancedDemonstrations,
};

// Uncomment to run demonstrations
// runAllAdvancedDemonstrations();
