import * as THREE from "three";
import {PsrThreePluginTypes} from "../../../types";
import {ResourceContextImpl} from "../ResourceContext.ts";

export class MaterialContextImpl<M extends THREE.Material> extends ResourceContextImpl<M, THREE.Material> implements PsrThreePluginTypes.MaterialContext<M> {
}