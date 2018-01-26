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

	it("should transfer the amount to bob", async function () {
		let initialBalance = web3.eth.getBalance(bob).toNumber();
		await contract.fallback({
			from: owner,
			value: 7
		})
		let finalBalance = web3.eth.getBalance(bob).toNumber();
		assert.equal(finalBalance, initialBalance + 5, "The amount wasn't transferred properly");
	});

	it("should split the amount and transfer it to bob and carol", async function () {
		await contract.fallback({
			from: owner,
			value: 4
		})
		let initialBalanceBob = web3.eth.getBalance(bob).toNumber();
		let initialBalanceCarol = web3.eth.getBalance(carol).toNumber();
		await contract.fallback({
			from: owner,
			value: 4
		})
		let finalBalanceBob = web3.eth.getBalance(bob).toNumber();
		let finalBalanceCarol = web3.eth.getBalance(carol).toNumber();
		assert.equal(finalBalanceBob, initialBalanceBob + 1, "The amount wasn't transferred properly");
		assert.equal(finalBalanceCarol, finalBalanceCarol + 3, "The amount wasn't transferred properly");
	})

	it("should transfer the amount to carol", async function () {
		let initialBalance = web3.eth.getBalance(carol).toNumber();
		await contract.fallback({
			from: owner,
			value: 7
		})
		await contract.fallback({
			from: owner,
			value: 7
		})
		let finalBalance = web3.eth.getBalance(carol).toNumber();
		assert.equal(finalBalance, initialBalance + 7, "The amount wasn't transferred properly");
	})

	it("should emit one event if the transfer to bob is successful", async function () {
		let expectedEvent = 'FallbackCompleted';
		let result = await contract.fallback({
			from: owner,
			value: 7
		})
		assert.lengthOf(result.logs, 1, "There should be 1 event emitted from transferring the value!");
		assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
	})

	it("should emit two event if the transfer to carol is successful", async function () {
		let expectedEvent = 'FallbackCompleted';
		await contract.fallback({
			from: owner,
			value: 7
		})

		let result = await contract.fallback({
			from: owner,
			value: 7
		})
		assert.lengthOf(result.logs, 2, "There should be 2 events emitted from transferring the value!");
		assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
	})

	it("should emit two events if the transfer to carol and bob is successful", async function () {
		let expectedEvent = 'FallbackCompleted';
		await contract.fallback({
			from: owner,
			value: 4
		})

		let result = await contract.fallback({
			from: owner,
			value: 7
		})
		assert.lengthOf(result.logs, 2, "There should be 2 events emitted from transferring the value!");
		assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
	})

	it("should throw if the value of the message is not greater than zero", async function () {
		await expectThrow(contract.fallback({
			from: owner,
			value: 0
		}))
	})

})