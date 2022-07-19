const toHive = document.getElementById('to_hive');
const toPolygon = document.getElementById('to_polygon');
const container = document.getElementById('container');

const web3 = new Web3()

toHive.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

toPolygon.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

//HBD to pHBD
function wrap(){
	let addressTo = document.getElementById("polygon_address").value
	let amount = document.getElementById("hive_amount").value
	let hiveAccountFrom = window.prompt("Your hive username");

	let error = false

	if (amount < 1){
		alert("Amount should be more than 1 HIVE!");
		error = true;
	}
	if (!web3.utils.isAddress(addressTo)){
		alert("Invalid Polygon address!");
		error = true;
	}

	if (!error){
		if(window.hive_keychain) {
			window.hive_keychain.requestTransfer(hiveAccountFrom, "p-hive", parseFloat(amount).toFixed(3), addressTo, "HIVE", () => {
				console.log('Request sent!', amount);
			}, false);
		} else {
			alert("Send "+parseFloat(amount).toFixed(3)+" HIVE to @p-hive with memo: " + addressTo)
		}
	}
}


async function unwrap(){
	let address = await connectMetamask()
	let hiveAddressTo = document.getElementById("hive_address").value
	let amount = parseFloat(document.getElementById("polygon_amount").value * 1000).toFixed(0)

	if (parseInt(ethereum.chainId, 16)  != 137 || ethereum.chainId != 137){
		alert("Switch to Polygon mainnet! Current chain ID: " + ethereum.chainId)
		return
	}

	hive.api.getAccounts([hiveAddressTo], async function(err, response){
  	if (response.length == 0) alert("invalid Hive username!")
		else {
			let contract = '0x456320e9b87a7c84a53b8ab300067f3a29aab301'
			let contractObject = new web3.eth.Contract(ABI, contract);
			let contractFunction = await contractObject.methods['convertTokenWithTransfer'](amount, hiveAddressTo).encodeABI(); //multiply by 10**3 to remove decimal places

			const transactionParameters = {
				nonce: '0x00', // ignored by MetaMask
				to: contract, // Required except during contract publications.
				from: address, // must match user's active address.
				data: contractFunction, // Optional, but used for defining smart contract creation and interaction.
				chainId: 137, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
				gas: '0x30d40'
			};

			const txHash = await ethereum.request({
				method: 'eth_sendTransaction',
				params: [transactionParameters],
			});
			console.log(txHash)

			alert("Transaction sent: " + txHash)
		}
	});
}

async function connectMetamask(){
	if (typeof window.ethereum !== 'undefined') {
		let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		return accounts[0];
	} else {
		alert("MetaMask is not installed!")
	}
}
