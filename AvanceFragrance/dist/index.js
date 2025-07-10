var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  contactMessages: () => contactMessages,
  customers: () => customers,
  customersRelations: () => customersRelations,
  insertContactMessageSchema: () => insertContactMessageSchema,
  insertCustomerSchema: () => insertCustomerSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertProductSchema: () => insertProductSchema,
  insertReviewSchema: () => insertReviewSchema,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  products: () => products,
  productsRelations: () => productsRelations,
  reviews: () => reviews,
  reviewsRelations: () => reviewsRelations
});
import { pgTable, text, serial, integer, decimal, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  rating: integer("rating").notNull(),
  // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at")
});
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull()
});
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  reviews: many(reviews)
}));
var customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews)
}));
var reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id]
  }),
  customer: one(customers, {
    fields: [reviews.customerId],
    references: [customers.id]
  })
}));
var ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id]
  }),
  items: many(orderItems)
}));
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderDate: true,
  shippedAt: true,
  deliveredAt: true
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});
var insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  isRead: true,
  createdAt: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
var DatabaseStorage = class {
  // Product operations
  async getProducts() {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.createdAt));
  }
  async getProductById(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  async getProductsByCategory(category) {
    return await db.select().from(products).where(and(eq(products.category, category), eq(products.isActive, true)));
  }
  async createProduct(product) {
    const [newProduct] = await db.insert(products).values({
      ...product,
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return newProduct;
  }
  async updateProduct(id, product) {
    const [updatedProduct] = await db.update(products).set({
      ...product,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(products.id, id)).returning();
    return updatedProduct;
  }
  async deleteProduct(id) {
    const result = await db.update(products).set({ isActive: false }).where(eq(products.id, id));
    return result.rowCount > 0;
  }
  async updateProductStock(id, stock) {
    await db.update(products).set({ stock, updatedAt: /* @__PURE__ */ new Date() }).where(eq(products.id, id));
  }
  // Customer operations
  async getCustomers() {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }
  async getCustomerById(id) {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }
  async getCustomerByEmail(email) {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer;
  }
  async createCustomer(customer) {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }
  async updateCustomer(id, customer) {
    const [updatedCustomer] = await db.update(customers).set(customer).where(eq(customers.id, id)).returning();
    return updatedCustomer;
  }
  // Order operations
  async getOrders() {
    const ordersWithItems = await db.query.orders.findMany({
      with: {
        items: {
          with: {
            product: true
          }
        },
        customer: true
      },
      orderBy: desc(orders.orderDate)
    });
    return ordersWithItems;
  }
  async getOrderById(id) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: true
          }
        },
        customer: true
      }
    });
    return order;
  }
  async getOrdersByCustomer(customerId) {
    const customerOrders = await db.query.orders.findMany({
      where: eq(orders.customerId, customerId),
      with: {
        items: {
          with: {
            product: true
          }
        },
        customer: true
      },
      orderBy: desc(orders.orderDate)
    });
    return customerOrders;
  }
  async createOrder(order, items) {
    const [newOrder] = await db.insert(orders).values(order).returning();
    const orderItemsData = items.map((item) => ({
      ...item,
      orderId: newOrder.id
    }));
    const insertedItems = await db.insert(orderItems).values(orderItemsData).returning();
    for (const item of items) {
      await db.update(products).set({
        stock: sql`${products.stock} - ${item.quantity}`,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(products.id, item.productId));
    }
    const completeOrder = await this.getOrderById(newOrder.id);
    return completeOrder;
  }
  async updateOrderStatus(id, status) {
    const updateData = { status };
    if (status === "shipped") {
      updateData.shippedAt = /* @__PURE__ */ new Date();
    } else if (status === "delivered") {
      updateData.deliveredAt = /* @__PURE__ */ new Date();
    }
    await db.update(orders).set(updateData).where(eq(orders.id, id));
  }
  async getOrderStats() {
    const stats = await db.select({
      totalSales: sql`COALESCE(SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END), 0)`,
      totalOrders: sql`COUNT(*)`,
      pendingOrders: sql`COUNT(CASE WHEN status = 'pending' THEN 1 END)`,
      completedOrders: sql`COUNT(CASE WHEN status = 'delivered' THEN 1 END)`
    }).from(orders);
    return {
      totalSales: Number(stats[0]?.totalSales || 0),
      totalOrders: Number(stats[0]?.totalOrders || 0),
      pendingOrders: Number(stats[0]?.pendingOrders || 0),
      completedOrders: Number(stats[0]?.completedOrders || 0)
    };
  }
  // Contact message operations
  async getContactMessages() {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
  async createContactMessage(message) {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }
  async markMessageAsRead(id) {
    await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
  }
  // Authentication operations
  async registerCustomer(customerData) {
    const hashedPassword = await bcrypt.hash(customerData.password, 12);
    const [newCustomer] = await db.insert(customers).values({
      ...customerData,
      password: hashedPassword
    }).returning();
    return newCustomer;
  }
  async loginCustomer(email, password) {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    if (!customer) {
      return null;
    }
    const isValidPassword = await bcrypt.compare(password, customer.password);
    if (!isValidPassword) {
      return null;
    }
    return customer;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products2;
      if (category && typeof category === "string") {
        products2 = await storage.getProductsByCategory(category);
      } else {
        products2 = await storage.getProducts();
      }
      res.json(products2);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  app2.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  app2.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.get("/api/customers", async (req, res) => {
    try {
      const customers2 = await storage.getCustomers();
      res.json(customers2);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });
  app2.get("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const customer = await storage.getCustomerById(id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });
  app2.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create customer" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      const orders2 = await storage.getOrders();
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const createOrderSchema = z.object({
        order: insertOrderSchema,
        items: z.array(insertOrderItemSchema)
      });
      const { order: orderData, items } = createOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData, items);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = z.object({ status: z.string() }).parse(req.body);
      await storage.updateOrderStatus(id, status);
      res.json({ message: "Order status updated successfully" });
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order status" });
    }
  });
  app2.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getOrderStats();
      const products2 = await storage.getProducts();
      const customers2 = await storage.getCustomers();
      res.json({
        ...stats,
        totalProducts: products2.length,
        totalCustomers: customers2.length
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });
  app2.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });
  app2.post("/api/contact-messages", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contact message" });
    }
  });
  app2.put("/api/contact-messages/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markMessageAsRead(id);
      res.json({ message: "Message marked as read" });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const existingCustomer = await storage.getCustomerByEmail(customerData.email);
      if (existingCustomer) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const customer = await storage.registerCustomer(customerData);
      const { password, ...customerResponse } = customer;
      res.status(201).json(customerResponse);
    } catch (error) {
      console.error("Error creating customer:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create customer" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const customer = await storage.loginCustomer(email, password);
      if (!customer) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const { password: _, ...customerResponse } = customer;
      res.json(customerResponse);
    } catch (error) {
      console.error("Error logging in customer:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
