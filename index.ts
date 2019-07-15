import express, { Application } from "express";
import bodyParser from "body-parser";
import stocks from "./routes/stocks";
import forex from "./routes/forex";
import crypto from "./routes/crypto";
import sector from "./routes/sector";

const app: Application = express();
app.use(bodyParser.json());

app.use("/stocks", stocks);
app.use("/forex", forex);
app.use("/crypto", crypto);
app.use("/sector", sector);

const port = process.env.PORT || 5002;
app.listen(port, () => console.log(`Server started on port ${port}`));
