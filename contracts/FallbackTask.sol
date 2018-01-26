pragma solidity ^0.4.18;
import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';

contract FallbackTask is Ownable {

	address public bob;
	address public carol;
	uint public weiLimit;
	uint public totalWei;

	event FallbackCompleted(address person, uint amount);

	function FallbackTask(address bobAddress, address carolAddress, uint weiLimitValue) public {
		require(bobAddress > address(0));
		require(carolAddress > address(0));
		require(weiLimitValue > 0);
		bob = bobAddress;
		carol = carolAddress;
		weiLimit = weiLimitValue;
	}


	function fallback() public payable {
		require(msg.value > 0);
		if (totalWei >= weiLimit) {
			carol.transfer(msg.value);
			totalWei += msg.value;
			FallbackCompleted(carol, msg.value);
			return;
		} else {
			totalWei += msg.value;
			if (totalWei <= weiLimit) { 
				bob.transfer(msg.value);
				FallbackCompleted(bob, msg.value);
				return;
			}
			uint256 valueOverLimit = totalWei - weiLimit;
			carol.transfer(valueOverLimit);
			bob.transfer(msg.value - valueOverLimit);
			FallbackCompleted(carol, valueOverLimit);
			FallbackCompleted(bob, msg.value - valueOverLimit);
		}
	}

}