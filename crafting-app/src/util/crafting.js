export const makeId = () => Math.random().toString(36).slice(2, 9);
export const emptyGrid = () => Array(9).fill(null);

const idxMap90 = [6, 3, 0, 7, 4, 1, 8, 5, 2];
export const rotate90 = (p) => idxMap90.map((i) => p[i]);
const samePattern = (a, b) => a.every((v, i) => v === b[i]);

export function toPattern(grid) { return grid.map((c) => (c ? c.kind : null)); }

export function matchAnyRecipe(grid, recipes) {
  const pat = toPattern(grid);
  for (const r of recipes.list) {
    let target = r.pattern;
    for (let k = 0; k < (r.rotate ? 4 : 1); k++) {
      if (samePattern(pat, target)) return r;
      target = rotate90(target);
    }
  }
  return null;
}

export function canCraftWithKnown(recipe, discoveredSet) {
  const needs = new Set(recipe.pattern.filter(Boolean));
  for (const k of needs) if (!discoveredSet.has(k)) return false;
  return true;
}

// Pure helper for tests (consumption semantics)
export function craftResult(grid, recipes) {
  const match = matchAnyRecipe(grid, recipes);
  if (!match) return null;
  return { result: match.result, newGrid: emptyGrid() };
}