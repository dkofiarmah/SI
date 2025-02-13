# Component Breakdown

## 1. Data Ingestion Layer
### Tools
- Scrapy
- Playwright 
- ScrapegraphAI

### Responsibilities
- Batch and edge scraping of government websites, media outlets, social media
- Schedule jobs using Apache Airflow (or cron-based scheduling for MVP)

## 2. Data Cleaning & Enrichment
### Process
- Deduplication, normalization (using Pandas/Python)
- Entity resolution via rule-based + ML-based matching
- News summarization and entity extraction using Deepseek-Lite, spaCy, and LangChain

### Output
Cleaned and enriched data ready for storage and graph mapping

## 3. Storage & Database Layer
### Graph Database
**Neo4j:** Stores entity-centric knowledge graph (relationships between Person, Organization, Place, Event, Country)

### Relational Database
**Supabase (PostgreSQL):** Stores raw data, metadata, and user authentication details

### Search Engine
**Elasticsearch:** Provides full-text search, geospatial queries, and fast retrieval of news articles and entity records

## 4. AI/LLM & Analytics Services
### Components
- **LLM/NLP:** Deepseek-Lite (self-hosted), spaCy for NLP tasks
- **Analytics Pipeline:** Combines rule-based trend detection, ARIMA models, and LLM inference for forecasting
- **News Summarization:** Automated pipeline to process, summarize, and categorize news articles by location, category, and related entities

## 5. API Layer
### Framework
FastAPI (Python)

### Responsibilities
- Expose RESTful/GraphQL endpoints for frontend access
- Secure endpoints with OAuth2
- Aggregate data from Neo4j, Supabase, and Elasticsearch
- Serve real-time news summaries and entity queries

## 6. Frontend
### Framework
React.js

### Visualization
- **Graph Visualization:** D3.js and/or Tremor for dynamic network graphs
- **Geospatial Maps:** Mapbox integration
- **Dashboard Components:** Curated news feeds, trend charts, and entity detail panels
- **User Interaction:** Search, drill-down on entities, and view curated intelligence digests

## 7. Deployment & Infrastructure

### Containerization & Orchestration
- Not required for MVP
- Use lightweight deployment methods without Docker or Kubernetes

### Cloud Platform & Hosting

#### Frontend
- Host the React.js application on Vercel or Netlify for fast, cost-effective static site hosting with built-in CDN and auto-deployment from GitHub

#### Backend & API
- Deploy the FastAPI endpoints as serverless functions using Vercel or Netlify Functions (or use a minimal VM instance on a low-cost provider if needed)
- Alternatively, use GitHub Pages in conjunction with serverless backends (e.g., AWS Lambda via a lightweight framework) for MVP-level requirements

### CI/CD
- Use GitHub Actions (or GitLab CI) to automate testing and deployment
- Configure the CI/CD pipelines to automatically deploy frontend updates to Vercel/Netlify and backend/serverless function updates as needed

### Monitoring & Logging
- Leverage built-in monitoring and logging provided by Vercel/Netlify for frontend deployments
- For backend functions, use lightweight logging services (e.g., Loggly, Papertrail, or cloud provider logging) to capture errors and performance metrics
- For application performance monitoring, consider integrating a lightweight service like Sentry for error tracking and performance insights

# Implementation Roadmap

## Phase 1 (Months 1-2): Data Foundation & Prototyping
- Set up cloud infrastructure, deploy Docker containers
- Build and deploy scrapers for 10+ Ghanaian sources
- Develop initial data cleaning and enrichment pipeline
- Construct a basic Neo4j graph and Supabase database
- Build a prototype React dashboard showcasing a network graph (e.g., Ghanaian MPs and affiliations)

## Phase 2 (Months 3-4): Analytics & News Engine
- Integrate LLM services (Deepseek-Lite) for entity enrichment and news summarization
- Develop AI pipelines for generating curated news summaries and extracting key insights
- Enhance the API layer with endpoints for entity search and news feeds
- Pilot daily intelligence digests with early partners

## Phase 3 (Months 5-6): Beta Testing & MVP Launch
- Onboard beta users (security agencies, journalists, government bodies) for UI/UX feedback
- Optimize performance (ensure < 5s query responses)
- Fine-tune LLM and analytics pipelines based on real-world data
- Officially launch the MVP with full stakeholder analysis and news intelligence features