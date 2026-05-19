"""
Generate one A4 persona profile sheet per persona, in Scratch Match style.

Each output is a self-contained HTML file. Open in a browser, then
File -> Print -> Save as PDF (A4 portrait, background graphics ON).

Usage:
    python generate.py
"""

from pathlib import Path

HERE = Path(__file__).resolve().parent
ASSETS = "../assets"  # paths inside the rendered HTML

PERSONAS = [
    {
        "slug": "job_seeker",
        "label": "Persona 01 · The Job Seeker",
        "name": "Mia Reyes",
        "role": "Job Seeker",
        "tagline": "Recent grad, looking for the right first job in Cebu.",
        "mark": "◇",
        "demographics": [
            ("Age", "23"),
            ("Location", "Talamban, Cebu City"),
            ("Education", "BS Information Systems, USC (2026)"),
            ("Currently", "Freelancing while applying full-time"),
            ("Tech Comfort", "High — phone-first, social-savvy"),
        ],
        "background": (
            "Mia graduated last semester near the top of her class. She has built two side projects "
            "and interned briefly at a Cebu-based BPO, but the openings she sees online either ask for "
            "five years of experience for a junior role or sound nothing like the work she actually did. "
            "She has applied to over forty companies in three months and heard back from four."
        ),
        "want": "Upload my CV once, see openings that actually fit my skills, and ask an AI advisor to tailor my résumé to a specific posting.",
        "goals": [
            "Land a role that uses what she studied, not just any role.",
            "Stop tailoring her CV from scratch for every application.",
            "Stay in Cebu near family — relocation is a last resort.",
        ],
        "frustrations": [
            "Generic job boards rank by keyword, not by what she can actually do.",
            "Most postings hide salary ranges, wasting her time on misfits.",
            "No clear feedback when she gets rejected — just silence.",
        ],
        "image": "home.png",
        "image_caption": "Seeker Home Dashboard",
    },
    {
        "slug": "employer",
        "label": "Persona 02 · The Employer",
        "name": "Ronnel Tan",
        "role": "Employer",
        "tagline": "HR lead at a growing Cebu software studio.",
        "mark": "◆",
        "demographics": [
            ("Age", "38"),
            ("Location", "Cebu IT Park"),
            ("Company", "Sinulog Studios · 42 employees"),
            ("Role", "Head of People & Talent"),
            ("Tech Comfort", "Comfortable with ATS tools, dashboards"),
        ],
        "background": (
            "Ronnel hires roughly twelve developers and designers a year. His current pipeline is a "
            "mix of LinkedIn, Facebook groups, and word-of-mouth. He spends entire afternoons sifting "
            "through CVs that match the job title but miss the actual stack. He has lost good local "
            "candidates to manila-based recruiters who simply called first."
        ),
        "want": "Post a role and get a ranked shortlist filtered by real fit instead of keyword sprays, so I can reach Cebu-based talent first.",
        "goals": [
            "Cut time-to-shortlist from days to hours.",
            "Source Cebu-resident candidates who will actually stay.",
            "Stop relying on screening calls just to filter the obviously wrong fits.",
        ],
        "frustrations": [
            "ATS tools are priced for hundred-person teams.",
            "Keyword filters reject good non-traditional candidates.",
            "Foreign job boards don't surface local talent at all.",
        ],
        "image": "employers.png",
        "image_caption": "Employer Shortlist View",
    },
    {
        "slug": "government",
        "label": "Persona 03 · The Government Sponsor",
        "name": "Atty. Liza Mendoza",
        "role": "Government (PEO Cebu City)",
        "tagline": "Public Employment Office officer, drives the city's Labor Day initiatives.",
        "mark": "▲",
        "demographics": [
            ("Age", "47"),
            ("Office", "PEO · Cebu City Hall"),
            ("Mandate", "Local employment facilitation"),
            ("Constraint", "On-prem · data must stay in Cebu"),
            ("Tech Comfort", "Reads dashboards, delegates the tooling"),
        ],
        "background": (
            "Liza runs the city's job fairs and livelihood programs, including the new 2026 Senior "
            "Citizens Employment track. She sees Scratch Match as the missing year-round counterpart "
            "to the once-a-quarter physical events. Her two non-negotiables: data sovereignty and "
            "auditability. No foreign cloud, no opaque algorithms."
        ),
        "want": "Host the service for residents on-prem, own the data, protect privacy, and report on real labor outcomes.",
        "goals": [
            "Turn one-day job fairs into a continuous matching service.",
            "Surface inclusive populations: seniors, PWDs, returning OFWs.",
            "Produce defensible labor-market data for council briefings.",
        ],
        "frustrations": [
            "SaaS vendors want her residents' CVs on overseas servers.",
            "Existing tools cannot prove what was matched and why.",
            "Reporting today is manual, slow, and behind the news cycle.",
        ],
        "image": "cebu_city_logo.png",
        "image_caption": "Cebu City Government",
    },
    {
        "slug": "developer",
        "label": "Persona 04 · The Developer",
        "name": "Andre Yap",
        "role": "Developer",
        "tagline": "Student-engineer maintaining Scratch Match end-to-end.",
        "mark": "⌬",
        "demographics": [
            ("Age", "21"),
            ("Affiliation", "Group Sigma · CIS 2205, USC"),
            ("Stack", "Next.js · SQLite · Qdrant · Ollama"),
            ("Environment", "Local, offline-capable, no cloud keys"),
            ("Tech Comfort", "Builds, deploys, and debugs the system"),
        ],
        "background": (
            "Andre is one of the student engineers behind Scratch Match. He cares about the matcher "
            "actually being usable on commodity hardware the city can buy outright. Every dependency "
            "is open-source. Every model runs locally. The architecture is intentionally boring so a "
            "future maintainer (probably another student) can pick it up in a weekend."
        ),
        "want": "Maintain and tune the matcher engine, keep the system offline and auditable, and ship updates without any cloud dependencies.",
        "goals": [
            "Keep the deployment story to a single docker compose up.",
            "Make the matching logic legible to a junior who joins later.",
            "Ship improvements without needing an internet connection.",
        ],
        "frustrations": [
            "Most modern AI tooling assumes a paid cloud account.",
            "Vendor lock-in disguised as developer convenience.",
            "Tutorials that hide the moving parts behind one-line abstractions.",
        ],
        "image": "prototype.jpg",
        "image_caption": "System Sketch",
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
.sheet { width: 8.27in; height: 11.69in; background: var(--white); font-family: 'Inter', system-ui, sans-serif; display: flex; flex-direction: column; overflow: hidden; }

.stripe { background: var(--gold); color: var(--navy-darkest); text-align: center; padding: 7px 24px; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; flex-shrink: 0; }

.hero { background: var(--navy-darkest); color: var(--white); padding: 28px 40px 24px; display: flex; align-items: center; gap: 22px; flex-shrink: 0; position: relative; overflow: hidden; }
.hero::before { content: ''; position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 600px; height: 500px; background: radial-gradient(ellipse at center, rgba(212,160,23,0.18) 0%, transparent 70%); pointer-events: none; }
.avatar { width: 110px; height: 110px; border-radius: 50%; background: var(--gold); color: var(--navy-darkest); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 56px; font-weight: 900; flex-shrink: 0; box-shadow: 0 6px 20px rgba(0,0,0,0.4); position: relative; }
.avatar .badge { position: absolute; bottom: -6px; right: -6px; width: 36px; height: 36px; border-radius: 50%; background: var(--navy-darkest); color: var(--gold-light); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 900; border: 2px solid var(--gold); }
.hero-text { flex: 1; position: relative; }
.hero-eyebrow { font-size: 9px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--gold); margin-bottom: 7px; }
.hero-name { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 900; line-height: 1; letter-spacing: -0.02em; }
.hero-role { margin-top: 6px; font-family: 'Playfair Display', serif; font-size: 16px; font-style: italic; color: var(--gold-light); }
.hero-tag { margin-top: 8px; font-size: 11px; color: rgba(255,255,255,0.72); line-height: 1.5; max-width: 380px; }

.body { padding: 24px 40px 24px; flex: 1; display: flex; flex-direction: column; gap: 18px; }

.section-label { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-dark); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.section-label::after { content: ''; flex: 1; height: 1px; background: rgba(168,128,15,0.28); }

.demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; }
.demo-row { display: flex; gap: 10px; padding: 5px 0; border-bottom: 1px dotted rgba(31,63,125,0.22); font-size: 10.5px; }
.demo-row .k { color: var(--gold-dark); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; font-size: 8.5px; min-width: 78px; padding-top: 2px; }
.demo-row .v { color: var(--ink-soft); flex: 1; line-height: 1.4; }

.background-block { background: var(--parchment); border-left: 3px solid var(--gold); border-radius: 0 5px 5px 0; padding: 14px 16px; }
.background-block p { font-size: 11px; color: var(--ink-soft); line-height: 1.6; }

.want-block { background: var(--navy-dark); color: var(--white); border-radius: 6px; padding: 16px 20px; position: relative; }
.want-block::before { content: '"'; position: absolute; top: 4px; left: 12px; font-family: 'Playfair Display', serif; font-size: 60px; color: var(--gold); line-height: 1; opacity: 0.35; }
.want-block .label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); font-weight: 700; margin-bottom: 5px; padding-left: 32px; }
.want-block .text { font-family: 'Playfair Display', serif; font-size: 14px; font-style: italic; line-height: 1.45; color: var(--gold-light); padding-left: 32px; }

.gf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.gf-col h4 { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700; color: var(--navy-dark); margin-bottom: 8px; }
.gf-col h4 em { color: var(--gold-dark); font-style: italic; }
.gf-col ul { list-style: none; padding: 0; }
.gf-col li { font-size: 10px; color: var(--ink-soft); line-height: 1.45; padding: 4px 0 4px 14px; position: relative; border-bottom: 1px dotted rgba(31,63,125,0.18); }
.gf-col li::before { content: '›'; position: absolute; left: 0; color: var(--gold); font-weight: 700; }
.gf-col li:last-child { border-bottom: none; }

.image-strip { display: flex; align-items: center; gap: 12px; background: var(--parchment); padding: 10px 14px; border-radius: 6px; border: 1px solid rgba(31,63,125,0.15); }
.image-strip img { width: 72px; height: 72px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(31,63,125,0.18); flex-shrink: 0; background: var(--white); }
.image-strip .cap { font-size: 9px; color: var(--ink-soft); line-height: 1.45; }
.image-strip .cap strong { display: block; font-family: 'Playfair Display', serif; font-style: italic; font-size: 12px; color: var(--navy-dark); margin-bottom: 2px; }

.footer { background: var(--navy-dark); color: var(--white); padding: 12px 40px; flex-shrink: 0; display: flex; align-items: center; gap: 14px; border-top: 3px solid var(--gold); }
.footer-tag { flex: 1; }
.footer-tag .t { font-family: 'Playfair Display', serif; font-size: 11px; font-style: italic; color: var(--gold-light); margin-bottom: 2px; }
.footer-tag .g { font-size: 9.5px; font-weight: 700; letter-spacing: 0.04em; }
.footer-tag .c { font-size: 8px; color: rgba(255,255,255,0.45); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; }
.footer img { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; }
"""


def initials(name: str) -> str:
    parts = [p for p in name.replace(".", "").split() if p and p[0].isalpha()]
    return (parts[0][0] + parts[-1][0]).upper() if len(parts) >= 2 else parts[0][:2].upper()


TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=900">
  <title>Scratch Match — Persona · {name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>{css}</style>
</head>
<body>
  <div class="sheet">

    <div class="stripe">{label}</div>

    <div class="hero">
      <div class="avatar">{initials}<div class="badge">{mark}</div></div>
      <div class="hero-text">
        <div class="hero-eyebrow">User Persona · Scratch Match</div>
        <div class="hero-name">{name}</div>
        <div class="hero-role">{role}</div>
        <p class="hero-tag">{tagline}</p>
      </div>
    </div>

    <div class="body">

      <div>
        <div class="section-label">Demographics</div>
        <div class="demo-grid">
          {demo_rows}
        </div>
      </div>

      <div>
        <div class="section-label">Background</div>
        <div class="background-block"><p>{background}</p></div>
      </div>

      <div class="want-block">
        <div class="label">Core Need</div>
        <div class="text">As a {role}, I want to {want_clean}</div>
      </div>

      <div class="gf-grid">
        <div class="gf-col">
          <h4><em>Goals</em></h4>
          <ul>{goals}</ul>
        </div>
        <div class="gf-col">
          <h4><em>Frustrations</em></h4>
          <ul>{frustrations}</ul>
        </div>
      </div>

      <div class="image-strip">
        <img src="{assets}/{image}" alt="{image_caption}">
        <div class="cap">
          <strong>{image_caption}</strong>
          A view from the Scratch Match prototype that this persona touches.
        </div>
      </div>

    </div>

    <div class="footer">
      <div class="footer-tag">
        <div class="t">Local. Private. Built for Cebu.</div>
        <div class="g">Group Sigma · CIS 2205 · University of San Carlos</div>
        <div class="c">Cebu City · 2026</div>
      </div>
      <img src="{assets}/SDG_8_Logo.png" alt="UN SDG 8">
    </div>

  </div>
</body>
</html>
"""


def render(p: dict) -> str:
    demo_rows = "\n          ".join(
        f'<div class="demo-row"><div class="k">{k}</div><div class="v">{v}</div></div>'
        for k, v in p["demographics"]
    )
    goals = "".join(f"<li>{g}</li>" for g in p["goals"])
    frustrations = "".join(f"<li>{f}</li>" for f in p["frustrations"])
    want_clean = p["want"]
    if want_clean.lower().startswith(f"as a {p['role'].lower()}"):
        want_clean = want_clean.split("want to ", 1)[-1]
    elif want_clean.lower().startswith(f"as {p['role'].lower()}"):
        want_clean = want_clean.split("want to ", 1)[-1]
    return TEMPLATE.format(
        css=CSS,
        label=p["label"],
        name=p["name"],
        initials=initials(p["name"]),
        mark=p["mark"],
        role=p["role"],
        tagline=p["tagline"],
        demo_rows=demo_rows,
        background=p["background"],
        want_clean=want_clean,
        goals=goals,
        frustrations=frustrations,
        image=p["image"],
        image_caption=p["image_caption"],
        assets=ASSETS,
    )


def main() -> None:
    for p in PERSONAS:
        out = HERE / f"persona_{p['slug']}.html"
        out.write_text(render(p), encoding="utf-8")
        print(f"wrote {out.name}")


if __name__ == "__main__":
    main()
