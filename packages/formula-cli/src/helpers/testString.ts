import { compileString } from "./compileString";

export type TestResult = {
	isSuccess: boolean
	number: number
	value: string
};
export type TestResults = TestResult[];

export const testString = (formula: string): TestResults => {
	const { result, context } = compileString(formula);

	// Loop tests
	const testResults: TestResults = [];
	let testNumber = 1;
	for(const test of context.test) {
		const testResult = new RegExp(result).test(test.value);
		
		testResults.push({
			isSuccess: testResult,
			number: testNumber,
			value: test.value
		});
		testNumber++;
	}
	return testResults;
};