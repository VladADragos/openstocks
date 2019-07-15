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
const queryQuote = (ticker = "1") => __awaiter(this, void 0, void 0, function* () {
    let response = yield axios_1.default({
        url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${ticker}`,
        headers: {
            'X-CMC_PRO_API_KEY': keys_1.coinMarket
        }
    });
    return response;
});
const router = express_1.default.Router();
router.get("/", (req, res) => {
    console.log("Forex endpoint requested");
    res.json({ response: "Forex endpoint hit" });
});
router.post("/", (req, res) => {
    console.log("Forex endpoint requested");
    res.json({ response: "Forex endpoint hit" });
});
router.post("/quote", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("Crypto quote requested");
    let response = yield queryQuote(req.body.ticker);
    let data = Object.values(response.data.data);
    let quotes = [];
    for (let values of data) {
        let ticker = values.symbol + "/USD";
        let price = parseFloat(values.quote.USD.price.toFixed(4));
        let change = parseFloat((values.quote.USD.price * (values.quote.USD.percent_change_1h / 100)).toFixed(4));
        let changePercent = (values.quote.USD.percent_change_1h).toFixed(4) + "%";
        let quote = { ticker, price, change, changePercent };
        quotes.push(quote);
    }
    // let price: number = parseFloat(data.quote.USD.price.toFixed(4));
    // let change: number = parseFloat((data.quote.USD.price * (data.quote.USD.percent_change_1h / 100)).toFixed(4));
    // let changePercent: string = (data.quote.USD.percent_change_1h).toFixed(4) + "%";
    // let quote: Quote = { ticker, price, change, changePercent }
    res.json({ response: quotes });
    console.log("Stock quote sent");
}));
exports.default = router;
