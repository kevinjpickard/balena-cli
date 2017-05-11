// Generated by CoffeeScript 1.12.5
var Docker, Promise, _, chalk, dockerPort, dockerTimeout, filterOutSupervisorContainer, form;

Promise = require('bluebird');

_ = require('lodash');

Docker = require('docker-toolbelt');

form = require('resin-cli-form');

chalk = require('chalk');

exports.dockerPort = dockerPort = 2375;

exports.dockerTimeout = dockerTimeout = 2000;

exports.filterOutSupervisorContainer = filterOutSupervisorContainer = function(container) {
  var i, len, name, ref;
  ref = container.Names;
  for (i = 0, len = ref.length; i < len; i++) {
    name = ref[i];
    if (name.includes('resin_supervisor')) {
      return false;
    }
  }
  return true;
};

exports.selectContainerFromDevice = Promise.method(function(deviceIp, filterSupervisor) {
  var docker;
  if (filterSupervisor == null) {
    filterSupervisor = false;
  }
  docker = new Docker({
    host: deviceIp,
    port: dockerPort,
    timeout: dockerTimeout
  });
  return docker.listContainersAsync({
    all: true
  }).filter(function(container) {
    if (!filterSupervisor) {
      return true;
    }
    return filterOutSupervisorContainer(container);
  }).then(function(containers) {
    if (_.isEmpty(containers)) {
      throw new Error("No containers found in " + deviceIp);
    }
    return form.ask({
      message: 'Select a container',
      type: 'list',
      choices: _.map(containers, function(container) {
        var containerName, containerStatus, shortContainerId;
        containerName = container.Names[0] || 'Untitled';
        shortContainerId = ('' + container.Id).substr(0, 11);
        containerStatus = container.Status;
        return {
          name: containerName + " (" + shortContainerId + ") - " + containerStatus,
          value: container.Id
        };
      })
    });
  });
});

exports.pipeContainerStream = Promise.method(function(arg) {
  var container, deviceIp, docker, follow, name, outStream, ref;
  deviceIp = arg.deviceIp, name = arg.name, outStream = arg.outStream, follow = (ref = arg.follow) != null ? ref : false;
  docker = new Docker({
    host: deviceIp,
    port: dockerPort
  });
  container = docker.getContainer(name);
  return container.inspectAsync().then(function(containerInfo) {
    var ref1;
    return containerInfo != null ? (ref1 = containerInfo.State) != null ? ref1.Running : void 0 : void 0;
  }).then(function(isRunning) {
    return container.attachAsync({
      logs: !follow || !isRunning,
      stream: follow && isRunning,
      stdout: true,
      stderr: true
    });
  }).then(function(containerStream) {
    return containerStream.pipe(outStream);
  })["catch"](function(err) {
    err = '' + err.statusCode;
    if (err === '404') {
      return console.log(chalk.red.bold("Container '" + name + "' not found."));
    }
    throw err;
  });
});

exports.getSubShellCommand = require('../../utils/helpers');
