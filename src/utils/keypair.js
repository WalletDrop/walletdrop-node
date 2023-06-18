import fs from "fs";
import path from "path";
import { keys } from "@libp2p/crypto";
import { createFromPrivKey } from "@libp2p/peer-id-factory";

const __dirname = path.resolve();

export const createKeys = async (name) => {
  try {
    const keyPair = await keys.generateKeyPair("Ed25519", 256);
    const peerId = await createFromPrivKey(keyPair);
    const exportedKeyPair = await keyPair.export("");
    const keyJson = {
      peerId,
      key: exportedKeyPair,
    };
    keyJson.peerId = peerId.toString();
    fs.writeFileSync(
      path.join(__dirname, `${name}.json`),
      JSON.stringify(keyJson)
    );
    return { peerId, key: keyPair };
  } catch (e) {
    return null;
  }
};
export const getKeys = async (name) => {
  try {
    const keyPairJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, `${name}.json`), "utf-8")
    );
    const keyPair = await keys.importKey(keyPairJson.key, "");
    const peerId = await createFromPrivKey(keyPair);
    return { peerId, key: keyPair };
  } catch (e) {
    return null;
  }
};
