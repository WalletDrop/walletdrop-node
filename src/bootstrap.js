import { createLibp2p } from "libp2p";
import { webSockets } from "@libp2p/websockets";
import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { yamux } from "@chainsafe/libp2p-yamux";
import { circuitRelayServer } from "libp2p/circuit-relay";
import { identifyService } from "libp2p/identify";
import { kadDHT } from "@libp2p/kad-dht";
import { getKeys, createKeys } from "./utils/keypair.js";

async function main() {
  let keys = await getKeys("bootstrap");
  if (!keys) {
    keys = await createKeys("bootstrap");
  }
  const node = await createLibp2p({
    peerId: keys.peerId,
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/43000/ws"],
      // TODO check "What is next?" section
      // announce: ['/dns4/auto-relay.libp2p.io/tcp/443/wss/p2p/QmWDn2LY8nannvSWJzruUYoLZ4vV83vfCBwd8DipvdgQc3']
    },
    transports: [webSockets()],
    connectionEncryption: [noise()],
    streamMuxers: [yamux(), mplex()],
    services: {
      identify: identifyService(),
      relay: circuitRelayServer(),
      dht: kadDHT(),
    },
  });

  console.log(`Node started with id ${node.peerId.toString()}`);
  console.log("Listening on:");
  node.getMultiaddrs().forEach((ma) => console.log(ma.toString()));
}

main();
