pragma solidity ^0.4.18;
import "./Ownable.sol";

contract FallbackTask is Ownable {

	address public bob;
	address public carol;
	uint public weiLimit;
	uint public totalWei;

	event FallbackCompleted(address indexed previousOwner, uint amount);

	function FallbackTask(address bobAddress, address carolAddress, uint weiLimitValue) public {
		bob = bobAddress;
		carol = carolAddress;
		weiLimit = weiLimitValue;
	}

	function fallback() public payable {
		require(msg.value > 0);
		if (totalWei <= weiLimit) {
			if (totalWei + msg.value <= weiLimit) {
				bob.transfer(msg.value);
				FallbackCompleted(bob,msg.value);
			} else {
				var valueOverLimit = totalWei + msg.value - weiLimit;
				carol.transfer(valueOverLimit);
				bob.transfer(msg.value - valueOverLimit);
				FallbackCompleted(carol,valueOverLimit);
				FallbackCompleted(bob, msg.value - valueOverLimit);
			}
		} else {
			carol.transfer(msg.value);
			FallbackCompleted(carol,msg.value);
		}
		totalWei += msg.value;
	}

}