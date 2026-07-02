import { createFileRoute } from "@tanstack/react-router";
import PixelStudio from "@/components/pixel/PixelStudio";

export const Route = createFileRoute("/studio")({
  component: Studio,
});

function Studio() {
  return <PixelStudio />;
}
