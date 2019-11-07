const e = require("express")
const axios = require("axios");

const app = e();
app.get("/get", async (req, res) => {
    const url = req.query.url;
    const urlres = await axios.get(url);
    const body = urlres.data;
    res.header("Access-Control-Allow-Origin", "*");
    res.json({
        contents: body,
    });
});

app.listen(process.env.PORT || 8888);