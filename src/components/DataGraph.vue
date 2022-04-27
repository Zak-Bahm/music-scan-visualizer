<template>
    <div class="bg-dark" id="graph">
        <svg>
            <g v-for="(points, index) in dataPoints" :key="index">
                <g v-if="selectedGenre === -1 || selectedGenre === index">
                    <circle v-for="pt in points" :key="pt.info.title" :r="minRad" :cx="x(pt.location.x + (limit / 2))"
                        :cy="y(pt.location.y + (limit / 2))" :data-info="JSON.stringify(pt)"
                        :style="`fill: ${genreColors[pt.genre.id]}`" @mouseover="mouseover" @mouseleave="mouseleave"
                        @click="click"></circle>
                </g>
            </g>
        </svg>
    </div>
    <div class="tooltip bg-dark pt-tooltip backdrop" ref="tooltip">
        Song Title: {{ songTitle }}
        <br />
        Artist Name: {{ artistName }}
        <br />
        Genre Name: {{ genreName }}
    </div>

    <SongPlayer :playlist="musicPlaylist" @deleteSong="i => musicPlaylist.splice(i, 1)"/>

    <div class="btn-list d-flex flex-column">
        <div class="backdrop d-flex flex-column">
            <h3>Genre Filtering:</h3>
            <div>
                <button v-for="(color, index) in genreColors" :key="color" class="btn btn-circle mx-1"
                    :class="selectedGenre === index ? 'selected' : ''" :style="{ 'background-color': color }"
                    :title="genreNames[index]" @click="selectedGenre = selectedGenre === index ? -1 : index">
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import * as d3 from "d3";
import axios from 'axios';

import { DataPoint } from "@/types/Graph";
import SongPlayer from '@/components/SongPlayer.vue';

// inject needed globals
const genreColors = inject<string[]>('genreColors');
const genreNames = inject<string[]>('genreNames');

// setup datapoints and defaults
const dataPoints = ref<Array<DataPoint[]>>([[]]);
const selectedGenre = ref(-1);
const musicPlaylist = ref<DataPoint[]>([]);

// setup tooltip values
const tooltip = ref<Element | null>(null);
const minRad = 3;
const maxRad = 15;
const songTitle = ref('');
const artistName = ref('');
const genreName = ref('');

// setup tooltip functions
const mouseover = (e: any) => {
    if (tooltip.value === null) return;

    // set values
    const dataInfo: DataPoint = JSON.parse(e.target.dataset.info);
    songTitle.value = dataInfo.info.title;
    genreName.value = dataInfo.genre.name;
    artistName.value = dataInfo.info.artist;

    d3.select(e.target).transition().duration(200).attr('r', maxRad);
    d3.select(tooltip.value)
        .style("left", (d3.pointer(e)[0] + 10) + "px")
        .style("top", (d3.pointer(e)[1]) + "px")
        .style("opacity", 1);
}

const click = (e: any) => {
    if (tooltip.value === null) return;

    // set values
    const dataInfo: DataPoint = JSON.parse(e.target.dataset.info);
    musicPlaylist.value.unshift(dataInfo);
}

const mouseleave = (e: any) => {
    if (tooltip.value === null) return;
    d3.select(e.target).transition().duration(200).attr('r', minRad);

    d3.select(tooltip.value)
        .transition().duration(200).style("opacity", 0)
}

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
    d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    await addDataPoints('../converted-data.jsonl');
}

async function addDataPoints(src: string) {
    const data = await axios.get(src);

    // add data point objects
    data.data.split('\n').forEach(async (pt: string, i: number) => {
        if (pt === '') return;

        const data = JSON.parse(pt);
        let dataArray = dataPoints.value[data.genre.id];
        if (typeof dataArray === 'undefined') dataPoints.value[data.genre.id] = [];
        dataPoints.value[data.genre.id].push(data);
    });
}

onMounted(async () => {
    await setupGraph();
})
</script>

<style>
.pt-tooltip {
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    opacity: 0;
}

.btn-list {
    position: absolute;
    bottom: 50px;
    right: 50px;
}

.song-list {
    position: absolute;
    bottom: 50px;
    left: 50px;
}
</style>
