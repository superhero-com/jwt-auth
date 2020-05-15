<template>
  <div class="home">
    <button
      :disabled="!sdk"
      @click="joinMeeting"
    >
      Join meeting with aeternity account
    </button>
  </div>
</template>

<script>
import { RpcAepp, Node } from '@aeternity/aepp-sdk/es';
import Detector from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/wallet-detector';
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';

const nodeUrl = 'https://mainnet.aeternity.io';

export default {
  data: () => ({ sdk: null }),
  methods: {
    async joinMeeting() {
      const message = `I would like to generate JWT token at ${new Date().toUTCString()}`;
      const signature = await this.sdk.signMessage(message);
      const address = await this.sdk.address();
      const token = await (await fetch('/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, message, signature }),
      })).text();
      window.location = `https://league.superhero.com/broadcast?jwt=${token}`;
    },
  },
  async created() {
    const sdk = await RpcAepp({
      name: 'JWT token generator',
      compilerUrl: 'https://compiler.aepps.com',
      nodes: [{
        name: 'why should I have node defined if I\'m not using it?',
        instance: await Node({ url: nodeUrl, internalUrl: nodeUrl }),
      }],
    });
    const scannerConnection = await BrowserWindowMessageConnection({
      connectionInfo: { id: 'spy' },
    });
    const detector = await Detector({ connection: scannerConnection });
    await new Promise((resolve) => {
      detector.scan(async ({ wallets, newWallet }) => {
        const wallet = newWallet || Object.values(wallets)[0];
        console.log(`Connecting to wallet ${wallet.name}`);
        detector.stopScan();
        await sdk.connectToWallet(await wallet.getConnection());
        resolve();
      });
    });
    await sdk.subscribeAddress('subscribe', 'current');
    this.sdk = sdk;
    window.sdk = sdk;
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  height: 100vh;

  button {
    margin: auto;
    font-size: 20px;
  }
}
</style>
