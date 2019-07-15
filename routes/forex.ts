import express, { Application, Request, Response, NextFunction, Router } from "express";
import { alphaVantage } from "../keys";
import { Quote } from "../utilities/interfaces";
import axios from "axios";

const queryQuote = async (from: string = "USD", to: string = "EUR") => {
    let response: any = await axios({
        url: `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${from}&to_symbol=${to}&interval=5min&apikey=${alphaVantage}`
    });

    return response;
}
const generateQuote = async (response: any, ticker: string): Promise<Quote> => {
    let timeSeries: any = Object.values(response.data["Time Series FX (5min)"]);
    let data: any = timeSeries.splice(0, 2);
    let firstValue: number = parseFloat(data[0]["4. close"]);
    let secondValue: number = parseFloat(data[1]["4. close"]);

    console.log(ticker);
    let price: number = parseFloat(firstValue.toFixed(4));
    let change: number = parseFloat((firstValue - secondValue).toFixed(4));
    let changePercent: string = (((firstValue / secondValue) - 1) * 100).toFixed(4) + "%";

    let quote: Quote = { ticker, price, change, changePercent }

    return quote;
}

const router: Router = express.Router();


router.post("/", (req: Request, res: Response) => {
    console.log("Forex endpoint requested");
    res.json({ response: "Forex endpoint hit" });

});


router.post("/quote", async (req: Request, res: Response) => {
    console.log("Stock quote requested");
    let pairs: Array<string> = req.body.pairs.split(",");



    let from: Array<string> = [];
    let to: Array<string> = [];

    for (let i: number = 0; i < pairs.length; i++) {
        let splittedPairs: Array<string> = pairs[i].split("/");
        from.push(splittedPairs[0]);
        to.push(splittedPairs[1]);
    }

    let quotes: Array<Quote> = [];

    for (let i: number = 0; i < pairs.length; i++) {
        let response: any = await queryQuote(from[i], to[i]);
        let quote: Quote = await generateQuote(response, pairs[i]);
        quotes.push(quote);
    }



    res.json({ reponse: quotes });
    console.log("Stock quote sent")
});


router.post("/quote/5", async (req: Request, res: Response) => {
    if (req.body.pairs.length !== 39) {
        res.status(400).json({ error: "Requires exact 5 pairs" });
    } else {

        console.log("Stock quote requested");
        let pairs: Array<string> = req.body.pairs.split(",");



        let from: Array<string> = [];
        let to: Array<string> = [];

        for (let i: number = 0; i < pairs.length; i++) {
            let splittedPairs: Array<string> = pairs[i].split("/");
            from.push(splittedPairs[0]);
            to.push(splittedPairs[1]);
        }

        let quotes: Array<Quote> = [
            await generateQuote(await queryQuote(from[0], to[0]), pairs[0]),
            await generateQuote(await queryQuote(from[1], to[1]), pairs[1]),
            await generateQuote(await queryQuote(from[2], to[2]), pairs[2]),
            await generateQuote(await queryQuote(from[3], to[3]), pairs[3]),
            await generateQuote(await queryQuote(from[4], to[4]), pairs[4]),


        ];


        res.json({ response: quotes });

    }
});



export default router;