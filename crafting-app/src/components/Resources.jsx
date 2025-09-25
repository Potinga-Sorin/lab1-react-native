import React from "react";
import { useGame } from "../state/GameContext";
export default function Resources() {
  const { resources, spawnResource } = useGame();
  return (
    <div className="flex flex-col gap-2">
      {resources.base.map((r) => (
        <button
          key={r.kind}
          className="flex items-center gap-2 border border-farm-line rounded-xl px-3 py-2 bg-white hover:border-farm-ink transition"
          onClick={() => spawnResource(r.kind)}
        >
          {r.icon ? <img src={r.icon} alt="" className="w-6 h-6" /> : null}
          <span>{r.label}</span>
        </button>
      ))}
      <p className="text-sm text-farm-muted">Click pentru a genera resurse ∞</p>
    </div>
  );
}