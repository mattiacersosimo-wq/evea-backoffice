import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

const connectChain = async () => {
  // For more information about using metamask with web3, see: https://docs.metamask.io/guide/
  const metamaskProvider = await detectEthereumProvider();
  await metamaskProvider.request({ method: "eth_requestAccounts" });
  // Check the chain ID to ensure we are on the correct network
  const chainId = await metamaskProvider.request({ method: "eth_chainId" });
  // If we are not on bsc testnet, switch to it
  // This is a good resource for chain IDs: https://chainlist.org/
  //for production 0x38
  if (chainId !== "0x38") {
    try {
      await metamaskProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          // Add chain to metamask
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x38",
                chainName: "Binance Smart Chain",
                nativeCurrency: {
                  name: "Binance Coin",
                  symbol: "BNB",
                  decimals: 18,
                },
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                blockExplorerUrls: ["https://bscscan.com"],
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
          console.log("addError", addError);
        }
      }
      // handle other "switch" errors
    }
  }

  // Instantiate the ethers provider and signer
  const ethersProvider = new ethers.providers.Web3Provider(metamaskProvider);
  const signer = ethersProvider.getSigner();
  const address = await signer.getAddress();

  return { signer, address };
};

export default connectChain;
