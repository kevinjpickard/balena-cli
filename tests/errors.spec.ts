/**
 * @license
 * Copyright 2020 Balena Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect } from 'chai';
import * as sinon from 'sinon';
import ErrorsModule from '../build/errors';
import { getHelp } from '../build/utils/messages';

function red(s: string) {
	return `\u001b[31m${s}\u001b[39m`;
}

describe('handleError() function', () => {
	const sandbox = sinon.createSandbox();
	let printErrorMessage: any;
	let printExpectedErrorMessage: any;
	let captureException: any;
	let processExit: any;

	beforeEach(() => {
		printErrorMessage = sandbox.stub(ErrorsModule, 'printErrorMessage');
		printExpectedErrorMessage = sandbox.stub(
			ErrorsModule,
			'printExpectedErrorMessage',
		);
		captureException = sinon.stub();
		// @ts-ignore
		sandbox.stub(ErrorsModule, 'getSentry').resolves({ captureException });
		processExit = sandbox.stub(process, 'exit');
	});
	afterEach(() => {
		sandbox.restore();
	});

	it('should call printErrorMessage and exit when passed a string', async () => {
		const errorString = 'a string';

		await ErrorsModule.handleError(errorString);

		expect(printErrorMessage.calledOnce).to.be.true;
		expect(printErrorMessage.getCall(0).args[0]).to.equal(errorString);

		expect(printExpectedErrorMessage.notCalled).to.be.true;
		expect(captureException.notCalled).to.be.true;
		expect(processExit.notCalled).to.be.true;
	});

	it('should process ExpectedErrors as expected', async () => {
		const errorMessage = 'an expected error';
		const error = new ErrorsModule.ExpectedError(errorMessage);

		await ErrorsModule.handleError(error);

		expect(printExpectedErrorMessage.calledOnce).to.be.true;
		expect(printExpectedErrorMessage.getCall(0).args[0]).to.equal(errorMessage);

		expect(printErrorMessage.notCalled).to.be.true;
		expect(captureException.notCalled).to.be.true;
		expect(processExit.notCalled).to.be.true;
	});

	it('should process subclasses of ExpectedErrors as expected', async () => {
		const errorMessage = 'an expected error';
		const error = new ErrorsModule.NotLoggedInError(errorMessage);

		await ErrorsModule.handleError(error);

		expect(printExpectedErrorMessage.calledOnce).to.be.true;
		expect(printExpectedErrorMessage.getCall(0).args[0]).to.equal(errorMessage);

		expect(printErrorMessage.notCalled).to.be.true;
		expect(captureException.notCalled).to.be.true;
		expect(processExit.notCalled).to.be.true;
	});

	it('should process unexpected errors correctly (no debug)', async () => {
		const errorMessage = 'an unexpected error';
		await ErrorsModule.handleError(new Error(errorMessage));

		expect(printErrorMessage.calledOnce).to.be.true;
		expect(printErrorMessage.getCall(0).args[0]).to.equal(errorMessage);
		expect(captureException.calledOnce).to.be.true;
		expect(processExit.calledOnce).to.be.true;

		expect(printExpectedErrorMessage.notCalled);
	});

	it('should process unexpected errors correctly (debug)', async () => {
		sandbox.stub(process, 'env').value({ DEBUG: true });

		const errorMessage = 'an unexpected error';
		const error = new Error(errorMessage);
		await ErrorsModule.handleError(error);

		const expectedMessage = errorMessage + '\n\n' + error.stack;

		expect(printErrorMessage.calledOnce).to.be.true;
		expect(printErrorMessage.getCall(0).args[0]).to.equal(expectedMessage);
		expect(captureException.calledOnce).to.be.true;
		expect(processExit.calledOnce).to.be.true;

		expect(printExpectedErrorMessage.notCalled);
	});

	const messagesToMatch = [
		'BalenaAmbiguousApplication:',
		'BalenaApplicationNotFound:',
		'BalenaDeviceNotFound:',
		'BalenaExpiredToken:',
		'Missing argument',
		'Missing arguments',
		'Unexpected argument',
		'Unexpected arguments',
		'to be one of',
	];

	messagesToMatch.forEach(message => {
		it(`should match as expected: "${message}"`, async () => {
			await ErrorsModule.handleError(new Error(message));

			expect(
				printExpectedErrorMessage.calledOnce,
				`Pattern not expected: ${message}`,
			).to.be.true;

			expect(printErrorMessage.notCalled).to.be.true;
			expect(captureException.notCalled).to.be.true;
			expect(processExit.notCalled).to.be.true;
		});
	});
});

describe('printErrorMessage() function', () => {
	it('should correctly output message', () => {
		const consoleError = sinon.spy(console, 'error');

		const errorMessageLines = [
			'first line should be red',
			'second line should not be red',
			'third line should not be red',
		];

		const inputMessage = errorMessageLines.join('\n');
		const expectedOutputMessages = [
			red(errorMessageLines[0]),
			errorMessageLines[1],
			errorMessageLines[2],
		];

		ErrorsModule.printErrorMessage(inputMessage);

		expect(consoleError.callCount).to.equal(4);
		expect(consoleError.getCall(0).args[0]).to.equal(expectedOutputMessages[0]);
		expect(consoleError.getCall(1).args[0]).to.equal(expectedOutputMessages[1]);
		expect(consoleError.getCall(2).args[0]).to.equal(expectedOutputMessages[2]);
		expect(consoleError.getCall(3).args[0]).to.equal(`\n${getHelp}\n`);

		consoleError.restore();
	});
});

describe('printExpectedErrorMessage() function', () => {
	it('should correctly output message', () => {
		const consoleError = sinon.spy(console, 'error');

		const errorMessage = ['first line', 'second line'].join('\n');

		ErrorsModule.printExpectedErrorMessage(errorMessage);

		expect(consoleError.calledOnce).to.be.true;
		expect(consoleError.getCall(0).args[0]).to.equal(errorMessage + '\n');

		consoleError.restore();
	});
});
