import React, { useMemo } from "react";
import { useGame } from "../state/GameContext";
import { canCraftWithKnown } from "../util/crafting";

export default function DiscoveryPanel() {
  const { recipes, discovered } = useGame();
  const next = useMemo(() => {
    return recipes.list.filter((r) => canCraftWithKnown(r, discovered)).map((r) => r.result);
  }, [recipes, discovered]);

  if (!next.length) return <p className="text-farm-muted">Începe cu primele combinații simple.</p>;

  return (
    <ul className="flex flex-col gap-2">
      {next.map((res) => (
        <li key={res.kind} className="inline-flex items-center gap-2 border border-farm-line rounded-full px-3 py-1 bg-white">
          {res.icon ? <img src={res.icon} className="w-5 h-5" /> : null}
          <span className="text-sm">{res.label}</span>
        </li>
      ))}
    </ul>
  );
}