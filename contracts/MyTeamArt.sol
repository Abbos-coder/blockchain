// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "hardhat/console.sol";

contract MyTeamArt is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    uint256 private feePercent; // The percentage that contract owner will get from each sale

    address private candidateOwner;

    IERC20 private currency;

    constructor(IERC20 _currency, uint256 _feePercent) {
        require(address(_currency) != address(0), "Address must not be zero");
        require(_feePercent >= 0, "Fee must not be less than 0");
        require(_feePercent <= 100, "Fee must not be more than 100");
        currency = _currency;
        feePercent = _feePercent;
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address creator;
        address owner;
        uint256 price;
        bool isOnSale;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    modifier ItemExists(uint256 itemId){
        require(itemId <= _itemIds.current() && idToMarketItem[itemId].itemId == itemId, "Could not find item");
        _;
    }

    event MarketItemCreated (
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address owner,
        uint256 price,
        bool isOnSale
    );

    event MarketItemListed(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address owner,
        uint256 price,
        bool isOnSale
    );

    event MarketItemUnlisted(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address owner,
        uint256 price,
        bool isOnSale
    );

    event MarketItemSold(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address owner,
        uint256 price,
        bool isOnSale
    );

    event MarketItemSetPrice(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address owner,
        uint256 price,
        bool isOnSale
    );

    event SetFeePercent(uint256 feePercent);

    event NewCandidateOwner(address candidateOwner);

    function renounceOwnership() public view override onlyOwner {
        revert("Renounce ownership not allowed");
    }

    function transferOwnership(address _candidateOwner) public override onlyOwner {
        require(_candidateOwner != address(0), "Ownable: No zero address");
        candidateOwner = _candidateOwner;
        emit NewCandidateOwner(_candidateOwner);
    }

    function claimOwnership() external {
        require(candidateOwner == msg.sender, "Ownable: Not the candidate");
        address oldOwner = owner();
        _transferOwnership(candidateOwner);
        candidateOwner = address(0);
        emit OwnershipTransferred(oldOwner, candidateOwner);
    }

    function getFee() public view returns (uint256) {
        return feePercent;
    }

    function setFeePercent(uint256 _feePercent) external onlyOwner {
        require(_feePercent >= 0, "Fee must not be less than 0");
        require(_feePercent <= 100, "Fee must not be more than 100");
        feePercent = _feePercent;
        emit SetFeePercent(feePercent);
    }

    function getCurrency() public view returns (IERC20) {
        return currency;
    }

    function setCurrency(IERC20 _currency) external onlyOwner {
        require(address(_currency) != address(0), "Address must not be zero");
        require(address(_currency) != address(currency), "Address must be different");
        currency = _currency;
    }

    function calculateFee(uint256 price) public view returns (uint256 _fee) {
        return price.div(100).mul(feePercent);
    }

    /* Places an item on sale */
    function listMarketItem(uint256 itemId, uint256 price) external ItemExists(itemId) nonReentrant {
        require(msg.sender == address(idToMarketItem[itemId].owner), "You are not owner of this item");
        require(idToMarketItem[itemId].isOnSale != true, "This item is already on sale!");
        require(price > 0, "Cannot sell item for free");

        IERC721(idToMarketItem[itemId].nftContract).transferFrom(
            msg.sender,
            address(this),
            idToMarketItem[itemId].tokenId
        );

        idToMarketItem[itemId].price = price;
        idToMarketItem[itemId].isOnSale = true;

        emit MarketItemListed(
            itemId,
            idToMarketItem[itemId].nftContract,
            idToMarketItem[itemId].tokenId,
            idToMarketItem[itemId].creator,
            msg.sender,
            idToMarketItem[itemId].price,
            true
        );
    }

    /* Creates an item on the marketplace and puts it on sale */
    function createMarketItem(address nftContract, uint256 tokenId, uint256 price) external nonReentrant returns (uint256) {
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "You are not owner of the NFT");
        require(price > 0, "Cannot sell item for free");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            msg.sender,
            price,
            true
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            msg.sender,
            price,
            true
        );
        return itemId;
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function buyMarketItem(address nftContract, uint256 itemId) external ItemExists(itemId) nonReentrant {
        require(msg.sender != idToMarketItem[itemId].owner, "You cannot buy your own NFT");

        uint256 price = idToMarketItem[itemId].price;

        require(idToMarketItem[itemId].isOnSale == true, "This item is unlisted");
        require(currency.balanceOf(msg.sender) >= price, "Insufficient balance");

        uint256 tokenId = idToMarketItem[itemId].tokenId;
        uint256 calculatedFee = calculateFee(price);
        // Transfer tokens to seller
        currency.safeTransferFrom(
            msg.sender,
            idToMarketItem[itemId].owner,
            price.sub(calculatedFee)
        );

        // Transfer NFT to buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idToMarketItem[itemId].owner = msg.sender;

        // Transfer fee to contract owner
        currency.safeTransferFrom(msg.sender, owner(), calculatedFee);

        idToMarketItem[itemId].isOnSale = false;
        _itemsSold.increment();

        emit MarketItemSold(
            itemId,
            idToMarketItem[itemId].nftContract,
            idToMarketItem[itemId].tokenId,
            idToMarketItem[itemId].creator,
            msg.sender,
            idToMarketItem[itemId].price,
            false
        );
    }

    function unlistMarketItem(uint256 itemId) external ItemExists(itemId) nonReentrant {
        require(idToMarketItem[itemId].isOnSale == true, "This item is unlisted");
        require(msg.sender == address(idToMarketItem[itemId].owner), "You are not owner of this item");

        IERC721(idToMarketItem[itemId].nftContract).transferFrom(
            address(this),
            msg.sender,
            idToMarketItem[itemId].tokenId
        );

        idToMarketItem[itemId].isOnSale = false;

        emit MarketItemUnlisted(
            itemId,
            idToMarketItem[itemId].nftContract,
            idToMarketItem[itemId].tokenId,
            idToMarketItem[itemId].creator,
            msg.sender,
            idToMarketItem[itemId].price,
            false
        );
    }

    function setMarketItemPrice(uint256 itemId, uint256 price) external ItemExists(itemId) nonReentrant {
        require(price > 0, "No item for free here");
        require(idToMarketItem[itemId].isOnSale == true, "This item is unlisted");
        require(msg.sender == address(idToMarketItem[itemId].owner), "You are not owner of this item");

        idToMarketItem[itemId].price = price;

        emit MarketItemSetPrice(
            itemId,
            idToMarketItem[itemId].nftContract,
            idToMarketItem[itemId].tokenId,
            idToMarketItem[itemId].owner,
            idToMarketItem[itemId].price,
            true
        );
    }

    function getMarketItem(uint256 itemId) public view returns (MarketItem memory) {
        MarketItem memory marketItem = idToMarketItem[itemId];
        return marketItem;
    }

    /* Returns all listed market items */
    function fetchMarketItems(uint256 page, uint256 limit) public view returns (MarketItem[] memory) {
        require(page > 0, "Page must be more than 0");
        require(limit > 0, "Limit must be more than 0");
        require(limit <= 100, "Max limit reached");

        // Count items first
        uint256 marketItemCount = 0;
        for (uint256 i = limit.mul(page).sub(limit).add(1); i <= limit.mul(page); i++) {
            if (idToMarketItem[i].itemId > 0 && idToMarketItem[i].isOnSale == true) {
                marketItemCount = marketItemCount.add(1);
            }
        }

        // Add items to array
        MarketItem[] memory items = new MarketItem[](marketItemCount);
        uint256 resultLength = 0;

        for (uint256 i = limit.mul(page).sub(limit).add(1); i <= limit.mul(page); i++) {
            if (idToMarketItem[i].itemId > 0 && idToMarketItem[i].isOnSale == true) {
                MarketItem storage currentItem = idToMarketItem[i];
                items[resultLength] = currentItem;
                resultLength = resultLength.add(1);
            }
        }
        return items;
    }

    /* Returns only items that a user has created */
    function fetchMyCreatedItems(address user, uint256 page, uint256 limit) public view returns (MarketItem[] memory) {
        require(page > 0, "Page must be more than 0");
        require(limit > 0, "Limit must be more than 0");
        require(limit <= 100, "Max limit reached");

        // Count items first
        uint256 marketItemCount = 0;
        for (uint256 i = limit.mul(page).sub(limit).add(1); i <= limit.mul(page); i++) {
            if (idToMarketItem[i].itemId > 0 && idToMarketItem[i].creator == user) {
                marketItemCount = marketItemCount.add(1);
            }
        }

        // Add items to array
        MarketItem[] memory items = new MarketItem[](marketItemCount);
        uint256 resultLength = 0;

        for (uint256 i = limit.mul(page).sub(limit).add(1); i <= limit.mul(page); i++) {
            if (idToMarketItem[i].itemId > 0 && idToMarketItem[i].creator == user) {
                MarketItem storage currentItem = idToMarketItem[i];
                items[resultLength] = currentItem;
                resultLength = resultLength.add(1);
            }
        }
        return items;
    }

    /* Returns only items a user put up for sale */
    function fetchMyItemsOnSale(address user, uint256 page, uint256 limit) public view returns (MarketItem[] memory) {
        require(page > 0, "Page must be more than 0");
        require(limit > 0, "Limit must be more than 0");
        require(limit <= 100, "Max limit reached");

        // Count items first
        uint256 marketItemCount = 0;
        for (uint256 i = limit.mul(page).sub(limit).add(1); i <= limit.mul(page); i++) {
            if (idToMarketItem[i].itemId > 0 && idToMarketItem[i].isOnSale == true && idToMarketItem[i].owner == user) {
                marketItemCount = marketItemCount.add(1);
            }
        }

        // Add items to array
        MarketItem[] memory items = new MarketItem[](marketItemCount);
        uint256 resultLength = 0;

        for (uint256 i = limit.mul(page).sub(limit).add(1); i <= limit.mul(page); i++) {
            if (idToMarketItem[i].itemId > 0 && idToMarketItem[i].isOnSale == true && idToMarketItem[i].owner == user) {
                MarketItem storage currentItem = idToMarketItem[i];
                items[resultLength] = currentItem;
                resultLength = resultLength.add(1);
            }
        }
        return items;
    }
}