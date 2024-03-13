const express = require('express');
const cors = require('cors');
const app = express();
require('./conn/conn');
const errorHandle = require('./utils/error_util');
const route = require('./router/route');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(errorHandle);

app.use("/api", route);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found, kindly Re-Check api End point' });
});

app.listen(port, () => {
  console.log(`server listening at ${port}`);
})


