<template>
    <div class="bg-dark" id="graph"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import axios from 'axios';

interface Loc {
    x: number,
    y: number
}
interface DataPoint {
    location: Loc,
    genre: {
        id: number
    },
    info: {
        id: number
    }
}

const genreColors = [
    'rgb(153, 213, 201)',
    'rgb(108, 150, 157)',
    'rgb(239, 234, 90)',
    'rgb(242, 158, 76)',
    'rgb(82, 73, 72)',
    'rgb(135, 103, 123)'
]

async function setupGraph() {
    // set the dimensions and margins of the graph
    const width = window.innerWidth;
    const height = window.innerHeight;

    // append the svg object to the body of the page
    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    await addDataPoints(svg, '../converted-data.jsonl');
}

async function addDataPoints(svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, src: string) {
    const data = await axios.get(src);

    // get data point objects
    const points = data.data.split('\n').filter((s: string) => s !== '').map((s: string) => JSON.parse(s));
    for (let i = 0; i < points.length; i++) {
        const pt: DataPoint = points[i];
        const loc = parseLocation(pt.location);

        svg.append("circle")
            .attr("cx", loc.x).attr("cy", loc.y).attr("r", 5)
            .attr("title", pt.info.id).style("fill", genreColors[pt.genre.id]);
    }
}

function parseLocation(loc: Loc): Loc  {
    // set the dimensions and margins of the view
    const width = window.innerWidth;
    const height = window.innerHeight;
    const limit = 200;

    // determine spread multiplier
    const xm = width / limit;
    const ym = height / limit;

    const absLoc = {
        x: loc.x + limit/2,
        y: loc.y + limit/2
    }

    const spreadLoc = {
        x: absLoc.x * xm,
        y: absLoc.y * ym
    }

    return spreadLoc;
}

onMounted(async () => {
    await setupGraph();
})
</script>
