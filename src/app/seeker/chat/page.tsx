import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";
import { ChatPanel } from "@/components/ChatPanel";

export default function SeekerChat() {
  return (
    <>
      <PageHeader
        eyebrow="Job Seeker"
        title="Career Advisor"
        description="Ask anything about your CV, the Cebu market, or how to apply. Answers are grounded in your documents and live job listings."
        crumbs={[{ label: "Home", href: "/" }, { label: "Seeker", href: "/seeker/dashboard" }, { label: "Advisor" }]}
      />
      <Workspace navTitle="Seeker Workspace" nav={seekerNav}>
        <ChatPanel
          retrievalLabel="RAG: jobs + your CVs"
          initialMessages={[
            {
              role: "assistant",
              text:
                "Maayong adlaw, Juan. I can help tailor your CV, surface fitting roles in Cebu, or walk through how to apply. What would you like to do?",
            },
          ]}
          suggestions={[
            "Tailor my CV for a frontend role",
            "What government openings fit me?",
            "How should I apply to BlueLeaf Tech?",
            "Compare my CV to top Cebu BPO listings",
          ]}
        />
      </Workspace>
    </>
  );
}
