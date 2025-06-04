const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const postSignupRouter = require("./routes/postSignupRoute");
const userRouter = require("./routes/userRoute");
const postOnboardingRouter = require("./routes/postOnboardingRoute");
require('dotenv').config({path: `.env`});

app.use(cors());
app.use(express.json());

app.use('/postSignup', postSignupRouter);
app.use('/users', userRouter)
app.use('/postOnboarding', postOnboardingRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});