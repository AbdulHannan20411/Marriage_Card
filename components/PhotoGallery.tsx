import Image from "next/image";
import type { Invitation } from "@/lib/invitation";

/** Three gold-rimmed arches; the centre one is wider and taller. Images drift on scroll (parallax). */
export default function PhotoGallery({ inv }: { inv: Invitation }) {
  return (
    <section className="sec parch" id="moments" aria-label="Moments">
      <div className="pics rv">
        {inv.gallery.map((p, i) => (
          <div key={p.src} className={i === 1 ? "arch mid" : "arch"}>
            {/* sized by .arch img in CSS: 116% tall so the scroll parallax never shows an edge */}
            <Image src={p.src} alt={p.alt} width={p.width} height={p.height} />
          </div>
        ))}
      </div>
    </section>
  );
}
