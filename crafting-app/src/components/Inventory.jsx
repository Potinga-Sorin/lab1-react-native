import React from "react";
import { useGame } from "../state/GameContext";

export default function Inventory() {
  const { inventory, moveInventory, deleteInventory } = useGame();

  function onDrop(e, dst) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("app/item");
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.from === "inventory" && typeof data.index === "number") moveInventory(data.index, dst);
  }

  return (
    <div className="grid grid-cols-9 gap-2">
      {inventory.map((item, i) => (
        <div
          key={i}
          className={`h-16 rounded-xl border ${item ? "border-farm-ink" : "border-dashed border-farm-line"} bg-white flex items-center justify-center`}
          onDrop={(e) => onDrop(e, i)}
          onDragOver={(e) => e.preventDefault()}
        >
          {item ? (
            <div
              className="flex items-center gap-2 border border-farm-line rounded-full px-3 py-1 bg-white"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "app/item",
                  JSON.stringify({ from: "inventory", index: i, item })
                )
              }
            >
              {item.icon ? <img src={item.icon} className="w-15 h-15" /> : null}
              {/* Elimină sau comentează textul */}
              {/* <span>{item.label}</span> */}
              <button className="ml-1 text-farm-muted" onClick={() => deleteInventory(i)} aria-label="Delete">×</button>
            </div>
          ) : (
            <span className="text-xs text-farm-muted">gol</span>
          )}
        </div>
      ))}
    </div>
  );
}