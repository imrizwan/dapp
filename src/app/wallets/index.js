// Frameworks
import * as _ from 'lodash';

// Internals
import { GLOBALS } from '../utils/globals';

// Wallets
import MetamaskWallet from './metamask';


class Wallet {
    constructor() {
        this.type = null;
        this.site = null;
        this.store = null;
    }

    static instance() {
        if (!Wallet.__instance) {
            Wallet.__instance = new Wallet();
        }
        return Wallet.__instance;
    }

    async prepare({site, store}) {
        this.site = site;
        this.store = store;
    }

    static isEnabled(type) {
        return (Wallet.typeMap()[type].wallet).isEnabled();
    }

    async init(type = GLOBALS.WALLET_TYPE_COINBASE) {
        if (_.isEmpty(this.site)) {
            throw new Error('Error: Wallet has not been prepared before initializing!');
        }
        if (type === this.type) { return; }
        this.type = type;

        const walletData = Wallet.typeMap()[type];
        const walletClass = walletData.wallet;
        this.wallet = new walletClass(this.site, this.store);
        await this.wallet.init({options: walletData.options, ...Wallet._getEnv()});
    }

    async connect() {
        if (!this.wallet) { return; }
        await this.wallet.connect();
    }

    async disconnect() {
        if (!this.wallet) { return; }
        await this.wallet.disconnect();
    }

    async getInformation() {
        if (!this.wallet) { return; }
        const blockNumber =  await this.wallet.web3.eth.getBlockNumber()
        return {
            blockNumber,
            eth: this.wallet.web3.eth
        }
    }

    static getName(type) {
        return (Wallet.typeMap()[type]).name || 'Unknown';
    }

    static typeMap() {
        return {
            [GLOBALS.WALLET_TYPE_METAMASK]      : {wallet: MetamaskWallet,      name: 'MetaMask',            options: {}},
        };
    }

    static _getEnv() {
        const rpcUrl = process.env.GATSBY_ETH_JSONRPC_URL;
        const chainId = process.env.GATSBY_ETH_CHAIN_ID;
        if (_.isEmpty(rpcUrl)) {
            console.error('Invalid RPC-URL.  Make sure you have set the correct ENV VARs to connect to Web3; ("GATSBY_ETH_JSONRPC_URL").');
        }
        if (_.isEmpty(chainId)) {
            console.error('Invalid Chain-ID.  Make sure you have set the correct ENV VARs to connect to Web3; ("GATSBY_ETH_CHAIN_ID").');
        }
        return {rpcUrl, chainId};
    }
}
Wallet.__instance = null;

export default Wallet;
