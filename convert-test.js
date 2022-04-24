#!/usr/bin/env node
const fs = require('fs');
const testData = require('./test.json');

for (const key in testData) {
    if (Object.hasOwnProperty.call(testData, key)) {
        const dp = testData[key];

        const converted = {
            location: {
                x: dp.tsne_1,
                y: dp.tsne_2
            },
            genre: {
                id: dp.label
            },
            info: {
                id: dp.track
            }
        };

        fs.appendFileSync('converted-data.jsonl', JSON.stringify(converted) + '\n');
    }
}
