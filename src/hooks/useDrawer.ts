import { useContext } from "react";
import { DrawerContext } from "@/context/DrawerContext";

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within a DrawerProvider");
  return ctx;
}
