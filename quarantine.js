class QuarantineSpec extends global.jasmine.Spec {
    constructor(attr) {
        super(attr);
    }

    addExpectationResult(passed, data, isError) {
        if (passed || !this.queueableFn.fn.retry || !this.queueableFn.fn.retry(data)) {
            super.addExpectationResult(passed, data, isError);
        }
    }
}

global.jasmine.Spec = QuarantineSpec;

function logFlakeyTest(description, data) {
    console.log('FLAKE FLAKE FLAKE ' + description + ' ' + JSON.stringify(data));
}

const makeRetryable = (testFunction, done, description) => {
    testFunction.retry = (data) => {
        if (testFunction.permittedRetries <= 0) {
            return false;
        }
        logFlakeyTest(description, data);
        testFunction.permittedRetries--;
        testFunction(done);
        return true;
    };
};

test.quarantine = (description, testFn, afterTestRunFn = () => {
}) => {
    const executeRealTest = (
        testFn.length < 1
            ? (done) => testFn()
            : (done) => testFn(done)
    );


    const retryableTestFunction = (done) => {
        makeRetryable(retryableTestFunction, done, description);

        try {
            (executeRealTest(done) || Promise.resolve()).then(() => {
                done();
            }).catch(e => {
                done.fail(e)
            });
        } catch (e) {
            done.fail(e);
        } finally {
            afterTestRunFn();
        }


    };

    retryableTestFunction.permittedRetries = 1;

    test(description, retryableTestFunction);
};