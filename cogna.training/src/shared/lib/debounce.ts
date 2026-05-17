export function debounce<TProps extends unknown[]>(
	callback: (...arg: TProps) => any,
	delay: number,
) {
	let timeout: NodeJS.Timeout;

	return function (...args: TProps) {
		clearTimeout(timeout);

		timeout = setTimeout(() => {
			// @ts-ignore
			callback.apply(this, args);
		}, delay);
	};
}
