"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const store_1 = require("./store");
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const app = (0, app_1.createApp)(store_1.defaultDbPath);
app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map