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

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (origin.includes("ngrok-free.app") || origin.includes("localhost"))) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.options("*", cors());

app.use(routes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
