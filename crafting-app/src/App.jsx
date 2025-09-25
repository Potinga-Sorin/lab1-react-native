import React from "react";
import Resources from "./components/Resources";
import Inventory from "./components/Inventory";
import CraftingGrid from "./components/CraftingGrid";
import DiscoveryPanel from "./components/DiscoveryPanel";
import Garbage from "./components/Garbage";
import { useGame } from "./state/GameContext";
export default function App() {
  const { victoryItem, discovered } = useGame();
  return (
    <div className="mx-auto max-w-6xl px-6 py-6 text-farm-ink" style={{ backgroundColor: "#f6f7f4", minHeight: "100vh" }}>
      <header>
        <h1 className="text-3xl font-semibold mb-1">🚜 Crafting Farm</h1>
        <p className="text-farm-muted">Mută resursele agricole în grila 3×3 pentru a cultiva plante, a recolta grâne și a coace pâine.</p>
      </header>

      <section className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-3 bg-farm-panel border border-farm-line rounded-2xl shadow-soft p-4">
          <h2 className="font-semibold mb-3">Resurse</h2>
          <Resources />
        </div>

        <div className="col-span-6 bg-farm-panel border border-farm-line rounded-2xl shadow-soft p-4">
          <h2 className="font-semibold mb-3">Grila de lucru</h2>
          <CraftingGrid />
        </div>

        <div className="col-span-3 bg-farm-panel border border-farm-line rounded-2xl shadow-soft p-4">
          <h2 className="font-semibold mb-3">Descoperiri</h2>
          <DiscoveryPanel />
        </div>
      </section>

      <section className="flex gap-4 mt-4 items-start">
        <div className="flex-1 bg-farm-panel border border-farm-line rounded-2xl shadow-soft p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Inventar</h2>
            <small className="text-farm-muted">{discovered.size} obiecte descoperite</small>
          </div>
          <Inventory />
        </div>
        <Garbage />
      </section>

      <footer className="mt-4 text-farm-muted">
        {victoryItem ? (
          <span className="text-green-600 font-medium">Ai creat „{victoryItem}” – ai câștigat! 🏆</span>
        ) : (
          <span></span>
        )}
      </footer>
    </div>
  );
}