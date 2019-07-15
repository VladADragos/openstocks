import express, { Application, Request, Response, NextFunction, Router } from "express";
import { coinMarket } from "../keys";
import { Quote } from "../utilities/interfaces";
import axios from "axios";

const queryQuote = async (ticker: string = "1") => {
    let response: any = await axios({
        url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${ticker}`,
        headers: {
            'X-CMC_PRO_API_KEY': coinMarket
        }
    });
    return response;
}

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
    console.log("Forex endpoint requested");
    res.json({ response: "Forex endpoint hit" });

});

router.post("/", (req: Request, res: Response) => {
    console.log("Forex endpoint requested");
    res.json({ response: "Forex endpoint hit" });

});

router.post("/quote", async (req: Request, res: Response) => {
    console.log("Crypto quote requested");



    let response: any = await queryQuote(req.body.ticker);

    let data: any = Object.values(response.data.data);
    let quotes: Array<Quote> = [];
    for (let values of data) {
        let ticker: string = values.symbol + "/USD";
        let price: number = parseFloat(values.quote.USD.price.toFixed(4));
        let change: number = parseFloat((values.quote.USD.price * (values.quote.USD.percent_change_1h / 100)).toFixed(4));


        let changePercent: string = (values.quote.USD.percent_change_1h).toFixed(4) + "%";
        let quote: Quote = { ticker, price, change, changePercent };

        quotes.push(quote);


    }
    // let price: number = parseFloat(data.quote.USD.price.toFixed(4));


    // let change: number = parseFloat((data.quote.USD.price * (data.quote.USD.percent_change_1h / 100)).toFixed(4));


    // let changePercent: string = (data.quote.USD.percent_change_1h).toFixed(4) + "%";
    // let quote: Quote = { ticker, price, change, changePercent }


    res.json({ response: quotes });
    console.log("Stock quote sent")
});

export default router;