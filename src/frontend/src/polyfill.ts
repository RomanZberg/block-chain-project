/* APPLICATION IMPORTS
*/
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

(window as any).global = window;
//
global.process = {
  env: {DEBUG: undefined},
  version: '',
  nextTick: require('next-tick')
} as any;



