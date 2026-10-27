import { existsSync } from "node:fs";
import path from "node:path";
import { calendarUrl, mapsUrl, type Invitation as InvitationData } from "@/lib/invitation";
import BackgroundMusic from "./BackgroundMusic";
import ClosingSection from "./ClosingSection";
import Countdown from "./Countdown";
import CoupleSection from "./CoupleSection";
import DressCode from "./DressCode";
import EventTimeline from "./EventTimeline";
import InvitationCover from "./InvitationCover";
import InvitationMotion from "./InvitationMotion";
import { Rule } from "./Ornaments";
import PhotoGallery from "./PhotoGallery";
import ScratchReveal from "./ScratchReveal";
import SvgDefs from "./SvgDefs";
import VenueSection from "./VenueSection";

/** Music is opt-in by file: the player only renders once the configured file exists in public/. */
function musicFile(inv: InvitationData) {
  const m = inv.music;
  return m && existsSync(path.join(process.cwd(), "public", m.src)) ? m : undefined;
}

export default function Invitation({ inv }: { inv: InvitationData }) {
  const music = musicFile(inv);
  return (
    <>
      <SvgDefs />
      <main>
        <InvitationCover inv={inv} />
        <CoupleSection inv={inv} />
        <ScratchReveal inv={inv} calendarHref={calendarUrl(inv)} />
        <Countdown inv={inv} />
        <PhotoGallery inv={inv} />
        <section className="sec parch" id="program">
          <h2 className="sec-head rv">{inv.program.heading}</h2>
          <Rule className="rv" />
          <EventTimeline items={inv.program.items} />
          <div className="cards">
            <VenueSection inv={inv} mapsHref={mapsUrl(inv)} />
            <DressCode inv={inv} />
          </div>
          <p className="presence script rv">{inv.presence}</p>
        </section>
        <ClosingSection inv={inv} />
      </main>
      {music && <BackgroundMusic src={music.src} title={music.title} />}
      <InvitationMotion />
    </>
  );
}
