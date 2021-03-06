"use strict";
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var blazeface = require("@tensorflow-models/blazeface");
var tfconv = require("@tensorflow/tfjs-converter");
var tf = require("@tensorflow/tfjs-core");
var keypoints_1 = require("./keypoints");
var pipeline_1 = require("./pipeline");
var uv_coords_1 = require("./uv_coords");
var FACEMESH_GRAPHMODEL_PATH = '/facemesh';
var MESH_MODEL_INPUT_WIDTH = 192;
var MESH_MODEL_INPUT_HEIGHT = 192;
/**
 * Load the model.
 *
 * @param options - a configuration object with the following properties:
 *  - `maxContinuousChecks` How many frames to go without running the bounding
 * box detector. Only relevant if maxFaces > 1. Defaults to 5.
 *  - `detectionConfidence` Threshold for discarding a prediction. Defaults to
 * 0.9.
 *  - `maxFaces` The maximum number of faces detected in the input. Should be
 * set to the minimum number for performance. Defaults to 10.
 *  - `iouThreshold` A float representing the threshold for deciding whether
 * boxes overlap too much in non-maximum suppression. Must be between [0, 1].
 * Defaults to 0.3.
 *  - `scoreThreshold` A threshold for deciding when to remove boxes based
 * on score in non-maximum suppression. Defaults to 0.75.
 */
function load(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.maxContinuousChecks, maxContinuousChecks = _c === void 0 ? 5 : _c, _d = _b.detectionConfidence, detectionConfidence = _d === void 0 ? 0.9 : _d, _e = _b.maxFaces, maxFaces = _e === void 0 ? 10 : _e, _f = _b.iouThreshold, iouThreshold = _f === void 0 ? 0.3 : _f, _g = _b.scoreThreshold, scoreThreshold = _g === void 0 ? 0.75 : _g;
    return __awaiter(this, void 0, void 0, function () {
        var _h, blazeFace, blazeMeshModel, faceMesh;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        loadDetectorModel(maxFaces, iouThreshold, scoreThreshold), loadMeshModel()
                    ])];
                case 1:
                    _h = _j.sent(), blazeFace = _h[0], blazeMeshModel = _h[1];
                    faceMesh = new FaceMesh(blazeFace, blazeMeshModel, maxContinuousChecks, detectionConfidence, maxFaces);
                    return [2 /*return*/, faceMesh];
            }
        });
    });
}
exports.load = load;
function loadDetectorModel(maxFaces, iouThreshold, scoreThreshold) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, blazeface.load({ maxFaces: maxFaces, iouThreshold: iouThreshold, scoreThreshold: scoreThreshold })];
        });
    });
}
function loadMeshModel() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, tfconv.loadGraphModel(FACEMESH_GRAPHMODEL_PATH, { fromTFHub: true })];
        });
    });
}
function getInputTensorDimensions(input) {
    return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] :
        [input.height, input.width];
}
function flipFaceHorizontal(face, imageWidth) {
    if (face.mesh instanceof tf.Tensor) {
        var _a = tf.tidy(function () {
            var subtractBasis = tf.tensor1d([imageWidth - 1, 0, 0]);
            var multiplyBasis = tf.tensor1d([1, -1, 1]);
            return tf.tidy(function () {
                return [
                    tf.concat([
                        tf.sub(imageWidth - 1, face.boundingBox.topLeft.slice(0, 1)),
                        face.boundingBox.topLeft.slice(1, 1)
                    ]),
                    tf.concat([
                        tf.sub(imageWidth - 1, face.boundingBox.bottomRight.slice(0, 1)),
                        face.boundingBox.bottomRight.slice(1, 1)
                    ]),
                    tf.sub(subtractBasis, face.mesh).mul(multiplyBasis),
                    tf.sub(subtractBasis, face.scaledMesh).mul(multiplyBasis)
                ];
            });
        }), topLeft = _a[0], bottomRight = _a[1], mesh = _a[2], scaledMesh = _a[3];
        return Object.assign({}, face, { boundingBox: { topLeft: topLeft, bottomRight: bottomRight }, mesh: mesh, scaledMesh: scaledMesh });
    }
    return Object.assign({}, face, {
        boundingBox: {
            topLeft: [
                imageWidth - 1 - face.boundingBox.topLeft[0],
                face.boundingBox.topLeft[1]
            ],
            bottomRight: [
                imageWidth - 1 - face.boundingBox.bottomRight[0],
                face.boundingBox.bottomRight[1]
            ]
        },
        mesh: (face.mesh).map(function (coord) {
            var flippedCoord = coord.slice(0);
            flippedCoord[0] = imageWidth - 1 - coord[0];
            return flippedCoord;
        }),
        scaledMesh: face.scaledMesh.map(function (coord) {
            var flippedCoord = coord.slice(0);
            flippedCoord[0] = imageWidth - 1 - coord[0];
            return flippedCoord;
        })
    });
}
var FaceMesh = /** @class */ (function () {
    function FaceMesh(blazeFace, blazeMeshModel, maxContinuousChecks, detectionConfidence, maxFaces) {
        this.pipeline = new pipeline_1.Pipeline(blazeFace, blazeMeshModel, MESH_MODEL_INPUT_WIDTH, MESH_MODEL_INPUT_HEIGHT, maxContinuousChecks, maxFaces);
        this.detectionConfidence = detectionConfidence;
    }
    FaceMesh.getAnnotations = function () {
        return keypoints_1.MESH_ANNOTATIONS;
    };
    /**
     * Returns an array of UV coordinates for the 468 facial keypoint vertices in
     * mesh_map.jpg. Can be used to map textures to the facial mesh.
     */
    FaceMesh.getUVCoords = function () {
        return uv_coords_1.UV_COORDS;
    };
    /**
     * Returns an array of faces in an image.
     *
     * @param input The image to classify. Can be a tensor, DOM element image,
     * video, or canvas.
     * @param returnTensors (defaults to `false`) Whether to return tensors as
     * opposed to values.
     * @param flipHorizontal Whether to flip/mirror the facial keypoints
     * horizontally. Should be true for videos that are flipped by default (e.g.
     * webcams).
     *
     * @return An array of AnnotatedPrediction objects.
     */
    FaceMesh.prototype.estimateFaces = function (input, returnTensors, flipHorizontal) {
        if (returnTensors === void 0) { returnTensors = false; }
        if (flipHorizontal === void 0) { flipHorizontal = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, width, image, predictions, savedWebglPackDepthwiseConvFlag;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = getInputTensorDimensions(input), width = _a[1];
                        image = tf.tidy(function () {
                            if (!(input instanceof tf.Tensor)) {
                                input = tf.browser.fromPixels(input);
                            }
                            return input.toFloat().expandDims(0);
                        });
                        if (!(tf.getBackend() === 'webgl')) return [3 /*break*/, 2];
                        savedWebglPackDepthwiseConvFlag = tf.env().get('WEBGL_PACK_DEPTHWISECONV');
                        tf.env().set('WEBGL_PACK_DEPTHWISECONV', true);
                        return [4 /*yield*/, this.pipeline.predict(image)];
                    case 1:
                        predictions = _b.sent();
                        tf.env().set('WEBGL_PACK_DEPTHWISECONV', savedWebglPackDepthwiseConvFlag);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.pipeline.predict(image)];
                    case 3:
                        predictions = _b.sent();
                        _b.label = 4;
                    case 4:
                        image.dispose();
                        if (predictions != null && predictions.length > 0) {
                            return [2 /*return*/, Promise.all(predictions.map(function (prediction, i) { return __awaiter(_this, void 0, void 0, function () {
                                    var coords, scaledCoords, box, flag, tensorsToRead, tensorValues, flagValue, annotatedPrediction_1, _a, coordsArr, coordsArrScaled, annotatedPrediction, annotations, key;
                                    var _this = this;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                coords = prediction.coords, scaledCoords = prediction.scaledCoords, box = prediction.box, flag = prediction.flag;
                                                tensorsToRead = [flag];
                                                if (!returnTensors) {
                                                    tensorsToRead = tensorsToRead.concat([coords, scaledCoords]);
                                                }
                                                return [4 /*yield*/, Promise.all(tensorsToRead.map(function (d) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                        return [2 /*return*/, d.array()];
                                                    }); }); }))];
                                            case 1:
                                                tensorValues = _b.sent();
                                                flagValue = tensorValues[0];
                                                flag.dispose();
                                                if (flagValue < this.detectionConfidence) {
                                                    this.pipeline.clearRegionOfInterest(i);
                                                }
                                                if (returnTensors) {
                                                    annotatedPrediction_1 = {
                                                        faceInViewConfidence: flagValue,
                                                        mesh: coords,
                                                        scaledMesh: scaledCoords,
                                                        boundingBox: {
                                                            topLeft: tf.tensor1d(box.startPoint),
                                                            bottomRight: tf.tensor1d(box.endPoint)
                                                        }
                                                    };
                                                    if (flipHorizontal) {
                                                        return [2 /*return*/, flipFaceHorizontal(annotatedPrediction_1, width)];
                                                    }
                                                    return [2 /*return*/, annotatedPrediction_1];
                                                }
                                                _a = tensorValues.slice(1), coordsArr = _a[0], coordsArrScaled = _a[1];
                                                scaledCoords.dispose();
                                                coords.dispose();
                                                annotatedPrediction = {
                                                    faceInViewConfidence: flagValue,
                                                    boundingBox: { topLeft: box.startPoint, bottomRight: box.endPoint },
                                                    mesh: coordsArr,
                                                    scaledMesh: coordsArrScaled
                                                };
                                                if (flipHorizontal) {
                                                    annotatedPrediction =
                                                        flipFaceHorizontal(annotatedPrediction, width);
                                                }
                                                annotations = {};
                                                for (key in keypoints_1.MESH_ANNOTATIONS) {
                                                    annotations[key] = keypoints_1.MESH_ANNOTATIONS[key].map(function (index) { return annotatedPrediction.scaledMesh[index]; });
                                                }
                                                annotatedPrediction['annotations'] = annotations;
                                                return [2 /*return*/, annotatedPrediction];
                                        }
                                    });
                                }); }))];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    return FaceMesh;
}());
exports.FaceMesh = FaceMesh;
//# sourceMappingURL=index.js.map