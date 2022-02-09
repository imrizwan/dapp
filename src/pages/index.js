// Frameworks
import React from 'react';
import { Button, Text, Box } from 'rimble-ui';

// Layout Components
import Layout from '../components/layout';

// Static Route
const IndexPage = () => {
    const githubRepo = 'https://github.com/imrizwan/dapp';

    const _openLink = (linkUrl) => () => {
        window.open(linkUrl);
    };

    return (
        <Layout>
            <Box mt={4}>
                <Text.p>
                    It is a client-side app with <b>Web3 Authentication</b>:
                </Text.p>
                <Text.p>
                    <Button size="small" as="a" href="/app/">Ethereum Dapp</Button>
                </Text.p>
            </Box>
            <hr/>

            <Box mt={4}>
                <Text.p>
                    <Button size="small" onClick={_openLink(githubRepo)}>Github Repo</Button>&nbsp;&nbsp;--&nbsp;&nbsp;<small><b>{githubRepo}</b></small>
                </Text.p>
            </Box>
        </Layout>
    );
};

export default IndexPage;
