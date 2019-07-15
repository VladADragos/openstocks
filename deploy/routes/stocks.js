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
const functions_1 = require("../utilities/functions");
const worldIndices_1 = __importDefault(require("../utilities/worldIndices"));
const router = express_1.default.Router();
const queryHistoricalData = (ticker, period, time) => __awaiter(this, void 0, void 0, function* () {
    let data = [];
    let outputsize = period > 100 ? "compact" : "full";
    let response = yield axios_1.default({
        url: `https://www.alphavantage.co/query?function=${time}&symbol=${ticker}&outputsize=${outputsize}&apikey=${keys_1.alphaVantage}`
    });
    let timeSeries = response.data["Time Series (Daily)"];
    let values = Object.values(timeSeries);
    let keys = Object.keys(timeSeries);
    for (let i = period - 1; i >= 0; i--) {
        data.push({ date: keys[i], price: parseFloat(values[i]["4. close"]) });
    }
    return data;
});
router.post("/", (req, res) => {
    console.log("stock endpoint requested");
    res.json({ response: "Stock endpoint hit" });
});
router.post("/quote", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("Stock quote requested");
    let tickers = req.body.tickers;
    console.log(req.body);
    let quotes = [];
    for (let ticker of tickers) {
        let response = yield functions_1.queryQuote(ticker);
        let data = response.data["Global Quote"];
        let price = parseFloat(data["05. price"]);
        let change = parseFloat(data["09. change"]);
        let changePercent = data["10. change percent"];
        let quote = { ticker, price, change, changePercent };
        quotes.push(quote);
    }
    res.json({ response: quotes });
    console.log("Stock quote sent");
}));
router.post("/historical-data", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("historical data requested");
    let ticker = req.body.ticker;
    let period = req.body.period;
    let time = req.body.time;
    let data = yield queryHistoricalData(ticker, period, time);
    let lowestValue = functions_1.getExtremeValue(data, 0);
    let highestValue = functions_1.getExtremeValue(data, 1);
    let index = {
        data,
        highestValue,
        lowestValue
    };
    console.log();
    res.json({ response: index });
    console.log("Historical data sent");
}));
router.post("/world-indices-quote", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("World indices quotes requested");
    const worldIndices = worldIndices_1.default;
    for (let region of worldIndices) {
        for (let index of region.indices) {
            let res = yield functions_1.queryQuote(index.ticker);
            let change = res.data["Global Quote"]["09. change"];
            let changePercent = res.data["Global Quote"]["10. change percent"];
            let value = res.data["Global Quote"]["05. price"];
            index.change = parseFloat(parseFloat(change).toFixed(2));
            index.changePercent = parseFloat(changePercent).toFixed(2) + "%";
            index.value = parseFloat(parseFloat(value).toFixed(2));
        }
    }
    res.json({ response: worldIndices });
    console.log("World indices quotes sent");
}));
exports.default = router;
