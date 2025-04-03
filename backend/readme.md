# Savannah Intelligence MVP - Product Requirements Document (PRD)
**Version:** 2.2  
**Target Launch:** 6 Months  
**Primary Market:** Ghana (Pilot), scalable across Africa

---

## 1. Vision & Core Value Proposition

**Vision:**  
Build Africa’s first entity-centric intelligence platform that unifies fragmented public and OSINT data into a dynamic, interlinked knowledge graph. Savannah Intelligence empowers decision-makers to explore any entity—whether a person, organization, place, event, or country—with a complete 360° view of its attributes, relationships, and real-time news intelligence.

**Core Value Proposition:**  
- **Holistic Intelligence:** Provide comprehensive profiles for every entity, incorporating demographic, social, economic, political, and governance attributes.
- **360° Context:** Uncover hidden networks and relationships to answer critical questions:
  - *Who is this person?* (e.g., affiliations, net worth, education, family, key events)
  - *What stakeholders are connected to a given organization?*
  - *What events or risks are tied to a particular place or country?*
- **Dynamic News Intelligence:** Automatically curate and summarize news articles using AI, categorizing insights by location, data category, or related entity.
- **Low-Cost & Scalable:** Leverage open-source tools and cost-efficient, serverless cloud infrastructure for rapid deployment and pan-African scalability.

---

## 2. MVP Feature Prioritization

### Core MVP (Launch in 6 Months)
- **Entity Graph Explorer:**  
  - **Functionality:** Search and visualize any entity (person, organization, place, event, or country) and its interconnected network.
  - **Example:** A query for “Akufo-Addo” returns his full profile—political affiliations, net worth, education, marital status, properties, and related events—with links to associated organizations, places, and news.

- **Automated Intelligence Digest:**  
  - **Functionality:** Daily automated reports (via email/SMS) highlighting emerging risks, trends, and anomalies connected to key entities.

- **News Summaries & Curation:**  
  - **Functionality:**  
    - Use AI to summarize news articles and extract key insights and entities from the content.
    - Present curated news articles organized by location, data category, or related entity.
    - Allow users to quickly scan headlines, summaries, and sentiment trends.
  - **Example:** A user can view a dashboard that shows summarized news for Accra, along with entity tags (e.g., political figures, organizations) and sentiment scores, helping them identify key developments at a glance.

- **Scenario Engine:**  
  - **Functionality:** Basic simulation tools to assess the impact of hypothetical scenarios (e.g., “What if a high-profile politician endorses a controversial policy?”).

### Post-Launch Enhancements
- **Real-Time Media Monitoring:**  
  - Live integration of TV/radio transcription and social media sentiment analysis.
- **Multilingual LLM Capabilities:**  
  - Fine-tune models to handle Ghanaian Pidgin, Twi, and other local dialects.
- **Crowdsourced Validation:**  
  - Integrate partnerships with local academic and research institutions for real-time data validation.

---

## 3. Data Model & Schema

### 3.1 Entity-Centric Graph Schema (Neo4j)

#### **Core Entities & Attributes**

1. **Person**
   - **Identifiers:**  
     - `id` (UUID)
   - **Primary Attributes:**  
     - `name` (String), `aliases` (Array)
   - **Demographics:**  
     - `date_of_birth` (ISO 8601), `age` (Integer, derived), `gender` (Enum), `nationality` (ISO 3166)
   - **Biographical:**  
     - `education` (Array of `{institution, degree, years}`),  
     - `employment` (Array of `{organization, role, start_date, end_date}`),  
     - `net_worth` (Float with source and timestamp),  
     - `properties` (Array of `{location, type, value}`)
   - **Social/Political:**  
     - `political_affiliation` (Array of `{party, role, years}`),  
     - `religious_views` (String),  
     - `marital_status` (Enum),  
     - `spouse` (UUID),  
     - `children` (Array of UUIDs)
   - **Digital Footprint & Analytics:**  
     - `social_media` (Object mapping `{platform: handle}`),  
     - `news_mentions` (Array of Event IDs),  
     - `influence_score` (Float 0–100),  
     - `risk_flags` (Array e.g., "Sanctions", "Corruption Allegations")

2. **Organization**
   - **Identifiers:**  
     - `id` (UUID)
   - **Primary Attributes:**  
     - `name` (String), `type` (Enum: Govt/NGO/Corporate/Media)
   - **Business & Governance:**  
     - `sectors` (Array),  
     - `leadership` (Array of Person UUIDs),  
     - `financials`:  
       - `revenue` (Float),  
       - `funding_sources` (Array of Org/Person UUIDs)
   - **Location & Regulatory:**  
     - `locations` (Array of Place UUIDs),  
     - `regulatory_status` (e.g., "Licensed", "Under Investigation")

3. **Place**
   - **Identifiers:**  
     - `id` (UUID)
   - **Primary Attributes:**  
     - `name` (String), `type` (Enum: City/Region/Village/Landmark)
   - **Geolocation & Admin:**  
     - `geolocation` (GeoJSON),  
     - `admin_level` (String, e.g., "National Capital", "District")
   - **Infrastructure & Risk:**  
     - `economic_indicators` (e.g., GDP, unemployment rate),  
     - `key_facilities` (Array),  
     - `security_score` (Float 0–100),  
     - `recent_events` (Array of Event IDs)

4. **Event**
   - **Identifiers:**  
     - `id` (UUID)
   - **Primary Attributes:**  
     - `type` (Enum: Protest, Election, Disaster, BusinessDeal),  
     - `date` (ISO 8601 with start/end),  
     - `location` (Place UUID)
   - **Participants & Impact:**  
     - `participants` (Array of Person/Org UUIDs),  
     - `severity_score` (Float 0–100),  
     - `media_coverage` (Array of News Source IDs),  
     - `sentiment` (Float from –1 to 1)

5. **Country**
   - **Identifiers:**  
     - `id` (ISO 3166 code, e.g., "GH")
   - **Demographics & Social:**  
     - `population` (Integer),  
     - `ethnic_groups` (Array of `{group, percentage}`),  
     - `literacy_rate` (Float)
   - **Governance & Economic:**  
     - `ruling_party` (Organization UUID),  
     - `corruption_index` (Float 0–100),  
     - `gdp` (Float),  
     - `key_industries` (Array)
   - **Cultural:**  
     - `religious_breakdown` (Array of `{religion, percentage}`),  
     - `education_index` (Float)

#### **360° Relationships**

| **From**      | **To**         | **Relationship Type**      | **Properties**                                    |
|---------------|----------------|----------------------------|---------------------------------------------------|
| Person        | Organization   | `AFFILIATED_WITH`          | `role`, `start_date`, `end_date`, `confidence`      |
| Person        | Person         | `FAMILY_TIE`               | `type` (e.g., Spouse, Sibling, Parent)             |
| Person        | Event          | `ATTENDED` or `ORGANIZED`  | `role` (e.g., Speaker, Leader)                     |
| Person        | Place          | `OWNS_PROPERTY`            | `type` (Land/Building), `value`                    |
| Organization  | Place          | `HEADQUARTERED_IN`         | `since`, `branch_type`                             |
| Event         | Place          | `OCCURRED_AT`              | `radius_km`, `severity`                            |
| Country       | Organization   | `REGULATES`                | `policy`, `compliance_status`                      |
| Event         | Country        | `IMPACTS`                  | `economic_impact`, `duration_months`               |

*Example Graph Walk:*  
- **Person** → `AFFILIATED_WITH` → **Organization** (role: CEO)  
- **Organization** → `HEADQUARTERED_IN` → **Place** (Accra)  
- **Place** → Part of → **Country** (Ghana)  
- **Country** → `HOSTS` → **Event** (e.g., 2024 Election)

#### **Data Provenance & Metadata**
- Each attribute is annotated with:
  - `source` (e.g., "Ghana Registrar General", "Twitter API")
  - `confidence_score` (0–1, based on source reliability)
  - `last_updated` (ISO 8601)
- Versioning for entity histories ensures auditability.

---

## 4. Technical Architecture & Implementation

### Data Ingestion & Processing
- **Scraping/Crawling:**  
  - Use Scrapy, Playwright, and ScrapegraphAI to ingest data from government portals, media sites, and social media.
  - Schedule batch jobs (e.g., nightly) to optimize costs and reduce bandwidth load.
  
- **Data Cleaning & Enrichment:**  
  - Deduplicate and normalize entity data using rule-based and ML-based matching.
  - Integrate Deepseek-Lite and multilingual NLP models for localized enrichment and news article summarization.
  
- **News Summarization & Curation:**  
  - Use AI to process incoming news articles.
  - Generate summaries and extract key entities, sentiment, and insights.
  - Categorize news by location, data category, and related entities, making the curated content accessible via the dashboard.

### Databases & Storage
- **Graph Database:**  
  - Neo4j (Neo4j Aura Free Tier for MVP) stores the entity-centric knowledge graph.
- **Relational Database:**  
  - Supabase (PostgreSQL) handles structured data, user authentication, and metadata.
- **Search & Analytics:**  
  - Elasticsearch for text-based and geospatial queries.

### AI/ML & Analytics
- **LLM Integration:**  
  - Use Deepseek-Lite (self-hosted) and spaCy for natural language processing, news summarization, and contextual entity enrichment.
- **Analytics Pipeline:**  
  - Combine rule-based trend detection with ARIMA models and LLM inference for forecasting and risk scoring.
  
### Frontend & API
- **User Interface:**  
  - React.js with lightweight visualization libraries (e.g., Tremor, D3.js, Mapbox) to render dynamic graphs, dashboards, and curated news feeds.
- **API Services:**  
  - FastAPI (with OAuth2) exposes secure endpoints for queries, news retrieval, and data access.

### Cloud & Deployment
- **Infrastructure:**  
  - Deploy on cost-effective cloud platforms (e.g., AWS Lightsail, DigitalOcean) using containerization (Docker) and orchestration (Kubernetes).
- **CI/CD:**  
  - Automated testing and continuous deployment pipelines to iterate rapidly.

---

## 5. MVP Roadmap

### Months 1–2: Data Foundation
- **Infrastructure & Ingestion:**  
  - Set up cloud infrastructure and deploy scrapers for 10+ Ghanaian government and media sources.
- **Initial Graph Construction:**  
  - Build the initial entity graph with 1,000+ records from public datasets.
- **Prototype Dashboard:**  
  - Launch a basic React dashboard showcasing network graphs (e.g., Ghanaian MPs and their affiliations) and a news summary module.

### Months 3–4: Analytics & News Engine
- **LLM Integration & Enrichment:**  
  - Integrate Deepseek-Lite for entity resolution, enrichment, and summarization.
- **News Summarization:**  
  - Develop and integrate the AI engine for summarizing news articles and extracting insights.
- **Pilot Intelligence Digest:**  
  - Roll out daily automated reports and curated news feeds to select local partners (NGOs, academic institutions).

### Months 5–6: User Testing & Launch
- **Beta Testing & Feedback:**  
  - Onboard beta users (security agencies, journalists, government bodies) to refine UI/UX and analytics.
- **Performance Optimization:**  
  - Optimize data storage and LLM usage to ensure low response times (< 5 seconds for graph queries).
- **Official MVP Launch:**  
  - Release the full stakeholder analysis tool, including curated news intelligence, in partnership with key government agencies.

---

## 6. Success Metrics & Next Steps

### Success Metrics
- **Cost Efficiency:**  
  - Infra spend maintained at < $500/month.
- **Accuracy:**  
  - >80% entity recognition accuracy in pilot tests.
- **Performance:**  
  - Graph query and news retrieval response times < 5 seconds.
- **Adoption:**  
  - 10+ paid pilots and positive stakeholder feedback in Ghana.
- **Data Volume & Coverage:**  
  - Ingest data from 10+ diverse sources with high provenance confidence and robust news coverage.

### Immediate Next Steps
1. **Team Formation:**  
   - Hire a data engineer (for scraping and pipelines) and a full-stack developer (for Supabase/React integration).
2. **Local Partnerships:**  
   - Establish collaborations with Ghanaian media outlets, NGOs, and academic institutions for data validation.
3. **Data Acquisition:**  
   - Initiate scraping of key sources (GhanaWeb, MyJoyOnline, Parliament PDFs) and begin data normalization.
4. **LLM Training:**  
   - Fine-tune Deepseek-Lite on localized Ghanaian data, leveraging Wikidata for reference.
5. **Prototype Development:**  
   - Develop an initial prototype focusing on mapping key political figures and showcasing curated news summaries.

---

## 7. Conclusion

Savannah Intelligence MVP is a next-generation, entity-centric intelligence platform designed to deliver a full 360° view of people, organizations, places, events, and countries. With robust data ingestion pipelines, advanced NLP/LLM analytics for news summarization, and a dynamic knowledge graph, our solution empowers decision-makers in Ghana—and ultimately across Africa—to transform fragmented data into actionable insights. By leveraging open-source technologies and cost-effective cloud infrastructure, we are poised to revolutionize intelligence gathering and situational awareness in a pan-African context.

*This document serves as the blueprint for developing and launching Savannah Intelligence MVP v2.2—focused, robust, and scalable for pan-African impact.*

