import { motion, useScroll, useSpring } from 'framer-motion'
import {
  ArrowRight,
  Code2,
  ShieldCheck,
  Database,
  Workflow,
  KeyRound,
  Stethoscope,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GITHUB_PLACEHOLDER = 'https://github.com'

const container = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const marqueeItems = [
  'Deterministic CRDT Sync',
  'Human-in-the-Loop Resolution',
  'Zero-Bandwidth UI',
  'AES-256 Encryption',
  'RxDB / Yjs Powered',
  'UMTH Stress-Tested',
]

function useWatClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Africa/Lagos',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date()),
      )
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

export default function LandingPage() {
  const navigate = useNavigate()
  const wat = useWatClock()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.2 })

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-cyan-600 via-cyan-500 to-yellow-400"
      />

      <div className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="text-xs tracking-wide text-slate-600">
            Open-source clinical infrastructure · Sahel Resilience Stack ·{' '}
            <span className="text-cyan-700">Last-Mile Clinics</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
            <span className="font-medium text-slate-700">Phase 1 Architecture</span>
            <span aria-hidden>·</span>
            <span className="tabular-nums">{wat || '—'} WAT</span>
            <span aria-hidden>·</span>
            <span>Borno State</span>
          </div>
        </div>
        <div className="border-t border-slate-100">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3">
            <div className="text-lg font-semibold tracking-tight text-slate-900">OpenMed Lite</div>
            <nav className="hidden flex-1 justify-center gap-8 text-sm text-slate-700 md:flex">
              <a href="#challenge" className="transition-colors hover:text-slate-900">
                Challenge
              </a>
              <a href="#architecture" className="transition-colors hover:text-slate-900">
                Architecture
              </a>
              <a href="#capabilities" className="transition-colors hover:text-slate-900">
                Capabilities
              </a>
              <a href="#get-started" className="transition-colors hover:text-slate-900">
                Get started
              </a>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 sm:inline">
                Officer
              </span>
              <button
                type="button"
                onClick={() => navigate('/demo')}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
              >
                Demo
              </button>
              <button
                type="button"
                onClick={() => navigate('/desk')}
                className="rounded-lg bg-cyan-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-cyan-600"
              >
                Admin login
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-500/12 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-yellow-500/12 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm"
            >
              <Stethoscope className="h-3.5 w-3.5 text-cyan-700" />
              Offline clinical engine · Health &amp; infrastructure
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl font-semibold leading-tight md:text-6xl"
            >
              The Clinical Engine for the <span className="text-cyan-700">Last Mile</span>.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-base leading-relaxed text-slate-600 md:text-lg"
            >
              An offline-first Electronic Medical Record (EMR) blueprint utilizing CRDTs. Built to ensure off-grid rural
              clinics and mobile health workers never lose a single patient record when the power grid fails.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/demo')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-700 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-cyan-600"
              >
                Access live demo <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={GITHUB_PLACEHOLDER}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Code2 className="h-4 w-4" /> View GitHub
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Situational overview</div>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Demo</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Live demo',
              desc: 'Mobile Tablet UI (Simulated offline state).',
              icon: Workflow,
              action: () => navigate('/demo'),
              cta: 'Open console',
            },
            {
              title: 'Repository',
              desc: 'Core CRDT schema, sync engine, and source.',
              icon: Database,
              href: GITHUB_PLACEHOLDER,
              cta: 'GitHub',
            },
            {
              title: 'Architecture',
              desc: 'Read, write, sync — offline by design.',
              icon: ShieldCheck,
              href: '#architecture',
              cta: 'How it works',
            },
            {
              title: 'Officer access',
              desc: 'Secure dashboard for conflict resolution.',
              icon: KeyRound,
              action: () => navigate('/desk'),
              cta: 'Sign in',
            },
          ].map((c) => {
            const Icon = c.icon
            const inner = (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-600/15 bg-cyan-600/10">
                  <Icon className="h-5 w-5 text-cyan-700" />
                </div>
                <div className="mt-4 font-semibold">{c.title}</div>
                <div className="mt-1 text-sm leading-relaxed text-slate-600">{c.desc}</div>
                <div className="mt-4 text-sm font-semibold text-cyan-700">{c.cta} →</div>
              </>
            )
            const className =
              'block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:bg-slate-50'
            if (c.href) {
              return (
                <a key={c.title} href={c.href} className={className}>
                  {inner}
                </a>
              )
            }
            return (
              <button key={c.title} type="button" className={`${className} w-full text-left`} onClick={c.action}>
                {inner}
              </button>
            )
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-4">
          <div className="flex gap-6 whitespace-nowrap animate-[marquee_22s_linear_infinite]">
            {[...marqueeItems, ...marqueeItems].map((t, i) => (
              <div key={`${t}-${i}`} className="text-sm text-slate-600">
                <span className="text-cyan-700">◆</span> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { k: '99.9%', v: 'Uptime in Enterprise Stress-Test' },
            { k: 'Zero', v: 'Dependency on Cloud Connectivity' },
            { k: 'AES-256', v: 'Cryptographic PII Protection' },
          ].map((s) => (
            <div key={s.v} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl font-semibold text-slate-900">{s.k}</div>
              <div className="mt-1 text-sm text-slate-600">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="challenge" className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Context &amp; challenge</div>
            <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
              Enterprise software paralyzes rural triage.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              As proven in our UMTH deployment, enterprise-grade data architecture is critical for regional hubs. But those
              heavy architectures fail in the last mile. When the regional grid collapses, mobile health workers and rural
              Primary Healthcare Centers (PHCs) are left blind. OpenMed Lite decouples the clinical intake process from
              internet dependency entirely.
            </p>
          </div>
          <div className="space-y-4 lg:col-span-7">
            {[
              {
                m: 'Grid Dependency',
                d: 'Standard EMRs freeze when telecommunications drop, halting triage.',
              },
              {
                m: 'The "Last-Write" Flaw',
                d: 'Standard cloud syncing blindly overwrites critical medical data based on timestamps.',
              },
              {
                m: 'Hardware Drain',
                d: 'Bloated cloud portals drain legacy mobile batteries in extreme heat.',
              },
            ].map((x) => (
              <motion.div
                key={x.m}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:bg-slate-50"
              >
                <div className="font-semibold text-yellow-700">{x.m}</div>
                <div className="mt-1 text-sm text-slate-600">{x.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Technical architecture</div>
          <h2 className="mt-3 text-3xl font-semibold">Asynchronous triage. Offline by design.</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
            OpenMed Lite distills enterprise-grade cryptographic security into a lightweight, CRDT-powered engine. A mobile
            health worker can collect data on a tablet in the field all day, and the state will asynchronously synchronize
            with the master PostgreSQL database only when they return to a zone with broadband.
          </p>

          <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="space-y-2">
                  {['Local State Capture', 'Deterministic CRDTs', 'Human-in-the-Loop Resolution'].map((t) => (
                    <div
                      key={t}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
                    >
                      <span className="h-2 w-2 rounded-full bg-cyan-700" />
                      <span className="text-sm text-slate-800">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4 lg:col-span-8">
              {[
                {
                  n: '01',
                  t: 'Local State Capture',
                  d: 'A lightweight, zero-bandwidth React DOM architecture writes encrypted patient data directly to the device\'s local IndexedDB, providing sub-second latency even in airplane mode.',
                },
                {
                  n: '02',
                  t: 'Deterministic CRDTs',
                  d: 'RxDB and Yjs manage complex data mutations locally. Mathematical conflict-free replicated data types ensure the data structure remains immutable until network connection is restored.',
                },
                {
                  n: '03',
                  t: 'Human-in-the-Loop Resolution',
                  d: 'In medical contexts, blindly trusting a "Last-Write-Wins" timestamp can be fatal (e.g., overwriting a penicillin allergy). OpenMed Lite halts automated merges on critical fields, routing encrypted conflicts to a Clinical Officer for manual verification.',
                },
              ].map((s) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <div className="font-mono text-sm text-cyan-700">{s.n}</div>
                  <div className="mt-2 text-lg font-semibold">{s.t}</div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Core capabilities</div>
        <h2 className="mt-3 text-3xl font-semibold">Data sovereignty for vulnerable populations.</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
          Handling sensitive demographic and epidemiological data requires strict &quot;Privacy by Design.&quot; This architecture
          ensures NDPR and HIPAA alignment while keeping the UI accessible for low-resource hardware.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              n: '1',
              t: 'Offline Triage Continuity',
              d: 'Clinics can read historical records and write new diagnoses completely off-grid.',
            },
            {
              n: '2',
              t: 'Cryptographic Sanitization',
              d: 'All localized state data is encrypted at rest using AES-256 before hitting the browser storage.',
            },
            {
              n: '3',
              t: 'Role-Based Partitioning',
              d: 'Strict RBAC ensures mobile workers only access the data authorized for their specific geographic ward.',
            },
          ].map((item) => (
            <div
              key={item.n}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:bg-slate-50"
            >
              <div className="text-2xl font-semibold text-cyan-700">{item.n}</div>
              <div className="mt-2 font-semibold">{item.t}</div>
              <div className="mt-2 text-sm leading-relaxed text-slate-600">{item.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="get-started" className="mx-auto max-w-7xl px-6 pb-12">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-500/10 to-yellow-500/10 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm text-slate-600">Explore the stack — demo, code, or secure access</div>
            <div className="mt-1 text-2xl font-semibold md:text-3xl">
              The live demo utilizes simulated offline states to demonstrate the &quot;Human-in-the-Loop&quot; conflict resolution
              dashboard.
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/demo')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Access live demo <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={GITHUB_PLACEHOLDER}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              <Code2 className="h-4 w-4" /> View GitHub repository
            </a>
            <button
              type="button"
              onClick={() => navigate('/desk')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-5 py-3 font-semibold text-cyan-800 transition-colors hover:bg-cyan-50"
            >
              Officer login
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div>
              <div className="text-lg font-semibold">OpenMed Lite</div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                Offline-first clinical record engine built strictly for last-mile rural clinics, mobile outposts, and
                off-grid communities.
              </p>
            </div>
            <div className="text-sm text-slate-600">
              <div className="font-medium text-slate-800">Initiative</div>
              <div className="mt-1">Orivon Edge</div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Orivon Edge. All rights reserved.</span>
            <span>Engineered for the Edge. Maiduguri, Borno State, Nigeria.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
