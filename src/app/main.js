// Frameworks
import React, { useContext, useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import { Heading, Blockie, EthAddress, Button, Text, Box } from 'rimble-ui';

// Wallet Interface
import Wallet from './wallets';

// Data Store
import { RootStoreContext } from './stores/root.store';
import { transaction } from 'mobx';

// Main Route
function Main() {
    const rootStore = useContext(RootStoreContext);
    const { walletStore } = rootStore;
    const [info, setInfo] = useState({});
    const [pause, setPause] = useState(false);

    const _logout = async () => {
        await Wallet.instance().disconnect();
        navigate(`/app/login`);
    };
    const _pause = () => {
        setPause(!pause);
    }
    const _getInformation = async () => {
        const i = await Wallet.instance().getInformation();
        const blockNumber = await i.blockNumber;
        let numberOfTransactions = 0;
        let block = {};
        if (blockNumber) {
            numberOfTransactions = await i.eth.getTransactionCount(walletStore.defaultAddress)
            block = await i.eth.getBlock(blockNumber)
            let transactions = await i.eth.getPastLogs({ address: walletStore.defaultAddress })
            console.log("transactions", transactions)
        }
        setInfo({ ...info, numberOfTransactions, blockNumber, minerAddress: block?.miner ?? 0, totalDifficulty: block?.totalDifficulty ?? 0 });

    };


    useEffect(() => {
        _getInformation();
    }, []);


    return (
        <>
            <Heading as={"h3"}>
                <Blockie
                    opts={{
                        seed: walletStore.defaultAddress,
                        color: `#${walletStore.defaultAddress.slice(2, 8)}`,
                        bgcolor: `#${walletStore.defaultAddress.slice(-6)}`,
                        size: 15,
                        scale: 3,
                        spotcolor: '#000'
                    }}
                />
                &nbsp;&nbsp;Main App
                &nbsp;&nbsp;<small>(using {Wallet.getName(walletStore.type)})</small>
            </Heading>

            <Box mt={20}>
                <Text>
                    <EthAddress address={walletStore.defaultAddress} />
                </Text>
            </Box>

            <Box mt={40}>
                <Text.p>
                    <Button onClick={_getInformation}>Get Information</Button>
                </Text.p>
            </Box>

            <Box mt={40}>
                {info ? <Text.p>
                    Information:
                </Text.p> : null}
                {info?.blockNumber ? <Text.p>
                    Block Number: {info?.blockNumber}
                </Text.p> : null}
                {!isNaN(info?.numberOfTransactions) ? <Text.p>
                    Number of Transactions: {info?.numberOfTransactions}
                </Text.p> : null}
                {info?.minerAddress ? <Text.p>
                    Miner (address that mined the block): {info?.minerAddress}
                </Text.p> : null}
                {info?.totalDifficulty ? <Text.p>
                    Total Difficulty: {info?.totalDifficulty}
                </Text.p> : null}
            </Box>

            <Box mt={40}>
                <Text.p>
                    <Button onClick={_pause}>{pause ? "Pause" : "Resume"}</Button>
                </Text.p>
            </Box>

            <Box mt={40}>
                <Text.p>
                    <Button onClick={_logout}>log out</Button>
                </Text.p>
            </Box>
        </>
    );
}

export default Main;
