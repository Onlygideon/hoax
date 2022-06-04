const express = require("express");
const PORT = process.env.PORT || 3200;

const app = express();

app.listen(PORT, () => console.log(`Server running on server ${PORT}`));
