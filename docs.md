# Webapp Conversation Project Onboarding Guide

## Project Overview
**Type**: Next.js 14 Application (TypeScript)  
**Core Features**:
- Real-time chat interface
- Workflow configuration editor
- Multi-language support (EN/ES/JA/VI/ZH)
- Message management API
- Markdown/Math equation rendering

## Technology Stack
### Core Dependencies
- **Framework**: Next.js 14
- **UI**: React 18, Tailwind CSS, HeadlessUI
- **State**: SWR, Immer, ahooks
- **Internationalization**: i18next, react-i18next
- **Editor**: Monaco, MDX, KaTeX
- **API**: Axios, Dify-client

### Development Tools
- TypeScript 4.9
- ESLint (Antfu config)
- Husky pre-commit hooks
- PostCSS/Tailwind processing

## Key Directories
```
app/
├─ api/              # Next.js API routes
│  ├─ chat-messages/ # Chat endpoints
│  └─ conversations/ # Conversation management
├─ components/       # React components
│  ├─ chat/          # Chat UI components
│  └─ workflow/      # Editor components
i18n/                # Localization configs
public/vs/           # Monaco editor assets
```

## Development Setup
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Important scripts:
npm run lint    # Run linter
npm run fix     # Auto-fix lint issues
npm run build   # Production build
```

## Architectural Notes
1. **Internationalization**:
   - Configured in `i18n/` directory
   - Server/client split localization
   - Supports 5 languages

2. **Styling**:
   - Tailwind CSS with custom utilities
   - SCSS modules for components
   - Responsive breakpoint hooks

3. **API Patterns**:
   - REST endpoints in `/app/api/*`
   - Dify-client integration for AI chat
   - File upload handling

4. **Editor Features**:
   - Monaco-based code editor
   - MDX content rendering
   - Math equation support via KaTeX
