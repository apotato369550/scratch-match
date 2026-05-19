#!/usr/bin/env python3
"""
Scrum in Action - PDF Generator
CIS 2205 | Mobile Book Reservation System Sprint Exercise
Run: python scrum_in_action.py
Deps: pip install fpdf2 matplotlib pillow
"""

import os
import tempfile

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
from fpdf import FPDF
from fpdf.enums import XPos, YPos

# ════════════════════════════════════════════════════════════
# CONFIG - edit to match your group
# ════════════════════════════════════════════════════════════

GROUP = {
    "Product Owner":         "John Andre Yap",
    "Scrum Master":          "John Andre Yap",
    "Business Analyst":      "John Andre Yap",
    "Lead Developer/Tester": "John Andre Yap",
}
COURSE   = "CIS 2205"
SECTION  = "MW 1:30 PM - 3:00 PM"
DATE_STR = "April 15, 2026"
OUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "ScrumInAction_JohnAndreYap.pdf")

# ════════════════════════════════════════════════════════════
# FIXED ASSIGNMENT DATA
# ════════════════════════════════════════════════════════════

SPRINT_PTS   = [15, 20, 19]
AVG_VEL      = sum(SPRINT_PTS) / len(SPRINT_PTS)   # 18.0
REMAINING_SP = 60
SPRINTS_NEEDED = REMAINING_SP / AVG_VEL             # 3.33…

# ════════════════════════════════════════════════════════════
# CONTENT
# ════════════════════════════════════════════════════════════

BACKLOG = [
    {
        "rank": 1,
        "story": (
            "As a Job Seeker, I want to upload my CV with a specialization label "
            "so that the system can index it and use it for AI-powered job matching."
        ),
        "priority": "High",
        "rationale": (
            "Without CVs in the system there is nothing to match. "
            "This is the foundation every other feature builds on. It goes first."
        ),
    },
    {
        "rank": 2,
        "story": (
            "As a Job Seeker, I want to see a ranked list of matching jobs for my "
            "uploaded CV so that I can focus on the most relevant opportunities in Cebu."
        ),
        "priority": "High",
        "rationale": (
            "This is the core value proposition of the entire platform. "
            "It ships in the same sprint as CV upload."
        ),
    },
    {
        "rank": 3,
        "story": (
            "As an Employer, I want to post a job listing "
            "so that matching candidates can discover it through the AI system."
        ),
        "priority": "Medium",
        "rationale": (
            "Needed to populate the job pool, but the seeker side "
            "must be working first. Goes in the next sprint."
        ),
    },
    {
        "rank": 4,
        "story": (
            "As an Administrator, I want to view and moderate all CVs and job postings "
            "so that I can keep the platform data accurate and clean."
        ),
        "priority": "Low",
        "rationale": (
            "Admin tooling comes after the core seeker and employer flows are solid. "
            "Low frequency of use."
        ),
    },
]

SPRINT_TASKS = [
    {
        "story": "Story 1 - CV Upload and Indexing",
        "tasks": [
            ("Design the CV upload UI: file picker, specialization dropdown, and upload progress feedback", "Done"),
            ("Build the PDF text extraction pipeline using PyMuPDF", "Done"),
            ("Chunk extracted text and embed via nomic-embed-text, store vectors in Qdrant cv_chunks", "In Progress"),
            ("Save Qdrant point IDs in SQLite for reliable cleanup when a CV is deleted", "In Progress"),
        ],
    },
    {
        "story": "Story 2 - AI Job Matching",
        "tasks": [
            ("Design the match results UI: ranked job cards with similarity scores", "To-Do"),
            ("Build the matching endpoint: embed job requirements, query cv_chunks, aggregate top-3 scores", "To-Do"),
            ("Integrate match results into the seeker dashboard page", "In Progress"),
            ("Handle the empty state when no open jobs match the uploaded CV", "To-Do"),
        ],
    },
]

REFL_BENEFIT = (
    "One of the biggest advantages Scrum gives us over Waterfall is the ability "
    "to catch problems early, when they are still cheap to fix. In a Waterfall "
    "approach, we would have to build the entire platform - CV upload, the "
    "embedding pipeline, Qdrant integration, the matching algorithm, the employer "
    "portal, and the admin panel - before a single real user ever touched it. If "
    "the matching turned out to be inaccurate, or the CV upload flow was "
    "confusing, we would only find out at the very end.\n\n"
    "With Scrum, we deliver a working CV upload and job matching feature in just "
    "the first sprint. A job seeker in Cebu can try it, tell us what feels off, "
    "and we fix it in the next cycle. That kind of continuous feedback loop is "
    "exactly what a platform like Scratch Match needs, where the quality of the "
    "AI recommendations is something you can only really judge by using it."
)

REFL_STANDUP = (
    "The Daily Standup keeps the team aligned without turning into a full "
    "meeting. Each member answers three questions: What did I finish yesterday? "
    "What am I working on today? Is anything blocking me? The whole thing runs "
    "in under 15 minutes.\n\n"
    "During this sprint, it might sound like: one developer says they wrapped up "
    "the PDF extraction pipeline and are now wiring the chunking logic into the "
    "Qdrant collection with no blockers. Another mentions they have hit a wall on "
    "the score aggregation query because the team has not agreed on a ranking "
    "formula yet, and they need a quick sync before writing more code. That "
    "second update is exactly the kind of thing the Standup exists to surface - "
    "a blocker that would otherwise silently eat into the sprint without anyone "
    "noticing until it is too late."
)

REFL_RETRO = (
    "The Sprint Retrospective is a short meeting at the end of each sprint where "
    "the team asks three questions: What went well? What did not go well? What "
    "do we change next time? It is not a blame session - it is how the team "
    "actually improves from one sprint to the next.\n\n"
    "For this sprint, we would note that the CV upload feature shipped on time "
    "because we kept text extraction and embedding as separate, independent tasks "
    "and only integrated them at the end. That approach worked well and we would "
    "carry it forward. On the other hand, the Qdrant score aggregation needed a "
    "full redesign mid-sprint because we jumped into code before the team agreed "
    "on a ranking formula. Going into the next sprint, we would make it a rule to "
    "sketch any non-trivial algorithm on paper and get a team sign-off before "
    "anyone starts implementing it."
)

# ════════════════════════════════════════════════════════════
# PALETTE (hex and RGB tuples)
# ════════════════════════════════════════════════════════════

NAVY   = (14, 31, 63)
GOLD   = (212, 160, 23)
PARCH  = (247, 245, 238)
WHITE  = (255, 255, 255)
SOFT   = (31, 41, 55)
LGRAY  = (220, 225, 235)

NAVY_H  = "#0e1f3f"
GOLD_H  = "#d4a017"
GOLDI_H = "#e7c45a"
PARCH_H = "#f7f5ee"

# ════════════════════════════════════════════════════════════
# IMAGE GENERATORS
# ════════════════════════════════════════════════════════════

def make_velocity_chart() -> str:
    fig, ax = plt.subplots(figsize=(7, 3.4), facecolor="white")
    ax.set_facecolor("white")

    xs     = range(len(SPRINT_PTS))
    labels = [f"Sprint {i+1}" for i in xs]

    bars = ax.bar(xs, SPRINT_PTS, width=0.42, color=NAVY_H,
                  edgecolor="white", linewidth=1.0, zorder=3)

    for bar, val in zip(bars, SPRINT_PTS):
        ax.text(bar.get_x() + bar.get_width() / 2, val + 0.35,
                str(val), ha="center", va="bottom",
                fontsize=13, fontweight="bold", color=NAVY_H)

    ax.axhline(AVG_VEL, color=GOLD_H, linewidth=2.0,
               linestyle="--", zorder=4)
    ax.text(len(SPRINT_PTS) - 0.48, AVG_VEL + 0.55,
            f"Avg: {AVG_VEL:.0f} pts / sprint",
            ha="right", va="bottom", fontsize=10.5,
            color=GOLD_H, fontweight="semibold")

    ax.set_xticks(list(xs))
    ax.set_xticklabels(labels, fontsize=12)
    ax.set_yticks([0, 5, 10, 15, 20, 25])
    ax.set_ylabel("Story Points", fontsize=11, color="#444")
    ax.set_ylim(0, 26)
    ax.yaxis.grid(True, color="#ebebeb", linewidth=0.8, zorder=0)
    ax.set_axisbelow(True)
    for spine in ("top", "right"):
        ax.spines[spine].set_visible(False)
    for spine in ("left", "bottom"):
        ax.spines[spine].set_color("#cccccc")

    fig.tight_layout()
    tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    fig.savefig(tmp.name, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return tmp.name


def make_scrum_board() -> str:
    # Bucket tasks into columns
    buckets: dict[str, list[tuple[str, str]]] = {
        "To-Do": [], "In Progress": [], "Done": []
    }
    for s in SPRINT_TASKS:
        short = s["story"].split(" - ")[1]
        for task, status in s["tasks"]:
            buckets[status].append((short, task))

    order  = ["To-Do", "In Progress", "Done"]
    hdr_bg = {"To-Do": "#6c7a8d", "In Progress": "#a8800f", "Done": "#2e7d32"}
    col_bg = {"To-Do": "#eef2f8", "In Progress": "#fff8e8", "Done": "#e8f5e9"}

    fig, axes = plt.subplots(1, 3, figsize=(12, 4.5), facecolor="white")
    fig.subplots_adjust(wspace=0.06, left=0.01, right=0.99, top=0.86, bottom=0.02)
    fig.suptitle("Scratch Match Sprint Board - Currently In Progress",
                 fontsize=13, fontweight="bold", color=NAVY_H, y=0.99)

    for ax, col in zip(axes, order):
        ax.set_facecolor(col_bg[col])
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis("off")

        # Header
        ax.add_patch(mpatches.Rectangle((0, 0.88), 1, 0.12,
                                        color=hdr_bg[col], zorder=2, clip_on=False))
        ax.text(0.5, 0.94, col, ha="center", va="center",
                fontsize=12, fontweight="bold", color="white", zorder=3)

        card_h = 0.155
        gap    = 0.030
        y0     = 0.83

        for i, (story, task) in enumerate(buckets[col]):
            y = y0 - i * (card_h + gap)
            if y - card_h < 0.02:
                break

            ax.add_patch(FancyBboxPatch(
                (0.04, y - card_h), 0.92, card_h,
                boxstyle="round,pad=0.01",
                facecolor="white", edgecolor="#cccccc",
                linewidth=0.7, zorder=2
            ))

            ax.text(0.08, y - 0.022, story, ha="left", va="top",
                    fontsize=6.0, color="#999999", style="italic", zorder=3)

            # Wrap task text
            words, line, lines = task.split(), [], []
            for w in words:
                if len(" ".join(line + [w])) > 36:
                    lines.append(" ".join(line))
                    line = [w]
                else:
                    line.append(w)
            if line:
                lines.append(" ".join(line))

            ax.text(0.08, y - 0.052, "\n".join(lines[:2]),
                    ha="left", va="top",
                    fontsize=7.5, color="#1a1a1a",
                    zorder=3, multialignment="left")

    tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    fig.savefig(tmp.name, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return tmp.name


# ════════════════════════════════════════════════════════════
# PDF CLASS
# ════════════════════════════════════════════════════════════

class ScrumPDF(FPDF):
    # -- color helpers --
    def navy_fill(self):  self.set_fill_color(*NAVY)
    def gold_fill(self):  self.set_fill_color(*GOLD)
    def parch_fill(self): self.set_fill_color(*PARCH)
    def white_fill(self): self.set_fill_color(*WHITE)

    def navy_text(self):  self.set_text_color(*NAVY)
    def gold_text(self):  self.set_text_color(*GOLD)
    def white_text(self): self.set_text_color(*WHITE)
    def soft_text(self):  self.set_text_color(*SOFT)

    # -- layout helpers --
    def section_bar(self, label: str):
        self.navy_fill()
        self.rect(0, self.get_y(), 210, 10, "F")
        self.gold_text()
        self.set_font("Helvetica", "B", 9)
        self.set_xy(14, self.get_y() + 2.5)
        self.cell(0, 5, label.upper(), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(4)

    def h1(self, text: str, size: int = 13):
        self.set_font("Helvetica", "B", size)
        self.navy_text()
        self.set_x(14)
        self.multi_cell(182, 7, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def body(self, text: str, size: float = 10.5, indent: float = 0):
        self.set_font("Helvetica", "", size)
        self.soft_text()
        self.set_x(14 + indent)
        self.multi_cell(182 - indent, 5.5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def table_header(self, cols: list[tuple[str, float]]):
        """Draw a single-row table header. cols = [(label, width), ...]"""
        self.parch_fill()
        self.navy_text()
        self.set_font("Helvetica", "B", 9.5)
        self.set_x(14)
        for label, w in cols:
            self.cell(w, 8, label, border=1, fill=True, new_x=XPos.RIGHT)
        self.ln()

    def table_row(self, cells: list[tuple[str, float]], bg: tuple = WHITE):
        self.set_fill_color(*bg)
        self.soft_text()
        self.set_font("Helvetica", "", 9.5)
        self.set_x(14)
        for text, w in cells:
            self.cell(w, 7, text, border=1, fill=True, new_x=XPos.RIGHT)
        self.ln()


# ════════════════════════════════════════════════════════════
# BUILD
# ════════════════════════════════════════════════════════════

def build():
    chart = make_velocity_chart()
    board = make_scrum_board()

    pdf = ScrumPDF(format="A4")
    pdf.set_margins(14, 16, 14)
    pdf.set_auto_page_break(True, margin=16)

    # ── Page 1: Cover + Group Structure ──────────────────────
    pdf.add_page()

    # Navy hero bar
    pdf.navy_fill()
    pdf.rect(0, 0, 210, 50, "F")
    pdf.gold_fill()
    pdf.rect(0, 50, 210, 2.5, "F")

    pdf.set_xy(14, 10)
    pdf.set_font("Helvetica", "B", 22)
    pdf.white_text()
    pdf.cell(0, 10, "Scrum in Action",
             new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_xy(14, 24)
    pdf.set_font("Helvetica", "I", 11)
    pdf.set_text_color(200, 175, 100)
    pdf.cell(0, 6, "Scratch Match: AI Job Matcher - Sprint Planning Exercise",
             new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_xy(14, 34)
    pdf.set_font("Helvetica", "", 9.5)
    pdf.set_text_color(155, 175, 210)
    pdf.cell(0, 5, f"{COURSE}  ·  {SECTION}  ·  {DATE_STR}",
             new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.ln(14)

    # Group structure
    pdf.section_bar("Group Structure")
    pdf.table_header([("Role", 72), ("Assigned Member", 110)])
    alt = False
    for role, name in GROUP.items():
        bg = PARCH if alt else WHITE
        pdf.table_row([(role, 72), (name, 110)], bg=bg)
        alt = not alt
    pdf.ln(6)

    # ── Part 1: Backlog Grooming ──────────────────────────────
    pdf.section_bar("Part 1 - Backlog Grooming")
    pdf.h1("Epic Breakdown: Scratch Match - AI-Assisted Job Matcher")
    pdf.body(
        'The "Scratch Match" epic was broken into four user stories '
        'and ranked below from highest to lowest priority.',
        size=10.5,
    )
    pdf.ln(2)

    priority_rgb = {
        "High":   (200, 40, 40),
        "Medium": (180, 120, 0),
        "Low":    (50, 120, 60),
    }

    for item in BACKLOG:
        # Rank + priority badges
        pdf.navy_fill()
        pdf.white_text()
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_x(14)
        pdf.cell(20, 7, f"  # {item['rank']}", fill=True, new_x=XPos.RIGHT)

        r, g, b = priority_rgb[item["priority"]]
        pdf.set_fill_color(r, g, b)
        pdf.cell(22, 7, f" {item['priority']}", fill=True,
                 new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        # Story
        pdf.set_x(14)
        pdf.set_font("Helvetica", "I", 10.5)
        pdf.navy_text()
        pdf.multi_cell(182, 5.5, item["story"],
                       new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        # Rationale
        pdf.set_x(14)
        pdf.set_font("Helvetica", "", 9.5)
        pdf.soft_text()
        pdf.multi_cell(182, 5, f"Why this rank:  {item['rationale']}",
                       new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(4)

    # ── Part 2: Sprint Planning ───────────────────────────────
    pdf.add_page()
    pdf.section_bar("Part 2 - Sprint Planning")

    pdf.h1("Selected Stories for the Two-Week Sprint")
    pdf.body(
        "We selected the two highest-priority stories from the backlog:\n"
        "  1.  Story 1 - CV Upload and Indexing\n"
        "  2.  Story 2 - AI Job Matching",
        indent=4,
    )
    pdf.ln(3)

    status_bg = {
        "To-Do":      (238, 242, 248),
        "In Progress": (255, 248, 230),
        "Done":        (232, 245, 233),
    }

    for s in SPRINT_TASKS:
        pdf.h1(s["story"], size=11)
        pdf.table_header([("Technical Task", 136), ("Status", 46)])
        alt = False
        for task, status in s["tasks"]:
            bg = status_bg[status]
            pdf.set_fill_color(*bg)
            pdf.soft_text()
            pdf.set_font("Helvetica", "", 9.5)
            pdf.set_x(14)

            y0 = pdf.get_y()
            # Draw task cell; YPos.NEXT so get_y() reflects the actual bottom
            pdf.multi_cell(136, 6, task, border=1, fill=True,
                           new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            row_h = pdf.get_y() - y0

            # Draw status cell at the same row, same height
            pdf.set_xy(14 + 136, y0)
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(46, row_h, status, border=1, fill=True,
                     new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(5)

    # Scrum board image
    pdf.h1("Visual Scrum Board - Mid-Sprint Snapshot", size=11)
    board_w = 182
    board_x = (210 - board_w) / 2
    pdf.image(board, x=board_x, w=board_w)
    pdf.ln(3)

    # ── Part 3: Velocity ──────────────────────────────────────
    pdf.add_page()
    pdf.section_bar("Part 3 - Velocity & Forecasting")

    pdf.h1("Calculating Average Velocity")
    pdf.ln(1)

    for lbl, val in [
        ("Formula:", "Average Velocity = (Sprint 1 + Sprint 2 + Sprint 3) ÷ 3"),
        ("Values:",  f"= ({SPRINT_PTS[0]} + {SPRINT_PTS[1]} + {SPRINT_PTS[2]}) ÷ 3"),
        ("Result:",  f"= {sum(SPRINT_PTS)} ÷ 3 = {AVG_VEL:.0f} story points per sprint"),
    ]:
        pdf.set_font("Helvetica", "B", 10.5)
        pdf.navy_text()
        pdf.set_x(14)
        pdf.cell(28, 7, lbl, new_x=XPos.RIGHT)
        pdf.set_font("Helvetica", "", 10.5)
        pdf.soft_text()
        pdf.cell(0, 7, val, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.ln(2)

    # Summary banner
    pdf.navy_fill()
    pdf.rect(14, pdf.get_y(), 182, 14, "F")
    pdf.set_xy(14, pdf.get_y() + 3.5)
    pdf.set_font("Helvetica", "B", 11)
    pdf.gold_text()
    pdf.cell(91, 7, f"  Avg Velocity: {AVG_VEL:.0f} pts/sprint", new_x=XPos.RIGHT)
    pdf.set_font("Helvetica", "", 10.5)
    pdf.set_text_color(180, 195, 230)
    pdf.cell(91, 7, f"Remaining Backlog: {REMAINING_SP} pts  ",
             align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(6)

    # Velocity chart
    pdf.h1("Sprint Velocity Chart", size=11)
    chart_w = 160
    chart_x = (210 - chart_w) / 2
    pdf.image(chart, x=chart_x, w=chart_w)
    pdf.ln(4)

    pdf.h1("Sprint Forecast", size=11)
    pdf.body(
        f"Remaining Sprints  =  Remaining Backlog ÷ Average Velocity\n"
        f"                   =  {REMAINING_SP} ÷ {AVG_VEL:.0f}\n"
        f"                   =  {SPRINTS_NEEDED:.2f} sprints\n\n"
        f"Rounded up: the project needs approximately 4 more sprints "
        f"to clear the remaining {REMAINING_SP} story points.",
    )

    # ── Part 4: Reflection ────────────────────────────────────
    pdf.add_page()
    pdf.section_bar("Part 4 - Reflection")

    pdf.h1("1.  One Benefit of Scrum Over Waterfall")
    pdf.body(REFL_BENEFIT)
    pdf.ln(5)

    pdf.h1("2a.  Daily Standup")
    pdf.body(REFL_STANDUP)
    pdf.ln(5)

    pdf.h1("2b.  Sprint Retrospective")
    pdf.body(REFL_RETRO)

    # ── Write output ──────────────────────────────────────────
    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    pdf.output(OUT_FILE)

    # Clean up temp images
    for p in (chart, board):
        try:
            os.unlink(p)
        except OSError:
            pass

    print(f"Done. PDF saved to:\n  {OUT_FILE}")


if __name__ == "__main__":
    build()
