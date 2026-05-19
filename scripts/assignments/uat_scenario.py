#!/usr/bin/env python3
"""
UAT Scenario Outline - PDF Generator
CIS 2205 | Group Sigma | Scratch Match: The AI-Assisted Job Matcher
Submission date: May 1, 2026

Run: python uat_scenario.py
Deps: pip install fpdf2
"""

import os
from fpdf import FPDF
from fpdf.enums import XPos, YPos

# ════════════════════════════════════════════════════════════
# CONFIG
# ════════════════════════════════════════════════════════════

GROUP_NAME    = "Group Sigma"
PROJECT_NAME  = "Scratch Match"
COURSE        = "CIS 2205"
SECTION       = "MW 1:30 PM - 3:00 PM"
SUBMIT_DATE   = "May 1, 2026"
AUTHOR        = "John Andre Yap"
VERSION       = "0.1"
EFFECTIVE     = "29-April-2026"

OUT_FILE = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "GroupSigma_UAT Scenario Outline_ScratchMatch_05012026.pdf",
)

# ════════════════════════════════════════════════════════════
# PALETTE
# ════════════════════════════════════════════════════════════

NAVY   = (14, 31, 63)
GOLD   = (212, 160, 23)
PARCH  = (247, 245, 238)
LGRAY  = (230, 234, 240)
WHITE  = (255, 255, 255)
SOFT   = (31, 41, 55)
GOLD_D = (168, 128, 15)

# ════════════════════════════════════════════════════════════
# SCENARIO DATA
# ── Format: (UAT_ID, Module_Category, Scenario, Role)
# ════════════════════════════════════════════════════════════

SCENARIOS: dict[str, list[dict]] = {

    "2.1  Authentication": {
        "note": "Registration, login, and session management for all roles.",
        "subsections": [
            {
                "title": "2.1.1  Registration and Login",
                "rows": [
                    ("AUTH-001", "Authentication", "Register as a Job Seeker with a valid email and password", "Scratch Match Seeker"),
                    ("AUTH-002", "Authentication", "Register as an Employer with a valid email and password", "Scratch Match Employer"),
                    ("AUTH-003", "Authentication", "Attempt registration with an email already in use - system shows an error", "Seeker / Employer"),
                    ("AUTH-004", "Authentication", "Login with correct credentials - user is redirected to dashboard", "Seeker / Employer / Admin"),
                    ("AUTH-005", "Authentication", "Login with wrong password - error shown, user not authenticated", "Seeker / Employer"),
                    ("AUTH-006", "Authentication", "Logout clears the session and redirects to the login page", "Seeker / Employer / Admin"),
                ],
            },
        ],
    },

    "2.2  Seeker Portal": {
        "note": "Features accessible after a Seeker completes onboarding.",
        "subsections": [
            {
                "title": "2.2.1  Profile and CV Management",
                "rows": [
                    ("SPROF-001", "Seeker Profile", "Complete onboarding form with name, location, and specialization", "Scratch Match Seeker"),
                    ("SPROF-002", "Seeker Profile", "CV upload is blocked until the seeker profile is complete", "Scratch Match Seeker"),
                    ("CVS-001", "CV Management", "Upload a PDF CV with a specialization label", "Scratch Match Seeker"),
                    ("CVS-002", "CV Management", "Delete a CV - record removed from SQLite and Qdrant", "Scratch Match Seeker"),
                    ("CVS-003", "CV Management", "Attempt to exceed the CV limit - system blocks and shows limit message", "Scratch Match Seeker"),
                ],
            },
            {
                "title": "2.2.2  Job Search and AI Matching",
                "rows": [
                    ("SJOB-001", "Job Search", "Browse and view details of open job postings", "Scratch Match Seeker"),
                    ("SJOB-002", "Job Search", "Search jobs by keyword - results filter correctly", "Scratch Match Seeker"),
                    ("MATCH-001", "AI Matching", "Request job matches for a CV - system returns a ranked list with scores", "Scratch Match Seeker"),
                    ("MATCH-002", "AI Matching", "Two different CVs for the same user return different match rankings", "Scratch Match Seeker"),
                    ("MATCH-003", "AI Matching", "CV with no matching jobs displays an empty state", "Scratch Match Seeker"),
                ],
            },
            {
                "title": "2.2.3  AI Advisor Chat",
                "rows": [
                    ("SCHAT-001", "Seeker AI Chat", "Ask 'Which jobs fit my CV?' - response cites actual Cebu listings", "Scratch Match Seeker"),
                    ("SCHAT-002", "Seeker AI Chat", "Ask advisor to tailor CV for a role - response references the job description", "Scratch Match Seeker"),
                    ("SCHAT-003", "Seeker AI Chat", "Chat history persists within a session - context carries across turns", "Scratch Match Seeker"),
                ],
            },
        ],
    },

    "2.3  Employer Portal": {
        "note": "Features accessible after an Employer completes onboarding.",
        "subsections": [
            {
                "title": "2.3.1  Job Posting",
                "rows": [
                    ("EJOB-001", "Job Posting", "Post a new job with title, description, requirements, and salary", "Scratch Match Employer"),
                    ("EJOB-002", "Job Posting", "Newly posted job appears in the seeker job listing", "Scratch Match Employer"),
                    ("EJOB-003", "Job Posting", "Close a job posting - it disappears from seeker listings", "Scratch Match Employer"),
                    ("EJOB-004", "Job Posting", "Delete a job posting - Qdrant chunks for that job are also removed", "Scratch Match Employer"),
                ],
            },
            {
                "title": "2.3.2  Candidate Discovery and AI Assistant",
                "rows": [
                    ("ECAND-001", "Candidate Search", "View ranked candidate CVs for an open job", "Scratch Match Employer"),
                    ("ECAND-002", "Candidate Search", "Record a match - seeker contact email becomes visible", "Scratch Match Employer"),
                    ("ECHAT-001", "Employer AI Chat", "Ask assistant to find candidates for a job - response summarizes matching CVs", "Scratch Match Employer"),
                    ("ECHAT-002", "Employer AI Chat", "Chat history persists within a session", "Scratch Match Employer"),
                ],
            },
        ],
    },

    "2.4  Admin Panel": {
        "note": "Admin account is seeded during setup. No public admin registration.",
        "subsections": [
            {
                "title": "2.4.1  User and Content Management",
                "rows": [
                    ("ADMIN-001", "Admin", "Login to the admin console with the seeded admin credentials", "Scratch Match Admin"),
                    ("ADMIN-002", "Admin", "View the full user list and deactivate an account", "Scratch Match Admin"),
                    ("ADMIN-003", "Admin", "Delete a job posting - Qdrant chunks are also removed", "Scratch Match Admin"),
                    ("ADMIN-004", "Admin", "Delete a CV - record removed from SQLite and Qdrant", "Scratch Match Admin"),
                ],
            },
        ],
    },

    "2.5  RAG Pipeline and Local LLM": {
        "note": (
            "Planned features validated end-to-end with sample data: "
            "Qdrant + nomic-embed-text for retrieval, Mistral 7B via Ollama for generation."
        ),
        "subsections": [
            {
                "title": "2.5.1  Ingestion and Retrieval",
                "rows": [
                    ("RAG-001", "RAG Pipeline", "CV upload triggers chunking and embedding - Qdrant point count increases", "Scratch Match Seeker"),
                    ("RAG-002", "RAG Pipeline", "Job posting triggers the same chunk-and-embed pipeline", "Scratch Match Employer"),
                    ("RAG-003", "RAG Pipeline", "Semantic match returns a different ranked list for two different CVs", "Scratch Match Seeker"),
                ],
            },
            {
                "title": "2.5.2  Local LLM",
                "rows": [
                    ("LLM-001", "Local LLM", "AI advisor responds without calling any external API or cloud service", "Seeker / Employer"),
                    ("LLM-002", "Local LLM", "Response streams progressively in the UI rather than appearing all at once", "Seeker / Employer"),
                    ("LLM-003", "Local LLM", "If Ollama is not running, chat shows a clear error instead of hanging", "Seeker / Employer"),
                ],
            },
        ],
    },

}

# ════════════════════════════════════════════════════════════
# PDF CLASS
# ════════════════════════════════════════════════════════════

class UATPDF(FPDF):
    def navy_fill(self):  self.set_fill_color(*NAVY)
    def gold_fill(self):  self.set_fill_color(*GOLD)
    def parch_fill(self): self.set_fill_color(*PARCH)
    def lgray_fill(self): self.set_fill_color(*LGRAY)
    def white_fill(self): self.set_fill_color(*WHITE)

    def navy_text(self):  self.set_text_color(*NAVY)
    def gold_text(self):  self.set_text_color(*GOLD)
    def white_text(self): self.set_text_color(*WHITE)
    def soft_text(self):  self.set_text_color(*SOFT)
    def gold_d_text(self): self.set_text_color(*GOLD_D)

    def h_section(self, label: str):
        """Full-width navy bar for top-level section headers."""
        self.navy_fill()
        self.rect(0, self.get_y(), 210, 11, "F")
        self.set_xy(14, self.get_y() + 2.8)
        self.set_font("Helvetica", "B", 9.5)
        self.gold_text()
        self.cell(0, 5.5, label.upper(), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(3)

    def h_sub(self, label: str):
        """Parchment bar for subsection headers."""
        self.parch_fill()
        self.rect(14, self.get_y(), 182, 8, "F")
        self.set_xy(16, self.get_y() + 1.5)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*NAVY)
        self.cell(0, 5, label, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def note(self, text: str):
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(90, 110, 140)
        self.set_x(14)
        self.multi_cell(182, 5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(3)

    def scenario_table(self, rows: list[tuple[str, str, str, str]]):
        """Render a UAT scenario table. Each row: (ID, Module, Scenario, Role)."""
        # Column widths (total 182)
        CW = [20, 36, 90, 36]
        HEADERS = ["UAT S/N", "Module Category", "Scenario", "Role"]

        # Header row
        self.lgray_fill()
        self.set_font("Helvetica", "B", 8.5)
        self.navy_text()
        self.set_x(14)
        for h, w in zip(HEADERS, CW):
            self.cell(w, 8, f" {h}", border=1, fill=True, new_x=XPos.RIGHT)
        self.ln()

        alt = False
        for uid, mod, scenario, role in rows:
            bg = PARCH if alt else WHITE
            self.set_fill_color(*bg)
            self.set_font("Helvetica", "B", 8)
            self.navy_text()
            self.set_x(14)

            y0 = self.get_y()

            # Measure heights
            self.set_font("Helvetica", "B", 8)
            # ID cell - fixed 1 line
            id_h = 7

            # Scenario cell may wrap
            self.set_font("Helvetica", "", 8.5)
            scenario_lines = self._count_lines(scenario, CW[2] - 4)
            scenario_h = max(7, scenario_lines * 5 + 2)

            # Role cell may wrap
            role_lines = self._count_lines(role, CW[3] - 3)
            role_h = max(7, role_lines * 5 + 2)

            row_h = max(id_h, scenario_h, role_h)

            # Draw each cell
            self.set_x(14)

            self.set_font("Helvetica", "B", 8)
            self.navy_text()
            self.cell(CW[0], row_h, f" {uid}", border=1, fill=True, new_x=XPos.RIGHT)

            self.set_font("Helvetica", "", 8.5)
            self.soft_text()
            self.cell(CW[1], row_h, f" {mod}", border=1, fill=True, new_x=XPos.RIGHT)

            page_before = self.page
            x_scenario = self.get_x()
            y_scenario = self.get_y()
            self.multi_cell(CW[2], 5, f" {scenario}", border=1, fill=True,
                            new_x=XPos.RIGHT, new_y=YPos.TOP)

            self.set_xy(x_scenario + CW[2], y_scenario)
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(60, 90, 140)
            self.multi_cell(CW[3], 5, f" {role}", border=1, fill=True,
                            new_x=XPos.LMARGIN, new_y=YPos.NEXT)

            # Only apply the row_h floor if no page break occurred; after a
            # break y0 is from the old page and set_y(y0+row_h) would push
            # the cursor to the wrong position, cascading one row per page.
            if self.page == page_before and self.get_y() < y0 + row_h:
                self.set_y(y0 + row_h)

            alt = not alt

        self.ln(4)

    def _count_lines(self, text: str, w: float) -> int:
        words = text.split()
        if not words:
            return 1
        line, count = [], 1
        for word in words:
            candidate = " ".join(line + [word])
            if line and self.get_string_width(candidate) > w:
                count += 1
                line = [word]
            else:
                line.append(word)
        return count


# ════════════════════════════════════════════════════════════
# BUILD
# ════════════════════════════════════════════════════════════

def build():
    pdf = UATPDF(format="A4")
    pdf.set_margins(14, 16, 14)
    pdf.set_auto_page_break(True, margin=16)

    # ── Cover page ───────────────────────────────────────────
    pdf.add_page()

    # Hero
    pdf.navy_fill()
    pdf.rect(0, 0, 210, 55, "F")
    pdf.gold_fill()
    pdf.rect(0, 55, 210, 2.5, "F")

    pdf.set_xy(14, 10)
    pdf.set_font("Helvetica", "B", 20)
    pdf.white_text()
    pdf.cell(0, 10, f"{PROJECT_NAME}  -  UAT Scenario Outline",
             new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_xy(14, 24)
    pdf.set_font("Helvetica", "I", 11)
    pdf.set_text_color(190, 165, 90)
    pdf.cell(0, 6, "User Acceptance Testing - Wireframe + Sample Data Prototype",
             new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_xy(14, 34)
    pdf.set_font("Helvetica", "", 9.5)
    pdf.set_text_color(155, 175, 210)
    pdf.cell(0, 5, f"{GROUP_NAME}  ·  {COURSE}  ·  {SECTION}  ·  {SUBMIT_DATE}",
             new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_xy(14, 43)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(120, 145, 185)
    pdf.cell(0, 5, f"Prepared by: {AUTHOR}",
             new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.ln(16)

    # Revision history
    pdf.h_section("A.  Revision History")
    pdf.set_font("Helvetica", "B", 9)
    pdf.lgray_fill()
    pdf.navy_text()
    pdf.set_x(14)
    for h, w in [("Version", 20), ("Effective Date", 36), ("Summary of Changes", 84), ("Author", 42)]:
        pdf.cell(w, 8, f" {h}", border=1, fill=True, new_x=XPos.RIGHT)
    pdf.ln()
    pdf.white_fill()
    pdf.set_font("Helvetica", "", 9)
    pdf.soft_text()
    pdf.set_x(14)
    for val, w in [(VERSION, 20), (EFFECTIVE, 36), ("Initial UAT scenario draft", 84), (AUTHOR, 42)]:
        pdf.cell(w, 7, f" {val}", border=1, fill=True, new_x=XPos.RIGHT)
    pdf.ln(10)

    # Overview
    pdf.h_section("1.  Overview")
    pdf.set_font("Helvetica", "", 10.5)
    pdf.soft_text()
    pdf.set_x(14)
    pdf.multi_cell(182, 5.5, (
        f"This document presents a UAT Scenario Outline for {PROJECT_NAME}: "
        "The AI-Assisted Job Matcher, a locally-bound employment matching system for Cebu, Philippines. "
        "The system is currently at the wireframe and sample-data prototype stage.\n\n"
        "Scenarios cover the core implemented modules - Authentication, Seeker Profile and CV Management, "
        "Job Search, AI Matching, Employer Job Posting, Candidate Discovery, and the Admin Panel - "
        "as well as two planned features: the RAG Pipeline (Qdrant + nomic-embed-text) and "
        "Local LLM Integration (Mistral 7B via Ollama). "
        "All scenarios are scoped to what the prototype can demonstrate with sample data."
    ), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(6)

    # ── Scenario sections ────────────────────────────────────
    pdf.h_section("2.  UAT Scenario Outline")
    pdf.ln(2)

    for section_title, section_data in SCENARIOS.items():
        pdf.add_page()
        pdf.h_section(section_title)

        if note := section_data.get("note"):
            pdf.note(note)

        for sub in section_data.get("subsections", []):
            pdf.h_sub(sub["title"])
            pdf.scenario_table(sub["rows"])

    # ── Output ────────────────────────────────────────────────
    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    pdf.output(OUT_FILE)
    print(f"Done. PDF saved to:\n  {OUT_FILE}")


if __name__ == "__main__":
    build()
