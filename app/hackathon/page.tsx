import { redirect } from "next/navigation";

// Internt/teknisk ord er "hackathon"; kundevendt route er /ai-innovationsdag.
export default function HackathonRedirect() {
  redirect("/ai-innovationsdag");
}
