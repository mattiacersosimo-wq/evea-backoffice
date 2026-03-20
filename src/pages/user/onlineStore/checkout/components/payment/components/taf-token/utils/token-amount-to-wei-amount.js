import { ethers } from "ethers";

const tokenAmountToWeiAmount = (tokenAmount) =>
  ethers.utils.parseUnits(tokenAmount, 18);

export default tokenAmountToWeiAmount;
