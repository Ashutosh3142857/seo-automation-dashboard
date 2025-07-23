# SEO Automation Dashboard

A comprehensive SEO automation platform built with React, Node.js, and PostgreSQL. This full-stack application provides tools for SEO professionals to manage backlinks, track keyword rankings, perform technical audits, optimize content, and analyze competitors.

## Features

### 🔗 Backlink Management
- Automated backlink discovery and opportunity identification
- Backlink status tracking and management
- Domain authority analysis

### 🎯 Keyword & Rank Tracking
- Real-time keyword position monitoring
- Historical ranking data visualization
- Search volume and difficulty metrics

### 📊 Content Optimization
- AI-powered content analysis using OpenAI GPT-4
- SEO score calculation and recommendations
- Readability analysis and suggestions

### 🔍 Technical SEO Audit
- Automated website auditing using Puppeteer
- Page speed and mobile performance analysis
- Broken link detection and meta tag validation

### 🏢 Local SEO Tools
- Local business optimization tasks
- Location-based SEO recommendations

### 📱 Social Media SEO
- Social media post generation for SEO
- Platform-specific content optimization

### 🎨 Modern UI/UX
- Clean, professional dashboard interface
- Dark mode support
- Responsive design with Tailwind CSS
- Real-time updates and notifications

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for lightweight routing
- **TanStack Query** for server state management
- **Tailwind CSS** + **Shadcn/ui** for styling
- **Vite** for build tooling
- **Recharts** for data visualization

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** database (Neon serverless)
- **OpenAI API** integration for AI features
- **Puppeteer** for web scraping and auditing

### Development Tools
- **tsx** for TypeScript execution
- **ESBuild** for fast compilation
- **PostCSS** with Tailwind processing
- **Hot Module Replacement** for development

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/seo-automation-dashboard.git
   cd seo-automation-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with the following variables:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   OPENAI_API_KEY=your_openai_api_key
   NODE_ENV=development
   PORT=5000
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and API client
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express application
│   ├── services/         # Business logic services
│   ├── routes.ts         # API route definitions
│   └── db.ts            # Database connection
├── shared/               # Shared TypeScript types
└── dist/                # Production build output
```

## API Endpoints

### Dashboard
- `GET /api/dashboard/stats/:websiteId` - Get dashboard statistics

### Keywords
- `GET /api/keywords/:websiteId` - Get keywords for website
- `POST /api/keywords` - Add new keyword

### Backlinks
- `GET /api/backlinks/:websiteId` - Get backlinks
- `POST /api/backlinks/discover` - Discover backlink opportunities
- `PATCH /api/backlinks/:id/status` - Update backlink status

### Content Analysis
- `POST /api/content/analyze` - Analyze content for SEO
- `POST /api/content/generate` - Generate SEO-optimized content

### Technical Audit
- `POST /api/audit/:websiteId` - Perform technical audit
- `GET /api/audit/:websiteId/latest` - Get latest audit results

## Configuration

### Database Schema
The application uses Drizzle ORM with a comprehensive schema including:
- Users and websites
- Keywords with position tracking
- Backlinks with status management
- Content analysis results
- Technical audit data

### AI Integration
- OpenAI GPT-4 for content generation and analysis
- Automated SEO recommendations
- Content optimization suggestions

### Web Scraping
- Puppeteer for technical audits
- Automated competitor analysis
- Page performance monitoring

## Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Ensure all required environment variables are set:
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `NODE_ENV=production`
- `PORT` - Server port (default: 5000)

### Replit Deployment
This application is optimized for Replit deployment with:
- Automatic dependency management
- Environment variable configuration
- PostgreSQL database integration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern web technologies for optimal performance
- Uses OpenAI for intelligent content analysis
- Designed for SEO professionals and agencies
- Optimized for both individual users and team collaboration

---

**Note:** This application requires valid API keys for OpenAI integration and a PostgreSQL database for full functionality. See the installation guide for setup instructions.