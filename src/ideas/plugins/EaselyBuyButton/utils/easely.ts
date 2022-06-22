// @ts-ignore
import Web3 from "web3/dist/web3.min.js";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import BN from "bn.js";
import { TransactionReceipt } from "web3-core";

type Listing = {
  id: string;
  network: Network;
  signature: string;
  easelySignature: string;
  unsignedContent: any;
  contractDetails: ContractDetails;
  accessType: ListingAccessType;
  priceInEth: number;
};

type RandomizedContractDetails = {
  mintLimitPerTransaction: number;
};

type ContractDetails = {
  type: ContractType;
  abi: string;
  address: string;
  randomized?: RandomizedContractDetails;
};

type StandardCollectionParams = {
  claimable: boolean;
  version: number;
  nonce: number;
  startPrice: string;
  endPrice: string;
  startTime: number;
  endTime: number;
  ipfsHash: string;
  claimedIpfsHash: string;
};

type RandomizedCollectionParams = {
  version: number;
  startPrice: string;
  endPrice: string;
  startTime: number;
  endTime: number;
  mintAmount: number;
};

type RandomizedCollectionRestrictedListingParams = {
  version: number;
  nonce: number;
  price: string;
  amount: number;
  allowedAddress: string;
};

type RandomizedCollectionMintOptions = {
  // if the creator has set a fixed number to mint per transaction, otherwise 0
  fixedMintsPerTransaction: number;
  // maximum number of mints per transaction
  maxMintsPerTransaction: number;
  // whether the user can specify how many NFTs they want
  canSelectQuantity: boolean;
};

enum ListingAccessType {
  General = "GENERAL",
  Restricted = "RESTRICTED",
}

enum ContractType {
  ERC721ARandomizedCollection = "ERC721A_RANDOMIZED_COLLECTION",
  ERC721StandardCollection = "ERC721_STANDARD_COLLECTION",
  // ERC721RandomizedCollectionV2 is deprecated in favor of ERC721ARandomizedCollection
  ERC721RandomizedCollectionV2 = "ERC721_RANDOMIZED_COLLECTION_V2",
}

type Network = "mainnet" | "rinkeby";

const getTotalPrice = (priceInWei: string, mintAmount: number) => {
  const price = new BN(priceInWei);
  const mintCount = new BN(mintAmount);
  return String(price.mul(mintCount));
};

const getListingEndpoint = (listingId: string, network: Network): string => {
  switch (network) {
    case "mainnet":
      return `https://api.easely.io/v1/listings/${listingId}?utm_source=muse`;
    case "rinkeby":
      return `https://api.rinkeby.easely.io/v1/listings/${listingId}?utm_source=muse`;
  }
};

const getListingFromNetwork = async (
  listingId: string,
  network: Network
): Promise<Listing> => {
  const resp = await fetch(getListingEndpoint(listingId, network));
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }

  const respJSON = await resp.json();
  if (!respJSON) {
    throw new Error(`Listing ${listingId} not found`);
  }

  respJSON.network = network;

  const unsignedContentJSON = JSON.parse(respJSON.unsignedContent);
  const priceInWei: string =
    unsignedContentJSON.startPrice || unsignedContentJSON.price;
  respJSON.priceInEth = Number(Web3.utils.fromWei(new BN(priceInWei), "ether"));

  return Promise.resolve(respJSON as Listing);
};

const getListing = async (listingId: string): Promise<Listing> => {
  try {
    const listing = await getListingFromNetwork(listingId, "mainnet");
    return Promise.resolve(listing);
  } catch (e) {
    return getListingFromNetwork(listingId, "rinkeby");
  }
};

const mintFromRandomizedListing = async (
  contract: Contract,
  listing: Listing,
  numberToMint: number,
  account: string,
  setTxHash: (hash: string) => void
): Promise<TransactionReceipt> => {
  const params = JSON.parse(
    listing.unsignedContent
  ) as RandomizedCollectionParams;
  return await contract.methods
    .mint(
      params.version,
      params.mintAmount,
      numberToMint,
      [params.startPrice, params.endPrice, params.startTime, params.endTime],
      listing.signature
    )
    .send({
      from: account,
      value: getTotalPrice(params.startPrice, numberToMint),
    })
    .on("transactionHash", setTxHash);
};

const mintFromRandomizedListingRestricted = async (
  contract: Contract,
  listing: Listing,
  numberToMint: number,
  account: string,
  setTxHash: (hash: string) => void
): Promise<TransactionReceipt> => {
  const params = JSON.parse(
    listing.unsignedContent
  ) as RandomizedCollectionRestrictedListingParams;
  return await contract.methods
    .mintAllow(
      params.allowedAddress,
      params.version,
      params.nonce,
      params.price,
      params.amount,
      numberToMint,
      listing.signature
    )
    .send({ from: account, value: getTotalPrice(params.price, numberToMint) })
    .on("transactionHash", setTxHash);
};

const mintFromRandomized721AListing = async (
  contract: Contract,
  listing: Listing,
  numberToMint: number,
  account: string,
  setTxHash: (hash: string) => void
): Promise<TransactionReceipt> => {
  const params = JSON.parse(
    listing.unsignedContent
  ) as RandomizedCollectionParams;
  return await contract.methods
    .mint(
      params.version,
      params.mintAmount,
      numberToMint,
      [params.startPrice, params.endPrice, params.startTime, params.endTime],
      listing.signature,
      listing.easelySignature
    )
    .send({
      from: account,
      value: getTotalPrice(params.startPrice, numberToMint),
    })
    .on("transactionHash", setTxHash);
};

const mintFromRandomized721AListingRestricted = async (
  contract: Contract,
  listing: Listing,
  numberToMint: number,
  account: string,
  setTxHash: (hash: string) => void
): Promise<TransactionReceipt> => {
  const params = JSON.parse(
    listing.unsignedContent
  ) as RandomizedCollectionRestrictedListingParams;
  return await contract.methods
    .mintAllow(
      params.allowedAddress,
      params.version,
      params.nonce,
      params.price,
      params.amount,
      numberToMint,
      listing.signature,
      listing.easelySignature
    )
    .send({ from: account, value: getTotalPrice(params.price, numberToMint) })
    .on("transactionHash", setTxHash);
};

const mintFromStandardListing = async (
  contract: Contract,
  listing: Listing,
  account: string,
  setTxHash: (hash: string) => void
): Promise<TransactionReceipt> => {
  const params = JSON.parse(
    listing.unsignedContent
  ) as StandardCollectionParams;
  return await contract.methods
    .buyNewToken(
      params.claimable,
      params.version,
      params.nonce,
      [params.startPrice, params.endPrice, params.startTime, params.endTime],
      params.ipfsHash,
      params.claimedIpfsHash,
      listing.signature
    )
    .send({ from: account, value: params.startPrice })
    .on("transactionHash", setTxHash);
};

const chainIdNumber = (network: Network): number => {
  switch (network) {
    case "mainnet":
      return 1;
    case "rinkeby":
      return 4;
  }
};

const chainIdHex = (network: Network): string => {
  switch (network) {
    case "mainnet":
      return "0x1";
    case "rinkeby":
      return "0x4";
  }
};

// checks that the user is on the correct chain and prompts them to switch if they are not.
const checkChain = async (web3: any, listing: Listing): Promise<void> => {
  const chainId = await web3.eth.getChainId();
  if (chainId !== chainIdNumber(listing.network)) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex(listing.network) }],
    });
  }
};

const mintFromListing = async (
  web3: any,
  listing: Listing,
  numberToMint: number,
  setTxHash: (hash: string) => void
): Promise<TransactionReceipt> => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  await checkChain(web3, listing);
  const abi = JSON.parse(listing.contractDetails.abi);
  const mintingContract = new web3.eth.Contract(
    abi as AbiItem[],
    listing.contractDetails.address
  );
  switch (listing.contractDetails.type) {
    case ContractType.ERC721RandomizedCollectionV2:
      switch (listing.accessType) {
        case ListingAccessType.General:
          return mintFromRandomizedListing(
            mintingContract,
            listing,
            numberToMint,
            account,
            setTxHash
          );
        case ListingAccessType.Restricted:
          return mintFromRandomizedListingRestricted(
            mintingContract,
            listing,
            numberToMint,
            account,
            setTxHash
          );
      }
      break;
    case ContractType.ERC721ARandomizedCollection:
      switch (listing.accessType) {
        case ListingAccessType.General:
          return mintFromRandomized721AListing(
            mintingContract,
            listing,
            numberToMint,
            account,
            setTxHash
          );
        case ListingAccessType.Restricted:
          return mintFromRandomized721AListingRestricted(
            mintingContract,
            listing,
            numberToMint,
            account,
            setTxHash
          );
      }
      break;
    case ContractType.ERC721StandardCollection:
      return mintFromStandardListing(
        mintingContract,
        listing,
        account,
        setTxHash
      );
  }
};

const isRandomizedCollection = (listing: Listing): boolean => {
  const contractType = listing.contractDetails.type;
  return (
    contractType === ContractType.ERC721RandomizedCollectionV2 ||
    contractType === ContractType.ERC721ARandomizedCollection
  );
};

const getRandomizedCollectionMintOptions = (
  listing: Listing
): RandomizedCollectionMintOptions | null => {
  if (!isRandomizedCollection(listing)) {
    return null;
  }

  const randomizedContractDetails = listing.contractDetails.randomized;
  if (!randomizedContractDetails) {
    return null;
  }

  let fixedMintsPerTransaction = 0;
  if (listing.accessType === ListingAccessType.General) {
    const params = JSON.parse(
      listing.unsignedContent
    ) as RandomizedCollectionParams;
    fixedMintsPerTransaction = params.mintAmount;
  } else if (listing.accessType === ListingAccessType.Restricted) {
    const params = JSON.parse(
      listing.unsignedContent
    ) as RandomizedCollectionRestrictedListingParams;
    fixedMintsPerTransaction = params.amount;
  } else {
    return null;
  }

  let maxMintsPerTransaction =
    randomizedContractDetails.mintLimitPerTransaction;
  if (maxMintsPerTransaction === 0) {
    if (
      listing.contractDetails.type === ContractType.ERC721RandomizedCollectionV2
    ) {
      maxMintsPerTransaction = 500;
    }
    maxMintsPerTransaction = 100;
  }

  const canSelectQuantity =
    fixedMintsPerTransaction === 0 && maxMintsPerTransaction > 1;

  return {
    fixedMintsPerTransaction,
    maxMintsPerTransaction,
    canSelectQuantity,
  };
};

export { getListing, mintFromListing, getRandomizedCollectionMintOptions };
export type { Listing, RandomizedCollectionMintOptions };
