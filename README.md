# AI-Powered Multimodal Construction Intelligence Platform

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://construction-intelligence-ai.streamlit.app)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg)](https://react.dev/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-Free_Tier_(Flash_Lite)-4285F4.svg)](https://deepmind.google/technologies/gemini/)
[![Standards](https://img.shields.io/badge/Compliance-OSHA_1926_|_ACI_318-orange.svg)](https://www.osha.gov/laws-regs/regulations/standardnumber/1926)
[![Tests](https://img.shields.io/badge/Tests-9_Passed_100%25-brightgreen.svg)]()

> A full-stack, enterprise-grade decision-support system designed to assist construction professionals across planning, execution, and monitoring. Fusing multimodal Artificial Intelligence (Google Gemini Free Tier) with deterministic civil engineering heuristics, the platform analyzes site photos, structural imagery, and project parameters to deliver actionable, code-grounded insights.

---

## 📑 Table of Contents
1. [Project Overview & Core Features](#-project-overview--core-features)
2. [Technical Architecture](#-technical-architecture)
3. [Curriculum & Epics Traceability Matrix](#-curriculum--epics-traceability-matrix)
4. [Prerequisites & System Requirements](#-prerequisites--system-requirements)
5. [Quick Start Guide (Local Setup)](#-quick-start-guide-local-setup)
6. [Containerized Deployment (Docker Compose)](#-containerized-deployment-docker-compose)
7. [API Documentation & Data Contracts](#-api-documentation--data-contracts)
8. [Mentor & Evaluator Demo Walkthrough](#-mentor--evaluator-demo-walkthrough)
9. [Automated Verification & Test Suite](#-automated-verification--test-suite)
10. [Civil Engineering & Safety Standards Grounding](#-civil-engineering--safety-standards-grounding)

---

## 🏗️ Project Overview & Core Features

Traditional construction management relies heavily on manual supervision, static paper documentation, and experience-based judgments. These methods frequently cause costly rework, undetected safety infractions, and scheduling delays.

The **Multimodal Construction Intelligence Platform** solves these bottlenecks through seven integrated intelligence modules:

1. **Site Safety Inspector (OSHA 1926)**:
   - Multimodal vision analysis auditing worker Personal Protective Equipment (Hardhats, High-Vis Vests, Fall Arrest Harnesses, Steel-toe Boots, Eye Protection).
   - Automated detection of open floor edges, scaffolding deficiencies, tripping debris, and excavation hazards.
   - Computes a 0–100 Safety Compliance Score and generates prioritized immediate corrective actions.
2. **Structural Crack & Forensic Analyzer (ACI 318)**:
   - Classifies crack morphology into Shear Cracks (45° diagonal), Flexural Cracks, Settlement Cracks, and Thermal Shrinkage.
   - Estimates crack width (mm), evaluates structural failure risk, and provides step-by-step remediation protocols (epoxy pressure injection, carbon-fiber CFRP wraps, foundation underpinning).
3. **Construction Project Planner (CPM & WBS)**:
   - Synthesizes 5-stage Work Breakdown Structures (WBS) with Critical Path Method (CPM) sequencing, manpower sizing, milestone schedules, and budget allocations.
   - Formulates a 4-point risk contingency mitigation matrix.
4. **Real Estate Valuation & Investment Engine**:
   - Hedonic appraisal model combining construction replacement cost, land equity share, and developer margin.
   - Computes investor yield metrics: Monthly Rental Forecast, Gross Rental Yield (%), Net Capitalization Rate (Cap Rate %), and 5-Year Capital Appreciation.
5. **Daily Site Assistant & Punch List Generator**:
   - Parses unstructured superintendent field notes into an executive briefing.
   - Identifies concrete transit delays, craft absenteeism, and flags safety defects.
   - Outputs an automated, prioritized next-day trade punch list.
6. **Weather-Aware Construction Risk Advisory**:
   - Meteorological risk matrix evaluating ambient temperature, humidity, wind velocity, rain probability, and UV index.
   - Issues trade-specific workability statuses (Safe, Caution, Unsafe) across Concrete Pouring (ACI 305R/306R), Tower Cranes (OSHA wind limits), Painting/Waterproofing, Deep Excavation, and Roofing.
7. **Construction Knowledge Assistant (Chatbot)**:
   - Multi-turn conversational AI grounded in structural concrete, building codes, ASTM testing standards, and site troubleshooting.

---

## 🏛️ Technical Architecture

```
multimodal-construction-platform/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # RESTful routers (safety, crack, planning, valuation, daily-log, weather, chat, samples)
│   │   ├── schemas/         # Strict Pydantic Data Contracts for request/response serialization
│   │   ├── services/        # Gemini Multimodal AI & Heuristic Domain Engines
│   │   ├── utils/           # In-memory image processing & synthetic scenario generators
│   │   ├── config.py        # Centralized settings & environment bindings
│   │   └── main.py          # FastAPI application entrypoint with CORS & error handlers
│   ├── tests/               # Pytest automated test suite (9 integration tests)
│   ├── requirements.txt     # Python backend dependencies
│   └── Dockerfile           # Backend container specification
├── frontend/
│   ├── src/
│   │   ├── components/      # Sleek Linear/Vercel-styled UI modules
│   │   ├── api/             # Frontend fetch client connecting to FastAPI v1
│   │   ├── App.jsx          # Tab router & state manager
│   │   ├── index.css        # Tailwind styling & dark mode tokens
│   │   └── main.jsx         # React DOM mount point
│   ├── package.json         # React 18, Vite 5, Tailwind CSS, Lucide icons
│   └── Dockerfile           # Multi-stage Nginx production container
├── docs/
│   ├── REQUIREMENTS.md      # Activity 1.1: Functional Requirements Specification
│   ├── ARCHITECTURE.md      # System diagrams, component maps, and sequences
│   └── API_SPECIFICATION.md # Complete REST contract documentation
├── docker-compose.yml       # 1-command containerized stack orchestrator
├── start_dev.bat            # Windows 1-click startup script
├── start_dev.sh             # Linux/macOS 1-click startup script
└── README.md                # System documentation
```

---

## 📋 Curriculum & Epics Traceability Matrix

| Curriculum Epic | Assigned Activity | Platform Implementation Component | Verification Status |
| :--- | :--- | :--- | :--- |
| **Epic 1** | Activity 1.1: Functional Requirements | `docs/REQUIREMENTS.md` | Completed & Documented |
| **Epic 1** | Activity 1.2: Environment Setup | `backend/requirements.txt`, `backend/.venv` | Installed & Verified |
| **Epic 2** | Activity 2.1: Safety Image Analysis | `backend/app/services/safety_service.py`, `SafetyInspector.jsx` | Tested (100% Pass) |
| **Epic 2** | Activity 2.2: Crack Detection Logic | `backend/app/services/crack_service.py`, `CrackAnalyzer.jsx` | Tested (100% Pass) |
| **Epic 3** | Activity 3.1: Construction Planning | `backend/app/services/planning_service.py`, `ProjectPlanner.jsx` | Tested (100% Pass) |
| **Epic 3** | Activity 3.2: Real Estate Valuation | `backend/app/services/valuation_service.py`, `RealEstateValuer.jsx`| Tested (100% Pass) |
| **Epic 4** | Activity 4.1: Multimodal AI Integration | `backend/app/services/gemini_client.py` (Gemini 1.5/2.0) | Dual Live/Fallback Ready |
| **Epic 4** | Activity 4.2: Structured Data Contracts | `backend/app/schemas/` (Pydantic v2 schemas) | Validated via Pytest |
| **Epic 4** | Activity 4.3: Context-Aware Reasoning | OSHA 1926, ACI 318, & IBC Domain Prompts | Grounded & Implemented |
| **Epic 5** | Activity 5.1: Construction Chatbot | `backend/app/services/chat_service.py`, `KnowledgeBot.jsx` | Tested (100% Pass) |
| **Epic 5** | Activity 5.2: Daily Site Assistant | `backend/app/services/daily_log_service.py`, `DailySiteAssistant.jsx` | Tested (100% Pass) |
| **Epic 5** | Activity 5.3: Weather Construction Advisory | `backend/app/services/weather_service.py`, `WeatherAdvisor.jsx`| Tested (100% Pass) |
| **Epic 6** | Activity 6.1: Interface & End-to-End | React 18 + Vite Minimalist Web GUI | Responsive & Verified |
| **Epic 6** | Activity 6.2: System Validation | `backend/tests/test_api.py` (9 tests) | 9 / 9 Passed |
| **Epic 6** | Activity 6.3: Deployment Readiness | `docker-compose.yml`, `Dockerfile`, `start_dev.bat` | Production Ready |

---

## 💻 Prerequisites & System Requirements

- **Operating System**: Windows 10/11, macOS, or Linux
- **Python**: Version 3.8+ (Tested on Python 3.11.9)
- **Node.js**: Version 18+ (Tested on Node v22.20.0, npm 10.9.3)
- **Optional**: Docker & Docker Compose (for containerized deployment)
- **Optional**: Google Gemini API Key (`GEMINI_API_KEY`). *Note: The system incorporates a robust offline calibrated engine, ensuring full functionality for demonstration and evaluation even without an API key!*

---

## 🚀 Quick Start Guide (Local Setup)

### 1. Automated 1-Click Startup (Recommended)

#### On Windows:
Double-click `start_dev.bat` or run in PowerShell / Command Prompt:
```powershell
.\start_dev.bat
```

#### On Linux / macOS:
```bash
chmod +x start_dev.sh
./start_dev.sh
```

---

### 2. Manual Step-by-Step Startup

#### Step A: Backend Setup (FastAPI)
```bash
cd backend
# Create virtual environment (if not already created)
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Set your Gemini API key in .env or environment
# set GEMINI_API_KEY=your_key_here

# Launch FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend will be running at [http://127.0.0.1:8000](http://127.0.0.1:8000). Interactive Swagger documentation available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).*

#### Step B: Frontend Setup (React + Vite)
In a separate terminal:
```bash
cd frontend
# Install node packages
npm install

# Start Vite development server
npm run dev
```
*Frontend web application will be accessible at [http://127.0.0.1:5173](http://127.0.0.1:5173).*

---

## 🐳 Containerized Deployment (Docker Compose)

To launch the entire platform with one command using Docker:
```bash
docker compose up --build
```
- **Web UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔌 API Documentation & Data Contracts

All endpoints enforce strict Pydantic JSON contracts. Detailed payload schemas and sample requests are documented in [docs/API_SPECIFICATION.md](file:///C:/Users/sanid/.gemini/antigravity/scratch/multimodal-construction-platform/docs/API_SPECIFICATION.md).

### Core Endpoints:
- `GET /api/v1/health`: System health and active AI mode (`gemini-live` or `calibrated-heuristic`).
- `GET /api/v1/samples`: Pre-packaged multimodal scenarios for 1-click evaluation.
- `POST /api/v1/safety/analyze`: Multipart site photo upload for OSHA safety inspection.
- `POST /api/v1/safety/analyze-json`: Base64 JSON site photo analysis.
- `POST /api/v1/crack/analyze`: Multipart concrete surface photo for ACI 318 crack triage.
- `POST /api/v1/crack/analyze-json`: Base64 JSON crack inspection.
- `POST /api/v1/planning/generate`: Synthesizes 5-stage CPM schedule, WBS, and risk matrix.
- `POST /api/v1/valuation/calculate`: Computes fair market value, replacement cost, and Cap Rate.
- `POST /api/v1/daily-log/process`: Converts unstructured supervisor notes into executive briefings and punch lists.
- `POST /api/v1/weather/advisory`: Meteorological construction trade safeguards.
- `POST /api/v1/chat/message`: Conversational civil engineering knowledge assistant.

---

## 🎯 Mentor & Evaluator Demo Walkthrough

The platform has been designed for **zero-friction grading**. Every module features a **1-Click Preset Button** so mentors can evaluate multimodal AI capabilities instantly:

1. **Site Safety Inspector Tab**:
   - Click **"Load Preset Sample"** in the top-right corner.
   - The system instantly loads a high-resolution scaffolding scenario with detected bounding boxes.
   - Click **"Run Safety Audit"** to review the 76/100 Compliance Score, PPE compliance progress meters, and itemized OSHA 1926 citations.
2. **Crack & Structural Analysis Tab**:
   - Click **"Load Preset Sample"**.
   - Loads a reinforced concrete transfer beam displaying 45° diagonal shear distress.
   - Click **"Analyze Structural Image"** to inspect the ACI 318-19 failure analysis, estimated 2.4mm width, and 3-step CFRP remediation protocol.
3. **Project Planner Tab**:
   - Click **"Load Commercial Preset"** and hit **"Generate Project Plan"**.
   - Review the 60-week Gantt schedule with Critical Path flags, manpower allocation, and risk contingency matrix.
4. **Real Estate Valuer Tab**:
   - Click **"Load Penthouse Preset"** and select **"Calculate Valuation"**.
   - Inspect the \$845,000 median market valuation, replacement cost breakdown bar, and 5.1% Cap Rate yield metrics.
5. **Daily Site Assistant Tab**:
   - Click **"Load Field Notes Preset"** and hit **"Process Daily Log"**.
   - See how raw supervisor diary notes are parsed into delay hours, subcontractor impact, and an actionable next-day punch list.
6. **Weather Advisor Tab**:
   - Click **"Extreme Heat"** or **"Gale Wind Crane"** and click **"Run Weather Risk Advisory"**.
   - See how the system halts tower crane operations when winds exceed OSHA thresholds and mandates ice-water dosing for hot-weather concrete.
7. **Knowledge Bot Tab**:
   - Click any of the suggested prompt pills (e.g., *"What is the minimum curing period for OPC concrete according to ACI 308?"*).
   - Review multi-turn technical explanations with formal building code citations and follow-up prompts.
8. **Executive Audit Report**:
   - Click **"Audit Report"** in the navigation bar to preview, print, or download a consolidated Markdown audit report of all current session findings.

---

## 🧪 Automated Verification & Test Suite

The backend includes a comprehensive pytest suite covering all routers, schema validations, image decoders, and fallback engines:

```bash
cd backend
.venv\Scripts\activate
pytest tests/ -v
```

### Test Results:
```text
tests/test_api.py::test_root_and_health PASSED                           [ 11%]
tests/test_api.py::test_samples_endpoint PASSED                          [ 22%]
tests/test_api.py::test_safety_analysis_json PASSED                      [ 33%]
tests/test_api.py::test_crack_analysis_json PASSED                       [ 44%]
tests/test_api.py::test_planning_generation PASSED                       [ 55%]
tests/test_api.py::test_valuation_calculation PASSED                     [ 66%]
tests/test_api.py::test_daily_log_processing PASSED                      [ 77%]
tests/test_api.py::test_weather_advisory PASSED                          [ 88%]
tests/test_api.py::test_chat_assistant PASSED                            [100%]

======================= 9 passed in 12.80s ========================
```

---

## 📐 Civil Engineering & Safety Standards Grounding

The platform is strictly calibrated against internationally recognized engineering and safety benchmarks:
- **OSHA 29 CFR 1926**: Subpart M (Fall Protection §1926.501/502), Subpart L (Scaffolds §1926.451), Subpart E (Personal Protective Equipment §1926.100/102).
- **ACI 318-19**: American Concrete Institute Building Code Requirements for Structural Concrete (Chapter 9 Shear Design, Chapter 10 Columns).
- **ACI 224R / 224.1R**: Causes, Evaluation, and Repair of Cracks in Concrete Structures (Tolerable crack width limits: 0.40mm for interior exposure).
- **ACI 305R & 306R**: Specification for Hot Weather and Cold Weather Concreting.
- **IBC 2024**: International Building Code occupancy and structural provisions.
- **ISO 45001**: Occupational Health and Safety Management Systems.

---

## ⚠️ Engineering Limitations & Human-in-the-Loop Principles

The **Multimodal Construction Intelligence Platform** is an **AI-assisted decision-support system** engineered to assist field supervisors and safety auditors. It is not an automated replacement for licensed professional personnel.

1. **AI-Assisted Screening & Competent Person Oversight**:
   - All computer vision detections, bounding boxes, and safety telemetry serve as rapid initial screening.
   - Per OSHA 29 CFR 1926 standards, elevated work platforms and scaffolding configurations must be formally inspected, tagged, and cleared by an OSHA-designated **Competent Person** prior to trade occupancy.
2. **Truth-First Optical Thresholds & PPE Verification**:
   - The platform adheres to strict truth-first principles: When headwear or PPE is obscured by viewing angle, distance (>50 ft), hoods, balaclavas, or low optical resolution, the system returns:  
     `Possible non-compliance: head protection not clearly visible (OSHA 1926.100 Spot-Check Required)`
   - The platform eliminates false assurance by refusing to grant unverified 100% passes when head protection cannot be confirmed.
3. **Jurisdictional Standard Hierarchy & Subpart L Fall Protection Criteria**:
   - In accordance with 29 CFR 1926.500(a)(2)(i), scaffolds are strictly excluded from general Subpart M fall protection and are governed under **Subpart L (§ 1926.451)**.
   - Under **29 CFR 1926.451(g)(1)(vii)**, employees on supported frame scaffolds more than 10 ft above a lower level must be protected by *either* a personal fall arrest system (PFAS) *or* a guardrail system meeting § 1926.451(g)(4). A missing personal fall arrest lanyard constitutes a violation specifically when compliant perimeter guardrails are also absent. The platform evaluates both controls simultaneously to report: *"No fall protection visible: neither guardrails nor personal fall arrest."*
   - Guardrails are cited specifically under **§ 1926.451(g)(4)(i)**, while fall protection criteria cites **§ 1926.451(g)(1)**.
   - Monocular 2D photographs cannot yield laser-calibrated dimensional elevation; heights are reported as *"appears to be more than 10 ft above the lower level"* based on structural scaffolding frame tiers.
   - High-visibility apparel is evaluated for active equipment zones and is not falsely mandated as universal for elevated scaffold trades under Subpart L.
4. **Structural Forensics & Physical NDT Requirements**:
   - Concrete crack classifications (ACI 318-19 / ACI 224R) represent non-invasive visual surface triage.
   - Subsurface void propagation, steel reinforcement yielding, or rebar corrosion must be verified via physical non-destructive testing (ultrasonic pulse velocity, ground-penetrating radar, or core compression tests) under the direction of a licensed Professional Engineer (PE / SE).
5. **Deterministic Scoring & Reproducibility**:
   - Risk indices and hazard scores are computed using fixed, deterministic civil engineering formulas with model temperature set to `0.0`, ensuring identical visual inputs generate reproducible audit metrics.

---

## 👤 Author & Academic Attribution
- **Student / Developer**: Sanidhya
- **Module**: Generative AI with Google Cloud
- **Project**: Multimodal Construction Intelligence Platform
- **License**: MIT
