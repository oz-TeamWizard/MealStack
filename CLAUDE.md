# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MealStack is a Korean bulk-up meal delivery service focusing on subscription-based orders. Built with Next.js 14 + JavaScript (no TypeScript) + Zustand + Tailwind CSS, targeting fitness enthusiasts aged 20-30.

## Development Commands

```bash
# Development server
npm run dev                # Runs on http://localhost:3000

# Production build
npm run build
npm start

# Code quality
npm run lint
```

Note: No test framework is configured yet. When adding tests, update this section with test commands.

## Architecture Overview

### State Management Architecture
Uses Zustand with three main stores:
- **authStore**: SMS authentication, 24hr auto-login, phone verification timer
- **cartStore**: Shopping cart items, subscription plan selection, quantity management
- **userStore**: User profile, order history, subscription management, address/payment methods

### Authentication Flow
1. Phone number input with auto-formatting (010-XXXX-XXXX)
2. SMS verification with 3-minute countdown timer
3. Automatic localStorage persistence for 24-hour sessions
4. All protected routes redirect to `/login` when unauthenticated

### Route Structure (App Router)
```
/                    → Auto-redirect based on auth status
/home               → Product showcase, subscription plans, pre-orders
/login              → SMS phone verification
/products           → Single product with quantity selection
/subscription       → Weekly/monthly subscription plans
/checkout           → Payment form (TossPayments integration planned)
/mypage             → Order history, subscription management
```

### Component Architecture
- **Common Components**: Button (primary/secondary/outline), Input (dark theme), Card (product/subscription variants)
- **Layout Components**: Header (with back button), BottomNav (SVG icons with active states)
- **Icons**: Custom SVG navigation icons matching Figma design (home, shop, star, user)

### Design System
- **Brand Colors**: Primary Red (#dc2626), Black Background (#111111)
- **Theme**: Dark UI with red accents, mobile-first responsive
- **Typography**: Inter font family
- **Color Constants**: Defined in `src/constants/colors.js` with Tailwind mappings

### Business Logic
- **Products**: Individual meals (₩12,000), 3-day sets (₩33,000), 7-day sets (₩75,000)
- **Subscriptions**: Weekly (₩65,000) and Premium Monthly (₩289,000) with nutrition management
- **User Flow**: Browse → Login → Cart → Checkout → Order Management

## Key Implementation Notes

### Authentication Guards
All order/subscription actions check `isAuthenticated` state and redirect to `/login`. No server-side session management implemented yet.

### Mock Data Strategy
Currently uses mock data in stores for development. API integration points are marked with `TODO:` comments throughout the codebase.

### Mobile Optimization
- Bottom navigation with active state indicators
- Touch-friendly 44px+ tap targets
- Responsive grid layouts for product display

### Future Backend Integration Points
- SMS API integration in `authStore.sendVerificationCode()`
- TossPayments integration in checkout flow
- User data persistence replacing localStorage approach
- Image upload for product photos in `public/images/`

## Development Team Structure

3-developer split by feature ownership:
- **Developer A**: Home page, SMS authentication, pre-order system
- **Developer B**: Product pages, shopping cart, payment integration  
- **Developer C**: Subscription management, user profile, order history

When working on cross-team features, coordinate through shared stores and component interfaces.

## Path Aliases

Uses `@/` alias for `src/` directory. Configured in `jsconfig.json` for IDE support.

## Important Context

This is a Korean service with Korean UI text and KRW pricing. The target user journey prioritizes subscription conversion over one-time purchases. Authentication is phone-based (common in Korean apps) rather than email-based.