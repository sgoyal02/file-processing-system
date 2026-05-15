const jsonServer= require('json-server');
const app= jsonServer.create();
const api= jsonServer.router("db.json");
const middleware= jsonServer.defaults();

const PORT= process.env.PORT||4000;
app.use(middleware);
app.use(api);
app.listen(PORT,"0.0.0.0", ()=>{
    console.log("json server running on: ", PORT);
})
