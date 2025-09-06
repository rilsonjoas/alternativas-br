# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Alternativas BR is a curated platform for discovering Brazilian software alternatives to global solutions. It's a React-based web application with Firebase backend that helps users find and compare Brazilian tech products.

## Development Commands

```bash
# Development
npm run dev          # Start development server on port 3000
npm run start        # Alias for dev

# Build & Deploy
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint for code quality checks

# Data Management
npm run migrate      # Migrate data to Firebase (admin only)
```

## Tech Stack & Architecture

### Core Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components + Radix UI + Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: React Router DOM v6
- **Backend**: Firebase (Firestore + Auth)
- **Build Tool**: Vite with SWC

### Key Architectural Patterns

#### Firebase Integration
- All data operations go through service classes in `src/lib/services/`
- Firestore collections: `products` (unified), `categories`, `users`
- Authentication is admin-only for content management
- Products are differentiated by `location.countryCode` ('BR' for Brazilian, others for foreign)
- **NEW**: Unified product structure eliminates separation between national and foreign products

#### Component Architecture
- **UI Components**: Located in `src/components/ui/` (shadcn/ui system)
- **Feature Components**: Domain-specific components in `src/components/`
- **Page Components**: Full page implementations in `src/pages/`
- **Layout Components**: Header/Footer in `src/components/layout/`

#### Routing Structure
```
/ - Homepage with hero and featured products
/categorias - Categories listing
/categorias/:slug - Category detail page
/alternativas - All alternatives listing  
/produto/:slug - Product detail page
/buscar - Search results
/dashboard/* - Admin panel (protected routes)
/login - Admin authentication
```

#### State Management
- **Authentication**: Context-based (`src/contexts/AuthContext.tsx`)
- **Server State**: TanStack Query for caching and synchronization
- **Admin Protection**: `ProtectedRoute` component wraps admin routes

### File Path Aliases
The project uses TypeScript path mapping with `@/*` pointing to `src/*`:
```typescript
import { Button } from "@/components/ui/button"
import { productService } from "@/lib/services/productService"
```

## Key Services

### Unified Product Service (`src/lib/services/unifiedProductService.ts`)
Core service for all product operations (replaces separate national/foreign services):
- `createProduct(data)` - Create new product (national or foreign)
- `getAllProducts()` - Fetch all products
- `getBrazilianProducts()` - Filter Brazilian products only
- `getForeignProducts()` - Filter foreign products only
- `getProductBySlug(slug)` - Get product by slug
- `getProductsByCategory(categorySlug, onlyBrazilian)` - Filter by category
- `getFeaturedProducts(limit, onlyBrazilian)` - Featured products
- `getUnicornProducts()` - Unicorn companies
- `searchProducts(term, filters)` - Advanced search with filters

### Product Service (`src/lib/services/productService.ts`)
Public frontend API (delegates to unifiedProductService):
- Provides simplified interface for frontend components
- Defaults to Brazilian products for public site
- Includes view tracking and caching

### Admin Product Service (`src/lib/services/adminProductService.ts`)
Admin panel operations (delegates to unifiedProductService):
- Full CRUD operations for products
- Product statistics and analytics
- Bulk operations and management

### Auth Service (`src/lib/services/authService.ts`)
Firebase Authentication wrapper:
- Admin-only authentication
- Google OAuth integration
- Session management

### Category Service (`src/lib/services/categoryService.ts`)
Category management operations for admin panel.

## Data Models

### Product Interface
```typescript
interface Product {
  id: string
  slug: string
  name: string
  description: string
  shortDescription?: string
  logo: string
  website: string
  
  // Categoria
  category: string
  categorySlug: string
  categoryId: string
  
  // Localização (determina se é nacional ou estrangeiro)
  location: ProductLocation
  
  // Informações da empresa
  companyInfo: CompanyInfo
  
  // Preços
  pricing: PricingInfo
  
  // Características
  features: string[]
  tags: string[]
  screenshots?: string[]
  
  // Status
  isActive: boolean
  isFeatured: boolean
  isUnicorn?: boolean
  
  // Relacionamentos
  alternatives?: string[] // Product IDs
  alternativeTo?: string[] // Para produtos estrangeiros
  
  // Métricas
  views?: number
  userCount?: string
  
  // Social
  socialLinks?: SocialLinks
  
  // Auditoria
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
```

### Category Interface
```typescript
interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  productCount: number
  featured?: boolean
  isActive?: boolean
}
```

## Environment Setup

The project requires Firebase configuration. Key environment variables should be set in a Firebase config file at `src/lib/firebase-config.ts`.

## Testing & Quality

- ESLint configuration with React and TypeScript rules
- TypeScript strict mode disabled for some checks (`noImplicitAny: false`)
- Pre-commit hooks may be configured for code quality

## Admin Panel Features

Protected admin routes (`/dashboard/*`) include:
- Product management (CRUD operations)
- Category management
- User management
- Foreign products management
- Dashboard with statistics

Access is restricted to authenticated admin users only.

## Important Notes

- All Brazilian products must have `location.countryCode` field set to 'BR'
- Slugs are used for SEO-friendly URLs
- The platform focuses on Brazilian alternatives to international software
- Firebase Firestore doesn't support full-text search natively - search is implemented client-side
- Admin authentication is required for content management features