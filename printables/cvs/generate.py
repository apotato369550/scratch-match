"""
Generate sample seeker CVs as A4 documents in Scratch Match style.

Each output is a self-contained HTML file. Open in a browser, then
File -> Print -> Save as PDF (A4 portrait, background graphics ON).

Usage:
    python generate.py
"""

from pathlib import Path

HERE = Path(__file__).resolve().parent
ASSETS = "../assets"

CVS = [
    {
        "slug": "mia_reyes",
        "name": "Mia Reyes",
        "headline": "Junior Full-Stack Developer",
        "tagline": "Recent USC graduate. Comfortable with React, Python, and shipping small things end-to-end.",
        "contact": [
            ("Location", "Talamban, Cebu City"),
            ("Email", "mia.reyes.dev@gmail.com"),
            ("Phone", "+63 917 555 0142"),
            ("GitHub", "github.com/miareyes-dev"),
        ],
        "summary": (
            "BS Information Systems graduate looking for a first full-time engineering role in Cebu. "
            "Two years of side-project experience across React, Next.js, and Django. Briefly interned "
            "as a junior frontend dev at a local BPO. Happiest building features users actually touch."
        ),
        "experience": [
            {
                "title": "Frontend Intern",
                "company": "Bayhive BPO Solutions",
                "location": "Cebu IT Park",
                "when": "Jun 2025 – Aug 2025",
                "bullets": [
                    "Shipped four customer-facing pages in their internal CRM using React and Tailwind.",
                    "Cut average ticket-form load time by 38 percent by replacing legacy modals.",
                    "Owned the on-call rotation for the frontend during a 2-week senior leave.",
                ],
            },
            {
                "title": "Freelance Developer",
                "company": "Self-employed",
                "location": "Cebu City (remote)",
                "when": "2024 – Present",
                "bullets": [
                    "Built a booking site for a local barbershop chain (Next.js, SQLite).",
                    "Maintained a Discord bot used by ~600 students for class scheduling.",
                ],
            },
        ],
        "education": [
            {
                "school": "University of San Carlos",
                "degree": "BS Information Systems",
                "when": "2022 – 2026",
                "note": "Cum Laude · Capstone: AI-assisted job matching pipeline.",
            },
        ],
        "skills": [
            "React", "Next.js", "TypeScript", "Python",
            "Django", "Tailwind", "SQLite", "Git",
            "REST APIs", "Linux basics",
        ],
        "certifications": [
            "Meta Front-End Developer (Coursera, 2025)",
            "AWS Cloud Practitioner Foundations (2024)",
        ],
        "interests": "Indie games, mechanical keyboards, coastal cleanups in Mactan.",
    },
    {
        "slug": "joel_alburo",
        "name": "Joel Alburo",
        "headline": "Senior Backend Engineer · 9 yrs",
        "tagline": "Distributed systems, payments, and the unglamorous infra that keeps things running.",
        "contact": [
            ("Location", "Banawa, Cebu City"),
            ("Email", "joel.alburo@protonmail.com"),
            ("Phone", "+63 917 555 0388"),
            ("LinkedIn", "linkedin.com/in/joelalburo"),
        ],
        "summary": (
            "Backend engineer with nine years of experience building payments and messaging systems "
            "at scale. Recently led a 4-person platform team. Returning to Cebu after 5 years in "
            "Singapore. Looking for a senior IC role with clear scope, ideally at a Cebu-based product company."
        ),
        "experience": [
            {
                "title": "Senior Backend Engineer",
                "company": "Pebble Pay (Singapore)",
                "location": "Singapore",
                "when": "Mar 2021 – Apr 2026",
                "bullets": [
                    "Owned the merchant settlement service, ~12M transactions per day, 99.97 percent uptime.",
                    "Migrated the legacy Java monolith's payouts module to Go microservices over 18 months.",
                    "Mentored three juniors who have since been promoted to mid-level.",
                ],
            },
            {
                "title": "Backend Engineer",
                "company": "Vivolt Labs",
                "location": "Cebu City",
                "when": "Jul 2017 – Feb 2021",
                "bullets": [
                    "Built the messaging gateway used by all 14 of the company's customer-facing products.",
                    "Reduced infrastructure spend by 22 percent by consolidating Redis clusters.",
                ],
            },
        ],
        "education": [
            {
                "school": "University of the Philippines · Cebu",
                "degree": "BS Computer Science",
                "when": "2013 – 2017",
                "note": "Magna Cum Laude.",
            },
        ],
        "skills": [
            "Go", "Java", "Python", "PostgreSQL", "Redis",
            "Kafka", "Kubernetes", "AWS", "Terraform",
            "System design", "Mentoring",
        ],
        "certifications": [
            "AWS Solutions Architect — Professional (2023)",
            "Certified Kubernetes Administrator (2022)",
        ],
        "interests": "Trail running, lechon scoring, restoring old film cameras.",
    },
    {
        "slug": "katrina_lim",
        "name": "Katrina Lim",
        "headline": "Product Designer · 6 yrs",
        "tagline": "End-to-end product design with a soft spot for clear typography and unloved admin tools.",
        "contact": [
            ("Location", "Lahug, Cebu City"),
            ("Email", "kat.lim.design@gmail.com"),
            ("Phone", "+63 917 555 0921"),
            ("Portfolio", "katlim.design"),
        ],
        "summary": (
            "Product designer with six years across SaaS, fintech, and a brief stint at a local non-profit. "
            "Comfortable owning a feature from research to handoff. Looking for a senior IC role at a "
            "product company where design and engineering sit in the same room."
        ),
        "experience": [
            {
                "title": "Senior Product Designer",
                "company": "Lakat HR (Manila, remote)",
                "location": "Remote · Cebu",
                "when": "Jan 2023 – Apr 2026",
                "bullets": [
                    "Led the redesign of the candidate-pipeline screen, lifting weekly active recruiters by 31 percent.",
                    "Established the design system that the engineering team still uses unchanged.",
                    "Ran weekly research calls with users from Cebu, Davao, and Iloilo SMBs.",
                ],
            },
            {
                "title": "Product Designer",
                "company": "Reefspace",
                "location": "Cebu City",
                "when": "Aug 2020 – Dec 2022",
                "bullets": [
                    "Designed the customer onboarding flow for a marine-tourism booking platform.",
                    "Shipped the first mobile-friendly dashboard, lifting mobile retention by 18 percent.",
                ],
            },
        ],
        "education": [
            {
                "school": "University of San Carlos",
                "degree": "BS Architecture",
                "when": "2014 – 2019",
                "note": "Pivoted to product design after graduation.",
            },
        ],
        "skills": [
            "Figma", "Design systems", "User research", "Prototyping",
            "Information architecture", "Accessibility",
            "HTML/CSS basics", "Cross-functional collab",
        ],
        "certifications": [
            "NN/g UX Master Certificate (2024)",
        ],
        "interests": "Letterpress posters, local theatre, weekend ferry rides.",
    },
    {
        "slug": "lola_betchay",
        "name": "Beatriz Velez",
        "headline": "Returning to Work · Bookkeeping & Admin",
        "tagline": "30+ years in finance and admin. Seeking a part-time role under the city's senior employment program.",
        "contact": [
            ("Location", "Mabolo, Cebu City"),
            ("Email", "lola.betchay@gmail.com"),
            ("Phone", "+63 917 555 0664"),
            ("Mode", "Part-time, on-site preferred"),
        ],
        "summary": (
            "Recently retired bookkeeper with three decades of experience in family-business and SME finance. "
            "Joining the Cebu City Senior Citizens Employment 2026 program. Looking for two-to-three day-a-week "
            "work in light bookkeeping, records, or front-desk admin. Patient with clients, allergic to clutter."
        ),
        "experience": [
            {
                "title": "Senior Bookkeeper",
                "company": "Velez & Sons Trading",
                "location": "Cebu City",
                "when": "1998 – 2025",
                "bullets": [
                    "Owned the books for a family hardware-supply business through 27 years of growth.",
                    "Trained two of her grandchildren on the basics of small-business accounting.",
                    "Kept paper and digital ledgers in parallel through three software migrations.",
                ],
            },
            {
                "title": "Office Clerk",
                "company": "Cebu Diocesan Schools",
                "location": "Cebu City",
                "when": "1989 – 1998",
                "bullets": [
                    "Handled enrolment records and payment reconciliation for ~600 students per year.",
                ],
            },
        ],
        "education": [
            {
                "school": "Cebu Institute of Technology",
                "degree": "BS Commerce, major in Accounting",
                "when": "1985 – 1989",
                "note": "",
            },
        ],
        "skills": [
            "Bookkeeping", "QuickBooks (basic)", "Records management",
            "Cash handling", "Customer-facing admin",
            "Excel basics", "Reliable handwriting",
        ],
        "certifications": [
            "Cebu City Senior Citizens Employment Program · 2026 cohort",
        ],
        "interests": "Hymn choir, garden vegetables, teaching grandchildren to count change.",
    },
    {
        "slug": "rico_pacaldo",
        "name": "Rico Pacaldo",
        "headline": "Marketing Specialist · 3 yrs",
        "tagline": "Content, paid social, and the analytics dashboards nobody else wants to read.",
        "contact": [
            ("Location", "Mandaue City",),
            ("Email", "rico.pacaldo@outlook.com"),
            ("Phone", "+63 917 555 0207"),
            ("Portfolio", "ricopacaldo.com"),
        ],
        "summary": (
            "Marketing generalist with three years across B2B SaaS and a Cebu-based food brand. "
            "Comfortable owning a campaign from brief to retrospective. Looking for a mid-level role on "
            "a small marketing team where the work is end-to-end, not siloed."
        ),
        "experience": [
            {
                "title": "Marketing Specialist",
                "company": "Saltrove Foods",
                "location": "Mandaue · Cebu",
                "when": "Aug 2024 – Apr 2026",
                "bullets": [
                    "Grew the brand's IG following from 4k to 31k in 14 months without paid spend on Reels.",
                    "Owned the monthly email program: 28 percent open rate, 4.1 percent click-through.",
                    "Negotiated the brand's first three local-creator partnerships in Cebu and Bohol.",
                ],
            },
            {
                "title": "Marketing Associate",
                "company": "Halcyon Cloud (Cebu)",
                "location": "Cebu IT Park",
                "when": "Mar 2023 – Jul 2024",
                "bullets": [
                    "Wrote and shipped the company's first content calendar, ~3 posts per week.",
                    "Built the marketing-attribution dashboard that the sales team still uses.",
                ],
            },
        ],
        "education": [
            {
                "school": "University of San Jose-Recoletos",
                "degree": "BA Communication",
                "when": "2018 – 2022",
                "note": "",
            },
        ],
        "skills": [
            "Content strategy", "Copywriting", "Meta Ads",
            "Google Analytics 4", "Email automation",
            "SEO basics", "Light Figma", "Notion",
        ],
        "certifications": [
            "Google Analytics 4 Certified (2024)",
            "HubSpot Inbound Marketing (2023)",
        ],
        "interests": "Cebuano food history, indie zines, riding the Mactan bridge at sunrise.",
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
  .sheet { width: 8.27in !important; height: 11.69in !important; box-shadow: none !important; }
}
.sheet { width: 8.27in; min-height: 11.69in; background: var(--white); font-family: 'Inter', system-ui, sans-serif; display: grid; grid-template-columns: 2.5in 1fr; overflow: hidden; }

/* Sidebar */
.side { background: var(--navy-darkest); color: var(--white); padding: 36px 22px 28px; position: relative; overflow: hidden; }
.side::before { content: ''; position: absolute; top: -100px; left: -50px; width: 360px; height: 360px; background: radial-gradient(ellipse at center, rgba(212,160,23,0.16) 0%, transparent 70%); pointer-events: none; }
.avatar { width: 96px; height: 96px; border-radius: 50%; background: var(--gold); color: var(--navy-darkest); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 44px; font-weight: 900; margin: 0 auto 18px; box-shadow: 0 6px 18px rgba(0,0,0,0.45); position: relative; }

.side-section { margin-top: 22px; position: relative; }
.side-label { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(212,160,23,0.3); }
.contact-row { display: flex; flex-direction: column; padding: 4px 0; }
.contact-row .k { font-size: 8px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.45); }
.contact-row .v { font-size: 10px; color: rgba(255,255,255,0.92); word-break: break-word; line-height: 1.4; }

.skills-list { display: flex; flex-wrap: wrap; gap: 4px; }
.skills-list .pill { font-size: 9px; font-weight: 600; background: rgba(255,255,255,0.08); border: 1px solid rgba(212,160,23,0.25); border-radius: 3px; padding: 3px 7px; color: rgba(255,255,255,0.88); }

.cert-list { list-style: none; padding: 0; }
.cert-list li { font-size: 9.5px; color: rgba(255,255,255,0.78); line-height: 1.4; padding: 4px 0 4px 12px; position: relative; border-bottom: 1px dotted rgba(255,255,255,0.12); }
.cert-list li:last-child { border-bottom: none; }
.cert-list li::before { content: '›'; position: absolute; left: 0; color: var(--gold); font-weight: 700; }

.interests { font-size: 9.5px; color: rgba(255,255,255,0.78); line-height: 1.5; font-style: italic; }

/* Main */
.main { padding: 36px 32px 28px; display: flex; flex-direction: column; gap: 18px; background: var(--white); }
.title-block { border-bottom: 3px solid var(--gold); padding-bottom: 14px; }
.eyebrow { font-size: 9px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--gold-dark); margin-bottom: 6px; }
.name { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 900; line-height: 1; color: var(--navy-darkest); letter-spacing: -0.02em; }
.headline { margin-top: 6px; font-family: 'Playfair Display', serif; font-size: 14px; font-style: italic; color: var(--gold-dark); }
.tagline { margin-top: 6px; font-size: 10.5px; color: var(--ink-soft); line-height: 1.5; }

.section-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-dark); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.section-label::after { content: ''; flex: 1; height: 1px; background: rgba(168,128,15,0.3); }

.summary p { font-size: 10.5px; color: var(--ink-soft); line-height: 1.6; }

.exp-item { padding: 10px 0; border-bottom: 1px dotted rgba(31,63,125,0.2); }
.exp-item:last-child { border-bottom: none; }
.exp-head { display: flex; justify-content: space-between; align-items: baseline; gap: 14px; margin-bottom: 2px; }
.exp-title { font-size: 12px; font-weight: 800; color: var(--navy-dark); letter-spacing: -0.01em; }
.exp-when { font-size: 9px; font-weight: 700; color: var(--gold-dark); letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0; }
.exp-co { font-size: 10.5px; color: var(--navy-mid); font-style: italic; margin-bottom: 6px; }
.exp-bullets { list-style: none; padding: 0; }
.exp-bullets li { font-size: 10px; color: var(--ink-soft); line-height: 1.5; padding-left: 12px; position: relative; margin-bottom: 2px; }
.exp-bullets li::before { content: '›'; position: absolute; left: 0; color: var(--gold); font-weight: 700; }

.edu-item { padding: 6px 0; border-bottom: 1px dotted rgba(31,63,125,0.2); }
.edu-item:last-child { border-bottom: none; }
.edu-head { display: flex; justify-content: space-between; gap: 14px; align-items: baseline; }
.edu-school { font-size: 11px; font-weight: 800; color: var(--navy-dark); }
.edu-when { font-size: 9px; color: var(--gold-dark); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.edu-degree { font-size: 10px; color: var(--ink-soft); font-style: italic; }
.edu-note { font-size: 9.5px; color: var(--ink-soft); margin-top: 2px; }

.foot { margin-top: auto; padding-top: 14px; border-top: 1px solid rgba(31,63,125,0.15); display: flex; align-items: center; gap: 10px; }
.foot-tag { flex: 1; font-size: 8.5px; color: rgba(31,63,125,0.55); letter-spacing: 0.1em; text-transform: uppercase; }
.foot-tag strong { color: var(--gold-dark); }
.foot img { width: 30px; height: 30px; border-radius: 3px; object-fit: cover; opacity: 0.85; }
"""


def initials(name: str) -> str:
    parts = [p for p in name.split() if p]
    return (parts[0][0] + parts[-1][0]).upper() if len(parts) >= 2 else parts[0][:2].upper()


TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=900">
  <title>{name} — CV</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>{css}</style>
</head>
<body>
  <div class="sheet">

    <aside class="side">
      <div class="avatar">{initials}</div>

      <div class="side-section">
        <div class="side-label">Contact</div>
        {contact_rows}
      </div>

      <div class="side-section">
        <div class="side-label">Skills</div>
        <div class="skills-list">{skill_pills}</div>
      </div>

      <div class="side-section">
        <div class="side-label">Certifications</div>
        <ul class="cert-list">{cert_list}</ul>
      </div>

      <div class="side-section">
        <div class="side-label">Interests</div>
        <p class="interests">{interests}</p>
      </div>
    </aside>

    <main class="main">

      <div class="title-block">
        <div class="eyebrow">Curriculum Vitae · Sample · Scratch Match</div>
        <h1 class="name">{name}</h1>
        <div class="headline">{headline}</div>
        <p class="tagline">{tagline}</p>
      </div>

      <div class="summary">
        <div class="section-label">Summary</div>
        <p>{summary}</p>
      </div>

      <div>
        <div class="section-label">Experience</div>
        {experience_blocks}
      </div>

      <div>
        <div class="section-label">Education</div>
        {education_blocks}
      </div>

      <div class="foot">
        <div class="foot-tag"><strong>Sample CV</strong> · for Scratch Match prototype demo · Group Sigma · CIS 2205</div>
        <img src="{assets}/SDG_8_Logo.png" alt="UN SDG 8">
      </div>

    </main>

  </div>
</body>
</html>
"""


def render(cv: dict) -> str:
    contact_rows = "\n        ".join(
        f'<div class="contact-row"><div class="k">{k}</div><div class="v">{v}</div></div>'
        for k, v in cv["contact"]
    )
    skill_pills = "".join(f'<span class="pill">{s}</span>' for s in cv["skills"])
    cert_list = "".join(f"<li>{c}</li>" for c in cv["certifications"])

    exp_blocks = []
    for x in cv["experience"]:
        bullets = "".join(f"<li>{b}</li>" for b in x["bullets"])
        exp_blocks.append(
            f'<div class="exp-item">'
            f'<div class="exp-head"><div class="exp-title">{x["title"]}</div><div class="exp-when">{x["when"]}</div></div>'
            f'<div class="exp-co">{x["company"]} · {x["location"]}</div>'
            f'<ul class="exp-bullets">{bullets}</ul>'
            f"</div>"
        )
    edu_blocks = []
    for e in cv["education"]:
        note_html = f'<div class="edu-note">{e["note"]}</div>' if e.get("note") else ""
        edu_blocks.append(
            f'<div class="edu-item">'
            f'<div class="edu-head"><div class="edu-school">{e["school"]}</div><div class="edu-when">{e["when"]}</div></div>'
            f'<div class="edu-degree">{e["degree"]}</div>'
            f"{note_html}"
            f"</div>"
        )

    return TEMPLATE.format(
        css=CSS,
        name=cv["name"],
        initials=initials(cv["name"]),
        headline=cv["headline"],
        tagline=cv["tagline"],
        summary=cv["summary"],
        contact_rows=contact_rows,
        skill_pills=skill_pills,
        cert_list=cert_list,
        interests=cv["interests"],
        experience_blocks="\n        ".join(exp_blocks),
        education_blocks="\n        ".join(edu_blocks),
        assets=ASSETS,
    )


def main() -> None:
    for cv in CVS:
        out = HERE / f"cv_{cv['slug']}.html"
        out.write_text(render(cv), encoding="utf-8")
        print(f"wrote {out.name}")


if __name__ == "__main__":
    main()
