# 🚀 Automotive PIM + DAM System

Hochmodernes Product Information Management (PIM) und Digital Asset Management (DAM) System speziell für die Automotive-Industrie mit KI-Integration.

## ✨ Core Features

### 🔌 Offene REST API
- **OAS 3.0** mit Swagger-UI Dokumentation
- **Webhooks** für Echtzeit-Ereignisse
- **OAuth2/JWT** Authentifizierung
- **GraphQL** Support für flexible Queries

### 🌍 Multi-Language Support (DE/EN)
- UI-Texte in beiden Sprachen
- Produktdaten mehrsprachig
- Automatische Übersetzung via KI

### 🤖 KI-Features

#### 🎨 Bild- & Layout-Generierung
- **Brand Board Upload** (Logos, Farben, Fonts)
- **Generative Engine** für Datenblätter, Flyer, Broschüren
- **Export**: PDF, InDesign, HTML5
- **Prompt-Steuerung**: "Erstelle 2-seitigen Flyer DE+EN"

#### 📊 KI-Datenimport & Bereinigung
- **Smart Import** aus Excel/CSV
- **Fehlererkennung** (Maßeinheiten, Tippfehler, IDs)
- **Auto-Bereinigung** mit Vorschlägen
- **Validierung** mit manueller Freigabe

#### 📤 KI-Export Engine
- **Prompt-basiert**: "Exportiere TecDoc XML für DACH"
- **Zielsysteme**: Magento, Shopify, SAP, TecDoc, ACES/PIES
- **Automatisierung**: Zeitgesteuerte Exports

### 🔄 Workflows & Tasks
- **Import-Workflows** mit KI-Bereinigung
- **Publishing-Workflows** mit Freigabeprozess
- **Kanban-Board** für Aufgabenmanagement
- **Notifications**: E-Mail, MS Teams, Slack

### 🔐 Security & Permissions
- **RBAC**: Admin, Data Steward, Marketing, Viewer
- **Object-Level Permissions** nach Kategorien/Märkten
- **Audit-Trail** für alle Änderungen
- **API-Security**: OAuth2, JWT, IP-Whitelisting

## 🏗️ Technologie-Stack

### Backend
- **Node.js** mit NestJS Framework
- **PostgreSQL** Datenbank
- **ElasticSearch** für intelligente Suche
- **MinIO** (S3-kompatibel) für Assets
- **Redis** für Caching

### Frontend
- **React 18** mit TypeScript
- **Tailwind CSS** + **shadcn/ui**
- **i18next** für Internationalisierung
- **React Query** für State Management
- **Zustand** für lokalen State

### KI-Services
- **Python FastAPI** Microservices
- **LLM-Integration** (OpenAI, Claude, Local Models)
- **Stable Diffusion** für Bildgeneration
- **pandas/numpy** für Datenverarbeitung

### Infrastructure
- **Docker** + **Kubernetes**
- **GitHub Actions** CI/CD
- **Nginx** Reverse Proxy
- **Prometheus** + **Grafana** Monitoring

## 📁 Projekt-Struktur

```
automotive-pim-dam/
├── backend/                    # NestJS REST API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── products/      # Produktmanagement
│   │   │   ├── assets/        # Asset Management
│   │   │   ├── workflows/     # Workflow Engine
│   │   │   ├── auth/          # Authentifizierung
│   │   │   ├── users/         # Benutzerverwaltung
│   │   │   └── exports/       # Export Engine
│   │   ├── common/            # Shared Services
│   │   └── config/            # Konfiguration
│   ├── prisma/                # Database Schema
│   └── docs/                  # OpenAPI Specs
├── frontend/                   # React Dashboard
│   ├── src/
│   │   ├── components/        # UI Komponenten
│   │   ├── pages/            # Seiten
│   │   ├── hooks/            # Custom Hooks
│   │   ├── services/         # API Services
│   │   └── utils/            # Utilities
│   └── public/               # Static Assets
├── ai-services/               # Python KI-Services
│   ├── data-cleaner/         # Datenbereinigung
│   ├── layout-generator/     # Layout-Generierung
│   ├── export-engine/        # KI-Export
│   └── common/               # Shared Libraries
├── docs/                      # Dokumentation
│   ├── api/                  # API Dokumentation
│   ├── architecture/         # System-Architektur
│   └── deployment/           # Deployment Guides
├── configs/                   # Konfigurationsdateien
│   ├── roles/                # RBAC Definitionen
│   ├── workflows/            # Workflow Templates
│   └── views/                # Default Views
└── docker/                    # Docker Compose & K8s
    ├── docker-compose.yml
    ├── kubernetes/
    └── nginx/
```

## 🚀 Quick Start

### 1. Repository Setup
```bash
git clone https://github.com/yourusername/automotive-pim-dam
cd automotive-pim-dam
```

### 2. Backend starten
```bash
cd backend
npm install
npm run start:dev
```

### 3. Frontend starten
```bash
cd frontend
npm install
npm run dev
```

### 4. KI-Services starten
```bash
cd ai-services
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### 5. Docker Compose (All-in-One)
```bash
docker-compose up -d
```

## 🌐 API Endpoints

### Products
```http
GET    /api/v1/products              # Liste aller Produkte
POST   /api/v1/products              # Neues Produkt erstellen
PUT    /api/v1/products/{id}         # Produkt aktualisieren
DELETE /api/v1/products/{id}         # Produkt löschen
POST   /api/v1/products/import       # CSV/Excel Import
POST   /api/v1/products/{id}/export  # KI-gesteuerter Export
```

### Assets
```http
GET    /api/v1/assets                # Asset-Liste
POST   /api/v1/assets/upload         # Asset hochladen
POST   /api/v1/assets/generate       # KI-Generierung (Flyer/Broschüre)
GET    /api/v1/assets/{id}/download  # Asset herunterladen
```

### Workflows
```http
GET    /api/v1/workflows             # Workflow-Liste
POST   /api/v1/workflows             # Workflow erstellen
GET    /api/v1/workflows/{id}        # Workflow-Status
POST   /api/v1/workflows/{id}/approve # Workflow freigeben
```

### KI-Services
```http
POST   /ai/v1/data/clean            # Datenbereinigung
POST   /ai/v1/layout/generate       # Layout-Generierung
POST   /ai/v1/export/prompt         # Prompt-basierter Export
GET    /ai/v1/models/status         # KI-Model Status
```

## 🔧 Konfiguration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/pim_dam
REDIS_URL=redis://localhost:6379

# Storage
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# KI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Auth
JWT_SECRET=your-secret-key
OAUTH2_CLIENT_ID=your-client-id
```

## 📊 Dashboard Features

### 🎛️ Admin Dashboard
- System Health Monitoring
- User Management
- API Analytics
- Workflow Statistics

### 📈 Data Steward Dashboard
- Import Queue Management
- Data Quality Metrics
- Validation Tasks
- Error Reports

### 🎨 Marketing Dashboard
- Asset Library
- Brand Compliance
- Campaign Materials
- Export Tracking

### 📋 Management Dashboard
- KPI Overview
- ROI Analytics
- Process Efficiency
- Resource Utilization

## 🔄 Beispiel-Workflows

### 1. Datenimport-Workflow
```
1. CSV Upload → /products/import
2. KI-Validierung & Bereinigung
3. Task an Data Steward
4. Manuelle Prüfung & Freigabe
5. Integration in Produktkatalog
6. Notification an Team
```

### 2. Asset-Publishing-Workflow
```
1. Asset Upload → /assets/upload
2. Automatische Metadaten-Extraktion
3. Brand Compliance Check
4. Marketing Review Task
5. Freigabe & Tagging
6. Export an Zielsysteme
```

### 3. KI-Layout-Generierung
```
1. Brand Board Setup
2. Produktdaten auswählen
3. Layout-Prompt definieren
4. KI-Generierung starten
5. Preview & Anpassungen
6. Export (PDF/InDesign/HTML)
```

## 🛡️ Security Features

- **End-to-End Encryption** für sensitive Daten
- **API Rate Limiting** gegen Missbrauch
- **Input Validation** & Sanitization
- **SQL Injection** Schutz via ORM
- **XSS Protection** im Frontend
- **CSRF Tokens** für Forms
- **Audit Logging** aller Aktionen

## 📈 Performance Features

- **Database Indexing** für schnelle Queries
- **Redis Caching** für häufige Anfragen
- **CDN Integration** für Assets
- **Lazy Loading** im Frontend
- **Background Jobs** für KI-Processing
- **Connection Pooling** für Database
- **Horizontal Scaling** via Kubernetes

## 🚀 Deployment

### Production Setup
```bash
# Build alle Services
docker-compose -f docker-compose.prod.yml build

# Deploy auf Kubernetes
kubectl apply -f docker/kubernetes/

# SSL Zertifikate
kubectl apply -f docker/kubernetes/ssl/
```

### Monitoring
- **Prometheus** Metriken
- **Grafana** Dashboards
- **ELK Stack** für Logs
- **Uptime Monitoring**
- **Performance Tracking**

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/neue-funktion`)
3. Änderungen committen (`git commit -am 'Add neue Funktion'`)
4. Branch pushen (`git push origin feature/neue-funktion`)
5. Pull Request erstellen

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🆘 Support

- **Dokumentation**: [docs/](docs/)
- **API Referenz**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/automotive-pim-dam/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/automotive-pim-dam/discussions)

---

**Version**: 1.0.0  
**Status**: In Development  
**Last Updated**: September 2025