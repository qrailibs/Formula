export type MatcherAmount = {
	min: number,
	max?: number
};

export type MatcherParams = {
	optional: boolean;
	amount?: MatcherAmount;
};

export default function compileParams(original: string, params: MatcherParams, wrap: boolean = false): string {
	return original
		// Amount
		+ (params.amount
			? params.amount?.max
				// Min, Max
				? `{${params.amount?.min},${params.amount?.max}}`
				// Unlimited
				: params.amount?.min ? `{${params.amount?.min}}` : '+'
			: '')
		// Optional
		+ (params.optional ? '?' : '');
}