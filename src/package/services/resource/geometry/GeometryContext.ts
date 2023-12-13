import * as THREE from "three";
import {PsrThreePluginTypes} from "../../../types";
import {ResourceContextImpl} from "../ResourceContext.ts";

export class GeometryContextImpl<G extends THREE.BufferGeometry> extends ResourceContextImpl<G, THREE.BufferGeometry> implements PsrThreePluginTypes.GeometryContext<G> {
}