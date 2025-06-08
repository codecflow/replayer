/**
 * Animate a click at the current cursor position
 */
export const createAnimateClick =
	(setCursorScale: (scale: number) => void) => (callback: () => void) => {
		let clickAnimationRef: number | null = null;

		const startTime = performance.now();
		const duration = 300;
		const minScale = 0.5;

		const animateFrame = (timestamp: number) => {
			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / duration, 1);

			let scale;
			if (progress < 0.3) {
				scale = 1 - (1 - minScale) * (progress / 0.3);
			} else {
				const expandProgress = (progress - 0.3) / minScale;
				const bounce =
					Math.sin(expandProgress * Math.PI * 2) * 0.1 * Math.pow(1 - expandProgress, 2);
				scale = minScale + (1 - minScale) * expandProgress + bounce;
			}

			setCursorScale(scale);

			if (progress < 1) {
				clickAnimationRef = requestAnimationFrame(animateFrame);
			} else {
				setCursorScale(1);
				callback();
			}

			if (progress >= 0.3 && progress <= 0.32) {
				callback();
			}
		};

		clickAnimationRef = requestAnimationFrame(animateFrame);

		return () => {
			if (clickAnimationRef) {
				cancelAnimationFrame(clickAnimationRef);
			}
		};
	};

/**
 * Animate a drag from start to end position
 */
export const createAnimateDrag =
	(setDragProgress: (progress: number) => void, setCursorPosition: (position: number[]) => void) =>
	(startPos: number[], endPos: number[], callback: () => void) => {
		let dragAnimationRef: number | null = null;

		const startTime = performance.now();
		const duration = 500;

		const animateFrame = (timestamp: number) => {
			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / duration, 1);

			setDragProgress(progress);

			const newX = startPos[0] + (endPos[0] - startPos[0]) * progress;
			const newY = startPos[1] + (endPos[1] - startPos[1]) * progress;

			setCursorPosition([newX, newY]);

			if (progress < 1) {
				dragAnimationRef = requestAnimationFrame(animateFrame);
			} else {
				setDragProgress(1);
				callback();
			}
		};

		dragAnimationRef = requestAnimationFrame(animateFrame);

		return () => {
			if (dragAnimationRef) {
				cancelAnimationFrame(dragAnimationRef);
			}
		};
	};
