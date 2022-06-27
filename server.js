const express = require("express");
const colors = require("colors");
const cors = require("cors");
const fs = require("fs");

const productRouter = require("./routes/productRoutes.js");
const ratingRouter = require("./routes/ratingRoutes.js");
const commentRouter = require("./routes/commentRoutes.js");

const PORT = process.env.PORT || 3200;

const app = express();

let corsOptions = {
  origin: "https://localhost:4000",
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// routes
app.use("/api/products", productRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/comments", commentRouter);

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  let readStream = fs.createReadStream(
    __dirname + "/public/index.html",
    "utf-8"
  );

  readStream.pipe(res);
});

// server
const server = app.listen(PORT, () =>
  console.log(`Server running on server ${PORT}`.blue.bold)
);

// Handle unhandled promise rejectiions
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  // Close server & exit process (i.e app to fail)
  server.close(() => process.exit(1));
});
