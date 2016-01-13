Resin CLI
=========

[![npm version](https://badge.fury.io/js/resin-cli.svg)](http://badge.fury.io/js/resin-cli)
[![dependencies](https://david-dm.org/resin-io/resin-cli.png)](https://david-dm.org/resin-io/resin-cli.png)
[![Build Status](https://travis-ci.org/resin-io/resin-cli.svg?branch=master)](https://travis-ci.org/resin-io/resin-cli)
[![Build status](https://ci.appveyor.com/api/projects/status/45i7d0m0patxj420?svg=true)](https://ci.appveyor.com/project/jviotti/resin-cli)

Join our online chat at [![Gitter chat](https://badges.gitter.im/resin-io/chat.png)](https://gitter.im/resin-io/chat)

The official Resin CLI tool.

Requisites
----------

- [NodeJS](https://nodejs.org) (at least v0.10)
- [Git](https://git-scm.com)

Getting Started
---------------

### Installing

This might require elevated privileges in some environments.

```sh
$ npm install --global --production resin-cli
```

### List available commands

```sh
$ resin help
```

### Run the quickstart wizard

```sh
$ resin quickstart
```

FAQ
---

### Where is my configuration file?

The per-user configuration file lives in `$HOME/.resinrc.yml` or `%UserProfile%\_resinrc.yml`, in Unix based operating systems and Windows respectively.

The Resin CLI also attempts to read a `resinrc.yml` file in the current directory, which takes precedence over the per-user configuration file.

### How do I point the Resin CLI to staging?

The easiest way is to set the `RESINRC_RESIN_URL=resinstaging.io` environment variable.

Alternatively, you can edit your configuration file and set `resinUrl: resinstaging.io` to persist this setting.

### How do I make the Resin CLI persist data in another directory?

The Resin CLI persists your session token, as well as cached images in `$HOME/.resin` or `%UserProfile%\_resin`.

Pointing the Resin CLI to persist data in another location is necessary in certain environments, like a server, where there is no home directory, or a device running Resin OS, which erases all data after a restart.

You can accomplish this by setting `RESINRC_DATA_DIRECTORY=/opt/resin` or adding `dataDirectory: /opt/resin` to your configuration file, replacing `/opt/resin` with your desired directory.

Support
-------

If you're having any problem, check our [troubleshooting guide](https://github.com/resin-io/resin-cli/blob/master/TROUBLESHOOTING.md) and if your problem is not addressed there, please [raise an issue](https://github.com/resin-io/resin-cli/issues/new) on GitHub and the Resin.io team will be happy to help.

You can also get in touch with us at our public [Gitter chat channel](https://gitter.im/resin-io/chat).

License
-------

The project is licensed under the Apache 2.0 license.
