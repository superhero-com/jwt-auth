import { RpcAepp, Node } from '@aeternity/aepp-sdk/es';
import Detector from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/wallet-detector';
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';

const nodeUrl = 'https://mainnet.aeternity.io';
const jitsiUrl = 'https://league.superhero.com/broadcast';
let sdk;

(async () => {
  const s = await RpcAepp({
    name: 'SuperheroLeague',
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
      await s.connectToWallet(await wallet.getConnection());
      resolve();
    });
  });
  await s.subscribeAddress('subscribe', 'current');
  sdk = s;
})();

window.joinLiveBroadcastHandler = async () => {
  if (!sdk) {
    window.location = jitsiUrl;
  }

  const message = `I would like to generate JWT token at ${new Date().toUTCString()}`;
  const signature = await sdk.signMessage(message);
  const address = await sdk.address();
  const token = await (await fetch('https://jwt.z52da5wt.xyz/claim', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address, message, signature }),
  })).text();
  window.location = `${jitsiUrl}?jwt=${token}`;
};
