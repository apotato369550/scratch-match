"""
Generate sample job-posting documents (A4) in Scratch Match style.

Each output is a self-contained HTML file. Open in a browser, then
File -> Print -> Save as PDF (A4 portrait, background graphics ON).

Usage:
    python generate.py
"""

from pathlib import Path

HERE = Path(__file__).resolve().parent
ASSETS = "../assets"

JOBS = [
    {
        "slug": "sinulog_studios_fullstack",
        "company": "Sinulog Studios",
        "company_tag": "Cebu-based product studio · 42 employees",
        "title": "Mid-Level Full-Stack Engineer",
        "ref": "SS-ENG-2026-014",
        "location": "Cebu IT Park · Hybrid (3 days on-site)",
        "type": "Full-time · Permanent",
        "salary": "₱65,000 – ₱90,000 / month",
        "posted": "Posted May 2026",
        "summary": (
            "We build internal tools for Cebu SMBs. Boring problems, modern stack, real users. "
            "Looking for a full-stack engineer who can own a feature end-to-end and ship without "
            "a babysitter. Most days are quiet, focused, and free of meetings."
        ),
        "responsibilities": [
            "Own one product surface end-to-end: spec, build, ship, monitor.",
            "Work directly with two designers and the founder on weekly priorities.",
            "Write clear PRs, leave clear review comments, mentor a junior every quarter.",
            "Carry the on-call rotation roughly one week every two months.",
        ],
        "requirements": [
            "3+ years building production web apps in React or similar.",
            "Comfort with both frontend and a typed backend (Node/TS or Python).",
            "Read-the-postgres-logs fluency, not just ORM-only.",
            "Ability to estimate honestly and disagree well in writing.",
        ],
        "nice_to_have": [
            "Prior work at a Cebu-based product company.",
            "Experience with Next.js app router and Server Actions.",
            "Open-source contributions (any size).",
        ],
        "perks": [
            "HMO from day one (you + two dependents).",
            "₱20k yearly learning budget, no approval needed.",
            "Compressed 4.5-day workweek (Friday afternoon off).",
            "Free coffee, real coffee, made by an actual barista.",
        ],
        "apply": "Submit CV through the Scratch Match portal · ref SS-ENG-2026-014",
    },
    {
        "slug": "peo_cebu_program_officer",
        "company": "Public Employment Office · Cebu City",
        "company_tag": "Local government · Public service",
        "title": "Senior Citizens Employment Program Officer",
        "ref": "PEO-2026-SCEP-002",
        "location": "Cebu City Hall · On-site",
        "type": "Contractual · 12 months, renewable",
        "salary": "Salary Grade 18 · ₱45,000 / month equivalent",
        "posted": "Posted April 2026",
        "summary": (
            "Help run the Cebu City Senior Citizens Employment 2026 program: matching willing "
            "elderly residents with light-duty, part-time roles at participating businesses. "
            "Reports directly to the PEO Chief. Field work in barangays included."
        ),
        "responsibilities": [
            "Coordinate intake and onboarding of senior-citizen applicants citywide.",
            "Build relationships with at least 30 participating employers per quarter.",
            "Run weekly office hours at three rotating barangay halls.",
            "Submit monthly outcome reports to the PEO Chief and city council secretariat.",
        ],
        "requirements": [
            "Bachelor's degree in public administration, social work, HR, or related.",
            "2+ years of experience in community programs, HR, or LGU work.",
            "Working command of Cebuano · written and spoken English.",
            "Comfortable on dashboards; trained tooling provided.",
        ],
        "nice_to_have": [
            "Existing network among Cebu City barangay councils.",
            "Prior facilitation experience with senior or PWD groups.",
        ],
        "perks": [
            "Government health and life insurance package.",
            "13th-month pay and standard mid-year bonus.",
            "Service-vehicle pool for barangay visits.",
        ],
        "apply": "Submit CV and PSA-issued documents via the PEO Cebu intake portal.",
    },
    {
        "slug": "saltrove_brand_designer",
        "company": "Saltrove Foods",
        "company_tag": "Cebu food brand · 14 employees",
        "title": "Brand & Packaging Designer",
        "ref": "SR-DES-2026-006",
        "location": "Mandaue City · On-site (4 days)",
        "type": "Full-time · Permanent",
        "salary": "₱40,000 – ₱55,000 / month",
        "posted": "Posted May 2026",
        "summary": (
            "We make Cebuano pantry staples for the export market. Looking for a designer who "
            "can own packaging from concept to print-ready file, and keep our IG visual system "
            "consistent across collabs. Small team, high autonomy, good lechon."
        ),
        "responsibilities": [
            "Design packaging for new SKUs · concept, mock-up, dieline, print handoff.",
            "Maintain and evolve the brand visual system across digital and physical assets.",
            "Run quarterly photoshoots with the in-house food stylist.",
            "Approve final proofs at the printer at least once per launch.",
        ],
        "requirements": [
            "2+ years of brand or packaging design experience.",
            "Confident in Figma and Adobe Illustrator.",
            "Working knowledge of CMYK, dielines, and offset print constraints.",
            "Portfolio with at least one launched physical product.",
        ],
        "nice_to_have": [
            "Experience designing for Filipino or Asian food brands.",
            "Light motion design (capCut / After Effects).",
            "Cebuano-language copy sense for product labels.",
        ],
        "perks": [
            "Free monthly product allowance (you will gain weight).",
            "HMO from month two.",
            "Half-day Fridays during off-season.",
        ],
        "apply": "Submit portfolio and CV via the Scratch Match portal · ref SR-DES-2026-006",
    },
    {
        "slug": "halcyon_devops",
        "company": "Halcyon Cloud",
        "company_tag": "Cloud infra startup · 22 employees",
        "title": "Site Reliability Engineer",
        "ref": "HC-SRE-2026-019",
        "location": "Cebu IT Park · Remote-friendly",
        "type": "Full-time · Permanent",
        "salary": "₱110,000 – ₱160,000 / month",
        "posted": "Posted May 2026",
        "summary": (
            "We run Kubernetes for SMB SaaS customers across Southeast Asia. We are looking for an "
            "SRE who has been on call before and prefers postmortems to blameless email chains. "
            "Quiet, technical, paid well. Two open headcounts."
        ),
        "responsibilities": [
            "Own the on-call rotation alongside three other SREs.",
            "Improve our internal Kubernetes platform (~40 customer clusters).",
            "Drive incident reviews; write postmortems people actually read.",
            "Reduce alert noise. Ruthlessly.",
        ],
        "requirements": [
            "4+ years of production SRE / DevOps experience.",
            "Operational fluency in Kubernetes, Terraform, and one cloud provider.",
            "Strong scripting in Go or Python.",
            "History of being on call without burning out.",
        ],
        "nice_to_have": [
            "Authored or co-authored an open-source operator or controller.",
            "Experience running multi-tenant Postgres at scale.",
        ],
        "perks": [
            "₱40k yearly conference and learning budget.",
            "Premium HMO including parents.",
            "On-call work counts as work; you get the time back.",
            "Annual team off-site (last year: Siquijor).",
        ],
        "apply": "Submit CV and one short writeup of a real incident via the Scratch Match portal.",
    },
    {
        "slug": "lakat_hr_pm",
        "company": "Lakat HR",
        "company_tag": "Filipino HR SaaS · ~70 employees",
        "title": "Senior Product Manager · Talent Pipeline",
        "ref": "LHR-PM-2026-008",
        "location": "Manila · Cebu remote OK",
        "type": "Full-time · Permanent",
        "salary": "₱150,000 – ₱200,000 / month",
        "posted": "Posted May 2026",
        "summary": (
            "Lakat is the HR platform of choice for ~1,200 Filipino SMEs. We are hiring a senior PM "
            "to own the Talent Pipeline area: sourcing, candidate review, interview scheduling. "
            "You will work with a designer, four engineers, and our head of customer success."
        ),
        "responsibilities": [
            "Own the Talent Pipeline roadmap end-to-end.",
            "Talk to at least four customers a week, in person where possible.",
            "Write clear product specs and equally clear killed-feature postmortems.",
            "Partner with the GTM team on launch and pricing decisions.",
        ],
        "requirements": [
            "5+ years in product management, ideally 2+ at a B2B SaaS.",
            "Track record of shipping features that customers actually adopt.",
            "Comfortable saying no to internal stakeholders, with reasons.",
            "Working knowledge of HR or recruiting workflows is a strong plus.",
        ],
        "nice_to_have": [
            "Experience with AI-assisted product features.",
            "Data fluency: SQL, basic statistics, healthy skepticism.",
        ],
        "perks": [
            "Equity grant on day one, four-year vest.",
            "Quarterly travel budget for in-person customer visits.",
            "Top-tier HMO + dental + mental health coverage.",
        ],
        "apply": "Submit CV and one product writing sample via the Scratch Match portal.",
    },
]


CSS = r"""
:root {
  --navy-darkest: #0a162e;
  --navy-dark:    #0e1f3f;
  --navy-mid:     #1f3f7d;
  --gold:         #d4a017;
  --gold-light:   #e7c45a;
  --gold-dark:    #a8800f;
  --parchment:    #f7f5ee;
  --sand:         #efe9d8;
  --white:        #ffffff;
  --ink-soft:     #1f2937;
}
*, *::before, *::after {
  box-sizing: border-box; margin: 0; padding: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  color-adjust: exact;
}
@media screen {
  body { background: #c8c8c8; font-family: 'Inter', system-ui, sans-serif; display: flex; justify-content: center; padding: 32px 16px 64px; }
  .sheet { box-shadow: 0 14px 40px rgba(0,0,0,0.40); }
}
@media print {
  @page { size: 8.27in 11.69in; margin: 0; }
  body { background: none; padding: 0; margin: 0; }
  .sheet { width: 8.27in !important; min-height: 11.69in !important; box-shadow: none !important; }
}
.sheet { width: 8.27in; min-height: 11.69in; background: var(--white); font-family: 'Inter', system-ui, sans-serif; display: flex; flex-direction: column; overflow: hidden; }

.stripe { background: var(--gold); color: var(--navy-darkest); text-align: center; padding: 7px 24px; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; flex-shrink: 0; }

.head { background: var(--navy-darkest); color: var(--white); padding: 30px 44px 26px; position: relative; overflow: hidden; flex-shrink: 0; }
.head::before { content: ''; position: absolute; top: -120px; right: -100px; width: 500px; height: 500px; background: radial-gradient(ellipse at center, rgba(212,160,23,0.18) 0%, transparent 70%); pointer-events: none; }
.eyebrow { font-size: 9px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; position: relative; }
.company { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--gold-light); font-style: italic; margin-bottom: 4px; position: relative; }
.title { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; line-height: 1; letter-spacing: -0.02em; position: relative; }
.company-tag { margin-top: 6px; font-size: 10.5px; color: rgba(255,255,255,0.6); letter-spacing: 0.04em; position: relative; }

.meta-bar { background: var(--navy-dark); color: var(--white); display: grid; grid-template-columns: repeat(4, 1fr); padding: 14px 44px; gap: 14px; border-top: 1px solid rgba(212,160,23,0.18); position: relative; flex-shrink: 0; }
.meta-cell .k { font-size: 8px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
.meta-cell .v { font-size: 10px; color: rgba(255,255,255,0.92); line-height: 1.4; font-weight: 600; }

.body { padding: 26px 44px 30px; flex: 1; display: flex; flex-direction: column; gap: 20px; background: var(--white); }

.section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-dark); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.section-label::after { content: ''; flex: 1; height: 1px; background: rgba(168,128,15,0.3); }

.summary { background: var(--parchment); border-left: 3px solid var(--gold); border-radius: 0 5px 5px 0; padding: 14px 16px; }
.summary p { font-size: 11px; color: var(--ink-soft); line-height: 1.6; }

.list-block ul { list-style: none; padding: 0; }
.list-block li { font-size: 10.5px; color: var(--ink-soft); line-height: 1.5; padding: 5px 0 5px 16px; position: relative; border-bottom: 1px dotted rgba(31,63,125,0.18); }
.list-block li:last-child { border-bottom: none; }
.list-block li::before { content: '›'; position: absolute; left: 0; color: var(--gold); font-weight: 700; font-size: 13px; line-height: 1.2; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.perks-strip { background: var(--navy-dark); color: var(--white); border-radius: 6px; padding: 14px 18px; }
.perks-strip .label { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; }
.perks-strip ul { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 4px 18px; }
.perks-strip li { font-size: 10px; color: rgba(255,255,255,0.85); line-height: 1.45; padding-left: 14px; position: relative; }
.perks-strip li::before { content: '✦'; position: absolute; left: 0; color: var(--gold-light); font-size: 9px; top: 2px; }

.apply-strip { background: var(--sand); border: 2px solid var(--gold); border-radius: 6px; padding: 12px 18px; display: flex; align-items: center; gap: 14px; }
.apply-strip .label { font-family: 'Playfair Display', serif; font-size: 12px; font-style: italic; color: var(--navy-dark); flex: 1; }
.apply-strip .label strong { color: var(--gold-dark); font-style: normal; display: block; font-size: 13px; margin-bottom: 2px; letter-spacing: 0.04em; text-transform: uppercase; }
.apply-strip img { width: 50px; height: 50px; border-radius: 4px; object-fit: contain; background: var(--white); padding: 3px; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }

.foot { background: var(--navy-dark); color: var(--white); padding: 12px 44px; flex-shrink: 0; display: flex; align-items: center; gap: 14px; border-top: 3px solid var(--gold); }
.foot-tag { flex: 1; }
.foot-tag .t { font-family: 'Playfair Display', serif; font-size: 11px; font-style: italic; color: var(--gold-light); margin-bottom: 2px; }
.foot-tag .g { font-size: 9.5px; font-weight: 700; letter-spacing: 0.04em; }
.foot-tag .c { font-size: 8px; color: rgba(255,255,255,0.45); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; }
.foot img { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; }
"""


TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=900">
  <title>{title} — {company}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>{css}</style>
</head>
<body>
  <div class="sheet">

    <div class="stripe">Job Posting · Sample · Scratch Match · {ref}</div>

    <div class="head">
      <div class="eyebrow">{posted}</div>
      <div class="company">{company}</div>
      <h1 class="title">{title}</h1>
      <div class="company-tag">{company_tag}</div>
    </div>

    <div class="meta-bar">
      <div class="meta-cell"><div class="k">Location</div><div class="v">{location}</div></div>
      <div class="meta-cell"><div class="k">Type</div><div class="v">{type}</div></div>
      <div class="meta-cell"><div class="k">Salary</div><div class="v">{salary}</div></div>
      <div class="meta-cell"><div class="k">Reference</div><div class="v">{ref}</div></div>
    </div>

    <div class="body">

      <div class="summary">
        <div class="section-label">About the Role</div>
        <p>{summary}</p>
      </div>

      <div class="two-col">
        <div class="list-block">
          <div class="section-label">Responsibilities</div>
          <ul>{responsibilities}</ul>
        </div>
        <div class="list-block">
          <div class="section-label">What We're Looking For</div>
          <ul>{requirements}</ul>
        </div>
      </div>

      <div class="list-block">
        <div class="section-label">Nice to Have</div>
        <ul>{nice_to_have}</ul>
      </div>

      <div class="perks-strip">
        <div class="label">Perks &amp; Benefits</div>
        <ul>{perks}</ul>
      </div>

      <div class="apply-strip">
        <div class="label"><strong>How to Apply</strong>{apply}</div>
        <img src="{assets}/QR_code.png" alt="Apply via Scratch Match">
      </div>

    </div>

    <div class="foot">
      <div class="foot-tag">
        <div class="t">Local. Private. Built for Cebu.</div>
        <div class="g">Sample posting · Scratch Match · Group Sigma · CIS 2205</div>
        <div class="c">University of San Carlos · 2026</div>
      </div>
      <img src="{assets}/SDG_8_Logo.png" alt="UN SDG 8">
    </div>

  </div>
</body>
</html>
"""


def render(j: dict) -> str:
    def li_list(items):
        return "".join(f"<li>{i}</li>" for i in items)
    return TEMPLATE.format(
        css=CSS,
        company=j["company"],
        company_tag=j["company_tag"],
        title=j["title"],
        ref=j["ref"],
        posted=j["posted"],
        location=j["location"],
        type=j["type"],
        salary=j["salary"],
        summary=j["summary"],
        responsibilities=li_list(j["responsibilities"]),
        requirements=li_list(j["requirements"]),
        nice_to_have=li_list(j["nice_to_have"]),
        perks=li_list(j["perks"]),
        apply=j["apply"],
        assets=ASSETS,
    )


def main() -> None:
    for j in JOBS:
        out = HERE / f"job_{j['slug']}.html"
        out.write_text(render(j), encoding="utf-8")
        print(f"wrote {out.name}")


if __name__ == "__main__":
    main()
