require('dotenv').config({path: require('path').resolve(__dirname, '.env')});

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const userRouter = require("./routes/userRoute");
const profileRouter = require("./routes/profileRoute");
const topicRouter = require("./routes/topicRoute");
const checkInRouter = require("./routes/checkInRoute");
const socialPostRouter = require("./routes/socialPostRoute");
const messageRouter = require("./routes/messageRoute");
const subscriptionRouter = require("./routes/subscriptionRoute");
const paymentRouter = require("./routes/paymentRoute");


app.use(cors());
app.use(express.json());

app.use('/users', userRouter)
app.use('/profiles', profileRouter)
app.use('/topics', topicRouter);
app.use('/check-in', checkInRouter)
app.use('/social-posts', socialPostRouter)
app.use('/messager', messageRouter)
app.use('/subscription', subscriptionRouter)
app.use('/payment', paymentRouter)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});