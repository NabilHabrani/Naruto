import express from "express";
import session from "./middleware/session";
import { flashMiddleware } from "./middleware/flashMiddleware";
import { loginRouter } from "./router/loginRouter";
import { homeRouter } from "./router/homeRouter";
import { connect } from "./data";

const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session);
app.use(flashMiddleware);

app.use(loginRouter());
app.use(homeRouter());

app.listen(app.get("port"), async () => {
    try {
        await connect();
        console.log("Server started on http://localhost:" + app.get('port'));
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
});