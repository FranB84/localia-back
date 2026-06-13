import path from "node:path";
import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import morgan from "morgan";

const app: Application = express();

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	morgan("dev", {
		skip: () => process.env.NODE_ENV === "test",
	}),
);

app.use(express.static(path.join(__dirname, "..", "public")));

export default app;
