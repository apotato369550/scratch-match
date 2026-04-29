#!/usr/bin/env python3
"""
UAT Scenario Outline — PDF Generator
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
SECTION       = "MW 1:30 PM – 3:00 PM"
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
        "note": "Covers user registration, login, and session management for all roles.",
        "subsections": [
            {
                "title": "2.1.1  User Registration",
                "rows": [
                    ("AUTH-001", "Authentication", "Register as a Job Seeker with a valid email and password", "Scratch Match Seeker"),
                    ("AUTH-002", "Authentication", "Register as an Employer with a valid email and password", "Scratch Match Employer"),
                    ("AUTH-003", "Authentication", "Attempt registration with an email that is already in use", "Seeker / Employer"),
                    ("AUTH-004", "Authentication", "Attempt registration with a password below the minimum length", "Seeker / Employer"),
                    ("AUTH-005", "Authentication", "Redirect to onboarding form immediately after successful registration", "Seeker / Employer"),
                ],
            },
            {
                "title": "2.1.2  Login and Session",
                "rows": [
                    ("AUTH-006", "Authentication", "Login with correct credentials", "Seeker / Employer / Admin"),
                    ("AUTH-007", "Authentication", "Login with a wrong password — system shows an error, does not authenticate", "Seeker / Employer"),
                    ("AUTH-008", "Authentication", "Login with an unregistered email", "Seeker / Employer"),
                    ("AUTH-009", "Authentication", "Session cookie persists after page refresh — user stays logged in", "Seeker / Employer"),
                    ("AUTH-010", "Authentication", "Logout clears the session — user is redirected to login", "Seeker / Employer / Admin"),
                    ("AUTH-011", "Authentication", "Direct URL access to a protected route while logged out redirects to login", "Seeker / Employer"),
                ],
            },
        ],
    },

    "2.2  Seeker Portal": {
        "note": "Features accessible after a Seeker completes onboarding.",
        "subsections": [
            {
                "title": "2.2.1  Seeker Profile",
                "rows": [
                    ("SPROF-001", "Seeker Profile", "Complete the onboarding form — name, location, specializations, years of experience", "Scratch Match Seeker"),
                    ("SPROF-002", "Seeker Profile", "Access to CV upload is blocked until the profile is complete", "Scratch Match Seeker"),
                    ("SPROF-003", "Seeker Profile", "Edit profile information and save changes", "Scratch Match Seeker"),
                    ("SPROF-004", "Seeker Profile", "Seeker profile reflects Cebu municipality as location", "Scratch Match Seeker"),
                ],
            },
            {
                "title": "2.2.2  CV Management",
                "rows": [
                    ("CVS-001", "CV Management", "Upload a PDF CV with a specialization label", "Scratch Match Seeker"),
                    ("CVS-002", "CV Management", "Upload plain text as a CV (paste-in method)", "Scratch Match Seeker"),
                    ("CVS-003", "CV Management", "View the list of all uploaded CVs with their specialization labels", "Scratch Match Seeker"),
                    ("CVS-004", "CV Management", "Delete a CV — record is removed from SQLite and Qdrant", "Scratch Match Seeker"),
                    ("CVS-005", "CV Management", "Attempt to upload a 6th CV for the same specialization — system blocks and shows limit message", "Scratch Match Seeker"),
                    ("CVS-006", "CV Management", "UI shows the remaining CV slots per specialization", "Scratch Match Seeker"),
                    ("CVS-007", "CV Management", "CV upload triggers immediate indexing — Qdrant point count increases", "Scratch Match Seeker"),
                    ("CVS-008", "CV Management", "Upload a scanned-image PDF — system flags it as unreadable and asks for text paste", "Scratch Match Seeker"),
                ],
            },
            {
                "title": "2.2.3  Job Search",
                "rows": [
                    ("SJOB-001", "Job Search", "Browse the list of open job postings", "Scratch Match Seeker"),
                    ("SJOB-002", "Job Search", "View full details of a specific job posting", "Scratch Match Seeker"),
                    ("SJOB-003", "Job Search", "Search jobs by keyword using the basic SQL search", "Scratch Match Seeker"),
                    ("SJOB-004", "Job Search", "Toggle semantic search on — results ordering changes based on meaning, not just keywords", "Scratch Match Seeker"),
                    ("SJOB-005", "Job Search", "Closed/inactive job postings do not appear in the listing", "Scratch Match Seeker"),
                ],
            },
            {
                "title": "2.2.4  AI Job Matching",
                "rows": [
                    ("MATCH-001", "AI Matching", "Request job matches for a specific CV — system returns a ranked list", "Scratch Match Seeker"),
                    ("MATCH-002", "AI Matching", "Top 10 matched jobs are displayed with similarity scores", "Scratch Match Seeker"),
                    ("MATCH-003", "AI Matching", "Two different CVs for the same user return different match rankings", "Scratch Match Seeker"),
                    ("MATCH-004", "AI Matching", "Match scores are based on embedding similarity, not keyword count", "Scratch Match Seeker"),
                    ("MATCH-005", "AI Matching", "System handles a CV that matches no open jobs — displays an empty state", "Scratch Match Seeker"),
                    ("MATCH-006", "AI Matching", "Matching works end-to-end with a PDF CV, not just pasted text", "Scratch Match Seeker"),
                ],
            },
            {
                "title": "2.2.5  AI Advisor Chat (Seeker)",
                "rows": [
                    ("SCHAT-001", "Seeker AI Chat", "Start a conversation with the AI advisor", "Scratch Match Seeker"),
                    ("SCHAT-002", "Seeker AI Chat", "Ask the advisor 'Which jobs best fit my CV?' — response cites actual Cebu listings", "Scratch Match Seeker"),
                    ("SCHAT-003", "Seeker AI Chat", "Ask the advisor to tailor the CV for a specific role — response is grounded in the actual job description", "Scratch Match Seeker"),
                    ("SCHAT-004", "Seeker AI Chat", "Advisor does not reference job titles or companies not present in the database", "Scratch Match Seeker"),
                    ("SCHAT-005", "Seeker AI Chat", "Chat history persists within a session — context carries across turns", "Scratch Match Seeker"),
                    ("SCHAT-006", "Seeker AI Chat", "Response streams progressively in the UI rather than appearing all at once", "Scratch Match Seeker"),
                ],
            },
        ],
    },

    "2.3  Employer Portal": {
        "note": "Features accessible after an Employer completes onboarding.",
        "subsections": [
            {
                "title": "2.3.1  Employer Profile",
                "rows": [
                    ("EPROF-001", "Employer Profile", "Complete onboarding form — company name, industry, location, what they are hiring for", "Scratch Match Employer"),
                    ("EPROF-002", "Employer Profile", "Edit company profile and save changes", "Scratch Match Employer"),
                    ("EPROF-003", "Employer Profile", "Access to job posting is blocked until the profile is complete", "Scratch Match Employer"),
                ],
            },
            {
                "title": "2.3.2  Job Posting",
                "rows": [
                    ("EJOB-001", "Job Posting", "Post a new job using the form — title, description, requirements, location, salary", "Scratch Match Employer"),
                    ("EJOB-002", "Job Posting", "Post a job by uploading a PDF job description — system parses and indexes it", "Scratch Match Employer"),
                    ("EJOB-003", "Job Posting", "View the list of all posted jobs and their current status", "Scratch Match Employer"),
                    ("EJOB-004", "Job Posting", "Newly posted job appears in the seeker job listing within the same session", "Scratch Match Employer"),
                    ("EJOB-005", "Job Posting", "Attempt to post a 6th open job — system blocks and shows limit message", "Scratch Match Employer"),
                    ("EJOB-006", "Job Posting", "Close an active job posting — it disappears from seeker listings", "Scratch Match Employer"),
                    ("EJOB-007", "Job Posting", "Delete a job posting — Qdrant chunks for that job are also deleted", "Scratch Match Employer"),
                ],
            },
            {
                "title": "2.3.3  Candidate Discovery",
                "rows": [
                    ("ECAND-001", "Candidate Search", "View ranked candidate CVs for a specific open job", "Scratch Match Employer"),
                    ("ECAND-002", "Candidate Search", "View seeker profile details — name, specializations, location, years of experience", "Scratch Match Employer"),
                    ("ECAND-003", "Candidate Search", "Search seekers by specialization and location", "Scratch Match Employer"),
                    ("ECAND-004", "Candidate Search", "Seeker contact email is hidden before a match is formally recorded", "Scratch Match Employer"),
                    ("ECAND-005", "Candidate Search", "Record a match for a seeker-job pair — seeker contact email becomes visible", "Scratch Match Employer"),
                    ("ECAND-006", "Candidate Search", "Seekers without any uploaded CV do not appear in candidate search", "Scratch Match Employer"),
                ],
            },
            {
                "title": "2.3.4  Hiring Assistant Chat (Employer)",
                "rows": [
                    ("ECHAT-001", "Employer AI Chat", "Start a conversation with the hiring assistant", "Scratch Match Employer"),
                    ("ECHAT-002", "Employer AI Chat", "Ask 'Find me three candidates for Job #X' — assistant surfaces and summarizes matching CVs", "Scratch Match Employer"),
                    ("ECHAT-003", "Employer AI Chat", "Assistant response is grounded in actual CV content, not fabricated qualifications", "Scratch Match Employer"),
                    ("ECHAT-004", "Employer AI Chat", "Retrieval scope is limited to CVs matching the employer's open job specializations", "Scratch Match Employer"),
                    ("ECHAT-005", "Employer AI Chat", "Chat history persists within a session", "Scratch Match Employer"),
                ],
            },
        ],
    },

    "2.4  Admin Panel": {
        "note": "Admin account is seeded during setup. No public admin registration.",
        "subsections": [
            {
                "title": "2.4.1  User Management",
                "rows": [
                    ("ADMIN-001", "Admin — Users", "Login to the admin console with the seeded admin credentials", "Scratch Match Administrator"),
                    ("ADMIN-002", "Admin — Users", "View the full list of registered users with their roles", "Scratch Match Administrator"),
                    ("ADMIN-003", "Admin — Users", "Deactivate a user account — user can no longer log in", "Scratch Match Administrator"),
                ],
            },
            {
                "title": "2.4.2  Content Management",
                "rows": [
                    ("ADMIN-004", "Admin — Content", "View all job postings across all employers", "Scratch Match Administrator"),
                    ("ADMIN-005", "Admin — Content", "Delete a job posting — Qdrant chunks for that job are also removed", "Scratch Match Administrator"),
                    ("ADMIN-006", "Admin — Content", "View all uploaded CVs across all seekers", "Scratch Match Administrator"),
                    ("ADMIN-007", "Admin — Content", "Delete a CV — record removed from SQLite and Qdrant", "Scratch Match Administrator"),
                    ("ADMIN-008", "Admin — Content", "View raw match scores between a CV and a job for debugging", "Scratch Match Administrator"),
                ],
            },
        ],
    },

    "2.5  RAG Pipeline (Planned Feature)": {
        "note": (
            "The RAG pipeline (Qdrant + nomic-embed-text) is a planned feature in this prototype. "
            "Scenarios below validate the pipeline end-to-end with sample data."
        ),
        "subsections": [
            {
                "title": "2.5.1  Ingestion",
                "rows": [
                    ("RAG-001", "RAG — Ingestion", "CV upload triggers chunking — document is split at ~500-token boundaries with 50-token overlap", "Scratch Match Seeker"),
                    ("RAG-002", "RAG — Ingestion", "Each CV chunk is embedded via nomic-embed-text and stored in the cv_chunks Qdrant collection", "Scratch Match Seeker"),
                    ("RAG-003", "RAG — Ingestion", "Job posting triggers the same chunk-and-embed pipeline for the job_chunks collection", "Scratch Match Employer"),
                    ("RAG-004", "RAG — Ingestion", "Qdrant point IDs for a document are stored in SQLite and used for cleanup on delete", "Scratch Match Administrator"),
                    ("RAG-005", "RAG — Ingestion", "CV with non-standard formatting (tables, bullet lists) is chunked without crashing the pipeline", "Scratch Match Seeker"),
                ],
            },
            {
                "title": "2.5.2  Retrieval",
                "rows": [
                    ("RAG-006", "RAG — Retrieval", "Semantic job matching queries cv_chunks with the job requirements as the query vector", "Scratch Match Seeker"),
                    ("RAG-007", "RAG — Retrieval", "Retrieval returns top-20 chunks and aggregates by CV using mean of top-3 chunk scores", "Scratch Match Seeker"),
                    ("RAG-008", "RAG — Retrieval", "Different query phrasing for the same intent returns the same top candidates", "Scratch Match Seeker / Employer"),
                    ("RAG-009", "RAG — Retrieval", "RAG advisor chat queries both cv_chunks and job_chunks before generating a response", "Scratch Match Seeker / Employer"),
                    ("RAG-010", "RAG — Retrieval", "Retrieval scope for employer chat is filtered by the employer's open job specializations", "Scratch Match Employer"),
                ],
            },
        ],
    },

    "2.6  Local LLM Integration (Planned Feature)": {
        "note": (
            "Mistral 7B runs via Ollama on the host machine. "
            "No cloud API calls are made. Scenarios cover inference quality and failure handling."
        ),
        "subsections": [
            {
                "title": "2.6.1  Inference",
                "rows": [
                    ("LLM-001", "Local LLM", "AI advisor generates a response within a reasonable time (under 60 seconds on test hardware)", "Seeker / Employer"),
                    ("LLM-002", "Local LLM", "Response streams progressively in the chat UI — does not appear all at once after a long pause", "Seeker / Employer"),
                    ("LLM-003", "Local LLM", "Advisor does not mention job titles, companies, or salary figures not present in the retrieved context", "Seeker / Employer"),
                    ("LLM-004", "Local LLM", "Advisor responds coherently to multi-turn conversations — context from earlier turns is preserved in the prompt", "Seeker / Employer"),
                    ("LLM-005", "Local LLM", "Advisor handles an ambiguous question by asking for clarification rather than guessing", "Seeker / Employer"),
                ],
            },
            {
                "title": "2.6.2  Failure Handling",
                "rows": [
                    ("LLM-006", "Local LLM", "If Ollama is not running, the chat UI shows a clear error message instead of hanging", "Seeker / Employer"),
                    ("LLM-007", "Local LLM", "If the Qdrant container is down, matching and chat return a service-unavailable message rather than a 500 error", "Seeker / Employer"),
                    ("LLM-008", "Local LLM", "No request is made to any external API or cloud service during any operation", "Scratch Match Administrator"),
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
            # ID cell — fixed 1 line
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

            x_scenario = self.get_x()
            y_scenario = self.get_y()
            self.multi_cell(CW[2], 5, f" {scenario}", border=1, fill=True,
                            new_x=XPos.RIGHT, new_y=YPos.TOP)

            self.set_xy(x_scenario + CW[2], y_scenario)
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(60, 90, 140)
            self.multi_cell(CW[3], 5, f" {role}", border=1, fill=True,
                            new_x=XPos.LMARGIN, new_y=YPos.NEXT)

            # Ensure we're past row_h from y0
            if self.get_y() < y0 + row_h:
                self.set_y(y0 + row_h)

            alt = not alt

        self.ln(4)

    def _count_lines(self, text: str, w: float) -> int:
        """Rough line count estimate for multi_cell text."""
        char_per_line = int(w / 2.2)
        if char_per_line < 1:
            return 1
        words = text.split()
        line, count = [], 1
        for word in words:
            candidate = " ".join(line + [word])
            if len(candidate) > char_per_line:
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
    pdf.cell(0, 10, f"{PROJECT_NAME}  —  UAT Scenario Outline",
             new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_xy(14, 24)
    pdf.set_font("Helvetica", "I", 11)
    pdf.set_text_color(190, 165, 90)
    pdf.cell(0, 6, "User Acceptance Testing — Wireframe + Sample Data Prototype",
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
        f"This document presents a structured UAT Scenario Outline for {PROJECT_NAME}: "
        "The AI-Assisted Job Matcher, a locally-bound employment matching system for Cebu, Philippines. "
        "The system is currently at the wireframe and sample-data prototype stage.\n\n"
        "Scenarios cover all implemented modules — Authentication, Seeker CV Management, "
        "Job Search, AI Matching, Employer Job Posting, Candidate Discovery, and the Admin Panel — "
        "as well as two planned features: the RAG Pipeline (Qdrant + nomic-embed-text) and "
        "Local LLM Integration (Mistral 7B via Ollama). "
        "All scenarios are written against what the prototype can demonstrate with sample data; "
        "production-scale load and real user data are out of scope for this test cycle."
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
