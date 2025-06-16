require('dotenv').config({path: `.env`});
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const userRouter = require("./routes/userRoute");
const profileRouter = require("./routes/profileRoute");
const topicRouter = require("./routes/topicRoute");
const checkInRouter = require("./routes/checkInRoute");


app.use(cors());
app.use(express.json());

app.use('/users', userRouter)
app.use('/profiles', profileRouter)
app.use('/topics', topicRouter);
app.use('/check-in', checkInRouter)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});