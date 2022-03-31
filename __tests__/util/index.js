import MX10 from "../../src/MX10.js";
import {createSocket} from "dgram";

export function createMX10(debug) {
  return new MX10(() => new Promise((resolve) => resolve(23)), 1000, debug || false);
}

export function initConnection(mx10) {
  return mx10.initSocket(createSocket, "192.168.1.145");
}
