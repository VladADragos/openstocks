import express, {
  Application,
  Request,
  Response,
  NextFunction,
  Router
} from "express";
import axios from "axios";
import { coinMarket, alphaVantage } from "../keys";
import { type } from "os";
import { Stock, StockData, Quote } from "../utilities/interfaces";
import { queryQuote, getExtremeValue } from "../utilities/functions";
import wi from "../utilities/worldIndices";
const router: Router = express.Router();

const queryHistoricalData = async (
  ticker: string,
  period: number,
  time: string
): Promise<Array<StockData>> => {
  let data: Array<StockData> = [];
  let outputsize: string = period > 100 ? "compact" : "full";

  let response: any = await axios({
    url: `https://www.alphavantage.co/query?function=${time}&symbol=${ticker}&outputsize=${outputsize}&apikey=${alphaVantage}`
  });
  let timeSeries: any = response.data["Time Series (Daily)"];
  let values: any = Object.values(timeSeries);
  let keys: Array<string> = Object.keys(timeSeries);

  for (let i: number = period - 1; i >= 0; i--) {
    data.push({ date: keys[i], price: parseFloat(values[i]["4. close"]) });
  }
  return data;
};

router.post("/", (req: Request, res: Response) => {
  console.log("stock endpoint requested");
  res.json({ response: "Stock endpoint hit" });
});

router.post("/quote", async (req: Request, res: Response) => {
  console.log("Stock quote requested");
  let tickers: Array<string> = req.body.tickers;
  console.log(req.body);
  let quotes: Array<Quote> = [];

  for (let ticker of tickers) {
    let response: any = await queryQuote(ticker);

    let data: any = response.data["Global Quote"];
    let price: number = parseFloat(data["05. price"]);
    let change: number = parseFloat(data["09. change"]);
    let changePercent: string = data["10. change percent"];
    let quote: Quote = { ticker, price, change, changePercent };

    quotes.push(quote);
  }

  res.json({ response: quotes });
  console.log("Stock quote sent");
});

router.post("/historical-data", async (req: Request, res: Response) => {
  console.log("historical data requested");

  let ticker: string = req.body.ticker;
  let period: number = req.body.period;
  let time: string = req.body.time;

  let data: Array<StockData> = await queryHistoricalData(ticker, period, time);
  let lowestValue: number = getExtremeValue(data, 0);
  let highestValue: number = getExtremeValue(data, 1);
  let index: Stock = {
    data,
    highestValue,
    lowestValue
  };
  console.log();
  res.json({ response: index });
  console.log("Historical data sent");
});

router.post("/world-indices-quote", async (req: Request, res: Response) => {
  console.log("World indices quotes requested");
  const worldIndices = wi;

  for (let region of worldIndices) {
    for (let index of region.indices) {
      let res = await queryQuote(index.ticker);
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
});

export default router;
