var FallbackTask = artifacts.require("./FallbackTask.sol")
const util = require('./utils');
const expectThrow = util.expectThrow;

contract('FallbackTask', function (accounts) {

	var contract;
	var owner = accounts[0];
	var bob = accounts[1];
	var carol = accounts[2];
	var weiLimit = 10;
	var totalWei = 0;


	beforeEach(function () {
		return FallbackTask.new(bob, carol, weiLimit, {
			from: owner
		}).then(function (instance) {
			contract = instance;
		});
	});

	it("should be owned by owner", async function () {
		let _owner = await contract.owner({
			from: owner
		});
		assert.strictEqual(_owner, owner, "contract is not owned by owner");
	});
})