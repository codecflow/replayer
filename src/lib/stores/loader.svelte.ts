import type { Turn, TurnLoader } from "$lib/types/index.js";

export class LoaderStore {
  // State
  loading = $state(false);
  progress = $state(0);
  message = $state("");
  error = $state<Error | null>(null);

  // Derived values
  get isLoading() {
    return this.loading;
  }

  get loadingMessage() {
    return this.message;
  }

  get errorMessage() {
    return this.error?.message || null;
  }

  async load<T>(loader: TurnLoader<T>, source: T): Promise<Turn[]> {
    this.loading = true;
    this.progress = 0;
    this.error = null;
    this.message = "Loading...";

    try {
      const result = await loader(source);

      if (Symbol.asyncIterator in result) {
        // Handle async iterable
        const turns: Turn[] = [];
        for await (const turn of result) {
          turns.push(turn);
          this.progress = turns.length;
          this.message = `Loaded ${turns.length} turns...`;
        }
        return turns;
      } else {
        // Handle promise
        return result;
      }
    } catch (e) {
      this.error = e as Error;
      throw e;
    } finally {
      this.loading = false;
      this.message = "";
    }
  }

  setMessage(message: string) {
    this.message = message;
  }

  setProgress(progress: number) {
    this.progress = progress;
  }

  reset() {
    this.loading = false;
    this.progress = 0;
    this.message = "";
    this.error = null;
  }
}
