/**
 * @license
 * Copyright 2016-2019 Balena Ltd.
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
import { Command, flags } from '@oclif/command';
import { stripIndent } from 'common-tags';

import * as cf from '../../utils/common-flags';
import { CommandHelp } from '../../utils/oclif-utils';

type IArg<T> = import('@oclif/parser').args.IArg<T>;

interface FlagsDef {
	device: boolean;
	help: void;
}

interface ArgsDef {
	id: number;
	value: string;
}

export default class EnvRenameCmd extends Command {
	public static description = stripIndent`
		Change the value of an environment variable for an app or device.

		Change the value of an environment variable for an application or device,
		as selected by the '--device' option. The variable is identified by its
		database ID, rather than its name. The 'balena envs' command can be used
		to list the variable's ID.

		Service-specific variables are not currently supported. The following
		examples modify variables that apply to all services in an app or device.
`;
	public static examples = [
		'$ balena env rename 376 emacs',
		'$ balena env rename 376 emacs --device',
	];

	public static args: Array<IArg<any>> = [
		{
			name: 'id',
			required: true,
			description: 'environment variable numeric database ID',
			parse: input => parseInt(input, 10),
		},
		{
			name: 'value',
			required: true,
			description:
				"variable value; if omitted, use value from CLI's environment",
		},
	];

	// hardcoded 'env add' to avoid oclif's 'env:add' topic syntax
	public static usage =
		'env rename ' + new CommandHelp({ args: EnvRenameCmd.args }).defaultUsage();

	public static flags: flags.Input<FlagsDef> = {
		device: flags.boolean({
			char: 'd',
			description:
				'select a device variable instead of an application variable',
		}),
		help: cf.help,
	};

	public async run() {
		const { args: params, flags: options } = this.parse<FlagsDef, ArgsDef>(
			EnvRenameCmd,
		);
		const balena = (await import('balena-sdk')).fromSharedOptions();

		await balena.pine.patch({
			resource: options.device
				? 'device_environment_variable'
				: 'application_environment_variable',
			id: params.id,
			body: {
				value: params.value,
			},
		});
	}
}
