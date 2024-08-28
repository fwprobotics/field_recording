import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 3017;

app.use(cors());

app.get('/runs', (req, res) => {
    var runs = []
    fs.readdirSync('./public/runs').forEach((file, i) => {
        var time = file.split('_')[1].split('.')[0];
        runs.push({
            id: i,
            path: "/runs/" + file,
            timestamp: new Date(time.split('-').slice(0, 3).join('-') + ' ' + time.split('-').slice(3).join(':')).getTime(),
            labels: [],
            opMode: file.split('_')[0],

        });
    })
    res.send(runs);
    })


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    })
