describe("quarantine retry with expect", () => {
	let testRuns = 0;

	test.quarantine("fails first time", () => {
		testRuns++;
		if (testRuns < 2) {
			expect(true).toBe(false);
		}
	}, () => expect(testRuns).toBe(2))

});

describe("quarantine retry with fail", () => {
	let testRuns = 0;

	test.quarantine("fails first time", () => {
		testRuns++;
		if (testRuns < 2) {

			fail('fails first time');


		}
	}, () => expect(testRuns).toBe(2));

});

describe("quarantine retry with done", () => {
	let testRuns = 0;

	test.quarantine("fails first time", (done) => {
		testRuns++;
		if (testRuns < 2) {
			done.fail('should fail first time');
		}
		done();
	}, () => expect(testRuns).toBe(2));

});

describe("quarantine retry with async", () => {
	let testRuns = 0;

	test.quarantine("fails first time", async () => {
		testRuns++;
		if (testRuns < 2) {
			fail('should fail first time');
		}
	}, () => expect(testRuns).toBe(2));

});