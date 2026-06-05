import { redirect } from "next/navigation";

// Legacy path — tool now lives at root (free.metriquill.com)
export default function FreeLegacy() {
  redirect("/");
}
