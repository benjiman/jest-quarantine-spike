describe("quarantine retry with expect", () => {
	let testRuns = 0;

	test.quarantine("fails first time", () => {
		testRuns++;
		if (testRuns < 2) {
			expect(true).toBe(false);
		}
	}, () => expect(testRuns).toBe(2))

});

