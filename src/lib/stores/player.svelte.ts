import { TurnStore } from "./turns.svelte.js";

export class Player {
  private turnStore: TurnStore;
  private playbackInterval: number | null = null;

  // State
  index = $state(0);
  playing = $state(false);
  scroll = $state(true);
  speed = $state(1); // Playback speed multiplier

  constructor(turnStore: TurnStore) {
    this.turnStore = turnStore;
  }

  // Derived values
  get current() {
    return this.turnStore.get(this.index);
  }

  get hasNext() {
    return this.index < this.turnStore.total - 1;
  }

  get hasPrev() {
    return this.index > 0;
  }

  get total() {
    return this.turnStore.total;
  }

  // Navigation
  next() {
    if (this.hasNext) {
      this.index++;
    }
  }

  prev() {
    if (this.hasPrev) {
      this.index--;
    }
  }

  goto(index: number) {
    if (index >= 0 && index < this.turnStore.total) {
      this.index = index;
    }
  }

  first() {
    this.index = 0;
  }

  last() {
    this.index = Math.max(0, this.turnStore.total - 1);
  }

  // Playback control
  play() {
    if (this.playing) return;
    
    this.playing = true;
    this.startPlaybackInterval();
  }

  pause() {
    this.playing = false;
    this.stopPlaybackInterval();
  }

  toggle() {
    if (this.playing) {
      this.pause();
    } else {
      // If at end, restart from beginning
      if (!this.hasNext && this.turnStore.total > 0) {
        this.index = 0;
      }
      this.play();
    }
  }

  // Speed control
  setSpeed(speed: number) {
    const validSpeed = Math.max(0.25, Math.min(4, speed));
    this.speed = validSpeed;
    
    // Restart interval if playing to apply new speed
    if (this.playing) {
      this.startPlaybackInterval();
    }
  }

  private startPlaybackInterval() {
    this.stopPlaybackInterval();
    
    const interval = 2000 / this.speed; // Base 2 seconds divided by speed
    this.playbackInterval = setInterval(() => {
      if (this.hasNext) {
        this.next();
      } else {
        this.pause();
      }
    }, interval) as unknown as number;
  }

  private stopPlaybackInterval() {
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }

  setScroll(scroll: boolean) {
    this.scroll = scroll;
  }

  reset() {
    this.pause();
    this.index = 0;
    this.scroll = true;
  }
}
