import { createAnimateClick, createAnimateDrag } from '$lib/components/utils/animationUtils.js';
import type { Action, Position } from '$lib/types/index.js';

export class CursorStore {
	// State
	position = $state<Position>([0, 0]);
	scale = $state<number>(1);
	isDragging = $state<boolean>(false);
	dragStart = $state<Position>([0, 0]);
	dragEnd = $state<Position>([0, 0]);
	dragProgress = $state<number>(0);
	isClickAnimating = $state<boolean>(false);
	isMovingCursor = $state<boolean>(false);

  clickAnimationCleanup: (() => void) | null = null;
  dragAnimationCleanup: (() => void) | null = null;

	// Methods
	moveTo(x: number, y: number) {
		this.position = [x, y];
		this.isMovingCursor = true;

		// Reset moving flag after animation completes
		setTimeout(() => {
			this.isMovingCursor = false;
		}, 100);
	}

	click(x: number, y: number) {
		this.position = [x, y];
		this.isClickAnimating = true;

		// Clean up any existing animation
		if (this.clickAnimationCleanup) {
			this.clickAnimationCleanup();
			this.clickAnimationCleanup = null;
		}

		// Create and start the click animation
		const animateClick = createAnimateClick((scale) => this.setScale(scale));

		this.clickAnimationCleanup = animateClick(() => {
			this.isClickAnimating = false;
		});
	}

	startDrag(x: number, y: number) {
		this.position = [x, y];
		this.dragStart = [x, y];
		this.isDragging = true;
		this.dragProgress = 0;
	}

	updateDrag(x: number, y: number, progress: number) {
		this.dragEnd = [x, y];
		this.dragProgress = Math.min(1, Math.max(0, progress));

		// Update cursor position based on drag progress
		const newX = this.dragStart[0] + (this.dragEnd[0] - this.dragStart[0]) * this.dragProgress;
		const newY = this.dragStart[1] + (this.dragEnd[1] - this.dragStart[1]) * this.dragProgress;
		this.position = [newX, newY];
	}

	animateDrag(endX: number, endY: number) {
		this.dragEnd = [endX, endY];
		this.isDragging = true;

		// Clean up any existing animation
		if (this.dragAnimationCleanup) {
			this.dragAnimationCleanup();
			this.dragAnimationCleanup = null;
		}

		// Create and start the drag animation
		const animateDrag = createAnimateDrag(
			(progress) => (this.dragProgress = progress),
			(position) => (this.position = position as Position)
		);

		this.dragAnimationCleanup = animateDrag(this.dragStart, this.dragEnd, () => this.endDrag());
	}

	endDrag() {
		this.isDragging = false;
		this.dragProgress = 0;

		// Clean up any existing animation
		if (this.dragAnimationCleanup) {
			this.dragAnimationCleanup();
			this.dragAnimationCleanup = null;
		}
	}

	processActions(actions: Action[]) {
		// Process actions to update cursor position and trigger animations
		for (const action of actions) {
			switch (action.type) {
				case 'click':
					this.click(action.position[0], action.position[1]);
					break;
				case 'drag':
					this.startDrag(action.from[0], action.from[1]);
					this.animateDrag(action.to[0], action.to[1]);
					break;
				case 'type':
					// For type actions, we might want to show some visual feedback
					break;
				case 'scroll':
					// For scroll actions, we might want to show some visual feedback
					break;
				case 'key':
					// For key actions, we might want to show some visual feedback
					break;
			}
		}
	}

	setScale(scale: number) {
		this.scale = scale;
	}

	reset() {
		// Clean up any existing animations
		if (this.clickAnimationCleanup) {
			this.clickAnimationCleanup();
			this.clickAnimationCleanup = null;
		}

		if (this.dragAnimationCleanup) {
			this.dragAnimationCleanup();
			this.dragAnimationCleanup = null;
		}

		this.position = [0, 0];
		this.scale = 1;
		this.isDragging = false;
		this.dragStart = [0, 0];
		this.dragEnd = [0, 0];
		this.dragProgress = 0;
		this.isClickAnimating = false;
		this.isMovingCursor = false;
	}
}
