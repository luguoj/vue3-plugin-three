import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {FileLoader, LoadingManager} from "three";
import default_draco_decoder_js from "../libs/draco/draco_decoder.js?url"
import default_draco_wasm_wrapper_js from "../libs/draco/draco_wasm_wrapper.js?url"
import default_draco_decoder_wasm from "../libs/draco/draco_decoder.wasm?url"
import gltf_draco_decoder_js from "../libs/draco/gltf/draco_decoder.js?url"
import gltf_draco_wasm_wrapper_js from "../libs/draco/gltf/draco_wasm_wrapper.js?url"
import gltf_draco_decoder_wasm from "../libs/draco/gltf/draco_decoder.wasm?url"

type decoderUrlType = 'draco_decoder.js' | 'draco_wasm_wrapper.js' | 'draco_decoder.wasm'
type decoderPathType = 'default' | 'gltf'

export class PsrThreeDRACOLoader extends DRACOLoader {
    constructor(manager?: LoadingManager) {
        super(manager);

    }

    decoderPath: decoderPathType = 'default'
    urlMap = {
        'default': {
            'draco_decoder.js': default_draco_decoder_js,
            'draco_wasm_wrapper.js': default_draco_wasm_wrapper_js,
            'draco_decoder.wasm': default_draco_decoder_wasm
        },
        'gltf': {
            'draco_decoder.js': gltf_draco_decoder_js,
            'draco_wasm_wrapper.js': gltf_draco_wasm_wrapper_js,
            'draco_decoder.wasm': gltf_draco_decoder_wasm
        }
    }

    _loadLibrary(url: decoderUrlType, responseType: string) {
        const loader = new FileLoader(this.manager);
        loader.setResponseType(responseType);
        let _url: string
        if (this.decoderPath == 'default' || this.decoderPath == 'gltf') {
            _url = this.urlMap[this.decoderPath][url]
        } else {
            loader.setPath(this.decoderPath);
            loader.setWithCredentials(this.withCredentials);
            _url = url
        }
        return new Promise((resolve, reject) => {
            loader.load(_url, resolve, undefined, reject)
        });
    }

    setDecoderPath(path: decoderPathType | string): this {
        return super.setPath(path);
    }
}
