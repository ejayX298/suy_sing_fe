"use client";
import BoothZone, { Booth as BoothZoneBooth } from "@/components/BoothZone";
import VisitedBooths from "@/components/VisitedBooths";
import BoothsProgress from "@/components/BoothsProgress";
import { useBooths, Booth as ContextBooth } from "@/context/BoothsContext";

export default function BoothsVisitedPage() {
  // Use the global booth state from context
  const { booths, handleToggleBooth, visitedCount, totalBooths } = useBooths();

  // Map booths to ensure they conform to the BoothZone.Booth interface
  const mapToBoothZoneFormat = (booth: ContextBooth): BoothZoneBooth => ({
    name: booth.name,
    logo:
      booth.logo ||
      (booth.image
        ? booth.image.split("/").pop()?.replace(".png", "") || "default"
        : "default"),
    visited: booth.visited,
  });

  // Filter and transform booths by their type/zone
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

  // Handle booth toggling through the context
  const handleBoothToggle = (
    zone: "regular" | "x2" | "visited",
    name: string,
    isVisited: boolean
  ) => {
    // Use the context's handleToggleBooth function
    handleToggleBooth(name, isVisited);
  };

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
          onBoothToggle={(name, isVisited) =>
            handleBoothToggle("regular", name, isVisited)
          }
        />

        <BoothZone
          title="Double Zone"
          booths={x2Booths}
          progress={`${x2Booths.filter((b) => b.visited).length}/${
            x2Booths.length
          }`}
          onBoothToggle={(name, isVisited) =>
            handleBoothToggle("x2", name, isVisited)
          }
        />

        <VisitedBooths
          booths={visitedBooths}
          onBoothToggle={(name, isVisited) =>
            handleBoothToggle("visited", name, isVisited)
          }
        />
      </main>
    </div>
  );
}
