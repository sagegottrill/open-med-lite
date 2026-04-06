# 🏥 OpenMed Lite (The Sahel Resilience Stack)

> **Offline-first clinical record engine built strictly for last-mile rural clinics, mobile outposts, and off-grid communities.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status: Core Architecture Live](https://img.shields.io/badge/Status-Core_Architecture_Live-success.svg)]()
[![Frontend: React/Vite](https://img.shields.io/badge/Frontend-React%2018-61DAFB.svg)]()

OpenMed Lite is the clinical health module of **The Sahel Resilience Stack**. It is an open-source, offline-first Electronic Medical Record (EMR) engine designed specifically to bypass the centralized cloud and empower rural Primary Healthcare Centers (PHCs) and NGO mobile health workers.

## 📖 The Manifesto: The Last-Mile Reality
While engineering enterprise data systems for major urban facilities (like the UMTH Molecular Lab), I observed a fatal structural flaw: standard cloud-first medical architectures cannot survive the "last mile." When the regional power grid collapses, triage in rural clinics completely paralyzes. 

**OpenMed Lite is NOT built for well-funded urban teaching hospitals.** It is a lightweight, edge-optimized engine built for infrastructure deserts. It decouples the clinical intake process from internet dependency, ensuring that a health worker in a displacement camp can continue treating patients even during a total telecommunications blackout.

## 🌍 Core System Capabilities

* **Deterministic CRDT Synchronization:** Utilizes `RxDB` and `Yjs` (Conflict-Free Replicated Data Types) to allow rural clinics to read, write, and update patient data entirely offline. A mobile health worker can collect data on a tablet in the field all day, and the state will asynchronously sync with the master PostgreSQL database only when they return to a zone with broadband.
* **"Human-in-the-Loop" Conflict Resolution:** Standard CRDTs resolve conflicts by blindly trusting the "Last-Write-Wins" timestamp. In medical contexts (e.g., overriding a penicillin allergy), this is a fatal flaw. OpenMed Lite halts automated merges on critical fields, routing encrypted conflicts to a Clinical Officer's dashboard for manual verification once the device comes back online.
* **Zero-Bandwidth UI:** A lightweight, high-contrast DOM architecture designed to load instantly on cheap, legacy mobile tablets without draining local battery reserves.

## 🛡️ Medical Data Security & Compliance
Handling sensitive demographic and epidemiological data for vulnerable populations requires strict "Privacy by Design":
* **NDPR & HIPAA Alignment:** Role-Based Access Control (RBAC) ensures strictly partitioned access to patient identifiable information (PII).
* **Cryptographic Sanitization:** All localized offline state data is encrypted at rest using AES-256 before being written to the mobile browser's IndexedDB.

## 💻 System Topology & Technology Stack

| Layer | Technology | Primary Function |
| :--- | :--- | :--- |
| **Offline Engine** | RxDB / Yjs / IndexedDB | Asynchronous local state management and mathematical CRDT conflict resolution on mobile tablets. |
| **Security Layer** | crypto-js / bcrypt | Local encryption at rest for PII and strict payload sanitization. |
| **Cloud Sync** | Node.js / PostgreSQL | Master clinical database aggregation when network connectivity is restored. |
| **Client Interface**| React / Tailwind | Low-latency, high-contrast clinical data entry views for rural health workers. |

## 🤝 Open Source Governance & Contributing
OpenMed Lite is classified as a **Digital Public Good**. It is engineered by the **Orivon Edge Youth Guild** operating within Borno State, aiming to provide digital sovereignty to local, last-mile healthcare infrastructure.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/RuralClinicModule`)
3. Commit your Changes (`git commit -m 'Add RuralClinicModule'`)
4. Push to the Branch (`git push origin feature/RuralClinicModule`)
5. Open a Pull Request

---
*Engineered for the Edge. Maiduguri, Borno State, Nigeria.*
