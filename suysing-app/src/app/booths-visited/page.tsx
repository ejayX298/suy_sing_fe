"use client";
import BoothZone, { Booth as BoothZoneBooth } from "@/components/BoothZone";
import VisitedBooths from "@/components/VisitedBooths";
import BoothsProgress from "@/components/BoothsProgress";
import { useBooths, Booth as ContextBooth } from "@/context/BoothsContext";

export default function BoothsVisitedPage() {
  const { booths, visitedCount, totalBooths } = useBooths();

  const mapToBoothZoneFormat = (booth: ContextBooth): BoothZoneBooth => ({
    name: booth.name,
    boothCode: booth.boothCode,
    image: booth.image || "/default-booth-image.jpg",
    visited: booth.visited,
  });

  const regularBooths = booths
    .filter(
      (booth) =>
        booth.id?.startsWith("regular-") ||
        (!booth.id?.includes("double") && !booth.isDoubleZone)
    )
    .map(mapToBoothZoneFormat);

  const x2Booths = booths
    .filter((booth) => booth.isDoubleZone || booth.id?.includes("double"))
    .map(mapToBoothZoneFormat);

  const visitedBooths = booths
    .filter((booth) => booth.visited)
    .map(mapToBoothZoneFormat);

  return (
    <div className="flex flex-col max-w-2xl mx-auto">
      <main className="flex-1 px-4 py-6">
        <div className="mb-10">
          <BoothsProgress
            visited={visitedCount}
            total={totalBooths}
            viewList=""
          />
        </div>

        <BoothZone
          title="Regular Zone"
          booths={regularBooths}
          progress={`${regularBooths.filter((b) => b.visited).length}/${
            regularBooths.length
          }`}
        />

        <BoothZone
          title="Double Zone"
          booths={x2Booths}
          progress={`${x2Booths.filter((b) => b.visited).length}/${
            x2Booths.length
          }`}
        />

        <VisitedBooths booths={visitedBooths} />
      </main>
    </div>
  );
}
