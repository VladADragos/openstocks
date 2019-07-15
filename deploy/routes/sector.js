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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const keys_1 = require("../keys");
const router = express_1.default.Router();
const url = `https://www.alphavantage.co/query?function=SECTOR&apikey=${keys_1.alphaVantage}`;
router.post("/", (req, res) => {
    console.log("Sector endpoint requested");
    res.json({ response: "Sector endpoint hit" });
});
router.post("/quote", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("Sector quote requested");
    let response = yield axios_1.default({ url });
    let ranka = response.data["Rank A: Real-Time Performance"];
    let entries = Object.entries(ranka);
    let firstFive = entries.slice(0, 5);
    let sectorQuotes = [];
    firstFive.forEach(element => {
        let sectorQuote = {
            sectorName: element[0],
            changePercent: parseFloat(element[1])
        };
        sectorQuotes.push(sectorQuote);
    });
    res.json({ response: sectorQuotes });
}));
router.post("/quote-top-5", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("Sector quote requested");
    let response = yield axios_1.default({ url });
    let ranka = response.data["Rank A: Real-Time Performance"];
    let entries = Object.entries(ranka);
    let firstFive = entries.slice(0, 5);
    let sectorQuotes = [];
    firstFive.forEach(element => {
        let sectorQuote = {
            sectorName: element[0],
            changePercent: parseFloat(element[1])
        };
        sectorQuotes.push(sectorQuote);
    });
    res.json({ response: sectorQuotes });
}));
router.post("/historical-data", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("Sector quote requested");
    let response = yield axios_1.default({ url });
    let { data } = response;
    delete data["Meta Data"];
    delete data["Rank A: Real-Time Performance"];
    let keys = Object.keys(data);
    keys.forEach((period, index, keys) => {
        keys[index] = period
            .split(":")[1]
            .replace("Performance", "")
            .trim();
    });
    let dataValues = Object.values(data);
    let test = dataValues.map((values, index) => {
        let sectorData = { period: keys[index], data: [{}] };
        for (let [key, value] of Object.entries(values)) {
            sectorData.data.push({ name: key, change: value });
            // console.log(key);
            // console.log(value);
        }
        sectorData.data.shift();
        return sectorData;
    });
    res.json({ response: test });
}));
exports.default = router;
