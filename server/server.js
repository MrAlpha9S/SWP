const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const userRouter = require("./routes/userRoute");
const profileRouter = require("./routes/profileRoute");
require('dotenv').config({path: `.env`});

app.use(cors());
app.use(express.json());

app.use('/users', userRouter)
app.use('/profiles', profileRouter)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});