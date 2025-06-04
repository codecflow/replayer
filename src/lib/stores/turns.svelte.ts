import type { Turn } from "$lib/types/index.js";

export class TurnStore {
  turns = $state<Turn[]>([]);

  // Derived values
  total = $derived(this.turns.length);

  // Methods
  set(turns: Turn[]) {
    this.turns = turns;
  }

  get(index: number): Turn | undefined {
    return this.turns[index];
  }

  clear() {
    this.turns = [];
  }

  findByName(name: string): Turn | undefined {
    return this.turns.find(turn => turn.id === name);
  }

  getPreviousScreenshot(index: number): string | null {
    for (let i = index - 1; i >= 0; i--) {
      const turn = this.turns[i];
      if (turn?.screenshot) {
        return turn.screenshot;
      }
    }
    return null;
  }
}
