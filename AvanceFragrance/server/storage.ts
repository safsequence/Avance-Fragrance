import {
  products,
  customers,
  orders,
  orderItems,
  contactMessages,
  type Product,
  type InsertProduct,
  type Customer,
  type InsertCustomer,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type ContactMessage,
  type InsertContactMessage,
  type OrderWithItems,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  updateProductStock(id: number, stock: number): Promise<void>;

  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;

  // Order operations
  getOrders(): Promise<OrderWithItems[]>;
  getOrderById(id: number): Promise<OrderWithItems | undefined>;
  getOrdersByCustomer(customerId: number): Promise<OrderWithItems[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems>;
  updateOrderStatus(id: number, status: string): Promise<void>;
  getOrderStats(): Promise<{
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
  }>;

  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<void>;

  // Authentication operations
  registerCustomer(customer: InsertCustomer): Promise<Customer>;
  loginCustomer(email: string, password: string): Promise<Customer | null>;
}

export class DatabaseStorage implements IStorage {
  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.createdAt));
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(and(eq(products.category, category), eq(products.isActive, true)));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values({
      ...product,
      updatedAt: new Date(),
    }).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db.update(products)
      .set({
        ...product,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.update(products)
      .set({ isActive: false })
      .where(eq(products.id, id));
    return result.rowCount > 0;
  }

  async updateProductStock(id: number, stock: number): Promise<void> {
    await db.update(products)
      .set({ stock, updatedAt: new Date() })
      .where(eq(products.id, id));
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [updatedCustomer] = await db.update(customers)
      .set(customer)
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  // Order operations
  async getOrders(): Promise<OrderWithItems[]> {
    const ordersWithItems = await db.query.orders.findMany({
      with: {
        items: {
          with: {
            product: true,
          },
        },
        customer: true,
      },
      orderBy: desc(orders.orderDate),
    });
    return ordersWithItems;
  }

  async getOrderById(id: number): Promise<OrderWithItems | undefined> {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: true,
          },
        },
        customer: true,
      },
    });
    return order;
  }

  async getOrdersByCustomer(customerId: number): Promise<OrderWithItems[]> {
    const customerOrders = await db.query.orders.findMany({
      where: eq(orders.customerId, customerId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
        customer: true,
      },
      orderBy: desc(orders.orderDate),
    });
    return customerOrders;
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    
    const orderItemsData = items.map(item => ({
      ...item,
      orderId: newOrder.id,
    }));
    
    const insertedItems = await db.insert(orderItems).values(orderItemsData).returning();
    
    // Update product stock
    for (const item of items) {
      await db.update(products)
        .set({
          stock: sql`${products.stock} - ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId));
    }
    
    // Return the complete order with items
    const completeOrder = await this.getOrderById(newOrder.id);
    return completeOrder!;
  }

  async updateOrderStatus(id: number, status: string): Promise<void> {
    const updateData: any = { status };
    
    if (status === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }
    
    await db.update(orders).set(updateData).where(eq(orders.id, id));
  }

  async getOrderStats(): Promise<{
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
  }> {
    const stats = await db.select({
      totalSales: sql<number>`COALESCE(SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END), 0)`,
      totalOrders: sql<number>`COUNT(*)`,
      pendingOrders: sql<number>`COUNT(CASE WHEN status = 'pending' THEN 1 END)`,
      completedOrders: sql<number>`COUNT(CASE WHEN status = 'delivered' THEN 1 END)`,
    }).from(orders);
    
    return {
      totalSales: Number(stats[0]?.totalSales || 0),
      totalOrders: Number(stats[0]?.totalOrders || 0),
      pendingOrders: Number(stats[0]?.pendingOrders || 0),
      completedOrders: Number(stats[0]?.completedOrders || 0),
    };
  }

  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<void> {
    await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
  }

  // Authentication operations
  async registerCustomer(customerData: InsertCustomer): Promise<Customer> {
    // Hash password
    const hashedPassword = await bcrypt.hash(customerData.password, 12);
    
    // Create customer with hashed password
    const [newCustomer] = await db.insert(customers).values({
      ...customerData,
      password: hashedPassword,
    }).returning();
    
    return newCustomer;
  }

  async loginCustomer(email: string, password: string): Promise<Customer | null> {
    // Find customer by email
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    
    if (!customer) {
      return null;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, customer.password);
    
    if (!isValidPassword) {
      return null;
    }

    return customer;
  }

}

export const storage = new DatabaseStorage();
