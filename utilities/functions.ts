import axios from "axios";
import { alphaVantage, coinMarket } from "../keys";
import { Value, StockData } from "../utilities/interfaces";

const queryQuote = async (ticker: string): Promise<any> => {
  let response: any = await axios({
    url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${alphaVantage}`
  });

  return response;
};
const getExtremeValue = (array: Array<StockData>, extreme: Value): number => {
  let value: number = <number>array[0].price;

  for (let data of array) {
    // gets lowest value
    if (extreme === 0) {
      if (data.price <= value) {
        value = data.price;
      }
    } else {
      // gets highest value
      if (data.price >= value) {
        value = data.price;
      }
    }
  }
  return value;
};

// export { queryHistoricalData, queryQuote, getExtremeValue };
export { queryQuote, getExtremeValue };
