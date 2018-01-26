var FallbackTask = artifacts.require("./FallbackTask.sol");
var weiLimit = 10;

module.exports = function (deployer, network, accounts) {
	deployer.deploy(FallbackTask, accounts[0], accounts[1], weiLimit);
};