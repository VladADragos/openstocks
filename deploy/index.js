"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const stocks_1 = __importDefault(require("./routes/stocks"));
const forex_1 = __importDefault(require("./routes/forex"));
const crypto_1 = __importDefault(require("./routes/crypto"));
const sector_1 = __importDefault(require("./routes/sector"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use("/stocks", stocks_1.default);
app.use("/forex", forex_1.default);
app.use("/crypto", crypto_1.default);
app.use("/sector", sector_1.default);
const port = process.env.PORT || 5002;
app.listen(port, () => console.log(`Server started on port ${port}`));
