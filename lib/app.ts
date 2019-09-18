/**
 * @license
 * Copyright 2019 Balena Ltd.
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

import { globalInit } from './app-common';
import { AppOptions, routeCliFramework } from './preparser';

/**
 * CLI entrypoint, but see also `bin/balena` and `bin/balena-dev` which
 * call this function.
 */
export async function run(cliArgs = process.argv, options: AppOptions = {}) {
	// globalInit() must be called very early on (before other imports) because
	// it sets up Sentry error reporting, global HTTP proxy settings, balena-sdk
	// shared options, and performs node version requirement checks.
	globalInit();
	await routeCliFramework(cliArgs, options);
}
