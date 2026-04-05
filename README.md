# 🏥 OpenMed Lite

> **Offline-first clinical record system optimized for intermittent connectivity in extreme environments.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status: Prototype](https://img.shields.io/badge/Status-Phase_1_Architecture-orange.svg)]()
[![Frontend: React/Vite](https://img.shields.io/badge/Frontend-React%2018-61DAFB.svg)]()

OpenMed Lite is a module of the Sahel Resilience Stack. It is an open-source, offline-first Electronic Medical Record (EMR) system designed specifically for rural clinics operating in areas with severe telecommunication instability. 

## 🏗️ Current Project Status: Phase 1 (CRDT & Conflict Resolution)
*This repository is actively under development.*
- **Focus:** Solving the "Last-Write-Wins" fatal flaw in standard medical CRDTs. 
- **Currently Implemented:** Architecture scaffolding and offline-first UI foundation.
- **In Active Development:** "Human-in-the-loop" Conflict Resolution Desk, RxDB integration, and secure state synchronization.

## 🌍 Core System Capabilities

* **Deterministic CRDT Synchronization:** Utilizes Conflict-Free Replicated Data Types to allow clinics to read, write, and update patient data entirely offline, syncing to the master database only when broadband is restored.
* **Human-in-the-Loop Conflict Resolution:** Unlike standard CRDTs that blindly overwrite data based on timestamps (which can be fatal for medical records like allergies), OpenMed Lite flags sync conflicts and routes them to a clinical officer for manual merge approval.
* **Zero-Bandwidth UI:** A lightweight, high-contrast interface designed to load instantly on legacy clinical hardware without draining local resources.

## 🤝 Open Source Governance & Contributing

OpenMed Lite is classified as a **Digital Public Good**. It is engineered by an open-source youth guild operating within Borno State, aiming to provide digital sovereignty to local healthcare infrastructure.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/ClinicalModule`)
3. Commit your Changes (`git commit -m 'Add ClinicalModule'`)
4. Push to the Branch (`git push origin feature/ClinicalModule`)
5. Open a Pull Request

---
*Engineered in Maiduguri, Borno State, Nigeria.*
