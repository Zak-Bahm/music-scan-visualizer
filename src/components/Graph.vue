<template>
    <div class="bg-dark" id="graph"></div>
    <div class="tooltip bg-dark pt-tooltip" ref="tooltip">
        Song Id: {{ songId }}
        <br/>
        Genre Id: {{ genreId }}
    </div>
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
    '#eed73f',
    '#f39943',
    '#f65d4e',
    '#da3361',
    '#a93583',
    '#2a3195'
]

// setup tooltip values
const tooltip = ref<Element | null>(null);
const songId = ref(0);
const genreId = ref(0);

// setup scale values
const width = window.innerWidth;
const height = window.innerHeight;
const limit = 200;

// set scale functions
const x = d3.scaleLinear()
    .domain([0, 200])
    .range([0, width]);
const y = d3.scaleLinear()
    .domain([0, 200])
    .range([0, height]);

async function setupGraph() {

    // append the svg object to the body of the page
    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    await addDataPoints(svg, '../converted-data.jsonl');
}

async function addDataPoints(svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, src: string) {
    const minRad = 3;
    const data = await axios.get(src);

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    const mouseover = (e: any) => {
        if (tooltip.value === null) return;

        // set values
        const dataInfo: DataPoint = JSON.parse(e.target.dataset.info);
        songId.value = dataInfo.info.id;
        genreId.value = dataInfo.genre.id;

        d3.select(e.target).transition().duration(200).attr('r', 15);
        d3.select(tooltip.value)
            .style("left", (d3.pointer(e)[0] + 10) + "px")
            .style("top", (d3.pointer(e)[1]) + "px")
            .style("opacity", 1);
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = (e: any) => {
        if (tooltip.value === null) return;
        d3.select(e.target).transition().duration(200).attr('r', minRad);

        d3.select(tooltip.value)
            .transition().duration(200).style("opacity", 0)
    }

    // get data point objects
    const points = data.data.split('\n').filter((s: string) => s !== '').map((s: string) => JSON.parse(s));
    for (let i = 0; i < points.length; i++) {
        const pt: DataPoint = points[i];

        svg.append("circle").attr("r", minRad)
            .attr("cx", x(pt.location.x + (limit / 2)))
            .attr("cy", y(pt.location.y + (limit / 2)))
            .attr("data-info", JSON.stringify(pt)).style("fill", genreColors[pt.genre.id])
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave);
    }
}

onMounted(async () => {
    await setupGraph();
})
</script>

<style>
.pt-tooltip {
    cursor: pointer;
    opacity: 0;
    padding: 10px;
    color: #fff;
    border-radius: 15px;
    border: 1px solid rgb(50 55 60);
    box-shadow: transparent 0 0 0 3px, rgb(50 55 60) 0 6px 20px;
}
</style>
