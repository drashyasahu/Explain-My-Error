# ⚡ ExplainMyError

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3+-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-Llama_3-000000?style=for-the-badge&logo=ollama&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<p align="center">
  <strong>Universal Local-AI Debugging Assistant & Code Intelligence Engine</strong>
</p>

<p align="center">
  ExplainMyError analyzes stack traces, compiler errors, runtime exceptions, SQL crashes, and messy logs across <b>any programming language</b>, detects root causes, ranks verified fixes with confidence metrics, and provides side-by-side interactive code diffs — running 100% privately via local Ollama LLMs.
</p>

</div>

---

## 🌟 Key Features

- 🧠 **100% Local & Private AI**: Powered by Spring AI & Ollama (Llama 3). Your proprietary source code and error logs never leave your machine.
- 🌐 **Polyglot & Framework Agnostic**: Seamlessly diagnoses errors from Java (Spring, Maven, Gradle), Python (FastAPI, Django), JavaScript/TypeScript (React, Next.js, Node), Go, Rust, C/C++, C#, SQL, Bash, and more.
- 🎯 **Pinpoint Root Cause Analysis**: Identifies *What Happened*, *Why It Happened*, affected source files, and line numbers with confidence scoring.
- 🔄 **Side-by-Side Diff Viewer**: Inspect exact "Before vs. After" code changes with syntax highlighting and 1-click copy.
- ✅ **Actionable Checklist**: Interactive, step-by-step resolution tasks to guide junior & senior developers through complex fixes.
- 💬 **Contextual Follow-up Chat**: Ask questions directly about the diagnosis (*"How do I write a unit test to prevent this?"* or *"Could this happen under high concurrency?"*).
- 🔁 **Multi-Turn Debug Sessions**: When fixing one error triggers another, maintain session history across consecutive debugging steps.
- 🔍 **Specialized Engineering Modes**:
  - **Error Diagnosis**: Full compiler, stack trace, and runtime troubleshooting.
  - **Code Explainer**: Plain English architectural breakdowns for complex algorithms, regex, and legacy code.
  - **Code Review & Security Audit**: Scans for SQL injections, XSS vulnerabilities, memory leaks, and performance antipatterns.
- 📊 **Telemetry & Analytics Dashboard**: Built-in visual metrics tracking error frequency, severity levels, and technology distribution.
- 🔐 **JWT Authentication & Rate Limiting**: Secure user profiles, guest mode capability, and configurable daily rate limits.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (Client)                    │
│      React 18 + Vite + TypeScript + Tailwind CSS       │
│               Monaco Editor + Recharts                 │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST (JWT)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Backend (Server)                     │
│               Java 21 + Spring Boot 3.3                │
│    Spring Security (JWT) + Bucket4j + Flyway Migrations│
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       JPA / JDBC SQL                    │ Spring AI
                ▼                        ▼
┌────────────────────────┐      ┌────────────────────────┐
│   PostgreSQL Database  │      │  Ollama Local LLM API  │
│  (Users, Analyses,     │      │   (Llama 3 / Mistral)  │
│   Sessions, History)   │      │   http://localhost:11434│
└────────────────────────┘      └────────────────────────┘
```

---

## 📋 Prerequisites

Before running the application locally, ensure you have installed:

| Tool | Version | Purpose |
|---|---|---|
| **Java JDK** | 21 or higher | Backend execution |
| **Node.js** | 18.x or 20+ (with npm) | Frontend build & dev server |
| **PostgreSQL** | 14+ | Relational persistence |
| **Ollama** | Latest | Local AI inference |

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/explain-my-error.git
cd explain-my-error
```

### 2. Setup Ollama (Local AI)
Ensure Ollama is running and download the Llama 3 model:
```bash
# Pull and start Llama 3
ollama run llama3:latest
```
> Ollama will be available at `http://localhost:11434`.

### 3. Setup PostgreSQL Database
Create a database for the application:
```sql
CREATE DATABASE explainmyerror;
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env` (or configure your shell variables):
```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux / macOS
cp .env.example .env
```
Default configuration values:
```properties
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3:latest
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/explainmyerror
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_minimum_256_bits_length_here_abc123
SERVER_PORT=8080
```

---

### 5. Start Backend Server
Navigate to the `backend/` directory:

```bash
cd backend

# On Windows:
mvn spring-boot:run
# or using Maven wrapper:
mvnw.cmd spring-boot:run

# On Linux / macOS:
./mvnw spring-boot:run
```
> The Spring Boot backend starts at: **http://localhost:8080**  
> Database tables are automatically provisioned using Flyway migrations.

---

### 6. Start Frontend Application
In a separate terminal, navigate to the `frontend/` directory:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
> The frontend client will be accessible at: **http://localhost:5173**

---

## 📁 Project Structure

```text
EXPLAIN MY ERROR/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/explainmyerror/
│   │   │   │   ├── config/          # Security, JWT, CORS, Rate Limiting configs
│   │   │   │   ├── controller/      # REST Endpoints (Analysis, Auth, Code, Debug, Stats)
│   │   │   │   ├── dto/             # Request & Response Data Transfer Objects
│   │   │   │   ├── entity/          # JPA Entities (User, Analysis, DebugSession, etc.)
│   │   │   │   ├── repository/      # Spring Data JPA Repositories
│   │   │   │   ├── security/        # JWT filter, UserDetailsService, Auth tokens
│   │   │   │   └── service/         # Business logic & Spring AI Ollama client
│   │   │   └── resources/
│   │   │       ├── application.yml  # Application properties & AI model bindings
│   │   │       └── db/migration/    # Flyway SQL schema migration scripts
│   │   └── test/                    # Backend unit & integration test suites
│   ├── pom.xml                      # Maven dependencies & build setup
│   └── mvnw.cmd                     # Windows Maven wrapper
│
├── frontend/
│   ├── src/
│   │   ├── components/              # UI components (DiffViewer, Navbar, Checklists, Badges)
│   │   ├── context/                 # React Context (Auth, Theme, Analysis state)
│   │   ├── pages/                   # Landing, Dashboard, History, DebugSession, CodeReview
│   │   ├── services/                # Axios API clients & interceptors
│   │   ├── types/                   # TypeScript interfaces & domain types
│   │   ├── App.tsx                  # Main router & page routes
│   │   └── main.tsx                 # Application entry point
│   ├── index.html                   # HTML template
│   ├── package.json                 # Node dependencies & build scripts
│   ├── tailwind.config.js           # Custom dark mode styling & theme colors
│   └── vite.config.ts               # Vite bundler configuration
│
├── .env.example                     # Environment template for quick setup
├── .gitignore                       # Clean Git ignore rules (node_modules, target, etc.)
└── README.md                        # Documentation & quick start guide
```

---

## 🔌 REST API Reference

### 🔍 Error Diagnosis & Analysis
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/analyses` | Submit error message, stack trace, or code snippet | Optional (Guest supported) |
| `GET` | `/api/analyses` | Get user's diagnostic analysis history | **Yes** |
| `GET` | `/api/analyses/{id}` | Get full diagnostic details & diff for an analysis | **Yes** |
| `DELETE` | `/api/analyses/{id}` | Remove an analysis from history | **Yes** |
| `POST` | `/api/analyses/{id}/follow-up` | Send contextual follow-up query on an analysis | Optional |

### 🧠 Code Intelligence
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/code/explain` | Explain complex logic, algorithms, regex, or code | Optional |
| `POST` | `/api/code/review` | Run security audit, bug detection, & code review | Optional |

### 🔁 Multi-Turn Debug Sessions
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/debug-sessions` | List active & past multi-turn debug sessions | **Yes** |
| `POST` | `/api/debug-sessions` | Initialize a new multi-turn debug session | **Yes** |
| `GET` | `/api/debug-sessions/{id}` | Retrieve session details with all diagnostic steps | **Yes** |
| `POST` | `/api/debug-sessions/{id}/steps` | Append a follow-on error to the ongoing session | **Yes** |

### 📊 Telemetry & Analytics
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/statistics` | Retrieve error distribution, language, & severity data | Optional |

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | **Yes** |

---

## ⚙️ Configuration Reference

| Variable | Default Value | Description |
|---|---|---|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama service endpoint URL |
| `OLLAMA_MODEL` | `llama3:latest` | Local LLM model identifier |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/explainmyerror` | PostgreSQL JDBC connection URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `postgres` | Database password |
| `SERVER_PORT` | `8080` | Spring Boot HTTP port |
| `JWT_SECRET` | `(pre-configured 256-bit string)` | HMAC secret key used for signing JWTs |
| `JWT_EXPIRATION_MS` | `86400000` (24 Hours) | JWT expiration time in milliseconds |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Allowed client origins for CORS |
| `RATE_LIMIT_ANALYSES_PER_DAY`| `10` | Daily analysis cap for non-admin accounts |

---

## 🧪 Testing

To run backend tests:
```bash
cd backend
mvn test
```

To run frontend TypeScript validation & build:
```bash
cd frontend
npm run build
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
