import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

// Official barangays of Cebu City (80).
// Source: https://en.wikipedia.org/wiki/List_of_barangays_in_Cebu_City
const CEBU_CITY_BARANGAYS = [
  "Adlaon", "Agsungot", "Apas", "Babag", "Bacayan", "Banilad",
  "Basak Pardo", "Basak San Nicolas", "Binaliw", "Bonbon", "Budlaan",
  "Buhisan", "Bulacao", "Buot", "Busay", "Calamba", "Cambinocot",
  "Capitol Site", "Carreta", "Central", "Cogon Pardo", "Cogon Ramos",
  "Day-as", "Duljo Fatima", "Ermita", "Guadalupe", "Guba", "Hipodromo",
  "Inayawan", "Kalubihan", "Kalunasan", "Kamagayan", "Kasambagan",
  "Kinasang-an Pardo", "Labangon", "Lahug", "Lorega San Miguel",
  "Lusaran", "Luz", "Mabini", "Mabolo", "Malubog", "Mambaling",
  "Pahina Central", "Pahina San Nicolas", "Pamutan", "Pardo", "Parian",
  "Paril", "Pasil", "Pit-os", "Poblacion Pardo", "Pulangbato",
  "Pung-ol Sibugay", "Punta Princesa", "Quiot Pardo", "Sambag I",
  "Sambag II", "San Antonio", "San Jose", "San Nicolas Proper",
  "San Roque", "Santa Cruz", "Santo Niño", "Sapangdaku", "Sawang Calero",
  "Sirao", "Suba", "Sudlon I", "Sudlon II", "T. Padilla", "Tabunan",
  "Tagba-o", "Talamban", "Taptap", "Tejero", "Tinago", "Tisa", "Toong",
  "Zapatera",
];

export default function SeekerOnboarding() {
  return (
    <>
      <PageHeader
        eyebrow="Step 1 of 1 · Cebu City"
        title="Job Seeker Onboarding"
        description="Tell the service who you are. Scratch Match is a Cebu City initiative — matches, advisor context, and listings are scoped to residents and employers within the city."
        crumbs={[{ label: "Home", href: "/" }, { label: "Register", href: "/signup" }, { label: "Seeker Onboarding" }]}
      />
      <section className="mx-auto max-w-4xl px-4 py-10 grid md:grid-cols-3 gap-6">
        <aside className="card p-5 self-start">
          <div className="text-[11px] uppercase tracking-[0.18em] text-navy-700">Why we ask</div>
          <p className="text-sm text-ink-soft mt-2">
            Onboarding fields are stored locally and used to scope matches and advisor context. You can
            edit them later from your dashboard.
          </p>
          <div className="divider-rule my-4" />
          <ul className="text-xs text-navy-800 space-y-2">
            <li>· Specializations drive your CV upload limits.</li>
            <li>· Barangay narrows location-based matching within Cebu City.</li>
            <li>· "Why you're here" is fed into the advisor's system context.</li>
          </ul>
          <div className="divider-rule my-4" />
          <p className="text-[11px] text-navy-700 leading-relaxed">
            <strong className="text-navy-900">Cebu City only.</strong> This service is
            bound to the city, not the wider Province of Cebu. Residents of other
            LGUs are welcome to test the prototype, but matches surface Cebu City
            openings first.
          </p>
        </aside>
        <form className="card p-6 md:col-span-2 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="Juan dela Cruz" />
            </div>
            <div>
              <label className="label">Years of Experience</label>
              <input type="number" min={0} className="input" placeholder="3" />
            </div>
            <div>
              <label className="label">Barangay (Cebu City)</label>
              <select className="select" defaultValue="">
                <option value="" disabled>Select your barangay…</option>
                {CEBU_CITY_BARANGAYS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
                <option value="Outside Cebu City">Outside Cebu City</option>
              </select>
            </div>
            <div>
              <label className="label">Highest Education</label>
              <select className="select">
                <option>Senior High School</option><option>Vocational / TESDA</option>
                <option>Bachelor's Degree</option><option>Master's Degree</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Specializations</label>
            <input className="input" placeholder="e.g. Frontend Development, Customer Support, Bookkeeping" />
            <p className="text-[11px] text-navy-700 mt-1">Comma-separated. Up to 5 CVs may be uploaded per specialization.</p>
          </div>
          <div>
            <label className="label">About You</label>
            <textarea className="textarea" placeholder="Brief professional summary." />
          </div>
          <div>
            <label className="label">Why are you here?</label>
            <textarea className="textarea" placeholder="What kind of role are you looking for? Any constraints (schedule, on-site, salary)?" />
          </div>
          <div className="flex items-center justify-between">
            <Link href="/signup" className="btn-ghost">← Back</Link>
            <Link href="/seeker/dashboard" className="btn-primary">Finish onboarding</Link>
          </div>
        </form>
      </section>
    </>
  );
}
