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

const router: Router = express.Router();

const url: string = `https://www.alphavantage.co/query?function=SECTOR&apikey=${alphaVantage}`;

router.post("/", (req: Request, res: Response) => {
  console.log("Sector endpoint requested");
  res.json({ response: "Sector endpoint hit" });
});

interface sectorQuote {
  sectorName: string;
  changePercent: number;
}

router.post("/quote", async (req: Request, res: Response) => {
  console.log("Sector quote requested");

  let response: any = await axios({ url });

  let ranka: any = response.data["Rank A: Real-Time Performance"];
  let entries: Array<Array<string>> = Object.entries(ranka);
  let firstFive: Array<Array<string>> = entries.slice(0, 5);
  let sectorQuotes: Array<sectorQuote> = [];

  firstFive.forEach(element => {
    let sectorQuote: sectorQuote = {
      sectorName: element[0],
      changePercent: parseFloat(element[1])
    };
    sectorQuotes.push(sectorQuote);
  });

  res.json({ response: sectorQuotes });
});

router.post("/quote-top-5", async (req: Request, res: Response) => {
  console.log("Sector quote requested");

  let response: any = await axios({ url });

  let ranka: any = response.data["Rank A: Real-Time Performance"];
  let entries: Array<Array<string>> = Object.entries(ranka);
  let firstFive: Array<Array<string>> = entries.slice(0, 5);
  let sectorQuotes: Array<sectorQuote> = [];

  firstFive.forEach(element => {
    let sectorQuote: sectorQuote = {
      sectorName: element[0],
      changePercent: parseFloat(element[1])
    };
    sectorQuotes.push(sectorQuote);
  });

  res.json({ response: sectorQuotes });
});

router.post("/historical-data", async (req: Request, res: Response) => {
  console.log("Sector quote requested");

  let response: any = await axios({ url });
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
});

export default router;
