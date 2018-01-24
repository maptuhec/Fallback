var FallbackTask = artifacts.require("./FallbackTask.sol");

module.exports = function (deployer) {
	deployer.deploy(FallbackTask);
};