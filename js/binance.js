'use strict';

//  ---------------------------------------------------------------------------

const Exchange = require ('./base/Exchange');
const { ExchangeError, ArgumentsRequired, ExchangeNotAvailable, InsufficientFunds, OrderNotFound, InvalidOrder, DDoSProtection, InvalidNonce, AuthenticationError, RateLimitExceeded, PermissionDenied, NotSupported, BadRequest, BadSymbol, AccountSuspended, OrderImmediatelyFillable, OnMaintenance, BadResponse, RequestTimeout, OrderNotFillable } = require ('./base/errors');
const { TRUNCATE } = require ('./base/functions/number');
const Precise = require ('./base/Precise');

//  ---------------------------------------------------------------------------

module.exports = class binance extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'binance',
            'name': 'Binance',
            'countries': [ 'JP', 'MT' ], // Japan, Malta
            'rateLimit': 50,
            'certified': true,
            'pro': true,
            // new metainfo interface
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': true,
                'swap': true,
                'future': true,
                'option': undefined,
                'addMargin': true,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'cancelOrders': undefined,
                'createDepositAddress': undefined,
                'createOrder': true,
                'createReduceOnlyOrder': true,
                'deposit': undefined,
                'fetchAccounts': undefined,
                'fetchAllTradingFees': undefined,
                'fetchBalance': true,
                'fetchBidsAsks': true,
                'fetchBorrowRate': true,
                'fetchBorrowRateHistories': true,
                'fetchBorrowRateHistory': true,
                'fetchBorrowRates': false,
                'fetchBorrowRatesPerSymbol': false,
                'fetchCanceledOrders': undefined,
                'fetchClosedOrder': undefined,
                'fetchClosedOrders': 'emulated',
                'fetchCurrencies': true,
                'fetchDeposit': undefined,
                'fetchDepositAddress': true,
                'fetchDepositAddresses': undefined,
                'fetchDepositAddressesByNetwork': undefined,
                'fetchDeposits': true,
                'fetchFundingFee': undefined,
                'fetchFundingFees': true,
                'fetchFundingHistory': true,
                'fetchFundingRate': true,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': true,
                'fetchIndexOHLCV': true,
                'fetchIsolatedPositions': undefined,
                'fetchL3OrderBook': undefined,
                'fetchLedger': undefined,
                'fetchLeverage': undefined,
                'fetchMarkets': true,
                'fetchMarkOHLCV': true,
                'fetchMyBuys': undefined,
                'fetchMySells': undefined,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenOrder': undefined,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrderBooks': undefined,
                'fetchOrders': true,
                'fetchOrderTrades': true,
                'fetchPosition': undefined,
                'fetchPositions': true,
                'fetchPositionsRisk': true,
                'fetchPremiumIndexOHLCV': false,
                'fetchStatus': true,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': true,
                'fetchTradingLimits': undefined,
                'fetchTransactions': false,
                'fetchTransfers': true,
                'fetchWithdrawal': false,
                'fetchWithdrawals': true,
                'fetchWithdrawalWhitelist': false,
                'loadLeverageBrackets': true,
                'reduceMargin': true,
                'setLeverage': true,
                'setMarginMode': true,
                'setPositionMode': true,
                'signIn': false,
                'transfer': true,
                'withdraw': true,
            },
            'timeframes': {
                '1m': '1m',
                '3m': '3m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '2h': '2h',
                '4h': '4h',
                '6h': '6h',
                '8h': '8h',
                '12h': '12h',
                '1d': '1d',
                '3d': '3d',
                '1w': '1w',
                '1M': '1M',
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/29604020-d5483cdc-87ee-11e7-94c7-d1a8d9169293.jpg',
                'test': {
                    'dapiPublic': 'https://testnet.binancefuture.com/dapi/v1',
                    'dapiPrivate': 'https://testnet.binancefuture.com/dapi/v1',
                    'vapiPublic': 'https://testnet.binanceops.com/vapi/v1',
                    'vapiPrivate': 'https://testnet.binanceops.com/vapi/v1',
                    'fapiPublic': 'https://testnet.binancefuture.com/fapi/v1',
                    'fapiPrivate': 'https://testnet.binancefuture.com/fapi/v1',
                    'fapiPrivateV2': 'https://testnet.binancefuture.com/fapi/v2',
                    'public': 'https://testnet.binance.vision/api/v3',
                    'private': 'https://testnet.binance.vision/api/v3',
                    'v1': 'https://testnet.binance.vision/api/v1',
                },
                'api': {
                    'wapi': 'https://api.binance.com/wapi/v3',
                    'sapi': 'https://api.binance.com/sapi/v1',
                    'dapiPublic': 'https://dapi.binance.com/dapi/v1',
                    'dapiPrivate': 'https://dapi.binance.com/dapi/v1',
                    'vapiPublic': 'https://vapi.binance.com/vapi/v1',
                    'vapiPrivate': 'https://vapi.binance.com/vapi/v1',
                    'dapiPrivateV2': 'https://dapi.binance.com/dapi/v2',
                    'dapiData': 'https://dapi.binance.com/futures/data',
                    'fapiPublic': 'https://fapi.binance.com/fapi/v1',
                    'fapiPrivate': 'https://fapi.binance.com/fapi/v1',
                    'fapiData': 'https://fapi.binance.com/futures/data',
                    'fapiPrivateV2': 'https://fapi.binance.com/fapi/v2',
                    'public': 'https://api.binance.com/api/v3',
                    'private': 'https://api.binance.com/api/v3',
                    'v1': 'https://api.binance.com/api/v1',
                },
                'www': 'https://www.binance.com',
                'referral': {
                    'url': 'https://www.binance.com/en/register?ref=D7YA7CLY',
                    'discount': 0.1,
                },
                'doc': [
                    'https://binance-docs.github.io/apidocs/spot/en',
                ],
                'api_management': 'https://www.binance.com/en/usercenter/settings/api-management',
                'fees': 'https://www.binance.com/en/fee/schedule',
            },
            'depth': 1,
            'api': {
                // the API structure below will need 3-layer apidefs
                'sapi': {
                    'get': {
                        'system/status': 1,
                        // these endpoints require this.apiKey
                        'accountSnapshot': 1,
                        'margin/asset': 1,
                        'margin/pair': 1,
                        'margin/allAssets': 1,
                        'margin/allPairs': 1,
                        'margin/priceIndex': 1,
                        // these endpoints require this.apiKey + this.secret
                        'asset/assetDividend': 1,
                        'asset/dribblet': 1,
                        'asset/transfer': 1,
                        'asset/assetDetail': 1,
                        'asset/tradeFee': 1,
                        'asset/get-funding-asset': 1,
                        'margin/loan': 1,
                        'margin/repay': 1,
                        'margin/account': 1,
                        'margin/transfer': 1,
                        'margin/interestHistory': 1,
                        'margin/forceLiquidationRec': 1,
                        'margin/order': 1,
                        'margin/openOrders': 1,
                        'margin/allOrders': 1,
                        'margin/myTrades': 1,
                        'margin/maxBorrowable': 5,
                        'margin/maxTransferable': 5,
                        'margin/isolated/transfer': 1,
                        'margin/isolated/account': 1,
                        'margin/isolated/pair': 1,
                        'margin/isolated/allPairs': 1,
                        'margin/isolated/accountLimit': 1,
                        'margin/interestRateHistory': 1,
                        'margin/orderList': 2,
                        'margin/allOrderList': 10,
                        'margin/openOrderList': 3,
                        'margin/crossMarginData': { 'cost': 1, 'noCoin': 5 },
                        'margin/isolatedMarginData': { 'cost': 1, 'noCoin': 10 },
                        'margin/isolatedMarginTier': 1,
                        'loan/income': 1,
                        'fiat/orders': 1,
                        'fiat/payments': 1,
                        'futures/transfer': 5,
                        'futures/loan/borrow/history': 1,
                        'futures/loan/repay/history': 1,
                        'futures/loan/wallet': 1,
                        'futures/loan/configs': 1,
                        'futures/loan/calcAdjustLevel': 1,
                        'futures/loan/calcMaxAdjustAmount': 1,
                        'futures/loan/adjustCollateral/history': 1,
                        'futures/loan/liquidationHistory': 1,
                        'rebate/taxQuery': 1,
                        // https://binance-docs.github.io/apidocs/spot/en/#withdraw-sapi
                        'capital/config/getall': 1, // get networks for withdrawing USDT ERC20 vs USDT Omni
                        'capital/deposit/address': 1,
                        'capital/deposit/hisrec': 1,
                        'capital/deposit/subAddress': 1,
                        'capital/deposit/subHisrec': 1,
                        'capital/withdraw/history': 1,
                        'convert/tradeFlow': 1,
                        'account/status': 1,
                        'account/apiTradingStatus': 1,
                        'account/apiRestrictions/ipRestriction': 1,
                        'bnbBurn': 1,
                        'sub-account/assets': 1,
                        'sub-account/futures/account': 1,
                        'sub-account/futures/accountSummary': 1,
                        'sub-account/futures/positionRisk': 1,
                        'sub-account/futures/internalTransfer': 1,
                        'sub-account/list': 1,
                        'sub-account/margin/account': 1,
                        'sub-account/margin/accountSummary': 1,
                        'sub-account/spotSummary': 5,
                        'sub-account/status': 1,
                        'sub-account/sub/transfer/history': 1,
                        'sub-account/transfer/subUserHistory': 1,
                        'sub-account/universalTransfer': 1,
                        'managed-subaccount/asset': 1,
                        // lending endpoints
                        'lending/daily/product/list': 1,
                        'lending/daily/userLeftQuota': 1,
                        'lending/daily/userRedemptionQuota': 1,
                        'lending/daily/token/position': 1,
                        'lending/union/account': 1,
                        'lending/union/purchaseRecord': 1,
                        'lending/union/redemptionRecord': 1,
                        'lending/union/interestHistory': 1,
                        'lending/project/list': 1,
                        'lending/project/position/list': 1,
                        // mining endpoints
                        'mining/pub/algoList': 1,
                        'mining/pub/coinList': 1,
                        'mining/worker/detail': 5,
                        'mining/worker/list': 5,
                        'mining/payment/list': 5,
                        'mining/statistics/user/status': 5,
                        'mining/statistics/user/list': 5,
                        'mining/payment/uid': 5,
                        // liquid swap endpoints
                        'bswap/pools': 1,
                        'bswap/liquidity': { 'cost': 1, 'noPoolId': 10 },
                        'bswap/liquidityOps': 2,
                        'bswap/quote': 2,
                        'bswap/swap': 1,
                        'bswap/poolConfigure': 1,
                        'bswap/addLiquidityPreview': 1,
                        'bswap/removeLiquidityPreview': 1,
                        'bswap/unclaimedRewards': 1,
                        'bswap/claimedHistory': 1,
                        // leveraged token endpoints
                        'blvt/tokenInfo': 1,
                        'blvt/subscribe/record': 1,
                        'blvt/redeem/record': 1,
                        'blvt/userLimit': 1,
                        // broker api
                        'apiReferral/ifNewUser': 1,
                        'apiReferral/customization': 1,
                        'apiReferral/userCustomization': 1,
                        'apiReferral/rebate/recentRecord': 1,
                        'apiReferral/rebate/historicalRecord': 1,
                        'apiReferral/kickback/recentRecord': 1,
                        'apiReferral/kickback/historicalRecord': 1,
                        // brokerage API
                        'broker/subAccountApi': 1,
                        'broker/subAccount': 1,
                        'broker/subAccountApi/commission/futures': 1,
                        'broker/subAccountApi/commission/coinFutures': 1,
                        'broker/info': 1,
                        'broker/transfer': 1,
                        'broker/transfer/futures': 1,
                        'broker/rebate/recentRecord': 1,
                        'broker/rebate/historicalRecord': 1,
                        'broker/subAccount/bnbBurn/status': 1,
                        'broker/subAccount/depositHist': 1,
                        'broker/subAccount/spotSummary': 1,
                        'broker/subAccount/marginSummary': 1,
                        'broker/subAccount/futuresSummary': 1,
                        'broker/rebate/futures/recentRecord': 1,
                        'broker/subAccountApi/ipRestriction': 1,
                        'broker/universalTransfer': 1,
                        // v2 not supported yet
                        // GET /sapi/v2/broker/subAccount/futuresSummary
                        'account/apiRestrictions': 1,
                        // c2c / p2p
                        'c2c/orderMatch/listUserOrderHistory': 1,
                        // nft endpoints
                        'nft/history/transactions': 1,
                        'nft/history/deposit': 1,
                        'nft/history/withdraw': 1,
                        'nft/user/getAsset': 1,
                        'pay/transactions': 1,
                        'giftcard/verify': 1,
                    },
                    'post': {
                        'asset/dust': 1,
                        'asset/transfer': 1,
                        'asset/get-funding-asset': 1,
                        'account/disableFastWithdrawSwitch': 1,
                        'account/enableFastWithdrawSwitch': 1,
                        'account/apiRestrictions/ipRestriction': 1,
                        'account/apiRestrictions/ipRestriction/ipList': 1,
                        'capital/withdraw/apply': 1,
                        'margin/transfer': 1,
                        'margin/loan': 1,
                        'margin/repay': 1,
                        'margin/order': 4,
                        'margin/order/oco': 1,
                        'margin/isolated/create': 1,
                        'margin/isolated/transfer': 1,
                        'margin/isolated/account': 1,
                        'bnbBurn': 1,
                        'sub-account/margin/transfer': 1,
                        'sub-account/margin/enable': 1,
                        // 'sub-account/margin/enable': 1,
                        'sub-account/futures/enable': 1,
                        'sub-account/futures/transfer': 1,
                        'sub-account/futures/internalTransfer': 1,
                        'sub-account/transfer/subToSub': 1,
                        'sub-account/transfer/subToMaster': 1,
                        'sub-account/universalTransfer': 1,
                        'managed-subaccount/deposit': 1,
                        'managed-subaccount/withdraw': 1,
                        'userDataStream': 1,
                        'userDataStream/isolated': 1,
                        'futures/transfer': 1,
                        'futures/loan/borrow': 20,
                        'futures/loan/repay': 20,
                        'futures/loan/adjustCollateral': 20,
                        // lending
                        'lending/customizedFixed/purchase': 1,
                        'lending/daily/purchase': 1,
                        'lending/daily/redeem': 1,
                        // liquid swap endpoints
                        'bswap/liquidityAdd': 2,
                        'bswap/liquidityRemove': 2,
                        'bswap/swap': 2,
                        'bswap/claimRewards': 1,
                        // leveraged token endpoints
                        'blvt/subscribe': 1,
                        'blvt/redeem': 1,
                        // brokerage API
                        'apiReferral/customization': 1,
                        'apiReferral/userCustomization': 1,
                        'apiReferral/rebate/historicalRecord': 1,
                        'apiReferral/kickback/historicalRecord': 1,
                        'broker/subAccount': 1,
                        'broker/subAccount/margin': 1,
                        'broker/subAccount/futures': 1,
                        'broker/subAccountApi': 1,
                        'broker/subAccountApi/permission': 1,
                        'broker/subAccountApi/commission': 1,
                        'broker/subAccountApi/commission/futures': 1,
                        'broker/subAccountApi/commission/coinFutures': 1,
                        'broker/transfer': 1,
                        'broker/transfer/futures': 1,
                        'broker/rebate/historicalRecord': 1,
                        'broker/subAccount/bnbBurn/spot': 1,
                        'broker/subAccount/bnbBurn/marginInterest': 1,
                        'broker/subAccount/blvt': 1,
                        'broker/subAccountApi/ipRestriction': 1,
                        'broker/subAccountApi/ipRestriction/ipList': 1,
                        'broker/universalTransfer': 1,
                        'broker/subAccountApi/permission/universalTransfer': 1,
                        'broker/subAccountApi/permission/vanillaOptions': 1,
                        'giftcard/createCode': 1,
                        'giftcard/redeemCode': 1,
                    },
                    'put': {
                        'userDataStream': 1,
                        'userDataStream/isolated': 1,
                    },
                    'delete': {
                        'account/apiRestrictions/ipRestriction/ipList': 1,
                        'margin/openOrders': 1,
                        'margin/order': 1,
                        'margin/orderList': 1,
                        'margin/isolated/account': 1,
                        'userDataStream': 1,
                        'userDataStream/isolated': 1,
                        // brokerage API
                        'broker/subAccountApi': 1,
                        'broker/subAccountApi/ipRestriction/ipList': 1,
                    },
                },
                // deprecated
                'wapi': {
                    'post': {
                        'withdraw': 1,
                        'sub-account/transfer': 1,
                    },
                    'get': {
                        'depositHistory': 1,
                        'withdrawHistory': 1,
                        'depositAddress': 1,
                        'accountStatus': 1,
                        'systemStatus': 1,
                        'apiTradingStatus': 1,
                        'userAssetDribbletLog': 1,
                        'tradeFee': 1,
                        'assetDetail': 1,
                        'sub-account/list': 1,
                        'sub-account/transfer/history': 1,
                        'sub-account/assets': 1,
                    },
                },
                'dapiPublic': {
                    'get': {
                        'ping': 1,
                        'time': 1,
                        'exchangeInfo': 1,
                        'depth': { 'cost': 2, 'byLimit': [ [ 50, 2 ], [ 100, 5 ], [ 500, 10 ], [ 1000, 20 ] ] },
                        'trades': 1,
                        'historicalTrades': 20,
                        'aggTrades': 20,
                        'premiumIndex': 10,
                        'fundingRate': 1,
                        'klines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'continuousKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'indexPriceKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'markPriceKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'ticker/24hr': { 'cost': 1, 'noSymbol': 40 },
                        'ticker/price': { 'cost': 1, 'noSymbol': 2 },
                        'ticker/bookTicker': { 'cost': 1, 'noSymbol': 2 },
                        'openInterest': 1,
                    },
                },
                'dapiData': {
                    'get': {
                        'openInterestHist': 1,
                        'topLongShortAccountRatio': 1,
                        'topLongShortPositionRatio': 1,
                        'globalLongShortAccountRatio': 1,
                        'takerBuySellVol': 1,
                        'basis': 1,
                    },
                },
                'dapiPrivate': {
                    'get': {
                        'positionSide/dual': 30,
                        'order': 1,
                        'openOrder': 1,
                        'openOrders': { 'cost': 1, 'noSymbol': 5 },
                        'allOrders': { 'cost': 20, 'noSymbol': 40 },
                        'balance': 1,
                        'account': 5,
                        'positionMargin/history': 1,
                        'positionRisk': 1,
                        'userTrades': { 'cost': 20, 'noSymbol': 40 },
                        'income': 20,
                        'leverageBracket': 1,
                        'forceOrders': { 'cost': 20, 'noSymbol': 50 },
                        'adlQuantile': 5,
                    },
                    'post': {
                        'positionSide/dual': 1,
                        'order': 4,
                        'batchOrders': 5,
                        'countdownCancelAll': 10,
                        'leverage': 1,
                        'marginType': 1,
                        'positionMargin': 1,
                        'listenKey': 1,
                    },
                    'put': {
                        'listenKey': 1,
                    },
                    'delete': {
                        'order': 1,
                        'allOpenOrders': 1,
                        'batchOrders': 5,
                        'listenKey': 1,
                    },
                },
                'dapiPrivateV2': {
                    'get': {
                        'leverageBracket': 1,
                    },
                },
                'fapiPublic': {
                    'get': {
                        'ping': 1,
                        'time': 1,
                        'exchangeInfo': 1,
                        'depth': { 'cost': 2, 'byLimit': [ [ 50, 2 ], [ 100, 5 ], [ 500, 10 ], [ 1000, 20 ] ] },
                        'trades': 1,
                        'historicalTrades': 20,
                        'aggTrades': 20,
                        'klines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'continuousKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'markPriceKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'indexPriceKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'fundingRate': 1,
                        'premiumIndex': 1,
                        'ticker/24hr': { 'cost': 1, 'noSymbol': 40 },
                        'ticker/price': { 'cost': 1, 'noSymbol': 2 },
                        'ticker/bookTicker': { 'cost': 1, 'noSymbol': 2 },
                        'openInterest': 1,
                        'indexInfo': 1,
                        'apiTradingStatus': { 'cost': 1, 'noSymbol': 10 },
                        'lvtKlines': 1,
                    },
                },
                'fapiData': {
                    'get': {
                        'openInterestHist': 1,
                        'topLongShortAccountRatio': 1,
                        'topLongShortPositionRatio': 1,
                        'globalLongShortAccountRatio': 1,
                        'takerlongshortRatio': 1,
                    },
                },
                'fapiPrivate': {
                    'get': {
                        'forceOrders': { 'cost': 20, 'noSymbol': 50 },
                        'allOrders': 5,
                        'openOrder': 1,
                        'openOrders': 1,
                        'order': 1,
                        'account': 5,
                        'balance': 5,
                        'leverageBracket': 1,
                        'positionMargin/history': 1,
                        'positionRisk': 5,
                        'positionSide/dual': 30,
                        'userTrades': 5,
                        'income': 30,
                        'commissionRate': 20,
                        'apiTradingStatus': 1,
                        'multiAssetsMargin': 30,
                        // broker endpoints
                        'apiReferral/ifNewUser': 1,
                        'apiReferral/customization': 1,
                        'apiReferral/userCustomization': 1,
                        'apiReferral/traderNum': 1,
                        'apiReferral/overview': 1,
                        'apiReferral/tradeVol': 1,
                        'apiReferral/rebateVol': 1,
                        'apiReferral/traderSummary': 1,
                        'adlQuantile': 5,
                    },
                    'post': {
                        'batchOrders': 5,
                        'positionSide/dual': 1,
                        'positionMargin': 1,
                        'marginType': 1,
                        'order': 4,
                        'leverage': 1,
                        'listenKey': 1,
                        'countdownCancelAll': 10,
                        'multiAssetsMargin': 1,
                        // broker endpoints
                        'apiReferral/customization': 1,
                        'apiReferral/userCustomization': 1,
                    },
                    'put': {
                        'listenKey': 1,
                    },
                    'delete': {
                        'batchOrders': 1,
                        'order': 1,
                        'allOpenOrders': 1,
                        'listenKey': 1,
                    },
                },
                'fapiPrivateV2': {
                    'get': {
                        'account': 1,
                        'balance': 1,
                        'positionRisk': 1,
                    },
                },
                'vapiPublic': {
                    'get': [
                        'ping',
                        'time',
                        'optionInfo',
                        'exchangeInfo',
                        'index',
                        'ticker',
                        'mark',
                        'depth',
                        'klines',
                        'trades',
                        'historicalTrades',
                    ],
                },
                'vapiPrivate': {
                    'get': [
                        'account',
                        'position',
                        'order',
                        'openOrders',
                        'historyOrders',
                        'userTrades',
                    ],
                    'post': [
                        'transfer',
                        'bill',
                        'order',
                        'batchOrders',
                        'userDataStream',
                    ],
                    'put': [
                        'userDataStream',
                    ],
                    'delete': [
                        'order',
                        'batchOrders',
                        'allOpenOrders',
                        'userDataStream',
                    ],
                },
                'public': {
                    'get': {
                        'ping': 1,
                        'time': 1,
                        'depth': { 'cost': 1, 'byLimit': [ [ 100, 1 ], [ 500, 5 ], [ 1000, 10 ], [ 5000, 50 ] ] },
                        'trades': 1,
                        'aggTrades': 1,
                        'historicalTrades': 5,
                        'klines': 1,
                        'ticker/24hr': { 'cost': 1, 'noSymbol': 40 },
                        'ticker/price': { 'cost': 1, 'noSymbol': 2 },
                        'ticker/bookTicker': { 'cost': 1, 'noSymbol': 2 },
                        'exchangeInfo': 10,
                    },
                    'put': {
                        'userDataStream': 1,
                    },
                    'post': {
                        'userDataStream': 1,
                    },
                    'delete': {
                        'userDataStream': 1,
                    },
                },
                'private': {
                    'get': {
                        'allOrderList': 10, // oco
                        'openOrderList': 3, // oco
                        'orderList': 2, // oco
                        'order': 2,
                        'openOrders': { 'cost': 3, 'noSymbol': 40 },
                        'allOrders': 10,
                        'account': 10,
                        'myTrades': 10,
                        'rateLimit/order': 20,
                    },
                    'post': {
                        'order/oco': 1,
                        'order': 4,
                        'order/test': 1,
                    },
                    'delete': {
                        'openOrders': 1, // added on 2020-04-25 for canceling all open orders per symbol
                        'orderList': 1, // oco
                        'order': 1,
                    },
                },
            },
            'fees': {
                'trading': {
                    'feeSide': 'get',
                    'tierBased': false,
                    'percentage': true,
                    'taker': this.parseNumber ('0.001'),
                    'maker': this.parseNumber ('0.001'),
                },
                'future': {
                    'trading': {
                        'feeSide': 'quote',
                        'tierBased': true,
                        'percentage': true,
                        'taker': this.parseNumber ('0.000400'),
                        'maker': this.parseNumber ('0.000200'),
                        'tiers': {
                            'taker': [
                                [ this.parseNumber ('0'), this.parseNumber ('0.000400') ],
                                [ this.parseNumber ('250'), this.parseNumber ('0.000400') ],
                                [ this.parseNumber ('2500'), this.parseNumber ('0.000350') ],
                                [ this.parseNumber ('7500'), this.parseNumber ('0.000320') ],
                                [ this.parseNumber ('22500'), this.parseNumber ('0.000300') ],
                                [ this.parseNumber ('50000'), this.parseNumber ('0.000270') ],
                                [ this.parseNumber ('100000'), this.parseNumber ('0.000250') ],
                                [ this.parseNumber ('200000'), this.parseNumber ('0.000220') ],
                                [ this.parseNumber ('400000'), this.parseNumber ('0.000200') ],
                                [ this.parseNumber ('750000'), this.parseNumber ('0.000170') ],
                            ],
                            'maker': [
                                [ this.parseNumber ('0'), this.parseNumber ('0.000200') ],
                                [ this.parseNumber ('250'), this.parseNumber ('0.000160') ],
                                [ this.parseNumber ('2500'), this.parseNumber ('0.000140') ],
                                [ this.parseNumber ('7500'), this.parseNumber ('0.000120') ],
                                [ this.parseNumber ('22500'), this.parseNumber ('0.000100') ],
                                [ this.parseNumber ('50000'), this.parseNumber ('0.000080') ],
                                [ this.parseNumber ('100000'), this.parseNumber ('0.000060') ],
                                [ this.parseNumber ('200000'), this.parseNumber ('0.000040') ],
                                [ this.parseNumber ('400000'), this.parseNumber ('0.000020') ],
                                [ this.parseNumber ('750000'), this.parseNumber ('0') ],
                            ],
                        },
                    },
                },
                'delivery': {
                    'trading': {
                        'feeSide': 'base',
                        'tierBased': true,
                        'percentage': true,
                        'taker': this.parseNumber ('0.000500'),
                        'maker': this.parseNumber ('0.000100'),
                        'tiers': {
                            'taker': [
                                [ this.parseNumber ('0'), this.parseNumber ('0.000500') ],
                                [ this.parseNumber ('250'), this.parseNumber ('0.000450') ],
                                [ this.parseNumber ('2500'), this.parseNumber ('0.000400') ],
                                [ this.parseNumber ('7500'), this.parseNumber ('0.000300') ],
                                [ this.parseNumber ('22500'), this.parseNumber ('0.000250') ],
                                [ this.parseNumber ('50000'), this.parseNumber ('0.000240') ],
                                [ this.parseNumber ('100000'), this.parseNumber ('0.000240') ],
                                [ this.parseNumber ('200000'), this.parseNumber ('0.000240') ],
                                [ this.parseNumber ('400000'), this.parseNumber ('0.000240') ],
                                [ this.parseNumber ('750000'), this.parseNumber ('0.000240') ],
                            ],
                            'maker': [
                                [ this.parseNumber ('0'), this.parseNumber ('0.000100') ],
                                [ this.parseNumber ('250'), this.parseNumber ('0.000080') ],
                                [ this.parseNumber ('2500'), this.parseNumber ('0.000050') ],
                                [ this.parseNumber ('7500'), this.parseNumber ('0.0000030') ],
                                [ this.parseNumber ('22500'), this.parseNumber ('0') ],
                                [ this.parseNumber ('50000'), this.parseNumber ('-0.000050') ],
                                [ this.parseNumber ('100000'), this.parseNumber ('-0.000060') ],
                                [ this.parseNumber ('200000'), this.parseNumber ('-0.000070') ],
                                [ this.parseNumber ('400000'), this.parseNumber ('-0.000080') ],
                                [ this.parseNumber ('750000'), this.parseNumber ('-0.000090') ],
                            ],
                        },
                    },
                },
                'option': {},
            },
            'commonCurrencies': {
                'BCC': 'BCC', // kept for backward-compatibility https://github.com/ccxt/ccxt/issues/4848
                'YOYO': 'YOYOW',
            },
            // exchange-specific options
            'options': {
                'fetchCurrencies': true, // this is a private call and it requires API keys
                // 'fetchTradesMethod': 'publicGetAggTrades', // publicGetTrades, publicGetHistoricalTrades
                'defaultTimeInForce': 'GTC', // 'GTC' = Good To Cancel (default), 'IOC' = Immediate Or Cancel
                'defaultType': 'spot', // 'spot', 'future', 'margin', 'delivery'
                'hasAlreadyAuthenticatedSuccessfully': false,
                'warnOnFetchOpenOrdersWithoutSymbol': true,
                'fetchPositions': 'positionRisk', // or 'account'
                'recvWindow': 5 * 1000, // 5 sec, binance default
                'timeDifference': 0, // the difference between system clock and Binance clock
                'adjustForTimeDifference': false, // controls the adjustment logic upon instantiation
                'newOrderRespType': {
                    'market': 'FULL', // 'ACK' for order id, 'RESULT' for full order or 'FULL' for order with fills
                    'limit': 'FULL', // we change it from 'ACK' by default to 'FULL' (returns immediately if limit is not hit)
                },
                'quoteOrderQty': true, // whether market orders support amounts in quote currency
                'broker': {
                    'spot': 'x-R4BD3S82',
                    'margin': 'x-R4BD3S82',
                    'future': 'x-xcKtGhcu',
                    'delivery': 'x-xcKtGhcu',
                },
                'accountsByType': {
                    'main': 'MAIN',
                    'spot': 'MAIN',
                    'funding': 'FUNDING',
                    'margin': 'MARGIN',
                    'future': 'UMFUTURE',
                    'delivery': 'CMFUTURE',
                    'mining': 'MINING',
                },
                'typesByAccount': {
                    'MAIN': 'spot',
                    'FUNDING': 'funding',
                    'MARGIN': 'margin',
                    'UMFUTURE': 'future',
                    'CMFUTURE': 'delivery',
                    'MINING': 'mining',
                },
                'networks': {
                    'ERC20': 'ETH',
                    'TRC20': 'TRX',
                    'BEP2': 'BNB',
                    'BEP20': 'BSC',
                    'OMNI': 'OMNI',
                    'EOS': 'EOS',
                    'SPL': 'SOL',
                },
                'reverseNetworks': {
                    'tronscan.org': 'TRC20',
                    'etherscan.io': 'ERC20',
                    'bscscan.com': 'BSC',
                    'explorer.binance.org': 'BEP2',
                    'bithomp.com': 'XRP',
                    'bloks.io': 'EOS',
                    'stellar.expert': 'XLM',
                    'blockchair.com/bitcoin': 'BTC',
                    'blockchair.com/bitcoin-cash': 'BCH',
                    'blockchair.com/ecash': 'XEC',
                    'explorer.litecoin.net': 'LTC',
                    'explorer.avax.network': 'AVAX',
                    'solscan.io': 'SOL',
                    'polkadot.subscan.io': 'DOT',
                    'dashboard.internetcomputer.org': 'ICP',
                    'explorer.chiliz.com': 'CHZ',
                    'cardanoscan.io': 'ADA',
                    'mainnet.theoan.com': 'AION',
                    'algoexplorer.io': 'ALGO',
                    'explorer.ambrosus.com': 'AMB',
                    'viewblock.io/zilliqa': 'ZIL',
                    'viewblock.io/arweave': 'AR',
                    'explorer.ark.io': 'ARK',
                    'atomscan.com': 'ATOM',
                    'www.mintscan.io': 'CTK',
                    'explorer.bitcoindiamond.org': 'BCD',
                    'btgexplorer.com': 'BTG',
                    'bts.ai': 'BTS',
                    'explorer.celo.org': 'CELO',
                    'explorer.nervos.org': 'CKB',
                    'cerebro.cortexlabs.ai': 'CTXC',
                    'chainz.cryptoid.info': 'VIA',
                    'explorer.dcrdata.org': 'DCR',
                    'digiexplorer.info': 'DGB',
                    'dock.subscan.io': 'DOCK',
                    'dogechain.info': 'DOGE',
                    'explorer.elrond.com': 'EGLD',
                    'blockscout.com': 'ETC',
                    'explore-fetchhub.fetch.ai': 'FET',
                    'filfox.info': 'FIL',
                    'fio.bloks.io': 'FIO',
                    'explorer.firo.org': 'FIRO',
                    'neoscan.io': 'NEO',
                    'ftmscan.com': 'FTM',
                    'explorer.gochain.io': 'GO',
                    'block.gxb.io': 'GXS',
                    'hash-hash.info': 'HBAR',
                    'www.hiveblockexplorer.com': 'HIVE',
                    'explorer.helium.com': 'HNT',
                    'tracker.icon.foundation': 'ICX',
                    'www.iostabc.com': 'IOST',
                    'explorer.iota.org': 'IOTA',
                    'iotexscan.io': 'IOTX',
                    'irishub.iobscan.io': 'IRIS',
                    'kava.mintscan.io': 'KAVA',
                    'scope.klaytn.com': 'KLAY',
                    'kmdexplorer.io': 'KMD',
                    'kusama.subscan.io': 'KSM',
                    'explorer.lto.network': 'LTO',
                    'polygonscan.com': 'POLYGON',
                    'explorer.ont.io': 'ONT',
                    'minaexplorer.com': 'MINA',
                    'nanolooker.com': 'NANO',
                    'explorer.nebulas.io': 'NAS',
                    'explorer.nbs.plus': 'NBS',
                    'explorer.nebl.io': 'NEBL',
                    'nulscan.io': 'NULS',
                    'nxscan.com': 'NXS',
                    'explorer.harmony.one': 'ONE',
                    'explorer.poa.network': 'POA',
                    'qtum.info': 'QTUM',
                    'explorer.rsk.co': 'RSK',
                    'www.oasisscan.com': 'ROSE',
                    'ravencoin.network': 'RVN',
                    'sc.tokenview.com': 'SC',
                    'secretnodes.com': 'SCRT',
                    'explorer.skycoin.com': 'SKY',
                    'steemscan.com': 'STEEM',
                    'explorer.stacks.co': 'STX',
                    'www.thetascan.io': 'THETA',
                    'scan.tomochain.com': 'TOMO',
                    'explore.vechain.org': 'VET',
                    'explorer.vite.net': 'VITE',
                    'www.wanscan.org': 'WAN',
                    'wavesexplorer.com': 'WAVES',
                    'wax.eosx.io': 'WAXP',
                    'waltonchain.pro': 'WTC',
                    'chain.nem.ninja': 'XEM',
                    'verge-blockchain.info': 'XVG',
                    'explorer.yoyow.org': 'YOYOW',
                    'explorer.zcha.in': 'ZEC',
                    'explorer.zensystem.io': 'ZEN',
                },
                'impliedNetworks': {
                    'ETH': { 'ERC20': 'ETH' },
                    'TRX': { 'TRC20': 'TRX' },
                },
                'legalMoney': {
                    'MXN': true,
                    'UGX': true,
                    'SEK': true,
                    'CHF': true,
                    'VND': true,
                    'AED': true,
                    'DKK': true,
                    'KZT': true,
                    'HUF': true,
                    'PEN': true,
                    'PHP': true,
                    'USD': true,
                    'TRY': true,
                    'EUR': true,
                    'NGN': true,
                    'PLN': true,
                    'BRL': true,
                    'ZAR': true,
                    'KES': true,
                    'ARS': true,
                    'RUB': true,
                    'AUD': true,
                    'NOK': true,
                    'CZK': true,
                    'GBP': true,
                    'UAH': true,
                    'GHS': true,
                    'HKD': true,
                    'CAD': true,
                    'INR': true,
                    'JPY': true,
                    'NZD': true,
                },
            },
            // https://binance-docs.github.io/apidocs/spot/en/#error-codes-2
            'exceptions': {
                'exact': {
                    'System is under maintenance.': OnMaintenance, // {"code":1,"msg":"System is under maintenance."}
                    'System abnormality': ExchangeError, // {"code":-1000,"msg":"System abnormality"}
                    'You are not authorized to execute this request.': PermissionDenied, // {"msg":"You are not authorized to execute this request."}
                    'API key does not exist': AuthenticationError,
                    'Order would trigger immediately.': OrderImmediatelyFillable,
                    'Stop price would trigger immediately.': OrderImmediatelyFillable, // {"code":-2010,"msg":"Stop price would trigger immediately."}
                    'Order would immediately match and take.': OrderImmediatelyFillable, // {"code":-2010,"msg":"Order would immediately match and take."}
                    'Account has insufficient balance for requested action.': InsufficientFunds,
                    'Rest API trading is not enabled.': ExchangeNotAvailable,
                    "You don't have permission.": PermissionDenied, // {"msg":"You don't have permission.","success":false}
                    'Market is closed.': ExchangeNotAvailable, // {"code":-1013,"msg":"Market is closed."}
                    'Too many requests. Please try again later.': DDoSProtection, // {"msg":"Too many requests. Please try again later.","success":false}
                    'This action disabled is on this account.': AccountSuspended, // {"code":-2010,"msg":"This action disabled is on this account."}
                    '-1000': ExchangeNotAvailable, // {"code":-1000,"msg":"An unknown error occured while processing the request."}
                    '-1001': ExchangeNotAvailable, // {"code":-1001,"msg":"'Internal error; unable to process your request. Please try again.'"}
                    '-1002': AuthenticationError, // {"code":-1002,"msg":"'You are not authorized to execute this request.'"}
                    '-1003': RateLimitExceeded, // {"code":-1003,"msg":"Too much request weight used, current limit is 1200 request weight per 1 MINUTE. Please use the websocket for live updates to avoid polling the API."}
                    '-1004': DDoSProtection, // {"code":-1004,"msg":"Server is busy, please wait and try again"}
                    '-1005': PermissionDenied, // {"code":-1005,"msg":"No such IP has been white listed"}
                    '-1006': BadResponse, // {"code":-1006,"msg":"An unexpected response was received from the message bus. Execution status unknown."}
                    '-1007': RequestTimeout, // {"code":-1007,"msg":"Timeout waiting for response from backend server. Send status unknown; execution status unknown."}
                    '-1010': BadResponse, // {"code":-1010,"msg":"ERROR_MSG_RECEIVED."}
                    '-1011': PermissionDenied, // {"code":-1011,"msg":"This IP cannot access this route."}
                    '-1013': InvalidOrder, // {"code":-1013,"msg":"createOrder -> 'invalid quantity'/'invalid price'/MIN_NOTIONAL"}
                    '-1014': InvalidOrder, // {"code":-1014,"msg":"Unsupported order combination."}
                    '-1015': RateLimitExceeded, // {"code":-1015,"msg":"'Too many new orders; current limit is %s orders per %s.'"}
                    '-1016': ExchangeNotAvailable, // {"code":-1016,"msg":"'This service is no longer available.',"}
                    '-1020': BadRequest, // {"code":-1020,"msg":"'This operation is not supported.'"}
                    '-1021': InvalidNonce, // {"code":-1021,"msg":"'your time is ahead of server'"}
                    '-1022': AuthenticationError, // {"code":-1022,"msg":"Signature for this request is not valid."}
                    '-1023': BadRequest, // {"code":-1023,"msg":"Start time is greater than end time."}
                    '-1099': AuthenticationError, // {"code":-1099,"msg":"Not found, authenticated, or authorized"}
                    '-1100': BadRequest, // {"code":-1100,"msg":"createOrder(symbol, 1, asdf) -> 'Illegal characters found in parameter 'price'"}
                    '-1101': BadRequest, // {"code":-1101,"msg":"Too many parameters; expected %s and received %s."}
                    '-1102': BadRequest, // {"code":-1102,"msg":"Param %s or %s must be sent, but both were empty"}
                    '-1103': BadRequest, // {"code":-1103,"msg":"An unknown parameter was sent."}
                    '-1104': BadRequest, // {"code":-1104,"msg":"Not all sent parameters were read, read 8 parameters but was sent 9"}
                    '-1105': BadRequest, // {"code":-1105,"msg":"Parameter %s was empty."}
                    '-1106': BadRequest, // {"code":-1106,"msg":"Parameter %s sent when not required."}
                    '-1108': BadRequest, // {"code":-1108,"msg":"Invalid asset."}
                    '-1109': AuthenticationError, // {"code":-1109,"msg":"Invalid account."}
                    '-1110': BadRequest, // {"code":-1110,"msg":"Invalid symbolType."}
                    '-1111': BadRequest, // {"code":-1111,"msg":"Precision is over the maximum defined for this asset."}
                    '-1112': InvalidOrder, // {"code":-1112,"msg":"No orders on book for symbol."}
                    '-1113': BadRequest, // {"code":-1113,"msg":"Withdrawal amount must be negative."}
                    '-1114': BadRequest, // {"code":-1114,"msg":"TimeInForce parameter sent when not required."}
                    '-1115': BadRequest, // {"code":-1115,"msg":"Invalid timeInForce."}
                    '-1116': BadRequest, // {"code":-1116,"msg":"Invalid orderType."}
                    '-1117': BadRequest, // {"code":-1117,"msg":"Invalid side."}
                    '-1118': BadRequest, // {"code":-1118,"msg":"New client order ID was empty."}
                    '-1119': BadRequest, // {"code":-1119,"msg":"Original client order ID was empty."}
                    '-1120': BadRequest, // {"code":-1120,"msg":"Invalid interval."}
                    '-1121': BadSymbol, // {"code":-1121,"msg":"Invalid symbol."}
                    '-1125': AuthenticationError, // {"code":-1125,"msg":"This listenKey does not exist."}
                    '-1127': BadRequest, // {"code":-1127,"msg":"More than %s hours between startTime and endTime."}
                    '-1128': BadRequest, // {"code":-1128,"msg":"{"code":-1128,"msg":"Combination of optional parameters invalid."}"}
                    '-1130': BadRequest, // {"code":-1130,"msg":"Data sent for paramter %s is not valid."}
                    '-1131': BadRequest, // {"code":-1131,"msg":"recvWindow must be less than 60000"}
                    '-1136': BadRequest, // {"code":-1136,"msg":"Invalid newOrderRespType"}
                    '-2008': AuthenticationError, // {"code":-2008,"msg":"Invalid Api-Key ID."}
                    '-2010': ExchangeError, // {"code":-2010,"msg":"generic error code for createOrder -> 'Account has insufficient balance for requested action.', {"code":-2010,"msg":"Rest API trading is not enabled."}, etc..."}
                    '-2011': OrderNotFound, // {"code":-2011,"msg":"cancelOrder(1, 'BTC/USDT') -> 'UNKNOWN_ORDER'"}
                    '-2013': OrderNotFound, // {"code":-2013,"msg":"fetchOrder (1, 'BTC/USDT') -> 'Order does not exist'"}
                    '-2014': AuthenticationError, // {"code":-2014,"msg":"API-key format invalid."}
                    '-2015': AuthenticationError, // {"code":-2015,"msg":"Invalid API-key, IP, or permissions for action."}
                    '-2016': BadRequest, // {"code":-2016,"msg":"No trading window could be found for the symbol. Try ticker/24hrs instead."}
                    '-2018': InsufficientFunds, // {"code":-2018,"msg":"Balance is insufficient"}
                    '-2019': InsufficientFunds, // {"code":-2019,"msg":"Margin is insufficient."}
                    '-2020': OrderNotFillable, // {"code":-2020,"msg":"Unable to fill."}
                    '-2021': OrderImmediatelyFillable, // {"code":-2021,"msg":"Order would immediately trigger."}
                    '-2022': InvalidOrder, // {"code":-2022,"msg":"ReduceOnly Order is rejected."}
                    '-2023': InsufficientFunds, // {"code":-2023,"msg":"User in liquidation mode now."}
                    '-2024': InsufficientFunds, // {"code":-2024,"msg":"Position is not sufficient."}
                    '-2025': InvalidOrder, // {"code":-2025,"msg":"Reach max open order limit."}
                    '-2026': InvalidOrder, // {"code":-2026,"msg":"This OrderType is not supported when reduceOnly."}
                    '-2027': InvalidOrder, // {"code":-2027,"msg":"Exceeded the maximum allowable position at current leverage."}
                    '-2028': InsufficientFunds, // {"code":-2028,"msg":"Leverage is smaller than permitted: insufficient margin balance"}
                    '-3000': ExchangeError, // {"code":-3000,"msg":"Internal server error."}
                    '-3001': AuthenticationError, // {"code":-3001,"msg":"Please enable 2FA first."}
                    '-3002': BadSymbol, // {"code":-3002,"msg":"We don't have this asset."}
                    '-3003': BadRequest, // {"code":-3003,"msg":"Margin account does not exist."}
                    '-3004': ExchangeError, // {"code":-3004,"msg":"Trade not allowed."}
                    '-3005': InsufficientFunds, // {"code":-3005,"msg":"Transferring out not allowed. Transfer out amount exceeds max amount."}
                    '-3006': InsufficientFunds, // {"code":-3006,"msg":"Your borrow amount has exceed maximum borrow amount."}
                    '-3007': ExchangeError, // {"code":-3007,"msg":"You have pending transaction, please try again later.."}
                    '-3008': InsufficientFunds, // {"code":-3008,"msg":"Borrow not allowed. Your borrow amount has exceed maximum borrow amount."}
                    '-3009': BadRequest, // {"code":-3009,"msg":"This asset are not allowed to transfer into margin account currently."}
                    '-3010': ExchangeError, // {"code":-3010,"msg":"Repay not allowed. Repay amount exceeds borrow amount."}
                    '-3011': BadRequest, // {"code":-3011,"msg":"Your input date is invalid."}
                    '-3012': ExchangeError, // {"code":-3012,"msg":"Borrow is banned for this asset."}
                    '-3013': BadRequest, // {"code":-3013,"msg":"Borrow amount less than minimum borrow amount."}
                    '-3014': AccountSuspended, // {"code":-3014,"msg":"Borrow is banned for this account."}
                    '-3015': ExchangeError, // {"code":-3015,"msg":"Repay amount exceeds borrow amount."}
                    '-3016': BadRequest, // {"code":-3016,"msg":"Repay amount less than minimum repay amount."}
                    '-3017': ExchangeError, // {"code":-3017,"msg":"This asset are not allowed to transfer into margin account currently."}
                    '-3018': AccountSuspended, // {"code":-3018,"msg":"Transferring in has been banned for this account."}
                    '-3019': AccountSuspended, // {"code":-3019,"msg":"Transferring out has been banned for this account."}
                    '-3020': InsufficientFunds, // {"code":-3020,"msg":"Transfer out amount exceeds max amount."}
                    '-3021': BadRequest, // {"code":-3021,"msg":"Margin account are not allowed to trade this trading pair."}
                    '-3022': AccountSuspended, // {"code":-3022,"msg":"You account's trading is banned."}
                    '-3023': BadRequest, // {"code":-3023,"msg":"You can't transfer out/place order under current margin level."}
                    '-3024': ExchangeError, // {"code":-3024,"msg":"The unpaid debt is too small after this repayment."}
                    '-3025': BadRequest, // {"code":-3025,"msg":"Your input date is invalid."}
                    '-3026': BadRequest, // {"code":-3026,"msg":"Your input param is invalid."}
                    '-3027': BadSymbol, // {"code":-3027,"msg":"Not a valid margin asset."}
                    '-3028': BadSymbol, // {"code":-3028,"msg":"Not a valid margin pair."}
                    '-3029': ExchangeError, // {"code":-3029,"msg":"Transfer failed."}
                    '-3036': AccountSuspended, // {"code":-3036,"msg":"This account is not allowed to repay."}
                    '-3037': ExchangeError, // {"code":-3037,"msg":"PNL is clearing. Wait a second."}
                    '-3038': BadRequest, // {"code":-3038,"msg":"Listen key not found."}
                    '-3041': InsufficientFunds, // {"code":-3041,"msg":"Balance is not enough"}
                    '-3042': BadRequest, // {"code":-3042,"msg":"PriceIndex not available for this margin pair."}
                    '-3043': BadRequest, // {"code":-3043,"msg":"Transferring in not allowed."}
                    '-3044': DDoSProtection, // {"code":-3044,"msg":"System busy."}
                    '-3045': ExchangeError, // {"code":-3045,"msg":"The system doesn't have enough asset now."}
                    '-3999': ExchangeError, // {"code":-3999,"msg":"This function is only available for invited users."}
                    '-4001': BadRequest, // {"code":-4001 ,"msg":"Invalid operation."}
                    '-4002': BadRequest, // {"code":-4002 ,"msg":"Invalid get."}
                    '-4003': BadRequest, // {"code":-4003 ,"msg":"Your input email is invalid."}
                    '-4004': AuthenticationError, // {"code":-4004,"msg":"You don't login or auth."}
                    '-4005': RateLimitExceeded, // {"code":-4005 ,"msg":"Too many new requests."}
                    '-4006': BadRequest, // {"code":-4006 ,"msg":"Support main account only."}
                    '-4007': BadRequest, // {"code":-4007 ,"msg":"Address validation is not passed."}
                    '-4008': BadRequest, // {"code":-4008 ,"msg":"Address tag validation is not passed."}
                    '-4010': BadRequest, // {"code":-4010 ,"msg":"White list mail has been confirmed."} // [TODO] possible bug: it should probably be "has not been confirmed"
                    '-4011': BadRequest, // {"code":-4011 ,"msg":"White list mail is invalid."}
                    '-4012': BadRequest, // {"code":-4012 ,"msg":"White list is not opened."}
                    '-4013': AuthenticationError, // {"code":-4013 ,"msg":"2FA is not opened."}
                    '-4014': PermissionDenied, // {"code":-4014 ,"msg":"Withdraw is not allowed within 2 min login."}
                    '-4015': ExchangeError, // {"code":-4015 ,"msg":"Withdraw is limited."}
                    '-4016': PermissionDenied, // {"code":-4016 ,"msg":"Within 24 hours after password modification, withdrawal is prohibited."}
                    '-4017': PermissionDenied, // {"code":-4017 ,"msg":"Within 24 hours after the release of 2FA, withdrawal is prohibited."}
                    '-4018': BadSymbol, // {"code":-4018,"msg":"We don't have this asset."}
                    '-4019': BadSymbol, // {"code":-4019,"msg":"Current asset is not open for withdrawal."}
                    '-4021': BadRequest, // {"code":-4021,"msg":"Asset withdrawal must be an %s multiple of %s."}
                    '-4022': BadRequest, // {"code":-4022,"msg":"Not less than the minimum pick-up quantity %s."}
                    '-4023': ExchangeError, // {"code":-4023,"msg":"Within 24 hours, the withdrawal exceeds the maximum amount."}
                    '-4024': InsufficientFunds, // {"code":-4024,"msg":"You don't have this asset."}
                    '-4025': InsufficientFunds, // {"code":-4025,"msg":"The number of hold asset is less than zero."}
                    '-4026': InsufficientFunds, // {"code":-4026,"msg":"You have insufficient balance."}
                    '-4027': ExchangeError, // {"code":-4027,"msg":"Failed to obtain tranId."}
                    '-4028': BadRequest, // {"code":-4028,"msg":"The amount of withdrawal must be greater than the Commission."}
                    '-4029': BadRequest, // {"code":-4029,"msg":"The withdrawal record does not exist."}
                    '-4030': ExchangeError, // {"code":-4030,"msg":"Confirmation of successful asset withdrawal. [TODO] possible bug in docs"}
                    '-4031': ExchangeError, // {"code":-4031,"msg":"Cancellation failed."}
                    '-4032': ExchangeError, // {"code":-4032,"msg":"Withdraw verification exception."}
                    '-4033': BadRequest, // {"code":-4033,"msg":"Illegal address."}
                    '-4034': ExchangeError, // {"code":-4034,"msg":"The address is suspected of fake."}
                    '-4035': PermissionDenied, // {"code":-4035,"msg":"This address is not on the whitelist. Please join and try again."}
                    '-4036': BadRequest, // {"code":-4036,"msg":"The new address needs to be withdrawn in {0} hours."}
                    '-4037': ExchangeError, // {"code":-4037,"msg":"Re-sending Mail failed."}
                    '-4038': ExchangeError, // {"code":-4038,"msg":"Please try again in 5 minutes."}
                    '-4039': BadRequest, // {"code":-4039,"msg":"The user does not exist."}
                    '-4040': BadRequest, // {"code":-4040,"msg":"This address not charged."}
                    '-4041': ExchangeError, // {"code":-4041,"msg":"Please try again in one minute."}
                    '-4042': ExchangeError, // {"code":-4042,"msg":"This asset cannot get deposit address again."}
                    '-4043': BadRequest, // {"code":-4043,"msg":"More than 100 recharge addresses were used in 24 hours."}
                    '-4044': BadRequest, // {"code":-4044,"msg":"This is a blacklist country."}
                    '-4045': ExchangeError, // {"code":-4045,"msg":"Failure to acquire assets."}
                    '-4046': AuthenticationError, // {"code":-4046,"msg":"Agreement not confirmed."}
                    '-4047': BadRequest, // {"code":-4047,"msg":"Time interval must be within 0-90 days"}
                    '-5001': BadRequest, // {"code":-5001,"msg":"Don't allow transfer to micro assets."}
                    '-5002': InsufficientFunds, // {"code":-5002,"msg":"You have insufficient balance."}
                    '-5003': InsufficientFunds, // {"code":-5003,"msg":"You don't have this asset."}
                    '-5004': BadRequest, // {"code":-5004,"msg":"The residual balances of %s have exceeded 0.001BTC, Please re-choose."}
                    '-5005': InsufficientFunds, // {"code":-5005,"msg":"The residual balances of %s is too low, Please re-choose."}
                    '-5006': BadRequest, // {"code":-5006,"msg":"Only transfer once in 24 hours."}
                    '-5007': BadRequest, // {"code":-5007,"msg":"Quantity must be greater than zero."}
                    '-5008': InsufficientFunds, // {"code":-5008,"msg":"Insufficient amount of returnable assets."}
                    '-5009': BadRequest, // {"code":-5009,"msg":"Product does not exist."}
                    '-5010': ExchangeError, // {"code":-5010,"msg":"Asset transfer fail."}
                    '-5011': BadRequest, // {"code":-5011,"msg":"future account not exists."}
                    '-5012': ExchangeError, // {"code":-5012,"msg":"Asset transfer is in pending."}
                    '-5013': InsufficientFunds, // {"code":-5013,"msg":"Asset transfer failed: insufficient balance""} // undocumented
                    '-5021': BadRequest, // {"code":-5021,"msg":"This parent sub have no relation"}
                    '-6001': BadRequest, // {"code":-6001,"msg":"Daily product not exists."}
                    '-6003': BadRequest, // {"code":-6003,"msg":"Product not exist or you don't have permission"}
                    '-6004': ExchangeError, // {"code":-6004,"msg":"Product not in purchase status"}
                    '-6005': InvalidOrder, // {"code":-6005,"msg":"Smaller than min purchase limit"}
                    '-6006': BadRequest, // {"code":-6006,"msg":"Redeem amount error"}
                    '-6007': BadRequest, // {"code":-6007,"msg":"Not in redeem time"}
                    '-6008': BadRequest, // {"code":-6008,"msg":"Product not in redeem status"}
                    '-6009': RateLimitExceeded, // {"code":-6009,"msg":"Request frequency too high"}
                    '-6011': BadRequest, // {"code":-6011,"msg":"Exceeding the maximum num allowed to purchase per user"}
                    '-6012': InsufficientFunds, // {"code":-6012,"msg":"Balance not enough"}
                    '-6013': ExchangeError, // {"code":-6013,"msg":"Purchasing failed"}
                    '-6014': BadRequest, // {"code":-6014,"msg":"Exceed up-limit allowed to purchased"}
                    '-6015': BadRequest, // {"code":-6015,"msg":"Empty request body"}
                    '-6016': BadRequest, // {"code":-6016,"msg":"Parameter err"}
                    '-6017': BadRequest, // {"code":-6017,"msg":"Not in whitelist"}
                    '-6018': BadRequest, // {"code":-6018,"msg":"Asset not enough"}
                    '-6019': AuthenticationError, // {"code":-6019,"msg":"Need confirm"}
                    '-6020': BadRequest, // {"code":-6020,"msg":"Project not exists"}
                    '-7001': BadRequest, // {"code":-7001,"msg":"Date range is not supported."}
                    '-7002': BadRequest, // {"code":-7002,"msg":"Data request type is not supported."}
                    '-10017': BadRequest, // {"code":-10017,"msg":"Repay amount should not be larger than liability."}
                    '-11008': InsufficientFunds, // {"code":-11008,"msg":"Exceeding the account's maximum borrowable limit."} // undocumented
                    '-12014': RateLimitExceeded, // {"code":-12014,"msg":"More than 1 request in 3 seconds"}
                    '-13000': BadRequest, // {"code":-13000,"msg":"Redeption of the token is forbiden now"}
                    '-13001': BadRequest, // {"code":-13001,"msg":"Exceeds individual 24h redemption limit of the token"}
                    '-13002': BadRequest, // {"code":-13002,"msg":"Exceeds total 24h redemption limit of the token"}
                    '-13003': BadRequest, // {"code":-13003,"msg":"Subscription of the token is forbiden now"}
                    '-13004': BadRequest, // {"code":-13004,"msg":"Exceeds individual 24h subscription limit of the token"}
                    '-13005': BadRequest, // {"code":-13005,"msg":"Exceeds total 24h subscription limit of the token"}
                    '-13006': InvalidOrder, // {"code":-13006,"msg":"Subscription amount is too small"}
                    '-13007': AuthenticationError, // {"code":-13007,"msg":"The Agreement is not signed"}
                    '100001003': BadRequest, // {"code":100001003,"msg":"Verification failed"} // undocumented
                },
                'broad': {
                    'has no operation privilege': PermissionDenied,
                    'MAX_POSITION': InvalidOrder, // {"code":-2010,"msg":"Filter failure: MAX_POSITION"}
                },
            },
        });
    }

    costToPrecision (symbol, cost) {
        return this.decimalToPrecision (cost, TRUNCATE, this.markets[symbol]['precision']['quote'], this.precisionMode, this.paddingMode);
    }

    currencyToPrecision (currency, fee) {
        // info is available in currencies only if the user has configured his api keys
        if (this.safeValue (this.currencies[currency], 'precision') !== undefined) {
            return this.decimalToPrecision (fee, TRUNCATE, this.currencies[currency]['precision'], this.precisionMode, this.paddingMode);
        } else {
            return this.numberToString (fee);
        }
    }

    nonce () {
        return this.milliseconds () - this.options['timeDifference'];
    }

    async fetchTime (params = {}) {
        const defaultType = this.safeString2 (this.options, 'fetchTime', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        const query = this.omit (params, 'type');
        let method = 'publicGetTime';
        if (type === 'future') {
            method = 'fapiPublicGetTime';
        } else if (type === 'delivery') {
            method = 'dapiPublicGetTime';
        }
        const response = await this[method] (query);
        return this.safeInteger (response, 'serverTime');
    }

    async fetchCurrencies (params = {}) {
        const fetchCurrenciesEnabled = this.safeValue (this.options, 'fetchCurrencies');
        if (!fetchCurrenciesEnabled) {
            return undefined;
        }
        // this endpoint requires authentication
        // while fetchCurrencies is a public API method by design
        // therefore we check the keys here
        // and fallback to generating the currencies from the markets
        if (!this.checkRequiredCredentials (false)) {
            return undefined;
        }
        // sandbox/testnet does not support sapi endpoints
        const apiBackup = this.safeString (this.urls, 'apiBackup');
        if (apiBackup !== undefined) {
            return undefined;
        }
        const response = await this.sapiGetCapitalConfigGetall (params);
        const result = {};
        for (let i = 0; i < response.length; i++) {
            //
            //     {
            //         coin: 'LINK',
            //         depositAllEnable: true,
            //         withdrawAllEnable: true,
            //         name: 'ChainLink',
            //         free: '0.06168',
            //         locked: '0',
            //         freeze: '0',
            //         withdrawing: '0',
            //         ipoing: '0',
            //         ipoable: '0',
            //         storage: '0',
            //         isLegalMoney: false,
            //         trading: true,
            //         networkList: [
            //             {
            //                 network: 'BNB',
            //                 coin: 'LINK',
            //                 withdrawIntegerMultiple: '0',
            //                 isDefault: false,
            //                 depositEnable: true,
            //                 withdrawEnable: true,
            //                 depositDesc: '',
            //                 withdrawDesc: '',
            //                 specialTips: 'Both a MEMO and an Address are required to successfully deposit your LINK BEP2 tokens to Binance.',
            //                 name: 'BEP2',
            //                 resetAddressStatus: false,
            //                 addressRegex: '^(bnb1)[0-9a-z]{38}$',
            //                 memoRegex: '^[0-9A-Za-z\\-_]{1,120}$',
            //                 withdrawFee: '0.002',
            //                 withdrawMin: '0.01',
            //                 withdrawMax: '9999999',
            //                 minConfirm: 1,
            //                 unLockConfirm: 0
            //             },
            //             {
            //                 network: 'BSC',
            //                 coin: 'LINK',
            //                 withdrawIntegerMultiple: '0.00000001',
            //                 isDefault: false,
            //                 depositEnable: true,
            //                 withdrawEnable: true,
            //                 depositDesc: '',
            //                 withdrawDesc: '',
            //                 specialTips: '',
            //                 name: 'BEP20 (BSC)',
            //                 resetAddressStatus: false,
            //                 addressRegex: '^(0x)[0-9A-Fa-f]{40}$',
            //                 memoRegex: '',
            //                 withdrawFee: '0.005',
            //                 withdrawMin: '0.01',
            //                 withdrawMax: '9999999',
            //                 minConfirm: 15,
            //                 unLockConfirm: 0
            //             },
            //             {
            //                 network: 'ETH',
            //                 coin: 'LINK',
            //                 withdrawIntegerMultiple: '0.00000001',
            //                 isDefault: true,
            //                 depositEnable: true,
            //                 withdrawEnable: true,
            //                 depositDesc: '',
            //                 withdrawDesc: '',
            //                 name: 'ERC20',
            //                 resetAddressStatus: false,
            //                 addressRegex: '^(0x)[0-9A-Fa-f]{40}$',
            //                 memoRegex: '',
            //                 withdrawFee: '0.34',
            //                 withdrawMin: '0.68',
            //                 withdrawMax: '0',
            //                 minConfirm: 12,
            //                 unLockConfirm: 0
            //             }
            //         ]
            //     }
            //
            const entry = response[i];
            const id = this.safeString (entry, 'coin');
            const name = this.safeString (entry, 'name');
            const code = this.safeCurrencyCode (id);
            const precision = undefined;
            let isWithdrawEnabled = true;
            let isDepositEnabled = true;
            const networkList = this.safeValue (entry, 'networkList', []);
            const fees = {};
            let fee = undefined;
            for (let j = 0; j < networkList.length; j++) {
                const networkItem = networkList[j];
                const network = this.safeString (networkItem, 'network');
                // const name = this.safeString (networkItem, 'name');
                const withdrawFee = this.safeNumber (networkItem, 'withdrawFee');
                const depositEnable = this.safeValue (networkItem, 'depositEnable');
                const withdrawEnable = this.safeValue (networkItem, 'withdrawEnable');
                isDepositEnabled = isDepositEnabled || depositEnable;
                isWithdrawEnabled = isWithdrawEnabled || withdrawEnable;
                fees[network] = withdrawFee;
                const isDefault = this.safeValue (networkItem, 'isDefault');
                if (isDefault || fee === undefined) {
                    fee = withdrawFee;
                }
            }
            const trading = this.safeValue (entry, 'trading');
            const active = (isWithdrawEnabled && isDepositEnabled && trading);
            result[code] = {
                'id': id,
                'name': name,
                'code': code,
                'precision': precision,
                'info': entry,
                'active': active,
                'deposit': isDepositEnabled,
                'withdraw': isWithdrawEnabled,
                'networks': networkList,
                'fee': fee,
                'fees': fees,
                'limits': this.limits,
            };
        }
        return result;
    }

    async fetchMarkets (params = {}) {
        const defaultType = this.safeString2 (this.options, 'fetchMarkets', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        const query = this.omit (params, 'type');
        if ((type !== 'spot') && (type !== 'future') && (type !== 'margin') && (type !== 'delivery')) {
            throw new ExchangeError (this.id + " does not support '" + type + "' type, set exchange.options['defaultType'] to 'spot', 'margin', 'delivery' or 'future'"); // eslint-disable-line quotes
        }
        let method = 'publicGetExchangeInfo';
        if (type === 'future') {
            method = 'fapiPublicGetExchangeInfo';
        } else if (type === 'delivery') {
            method = 'dapiPublicGetExchangeInfo';
        }
        const response = await this[method] (query);
        //
        // spot / margin
        //
        //     {
        //         "timezone":"UTC",
        //         "serverTime":1575416692969,
        //         "rateLimits":[
        //             {"rateLimitType":"REQUEST_WEIGHT","interval":"MINUTE","intervalNum":1,"limit":1200},
        //             {"rateLimitType":"ORDERS","interval":"SECOND","intervalNum":10,"limit":100},
        //             {"rateLimitType":"ORDERS","interval":"DAY","intervalNum":1,"limit":200000}
        //         ],
        //         "exchangeFilters":[],
        //         "symbols":[
        //             {
        //                 "symbol":"ETHBTC",
        //                 "status":"TRADING",
        //                 "baseAsset":"ETH",
        //                 "baseAssetPrecision":8,
        //                 "quoteAsset":"BTC",
        //                 "quotePrecision":8,
        //                 "baseCommissionPrecision":8,
        //                 "quoteCommissionPrecision":8,
        //                 "orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],
        //                 "icebergAllowed":true,
        //                 "ocoAllowed":true,
        //                 "quoteOrderQtyMarketAllowed":true,
        //                 "isSpotTradingAllowed":true,
        //                 "isMarginTradingAllowed":true,
        //                 "filters":[
        //                     {"filterType":"PRICE_FILTER","minPrice":"0.00000100","maxPrice":"100000.00000000","tickSize":"0.00000100"},
        //                     {"filterType":"PERCENT_PRICE","multiplierUp":"5","multiplierDown":"0.2","avgPriceMins":5},
        //                     {"filterType":"LOT_SIZE","minQty":"0.00100000","maxQty":"100000.00000000","stepSize":"0.00100000"},
        //                     {"filterType":"MIN_NOTIONAL","minNotional":"0.00010000","applyToMarket":true,"avgPriceMins":5},
        //                     {"filterType":"ICEBERG_PARTS","limit":10},
        //                     {"filterType":"MARKET_LOT_SIZE","minQty":"0.00000000","maxQty":"63100.00000000","stepSize":"0.00000000"},
        //                     {"filterType":"MAX_NUM_ALGO_ORDERS","maxNumAlgoOrders":5}
        //                 ]
        //             },
        //         ],
        //     }
        //
        // futures/usdt-margined (fapi)
        //
        //     {
        //         "timezone":"UTC",
        //         "serverTime":1575417244353,
        //         "rateLimits":[
        //             {"rateLimitType":"REQUEST_WEIGHT","interval":"MINUTE","intervalNum":1,"limit":1200},
        //             {"rateLimitType":"ORDERS","interval":"MINUTE","intervalNum":1,"limit":1200}
        //         ],
        //         "exchangeFilters":[],
        //         "symbols":[
        //             {
        //                 "symbol":"BTCUSDT",
        //                 "status":"TRADING",
        //                 "maintMarginPercent":"2.5000",
        //                 "requiredMarginPercent":"5.0000",
        //                 "baseAsset":"BTC",
        //                 "quoteAsset":"USDT",
        //                 "pricePrecision":2,
        //                 "quantityPrecision":3,
        //                 "baseAssetPrecision":8,
        //                 "quotePrecision":8,
        //                 "filters":[
        //                     {"minPrice":"0.01","maxPrice":"100000","filterType":"PRICE_FILTER","tickSize":"0.01"},
        //                     {"stepSize":"0.001","filterType":"LOT_SIZE","maxQty":"1000","minQty":"0.001"},
        //                     {"stepSize":"0.001","filterType":"MARKET_LOT_SIZE","maxQty":"1000","minQty":"0.001"},
        //                     {"limit":200,"filterType":"MAX_NUM_ORDERS"},
        //                     {"multiplierDown":"0.8500","multiplierUp":"1.1500","multiplierDecimal":"4","filterType":"PERCENT_PRICE"}
        //                 ],
        //                 "orderTypes":["LIMIT","MARKET","STOP"],
        //                 "timeInForce":["GTC","IOC","FOK","GTX"]
        //             }
        //         ]
        //     }
        //
        // delivery/coin-margined (dapi)
        //
        //     {
        //         "timezone": "UTC",
        //         "serverTime": 1597667052958,
        //         "rateLimits": [
        //             {"rateLimitType":"REQUEST_WEIGHT","interval":"MINUTE","intervalNum":1,"limit":6000},
        //             {"rateLimitType":"ORDERS","interval":"MINUTE","intervalNum":1,"limit":6000}
        //         ],
        //         "exchangeFilters": [],
        //         "symbols": [
        //             {
        //                 "symbol": "BTCUSD_200925",
        //                 "pair": "BTCUSD",
        //                 "contractType": "CURRENT_QUARTER",
        //                 "deliveryDate": 1601020800000,
        //                 "onboardDate": 1590739200000,
        //                 "contractStatus": "TRADING",
        //                 "contractSize": 100,
        //                 "marginAsset": "BTC",
        //                 "maintMarginPercent": "2.5000",
        //                 "requiredMarginPercent": "5.0000",
        //                 "baseAsset": "BTC",
        //                 "quoteAsset": "USD",
        //                 "pricePrecision": 1,
        //                 "quantityPrecision": 0,
        //                 "baseAssetPrecision": 8,
        //                 "quotePrecision": 8,
        //                 "equalQtyPrecision": 4,
        //                 "filters": [
        //                     {"minPrice":"0.1","maxPrice":"100000","filterType":"PRICE_FILTER","tickSize":"0.1"},
        //                     {"stepSize":"1","filterType":"LOT_SIZE","maxQty":"100000","minQty":"1"},
        //                     {"stepSize":"0","filterType":"MARKET_LOT_SIZE","maxQty":"100000","minQty":"1"},
        //                     {"limit":200,"filterType":"MAX_NUM_ORDERS"},
        //                     {"multiplierDown":"0.9500","multiplierUp":"1.0500","multiplierDecimal":"4","filterType":"PERCENT_PRICE"}
        //                 ],
        //                 "orderTypes": ["LIMIT","MARKET","STOP","STOP_MARKET","TAKE_PROFIT","TAKE_PROFIT_MARKET","TRAILING_STOP_MARKET"],
        //                 "timeInForce": ["GTC","IOC","FOK","GTX"]
        //             },
        //             {
        //                 "symbol": "BTCUSD_PERP",
        //                 "pair": "BTCUSD",
        //                 "contractType": "PERPETUAL",
        //                 "deliveryDate": 4133404800000,
        //                 "onboardDate": 1596006000000,
        //                 "contractStatus": "TRADING",
        //                 "contractSize": 100,
        //                 "marginAsset": "BTC",
        //                 "maintMarginPercent": "2.5000",
        //                 "requiredMarginPercent": "5.0000",
        //                 "baseAsset": "BTC",
        //                 "quoteAsset": "USD",
        //                 "pricePrecision": 1,
        //                 "quantityPrecision": 0,
        //                 "baseAssetPrecision": 8,
        //                 "quotePrecision": 8,
        //                 "equalQtyPrecision": 4,
        //                 "filters": [
        //                     {"minPrice":"0.1","maxPrice":"100000","filterType":"PRICE_FILTER","tickSize":"0.1"},
        //                     {"stepSize":"1","filterType":"LOT_SIZE","maxQty":"100000","minQty":"1"},
        //                     {"stepSize":"1","filterType":"MARKET_LOT_SIZE","maxQty":"100000","minQty":"1"},
        //                     {"limit":200,"filterType":"MAX_NUM_ORDERS"},
        //                     {"multiplierDown":"0.8500","multiplierUp":"1.1500","multiplierDecimal":"4","filterType":"PERCENT_PRICE"}
        //                 ],
        //                 "orderTypes": ["LIMIT","MARKET","STOP","STOP_MARKET","TAKE_PROFIT","TAKE_PROFIT_MARKET","TRAILING_STOP_MARKET"],
        //                 "timeInForce": ["GTC","IOC","FOK","GTX"]
        //             }
        //         ]
        //     }
        //
        if (this.options['adjustForTimeDifference']) {
            await this.loadTimeDifference ();
        }
        const markets = this.safeValue (response, 'symbols', []);
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            const market = markets[i];
            const spot = (type === 'spot');
            const future = (type === 'future');
            const delivery = (type === 'delivery');
            const id = this.safeString (market, 'symbol');
            const lowercaseId = this.safeStringLower (market, 'symbol');
            const baseId = this.safeString (market, 'baseAsset');
            const quoteId = this.safeString (market, 'quoteAsset');
            const settleId = this.safeString (market, 'marginAsset');
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            const settle = this.safeCurrencyCode (settleId);
            const contract = future || delivery;
            const contractType = this.safeString (market, 'contractType');
            const idSymbol = contract && (contractType !== 'PERPETUAL');
            let symbol = undefined;
            let expiry = undefined;
            if (idSymbol) {
                symbol = id;
                expiry = this.safeInteger (market, 'deliveryDate');
            } else {
                symbol = base + '/' + quote;
            }
            const filters = this.safeValue (market, 'filters', []);
            const filtersByType = this.indexBy (filters, 'filterType');
            const status = this.safeString2 (market, 'status', 'contractStatus');
            let contractSize = undefined;
            let fees = this.fees;
            if (contract) {
                contractSize = this.safeNumber (market, 'contractSize', this.parseNumber ('1'));
                fees = this.fees[type];
            }
            const isMarginTradingAllowed = this.safeValue (market, 'isMarginTradingAllowed', false);
            const entry = {
                'id': id,
                'lowercaseId': lowercaseId,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'settle': settle,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': settleId,
                'type': type,
                'spot': spot,
                'margin': spot && isMarginTradingAllowed,
                'future': future,
                'delivery': delivery,
                'option': false,
                'active': (status === 'TRADING'),
                'contract': contract,
                'linear': contract ? future : undefined,
                'inverse': contract ? delivery : undefined,
                'taker': fees['trading']['taker'],
                'maker': fees['trading']['maker'],
                'contractSize': contractSize,
                'expiry': expiry,
                'expiryDatetime': this.iso8601 (expiry),
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'price': this.safeInteger (market, 'pricePrecision'),
                    'amount': this.safeInteger (market, 'quantityPrecision'),
                    'base': this.safeInteger (market, 'baseAssetPrecision'),
                    'quote': this.safeInteger (market, 'quotePrecision'),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'info': market,
            };
            if ('PRICE_FILTER' in filtersByType) {
                const filter = this.safeValue (filtersByType, 'PRICE_FILTER', {});
                const tickSize = this.safeString (filter, 'tickSize');
                entry['precision']['price'] = this.precisionFromString (tickSize);
                // PRICE_FILTER reports zero values for maxPrice
                // since they updated filter types in November 2018
                // https://github.com/ccxt/ccxt/issues/4286
                // therefore limits['price']['max'] doesn't have any meaningful value except undefined
                entry['limits']['price'] = {
                    'min': this.safeNumber (filter, 'minPrice'),
                    'max': this.safeNumber (filter, 'maxPrice'),
                };
                entry['precision']['price'] = this.precisionFromString (filter['tickSize']);
            }
            if ('LOT_SIZE' in filtersByType) {
                const filter = this.safeValue (filtersByType, 'LOT_SIZE', {});
                const stepSize = this.safeString (filter, 'stepSize');
                entry['precision']['amount'] = this.precisionFromString (stepSize);
                entry['limits']['amount'] = {
                    'min': this.safeNumber (filter, 'minQty'),
                    'max': this.safeNumber (filter, 'maxQty'),
                };
            }
            if ('MARKET_LOT_SIZE' in filtersByType) {
                const filter = this.safeValue (filtersByType, 'MARKET_LOT_SIZE', {});
                entry['limits']['market'] = {
                    'min': this.safeNumber (filter, 'minQty'),
                    'max': this.safeNumber (filter, 'maxQty'),
                };
            }
            if ('MIN_NOTIONAL' in filtersByType) {
                const filter = this.safeValue (filtersByType, 'MIN_NOTIONAL', {});
                entry['limits']['cost']['min'] = this.safeNumber2 (filter, 'minNotional', 'notional');
            }
            result.push (entry);
        }
        return result;
    }

    parseBalance (response, type = undefined) {
        const result = {
            'info': response,
        };
        let timestamp = undefined;
        if ((type === 'spot') || (type === 'margin')) {
            timestamp = this.safeInteger (response, 'updateTime');
            const balances = this.safeValue2 (response, 'balances', 'userAssets', []);
            for (let i = 0; i < balances.length; i++) {
                const balance = balances[i];
                const currencyId = this.safeString (balance, 'asset');
                const code = this.safeCurrencyCode (currencyId);
                const account = this.account ();
                account['free'] = this.safeString (balance, 'free');
                account['used'] = this.safeString (balance, 'locked');
                result[code] = account;
            }
        } else if (type === 'savings') {
            const positionAmountVos = this.safeValue (response, 'positionAmountVos');
            for (let i = 0; i < positionAmountVos.length; i++) {
                const entry = positionAmountVos[i];
                const currencyId = this.safeString (entry, 'asset');
                const code = this.safeCurrencyCode (currencyId);
                const account = this.account ();
                const usedAndTotal = this.safeString (entry, 'amount');
                account['total'] = usedAndTotal;
                account['used'] = usedAndTotal;
                result[code] = account;
            }
        } else if (type === 'funding') {
            for (let i = 0; i < response.length; i++) {
                const entry = response[i];
                const account = this.account ();
                const currencyId = this.safeString (entry, 'asset');
                const code = this.safeCurrencyCode (currencyId);
                account['free'] = this.safeString (entry, 'free');
                const frozen = this.safeString (entry, 'freeze');
                const withdrawing = this.safeString (entry, 'withdrawing');
                const locked = this.safeString (entry, 'locked');
                account['used'] = Precise.stringAdd (frozen, Precise.stringAdd (locked, withdrawing));
                result[code] = account;
            }
        } else {
            let balances = response;
            if (!Array.isArray (response)) {
                balances = this.safeValue (response, 'assets', []);
            }
            for (let i = 0; i < balances.length; i++) {
                const balance = balances[i];
                const currencyId = this.safeString (balance, 'asset');
                const code = this.safeCurrencyCode (currencyId);
                const account = this.account ();
                account['free'] = this.safeString (balance, 'availableBalance');
                account['used'] = this.safeString (balance, 'initialMargin');
                account['total'] = this.safeString2 (balance, 'marginBalance', 'balance');
                result[code] = account;
            }
        }
        result['timestamp'] = timestamp;
        result['datetime'] = this.iso8601 (timestamp);
        return this.safeBalance (result);
    }

    async fetchBalance (params = {}) {
        await this.loadMarkets ();
        const defaultType = this.safeString2 (this.options, 'fetchBalance', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        let method = 'privateGetAccount';
        if (type === 'future') {
            const options = this.safeValue (this.options, type, {});
            const fetchBalanceOptions = this.safeValue (options, 'fetchBalance', {});
            method = this.safeString (fetchBalanceOptions, 'method', 'fapiPrivateV2GetAccount');
        } else if (type === 'delivery') {
            const options = this.safeValue (this.options, type, {});
            const fetchBalanceOptions = this.safeValue (options, 'fetchBalance', {});
            method = this.safeString (fetchBalanceOptions, 'method', 'dapiPrivateGetAccount');
        } else if (type === 'margin') {
            method = 'sapiGetMarginAccount';
        } else if (type === 'savings') {
            method = 'sapiGetLendingUnionAccount';
        } else if (type === 'funding') {
            method = 'sapiPostAssetGetFundingAsset';
        }
        const query = this.omit (params, 'type');
        const response = await this[method] (query);
        //
        // spot
        //
        //     {
        //         makerCommission: 10,
        //         takerCommission: 10,
        //         buyerCommission: 0,
        //         sellerCommission: 0,
        //         canTrade: true,
        //         canWithdraw: true,
        //         canDeposit: true,
        //         updateTime: 1575357359602,
        //         accountType: "MARGIN",
        //         balances: [
        //             { asset: "BTC", free: "0.00219821", locked: "0.00000000"  },
        //         ]
        //     }
        //
        // margin
        //
        //     {
        //         "borrowEnabled":true,
        //         "marginLevel":"999.00000000",
        //         "totalAssetOfBtc":"0.00000000",
        //         "totalLiabilityOfBtc":"0.00000000",
        //         "totalNetAssetOfBtc":"0.00000000",
        //         "tradeEnabled":true,
        //         "transferEnabled":true,
        //         "userAssets":[
        //             {"asset":"MATIC","borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000"},
        //             {"asset":"VET","borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000"},
        //             {"asset":"USDT","borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000"}
        //         ],
        //     }
        //
        // futures (fapi)
        //
        //     fapiPrivateGetAccount
        //
        //     {
        //         "feeTier":0,
        //         "canTrade":true,
        //         "canDeposit":true,
        //         "canWithdraw":true,
        //         "updateTime":0,
        //         "totalInitialMargin":"0.00000000",
        //         "totalMaintMargin":"0.00000000",
        //         "totalWalletBalance":"4.54000000",
        //         "totalUnrealizedProfit":"0.00000000",
        //         "totalMarginBalance":"4.54000000",
        //         "totalPositionInitialMargin":"0.00000000",
        //         "totalOpenOrderInitialMargin":"0.00000000",
        //         "maxWithdrawAmount":"4.54000000",
        //         "assets":[
        //             {
        //                 "asset":"USDT",
        //                 "walletBalance":"4.54000000",
        //                 "unrealizedProfit":"0.00000000",
        //                 "marginBalance":"4.54000000",
        //                 "maintMargin":"0.00000000",
        //                 "initialMargin":"0.00000000",
        //                 "positionInitialMargin":"0.00000000",
        //                 "openOrderInitialMargin":"0.00000000",
        //                 "maxWithdrawAmount":"4.54000000"
        //             }
        //         ],
        //         "positions":[
        //             {
        //                 "symbol":"BTCUSDT",
        //                 "initialMargin":"0.00000",
        //                 "maintMargin":"0.00000",
        //                 "unrealizedProfit":"0.00000000",
        //                 "positionInitialMargin":"0.00000",
        //                 "openOrderInitialMargin":"0.00000"
        //             }
        //         ]
        //     }
        //
        //     fapiPrivateV2GetAccount
        //
        //     {
        //         "feeTier":0,
        //         "canTrade":true,
        //         "canDeposit":true,
        //         "canWithdraw":true,
        //         "updateTime":0,
        //         "totalInitialMargin":"0.00000000",
        //         "totalMaintMargin":"0.00000000",
        //         "totalWalletBalance":"0.00000000",
        //         "totalUnrealizedProfit":"0.00000000",
        //         "totalMarginBalance":"0.00000000",
        //         "totalPositionInitialMargin":"0.00000000",
        //         "totalOpenOrderInitialMargin":"0.00000000",
        //         "totalCrossWalletBalance":"0.00000000",
        //         "totalCrossUnPnl":"0.00000000",
        //         "availableBalance":"0.00000000",
        //         "maxWithdrawAmount":"0.00000000",
        //         "assets":[
        //             {
        //                 "asset":"BNB",
        //                 "walletBalance":"0.01000000",
        //                 "unrealizedProfit":"0.00000000",
        //                 "marginBalance":"0.01000000",
        //                 "maintMargin":"0.00000000",
        //                 "initialMargin":"0.00000000",
        //                 "positionInitialMargin":"0.00000000",
        //                 "openOrderInitialMargin":"0.00000000",
        //                 "maxWithdrawAmount":"0.01000000",
        //                 "crossWalletBalance":"0.01000000",
        //                 "crossUnPnl":"0.00000000",
        //                 "availableBalance":"0.01000000"
        //             }
        //         ],
        //         "positions":[
        //             {
        //                 "symbol":"BTCUSDT",
        //                 "initialMargin":"0",
        //                 "maintMargin":"0",
        //                 "unrealizedProfit":"0.00000000",
        //                 "positionInitialMargin":"0",
        //                 "openOrderInitialMargin":"0",
        //                 "leverage":"20",
        //                 "isolated":false,
        //                 "entryPrice":"0.00000",
        //                 "maxNotional":"5000000",
        //                 "positionSide":"BOTH"
        //             },
        //         ]
        //     }
        //
        //     fapiPrivateV2GetBalance
        //
        //     [
        //         {
        //             "accountAlias":"FzFzXquXXqoC",
        //             "asset":"BNB",
        //             "balance":"0.01000000",
        //             "crossWalletBalance":"0.01000000",
        //             "crossUnPnl":"0.00000000",
        //             "availableBalance":"0.01000000",
        //             "maxWithdrawAmount":"0.01000000"
        //         }
        //     ]
        //
        // savings
        //
        //     {
        //       "totalAmountInBTC": "0.3172",
        //       "totalAmountInUSDT": "10000",
        //       "totalFixedAmountInBTC": "0.3172",
        //       "totalFixedAmountInUSDT": "10000",
        //       "totalFlexibleInBTC": "0",
        //       "totalFlexibleInUSDT": "0",
        //       "positionAmountVos": [
        //         {
        //           "asset": "USDT",
        //           "amount": "10000",
        //           "amountInBTC": "0.3172",
        //           "amountInUSDT": "10000"
        //         },
        //         {
        //           "asset": "BUSD",
        //           "amount": "0",
        //           "amountInBTC": "0",
        //           "amountInUSDT": "0"
        //         }
        //       ]
        //     }
        //
        // binance pay
        //
        //     [
        //       {
        //         "asset": "BUSD",
        //         "free": "1129.83",
        //         "locked": "0",
        //         "freeze": "0",
        //         "withdrawing": "0"
        //       }
        //     ]
        //
        return this.parseBalance (response, type);
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit; // default 100, max 5000, see https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#order-book
        }
        let method = 'publicGetDepth';
        if (market['linear']) {
            method = 'fapiPublicGetDepth';
        } else if (market['inverse']) {
            method = 'dapiPublicGetDepth';
        }
        const response = await this[method] (this.extend (request, params));
        //
        // future
        //
        //     {
        //         "lastUpdateId":333598053905,
        //         "E":1618631511986,
        //         "T":1618631511964,
        //         "bids":[
        //             ["2493.56","20.189"],
        //             ["2493.54","1.000"],
        //             ["2493.51","0.005"]
        //         ],
        //         "asks":[
        //             ["2493.57","0.877"],
        //             ["2493.62","0.063"],
        //             ["2493.71","12.054"],
        //         ]
        //     }
        const timestamp = this.safeInteger (response, 'T');
        const orderbook = this.parseOrderBook (response, symbol, timestamp);
        orderbook['nonce'] = this.safeInteger (response, 'lastUpdateId');
        return orderbook;
    }

    parseTicker (ticker, market = undefined) {
        //
        //     {
        //         symbol: 'ETHBTC',
        //         priceChange: '0.00068700',
        //         priceChangePercent: '2.075',
        //         weightedAvgPrice: '0.03342681',
        //         prevClosePrice: '0.03310300',
        //         lastPrice: '0.03378900',
        //         lastQty: '0.07700000',
        //         bidPrice: '0.03378900',
        //         bidQty: '7.16800000',
        //         askPrice: '0.03379000',
        //         askQty: '24.00000000',
        //         openPrice: '0.03310200',
        //         highPrice: '0.03388900',
        //         lowPrice: '0.03306900',
        //         volume: '205478.41000000',
        //         quoteVolume: '6868.48826294',
        //         openTime: 1601469986932,
        //         closeTime: 1601556386932,
        //         firstId: 196098772,
        //         lastId: 196186315,
        //         count: 87544
        //     }
        //
        // coinm
        //     {
        //         baseVolume: '214549.95171161',
        //         closeTime: '1621965286847',
        //         count: '1283779',
        //         firstId: '152560106',
        //         highPrice: '39938.3',
        //         lastId: '153843955',
        //         lastPrice: '37993.4',
        //         lastQty: '1',
        //         lowPrice: '36457.2',
        //         openPrice: '37783.4',
        //         openTime: '1621878840000',
        //         pair: 'BTCUSD',
        //         priceChange: '210.0',
        //         priceChangePercent: '0.556',
        //         symbol: 'BTCUSD_PERP',
        //         volume: '81990451',
        //         weightedAvgPrice: '38215.08713747'
        //     }
        //
        const timestamp = this.safeInteger (ticker, 'closeTime');
        const marketId = this.safeString (ticker, 'symbol');
        const symbol = this.safeSymbol (marketId, market);
        const last = this.safeString (ticker, 'lastPrice');
        const isCoinm = ('baseVolume' in ticker);
        let baseVolume = undefined;
        let quoteVolume = undefined;
        if (isCoinm) {
            baseVolume = this.safeString (ticker, 'baseVolume');
            quoteVolume = this.safeString (ticker, 'volume');
        } else {
            baseVolume = this.safeString (ticker, 'volume');
            quoteVolume = this.safeString (ticker, 'quoteVolume');
        }
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeString (ticker, 'highPrice'),
            'low': this.safeString (ticker, 'lowPrice'),
            'bid': this.safeString (ticker, 'bidPrice'),
            'bidVolume': this.safeString (ticker, 'bidQty'),
            'ask': this.safeString (ticker, 'askPrice'),
            'askVolume': this.safeString (ticker, 'askQty'),
            'vwap': this.safeString (ticker, 'weightedAvgPrice'),
            'open': this.safeString (ticker, 'openPrice'),
            'close': last,
            'last': last,
            'previousClose': this.safeString (ticker, 'prevClosePrice'), // previous day close
            'change': this.safeString (ticker, 'priceChange'),
            'percentage': this.safeString (ticker, 'priceChangePercent'),
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market, false);
    }

    async fetchStatus (params = {}) {
        const response = await this.sapiGetSystemStatus (params);
        let status = this.safeString (response, 'status');
        if (status !== undefined) {
            status = (status === '0') ? 'ok' : 'maintenance';
            this.status = this.extend (this.status, {
                'status': status,
                'updated': this.milliseconds (),
            });
        }
        return this.status;
    }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        let method = 'publicGetTicker24hr';
        if (market['linear']) {
            method = 'fapiPublicGetTicker24hr';
        } else if (market['inverse']) {
            method = 'dapiPublicGetTicker24hr';
        }
        const response = await this[method] (this.extend (request, params));
        if (Array.isArray (response)) {
            const firstTicker = this.safeValue (response, 0, {});
            return this.parseTicker (firstTicker, market);
        }
        return this.parseTicker (response, market);
    }

    async fetchBidsAsks (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        const defaultType = this.safeString2 (this.options, 'fetchBidsAsks', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        const query = this.omit (params, 'type');
        let method = undefined;
        if (type === 'future') {
            method = 'fapiPublicGetTickerBookTicker';
        } else if (type === 'delivery') {
            method = 'dapiPublicGetTickerBookTicker';
        } else {
            method = 'publicGetTickerBookTicker';
        }
        const response = await this[method] (query);
        return this.parseTickers (response, symbols);
    }

    async fetchTickers (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        const defaultType = this.safeString2 (this.options, 'fetchTickers', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        const query = this.omit (params, 'type');
        let defaultMethod = undefined;
        if (type === 'future') {
            defaultMethod = 'fapiPublicGetTicker24hr';
        } else if (type === 'delivery') {
            defaultMethod = 'dapiPublicGetTicker24hr';
        } else {
            defaultMethod = 'publicGetTicker24hr';
        }
        const method = this.safeString (this.options, 'fetchTickersMethod', defaultMethod);
        const response = await this[method] (query);
        return this.parseTickers (response, symbols);
    }

    parseOHLCV (ohlcv, market = undefined) {
        // when api method = publicGetKlines || fapiPublicGetKlines || dapiPublicGetKlines
        //     [
        //         1591478520000, // open time
        //         "0.02501300",  // open
        //         "0.02501800",  // high
        //         "0.02500000",  // low
        //         "0.02500000",  // close
        //         "22.19000000", // volume
        //         1591478579999, // close time
        //         "0.55490906",  // quote asset volume
        //         40,            // number of trades
        //         "10.92900000", // taker buy base asset volume
        //         "0.27336462",  // taker buy quote asset volume
        //         "0"            // ignore
        //     ]
        //
        //  when api method = fapiPublicGetMarkPriceKlines || fapiPublicGetIndexPriceKlines
        //     [
        //         [
        //         1591256460000,          // Open time
        //         "9653.29201333",        // Open
        //         "9654.56401333",        // High
        //         "9653.07367333",        // Low
        //         "9653.07367333",        // Close (or latest price)
        //         "0",                    // Ignore
        //         1591256519999,          // Close time
        //         "0",                    // Ignore
        //         60,                     // Number of bisic data
        //         "0",                    // Ignore
        //         "0",                    // Ignore
        //         "0"                     // Ignore
        //         ]
        //     ]
        //
        return [
            this.safeInteger (ohlcv, 0),
            this.safeNumber (ohlcv, 1),
            this.safeNumber (ohlcv, 2),
            this.safeNumber (ohlcv, 3),
            this.safeNumber (ohlcv, 4),
            this.safeNumber (ohlcv, 5),
        ];
    }

    async fetchOHLCV (symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        // binance docs say that the default limit 500, max 1500 for futures, max 1000 for spot markets
        // the reality is that the time range wider than 500 candles won't work right
        const defaultLimit = 500;
        const maxLimit = 1500;
        const price = this.safeString (params, 'price');
        params = this.omit (params, 'price');
        limit = (limit === undefined) ? defaultLimit : Math.min (limit, maxLimit);
        const request = {
            'interval': this.timeframes[timeframe],
            'limit': limit,
        };
        if (price === 'index') {
            request['pair'] = market['id'];   // Index price takes this argument instead of symbol
        } else {
            request['symbol'] = market['id'];
        }
        // const duration = this.parseTimeframe (timeframe);
        if (since !== undefined) {
            request['startTime'] = since;
            //
            // It didn't work before without the endTime
            // https://github.com/ccxt/ccxt/issues/8454
            //
            if (market['inverse']) {
                if (since > 0) {
                    const duration = this.parseTimeframe (timeframe);
                    const endTime = this.sum (since, limit * duration * 1000 - 1);
                    const now = this.milliseconds ();
                    request['endTime'] = Math.min (now, endTime);
                }
            }
        }
        let method = 'publicGetKlines';
        if (price === 'mark') {
            if (market['inverse']) {
                method = 'dapiPublicGetMarkPriceKlines';
            } else {
                method = 'fapiPublicGetMarkPriceKlines';
            }
        } else if (price === 'index') {
            if (market['inverse']) {
                method = 'dapiPublicGetIndexPriceKlines';
            } else {
                method = 'fapiPublicGetIndexPriceKlines';
            }
        } else if (market['linear']) {
            method = 'fapiPublicGetKlines';
        } else if (market['inverse']) {
            method = 'dapiPublicGetKlines';
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     [
        //         [1591478520000,"0.02501300","0.02501800","0.02500000","0.02500000","22.19000000",1591478579999,"0.55490906",40,"10.92900000","0.27336462","0"],
        //         [1591478580000,"0.02499600","0.02500900","0.02499400","0.02500300","21.34700000",1591478639999,"0.53370468",24,"7.53800000","0.18850725","0"],
        //         [1591478640000,"0.02500800","0.02501100","0.02500300","0.02500800","154.14200000",1591478699999,"3.85405839",97,"5.32300000","0.13312641","0"],
        //     ]
        //
        return this.parseOHLCVs (response, market, timeframe, since, limit);
    }

    async fetchMarkOHLCV (symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        const request = {
            'price': 'mark',
        };
        return await this.fetchOHLCV (symbol, timeframe, since, limit, this.extend (request, params));
    }

    async fetchIndexOHLCV (symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        const request = {
            'price': 'index',
        };
        return await this.fetchOHLCV (symbol, timeframe, since, limit, this.extend (request, params));
    }

    parseTrade (trade, market = undefined) {
        if ('isDustTrade' in trade) {
            return this.parseDustTrade (trade, market);
        }
        //
        // aggregate trades
        // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#compressedaggregate-trades-list
        //
        //     {
        //         "a": 26129,         // Aggregate tradeId
        //         "p": "0.01633102",  // Price
        //         "q": "4.70443515",  // Quantity
        //         "f": 27781,         // First tradeId
        //         "l": 27781,         // Last tradeId
        //         "T": 1498793709153, // Timestamp
        //         "m": true,          // Was the buyer the maker?
        //         "M": true           // Was the trade the best price match?
        //     }
        //
        // recent public trades and old public trades
        // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#recent-trades-list
        // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#old-trade-lookup-market_data
        //
        //     {
        //         "id": 28457,
        //         "price": "4.00000100",
        //         "qty": "12.00000000",
        //         "time": 1499865549590,
        //         "isBuyerMaker": true,
        //         "isBestMatch": true
        //     }
        //
        // private trades
        // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#account-trade-list-user_data
        //
        //     {
        //         "symbol": "BNBBTC",
        //         "id": 28457,
        //         "orderId": 100234,
        //         "price": "4.00000100",
        //         "qty": "12.00000000",
        //         "commission": "10.10000000",
        //         "commissionAsset": "BNB",
        //         "time": 1499865549590,
        //         "isBuyer": true,
        //         "isMaker": false,
        //         "isBestMatch": true
        //     }
        //
        // futures trades
        // https://binance-docs.github.io/apidocs/futures/en/#account-trade-list-user_data
        //
        //     {
        //       "accountId": 20,
        //       "buyer": False,
        //       "commission": "-0.07819010",
        //       "commissionAsset": "USDT",
        //       "counterPartyId": 653,
        //       "id": 698759,
        //       "maker": False,
        //       "orderId": 25851813,
        //       "price": "7819.01",
        //       "qty": "0.002",
        //       "quoteQty": "0.01563",
        //       "realizedPnl": "-0.91539999",
        //       "side": "SELL",
        //       "symbol": "BTCUSDT",
        //       "time": 1569514978020
        //     }
        //     {
        //       "symbol": "BTCUSDT",
        //       "id": 477128891,
        //       "orderId": 13809777875,
        //       "side": "SELL",
        //       "price": "38479.55",
        //       "qty": "0.001",
        //       "realizedPnl": "-0.00009534",
        //       "marginAsset": "USDT",
        //       "quoteQty": "38.47955",
        //       "commission": "-0.00076959",
        //       "commissionAsset": "USDT",
        //       "time": 1612733566708,
        //       "positionSide": "BOTH",
        //       "maker": true,
        //       "buyer": false
        //     }
        //
        // { respType: FULL }
        //
        //     {
        //       "price": "4000.00000000",
        //       "qty": "1.00000000",
        //       "commission": "4.00000000",
        //       "commissionAsset": "USDT",
        //       "tradeId": "1234",
        //     }
        //
        const timestamp = this.safeInteger2 (trade, 'T', 'time');
        const price = this.safeString2 (trade, 'p', 'price');
        const amount = this.safeString2 (trade, 'q', 'qty');
        const cost = this.safeString2 (trade, 'quoteQty', 'baseQty');  // inverse futures
        const marketId = this.safeString (trade, 'symbol');
        const symbol = this.safeSymbol (marketId, market);
        let id = this.safeString2 (trade, 't', 'a');
        id = this.safeString2 (trade, 'id', 'tradeId', id);
        let side = undefined;
        const orderId = this.safeString (trade, 'orderId');
        if ('m' in trade) {
            side = trade['m'] ? 'sell' : 'buy'; // this is reversed intentionally
        } else if ('isBuyerMaker' in trade) {
            side = trade['isBuyerMaker'] ? 'sell' : 'buy';
        } else if ('side' in trade) {
            side = this.safeStringLower (trade, 'side');
        } else {
            if ('isBuyer' in trade) {
                side = trade['isBuyer'] ? 'buy' : 'sell'; // this is a true side
            }
        }
        let fee = undefined;
        if ('commission' in trade) {
            fee = {
                'cost': this.safeString (trade, 'commission'),
                'currency': this.safeCurrencyCode (this.safeString (trade, 'commissionAsset')),
            };
        }
        let takerOrMaker = undefined;
        if ('isMaker' in trade) {
            takerOrMaker = trade['isMaker'] ? 'maker' : 'taker';
        }
        if ('maker' in trade) {
            takerOrMaker = trade['maker'] ? 'maker' : 'taker';
        }
        return this.safeTrade ({
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'id': id,
            'order': orderId,
            'type': undefined,
            'side': side,
            'takerOrMaker': takerOrMaker,
            'price': price,
            'amount': amount,
            'cost': cost,
            'fee': fee,
        }, market);
    }

    async fetchTrades (symbol, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
            // 'fromId': 123,    // ID to get aggregate trades from INCLUSIVE.
            // 'startTime': 456, // Timestamp in ms to get aggregate trades from INCLUSIVE.
            // 'endTime': 789,   // Timestamp in ms to get aggregate trades until INCLUSIVE.
            // 'limit': 500,     // default = 500, maximum = 1000
        };
        const defaultType = this.safeString2 (this.options, 'fetchTrades', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        const query = this.omit (params, 'type');
        let defaultMethod = undefined;
        if (type === 'future') {
            defaultMethod = 'fapiPublicGetAggTrades';
        } else if (type === 'delivery') {
            defaultMethod = 'dapiPublicGetAggTrades';
        } else {
            defaultMethod = 'publicGetAggTrades';
        }
        let method = this.safeString (this.options, 'fetchTradesMethod', defaultMethod);
        if (method === 'publicGetAggTrades') {
            if (since !== undefined) {
                request['startTime'] = since;
                // https://github.com/ccxt/ccxt/issues/6400
                // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#compressedaggregate-trades-list
                request['endTime'] = this.sum (since, 3600000);
            }
            if (type === 'future') {
                method = 'fapiPublicGetAggTrades';
            } else if (type === 'delivery') {
                method = 'dapiPublicGetAggTrades';
            }
        } else if (method === 'publicGetHistoricalTrades') {
            if (type === 'future') {
                method = 'fapiPublicGetHistoricalTrades';
            } else if (type === 'delivery') {
                method = 'dapiPublicGetHistoricalTrades';
            }
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default = 500, maximum = 1000
        }
        //
        // Caveats:
        // - default limit (500) applies only if no other parameters set, trades up
        //   to the maximum limit may be returned to satisfy other parameters
        // - if both limit and time window is set and time window contains more
        //   trades than the limit then the last trades from the window are returned
        // - 'tradeId' accepted and returned by this method is "aggregate" trade id
        //   which is different from actual trade id
        // - setting both fromId and time window results in error
        const response = await this[method] (this.extend (request, query));
        //
        // aggregate trades
        //
        //     [
        //         {
        //             "a": 26129,         // Aggregate tradeId
        //             "p": "0.01633102",  // Price
        //             "q": "4.70443515",  // Quantity
        //             "f": 27781,         // First tradeId
        //             "l": 27781,         // Last tradeId
        //             "T": 1498793709153, // Timestamp
        //             "m": true,          // Was the buyer the maker?
        //             "M": true           // Was the trade the best price match?
        //         }
        //     ]
        //
        // recent public trades and historical public trades
        //
        //     [
        //         {
        //             "id": 28457,
        //             "price": "4.00000100",
        //             "qty": "12.00000000",
        //             "time": 1499865549590,
        //             "isBuyerMaker": true,
        //             "isBestMatch": true
        //         }
        //     ]
        //
        return this.parseTrades (response, market, since, limit);
    }

    parseOrderStatus (status) {
        const statuses = {
            'NEW': 'open',
            'PARTIALLY_FILLED': 'open',
            'FILLED': 'closed',
            'CANCELED': 'canceled',
            'PENDING_CANCEL': 'canceling', // currently unused
            'REJECTED': 'rejected',
            'EXPIRED': 'expired',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrder (order, market = undefined) {
        //
        // spot
        //
        //     {
        //         "symbol": "LTCBTC",
        //         "orderId": 1,
        //         "clientOrderId": "myOrder1",
        //         "price": "0.1",
        //         "origQty": "1.0",
        //         "executedQty": "0.0",
        //         "cummulativeQuoteQty": "0.0",
        //         "status": "NEW",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "side": "BUY",
        //         "stopPrice": "0.0",
        //         "icebergQty": "0.0",
        //         "time": 1499827319559,
        //         "updateTime": 1499827319559,
        //         "isWorking": true
        //     }
        //
        // futures
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "orderId": 1,
        //         "clientOrderId": "myOrder1",
        //         "price": "0.1",
        //         "origQty": "1.0",
        //         "executedQty": "1.0",
        //         "cumQuote": "10.0",
        //         "status": "NEW",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "side": "BUY",
        //         "stopPrice": "0.0",
        //         "updateTime": 1499827319559
        //     }
        //
        // createOrder with { "newOrderRespType": "FULL" }
        //
        //     {
        //       "symbol": "BTCUSDT",
        //       "orderId": 5403233939,
        //       "orderListId": -1,
        //       "clientOrderId": "x-R4BD3S825e669e75b6c14f69a2c43e",
        //       "transactTime": 1617151923742,
        //       "price": "0.00000000",
        //       "origQty": "0.00050000",
        //       "executedQty": "0.00050000",
        //       "cummulativeQuoteQty": "29.47081500",
        //       "status": "FILLED",
        //       "timeInForce": "GTC",
        //       "type": "MARKET",
        //       "side": "BUY",
        //       "fills": [
        //         {
        //           "price": "58941.63000000",
        //           "qty": "0.00050000",
        //           "commission": "0.00007050",
        //           "commissionAsset": "BNB",
        //           "tradeId": 737466631
        //         }
        //       ]
        //     }
        //
        // delivery
        //
        //     {
        //       "orderId": "18742727411",
        //       "symbol": "ETHUSD_PERP",
        //       "pair": "ETHUSD",
        //       "status": "FILLED",
        //       "clientOrderId": "x-xcKtGhcu3e2d1503fdd543b3b02419",
        //       "price": "0",
        //       "avgPrice": "4522.14",
        //       "origQty": "1",
        //       "executedQty": "1",
        //       "cumBase": "0.00221134",
        //       "timeInForce": "GTC",
        //       "type": "MARKET",
        //       "reduceOnly": false,
        //       "closePosition": false,
        //       "side": "SELL",
        //       "positionSide": "BOTH",
        //       "stopPrice": "0",
        //       "workingType": "CONTRACT_PRICE",
        //       "priceProtect": false,
        //       "origType": "MARKET",
        //       "time": "1636061952660",
        //       "updateTime": "1636061952660"
        //     }
        //
        const status = this.parseOrderStatus (this.safeString (order, 'status'));
        const marketId = this.safeString (order, 'symbol');
        const symbol = this.safeSymbol (marketId, market);
        const filled = this.safeString (order, 'executedQty', '0');
        let timestamp = undefined;
        let lastTradeTimestamp = undefined;
        if ('time' in order) {
            timestamp = this.safeInteger (order, 'time');
        } else if ('transactTime' in order) {
            timestamp = this.safeInteger (order, 'transactTime');
        } else if ('updateTime' in order) {
            if (status === 'open') {
                if (Precise.stringGt (filled, '0')) {
                    lastTradeTimestamp = this.safeInteger (order, 'updateTime');
                } else {
                    timestamp = this.safeInteger (order, 'updateTime');
                }
            }
        }
        const average = this.safeString (order, 'avgPrice');
        const price = this.safeString (order, 'price');
        const amount = this.safeString (order, 'origQty');
        // - Spot/Margin market: cummulativeQuoteQty
        // - Futures market: cumQuote.
        //   Note this is not the actual cost, since Binance futures uses leverage to calculate margins.
        let cost = this.safeString2 (order, 'cummulativeQuoteQty', 'cumQuote');
        cost = this.safeString (order, 'cumBase', cost);
        const id = this.safeString (order, 'orderId');
        let type = this.safeStringLower (order, 'type');
        const side = this.safeStringLower (order, 'side');
        const fills = this.safeValue (order, 'fills', []);
        const clientOrderId = this.safeString (order, 'clientOrderId');
        const timeInForce = this.safeString (order, 'timeInForce');
        const postOnly = (type === 'limit_maker') || (timeInForce === 'GTX');
        if (type === 'limit_maker') {
            type = 'limit';
        }
        const stopPriceString = this.safeString (order, 'stopPrice');
        const stopPrice = this.parseNumber (this.omitZero (stopPriceString));
        return this.safeOrder ({
            'info': order,
            'id': id,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'symbol': symbol,
            'type': type,
            'timeInForce': timeInForce,
            'postOnly': postOnly,
            'side': side,
            'price': price,
            'stopPrice': stopPrice,
            'amount': amount,
            'cost': cost,
            'average': average,
            'filled': filled,
            'remaining': undefined,
            'status': status,
            'fee': undefined,
            'trades': fills,
        }, market);
    }

    async createReduceOnlyOrder (symbol, type, side, amount, price = undefined, params = {}) {
        const request = {
            'reduceOnly': true,
        };
        return await this.createOrder (symbol, type, side, amount, price, this.extend (request, params));
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const defaultType = this.safeString2 (this.options, 'createOrder', 'defaultType', 'spot');
        const orderType = this.safeString (params, 'type', defaultType);
        const clientOrderId = this.safeString2 (params, 'newClientOrderId', 'clientOrderId');
        const postOnly = this.safeValue (params, 'postOnly', false);
        params = this.omit (params, [ 'type', 'newClientOrderId', 'clientOrderId', 'postOnly' ]);
        const reduceOnly = this.safeValue (params, 'reduceOnly');
        if (reduceOnly !== undefined) {
            if ((orderType !== 'future') && (orderType !== 'delivery')) {
                throw new InvalidOrder (this.id + ' createOrder() does not support reduceOnly for ' + orderType + ' orders, reduceOnly orders are supported for futures and perpetuals only');
            }
        }
        let method = 'privatePostOrder';
        if (orderType === 'future') {
            method = 'fapiPrivatePostOrder';
        } else if (orderType === 'delivery') {
            method = 'dapiPrivatePostOrder';
        } else if (orderType === 'margin') {
            method = 'sapiPostMarginOrder';
        }
        // the next 5 lines are added to support for testing orders
        if (market['spot']) {
            const test = this.safeValue (params, 'test', false);
            if (test) {
                method += 'Test';
            }
            params = this.omit (params, 'test');
            // only supported for spot/margin api (all margin markets are spot markets)
            if (postOnly) {
                type = 'LIMIT_MAKER';
            }
        }
        const uppercaseType = type.toUpperCase ();
        const validOrderTypes = this.safeValue (market['info'], 'orderTypes');
        if (!this.inArray (uppercaseType, validOrderTypes)) {
            throw new InvalidOrder (this.id + ' ' + type + ' is not a valid order type in market ' + symbol);
        }
        const request = {
            'symbol': market['id'],
            'type': uppercaseType,
            'side': side.toUpperCase (),
        };
        if (clientOrderId === undefined) {
            const broker = this.safeValue (this.options, 'broker');
            if (broker !== undefined) {
                const brokerId = this.safeString (broker, orderType);
                if (brokerId !== undefined) {
                    request['newClientOrderId'] = brokerId + this.uuid22 ();
                }
            }
        } else {
            request['newClientOrderId'] = clientOrderId;
        }
        if ((orderType === 'spot') || (orderType === 'margin')) {
            request['newOrderRespType'] = this.safeValue (this.options['newOrderRespType'], type, 'RESULT'); // 'ACK' for order id, 'RESULT' for full order or 'FULL' for order with fills
        } else {
            // delivery and future
            request['newOrderRespType'] = 'RESULT';  // "ACK", "RESULT", default "ACK"
        }
        // additional required fields depending on the order type
        let timeInForceIsRequired = false;
        let priceIsRequired = false;
        let stopPriceIsRequired = false;
        let quantityIsRequired = false;
        //
        // spot/margin
        //
        //     LIMIT                timeInForce, quantity, price
        //     MARKET               quantity or quoteOrderQty
        //     STOP_LOSS            quantity, stopPrice
        //     STOP_LOSS_LIMIT      timeInForce, quantity, price, stopPrice
        //     TAKE_PROFIT          quantity, stopPrice
        //     TAKE_PROFIT_LIMIT    timeInForce, quantity, price, stopPrice
        //     LIMIT_MAKER          quantity, price
        //
        // futures
        //
        //     LIMIT                timeInForce, quantity, price
        //     MARKET               quantity
        //     STOP/TAKE_PROFIT     quantity, price, stopPrice
        //     STOP_MARKET          stopPrice
        //     TAKE_PROFIT_MARKET   stopPrice
        //     TRAILING_STOP_MARKET callbackRate
        //
        if (uppercaseType === 'MARKET') {
            const quoteOrderQty = this.safeValue (this.options, 'quoteOrderQty', false);
            if (quoteOrderQty) {
                const quoteOrderQty = this.safeNumber (params, 'quoteOrderQty');
                const precision = market['precision']['price'];
                if (quoteOrderQty !== undefined) {
                    request['quoteOrderQty'] = this.decimalToPrecision (quoteOrderQty, TRUNCATE, precision, this.precisionMode);
                    params = this.omit (params, 'quoteOrderQty');
                } else if (price !== undefined) {
                    request['quoteOrderQty'] = this.decimalToPrecision (amount * price, TRUNCATE, precision, this.precisionMode);
                } else {
                    quantityIsRequired = true;
                }
            } else {
                quantityIsRequired = true;
            }
        } else if (uppercaseType === 'LIMIT') {
            priceIsRequired = true;
            timeInForceIsRequired = true;
            quantityIsRequired = true;
        } else if ((uppercaseType === 'STOP_LOSS') || (uppercaseType === 'TAKE_PROFIT')) {
            stopPriceIsRequired = true;
            quantityIsRequired = true;
            if (market['linear'] || market['inverse']) {
                priceIsRequired = true;
            }
        } else if ((uppercaseType === 'STOP_LOSS_LIMIT') || (uppercaseType === 'TAKE_PROFIT_LIMIT')) {
            quantityIsRequired = true;
            stopPriceIsRequired = true;
            priceIsRequired = true;
            timeInForceIsRequired = true;
        } else if (uppercaseType === 'LIMIT_MAKER') {
            priceIsRequired = true;
            quantityIsRequired = true;
        } else if (uppercaseType === 'STOP') {
            quantityIsRequired = true;
            stopPriceIsRequired = true;
            priceIsRequired = true;
        } else if ((uppercaseType === 'STOP_MARKET') || (uppercaseType === 'TAKE_PROFIT_MARKET')) {
            const closePosition = this.safeValue (params, 'closePosition');
            if (closePosition === undefined) {
                quantityIsRequired = true;
            }
            stopPriceIsRequired = true;
        } else if (uppercaseType === 'TRAILING_STOP_MARKET') {
            quantityIsRequired = true;
            const callbackRate = this.safeNumber (params, 'callbackRate');
            if (callbackRate === undefined) {
                throw new InvalidOrder (this.id + ' createOrder() requires a callbackRate extra param for a ' + type + ' order');
            }
        }
        if (quantityIsRequired) {
            request['quantity'] = this.amountToPrecision (symbol, amount);
        }
        if (priceIsRequired) {
            if (price === undefined) {
                throw new InvalidOrder (this.id + ' createOrder() requires a price argument for a ' + type + ' order');
            }
            request['price'] = this.priceToPrecision (symbol, price);
        }
        if (timeInForceIsRequired) {
            request['timeInForce'] = this.options['defaultTimeInForce']; // 'GTC' = Good To Cancel (default), 'IOC' = Immediate Or Cancel
        }
        if (stopPriceIsRequired) {
            const stopPrice = this.safeNumber (params, 'stopPrice');
            if (stopPrice === undefined) {
                throw new InvalidOrder (this.id + ' createOrder() requires a stopPrice extra param for a ' + type + ' order');
            } else {
                params = this.omit (params, 'stopPrice');
                request['stopPrice'] = this.priceToPrecision (symbol, stopPrice);
            }
        }
        const response = await this[method] (this.extend (request, params));
        return this.parseOrder (response, market);
    }

    async fetchOrder (id, symbol = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const defaultType = this.safeString2 (this.options, 'fetchOrder', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        let method = 'privateGetOrder';
        if (type === 'future') {
            method = 'fapiPrivateGetOrder';
        } else if (type === 'delivery') {
            method = 'dapiPrivateGetOrder';
        } else if (type === 'margin') {
            method = 'sapiGetMarginOrder';
        }
        const request = {
            'symbol': market['id'],
        };
        const clientOrderId = this.safeValue2 (params, 'origClientOrderId', 'clientOrderId');
        if (clientOrderId !== undefined) {
            request['origClientOrderId'] = clientOrderId;
        } else {
            request['orderId'] = id;
        }
        const query = this.omit (params, [ 'type', 'clientOrderId', 'origClientOrderId' ]);
        const response = await this[method] (this.extend (request, query));
        return this.parseOrder (response, market);
    }

    async fetchOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const defaultType = this.safeString2 (this.options, 'fetchOrders', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        let method = 'privateGetAllOrders';
        if (type === 'future') {
            method = 'fapiPrivateGetAllOrders';
        } else if (type === 'delivery') {
            method = 'dapiPrivateGetAllOrders';
        } else if (type === 'margin') {
            method = 'sapiGetMarginAllOrders';
        }
        const request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const query = this.omit (params, 'type');
        const response = await this[method] (this.extend (request, query));
        //
        //  spot
        //
        //     [
        //         {
        //             "symbol": "LTCBTC",
        //             "orderId": 1,
        //             "clientOrderId": "myOrder1",
        //             "price": "0.1",
        //             "origQty": "1.0",
        //             "executedQty": "0.0",
        //             "cummulativeQuoteQty": "0.0",
        //             "status": "NEW",
        //             "timeInForce": "GTC",
        //             "type": "LIMIT",
        //             "side": "BUY",
        //             "stopPrice": "0.0",
        //             "icebergQty": "0.0",
        //             "time": 1499827319559,
        //             "updateTime": 1499827319559,
        //             "isWorking": true
        //         }
        //     ]
        //
        //  futures
        //
        //     [
        //         {
        //             "symbol": "BTCUSDT",
        //             "orderId": 1,
        //             "clientOrderId": "myOrder1",
        //             "price": "0.1",
        //             "origQty": "1.0",
        //             "executedQty": "1.0",
        //             "cumQuote": "10.0",
        //             "status": "NEW",
        //             "timeInForce": "GTC",
        //             "type": "LIMIT",
        //             "side": "BUY",
        //             "stopPrice": "0.0",
        //             "updateTime": 1499827319559
        //         }
        //     ]
        //
        return this.parseOrders (response, market, since, limit);
    }

    async fetchOpenOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let market = undefined;
        let query = undefined;
        let type = undefined;
        const request = {};
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
            const defaultType = this.safeString2 (this.options, 'fetchOpenOrders', 'defaultType', 'spot');
            const marketType = ('type' in market) ? market['type'] : defaultType;
            type = this.safeString (params, 'type', marketType);
            query = this.omit (params, 'type');
        } else if (this.options['warnOnFetchOpenOrdersWithoutSymbol']) {
            const symbols = this.symbols;
            const numSymbols = symbols.length;
            const fetchOpenOrdersRateLimit = parseInt (numSymbols / 2);
            throw new ExchangeError (this.id + ' fetchOpenOrders WARNING: fetching open orders without specifying a symbol is rate-limited to one call per ' + fetchOpenOrdersRateLimit.toString () + ' seconds. Do not call this method frequently to avoid ban. Set ' + this.id + '.options["warnOnFetchOpenOrdersWithoutSymbol"] = false to suppress this warning message.');
        } else {
            const defaultType = this.safeString2 (this.options, 'fetchOpenOrders', 'defaultType', 'spot');
            type = this.safeString (params, 'type', defaultType);
            query = this.omit (params, 'type');
        }
        let method = 'privateGetOpenOrders';
        if (type === 'future') {
            method = 'fapiPrivateGetOpenOrders';
        } else if (type === 'delivery') {
            method = 'dapiPrivateGetOpenOrders';
        } else if (type === 'margin') {
            method = 'sapiGetMarginOpenOrders';
        }
        const response = await this[method] (this.extend (request, query));
        return this.parseOrders (response, market, since, limit);
    }

    async fetchClosedOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        const orders = await this.fetchOrders (symbol, since, limit, params);
        return this.filterBy (orders, 'status', 'closed');
    }

    async cancelOrder (id, symbol = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const defaultType = this.safeString2 (this.options, 'fetchOpenOrders', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        // https://github.com/ccxt/ccxt/issues/6507
        const origClientOrderId = this.safeValue2 (params, 'origClientOrderId', 'clientOrderId');
        const request = {
            'symbol': market['id'],
            // 'orderId': id,
            // 'origClientOrderId': id,
        };
        if (origClientOrderId === undefined) {
            request['orderId'] = id;
        } else {
            request['origClientOrderId'] = origClientOrderId;
        }
        let method = 'privateDeleteOrder';
        if (type === 'future') {
            method = 'fapiPrivateDeleteOrder';
        } else if (type === 'delivery') {
            method = 'dapiPrivateDeleteOrder';
        } else if (type === 'margin') {
            method = 'sapiDeleteMarginOrder';
        }
        const query = this.omit (params, [ 'type', 'origClientOrderId', 'clientOrderId' ]);
        const response = await this[method] (this.extend (request, query));
        return this.parseOrder (response, market);
    }

    async cancelAllOrders (symbol = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelAllOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const defaultType = this.safeString2 (this.options, 'cancelAllOrders', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        const query = this.omit (params, 'type');
        let method = 'privateDeleteOpenOrders';
        if (type === 'margin') {
            method = 'sapiDeleteMarginOpenOrders';
        } else if (type === 'future') {
            method = 'fapiPrivateDeleteAllOpenOrders';
        } else if (type === 'delivery') {
            method = 'dapiPrivateDeleteAllOpenOrders';
        }
        const response = await this[method] (this.extend (request, query));
        if (Array.isArray (response)) {
            return this.parseOrders (response, market);
        } else {
            return response;
        }
    }

    async fetchOrderTrades (id, symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrderTrades() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const type = this.safeString (params, 'type', market['type']);
        params = this.omit (params, 'type');
        if (type !== 'spot') {
            throw new NotSupported (this.id + ' fetchOrderTrades() supports spot markets only');
        }
        const request = {
            'orderId': id,
        };
        return await this.fetchMyTrades (symbol, since, limit, this.extend (request, params));
    }

    async fetchMyTrades (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchMyTrades() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const type = this.safeString (params, 'type', market['type']);
        params = this.omit (params, 'type');
        let method = undefined;
        if (type === 'spot') {
            method = 'privateGetMyTrades';
        } else if (type === 'margin') {
            method = 'sapiGetMarginMyTrades';
        } else if (type === 'future') {
            method = 'fapiPrivateGetUserTrades';
        } else if (type === 'delivery') {
            method = 'dapiPrivateGetUserTrades';
        }
        const request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this[method] (this.extend (request, params));
        //
        // spot trade
        //
        //     [
        //         {
        //             "symbol": "BNBBTC",
        //             "id": 28457,
        //             "orderId": 100234,
        //             "price": "4.00000100",
        //             "qty": "12.00000000",
        //             "commission": "10.10000000",
        //             "commissionAsset": "BNB",
        //             "time": 1499865549590,
        //             "isBuyer": true,
        //             "isMaker": false,
        //             "isBestMatch": true,
        //         }
        //     ]
        //
        // futures trade
        //
        //     [
        //         {
        //             "accountId": 20,
        //             "buyer": False,
        //             "commission": "-0.07819010",
        //             "commissionAsset": "USDT",
        //             "counterPartyId": 653,
        //             "id": 698759,
        //             "maker": False,
        //             "orderId": 25851813,
        //             "price": "7819.01",
        //             "qty": "0.002",
        //             "quoteQty": "0.01563",
        //             "realizedPnl": "-0.91539999",
        //             "side": "SELL",
        //             "symbol": "BTCUSDT",
        //             "time": 1569514978020
        //         }
        //     ]
        //
        return this.parseTrades (response, market, since, limit);
    }

    async fetchMyDustTrades (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        //
        // Binance provides an opportunity to trade insignificant (i.e. non-tradable and non-withdrawable)
        // token leftovers (of any asset) into `BNB` coin which in turn can be used to pay trading fees with it.
        // The corresponding trades history is called the `Dust Log` and can be requested via the following end-point:
        // https://github.com/binance-exchange/binance-official-api-docs/blob/master/wapi-api.md#dustlog-user_data
        //
        await this.loadMarkets ();
        const request = {};
        if (since !== undefined) {
            request['startTime'] = since;
            request['endTime'] = this.sum (since, 7776000000);
        }
        const response = await this.sapiGetAssetDribblet (this.extend (request, params));
        //     {
        //       "total": "4",
        //       "userAssetDribblets": [
        //         {
        //           "operateTime": "1627575731000",
        //           "totalServiceChargeAmount": "0.00001453",
        //           "totalTransferedAmount": "0.00072693",
        //           "transId": "70899815863",
        //           "userAssetDribbletDetails": [
        //             {
        //               "fromAsset": "LTC",
        //               "amount": "0.000006",
        //               "transferedAmount": "0.00000267",
        //               "serviceChargeAmount": "0.00000005",
        //               "operateTime": "1627575731000",
        //               "transId": "70899815863"
        //             },
        //             {
        //               "fromAsset": "GBP",
        //               "amount": "0.15949157",
        //               "transferedAmount": "0.00072426",
        //               "serviceChargeAmount": "0.00001448",
        //               "operateTime": "1627575731000",
        //               "transId": "70899815863"
        //             }
        //           ]
        //         },
        //       ]
        //     }
        const results = this.safeValue (response, 'userAssetDribblets', []);
        const rows = this.safeInteger (response, 'total', 0);
        const data = [];
        for (let i = 0; i < rows; i++) {
            const logs = this.safeValue (results[i], 'userAssetDribbletDetails', []);
            for (let j = 0; j < logs.length; j++) {
                logs[j]['isDustTrade'] = true;
                data.push (logs[j]);
            }
        }
        const trades = this.parseTrades (data, undefined, since, limit);
        return this.filterBySinceLimit (trades, since, limit);
    }

    parseDustTrade (trade, market = undefined) {
        //
        //     {
        //       "fromAsset": "USDT",
        //       "amount": "0.009669",
        //       "transferedAmount": "0.00002992",
        //       "serviceChargeAmount": "0.00000059",
        //       "operateTime": "1628076010000",
        //       "transId": "71416578712",
        //       "isDustTrade": true
        //     }
        //
        const orderId = this.safeString (trade, 'transId');
        const timestamp = this.safeInteger (trade, 'operateTime');
        const currencyId = this.safeString (trade, 'fromAsset');
        const tradedCurrency = this.safeCurrencyCode (currencyId);
        const bnb = this.currency ('BNB');
        const earnedCurrency = bnb['code'];
        const applicantSymbol = earnedCurrency + '/' + tradedCurrency;
        let tradedCurrencyIsQuote = false;
        if (applicantSymbol in this.markets) {
            tradedCurrencyIsQuote = true;
        }
        const feeCostString = this.safeString (trade, 'serviceChargeAmount');
        const fee = {
            'currency': earnedCurrency,
            'cost': this.parseNumber (feeCostString),
        };
        let symbol = undefined;
        let amountString = undefined;
        let costString = undefined;
        let side = undefined;
        if (tradedCurrencyIsQuote) {
            symbol = applicantSymbol;
            amountString = this.safeString (trade, 'transferedAmount');
            costString = this.safeString (trade, 'amount');
            side = 'buy';
        } else {
            symbol = tradedCurrency + '/' + earnedCurrency;
            amountString = this.safeString (trade, 'amount');
            costString = this.safeString (trade, 'transferedAmount');
            side = 'sell';
        }
        let priceString = undefined;
        if (costString !== undefined) {
            if (amountString) {
                priceString = Precise.stringDiv (costString, amountString);
            }
        }
        const id = undefined;
        const amount = this.parseNumber (amountString);
        const price = this.parseNumber (priceString);
        const cost = this.parseNumber (costString);
        const type = undefined;
        const takerOrMaker = undefined;
        return {
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'order': orderId,
            'type': type,
            'takerOrMaker': takerOrMaker,
            'side': side,
            'amount': amount,
            'price': price,
            'cost': cost,
            'fee': fee,
            'info': trade,
        };
    }

    async fetchDeposits (code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let currency = undefined;
        let response = undefined;
        const request = {};
        const legalMoney = this.safeValue (this.options, 'legalMoney', {});
        if (code in legalMoney) {
            if (code !== undefined) {
                currency = this.currency (code);
            }
            request['transactionType'] = 0;
            if (since !== undefined) {
                request['beginTime'] = since;
            }
            const raw = await this.sapiGetFiatOrders (this.extend (request, params));
            response = this.safeValue (raw, 'data');
            //     {
            //       "code": "000000",
            //       "message": "success",
            //       "data": [
            //         {
            //           "orderNo": "25ced37075c1470ba8939d0df2316e23",
            //           "fiatCurrency": "EUR",
            //           "indicatedAmount": "15.00",
            //           "amount": "15.00",
            //           "totalFee": "0.00",
            //           "method": "card",
            //           "status": "Failed",
            //           "createTime": 1627501026000,
            //           "updateTime": 1627501027000
            //         }
            //       ],
            //       "total": 1,
            //       "success": true
            //     }
        } else {
            if (code !== undefined) {
                currency = this.currency (code);
                request['coin'] = currency['id'];
            }
            if (since !== undefined) {
                request['startTime'] = since;
                // max 3 months range https://github.com/ccxt/ccxt/issues/6495
                request['endTime'] = this.sum (since, 7776000000);
            }
            if (limit !== undefined) {
                request['limit'] = limit;
            }
            response = await this.sapiGetCapitalDepositHisrec (this.extend (request, params));
            //     [
            //       {
            //         "amount": "0.01844487",
            //         "coin": "BCH",
            //         "network": "BCH",
            //         "status": 1,
            //         "address": "1NYxAJhW2281HK1KtJeaENBqHeygA88FzR",
            //         "addressTag": "",
            //         "txId": "bafc5902504d6504a00b7d0306a41154cbf1d1b767ab70f3bc226327362588af",
            //         "insertTime": 1610784980000,
            //         "transferType": 0,
            //         "confirmTimes": "2/2"
            //       },
            //       {
            //         "amount": "4500",
            //         "coin": "USDT",
            //         "network": "BSC",
            //         "status": 1,
            //         "address": "0xc9c923c87347ca0f3451d6d308ce84f691b9f501",
            //         "addressTag": "",
            //         "txId": "Internal transfer 51376627901",
            //         "insertTime": 1618394381000,
            //         "transferType": 1,
            //         "confirmTimes": "1/15"
            //     }
            //   ]
        }
        return this.parseTransactions (response, currency, since, limit);
    }

    async fetchWithdrawals (code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const legalMoney = this.safeValue (this.options, 'legalMoney', {});
        const request = {};
        let response = undefined;
        let currency = undefined;
        if (code in legalMoney) {
            if (code !== undefined) {
                currency = this.currency (code);
            }
            request['transactionType'] = 1;
            if (since !== undefined) {
                request['beginTime'] = since;
            }
            const raw = await this.sapiGetFiatOrders (this.extend (request, params));
            response = this.safeValue (raw, 'data');
            //     {
            //       "code": "000000",
            //       "message": "success",
            //       "data": [
            //         {
            //           "orderNo": "CJW706452266115170304",
            //           "fiatCurrency": "GBP",
            //           "indicatedAmount": "10001.50",
            //           "amount": "100.00",
            //           "totalFee": "1.50",
            //           "method": "bank transfer",
            //           "status": "Successful",
            //           "createTime": 1620037745000,
            //           "updateTime": 1620038480000
            //         },
            //         {
            //           "orderNo": "CJW706287492781891584",
            //           "fiatCurrency": "GBP",
            //           "indicatedAmount": "10001.50",
            //           "amount": "100.00",
            //           "totalFee": "1.50",
            //           "method": "bank transfer",
            //           "status": "Successful",
            //           "createTime": 1619998460000,
            //           "updateTime": 1619998823000
            //         }
            //       ],
            //       "total": 39,
            //       "success": true
            //     }
        } else {
            if (code !== undefined) {
                currency = this.currency (code);
                request['coin'] = currency['id'];
            }
            if (since !== undefined) {
                request['startTime'] = since;
                // max 3 months range https://github.com/ccxt/ccxt/issues/6495
                request['endTime'] = this.sum (since, 7776000000);
            }
            if (limit !== undefined) {
                request['limit'] = limit;
            }
            response = await this.sapiGetCapitalWithdrawHistory (this.extend (request, params));
            //     [
            //       {
            //         "id": "69e53ad305124b96b43668ceab158a18",
            //         "amount": "28.75",
            //         "transactionFee": "0.25",
            //         "coin": "XRP",
            //         "status": 6,
            //         "address": "r3T75fuLjX51mmfb5Sk1kMNuhBgBPJsjza",
            //         "addressTag": "101286922",
            //         "txId": "19A5B24ED0B697E4F0E9CD09FCB007170A605BC93C9280B9E6379C5E6EF0F65A",
            //         "applyTime": "2021-04-15 12:09:16",
            //         "network": "XRP",
            //         "transferType": 0
            //       },
            //       {
            //         "id": "9a67628b16ba4988ae20d329333f16bc",
            //         "amount": "20",
            //         "transactionFee": "20",
            //         "coin": "USDT",
            //         "status": 6,
            //         "address": "0x0AB991497116f7F5532a4c2f4f7B1784488628e1",
            //         "txId": "0x77fbf2cf2c85b552f0fd31fd2e56dc95c08adae031d96f3717d8b17e1aea3e46",
            //         "applyTime": "2021-04-15 12:06:53",
            //         "network": "ETH",
            //         "transferType": 0
            //       },
            //       {
            //         "id": "a7cdc0afbfa44a48bd225c9ece958fe2",
            //         "amount": "51",
            //         "transactionFee": "1",
            //         "coin": "USDT",
            //         "status": 6,
            //         "address": "TYDmtuWL8bsyjvcauUTerpfYyVhFtBjqyo",
            //         "txId": "168a75112bce6ceb4823c66726ad47620ad332e69fe92d9cb8ceb76023f9a028",
            //         "applyTime": "2021-04-13 12:46:59",
            //         "network": "TRX",
            //         "transferType": 0
            //       }
            //     ]
        }
        return this.parseTransactions (response, currency, since, limit);
    }

    parseTransactionStatusByType (status, type = undefined) {
        const statusesByType = {
            'deposit': {
                '0': 'pending',
                '1': 'ok',
                // Fiat
                // Processing, Failed, Successful, Finished, Refunding, Refunded, Refund Failed, Order Partial credit Stopped
                'Processing': 'pending',
                'Failed': 'failed',
                'Successful': 'ok',
                'Refunding': 'canceled',
                'Refunded': 'canceled',
                'Refund Failed': 'failed',
            },
            'withdrawal': {
                '0': 'pending', // Email Sent
                '1': 'canceled', // Cancelled (different from 1 = ok in deposits)
                '2': 'pending', // Awaiting Approval
                '3': 'failed', // Rejected
                '4': 'pending', // Processing
                '5': 'failed', // Failure
                '6': 'ok', // Completed
                // Fiat
                // Processing, Failed, Successful, Finished, Refunding, Refunded, Refund Failed, Order Partial credit Stopped
                'Processing': 'pending',
                'Failed': 'failed',
                'Successful': 'ok',
                'Refunding': 'canceled',
                'Refunded': 'canceled',
                'Refund Failed': 'failed',
            },
        };
        const statuses = this.safeValue (statusesByType, type, {});
        return this.safeString (statuses, status, status);
    }

    parseTransaction (transaction, currency = undefined) {
        //
        // fetchDeposits
        //
        //     {
        //       "amount": "4500",
        //       "coin": "USDT",
        //       "network": "BSC",
        //       "status": 1,
        //       "address": "0xc9c923c87347ca0f3451d6d308ce84f691b9f501",
        //       "addressTag": "",
        //       "txId": "Internal transfer 51376627901",
        //       "insertTime": 1618394381000,
        //       "transferType": 1,
        //       "confirmTimes": "1/15"
        //     }
        //
        // fetchWithdrawals
        //
        //     {
        //       "id": "69e53ad305124b96b43668ceab158a18",
        //       "amount": "28.75",
        //       "transactionFee": "0.25",
        //       "coin": "XRP",
        //       "status": 6,
        //       "address": "r3T75fuLjX51mmfb5Sk1kMNuhBgBPJsjza",
        //       "addressTag": "101286922",
        //       "txId": "19A5B24ED0B697E4F0E9CD09FCB007170A605BC93C9280B9E6379C5E6EF0F65A",
        //       "applyTime": "2021-04-15 12:09:16",
        //       "network": "XRP",
        //       "transferType": 0
        //     }
        //
        // fiat transaction
        // withdraw
        //     {
        //       "orderNo": "CJW684897551397171200",
        //       "fiatCurrency": "GBP",
        //       "indicatedAmount": "29.99",
        //       "amount": "28.49",
        //       "totalFee": "1.50",
        //       "method": "bank transfer",
        //       "status": "Successful",
        //       "createTime": 1614898701000,
        //       "updateTime": 1614898820000
        //     }
        //
        // deposit
        //     {
        //       "orderNo": "25ced37075c1470ba8939d0df2316e23",
        //       "fiatCurrency": "EUR",
        //       "indicatedAmount": "15.00",
        //       "amount": "15.00",
        //       "totalFee": "0.00",
        //       "method": "card",
        //       "status": "Failed",
        //       "createTime": "1627501026000",
        //       "updateTime": "1627501027000"
        //     }
        //
        const id = this.safeString2 (transaction, 'id', 'orderNo');
        const address = this.safeString (transaction, 'address');
        let tag = this.safeString (transaction, 'addressTag'); // set but unused
        if (tag !== undefined) {
            if (tag.length < 1) {
                tag = undefined;
            }
        }
        let txid = this.safeString (transaction, 'txId');
        if ((txid !== undefined) && (txid.indexOf ('Internal transfer ') >= 0)) {
            txid = txid.slice (18);
        }
        const currencyId = this.safeString2 (transaction, 'coin', 'fiatCurrency');
        const code = this.safeCurrencyCode (currencyId, currency);
        let timestamp = undefined;
        const insertTime = this.safeInteger2 (transaction, 'insertTime', 'createTime');
        const applyTime = this.parse8601 (this.safeString (transaction, 'applyTime'));
        let type = this.safeString (transaction, 'type');
        if (type === undefined) {
            if ((insertTime !== undefined) && (applyTime === undefined)) {
                type = 'deposit';
                timestamp = insertTime;
            } else if ((insertTime === undefined) && (applyTime !== undefined)) {
                type = 'withdrawal';
                timestamp = applyTime;
            }
        }
        const status = this.parseTransactionStatusByType (this.safeString (transaction, 'status'), type);
        const amount = this.safeNumber (transaction, 'amount');
        const feeCost = this.safeNumber2 (transaction, 'transactionFee', 'totalFee');
        let fee = undefined;
        if (feeCost !== undefined) {
            fee = { 'currency': code, 'cost': feeCost };
        }
        const updated = this.safeInteger2 (transaction, 'successTime', 'updateTime');
        let internal = this.safeInteger (transaction, 'transferType', false);
        internal = internal ? true : false;
        const network = this.safeString (transaction, 'network');
        return {
            'info': transaction,
            'id': id,
            'txid': txid,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'network': network,
            'address': address,
            'addressTo': address,
            'addressFrom': undefined,
            'tag': tag,
            'tagTo': tag,
            'tagFrom': undefined,
            'type': type,
            'amount': amount,
            'currency': code,
            'status': status,
            'updated': updated,
            'internal': internal,
            'fee': fee,
        };
    }

    parseTransferStatus (status) {
        const statuses = {
            'CONFIRMED': 'ok',
        };
        return this.safeString (statuses, status, status);
    }

    parseTransfer (transfer, currency = undefined) {
        //
        // transfer
        //
        //     {
        //         "tranId":13526853623
        //     }
        //
        // fetchTransfers
        //
        //     {
        //         timestamp: 1614640878000,
        //         asset: 'USDT',
        //         amount: '25',
        //         type: 'MAIN_UMFUTURE',
        //         status: 'CONFIRMED',
        //         tranId: 43000126248
        //     }
        //
        const id = this.safeString (transfer, 'tranId');
        const currencyId = this.safeString (transfer, 'asset');
        const code = this.safeCurrencyCode (currencyId, currency);
        const amount = this.safeNumber (transfer, 'amount');
        const type = this.safeString (transfer, 'type');
        let fromAccount = undefined;
        let toAccount = undefined;
        const typesByAccount = this.safeValue (this.options, 'typesByAccount', {});
        if (type !== undefined) {
            const parts = type.split ('_');
            fromAccount = this.safeValue (parts, 0);
            toAccount = this.safeValue (parts, 1);
            fromAccount = this.safeString (typesByAccount, fromAccount, fromAccount);
            toAccount = this.safeString (typesByAccount, toAccount, toAccount);
        }
        const timestamp = this.safeInteger (transfer, 'timestamp');
        const status = this.parseTransferStatus (this.safeString (transfer, 'status'));
        return {
            'info': transfer,
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'currency': code,
            'amount': amount,
            'fromAccount': fromAccount,
            'toAccount': toAccount,
            'status': status,
        };
    }

    parseIncome (income, market = undefined) {
        //
        //     {
        //       "symbol": "ETHUSDT",
        //       "incomeType": "FUNDING_FEE",
        //       "income": "0.00134317",
        //       "asset": "USDT",
        //       "time": "1621584000000",
        //       "info": "FUNDING_FEE",
        //       "tranId": "4480321991774044580",
        //       "tradeId": ""
        //     }
        //
        const marketId = this.safeString (income, 'symbol');
        const symbol = this.safeSymbol (marketId, market);
        const amount = this.safeNumber (income, 'income');
        const currencyId = this.safeString (income, 'asset');
        const code = this.safeCurrencyCode (currencyId);
        const id = this.safeString (income, 'tranId');
        const timestamp = this.safeInteger (income, 'time');
        return {
            'info': income,
            'symbol': symbol,
            'code': code,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'id': id,
            'amount': amount,
        };
    }

    parseIncomes (incomes, market = undefined, since = undefined, limit = undefined) {
        const result = [];
        for (let i = 0; i < incomes.length; i++) {
            const entry = incomes[i];
            const parsed = this.parseIncome (entry, market);
            result.push (parsed);
        }
        const sorted = this.sortBy (result, 'timestamp');
        return this.filterBySinceLimit (sorted, since, limit);
    }

    async transfer (code, amount, fromAccount, toAccount, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        let type = this.safeString (params, 'type');
        if (type === undefined) {
            const accountsByType = this.safeValue (this.options, 'accountsByType', {});
            fromAccount = fromAccount.toLowerCase ();
            toAccount = toAccount.toLowerCase ();
            const fromId = this.safeString (accountsByType, fromAccount);
            const toId = this.safeString (accountsByType, toAccount);
            if (fromId === undefined) {
                const keys = Object.keys (accountsByType);
                throw new ExchangeError (this.id + ' fromAccount must be one of ' + keys.join (', '));
            }
            if (toId === undefined) {
                const keys = Object.keys (accountsByType);
                throw new ExchangeError (this.id + ' toAccount must be one of ' + keys.join (', '));
            }
            type = fromId + '_' + toId;
        }
        const request = {
            'asset': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
            'type': type,
        };
        const response = await this.sapiPostAssetTransfer (this.extend (request, params));
        //
        //     {
        //         "tranId":13526853623
        //     }
        //
        const transfer = this.parseTransfer (response, currency);
        return this.extend (transfer, {
            'amount': amount,
            'currency': code,
            'fromAccount': fromAccount,
            'toAccount': toAccount,
        });
    }

    async fetchTransfers (code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const defaultType = this.safeString2 (this.options, 'fetchTransfers', 'defaultType', 'spot');
        const fromAccount = this.safeString (params, 'fromAccount', defaultType);
        const defaultTo = (fromAccount === 'future') ? 'spot' : 'future';
        const toAccount = this.safeString (params, 'toAccount', defaultTo);
        let type = this.safeString (params, 'type');
        const accountsByType = this.safeValue (this.options, 'accountsByType', {});
        const fromId = this.safeString (accountsByType, fromAccount);
        const toId = this.safeString (accountsByType, toAccount);
        if (type === undefined) {
            if (fromId === undefined) {
                const keys = Object.keys (accountsByType);
                throw new ExchangeError (this.id + ' fromAccount parameter must be one of ' + keys.join (', '));
            }
            if (toId === undefined) {
                const keys = Object.keys (accountsByType);
                throw new ExchangeError (this.id + ' toAccount parameter must be one of ' + keys.join (', '));
            }
            type = fromId + '_' + toId;
        }
        const request = {
            'type': type,
        };
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['size'] = limit;
        }
        const response = await this.sapiGetAssetTransfer (this.extend (request, params));
        //
        //     {
        //         total: 3,
        //         rows: [
        //             {
        //                 timestamp: 1614640878000,
        //                 asset: 'USDT',
        //                 amount: '25',
        //                 type: 'MAIN_UMFUTURE',
        //                 status: 'CONFIRMED',
        //                 tranId: 43000126248
        //             },
        //         ]
        //     }
        //
        const rows = this.safeValue (response, 'rows', []);
        return this.parseTransfers (rows, currency, since, limit);
    }

    async fetchDepositAddress (code, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'coin': currency['id'],
            // 'network': 'ETH', // 'BSC', 'XMR', you can get network and isDefault in networkList in the response of sapiGetCapitalConfigDetail
        };
        const networks = this.safeValue (this.options, 'networks', {});
        let network = this.safeStringUpper (params, 'network'); // this line allows the user to specify either ERC20 or ETH
        network = this.safeString (networks, network, network); // handle ERC20>ETH alias
        if (network !== undefined) {
            request['network'] = network;
            params = this.omit (params, 'network');
        }
        // has support for the 'network' parameter
        // https://binance-docs.github.io/apidocs/spot/en/#deposit-address-supporting-network-user_data
        const response = await this.sapiGetCapitalDepositAddress (this.extend (request, params));
        //
        //     {
        //         currency: 'XRP',
        //         address: 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh',
        //         tag: '108618262',
        //         info: {
        //             coin: 'XRP',
        //             address: 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh',
        //             tag: '108618262',
        //             url: 'https://bithomp.com/explorer/rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh'
        //         }
        //     }
        //
        const address = this.safeString (response, 'address');
        const url = this.safeString (response, 'url');
        let impliedNetwork = undefined;
        if (url !== undefined) {
            const reverseNetworks = this.safeValue (this.options, 'reverseNetworks', {});
            const parts = url.split ('/');
            let topLevel = this.safeString (parts, 2);
            if ((topLevel === 'blockchair.com') || (topLevel === 'viewblock.io')) {
                const subLevel = this.safeString (parts, 3);
                if (subLevel !== undefined) {
                    topLevel = topLevel + '/' + subLevel;
                }
            }
            impliedNetwork = this.safeString (reverseNetworks, topLevel);
            const impliedNetworks = this.safeValue (this.options, 'impliedNetworks', {
                'ETH': { 'ERC20': 'ETH' },
                'TRX': { 'TRC20': 'TRX' },
            });
            if (code in impliedNetworks) {
                const conversion = this.safeValue (impliedNetworks, code, {});
                impliedNetwork = this.safeString (conversion, impliedNetwork, impliedNetwork);
            }
        }
        let tag = this.safeString (response, 'tag', '');
        if (tag.length === 0) {
            tag = undefined;
        }
        this.checkAddress (address);
        return {
            'currency': code,
            'address': address,
            'tag': tag,
            'network': impliedNetwork,
            'info': response,
        };
    }

    async fetchFundingFees (codes = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await this.sapiGetCapitalConfigGetall (params);
        //
        //  [
        //     {
        //       coin: 'BAT',
        //       depositAllEnable: true,
        //       withdrawAllEnable: true,
        //       name: 'Basic Attention Token',
        //       free: '0',
        //       locked: '0',
        //       freeze: '0',
        //       withdrawing: '0',
        //       ipoing: '0',
        //       ipoable: '0',
        //       storage: '0',
        //       isLegalMoney: false,
        //       trading: true,
        //       networkList: [
        //         {
        //           network: 'BNB',
        //           coin: 'BAT',
        //           withdrawIntegerMultiple: '0.00000001',
        //           isDefault: false,
        //           depositEnable: true,
        //           withdrawEnable: true,
        //           depositDesc: '',
        //           withdrawDesc: '',
        //           specialTips: 'The name of this asset is Basic Attention Token (BAT). Both a MEMO and an Address are required to successfully deposit your BEP2 tokens to Binance.',
        //           name: 'BEP2',
        //           resetAddressStatus: false,
        //           addressRegex: '^(bnb1)[0-9a-z]{38}$',
        //           memoRegex: '^[0-9A-Za-z\\-_]{1,120}$',
        //           withdrawFee: '0.27',
        //           withdrawMin: '0.54',
        //           withdrawMax: '10000000000',
        //           minConfirm: '1',
        //           unLockConfirm: '0'
        //         },
        //         {
        //           network: 'BSC',
        //           coin: 'BAT',
        //           withdrawIntegerMultiple: '0.00000001',
        //           isDefault: false,
        //           depositEnable: true,
        //           withdrawEnable: true,
        //           depositDesc: '',
        //           withdrawDesc: '',
        //           specialTips: 'The name of this asset is Basic Attention Token. Please ensure you are depositing Basic Attention Token (BAT) tokens under the contract address ending in 9766e.',
        //           name: 'BEP20 (BSC)',
        //           resetAddressStatus: false,
        //           addressRegex: '^(0x)[0-9A-Fa-f]{40}$',
        //           memoRegex: '',
        //           withdrawFee: '0.27',
        //           withdrawMin: '0.54',
        //           withdrawMax: '10000000000',
        //           minConfirm: '15',
        //           unLockConfirm: '0'
        //         },
        //         {
        //           network: 'ETH',
        //           coin: 'BAT',
        //           withdrawIntegerMultiple: '0.00000001',
        //           isDefault: true,
        //           depositEnable: true,
        //           withdrawEnable: true,
        //           depositDesc: '',
        //           withdrawDesc: '',
        //           specialTips: 'The name of this asset is Basic Attention Token. Please ensure you are depositing Basic Attention Token (BAT) tokens under the contract address ending in 887ef.',
        //           name: 'ERC20',
        //           resetAddressStatus: false,
        //           addressRegex: '^(0x)[0-9A-Fa-f]{40}$',
        //           memoRegex: '',
        //           withdrawFee: '27',
        //           withdrawMin: '54',
        //           withdrawMax: '10000000000',
        //           minConfirm: '12',
        //           unLockConfirm: '0'
        //         }
        //       ]
        //     }
        //  ]
        //
        const withdrawFees = {};
        for (let i = 0; i < response.length; i++) {
            const entry = response[i];
            const currencyId = this.safeString (entry, 'coin');
            const code = this.safeCurrencyCode (currencyId);
            const networkList = this.safeValue (entry, 'networkList');
            withdrawFees[code] = {};
            for (let j = 0; j < networkList.length; j++) {
                const networkEntry = networkList[j];
                const networkId = this.safeString (networkEntry, 'network');
                const networkCode = this.safeCurrencyCode (networkId);
                const fee = this.safeNumber (networkEntry, 'withdrawFee');
                withdrawFees[code][networkCode] = fee;
            }
        }
        return {
            'withdraw': withdrawFees,
            'deposit': {},
            'info': response,
        };
    }

    async withdraw (code, amount, address, tag = undefined, params = {}) {
        [ tag, params ] = this.handleWithdrawTagAndParams (tag, params);
        this.checkAddress (address);
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'coin': currency['id'],
            'address': address,
            'amount': amount,
            // https://binance-docs.github.io/apidocs/spot/en/#withdraw-sapi
            // issue sapiGetCapitalConfigGetall () to get networks for withdrawing USDT ERC20 vs USDT Omni
            // 'network': 'ETH', // 'BTC', 'TRX', etc, optional
        };
        if (tag !== undefined) {
            request['addressTag'] = tag;
        }
        const networks = this.safeValue (this.options, 'networks', {});
        let network = this.safeStringUpper (params, 'network'); // this line allows the user to specify either ERC20 or ETH
        network = this.safeString (networks, network, network); // handle ERC20>ETH alias
        if (network !== undefined) {
            request['network'] = network;
            params = this.omit (params, 'network');
        }
        const response = await this.sapiPostCapitalWithdrawApply (this.extend (request, params));
        //     { id: '9a67628b16ba4988ae20d329333f16bc' }
        return {
            'info': response,
            'id': this.safeString (response, 'id'),
        };
    }

    parseTradingFee (fee, market = undefined) {
        //
        //     {
        //         "symbol": "ADABNB",
        //         "makerCommission": 0.001,
        //         "takerCommission": 0.001
        //     }
        //
        const marketId = this.safeString (fee, 'symbol');
        const symbol = this.safeSymbol (marketId);
        return {
            'info': fee,
            'symbol': symbol,
            'maker': this.safeNumber (fee, 'makerCommission'),
            'taker': this.safeNumber (fee, 'takerCommission'),
        };
    }

    async fetchTradingFee (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.sapiGetAssetTradeFee (this.extend (request, params));
        //
        //     [
        //       {
        //         "symbol": "BTCUSDT",
        //         "makerCommission": "0.001",
        //         "takerCommission": "0.001"
        //       }
        //     ]
        //
        const first = this.safeValue (response, 0, {});
        return this.parseTradingFee (first);
    }

    async fetchTradingFees (params = {}) {
        await this.loadMarkets ();
        let method = undefined;
        const defaultType = this.safeString2 (this.options, 'fetchFundingRates', 'defaultType', 'future');
        const type = this.safeString (params, 'type', defaultType);
        const query = this.omit (params, 'type');
        if ((type === 'spot') || (type === 'margin')) {
            method = 'sapiGetAssetTradeFee';
        } else if (type === 'future') {
            method = 'fapiPrivateGetAccount';
        } else if (type === 'delivery') {
            method = 'dapiPrivateGetAccount';
        }
        const response = await this[method] (query);
        //
        // sapi / spot
        //
        //    [
        //       {
        //         "symbol": "ZRXBNB",
        //         "makerCommission": "0.001",
        //         "takerCommission": "0.001"
        //       },
        //       {
        //         "symbol": "ZRXBTC",
        //         "makerCommission": "0.001",
        //         "takerCommission": "0.001"
        //       },
        //    ]
        //
        // fapi / future / linear
        //
        //     {
        //         "feeTier": 0,       // account commisssion tier
        //         "canTrade": true,   // if can trade
        //         "canDeposit": true,     // if can transfer in asset
        //         "canWithdraw": true,    // if can transfer out asset
        //         "updateTime": 0,
        //         "totalInitialMargin": "0.00000000",    // total initial margin required with current mark price (useless with isolated positions), only for USDT asset
        //         "totalMaintMargin": "0.00000000",     // total maintenance margin required, only for USDT asset
        //         "totalWalletBalance": "23.72469206",     // total wallet balance, only for USDT asset
        //         "totalUnrealizedProfit": "0.00000000",   // total unrealized profit, only for USDT asset
        //         "totalMarginBalance": "23.72469206",     // total margin balance, only for USDT asset
        //         "totalPositionInitialMargin": "0.00000000",    // initial margin required for positions with current mark price, only for USDT asset
        //         "totalOpenOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price, only for USDT asset
        //         "totalCrossWalletBalance": "23.72469206",      // crossed wallet balance, only for USDT asset
        //         "totalCrossUnPnl": "0.00000000",      // unrealized profit of crossed positions, only for USDT asset
        //         "availableBalance": "23.72469206",       // available balance, only for USDT asset
        //         "maxWithdrawAmount": "23.72469206"     // maximum amount for transfer out, only for USDT asset
        //         ...
        //     }
        //
        // dapi / delivery / inverse
        //
        //     {
        //         "canDeposit": true,
        //         "canTrade": true,
        //         "canWithdraw": true,
        //         "feeTier": 2,
        //         "updateTime": 0
        //     }
        //
        if ((type === 'spot') || (type === 'margin')) {
            //
            //    [
            //       {
            //         "symbol": "ZRXBNB",
            //         "makerCommission": "0.001",
            //         "takerCommission": "0.001"
            //       },
            //       {
            //         "symbol": "ZRXBTC",
            //         "makerCommission": "0.001",
            //         "takerCommission": "0.001"
            //       },
            //    ]
            //
            const result = {};
            for (let i = 0; i < response.length; i++) {
                const fee = this.parseTradingFee (response[i]);
                const symbol = fee['symbol'];
                result[symbol] = fee;
            }
            return result;
        } else if (type === 'future') {
            //
            //     {
            //         "feeTier": 0,       // account commisssion tier
            //         "canTrade": true,   // if can trade
            //         "canDeposit": true,     // if can transfer in asset
            //         "canWithdraw": true,    // if can transfer out asset
            //         "updateTime": 0,
            //         "totalInitialMargin": "0.00000000",    // total initial margin required with current mark price (useless with isolated positions), only for USDT asset
            //         "totalMaintMargin": "0.00000000",     // total maintenance margin required, only for USDT asset
            //         "totalWalletBalance": "23.72469206",     // total wallet balance, only for USDT asset
            //         "totalUnrealizedProfit": "0.00000000",   // total unrealized profit, only for USDT asset
            //         "totalMarginBalance": "23.72469206",     // total margin balance, only for USDT asset
            //         "totalPositionInitialMargin": "0.00000000",    // initial margin required for positions with current mark price, only for USDT asset
            //         "totalOpenOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price, only for USDT asset
            //         "totalCrossWalletBalance": "23.72469206",      // crossed wallet balance, only for USDT asset
            //         "totalCrossUnPnl": "0.00000000",      // unrealized profit of crossed positions, only for USDT asset
            //         "availableBalance": "23.72469206",       // available balance, only for USDT asset
            //         "maxWithdrawAmount": "23.72469206"     // maximum amount for transfer out, only for USDT asset
            //         ...
            //     }
            //
            const symbols = Object.keys (this.markets);
            const result = {};
            const feeTier = this.safeInteger (response, 'feeTier');
            const feeTiers = this.fees[type]['trading']['tiers'];
            const maker = feeTiers['maker'][feeTier][1];
            const taker = feeTiers['taker'][feeTier][1];
            for (let i = 0; i < symbols.length; i++) {
                const symbol = symbols[i];
                result[symbol] = {
                    'info': {
                        'feeTier': feeTier,
                    },
                    'symbol': symbol,
                    'maker': maker,
                    'taker': taker,
                };
            }
            return result;
        } else if (type === 'delivery') {
            //
            //     {
            //         "canDeposit": true,
            //         "canTrade": true,
            //         "canWithdraw": true,
            //         "feeTier": 2,
            //         "updateTime": 0
            //     }
            //
            const symbols = Object.keys (this.markets);
            const result = {};
            const feeTier = this.safeInteger (response, 'feeTier');
            const feeTiers = this.fees[type]['trading']['tiers'];
            const maker = feeTiers['maker'][feeTier][1];
            const taker = feeTiers['taker'][feeTier][1];
            for (let i = 0; i < symbols.length; i++) {
                const symbol = symbols[i];
                result[symbol] = {
                    'info': {
                        'feeTier': feeTier,
                    },
                    'symbol': symbol,
                    'maker': maker,
                    'taker': taker,
                };
            }
            return result;
        }
    }

    async futuresTransfer (code, amount, type, params = {}) {
        if ((type < 1) || (type > 4)) {
            throw new ArgumentsRequired (this.id + ' type must be between 1 and 4');
        }
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'asset': currency['id'],
            'amount': amount,
            'type': type,
        };
        const response = await this.sapiPostFuturesTransfer (this.extend (request, params));
        //
        //   {
        //       "tranId": 100000001
        //   }
        //
        return this.parseTransfer (response, currency);
    }

    async fetchFundingRate (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        let method = undefined;
        if (market['linear']) {
            method = 'fapiPublicGetPremiumIndex';
        } else if (market['inverse']) {
            method = 'dapiPublicGetPremiumIndex';
        } else {
            throw new NotSupported (this.id + ' fetchFundingRate() supports linear and inverse contracts only');
        }
        let response = await this[method] (this.extend (request, params));
        if (market['inverse']) {
            response = response[0];
        }
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "markPrice": "45802.81129892",
        //         "indexPrice": "45745.47701915",
        //         "estimatedSettlePrice": "45133.91753671",
        //         "lastFundingRate": "0.00063521",
        //         "interestRate": "0.00010000",
        //         "nextFundingTime": "1621267200000",
        //         "time": "1621252344001"
        //     }
        //
        return this.parseFundingRate (response, market);
    }

    async fetchFundingRateHistory (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        //
        // Gets a history of funding rates with their timestamps
        //  (param) symbol: Future currency pair (e.g. "BTC/USDT")
        //  (param) limit: maximum number of data points returned
        //  (param) since: Unix timestamp in miliseconds for the time of the earliest requested funding rate
        //  (param) params: Object containing more params for the request
        //          - until: Unix timestamp in miliseconds for the time of the earliest requested funding rate
        //  return: [{symbol, fundingRate, timestamp}]
        //
        await this.loadMarkets ();
        const request = {};
        let method = undefined;
        const defaultType = this.safeString2 (this.options, 'fetchFundingRateHistory', 'defaultType', 'future');
        const type = this.safeString (params, 'type', defaultType);
        params = this.omit (params, 'type');
        if (type === 'future') {
            method = 'fapiPublicGetFundingRate';
        } else if (type === 'delivery') {
            method = 'dapiPublicGetFundingRate';
        }
        if (symbol !== undefined) {
            const market = this.market (symbol);
            request['symbol'] = market['id'];
            if (market['linear']) {
                method = 'fapiPublicGetFundingRate';
            } else if (market['inverse']) {
                method = 'dapiPublicGetFundingRate';
            }
        }
        if (method === undefined) {
            throw new NotSupported (this.id + ' fetchFundingRateHistory() not supported for ' + type + ' markets');
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        const till = this.safeInteger (params, 'till'); // unified in milliseconds
        const endTime = this.safeString (params, 'endTime', till); // exchange-specific in milliseconds
        params = this.omit (params, [ 'endTime', 'till' ]);
        if (endTime !== undefined) {
            request['endTime'] = endTime;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "fundingRate": "0.00063521",
        //         "fundingTime": "1621267200000",
        //     }
        //
        const rates = [];
        for (let i = 0; i < response.length; i++) {
            const entry = response[i];
            const timestamp = this.safeInteger (entry, 'fundingTime');
            rates.push ({
                'info': entry,
                'symbol': this.safeSymbol (this.safeString (entry, 'symbol')),
                'fundingRate': this.safeNumber (entry, 'fundingRate'),
                'timestamp': timestamp,
                'datetime': this.iso8601 (timestamp),
            });
        }
        const sorted = this.sortBy (rates, 'timestamp');
        return this.filterBySymbolSinceLimit (sorted, symbol, since, limit);
    }

    async fetchFundingRates (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        let method = undefined;
        const defaultType = this.safeString2 (this.options, 'fetchFundingRates', 'defaultType', 'future');
        const type = this.safeString (params, 'type', defaultType);
        const query = this.omit (params, 'type');
        if (type === 'future') {
            method = 'fapiPublicGetPremiumIndex';
        } else if (type === 'delivery') {
            method = 'dapiPublicGetPremiumIndex';
        } else {
            throw new NotSupported (this.id + ' fetchFundingRates() supports linear and inverse contracts only');
        }
        const response = await this[method] (query);
        const result = [];
        for (let i = 0; i < response.length; i++) {
            const entry = response[i];
            const parsed = this.parseFundingRate (entry);
            result.push (parsed);
        }
        return this.filterByArray (result, 'symbol', symbols);
    }

    parseFundingRate (premiumIndex, market = undefined) {
        // ensure it matches with https://www.binance.com/en/futures/funding-history/0
        //
        //   {
        //     "symbol": "BTCUSDT",
        //     "markPrice": "45802.81129892",
        //     "indexPrice": "45745.47701915",
        //     "estimatedSettlePrice": "45133.91753671",
        //     "lastFundingRate": "0.00063521",
        //     "interestRate": "0.00010000",
        //     "nextFundingTime": "1621267200000",
        //     "time": "1621252344001"
        //  }
        //
        const timestamp = this.safeInteger (premiumIndex, 'time');
        const marketId = this.safeString (premiumIndex, 'symbol');
        const symbol = this.safeSymbol (marketId, market);
        const markPrice = this.safeNumber (premiumIndex, 'markPrice');
        const indexPrice = this.safeNumber (premiumIndex, 'indexPrice');
        const interestRate = this.safeNumber (premiumIndex, 'interestRate');
        const estimatedSettlePrice = this.safeNumber (premiumIndex, 'estimatedSettlePrice');
        const fundingRate = this.safeNumber (premiumIndex, 'lastFundingRate');
        const fundingTime = this.safeInteger (premiumIndex, 'nextFundingTime');
        return {
            'info': premiumIndex,
            'symbol': symbol,
            'markPrice': markPrice,
            'indexPrice': indexPrice,
            'interestRate': interestRate,
            'estimatedSettlePrice': estimatedSettlePrice,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'fundingRate': fundingRate,
            'fundingTimestamp': fundingTime,
            'fundingDatetime': this.iso8601 (fundingTime),
            'nextFundingRate': undefined,
            'nextFundingTimestamp': undefined,
            'nextFundingDatetime': undefined,
            'previousFundingRate': undefined,
            'previousFundingTimestamp': undefined,
            'previousFundingDatetime': undefined,
        };
    }

    parseAccountPositions (account) {
        const positions = this.safeValue (account, 'positions');
        const assets = this.safeValue (account, 'assets');
        const balances = {};
        for (let i = 0; i < assets.length; i++) {
            const entry = assets[i];
            const currencyId = this.safeString (entry, 'asset');
            const code = this.safeCurrencyCode (currencyId);
            const crossWalletBalance = this.safeString (entry, 'crossWalletBalance');
            const crossUnPnl = this.safeString (entry, 'crossUnPnl');
            balances[code] = {
                'crossMargin': Precise.stringAdd (crossWalletBalance, crossUnPnl),
                'crossWalletBalance': crossWalletBalance,
            };
        }
        const result = [];
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i];
            const marketId = this.safeString (position, 'symbol');
            const market = this.safeMarket (marketId);
            const code = (this.options['defaultType'] === 'future') ? market['quote'] : market['base'];
            // sometimes not all the codes are correctly returned...
            if (code in balances) {
                const parsed = this.parseAccountPosition (this.extend (position, {
                    'crossMargin': balances[code]['crossMargin'],
                    'crossWalletBalance': balances[code]['crossWalletBalance'],
                }), market);
                result.push (parsed);
            }
        }
        return result;
    }

    parseAccountPosition (position, market = undefined) {
        //
        // usdm
        //    {
        //       "symbol": "BTCBUSD",
        //       "initialMargin": "0",
        //       "maintMargin": "0",
        //       "unrealizedProfit": "0.00000000",
        //       "positionInitialMargin": "0",
        //       "openOrderInitialMargin": "0",
        //       "leverage": "20",
        //       "isolated": false,
        //       "entryPrice": "0.0000",
        //       "maxNotional": "100000",
        //       "positionSide": "BOTH",
        //       "positionAmt": "0.000",
        //       "notional": "0",
        //       "isolatedWallet": "0",
        //       "updateTime": "0",
        //       "crossMargin": "100.93634809",
        //     }
        //
        // coinm
        //     {
        //       "symbol": "BTCUSD_210625",
        //       "initialMargin": "0.00024393",
        //       "maintMargin": "0.00002439",
        //       "unrealizedProfit": "-0.00000163",
        //       "positionInitialMargin": "0.00024393",
        //       "openOrderInitialMargin": "0",
        //       "leverage": "10",
        //       "isolated": false,
        //       "positionSide": "BOTH",
        //       "entryPrice": "41021.20000069",
        //       "maxQty": "100",
        //       "notionalValue": "0.00243939",
        //       "isolatedWallet": "0",
        //       "crossMargin": "0.314"
        //       "crossWalletBalance": "34",
        //     }
        //
        const marketId = this.safeString (position, 'symbol');
        market = this.safeMarket (marketId, market);
        const symbol = this.safeString (market, 'symbol');
        const leverageString = this.safeString (position, 'leverage');
        const leverage = parseInt (leverageString);
        const initialMarginString = this.safeString (position, 'initialMargin');
        const initialMargin = this.parseNumber (initialMarginString);
        let initialMarginPercentageString = Precise.stringDiv ('1', leverageString, 8);
        const rational = (1000 % leverage) === 0;
        if (!rational) {
            initialMarginPercentageString = Precise.stringDiv (Precise.stringAdd (initialMarginPercentageString, '1e-8'), '1', 8);
        }
        // as oppose to notionalValue
        const usdm = ('notional' in position);
        const maintenanceMarginString = this.safeString (position, 'maintMargin');
        const maintenanceMargin = this.parseNumber (maintenanceMarginString);
        const entryPriceString = this.safeString (position, 'entryPrice');
        let entryPrice = this.parseNumber (entryPriceString);
        const notionalString = this.safeString2 (position, 'notional', 'notionalValue');
        const notionalStringAbs = Precise.stringAbs (notionalString);
        const notionalFloat = parseFloat (notionalString);
        const notionalFloatAbs = parseFloat (notionalStringAbs);
        const notional = this.parseNumber (Precise.stringAbs (notionalString));
        let contractsString = this.safeString (position, 'positionAmt');
        let contractsStringAbs = Precise.stringAbs (contractsString);
        if (contractsString === undefined) {
            const entryNotional = Precise.stringMul (Precise.stringMul (leverageString, initialMarginString), entryPriceString);
            const contractSize = this.safeString (market, 'contractSize');
            contractsString = Precise.stringDiv (entryNotional, contractSize);
            contractsStringAbs = Precise.stringDiv (Precise.stringAdd (contractsString, '0.5'), '1', 0);
        }
        const contracts = this.parseNumber (contractsStringAbs);
        const leverageBrackets = this.safeValue (this.options, 'leverageBrackets', {});
        const leverageBracket = this.safeValue (leverageBrackets, symbol, []);
        let maintenanceMarginPercentageString = undefined;
        for (let i = 0; i < leverageBracket.length; i++) {
            const bracket = leverageBracket[i];
            if (notionalFloatAbs < bracket[0]) {
                break;
            }
            maintenanceMarginPercentageString = bracket[1];
        }
        const maintenanceMarginPercentage = this.parseNumber (maintenanceMarginPercentageString);
        const unrealizedPnlString = this.safeString (position, 'unrealizedProfit');
        const unrealizedPnl = this.parseNumber (unrealizedPnlString);
        let timestamp = this.safeInteger (position, 'updateTime');
        if (timestamp === 0) {
            timestamp = undefined;
        }
        const isolated = this.safeValue (position, 'isolated');
        let marginType = undefined;
        let collateralString = undefined;
        let walletBalance = undefined;
        if (isolated) {
            marginType = 'isolated';
            walletBalance = this.safeString (position, 'isolatedWallet');
            collateralString = Precise.stringAdd (walletBalance, unrealizedPnlString);
        } else {
            marginType = 'cross';
            walletBalance = this.safeString (position, 'crossWalletBalance');
            collateralString = this.safeString (position, 'crossMargin');
        }
        const collateral = this.parseNumber (collateralString);
        let marginRatio = undefined;
        let side = undefined;
        let percentage = undefined;
        let liquidationPriceStringRaw = undefined;
        let liquidationPrice = undefined;
        const contractSize = this.safeValue (market, 'contractSize');
        const contractSizeString = this.numberToString (contractSize);
        if (notionalFloat === 0.0) {
            entryPrice = undefined;
        } else {
            side = (notionalFloat < 0) ? 'short' : 'long';
            marginRatio = this.parseNumber (Precise.stringDiv (Precise.stringAdd (Precise.stringDiv (maintenanceMarginString, collateralString), '5e-5'), '1', 4));
            percentage = this.parseNumber (Precise.stringMul (Precise.stringDiv (unrealizedPnlString, initialMarginString, 4), '100'));
            if (usdm) {
                // calculate liquidation price
                //
                // liquidationPrice = (walletBalance / (contracts * (±1 + mmp))) + (±entryPrice / (±1 + mmp))
                //
                // mmp = maintenanceMarginPercentage
                // where ± is negative for long and positive for short
                // TODO: calculate liquidation price for coinm contracts
                let onePlusMaintenanceMarginPercentageString = undefined;
                let entryPriceSignString = entryPriceString;
                if (side === 'short') {
                    onePlusMaintenanceMarginPercentageString = Precise.stringAdd ('1', maintenanceMarginPercentageString);
                } else {
                    onePlusMaintenanceMarginPercentageString = Precise.stringAdd ('-1', maintenanceMarginPercentageString);
                    entryPriceSignString = Precise.stringMul ('-1', entryPriceSignString);
                }
                const leftSide = Precise.stringDiv (walletBalance, Precise.stringMul (contractsStringAbs, onePlusMaintenanceMarginPercentageString));
                const rightSide = Precise.stringDiv (entryPriceSignString, onePlusMaintenanceMarginPercentageString);
                liquidationPriceStringRaw = Precise.stringAdd (leftSide, rightSide);
            } else {
                // calculate liquidation price
                //
                // liquidationPrice = (contracts * contractSize(±1 - mmp)) / (±1/entryPrice * contracts * contractSize - walletBalance)
                //
                let onePlusMaintenanceMarginPercentageString = undefined;
                let entryPriceSignString = entryPriceString;
                if (side === 'short') {
                    onePlusMaintenanceMarginPercentageString = Precise.stringSub ('1', maintenanceMarginPercentageString);
                } else {
                    onePlusMaintenanceMarginPercentageString = Precise.stringSub ('-1', maintenanceMarginPercentageString);
                    entryPriceSignString = Precise.stringMul ('-1', entryPriceSignString);
                }
                const size = Precise.stringMul (contractsStringAbs, contractSizeString);
                const leftSide = Precise.stringMul (size, onePlusMaintenanceMarginPercentageString);
                const rightSide = Precise.stringSub (Precise.stringMul (Precise.stringDiv ('1', entryPriceSignString), size), walletBalance);
                liquidationPriceStringRaw = Precise.stringDiv (leftSide, rightSide);
            }
            const pricePrecision = market['precision']['price'];
            const pricePrecisionPlusOne = pricePrecision + 1;
            const pricePrecisionPlusOneString = pricePrecisionPlusOne.toString ();
            // round half up
            const rounder = new Precise ('5e-' + pricePrecisionPlusOneString);
            const rounderString = rounder.toString ();
            const liquidationPriceRoundedString = Precise.stringAdd (rounderString, liquidationPriceStringRaw);
            let truncatedLiquidationPrice = Precise.stringDiv (liquidationPriceRoundedString, '1', pricePrecision);
            if (truncatedLiquidationPrice[0] === '-') {
                // user cannot be liquidated
                // since he has more collateral than the size of the position
                truncatedLiquidationPrice = undefined;
            }
            liquidationPrice = this.parseNumber (truncatedLiquidationPrice);
        }
        const positionSide = this.safeString (position, 'positionSide');
        const hedged = positionSide !== 'BOTH';
        return {
            'info': position,
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'initialMargin': initialMargin,
            'initialMarginPercentage': this.parseNumber (initialMarginPercentageString),
            'maintenanceMargin': maintenanceMargin,
            'maintenanceMarginPercentage': maintenanceMarginPercentage,
            'entryPrice': entryPrice,
            'notional': notional,
            'leverage': this.parseNumber (leverageString),
            'unrealizedPnl': unrealizedPnl,
            'contracts': contracts,
            'contractSize': contractSize,
            'marginRatio': marginRatio,
            'liquidationPrice': liquidationPrice,
            'markPrice': undefined,
            'collateral': collateral,
            'marginType': marginType,
            'side': side,
            'hedged': hedged,
            'percentage': percentage,
        };
    }

    parsePositionRisk (position, market = undefined) {
        //
        // usdm
        //     {
        //       "symbol": "BTCUSDT",
        //       "positionAmt": "0.001",
        //       "entryPrice": "43578.07000",
        //       "markPrice": "43532.30000000",
        //       "unRealizedProfit": "-0.04577000",
        //       "liquidationPrice": "21841.24993976",
        //       "leverage": "2",
        //       "maxNotionalValue": "300000000",
        //       "marginType": "isolated",
        //       "isolatedMargin": "21.77841506",
        //       "isAutoAddMargin": "false",
        //       "positionSide": "BOTH",
        //       "notional": "43.53230000",
        //       "isolatedWallet": "21.82418506",
        //       "updateTime": "1621358023886"
        //     }
        //
        // coinm
        //     {
        //       "symbol": "BTCUSD_PERP",
        //       "positionAmt": "2",
        //       "entryPrice": "37643.10000021",
        //       "markPrice": "38103.05510455",
        //       "unRealizedProfit": "0.00006413",
        //       "liquidationPrice": "25119.97445760",
        //       "leverage": "2",
        //       "maxQty": "1500",
        //       "marginType": "isolated",
        //       "isolatedMargin": "0.00274471",
        //       "isAutoAddMargin": "false",
        //       "positionSide": "BOTH",
        //       "notionalValue": "0.00524892",
        //       "isolatedWallet": "0.00268058"
        //     }
        //
        const marketId = this.safeString (position, 'symbol');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        const leverageBrackets = this.safeValue (this.options, 'leverageBrackets', {});
        const leverageBracket = this.safeValue (leverageBrackets, symbol, []);
        const notionalString = this.safeString2 (position, 'notional', 'notionalValue');
        const notionalStringAbs = Precise.stringAbs (notionalString);
        const notionalFloatAbs = parseFloat (notionalStringAbs);
        const notionalFloat = parseFloat (notionalString);
        let maintenanceMarginPercentageString = undefined;
        for (let i = 0; i < leverageBracket.length; i++) {
            const bracket = leverageBracket[i];
            if (notionalFloatAbs < bracket[0]) {
                break;
            }
            maintenanceMarginPercentageString = bracket[1];
        }
        const notional = this.parseNumber (notionalStringAbs);
        const contractsAbs = Precise.stringAbs (this.safeString (position, 'positionAmt'));
        const contracts = this.parseNumber (contractsAbs);
        const unrealizedPnlString = this.safeString (position, 'unRealizedProfit');
        const unrealizedPnl = this.parseNumber (unrealizedPnlString);
        const leverageString = this.safeString (position, 'leverage');
        const leverage = parseInt (leverageString);
        const liquidationPriceString = this.omitZero (this.safeString (position, 'liquidationPrice'));
        const liquidationPrice = this.parseNumber (liquidationPriceString);
        let collateralString = undefined;
        const marginType = this.safeString (position, 'marginType');
        let side = undefined;
        if (notionalFloat > 0) {
            side = 'long';
        } else if (notionalFloat < 0) {
            side = 'short';
        }
        const entryPriceString = this.safeString (position, 'entryPrice');
        const entryPrice = this.parseNumber (entryPriceString);
        const contractSize = this.safeValue (market, 'contractSize');
        const contractSizeString = this.numberToString (contractSize);
        // as oppose to notionalValue
        const linear = ('notional' in position);
        if (marginType === 'cross') {
            // calculate collateral
            if (linear) {
                // walletBalance = (liquidationPrice * (±1 + mmp) ± entryPrice) * contracts
                let onePlusMaintenanceMarginPercentageString = undefined;
                let entryPriceSignString = entryPriceString;
                if (side === 'short') {
                    onePlusMaintenanceMarginPercentageString = Precise.stringAdd ('1', maintenanceMarginPercentageString);
                    entryPriceSignString = Precise.stringMul ('-1', entryPriceSignString);
                } else {
                    onePlusMaintenanceMarginPercentageString = Precise.stringAdd ('-1', maintenanceMarginPercentageString);
                }
                const inner = Precise.stringMul (liquidationPriceString, onePlusMaintenanceMarginPercentageString);
                const leftSide = Precise.stringAdd (inner, entryPriceSignString);
                collateralString = Precise.stringDiv (Precise.stringMul (leftSide, contractsAbs), '1', market['precision']['quote']);
            } else {
                // walletBalance = (contracts * contractSize) * (±1/entryPrice - (±1 - mmp) / liquidationPrice)
                let onePlusMaintenanceMarginPercentageString = undefined;
                let entryPriceSignString = entryPriceString;
                if (side === 'short') {
                    onePlusMaintenanceMarginPercentageString = Precise.stringSub ('1', maintenanceMarginPercentageString);
                } else {
                    onePlusMaintenanceMarginPercentageString = Precise.stringSub ('-1', maintenanceMarginPercentageString);
                    entryPriceSignString = Precise.stringMul ('-1', entryPriceSignString);
                }
                const leftSide = Precise.stringMul (contractsAbs, contractSizeString);
                const rightSide = Precise.stringSub (Precise.stringDiv ('1', entryPriceSignString), Precise.stringDiv (onePlusMaintenanceMarginPercentageString, liquidationPriceString));
                collateralString = Precise.stringDiv (Precise.stringMul (leftSide, rightSide), '1', market['precision']['base']);
            }
        } else {
            collateralString = this.safeString (position, 'isolatedMargin');
        }
        collateralString = (collateralString === undefined) ? '0' : collateralString;
        const collateralFloat = parseFloat (collateralString);
        const collateral = this.parseNumber (collateralString);
        const markPrice = this.parseNumber (this.omitZero (this.safeString (position, 'markPrice')));
        let timestamp = this.safeInteger (position, 'updateTime');
        if (timestamp === 0) {
            timestamp = undefined;
        }
        const maintenanceMarginPercentage = this.parseNumber (maintenanceMarginPercentageString);
        const maintenanceMarginString = Precise.stringMul (maintenanceMarginPercentageString, notionalStringAbs);
        const maintenanceMargin = this.parseNumber (maintenanceMarginString);
        let initialMarginPercentageString = Precise.stringDiv ('1', leverageString, 8);
        const rational = (1000 % leverage) === 0;
        if (!rational) {
            initialMarginPercentageString = Precise.stringAdd (initialMarginPercentageString, '1e-8');
        }
        const initialMarginString = Precise.stringDiv (Precise.stringMul (notionalStringAbs, initialMarginPercentageString), '1', 8);
        const initialMargin = this.parseNumber (initialMarginString);
        let marginRatio = undefined;
        let percentage = undefined;
        if (collateralFloat !== 0.0) {
            marginRatio = this.parseNumber (Precise.stringDiv (Precise.stringAdd (Precise.stringDiv (maintenanceMarginString, collateralString), '5e-5'), '1', 4));
            percentage = this.parseNumber (Precise.stringMul (Precise.stringDiv (unrealizedPnlString, initialMarginString, 4), '100'));
        }
        const positionSide = this.safeString (position, 'positionSide');
        const hedged = positionSide !== 'BOTH';
        return {
            'info': position,
            'symbol': symbol,
            'contracts': contracts,
            'contractSize': contractSize,
            'unrealizedPnl': unrealizedPnl,
            'leverage': this.parseNumber (leverageString),
            'liquidationPrice': liquidationPrice,
            'collateral': collateral,
            'notional': notional,
            'markPrice': markPrice,
            'entryPrice': entryPrice,
            'timestamp': timestamp,
            'initialMargin': initialMargin,
            'initialMarginPercentage': this.parseNumber (initialMarginPercentageString),
            'maintenanceMargin': maintenanceMargin,
            'maintenanceMarginPercentage': maintenanceMarginPercentage,
            'marginRatio': marginRatio,
            'datetime': this.iso8601 (timestamp),
            'marginType': marginType,
            'side': side,
            'hedged': hedged,
            'percentage': percentage,
        };
    }

    async loadLeverageBrackets (reload = false, params = {}) {
        await this.loadMarkets ();
        // by default cache the leverage bracket
        // it contains useful stuff like the maintenance margin and initial margin for positions
        const leverageBrackets = this.safeValue (this.options, 'leverageBrackets');
        if ((leverageBrackets === undefined) || (reload)) {
            let method = undefined;
            const defaultType = this.safeString (this.options, 'defaultType', 'future');
            const type = this.safeString (params, 'type', defaultType);
            const query = this.omit (params, 'type');
            if (type === 'future') {
                method = 'fapiPrivateGetLeverageBracket';
            } else if (type === 'delivery') {
                method = 'dapiPrivateV2GetLeverageBracket';
            } else {
                throw new NotSupported (this.id + ' loadLeverageBrackets() supports linear and inverse contracts only');
            }
            const response = await this[method] (query);
            this.options['leverageBrackets'] = {};
            for (let i = 0; i < response.length; i++) {
                const entry = response[i];
                const marketId = this.safeString (entry, 'symbol');
                const symbol = this.safeSymbol (marketId);
                const brackets = this.safeValue (entry, 'brackets');
                const result = [];
                for (let j = 0; j < brackets.length; j++) {
                    const bracket = brackets[j];
                    // we use floats here internally on purpose
                    const floorValue = this.safeFloat2 (bracket, 'notionalFloor', 'qtyFloor');
                    const maintenanceMarginPercentage = this.safeString (bracket, 'maintMarginRatio');
                    result.push ([ floorValue, maintenanceMarginPercentage ]);
                }
                this.options['leverageBrackets'][symbol] = result;
            }
        }
        return this.options['leverageBrackets'];
    }

    async fetchPositions (symbols = undefined, params = {}) {
        const defaultMethod = this.safeString (this.options, 'fetchPositions', 'positionRisk');
        if (defaultMethod === 'positionRisk') {
            return await this.fetchPositionsRisk (symbols, params);
        } else if (defaultMethod === 'account') {
            return await this.fetchAccountPositions (symbols, params);
        } else {
            throw new NotSupported (this.id + '.options["fetchPositions"] = "' + defaultMethod + '" is invalid, please choose between "account" and "positionRisk"');
        }
    }

    async fetchAccountPositions (symbols = undefined, params = {}) {
        if (symbols !== undefined) {
            if (!Array.isArray (symbols)) {
                throw new ArgumentsRequired (this.id + ' fetchPositions requires an array argument for symbols');
            }
        }
        await this.loadMarkets ();
        await this.loadLeverageBrackets ();
        let method = undefined;
        const defaultType = this.safeString (this.options, 'defaultType', 'future');
        const type = this.safeString (params, 'type', defaultType);
        const query = this.omit (params, 'type');
        if (type === 'future') {
            method = 'fapiPrivateGetAccount';
        } else if (type === 'delivery') {
            method = 'dapiPrivateGetAccount';
        } else {
            throw new NotSupported (this.id + ' fetchPositions() supports linear and inverse contracts only');
        }
        const account = await this[method] (query);
        const result = this.parseAccountPositions (account);
        return this.filterByArray (result, 'symbol', symbols, false);
    }

    async fetchPositionsRisk (symbols = undefined, params = {}) {
        if (symbols !== undefined) {
            if (!Array.isArray (symbols)) {
                throw new ArgumentsRequired (this.id + ' fetchPositionsRisk requires an array argument for symbols');
            }
        }
        await this.loadMarkets ();
        await this.loadLeverageBrackets ();
        const request = {};
        let method = undefined;
        let defaultType = 'future';
        defaultType = this.safeString (this.options, 'defaultType', defaultType);
        const type = this.safeString (params, 'type', defaultType);
        params = this.omit (params, 'type');
        if ((type === 'future') || (type === 'linear')) {
            method = 'fapiPrivateGetPositionRisk';
            // ### Response examples ###
            //
            // For One-way position mode:
            //     [
            //         {
            //             "entryPrice": "0.00000",
            //             "marginType": "isolated",
            //             "isAutoAddMargin": "false",
            //             "isolatedMargin": "0.00000000",
            //             "leverage": "10",
            //             "liquidationPrice": "0",
            //             "markPrice": "6679.50671178",
            //             "maxNotionalValue": "20000000",
            //             "positionAmt": "0.000",
            //             "symbol": "BTCUSDT",
            //             "unRealizedProfit": "0.00000000",
            //             "positionSide": "BOTH",
            //             "updateTime": 0
            //        }
            //     ]
            //
            // For Hedge position mode:
            //     [
            //         {
            //             "entryPrice": "6563.66500",
            //             "marginType": "isolated",
            //             "isAutoAddMargin": "false",
            //             "isolatedMargin": "15517.54150468",
            //             "leverage": "10",
            //             "liquidationPrice": "5930.78",
            //             "markPrice": "6679.50671178",
            //             "maxNotionalValue": "20000000",
            //             "positionAmt": "20.000",
            //             "symbol": "BTCUSDT",
            //             "unRealizedProfit": "2316.83423560"
            //             "positionSide": "LONG",
            //             "updateTime": 1625474304765
            //         },
            //         {
            //             "entryPrice": "0.00000",
            //             "marginType": "isolated",
            //             "isAutoAddMargin": "false",
            //             "isolatedMargin": "5413.95799991",
            //             "leverage": "10",
            //             "liquidationPrice": "7189.95",
            //             "markPrice": "6679.50671178",
            //             "maxNotionalValue": "20000000",
            //             "positionAmt": "-10.000",
            //             "symbol": "BTCUSDT",
            //             "unRealizedProfit": "-1156.46711780",
            //             "positionSide": "SHORT",
            //             "updateTime": 0
            //         }
            //     ]
        } else if ((type === 'delivery') || (type === 'inverse')) {
            method = 'dapiPrivateGetPositionRisk';
        } else {
            throw NotSupported (this.id + ' fetchPositionsRisk() supports linear and inverse contracts only');
        }
        const response = await this[method] (this.extend (request, params));
        const result = [];
        for (let i = 0; i < response.length; i++) {
            const parsed = this.parsePositionRisk (response[i]);
            result.push (parsed);
        }
        return this.filterByArray (result, 'symbol', symbols, false);
    }

    async fetchFundingHistory (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let market = undefined;
        let method = undefined;
        let defaultType = 'future';
        const request = {
            'incomeType': 'FUNDING_FEE', // "TRANSFER"，"WELCOME_BONUS", "REALIZED_PNL"，"FUNDING_FEE", "COMMISSION" and "INSURANCE_CLEAR"
        };
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
            if (market['linear']) {
                defaultType = 'future';
            } else if (market['inverse']) {
                defaultType = 'delivery';
            } else {
                throw NotSupported (this.id + ' fetchFundingHistory() supports linear and inverse contracts only');
            }
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        defaultType = this.safeString2 (this.options, 'fetchFundingHistory', 'defaultType', defaultType);
        const type = this.safeString (params, 'type', defaultType);
        params = this.omit (params, 'type');
        if ((type === 'future') || (type === 'linear')) {
            method = 'fapiPrivateGetIncome';
        } else if ((type === 'delivery') || (type === 'inverse')) {
            method = 'dapiPrivateGetIncome';
        } else {
            throw NotSupported (this.id + ' fetchFundingHistory() supports linear and inverse contracts only');
        }
        const response = await this[method] (this.extend (request, params));
        return this.parseIncomes (response, market, since, limit);
    }

    async setLeverage (leverage, symbol = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' setLeverage() requires a symbol argument');
        }
        // WARNING: THIS WILL INCREASE LIQUIDATION PRICE FOR OPEN ISOLATED LONG POSITIONS
        // AND DECREASE LIQUIDATION PRICE FOR OPEN ISOLATED SHORT POSITIONS
        if ((leverage < 1) || (leverage > 125)) {
            throw new BadRequest (this.id + ' leverage should be between 1 and 125');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        let method = undefined;
        if (market['linear']) {
            method = 'fapiPrivatePostLeverage';
        } else if (market['inverse']) {
            method = 'dapiPrivatePostLeverage';
        } else {
            throw new NotSupported (this.id + ' setLeverage() supports linear and inverse contracts only');
        }
        const request = {
            'symbol': market['id'],
            'leverage': leverage,
        };
        return await this[method] (this.extend (request, params));
    }

    async setMarginMode (marginType, symbol = undefined, params = {}) {
        //
        // { "code": -4048 , "msg": "Margin type cannot be changed if there exists position." }
        //
        // or
        //
        // { "code": 200, "msg": "success" }
        //
        marginType = marginType.toUpperCase ();
        if (marginType === 'CROSS') {
            marginType = 'CROSSED';
        }
        if ((marginType !== 'ISOLATED') && (marginType !== 'CROSSED')) {
            throw new BadRequest (this.id + ' marginType must be either isolated or cross');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        let method = undefined;
        if (market['linear']) {
            method = 'fapiPrivatePostMarginType';
        } else if (market['inverse']) {
            method = 'dapiPrivatePostMarginType';
        } else {
            throw NotSupported (this.id + ' setMarginMode() supports linear and inverse contracts only');
        }
        const request = {
            'symbol': market['id'],
            'marginType': marginType,
        };
        return await this[method] (this.extend (request, params));
    }

    async setPositionMode (hedged, symbol = undefined, params = {}) {
        const defaultType = this.safeString (this.options, 'defaultType', 'future');
        const type = this.safeString (params, 'type', defaultType);
        params = this.omit (params, [ 'type' ]);
        let dualSidePosition = undefined;
        if (hedged) {
            dualSidePosition = 'true';
        } else {
            dualSidePosition = 'false';
        }
        const request = {
            'dualSidePosition': dualSidePosition,
        };
        let method = undefined;
        if (type === 'delivery') {
            method = 'dapiPrivatePostPositionSideDual';
        } else {
            // default to future
            method = 'fapiPrivatePostPositionSideDual';
        }
        //
        //     {
        //       "code": 200,
        //       "msg": "success"
        //     }
        //
        return await this[method] (this.extend (request, params));
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        if (!(api in this.urls['api'])) {
            throw new NotSupported (this.id + ' does not have a testnet/sandbox URL for ' + api + ' endpoints');
        }
        let url = this.urls['api'][api];
        url += '/' + path;
        if (api === 'wapi') {
            url += '.html';
        }
        if (path === 'historicalTrades') {
            if (this.apiKey) {
                headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
            } else {
                throw new AuthenticationError (this.id + ' historicalTrades endpoint requires `apiKey` credential');
            }
        }
        const userDataStream = (path === 'userDataStream') || (path === 'listenKey');
        if (userDataStream) {
            if (this.apiKey) {
                // v1 special case for userDataStream
                headers = {
                    'X-MBX-APIKEY': this.apiKey,
                    'Content-Type': 'application/x-www-form-urlencoded',
                };
                if (method !== 'GET') {
                    body = this.urlencode (params);
                }
            } else {
                throw new AuthenticationError (this.id + ' userDataStream endpoint requires `apiKey` credential');
            }
        } else if ((api === 'private') || (api === 'sapi' && path !== 'system/status') || (api === 'wapi' && path !== 'systemStatus') || (api === 'dapiPrivate') || (api === 'dapiPrivateV2') || (api === 'fapiPrivate') || (api === 'fapiPrivateV2')) {
            this.checkRequiredCredentials ();
            let query = undefined;
            const recvWindow = this.safeInteger (this.options, 'recvWindow', 5000);
            const extendedParams = this.extend ({
                'timestamp': this.nonce (),
                'recvWindow': recvWindow,
            }, params);
            if ((api === 'sapi') && (path === 'asset/dust')) {
                query = this.urlencodeWithArrayRepeat (extendedParams);
            } else if ((path === 'batchOrders') || (path.indexOf ('sub-account') >= 0) || (path === 'capital/withdraw/apply')) {
                query = this.rawencode (extendedParams);
            } else {
                query = this.urlencode (extendedParams);
            }
            const signature = this.hmac (this.encode (query), this.encode (this.secret));
            query += '&' + 'signature=' + signature;
            headers = {
                'X-MBX-APIKEY': this.apiKey,
            };
            if ((method === 'GET') || (method === 'DELETE') || (api === 'wapi')) {
                url += '?' + query;
            } else {
                body = query;
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
        } else {
            if (Object.keys (params).length) {
                url += '?' + this.urlencode (params);
            }
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if ((code === 418) || (code === 429)) {
            throw new DDoSProtection (this.id + ' ' + code.toString () + ' ' + reason + ' ' + body);
        }
        // error response in a form: { "code": -1013, "msg": "Invalid quantity." }
        // following block cointains legacy checks against message patterns in "msg" property
        // will switch "code" checks eventually, when we know all of them
        if (code >= 400) {
            if (body.indexOf ('Price * QTY is zero or less') >= 0) {
                throw new InvalidOrder (this.id + ' order cost = amount * price is zero or less ' + body);
            }
            if (body.indexOf ('LOT_SIZE') >= 0) {
                throw new InvalidOrder (this.id + ' order amount should be evenly divisible by lot size ' + body);
            }
            if (body.indexOf ('PRICE_FILTER') >= 0) {
                throw new InvalidOrder (this.id + ' order price is invalid, i.e. exceeds allowed price precision, exceeds min price or max price limits or is invalid float value in general, use this.priceToPrecision (symbol, amount) ' + body);
            }
        }
        if (response === undefined) {
            return; // fallback to default error handler
        }
        // check success value for wapi endpoints
        // response in format {'msg': 'The coin does not exist.', 'success': true/false}
        const success = this.safeValue (response, 'success', true);
        if (!success) {
            const message = this.safeString (response, 'msg');
            let parsedMessage = undefined;
            if (message !== undefined) {
                try {
                    parsedMessage = JSON.parse (message);
                } catch (e) {
                    // do nothing
                    parsedMessage = undefined;
                }
                if (parsedMessage !== undefined) {
                    response = parsedMessage;
                }
            }
        }
        const message = this.safeString (response, 'msg');
        if (message !== undefined) {
            this.throwExactlyMatchedException (this.exceptions['exact'], message, this.id + ' ' + message);
            this.throwBroadlyMatchedException (this.exceptions['broad'], message, this.id + ' ' + message);
        }
        // checks against error codes
        const error = this.safeString (response, 'code');
        if (error !== undefined) {
            // https://github.com/ccxt/ccxt/issues/6501
            // https://github.com/ccxt/ccxt/issues/7742
            if ((error === '200') || Precise.stringEquals (error, '0')) {
                return;
            }
            // a workaround for {"code":-2015,"msg":"Invalid API-key, IP, or permissions for action."}
            // despite that their message is very confusing, it is raised by Binance
            // on a temporary ban, the API key is valid, but disabled for a while
            if ((error === '-2015') && this.options['hasAlreadyAuthenticatedSuccessfully']) {
                throw new DDoSProtection (this.id + ' temporary banned: ' + body);
            }
            const feedback = this.id + ' ' + body;
            this.throwExactlyMatchedException (this.exceptions['exact'], error, feedback);
            throw new ExchangeError (feedback);
        }
        if (!success) {
            throw new ExchangeError (this.id + ' ' + body);
        }
    }

    calculateRateLimiterCost (api, method, path, params, config = {}, context = {}) {
        if (('noCoin' in config) && !('coin' in params)) {
            return config['noCoin'];
        } else if (('noSymbol' in config) && !('symbol' in params)) {
            return config['noSymbol'];
        } else if (('noPoolId' in config) && !('poolId' in params)) {
            return config['noPoolId'];
        } else if (('byLimit' in config) && ('limit' in params)) {
            const limit = params['limit'];
            const byLimit = config['byLimit'];
            for (let i = 0; i < byLimit.length; i++) {
                const entry = byLimit[i];
                if (limit <= entry[0]) {
                    return entry[1];
                }
            }
        }
        return this.safeInteger (config, 'cost', 1);
    }

    async request (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined, config = {}, context = {}) {
        const response = await this.fetch2 (path, api, method, params, headers, body, config, context);
        // a workaround for {"code":-2015,"msg":"Invalid API-key, IP, or permissions for action."}
        if ((api === 'private') || (api === 'wapi')) {
            this.options['hasAlreadyAuthenticatedSuccessfully'] = true;
        }
        return response;
    }

    async modifyMarginHelper (symbol, amount, addOrReduce, params = {}) {
        // used to modify isolated positions
        let defaultType = this.safeString (this.options, 'defaultType', 'future');
        if (defaultType === 'spot') {
            defaultType = 'future';
        }
        const type = this.safeString (params, 'type', defaultType);
        if ((type === 'margin') || (type === 'spot')) {
            throw new NotSupported (this.id + ' add / reduce margin only supported with type future or delivery');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'type': addOrReduce,
            'symbol': market['id'],
            'amount': amount,
        };
        let method = undefined;
        let code = undefined;
        if (type === 'future') {
            method = 'fapiPrivatePostPositionMargin';
            code = market['quote'];
        } else {
            method = 'dapiPrivatePostPositionMargin';
            code = market['base'];
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     {
        //       "code": 200,
        //       "msg": "Successfully modify position margin.",
        //       "amount": 0.001,
        //       "type": 1
        //     }
        //
        const rawType = this.safeInteger (response, 'type');
        const resultType = (rawType === 1) ? 'add' : 'reduce';
        const resultAmount = this.safeNumber (response, 'amount');
        const errorCode = this.safeString (response, 'code');
        const status = (errorCode === '200') ? 'ok' : 'failed';
        return {
            'info': response,
            'type': resultType,
            'amount': resultAmount,
            'code': code,
            'symbol': market['symbol'],
            'status': status,
        };
    }

    async reduceMargin (symbol, amount, params = {}) {
        return await this.modifyMarginHelper (symbol, amount, 2, params);
    }

    async addMargin (symbol, amount, params = {}) {
        return await this.modifyMarginHelper (symbol, amount, 1, params);
    }

    async fetchBorrowRate (code, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'asset': currency['id'],
            // 'vipLevel': this.safeInteger (params, 'vipLevel'),
        };
        const response = await this.sapiGetMarginInterestRateHistory (this.extend (request, params));
        //
        // [
        //     {
        //         "asset": "USDT",
        //         "timestamp": 1638230400000,
        //         "dailyInterestRate": "0.0006",
        //         "vipLevel": 0
        //     },
        //     ...
        // ]
        //
        const rate = this.safeValue (response, 0);
        const timestamp = this.safeNumber (rate, 'timestamp');
        return {
            'currency': code,
            'rate': this.safeNumber (rate, 'dailyInterestRate'),
            'period': 86400000,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'info': response,
        };
    }

    async fetchBorrowRateHistory (code, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        if (limit === undefined) {
            limit = 93;
        } else if (limit > 93) {
            // Binance API says the limit is 100, but "Illegal characters found in a parameter." is returned when limit is > 93
            throw new BadRequest (this.id + ' fetchBorrowRateHistory limit parameter cannot exceed 92');
        }
        const currency = this.currency (code);
        const request = {
            'asset': currency['id'],
            'limit': limit,
        };
        if (since !== undefined) {
            request['startTime'] = since;
            const endTime = this.sum (since, limit * 86400000) - 1; // required when startTime is further than 93 days in the past
            const now = this.milliseconds ();
            request['endTime'] = Math.min (endTime, now); // cannot have an endTime later than current time
        }
        const response = await this.sapiGetMarginInterestRateHistory (this.extend (request, params));
        //
        //     [
        //         {
        //             "asset": "USDT",
        //             "timestamp": 1638230400000,
        //             "dailyInterestRate": "0.0006",
        //             "vipLevel": 0
        //         },
        //     ]
        //
        const result = [];
        for (let i = 0; i < response.length; i++) {
            const item = response[i];
            const timestamp = this.safeNumber (item, 'timestamp');
            result.push ({
                'currency': code,
                'rate': this.safeNumber (item, 'dailyInterestRate'),
                'timestamp': timestamp,
                'datetime': this.iso8601 (timestamp),
                'info': item,
            });
        }
        return result;
    }

    async createGiftCode (code, amount, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        // ensure you have enough token in your funding account before calling this code
        const request = {
            'token': currency['id'],
            'amount': amount,
        };
        const response = await this.sapiPostGiftcardCreateCode (this.extend (request, params));
        //
        //     {
        //       code: '000000',
        //       message: 'success',
        //       data: { referenceNo: '0033002404219823', code: 'AP6EXTLKNHM6CEX7' },
        //       success: true
        //     }
        //
        const data = this.safeValue (response, 'data');
        const giftcardCode = this.safeString (data, 'code');
        const id = this.safeString (data, 'referenceNo');
        return {
            'info': response,
            'id': id,
            'code': giftcardCode,
            'currency': code,
            'amount': amount,
        };
    }

    async redeemGiftCode (giftcardCode, params = {}) {
        const request = {
            'code': giftcardCode,
        };
        const response = await this.sapiPostGiftcardRedeemCode (this.extend (request, params));
        //
        //     {
        //       code: '000000',
        //       message: 'success',
        //       data: {
        //         referenceNo: '0033002404219823',
        //         identityNo: '10316431732801474560'
        //       },
        //       success: true
        //     }
        //
        return response;
    }

    async verifyGiftCode (id, params = {}) {
        const request = {
            'referenceNo': id,
        };
        const response = await this.sapiGetGiftcardVerify (this.extend (request, params));
        //
        //     {
        //       code: '000000',
        //       message: 'success',
        //       data: { valid: true },
        //       success: true
        //     }
        //
        return response;
    }
};
