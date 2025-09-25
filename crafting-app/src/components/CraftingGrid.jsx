import React, { useMemo, useState, useEffect } from "react";
import { useGame } from "../state/GameContext";
import { matchAnyRecipe } from "../util/crafting";

export default function CraftingGrid() {
  // setGrid for atomic grid→grid moves (prevents disappearing items)
  const { grid, setGrid, placeOnGrid, tryCraft, recipes, inventory, setInventory, discovered } = useGame();
  const [message, setMessage] = useState("");
  const [showBook, setShowBook] = useState(false);
  const [overIdx, setOverIdx] = useState(null); // index-ul celulei peste care se face drag

  // ESC închide modalul
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setShowBook(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onDrop(e, idx) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("app/item");
    if (!raw) return;
    const payload = JSON.parse(raw);

    if (payload.from === "inventory" && typeof payload.index === "number") {
      // Inventory → Grid: plasează și consumă din inventar
      placeOnGrid(idx, payload.item ?? null);
      const next = [...inventory];
      next[payload.index] = null;
      setInventory(next);
      setOverIdx(null);
      return;
    }

    if (payload.from === "grid" && typeof payload.index === "number") {
      const src = payload.index;
      if (src === idx) return;
      // Grid → Grid: update atomic ca să nu pierdem itemul
      setGrid(prev => {
        const next = [...prev];
        const item = next[src];
        next[src] = null;
        next[idx] = item;
        return next;
      });
      setOverIdx(null);
      return;
    }
  }

  const match = useMemo(() => matchAnyRecipe(grid, recipes), [grid, recipes]);

  return (
    <div className="flex gap-6 items-start">
      <div className="grid grid-cols-3 gap-3">
        {grid.map((cell, i) => (
          <div
            key={i}
            className={[
              "w-18 h-18 rounded-2xl flex items-center justify-center border bg-white transition-all",
              cell ? "border-farm-ink" : "border-dashed border-farm-line",
              overIdx === i ? "ring-2 ring-farm-accent/70 bg-green-50" : ""
            ].join(" ")}
            onDrop={(e) => onDrop(e, i)}
            onDragOver={(e) => { e.preventDefault(); setOverIdx(i); }}
            onDragEnter={() => setOverIdx(i)}
            onDragLeave={() => setOverIdx(null)}
          >
            {cell ? (
              <div
                className="draggable"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "app/item",
                    JSON.stringify({ from: "grid", index: i, item: cell })
                  )
                }
              >
                {cell.icon ? <img src={cell.icon} alt="" className="w-16 h-16" /> : null}
              </div>
            ) : (
              <span className="text-[11px] text-farm-muted">gol</span>
            )}
          </div>
        ))}
      </div>

      <div className="min-w-[280px] flex-shrink-0">
        <div className="space-y-3">
          {match ? (
            <div className="p-3 rounded-2xl border border-farm-line bg-white shadow-soft">
              <div className="inline-flex items-center gap-3">
                {match.result.icon ? <img src={match.result.icon} alt="" className="w-8 h-8" /> : null}
                <span className="text-sm font-medium">{match.result.label}</span>
              </div>
              <button
                className="w-full mt-3 px-4 py-2 rounded-xl bg-farm-accent text-white text-sm hover:brightness-110"
                onClick={() => {
                  tryCraft();
                  setMessage("Creat!");
                  setTimeout(() => setMessage(""), 1200);
                }}
              >
                Creează
              </button>
            </div>
          ) : (
            <p className="text-farm-muted text-sm">Plasează ingredientele după modelul rețetei…</p>
          )}

          {message && <p className="text-green-600 text-sm">{message}</p>}

          {/* Buton pentru cărticica cu rețete */}
          <button
            className="w-full px-4 py-2 rounded-xl border border-farm-line bg-white hover:bg-farm-bg text-sm"
            onClick={() => setShowBook(true)}
          >
            📖 Cărțicica cu rețete
          </button>
        </div>
      </div>

      {/* Popup pentru rețete */}
      {showBook && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowBook(false); }}
        >
          <div className="bg-white rounded-2xl shadow-lg w-[560px] max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-farm-line">
              <h3 className="font-semibold text-base">📖 Cărțicica cu rețete</h3>
              <button className="text-farm-muted text-xl leading-none" onClick={() => setShowBook(false)}>×</button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-56px)]">
              {recipes.list.filter(r => discovered.has(r.result.kind)).length === 0 ? (
                <p className="text-farm-muted text-sm">Nu ai descoperit încă nicio rețetă.</p>
              ) : (
                <ul className="grid grid-cols-2 gap-3">
                  {recipes.list.filter(r => discovered.has(r.result.kind)).map(r => (
                    <li key={r.id} className="flex items-center gap-2 border border-farm-line rounded-xl px-3 py-2 bg-white">
                      {r.result.icon ? <img src={r.result.icon} alt="" className="w-6 h-6" /> : null}
                      <span className="text-sm">{r.result.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
