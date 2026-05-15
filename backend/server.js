const jsonServer = require("json-server");

const app = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 4000;
app.use(middlewares);
app.use(router);

app.listen(PORT, "0.0.0.0", () => {
  console.log("json Server running on port " + PORT);
});