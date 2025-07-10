# Avancé Apparel - Premium Fragrance E-commerce Platform

A luxury fragrance e-commerce platform built with modern web technologies, featuring a sleek dark luxury theme with gold accents and a focus on premium user experience.

## 🌟 Features

- **Product Catalog**: Browse fragrances by category with search and filtering
- **Shopping Cart**: Persistent cart with real-time quantity management
- **Checkout Process**: Multi-step checkout with shipping and payment options
- **Admin Panel**: Complete product, order, and customer management
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Luxury UI**: Dark theme with gold accents using premium typography

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** with dark luxury theme
- **Radix UI** components with custom styling
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Drizzle ORM
- **Neon** serverless PostgreSQL
- **Express Sessions** with PostgreSQL store

### Build Tools
- **Vite** for fast development and optimized builds
- **TypeScript** for type safety
- **ESBuild** for backend bundling

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- PostgreSQL database (or Neon account)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd avance-apparel
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

4. Push database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express application
├── shared/                 # Shared TypeScript schemas
└── dist/                   # Production build output
```

## 🎨 Design System

- **Typography**: Inter for body text, Playfair Display for headings
- **Colors**: Dark backgrounds with gold highlights (HSL-based)
- **Components**: Shadcn/ui with luxury customizations
- **Theme**: Consistent dark luxury aesthetic throughout

## 🛍️ Product Categories

- Men's Fragrances
- Women's Perfumes
- Unisex Scents
- Limited Edition

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🌐 Deployment

This project is configured for deployment on Replit:

1. The build process creates optimized frontend and backend bundles
2. Static files are served from `dist/public`
3. The production server runs on the configured port

For deployment:
```bash
npm run build
npm run start
```

## 📊 Database Schema

- **Products**: Product information, pricing, and inventory
- **Customers**: User accounts and profiles
- **Orders**: Order processing and tracking
- **Order Items**: Individual line items
- **Contact Messages**: Customer inquiries

## 🔒 Authentication

- Express sessions with PostgreSQL store
- Secure password hashing with bcryptjs
- Protected admin routes

## 🛒 Cart Management

- React Context for global cart state
- Persistent cart across sessions
- Real-time inventory validation

## 📱 Responsive Features

- Mobile-first design approach
- Touch-friendly interface
- Optimized performance on all devices

## 🎯 Key Components

- **Product Cards**: Elegant product display with hover effects
- **Cart Overlay**: Slide-out cart with real-time updates
- **Admin Dashboard**: Comprehensive management interface
- **Checkout Flow**: Streamlined purchase process

## 🔍 API Endpoints

- `GET /api/products` - Fetch products with filtering
- `POST /api/cart` - Manage cart operations
- `POST /api/orders` - Create new orders
- `GET /api/admin/*` - Admin management endpoints

## 🎨 Customization

The luxury theme can be customized through:
- CSS custom properties in `client/src/index.css`
- Tailwind configuration in `tailwind.config.ts`
- Component variants in the UI components

## 📄 License

MIT License - feel free to use this project as a foundation for your own e-commerce platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ for luxury fragrance enthusiasts
