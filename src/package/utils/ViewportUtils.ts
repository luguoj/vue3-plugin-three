import {PsrThreePluginTypes} from "../types";
import * as THREE from "three";

export namespace ViewportUtils {

    function calcLength(value: number, range: number): number {
        return value > 1 ? value : Math.floor(range * value)
    }

    export function calcViewport(viewport?: PsrThreePluginTypes.Viewport, size?: PsrThreePluginTypes.Size): THREE.Vector4 {
        const {width: fullWidth, height: fullHeight} = size || {width: 0, height: 0}
        const {left, right, top, bottom, width, height} = viewport || {width: 1, height: 1};
        let x = 0, y = 0,
            w = calcLength(width, fullWidth),
            h = calcLength(height, fullHeight)
        if (left != undefined || right == undefined) {
            x = calcLength(left || 0, fullWidth)
        } else {
            x = fullWidth - w - calcLength(right, fullWidth)
        }
        if (top != undefined || bottom == undefined) {
            y = fullHeight - h - calcLength(top || 0, fullHeight)
        } else {
            y = calcLength(bottom, fullHeight)
        }
        return new THREE.Vector4(x, y, w, h)
    }
}