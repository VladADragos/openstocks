interface Index {
  name: string;
  ticker: string;
  value: number;
  change: number;
  changePercent: string;
}

interface Indices {
  region: string;
  indices: Array<Index>;
}

let worldIndices: Array<Indices> = [
  {
    region: "North America",
    indices: [
      {
        name: "S&P 500",
        ticker: "^GSPC",
        value: 0,
        change: 0,
        changePercent: ""
      },
      {
        name: "Dow Jones 30",
        ticker: "^DJI",
        value: 0,
        change: 0,
        changePercent: ""
      },
      {
        name: "NYSE Composite",
        ticker: "^NYA",
        value: 0,
        change: 0,
        changePercent: ""
      }
    ]
  },
  {
    region: "South America",
    indices: [
      {
        name: "Bovespa",
        ticker: "^BVSP",
        value: 0,
        change: 0,
        changePercent: ""
      },
      {
        name: "S&P Merval ",
        ticker: "^MERV",
        value: 0,
        change: 0,
        changePercent: ""
      },
      {
        name: "S&P/BMV IPC",
        ticker: "^MXX",
        value: 0,
        change: 0,
        changePercent: ""
      },
      {
        name: "S&P CLX IPSA",
        ticker: "S&P/CLX",
        value: 0,
        change: 0,
        changePercent: ""
      }
    ]
  },
  {
    region: "Asia",
    indices: [
      {
        name: "Nikkei 225",
        ticker: "^N225",
        value: 0,
        change: 0,
        changePercent: ""
      },
      {
        name: "IDX Composite",
        ticker: "^JKSE",
        value: 0,
        change: 0,
        changePercent: ""
      },
      {
        name: "Hang Seng",
        ticker: "^HSI",
        value: 0,
        change: 0,
        changePercent: ""
      },
      { name: "KOSPI", ticker: "^KS11", value: 0, change: 0, changePercent: "" }
    ]
  },
  {
    region: "Europe",
    indices: [
      {
        name: "Euronext 100",
        ticker: "^N100",
        value: 0,
        change: 0,
        changePercent: ""
      },
      {
        name: "CAC 40",
        ticker: "^FCHI",
        value: 0,
        change: 0,
        changePercent: ""
      },
      {
        name: "BEL 20",
        ticker: "^BFX",
        value: 0,
        change: 0,
        changePercent: ""
      },
      {
        name: "DAX",
        ticker: "^GDAXI",
        value: 0,
        change: 0,
        changePercent: ""
      }
    ]
  }
];

export default worldIndices;
