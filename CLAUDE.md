# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MealStack is a meal planning and recipe management application. This repository is currently in initial setup phase.

## Development Environment Setup

### Prerequisites
- Node.js (version to be determined based on package.json)
- npm or yarn package manager
- Git for version control

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/oz-TeamWizard/MealStack.git
cd MealStack

# Install dependencies (once package.json is created)
npm install

# Start development server (command to be determined)
npm run dev
```

## Common Development Commands

*Note: Commands will be updated once package.json and build tools are configured*

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test <filename>

# Generate test coverage
npm run test:coverage
```

## Architecture Overview

*This section will be expanded as the application architecture is developed*

### Planned Architecture
- Frontend: Modern JavaScript/TypeScript framework (React, Vue, or similar)
- Backend: Node.js with Express or similar framework
- Database: To be determined (likely PostgreSQL or MongoDB)
- Authentication: JWT-based authentication system
- API: RESTful API design

### Directory Structure (Planned)
```
MealStack/
├── frontend/          # Frontend application
├── backend/           # Backend API server
├── shared/           # Shared utilities and types
├── database/         # Database migrations and seeds
├── docs/             # Project documentation
└── scripts/          # Build and deployment scripts
```

## Key Features (Planned)
- User authentication and profiles
- Recipe creation and management
- Meal planning and scheduling
- Shopping list generation
- Nutritional information tracking
- Recipe sharing and discovery

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow consistent naming conventions
- Implement proper error handling
- Write unit tests for business logic
- Document complex functions and classes

### Git Workflow
- Use meaningful commit messages
- Create feature branches for new development
- Use pull requests for code review
- Keep commits focused and atomic

### Database
- Use migrations for schema changes
- Seed data for development environment
- Follow database naming conventions
- Index frequently queried fields

### API Design
- Follow RESTful principles
- Use consistent response formats
- Implement proper HTTP status codes
- Version API endpoints when necessary
- Document endpoints with OpenAPI/Swagger

## Environment Variables

*To be documented as the application is developed*

```bash
# Example environment variables
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost/mealstack_dev
JWT_SECRET=your-secret-key
```

## Deployment

*Deployment instructions will be added as deployment strategy is determined*

## Contributing

*Contribution guidelines will be established as the team grows*