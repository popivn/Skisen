import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('src/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const allowedOrigins = process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : ["http://localhost:5173"];

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_ORIGIN || "http://localhost:5173");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


// ✅ Xử lý preflight requests (OPTIONS)
app.options("*", cors());

app.use(routes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
