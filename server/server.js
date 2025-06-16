require('dotenv').config({path: `.env`});
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const userRouter = require("./routes/userRoute");
const profileRouter = require("./routes/profileRoute");
const checkInRouter = require("./routes/checkInRoute");
const socialPostRouter = require("./routes/socialPostRoute");


app.use(cors());
app.use(express.json());

app.use('/users', userRouter)
app.use('/profiles', profileRouter)
app.use('/check-in', checkInRouter)
app.use('/social-posts', socialPostRouter)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});