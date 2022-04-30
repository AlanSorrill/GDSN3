/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./srcFunctions/WPFunctions.ts":
/*!*************************************!*\
  !*** ./srcFunctions/WPFunctions.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HashTypes = exports.WonderProxy = exports.RonaTest = exports.ReqTest = exports.listener = void 0;
const functions = __webpack_require__(/*! firebase-functions */ "firebase-functions");
const node_fetch_1 = __webpack_require__(/*! node-fetch */ "node-fetch");
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
__webpack_require__(/*! ./common/FBF_Helpers */ "./srcFunctions/common/FBF_Helpers.ts");
const WonderData_1 = __webpack_require__(/*! ./common/WonderData */ "./srcFunctions/common/WonderData.ts");
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
const crypto = __webpack_require__(/*! crypto */ "crypto");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
console.log('test');
exports.listener = functions.https.onRequest((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Content-Type', 'application/xml');
    let exampleParams = WonderData_1.ExampleRequest.replace('</request-parameters>', '').replace('<request-parameters>', '').replaceAll('<value/>', '<value></value>').replaceAll('<parameter>', '').replaceAll('</name>', '').replaceAll('</value>', '').replaceAll('<name>', '').split('</parameter>').map(str => {
        let tmp = str.split('<value>');
        let name = tmp[0];
        let rest = tmp.slice(1);
        return [name, rest];
    });
    let reqTestParams = new WonderData_1.WonderRequest().groupBy('Year').groupBy('Race').addParam('F_D76.V25', WonderData_1.WonderQueryParam_Util.All).toParamMap();
    let requestParams = new Map();
    let inconsistencies = [];
    exampleParams.forEach((value) => {
        if (!reqTestParams.has(value[0])) {
            inconsistencies.push(`Request missing ${value[0]}`);
        }
        requestParams.set(value[0], value[1]);
    });
    for (let exParamName in reqTestParams.keys()) {
        if (!requestParams.has(exParamName)) {
            inconsistencies.push(`Examples missing ${exParamName}`);
        }
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(inconsistencies));
}));
exports.ReqTest = functions.https.onRequest((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Content-Type', 'application/xml');
    res.send(new WonderData_1.WonderRequest().groupBy('Year').addParam('M_1', 'D76.M1').toString());
}));
exports.RonaTest = functions.https.onRequest((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield new WonderData_1.WonderRequest().groupBy('Year').groupBy('AgeGroups').filterByYear(['1999', '2001']).request();
    let exportPath = path.resolve(__dirname, '../data/exampleResponse.json');
    console.log(`saving to file${exportPath}`);
    fs.writeFileSync(exportPath, JSON.stringify(data));
    console.log('saved');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(data);
}));
function requestToFileName(fetchBody) {
    console.log(`Req to file name\n${fetchBody}`);
    return crypto.createHash('md5').update(fetchBody).digest("hex");
}
exports.WonderProxy = functions.https.onRequest((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let fetchBody = req.body['request_xml'];
    console.log(`Fetch body: ${fetchBody}`);
    let fileName = requestToFileName(fetchBody);
    let exportPath = path.resolve(__dirname, `../data/${fileName}.json`);
    if (fs.existsSync(exportPath)) {
        console.log(`Using cache for request ${fileName}`);
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.sendFile(exportPath);
        return;
    }
    console.log(`Sending query to wonder:\n${fetchBody}`);
    let result = yield (0, node_fetch_1.default)(`https://wonder.cdc.gov/controller/datarequest/D76`, {
        method: 'POST',
        body: `request_xml=${fetchBody}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/xml' },
        // mode: 'no-cors'
    });
    let resultText = yield result.text();
    console.log(`saving to file: ${exportPath}`);
    fs.writeFileSync(exportPath, resultText);
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(resultText);
}));
exports.HashTypes = functions.https.onRequest((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, child_process_1.exec)('openssl list -digest-algorithms', (err, stdout, stderr) => {
        if (err) {
            console.log('err', err);
            res.send(JSON.stringify({ status: 'Error', error: err }));
            return;
        }
        if (stderr) {
            console.log('stderr', stderr);
            res.send(JSON.stringify({ status: 'STDError', error: stderr }));
            return;
        }
        console.log('success', stdout);
        res.send(JSON.stringify({ status: 'Success', value: stdout }));
    });
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV1BGdW5jdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmNGdW5jdGlvbnMvV1BGdW5jdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQWdEO0FBQ2hELDJDQUE4QjtBQUU5Qix5QkFBd0I7QUFDeEIsNkJBQTRCO0FBQzVCLGdDQUE2QjtBQUM3QixvREFBb0c7QUFDcEcsaURBQW9DO0FBQ3BDLGlDQUFnQztBQUVoQyxzQ0FBc0M7QUFDdEMsMkRBQTJEO0FBQzNELEVBQUU7QUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBRU4sUUFBQSxRQUFRLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDbkUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQTtJQUNoRCxJQUFJLGFBQWEsR0FBeUIsMkJBQWMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdFQsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDakIsSUFBSSxJQUFJLEdB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

/***/ }),

/***/ "./srcFunctions/common/FBF_Helpers.ts":
/*!********************************************!*\
  !*** ./srcFunctions/common/FBF_Helpers.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.replaceAllInString = exports.isAllTrue = exports.XmlToJson = exports.concactinate = exports.flatten = exports.ensureFBF_Helpers = void 0;
const Xml2JS = (__webpack_require__(/*! xml2js */ "xml2js").parseString);
Array.prototype.pushAll = function (stuff) {
    if (Array.isArray(stuff)) {
        for (let item of stuff) {
            this.push(item);
        }
    }
    else {
        this.push(stuff);
    }
};
String.prototype.isBoolean = function () {
    return this.toLowerCase() == 'true' || this.toLowerCase() == 'false';
};
String.prototype.isNumber = function () {
    return !Number.isNaN(Number(this));
};
if (typeof Map.prototype.toArray == 'undefined') {
    console.log(`Shimming Map.toArray`);
    Map.prototype.toArray = function () {
        let ths = this;
        let out = [];
        for (let key of ths.keys()) {
            out.push([key, ths.get(key)]);
        }
        return out;
    };
}
function ensureFBF_Helpers() {
    console.log();
}
exports.ensureFBF_Helpers = ensureFBF_Helpers;
function cleanXmlToJson(obj, name = null, asElement = true) {
    if (typeof obj != 'object') {
        return obj;
    }
    if (asElement) { //(obj['$'] || (typeof obj['_'] == 'string')) {// is element
        console.log('Cleaning element ', obj);
        let out = {
            tag: name,
            parameters: {},
        };
        for (let childName of Object.keys(obj)) {
            switch (childName) {
                case '_':
                    if (!out.children) {
                        out.children = [];
                    }
                    out.children.push(obj['_']);
                    break;
                case '$':
                    for (let paramName of Object.keys(obj['$'])) {
                        out.parameters[paramName] = obj['$'][paramName];
                    }
                    break;
                default:
                    if (!out.children) {
                        out.children = [];
                    }
                    if (Array.isArray(obj[childName])) {
                        for (let child of obj[childName]) {
                            out.children.pushAll(cleanXmlToJson(child, childName));
                        }
                    }
                    else {
                        out.children.pushAll(cleanXmlToJson(obj[childName], childName));
                    }
                    break;
            }
            // out.parameters[childName] = obj['$'][childName]
        }
        return out;
    }
    else {
        let outlist = [];
        for (let key of Object.keys(obj)) {
            outlist.push(cleanXmlToJson(obj[key], key));
        }
        return outlist;
    }
}
function flatten(arr) {
    let out = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            out.push(arr[i][j]);
        }
    }
    return out;
}
exports.flatten = flatten;
function concactinate(a, b) {
    let out = [];
    a.forEach((aa) => {
        out.push(aa);
    });
    b.forEach((bb) => {
        out.push(bb);
    });
    return out;
}
exports.concactinate = concactinate;
function XmlToJson(xml) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((acc, rej) => {
            Xml2JS(`<data>${xml}</data>`, (err, value) => {
                if (err) {
                    rej(err);
                }
                else {
                    // console.log('cleaning',value)
                    // let result = cleanXmlToJson(value) as XmlElement;
                    acc(value.data);
                }
            });
        });
    });
}
exports.XmlToJson = XmlToJson;
if (typeof String.prototype.replaceAll == 'undefined') {
    String.prototype.replaceAll = function (a, b) {
        return this.split(a).join(b);
    };
}
function isAllTrue(bools) {
    for (let i = 0; i < bools.length; i++) {
        if (bools[i]) {
            return true;
        }
    }
    return false;
}
exports.isAllTrue = isAllTrue;
function replaceAllInString(target, a, b) {
    return target.split(a).join(b);
}
exports.replaceAllInString = replaceAllInString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRkJGX0hlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmNGdW5jdGlvbnMvY29tbW9uL0ZCRl9IZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFlN0MsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsVUFBYSxLQUFjO0lBQ2pELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QixLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtZQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ2xCO0tBQ0o7U0FBTTtRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDbkI7QUFDTCxDQUFDLENBQUE7QUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRztJQUN6QixPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLE9BQU8sQ0FBQTtBQUN4RSxDQUFDLENBQUE7QUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRztJQUN4QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtBQUN0QyxDQUFDLENBQUE7QUFDRCxJQUFJLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLElBQUksV0FBVyxFQUFFO0lBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtJQUNuQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRztRQUNwQixJQUFJLEdBQUcsR0FBYyxJQUFJLENBQUE7UUFDekIsSUFBSSxHQUFHLEdBQWtCLEVBQUUsQ0FBQTtRQUMzQixLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN4QixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO1FBQ0QsT0FBTyxHQUFHLENBQUE7SUFDZCxDQUFDLENBQUE7Q0FDSjtBQUNELFNBQWdCLGlCQUFpQjtJQUM3QixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDakIsQ0FBQztBQUZELDhDQUVDO0FBTUQsU0FBUyxjQUFjLENBQUMsR0FBVyxFQUFFLE9BQWUsSUFBSSxFQUFFLFlBQXFCLElBQUk7SUFDL0UsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLEVBQUU7UUFDeEIsT0FBTyxHQUFHLENBQUM7S0FDZDtJQUVELElBQUksU0FBUyxFQUFFLEVBQUMsNERBQTREO1FBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDckMsSUFBSSxHQUFHLEdBQWU7WUFDbEIsR0FBRyxFQUFFLElBQUk7WUFDVCxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFBO1FBRUQsS0FBSyxJQUFJLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BDLFFBQVEsU0FBUyxFQUFFO2dCQUNmLEtBQUssR0FBRztvQkFDSixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRTt3QkFDZixHQUFHLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtxQkFDcEI7b0JBQ0QsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7b0JBQzNCLE1BQU07Z0JBQ1YsS0FBSyxHQUFHO29CQUNKLEtBQUssSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTt3QkFDekMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUE7cUJBQ2xEO29CQUNELE1BQU07Z0JBQ1Y7b0JBQ0ksSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7d0JBQ2YsR0FBRyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7cUJBQ3BCO29CQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRTt3QkFDL0IsS0FBSyxJQUFJLEtBQUssSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7NEJBQzlCLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTt5QkFDekQ7cUJBQ0o7eUJBQU07d0JBQ0gsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO3FCQUNsRTtvQkFDRCxNQUFNO2FBQ2I7WUFDRCxrREFBa0Q7U0FDckQ7UUFDRCxPQUFPLEdBQUcsQ0FBQztLQUNkO1NBQU07UUFDSCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUE7UUFDaEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzlCLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO1NBQzlDO1FBQ0QsT0FBTyxPQUFPLENBQUM7S0FDbEI7QUFFTCxDQUFDO0FBQ0QsU0FBZ0IsT0FBTyxDQUFJLEdBQVU7SUFDakMsSUFBSSxHQUFHLEdBQVEsRUFBRSxDQUFBO0lBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDdEI7S0FDSjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQVJELDBCQVFDO0FBQ0QsU0FBZ0IsWUFBWSxDQUFJLENBQU0sRUFBRSxDQUFNO0lBQzFDLElBQUksR0FBRyxHQUFRLEVBQUUsQ0FBQTtJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFDLEVBQUU7UUFDWixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ2hCLENBQUMsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBQyxFQUFFO1FBQ1osR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNoQixDQUFDLENBQUMsQ0FBQTtJQUNGLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQVRELG9DQVNDO0FBQ0QsU0FBc0IsU0FBUyxDQUFDLEdBQVc7O1FBQ3ZDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDNUIsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3pDLElBQUksR0FBRyxFQUFFO29CQUNMLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDWDtxQkFBTTtvQkFDSCxnQ0FBZ0M7b0JBQ2hDLG9EQUFvRDtvQkFFcEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtpQkFDbEI7WUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUFBO0FBYkQsOEJBYUM7QUFFRCxJQUFJLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLElBQUksV0FBVyxFQUFFO0lBQ25ELE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBUyxFQUFFLENBQVM7UUFDeEQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUM7Q0FDTDtBQUNELFNBQWdCLFNBQVMsQ0FBQyxLQUFnQjtJQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNuQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNWLE9BQU8sSUFBSSxDQUFBO1NBQ2Q7S0FDSjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFQRCw4QkFPQztBQUNELFNBQWdCLGtCQUFrQixDQUFDLE1BQWMsRUFBRSxDQUFTLEVBQUUsQ0FBUztJQUVuRSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRW5DLENBQUM7QUFKRCxnREFJQyJ9

/***/ }),

/***/ "./srcFunctions/common/WonderData.ts":
/*!*******************************************!*\
  !*** ./srcFunctions/common/WonderData.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Database = exports.ExampleRequest = exports.ConsumableLinkedList = exports.WonderRequest = exports.DeWonder = exports.AllWonderParams = exports.WonderQueryParam_GroupBy = exports.WonderQueryParam_Race = exports.WonderQueryParam_Gender = exports.WonderQueryParam_Measure = exports.WonderQueryParam_AgeGroup = exports.WonderQueryParam_Include = exports.WonderQueryParam = exports.WonderQueryParam_Util = exports.parseYearMonthString = exports.isYearMonthString = exports.MonthEnum = exports.YearStrings = exports.isWQP_None = void 0;
// import * as XMLParser from 'xml2js'
if (true) {
    global.fetch = __webpack_require__(/*! node-fetch */ "node-fetch");
}
const sorted_btree_1 = __webpack_require__(/*! sorted-btree */ "sorted-btree");
const FBF_Helpers_1 = __webpack_require__(/*! ./FBF_Helpers */ "./srcFunctions/common/FBF_Helpers.ts");
// export type WonderQueryParamName = (keyof typeof WonderQueryParam) 
function isWQP_None(param) {
    return (param == 'None') || (param == WonderQueryParam_Util.None);
}
exports.isWQP_None = isWQP_None;
function YearStrings(start = 1999, end = 2020) {
    let out = [];
    for (let i = start; i <= end; i++) {
        out.push(`${i}`);
    }
    return out;
}
exports.YearStrings = YearStrings;
var MonthEnum;
(function (MonthEnum) {
    MonthEnum[MonthEnum["January"] = 0] = "January";
    MonthEnum[MonthEnum["February"] = 1] = "February";
    MonthEnum[MonthEnum["March"] = 2] = "March";
    MonthEnum[MonthEnum["April"] = 3] = "April";
    MonthEnum[MonthEnum["May"] = 4] = "May";
    MonthEnum[MonthEnum["June"] = 5] = "June";
    MonthEnum[MonthEnum["July"] = 6] = "July";
    MonthEnum[MonthEnum["August"] = 7] = "August";
    MonthEnum[MonthEnum["September"] = 8] = "September";
    MonthEnum[MonthEnum["October"] = 9] = "October";
    MonthEnum[MonthEnum["November"] = 10] = "November";
    MonthEnum[MonthEnum["December"] = 11] = "December";
})(MonthEnum = exports.MonthEnum || (exports.MonthEnum = {}));
function isYearMonthString(str) {
    return str.split('-').length == 2;
}
exports.isYearMonthString = isYearMonthString;
function parseYearMonthString(str) {
    let parts = str.split('-');
    switch (parts.length) {
        case 0:
            return null;
        case 1:
            return [parts[0], -1];
        case 2:
            return [parts[0], MonthEnum[parts[1]]];
    }
}
exports.parseYearMonthString = parseYearMonthString;
var WonderQueryParam_Util;
(function (WonderQueryParam_Util) {
    WonderQueryParam_Util["None"] = "*None*";
    WonderQueryParam_Util["All"] = "*All*";
})(WonderQueryParam_Util = exports.WonderQueryParam_Util || (exports.WonderQueryParam_Util = {}));
var WonderQueryParam;
(function (WonderQueryParam) {
    //FIV
    WonderQueryParam["YearAndMonth"] = "D76.V1";
})(WonderQueryParam = exports.WonderQueryParam || (exports.WonderQueryParam = {}));
var WonderQueryParam_Include;
(function (WonderQueryParam_Include) {
    WonderQueryParam_Include["YearAndMonth"] = "D76.V1";
    WonderQueryParam_Include["CensusRegions"] = "D76.V10";
    WonderQueryParam_Include["ICD10Codes"] = "D76.V2";
    WonderQueryParam_Include["HHSRegions"] = "D76.V27";
    WonderQueryParam_Include["StatesAndCounties"] = "D76.V9";
})(WonderQueryParam_Include = exports.WonderQueryParam_Include || (exports.WonderQueryParam_Include = {}));
var WonderQueryParam_AgeGroup;
(function (WonderQueryParam_AgeGroup) {
    WonderQueryParam_AgeGroup["TenYear"] = "D76.V5";
    WonderQueryParam_AgeGroup["FiveYear"] = "D76.V51";
    WonderQueryParam_AgeGroup["SingleYear"] = "D76.V52";
    WonderQueryParam_AgeGroup["Infant"] = "D76.V6";
})(WonderQueryParam_AgeGroup = exports.WonderQueryParam_AgeGroup || (exports.WonderQueryParam_AgeGroup = {}));
var WonderQueryParam_Measure;
(function (WonderQueryParam_Measure) {
    WonderQueryParam_Measure["Deaths"] = "D76.M1";
    WonderQueryParam_Measure["Population"] = "D76.M2";
    WonderQueryParam_Measure["CrudeRate"] = "D76.M3";
    WonderQueryParam_Measure["CrudeRateStandardError"] = "D76.M31";
    WonderQueryParam_Measure["CrudeRate95ConfidenceInterval"] = "D76.M32";
    WonderQueryParam_Measure["AgeAdjustedRate"] = "D76.M4";
    WonderQueryParam_Measure["AgeAdjustedRateStandardError"] = "D76.M41";
    WonderQueryParam_Measure["AgeAdjustedRateConfidenceInterval"] = "D76.M42";
    WonderQueryParam_Measure["PercentOfTotalDeaths"] = "D76.M9";
})(WonderQueryParam_Measure = exports.WonderQueryParam_Measure || (exports.WonderQueryParam_Measure = {}));
var WonderQueryParam_Gender;
(function (WonderQueryParam_Gender) {
    WonderQueryParam_Gender["Male"] = "M";
    WonderQueryParam_Gender["Female"] = "F";
})(WonderQueryParam_Gender = exports.WonderQueryParam_Gender || (exports.WonderQueryParam_Gender = {}));
var WonderQueryParam_Race;
(function (WonderQueryParam_Race) {
    WonderQueryParam_Race["HispanicOrLatino"] = "2135-2";
    WonderQueryParam_Race["NotHispanicOrLatino"] = "2186-2";
    WonderQueryParam_Race["NotStated"] = "NS";
    WonderQueryParam_Race["AmericanIndianOrAlaskaNative"] = "1002-5";
    WonderQueryParam_Race["AsianOrPacificIslander"] = "A-PI";
    WonderQueryParam_Race["Black"] = "2054-5";
    WonderQueryParam_Race["White"] = "2106-3";
})(WonderQueryParam_Race = exports.WonderQueryParam_Race || (exports.WonderQueryParam_Race = {}));
var WonderQueryParam_GroupBy;
(function (WonderQueryParam_GroupBy) {
    WonderQueryParam_GroupBy["CensusRegion"] = "D76.V10-level1";
    WonderQueryParam_GroupBy["CensusDivision"] = "D76.V10-level2";
    WonderQueryParam_GroupBy["HHSRegion"] = "D76.V27-level1";
    WonderQueryParam_GroupBy["State"] = "D76.V9-level1";
    WonderQueryParam_GroupBy["County"] = "D76.V9-level2";
    WonderQueryParam_GroupBy["Urbanization2013"] = "D76.V19";
    WonderQueryParam_GroupBy["Urbanization2006"] = "D76.V11";
    WonderQueryParam_GroupBy["AgeGroups"] = "D76.V5";
    WonderQueryParam_GroupBy["Gender"] = "D76.V7";
    WonderQueryParam_GroupBy["HispanicOrigin"] = "D76.V17";
    WonderQueryParam_GroupBy["Race"] = "D76.V8";
    //time
    WonderQueryParam_GroupBy["Year"] = "D76.V1-level1";
    WonderQueryParam_GroupBy["Month"] = "D76.V1-level2";
    WonderQueryParam_GroupBy["Weekday"] = "D76.V24";
    WonderQueryParam_GroupBy["Autopsy"] = "D76.V20";
    WonderQueryParam_GroupBy["PlaceofDeath"] = "D76.V21";
    WonderQueryParam_GroupBy["LeadingCausesofDeath"] = "D76.V28";
    WonderQueryParam_GroupBy["LeadingCausesofDeathInfants"] = "D76.V29";
    WonderQueryParam_GroupBy["ICDChapter"] = "D76.V2-level1";
    WonderQueryParam_GroupBy["ICDSubChapter"] = "D76.V2-level2";
    WonderQueryParam_GroupBy["CauseOfdeath"] = "D76.V2-level3";
    WonderQueryParam_GroupBy["ICD10_113CauseList"] = "D76.V4";
    WonderQueryParam_GroupBy["ICD10_130CauseListInfants"] = "D76.V12";
    WonderQueryParam_GroupBy["InjuryIntent"] = "D76.V22";
    WonderQueryParam_GroupBy["InjuryMechanismAndAllOtherLeadingCauses"] = "D76.V23";
    WonderQueryParam_GroupBy["DrugAlcoholInducedCauses"] = "D76.V25";
})(WonderQueryParam_GroupBy = exports.WonderQueryParam_GroupBy || (exports.WonderQueryParam_GroupBy = {}));
exports.AllWonderParams = [WonderQueryParam_Include, WonderQueryParam_AgeGroup, WonderQueryParam_GroupBy, , WonderQueryParam_Measure, , WonderQueryParam_Util];
let WonderQueryParam_Reversed_Cache = null;
// export function WonderQueryParam_Reversed() {
//   if (WonderQueryParam_Reversed_Cache == null) {
//     let WonderQueryParam_Reversed_Cache = {} as any
//     for (let key in WonderQueryParam) {
//       WonderQueryParam_Reversed_Cache[WonderQueryParam[key]] = key;
//     }
//   }
//   return WonderQueryParam_Reversed_Cache;
// }
function DeWonder(text) {
    let tmp = text;
    let allTranslations = [];
    for (let groupName in exports.AllWonderParams) {
        let group = exports.AllWonderParams[groupName];
        for (let key in group) {
            allTranslations.push([groupName, group[key], key]);
        }
    }
    allTranslations = allTranslations.sort((a, b) => (b[1].length - a[1].length));
    for (let item of allTranslations) {
        // console.log(`Replacing ${group[key]} with ${key}`)
        tmp = (0, FBF_Helpers_1.replaceAllInString)(tmp, `F_${item[1]}`, `F_Only_${item[2]}`);
        tmp = (0, FBF_Helpers_1.replaceAllInString)(tmp, `I_${item[1]}`, `I_Only_${item[2]}`);
        tmp = (0, FBF_Helpers_1.replaceAllInString)(tmp, `V_${item[1]}`, `V_Only_${item[2]}`);
        tmp = (0, FBF_Helpers_1.replaceAllInString)(tmp, item[1], item[2]);
    }
    return tmp;
}
exports.DeWonder = DeWonder;
class WonderRequest {
    constructor() {
        this.params = new Map();
        this.groupByCount = 0;
        this.groupByCountLimit = 5;
        this.defaultParams = {
            'dataset_code': ['D76'],
            'B_2': [WonderQueryParam_Util.None],
            'B_3': [WonderQueryParam_Util.None],
            'B_4': [WonderQueryParam_Util.None],
            'B_5': [WonderQueryParam_Util.None],
            'O_age': [WonderQueryParam_AgeGroup.TenYear],
            'O_location': [WonderQueryParam_Include.StatesAndCounties],
            'O_aar_pop': ['0000'],
            // 'O_aar_enable': ['false'],
            'O_urban': [WonderQueryParam_GroupBy.Urbanization2013],
            // 'O_aar_CI': ['true'],
            'action-Send': ['Send'],
            // 'O_aar_SE': ['true'],
            'O_aar': ['aar_none'],
            'M_1': [WonderQueryParam_Measure.Deaths],
            'M_2': [WonderQueryParam_Measure.Population],
            'M_3': [WonderQueryParam_Measure.CrudeRate],
            'O_V10_fmode': ['freg'],
            'O_V1_fmode': ['freg'],
            'O_V25_fmode': ['freg'],
            'O_V27_fmode': ['freg'],
            'O_V2_fmode': ['freg'],
            'O_V9_fmode': ['freg'],
            'O_oc-sect1-request': ['close'],
            'O_precision': ['1'],
            'O_rate_per': ['100000'],
            'O_show_supressed': ['true'],
            'O_show_totals': ['false'],
            'O_show_zeros': ['true'],
            'O_timeout': ['600'],
            'O_title': ['Example1'],
            'O_javascript': ['off'],
            'O_ucd': [WonderQueryParam_Include.ICD10Codes],
            'F_D76.V1': [WonderQueryParam_Util.All],
            'F_D76.V10': [WonderQueryParam_Util.All],
            'F_D76.V2': ['C00-D48'],
            'F_D76.V9': [WonderQueryParam_Util.All],
            'V_D76.V7': [WonderQueryParam_Util.All],
            'V_D76.V8': [WonderQueryParam_Util.All],
            'V_D76.V9': [],
            'V_D76.V6': ['00'],
            'V_D76.V52': [WonderQueryParam_Util.All],
            'V_D76.V5': [WonderQueryParam_Util.All],
            'V_D76.V51': [WonderQueryParam_Util.All],
            'V_D76.V17': [WonderQueryParam_Util.All],
            'V_D76.V19': [WonderQueryParam_Util.All],
            'V_D76.V2': [],
            'V_D76.V20': [WonderQueryParam_Util.All],
            'V_D76.V21': [WonderQueryParam_Util.All],
            'V_D76.V22': [WonderQueryParam_Util.All],
            'V_D76.V23': [WonderQueryParam_Util.All],
            'V_D76.V24': [WonderQueryParam_Util.All],
            'V_D76.V25': [],
            'F_D76.V27': [WonderQueryParam_Util.All],
            'O_show_suppressed': ['true'],
            //values for non-standard age-adjusted rates
            // 'VM_D76.M6_D76.V1_S': ['2004'],// [WonderQueryParam_Util.All],//years
            // 'VM_D76.M6_D76.V17': [WonderQueryParam_Util.All],//Hispanic Origin
            // 'VM_D76.M6_D76.V7': [WonderQueryParam_Util.All],//Gender
            // 'VM_D76.M6_D76.V8': [WonderQueryParam_Util.All],//Race
            'finder-stage-D76.V1': ['codeset'],
            'finder-stage-D76.V10': ['codeset'],
            'finder-stage-D76.V2': ['codeset'],
            'finder-stage-D76.V25': ['codeset'],
            'finder-stage-D76.V27': ['codeset'],
            'finder-stage-D76.V9': ['codeset'],
            'saved_id': [],
            'stage': ['request']
        };
        this.defaultFIVParams = {};
    }
    addParam(name, value) {
        if (typeof value == 'string') {
            this.params.set(name, [value]);
        }
        else {
            this.params.set(name, value);
        }
        return this;
    }
    urbanBy(version) {
        let vCode = WonderQueryParam_GroupBy[version];
        this.addParam('O_urban', vCode);
        return this;
    }
    enableAgeAdjustedRate(isEnabled, confidenceInterval95 = isEnabled, standardError = isEnabled) {
        this.addParam('O_aar_enable', isEnabled ? 'true' : 'false');
        this.addParam('O_aar_CI', confidenceInterval95 ? 'true' : 'false');
        this.addParam('O_aar_SE', standardError ? 'true' : 'false');
        return this;
    }
    ageAdjustedRate(rateBy) {
        this.addParam('O_arr', rateBy);
        return this;
    }
    population(yearOfPopulationCount) {
        this.addParam('O_aar_pop', yearOfPopulationCount);
        return this;
    }
    locationBy(locByName) {
        let locBy = WonderQueryParam_Include[locByName];
        this.params.set('O_Location', [locBy]);
        return this;
    }
    includeDates(dates) {
        let paramName = `F_${WonderQueryParam_Include.YearAndMonth}`;
        if (dates == 'all') {
            this.params.set(paramName, [WonderQueryParam_Util.All]);
            return;
        }
        return this;
    }
    enableJavascript(enabled) {
        this.addParam('O_javascript', enabled ? 'on' : 'off');
        return this;
    }
    measure(measureBy) {
        let paramName = `M_${measureBy.replace('D.76.M', '')}`;
        this.addParam(paramName, WonderQueryParam_Measure[measureBy]);
    }
    causeOfDeathBy(deathBy) {
        let code = deathBy in WonderQueryParam_Include ? WonderQueryParam_Include[deathBy] : WonderQueryParam_GroupBy[deathBy];
        this.addParam('O_ucd', [code]);
        return this;
    }
    ageGroups(groupName) {
        this.addParam(`O_age`, [WonderQueryParam_AgeGroup[groupName]]);
        return this;
    }
    filterByYear(years) {
        //let val = (typeof years == 'string') ? years : years.map(y => `${y} (${y})`).join(' ')
        // return this.addParam('I_D76.V1', val);
        return this.addParam(`F_D76.V1`, years);
    }
    groupBy(groupByName) {
        if (this.groupByCount >= this.groupByCountLimit) {
            throw new Error(`Cannot group by more than ${this.groupByCountLimit}`);
        }
        let parameterName = `B_${this.groupByCount + 1}`;
        if (isWQP_None(groupByName)) {
            this.addParam(parameterName, WonderQueryParam_Util.None);
        }
        else {
            let param = WonderQueryParam_GroupBy[groupByName];
            this.addParam(parameterName, param);
        }
        this.groupByCount++;
        return this;
    }
    toParamMap() {
        this.setDefaults();
        return this.params;
    }
    alternatives(k) {
        if (k.length < 3) {
            return [k];
        }
        let start = k.substring(0, 2);
        let rest = k.substring(2);
        switch (start) {
            case 'F_':
                return [k, `I_${rest}`, `V_${rest}`];
            case 'I_':
                return [k, `F_${rest}`, `V_${rest}`];
            case 'V_':
                return [k, `I_${rest}`, `F_${rest}`];
            default:
                return [k];
        }
    }
    setDefaults() {
        let ths = this;
        for (let key in this.defaultParams) {
            if (!((0, FBF_Helpers_1.isAllTrue)(ths.alternatives(key).map((altKey) => {
                console.log(`Checking alternative ${altKey}`);
                if (ths.params.has(altKey)) {
                    console.log(`----Alt Found ${altKey}`);
                }
                return ths.params.has(altKey);
            })))) {
                console.log(`Defaulting ${key} (${DeWonder(key)}) to ${this.defaultParams[key]}`);
                this.params.set(key, this.defaultParams[key]);
            }
        }
    }
    toString() {
        console.log(`Building query string`);
        let ths = this;
        let toProcess = [];
        let processed = new Map();
        let name;
        let keyList = new ConsumableLinkedList(this.params.keys());
        keyList.consume((key) => {
            if (key.startsWith('B_')) {
                toProcess.push([key, ths.params.get(key)]);
                return true;
            }
            return false;
        });
        // for (let i = 1; i <= 5; i++) {
        //   name = `B_${i}`
        //   toProcess.push([name, this.params.has(name) ? this.params.get(name) : [WonderQueryParam_Util.None]])
        //   processed.set(name, true)
        // }
        // for (let key of this.params.keys()) {
        //   if (key.startsWith('M_')) {
        //     toProcess.push([key, this.params.get(key)])
        //     processed.set(key, true)
        //   }
        // }
        keyList.consume((key) => {
            if (key.startsWith('M_')) {
                toProcess.push([key, ths.params.get(key)]);
                return true;
            }
            return false;
        });
        keyList.consume((key) => {
            if (key.startsWith('O_')) {
                toProcess.push([key, ths.params.get(key)]);
                return true;
            }
            return false;
        });
        keyList.consume((key) => {
            if (key.startsWith('F_') || key.startsWith('I_') || key.startsWith('V_')) {
                toProcess.push([key, ths.params.get(key)]);
                return true;
            }
            return false;
        });
        keyList.consume((key) => {
            console.log(`Uordered parameter ${key}`);
            toProcess.push([key, ths.params.get(key)]);
            return true;
        });
        // for (let key of this.params.keys()) {
        //   if (!processed.has(key)) {
        //     toProcess.push([key, this.params.get(key)])
        //   }
        // }
        console.log(`Full Query:\n${toProcess.map((param) => `${param[0]}(${DeWonder(param[0])}) = \n${param[1].join('\n--')}\n`)}`);
        return toProcess.map((param, index) => {
            console.log(`Mapping ${param[0]} (${DeWonder(param[0])}) to `, param[1]);
            return `<parameter><name>${param[0]}</name>${param[1].length > 0 ? param[1].map(str => `<value>${str}</value>`).join('') : '<value />'}</parameter>`;
        }).join('');
    }
    requestTable(setDefaults = true, clientSide = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return WonderRequest.toTable(yield this.request(setDefaults, clientSide));
        });
    }
    request(setDefaults = true, clientSide = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.params.has('B_1')) {
                throw new Error(`Please group by at least one property`);
            }
            if (setDefaults) {
                this.setDefaults();
            }
            let reqPartOfBody = this.toString();
            // console.log(`Requesting`, reqPartOfBody)
            // console.log(`Query: ${reqPartOfBody}`)
            let fetchBody = `request_xml=<request-parameters><parameter>
        <name>accept_datause_restrictions</name>
        <value>true</value>
        </parameter>${reqPartOfBody}</request-parameters>`;
            let result = yield fetch(clientSide ? `http://${location.hostname}:5001/gdsn3-22/us-central1/WonderProxy` : `https://wonder.cdc.gov/controller/datarequest/D76`, {
                method: 'POST',
                body: fetchBody,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/xml' },
                // mode: 'no-cors'
            });
            console.log(result.status + " " + result.statusText);
            let textResult = yield result.text();
            // console.log(textResult);
            // let jsonValue = await XMLParser.parseStringPromise(textResult, {})
            // console.log('JSON__________----')
            // console.log(jsonValue)
            let json = yield (0, FBF_Helpers_1.XmlToJson)(textResult);
            return json.page[0];
        });
    }
    static toTable(data) {
        // console.log(data.response[0]['data-table'][0])
        let byCodes = (0, FBF_Helpers_1.flatten)(data.response[0].request[0].byvariables.map((v) => v.variable.map((vv) => vv.$.code)));
        console.log('By codes', byCodes);
        let measureCodes = data.response[0]['measure-selections'][0].measure.map((m) => m.$.code);
        let columnCodes = (0, FBF_Helpers_1.concactinate)(byCodes, measureCodes);
        console.log('Column Codes', measureCodes.map((c) => DeWonder(c)));
        let repeatedColumns = [];
        let columnsToRepeat = new Map();
        let rows = [];
        data.response[0]['data-table'][0].r.forEach((row) => {
            let column = [];
            columnsToRepeat.clear();
            for (let i = 0; i < repeatedColumns.length; i++) {
                // console.log(`Repeating ${repeatedColumns[i][1]}`)
                columnsToRepeat.set(repeatedColumns[i][2], repeatedColumns[i][1]);
                repeatedColumns[i][0]--;
                if (repeatedColumns[i][0] <= 0) {
                    repeatedColumns.splice(i, 1);
                }
            }
            row.c.forEach((col, colIndex) => {
                var _a;
                if (columnsToRepeat.has(colIndex)) {
                    column.push(columnsToRepeat.get(colIndex));
                }
                let val = (typeof col.$.l == 'undefined') ?
                    (col.$.v == "Unreliable" ? "Unreliable" : Number((_a = col.$.v) === null || _a === void 0 ? void 0 : _a.replaceAll(',', '')))
                    : col.$.l;
                if (col.$.r) {
                    // console.log(`Repeating ${val} ${Number(col.$.r) - 1} times`)
                    repeatedColumns.push([Number(col.$.r) - 1, val, colIndex]);
                }
                column.push(val);
            });
            rows.push(column);
        });
        let output = { columnCodes: columnCodes, columnNames: columnCodes.map((code) => DeWonder(code)), rows: rows };
        console.log(output);
        return output;
    }
}
exports.WonderRequest = WonderRequest;
class ConsumableLinkedList {
    constructor(values) {
        this.root = null;
        if (!Array.isArray(values)) {
            let vals = [];
            let node = null;
            for (let item of values) {
                if (node == null) {
                    this.root = { value: item, next: null };
                    node = this.root;
                }
                else {
                    node.next = { value: item, next: null };
                    node = node.next;
                }
            }
        }
        else {
            this.root = { value: values[0], next: null };
            let node = this.root;
            for (let i = 1; i < values.length; i++) {
                node.next = { value: values[i], next: null };
                node = node.next;
            }
        }
    }
    consume(onEach) {
        let node = this.root;
        let lastNode = null;
        while (node != null) {
            if (onEach(node.value)) {
                if (lastNode == null) {
                    //  console.log(`Consuming ${node.value} as root now ${this.toString()}`)
                    this.root = node.next;
                    node = this.root;
                }
                else {
                    //  console.log(`Consuming ${node.value} in chain now ${this.toString()}`)
                    lastNode.next = node.next;
                    node = node.next;
                }
            }
            else {
                lastNode = node;
                node = node.next;
            }
        }
        return this;
    }
    toArray() {
        let node = this.root;
        let out = [];
        while (node != null) {
            out.push(node.value);
            node = node.next;
        }
        return out;
    }
    toString() {
        return this.toArray().join(', ');
    }
}
exports.ConsumableLinkedList = ConsumableLinkedList;
exports.ExampleRequest = '<request-parameters><parameter><name>B_1</name><value>D76.V1-level1</value></parameter><parameter><name>B_2</name><value>D76.V8</value></parameter><parameter><name>B_3</name><value>*None*</value></parameter><parameter><name>B_4</name><value>*None*</value></parameter><parameter><name>B_5</name><value>*None*</value></parameter><parameter><name>F_D76.V1</name><value>1999</value><value>2000</value><value>2001</value><value>2002</value><value>2003</value><value>2004</value><value>2005</value><value>2006</value><value>2007</value><value>2008</value><value>2009</value><value>2010</value><value>2011</value><value>2012</value><value>2013</value></parameter><parameter><name>F_D76.V10</name><value>*All*</value></parameter><parameter><name>F_D76.V2</name><value>C00-D48</value></parameter><parameter><name>F_D76.V25</name><value>*All*</value></parameter><parameter><name>F_D76.V27</name><value>*All*</value></parameter><parameter><name>F_D76.V9</name><value>*All*</value></parameter><parameter><name>I_D76.V1</name><value>1999 (1999) 2000 (2000) 2001 (2001) 2002 (2002) 2003 (2003) 2004 (2004) 2005 (2005) 2006 (2006) 2007 (2007) 2008 (2008) 2009 (2009) 2010 (2010) 2011 (2011) 2012 (2012) 2013 (2013) </value></parameter><parameter><name>I_D76.V10</name><value>*All* (The United States) </value></parameter><parameter><name>I_D76.V2</name><value>C00-D48 (Neoplasms) </value></parameter><parameter><name>I_D76.V25</name><value>All Causes of Death </value></parameter><parameter><name>I_D76.V27</name><value>*All* (The United States) </value></parameter><parameter><name>I_D76.V9</name><value>*All* (The United States) </value></parameter><parameter><name>M_1</name><value>D76.M1</value></parameter><parameter><name>M_2</name><value>D76.M2</value></parameter><parameter><name>M_3</name><value>D76.M3</value></parameter><parameter><name>M_9</name><value>D76.M9</value></parameter><parameter><name>O_V10_fmode</name><value>freg</value></parameter><parameter><name>O_V1_fmode</name><value>freg</value></parameter><parameter><name>O_V25_fmode</name><value>freg</value></parameter><parameter><name>O_V27_fmode</name><value>freg</value></parameter><parameter><name>O_V2_fmode</name><value>freg</value></parameter><parameter><name>O_V9_fmode</name><value>freg</value></parameter><parameter><name>O_aar</name><value>aar_std</value></parameter><parameter><name>O_aar_CI</name><value>true</value></parameter><parameter><name>O_aar_SE</name><value>true</value></parameter><parameter><name>O_aar_enable</name><value>true</value></parameter><parameter><name>O_aar_pop</name><value>0000</value></parameter><parameter><name>O_age</name><value>D76.V5</value></parameter><parameter><name>O_javascript</name><value>on</value></parameter><parameter><name>O_location</name><value>D76.V9</value></parameter><parameter><name>O_oc-sect1-request</name><value>close</value></parameter><parameter><name>O_precision</name><value>1</value></parameter><parameter><name>O_rate_per</name><value>100000</value></parameter><parameter><name>O_show_suppressed</name><value>true</value></parameter><parameter><name>O_show_totals</name><value>true</value></parameter><parameter><name>O_show_zeros</name><value>true</value></parameter><parameter><name>O_timeout</name><value>600</value></parameter><parameter><name>O_title</name><value>Example1</value></parameter><parameter><name>O_ucd</name><value>D76.V2</value></parameter><parameter><name>O_urban</name><value>D76.V19</value></parameter><parameter><name>VM_D76.M6_D76.V10</name><value/></parameter><parameter><name>VM_D76.M6_D76.V17</name><value>*All*</value></parameter><parameter><name>VM_D76.M6_D76.V1_S</name><value>*All*</value></parameter><parameter><name>VM_D76.M6_D76.V7</name><value>*All*</value></parameter><parameter><name>VM_D76.M6_D76.V8</name><value>*All*</value></parameter><parameter><name>V_D76.V1</name><value/></parameter><parameter><name>V_D76.V10</name><value/></parameter><parameter><name>V_D76.V11</name><value>*All*</value></parameter><parameter><name>V_D76.V12</name><value>*All*</value></parameter><parameter><name>V_D76.V17</name><value>*All*</value></parameter><parameter><name>V_D76.V19</name><value>*All*</value></parameter><parameter><name>V_D76.V2</name><value/></parameter><parameter><name>V_D76.V20</name><value>*All*</value></parameter><parameter><name>V_D76.V21</name><value>*All*</value></parameter><parameter><name>V_D76.V22</name><value>*All*</value></parameter><parameter><name>V_D76.V23</name><value>*All*</value></parameter><parameter><name>V_D76.V24</name><value>*All*</value></parameter><parameter><name>V_D76.V25</name><value/></parameter><parameter><name>V_D76.V27</name><value/></parameter><parameter><name>V_D76.V4</name><value>*All*</value></parameter><parameter><name>V_D76.V5</name><value>*All*</value></parameter><parameter><name>V_D76.V51</name><value>*All*</value></parameter><parameter><name>V_D76.V52</name><value>*All*</value></parameter><parameter><name>V_D76.V6</name><value>00</value></parameter><parameter><name>V_D76.V7</name><value>*All*</value></parameter><parameter><name>V_D76.V8</name><value>*All*</value></parameter><parameter><name>V_D76.V9</name><value/></parameter><parameter><name>action-Send</name><value>Send</value></parameter><parameter><name>dataset_code</name><value>D76</value></parameter><parameter><name>dataset_label</name><value>Underlying Cause of Death, 1999-2016</value></parameter><parameter><name>dataset_vintage</name><value>2016</value></parameter><parameter><name>finder-stage-D76.V1</name><value>codeset</value></parameter><parameter><name>finder-stage-D76.V10</name><value>codeset</value></parameter><parameter><name>finder-stage-D76.V2</name><value>codeset</value></parameter><parameter><name>finder-stage-D76.V25</name><value>codeset</value></parameter><parameter><name>finder-stage-D76.V27</name><value>codeset</value></parameter><parameter><name>finder-stage-D76.V9</name><value>codeset</value></parameter><parameter><name>saved_id</name><value/></parameter><parameter><name>stage</name><value>request</value></parameter></request-parameters>';
function test() {
    let val;
    val;
}
class Database {
    constructor() {
        this.deathsByCause = new Map();
    }
    getDeathsForCause(causeName) {
        if (!this.deathsByCause.has(causeName)) {
            this.deathsByCause.set(causeName, new sorted_btree_1.default(undefined));
        }
        return this.deathsByCause.get(causeName);
    }
    pullDeathsByCause() {
        return __awaiter(this, void 0, void 0, function* () {
            let ths = this;
            let deaths = yield new WonderRequest().groupBy('Month').groupBy('CauseOfdeath').filterByYear(['1999', '2001']).requestTable(true, true);
            deaths.rows.forEach((row) => {
                let time = new Date(row[0].isNumber() ? `${row[0]} 1 1` : row[0]).getTime();
                let tree = ths.getDeathsForCause(row[1]);
                tree.set(time, row[2]);
            });
            return this.deathsByCause;
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29uZGVyRGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyY0Z1bmN0aW9ucy9jb21tb24vV29uZGVyRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSxzQ0FBc0M7QUFDdEMsSUFBSSxJQUFJLEVBQUU7SUFDUixNQUFNLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtDQUNyQztBQUNELCtDQUFpQztBQUNqQywrQ0FBNkc7QUFHN0csc0VBQXNFO0FBQ3RFLFNBQWdCLFVBQVUsQ0FBQyxLQUFxQztJQUM5RCxPQUFPLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ25FLENBQUM7QUFGRCxnQ0FFQztBQUdELFNBQWdCLFdBQVcsQ0FBQyxRQUFnQixJQUFJLEVBQUUsTUFBYyxJQUFJO0lBQ2xFLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQTtJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7S0FDakI7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFORCxrQ0FNQztBQUNELElBQVksU0FFWDtBQUZELFdBQVksU0FBUztJQUNuQiwrQ0FBTyxDQUFBO0lBQUUsaURBQVEsQ0FBQTtJQUFFLDJDQUFLLENBQUE7SUFBRSwyQ0FBSyxDQUFBO0lBQUUsdUNBQUcsQ0FBQTtJQUFFLHlDQUFJLENBQUE7SUFBRSx5Q0FBSSxDQUFBO0lBQUUsNkNBQU0sQ0FBQTtJQUFFLG1EQUFTLENBQUE7SUFBRSwrQ0FBTyxDQUFBO0lBQUUsa0RBQVEsQ0FBQTtJQUFFLGtEQUFRLENBQUE7QUFDbEcsQ0FBQyxFQUZXLFNBQVMsR0FBVCxpQkFB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

/***/ }),

/***/ "firebase-functions":
/*!*************************************!*\
  !*** external "firebase-functions" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("firebase-functions");

/***/ }),

/***/ "node-fetch":
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("node-fetch");

/***/ }),

/***/ "sorted-btree":
/*!*******************************!*\
  !*** external "sorted-btree" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("sorted-btree");

/***/ }),

/***/ "xml2js":
/*!*************************!*\
  !*** external "xml2js" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("xml2js");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./srcFunctions/WPFunctions.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map