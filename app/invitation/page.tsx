import type { Metadata } from "next";
import Invitation from "@/components/Invitation";
import { invitation } from "@/lib/invitation";

export const metadata: Metadata = {
  title: invitation.meta.title,
  description: invitation.meta.description,
  // the preview image itself is opengraph-image.jpg next to this file (Next.js adds the tags)
  openGraph: { title: invitation.meta.title, description: invitation.meta.description, type: "website" },
  twitter: { card: "summary_large_image", title: invitation.meta.title, description: invitation.meta.description },
};

export default function InvitationPage() {
  return <Invitation inv={invitation} />;
}
