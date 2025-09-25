import React, { createContext, useContext, useMemo } from "react";
import resources from "../data/resources.json";
import recipes from "../data/recipes.json";
import { useLocalStorage } from "../util/useLocalStorage";
import { emptyGrid, matchAnyRecipe, makeId } from "../util/crafting";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [inventory, setInventory] = useLocalStorage("farm_inv", Array(18).fill(null));
  const [grid, setGrid] = useLocalStorage("farm_grid", emptyGrid());
  const [discoveredArr, setDiscoveredArr] = useLocalStorage("farm_disc", []);
  const [victoryItem, setVictoryItem] = useLocalStorage("farm_victory", "");

  const discovered = useMemo(() => new Set(discoveredArr), [discoveredArr]);

  function addToInventory(item) {
    const idx = inventory.findIndex((x) => x === null);
    if (idx === -1) return false;
    const next = [...inventory];
    next[idx] = item;
    setInventory(next);
    if (!discovered.has(item.kind)) setDiscoveredArr([...discovered, item.kind]);
    return true;
  }

  function moveInventory(src, dst) {
    if (src === dst) return;
    const next = [...inventory];
    const tmp = next[src];
    next[src] = next[dst];
    next[dst] = tmp;
    setInventory(next);
  }

  function deleteInventory(idx) {
    const next = [...inventory];
    next[idx] = null;
    setInventory(next);
  }

  function spawnResource(kind) {
    const r = resources.base.find((r) => r.kind === kind);
    addToInventory({ id: makeId(), kind: r.kind, label: r.label, icon: r.icon });
  }

  function placeOnGrid(cellIndex, item) {
    const next = [...grid];
    next[cellIndex] = item; 
    setGrid(next);
  }

  function clearGrid() { setGrid(emptyGrid()); }

  function tryCraft() {
    const match = matchAnyRecipe(grid, recipes);
    if (!match) return null;
    clearGrid();                             
    const res = { id: makeId(), ...match.result };
    addToInventory(res);
    if (match.result.kind === recipes.victory) setVictoryItem(match.result.label);
    return res;
  }

  function resetAll() {
    setInventory(Array(18).fill(null));
    setGrid(emptyGrid());
    setDiscoveredArr([]);
    setVictoryItem("");
  }

  const value = {
    resources, recipes,
    inventory, setInventory,
    grid, setGrid,
    discovered, victoryItem,
    spawnResource, addToInventory, moveInventory, deleteInventory,
    placeOnGrid, tryCraft, clearGrid, resetAll
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
