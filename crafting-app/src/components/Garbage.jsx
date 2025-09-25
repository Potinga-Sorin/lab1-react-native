import React from "react";
import { useGame } from "../state/GameContext";

export default function Garbage() {
  const { resetAll, clearGrid } = useGame();
  return (
    <div className="w-60 bg-farm-panel border border-farm-line rounded-2xl shadow-soft p-4">
      <h2 className="font-semibold mb-2">Coș</h2>
      <p className="text-farm-muted mb-2">Resetează tot progresul sau curăță grila.</p>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded-xl border border-farm-line" onClick={() => clearGrid()}>Curăță grila</button>
        <button className="px-3 py-2 rounded-xl bg-red-500 text-white" onClick={() => resetAll()}>Reset joc</button>
      </div>
    </div>
  );
}