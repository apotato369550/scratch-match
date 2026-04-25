import { PageHeader } from "@/components/PageHeader";
import { Workspace, employerNav } from "@/components/Workspace";
import { ChatPanel } from "@/components/ChatPanel";

export default function EmployerChat() {
  return (
    <>
      <PageHeader
        eyebrow="Employer"
        title="Hiring Assistant"
        description="Ask about candidates, your postings, or what's missing in your job description. Retrieval is scoped to your jobs and matched CVs."
        crumbs={[{ label: "Home", href: "/" }, { label: "Employer", href: "/employer/dashboard" }, { label: "Assistant" }]}
      />
      <Workspace navTitle="Employer Workspace" nav={employerNav}>
        <ChatPanel
          retrievalLabel="RAG: your jobs + matched CVs"
          initialMessages={[
            {
              role: "assistant",
              text:
                "Good day. I can shortlist candidates per posting, summarize CVs, or suggest improvements to a job description. Where would you like to start?",
            },
          ]}
          suggestions={[
            "Find me 3 candidates for the Frontend Engineer posting",
            "What skills are common across top-scoring candidates?",
            "Improve the requirements for QA Tester",
            "Summarize Juan dela Cruz's most recent CV",
          ]}
        />
      </Workspace>
    </>
  );
}
