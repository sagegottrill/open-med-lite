# 🏥 OpenMed Lite (The Sahel Resilience Stack)

> **Offline-first clinical record engine utilizing CRDTs, optimized for intermittent connectivity in extreme environments.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status: Core Architecture Live](https://img.shields.io/badge/Status-Core_Architecture_Live-success.svg)]()
[![Frontend: React/Vite](https://img.shields.io/badge/Frontend-React%2018-61DAFB.svg)]()

OpenMed Lite is the clinical health module of **The Sahel Resilience Stack**. It is an open-source, offline-first Electronic Medical Record (EMR) engine designed specifically for rural clinics, NGOs, and mobile health outposts operating in regions with severe telecommunication instability. 

## 📖 The Manifesto: Why This Exists
This architecture was born out of the realities observed during the deployment of enterprise EDCs (like REDCap) at regional diagnostic centers such as the UMTH Molecular Lab. Standard cloud-first medical systems paralyze clinical triage when the regional power grid collapses. OpenMed Lite bridges this gap by decoupling the clinical intake process from internet dependency.

## 🌍 Core System Capabilities

* **Deterministic CRDT Synchronization:** Utilizes `RxDB` and `Yjs` (Conflict-Free Replicated Data Types) to allow clinics to read, write, and update patient data entirely offline. The state is synchronized asynchronously with the master PostgreSQL database only when broadband is restored.
* **"Human-in-the-Loop" Conflict Resolution:** Standard CRDTs resolve conflicts by blindly trusting the "Last-Write-Wins" timestamp. In medical contexts (e.g., overriding a penicillin allergy), this is a fatal flaw. OpenMed Lite halts automated merges on critical fields, routing encrypted conflicts to a Clinical Officer's dashboard for manual verification.
* **Zero-Bandwidth UI:** A lightweight, high-contrast DOM architecture designed to load instantly on legacy clinical hardware without draining local battery reserves.

## 🛡️ Medical Data Security & Compliance
As a digital public good handling sensitive demographic and epidemiological data, OpenMed Lite is architected around strict "Privacy by Design" principles:
* **NDPR & HIPAA Alignment:** Role-Based Access Control (RBAC) ensures strictly partitioned access to patient identifiable information (PII).
* **Cryptographic Sanitization:** All localized offline state data is encrypted at rest using AES-256 before being written to the browser's IndexedDB.

## 💻 System Topology & Technology Stack

| Layer | Technology | Primary Function |
| :--- | :--- | :--- |
| **Offline Engine** | RxDB / Yjs / IndexedDB | Asynchronous local state management and mathematical CRDT conflict resolution. |
| **Security Layer** | crypto-js / bcrypt | Local encryption at rest for PII and strict payload sanitization. |
| **Cloud Sync** | Node.js / PostgreSQL | Master clinical database aggregation when network connectivity is available. |
| **Client Interface**| React / Tailwind | Low-latency, high-contrast clinical data entry views. |

## 🤝 Open Source Governance & Contributing
OpenMed Lite is classified as a **Digital Public Good**. It is engineered by the **Orivon Edge Youth Guild** operating within Borno State, aiming to provide digital sovereignty to local healthcare infrastructure.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/ClinicalModule`)
3. Commit your Changes (`git commit -m 'Add ClinicalModule'`)
4. Push to the Branch (`git push origin feature/ClinicalModule`)
5. Open a Pull Request

---
*Engineered in Maiduguri, Borno State, Nigeria.*
