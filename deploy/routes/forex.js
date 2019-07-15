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
const keys_1 = require("../keys");
const axios_1 = __importDefault(require("axios"));
const queryQuote = (from = "USD", to = "EUR") => __awaiter(this, void 0, void 0, function* () {
    let response = yield axios_1.default({
        url: `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${from}&to_symbol=${to}&interval=5min&apikey=${keys_1.alphaVantage}`
    });
    return response;
});
const generateQuote = (response, ticker) => __awaiter(this, void 0, void 0, function* () {
    let timeSeries = Object.values(response.data["Time Series FX (5min)"]);
    let data = timeSeries.splice(0, 2);
    let firstValue = parseFloat(data[0]["4. close"]);
    let secondValue = parseFloat(data[1]["4. close"]);
    console.log(ticker);
    let price = parseFloat(firstValue.toFixed(4));
    let change = parseFloat((firstValue - secondValue).toFixed(4));
    let changePercent = (((firstValue / secondValue) - 1) * 100).toFixed(4) + "%";
    let quote = { ticker, price, change, changePercent };
    return quote;
});
const router = express_1.default.Router();
router.post("/", (req, res) => {
    console.log("Forex endpoint requested");
    res.json({ response: "Forex endpoint hit" });
});
router.post("/quote", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("Stock quote requested");
    let pairs = req.body.pairs.split(",");
    let from = [];
    let to = [];
    for (let i = 0; i < pairs.length; i++) {
        let splittedPairs = pairs[i].split("/");
        from.push(splittedPairs[0]);
        to.push(splittedPairs[1]);
    }
    let quotes = [];
    for (let i = 0; i < pairs.length; i++) {
        let response = yield queryQuote(from[i], to[i]);
        let quote = yield generateQuote(response, pairs[i]);
        quotes.push(quote);
    }
    res.json({ reponse: quotes });
    console.log("Stock quote sent");
}));
router.post("/quote/5", (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (req.body.pairs.length !== 39) {
        res.status(400).json({ error: "Requires exact 5 pairs" });
    }
    else {
        console.log("Stock quote requested");
        let pairs = req.body.pairs.split(",");
        let from = [];
        let to = [];
        for (let i = 0; i < pairs.length; i++) {
            let splittedPairs = pairs[i].split("/");
            from.push(splittedPairs[0]);
            to.push(splittedPairs[1]);
        }
        let quotes = [
            yield generateQuote(yield queryQuote(from[0], to[0]), pairs[0]),
            yield generateQuote(yield queryQuote(from[1], to[1]), pairs[1]),
            yield generateQuote(yield queryQuote(from[2], to[2]), pairs[2]),
            yield generateQuote(yield queryQuote(from[3], to[3]), pairs[3]),
            yield generateQuote(yield queryQuote(from[4], to[4]), pairs[4]),
        ];
        res.json({ response: quotes });
    }
}));
exports.default = router;
