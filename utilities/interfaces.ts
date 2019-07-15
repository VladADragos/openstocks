interface StockData {
    date: string,
    price: number
}
interface Stock {
    data: Array<StockData>,
    highestValue: number,
    lowestValue: number
}

interface Quote {
    ticker: string,
    price: number,
    change: number,
    changePercent: string
}

enum Value {
    lowest = 0,
    highest = 1,
}


export { Stock, StockData, Quote, Value };