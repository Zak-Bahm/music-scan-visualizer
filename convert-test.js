#!/usr/bin/env node
const fs = require('fs');
const testData = require('./test.json');

for (const key in testData) {
    if (Object.hasOwnProperty.call(testData, key)) {
        const dp = testData[key];

        // {
        //     "tsne_1": 13.2785921097,
        //     "tsne_2": -28.0624332428,
        //     "genre_id": 0,
        //     "track_id": 71089,
        //     "genre_name": "Electronic",
        //     "track_title": "Stealth Elk",
        //     "artist_name": "Bitbasic",
        //     "mean_1": -7.949991703,
        //     "mean_2": -22.8180713654,
        //     "std_1": 22.0991428567,
        //     "std_2": 23.6134650244,
        //     "z_1": 0.9606066818,
        //     "z_2": -0.2220920086
        // }

        const converted = {
            location: {
                x: dp.tsne_1,
                y: dp.tsne_2,
                xDev: dp.z_1,
                yDev: dp.z_2
            },
            genre: {
                id: parseInt(dp.genre_id),
                name: dp.genre_name
            },
            info: {
                artist: dp.artist_name,
                title: dp.track_title
            }
        };

        fs.appendFileSync('converted-data.jsonl', JSON.stringify(converted) + '\n');
    }
}
