/* eslint-disable @typescript-eslint/no-unused-vars */
import MX10 from '../MX10';
import {Buffer} from 'buffer';

/**
 *
 * @category Groups
 */
export default class ZimoProgrammableScriptGroup
{
	private mx10: MX10;

	constructor(mx10: MX10) {
		this.mx10 = mx10;
	}

	parse(
		size: number,
		command: number,
		mode: number,
		nid: number,
		buffer: Buffer,
	) {
		// this.mx10.logInfo.next('parse zcs group');
	}
}
