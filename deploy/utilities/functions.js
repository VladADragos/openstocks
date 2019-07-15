"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const keys_1 = require("../keys");
const queryQuote = (ticker) => __awaiter(this, void 0, void 0, function* () {
    let response = yield axios_1.default({
        url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${keys_1.alphaVantage}`
    });
    return response;
});
exports.queryQuote = queryQuote;
const getExtremeValue = (array, extreme) => {
    let value = array[0].price;
    for (let data of array) {
        // gets lowest value
        if (extreme === 0) {
            if (data.price <= value) {
                value = data.price;
            }
        }
        else {
            // gets highest value
            if (data.price >= value) {
                value = data.price;
            }
        }
    }
    return value;
};
exports.getExtremeValue = getExtremeValue;
