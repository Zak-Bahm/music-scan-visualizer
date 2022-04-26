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

    <div class="song-list d-flex flex-column">
        <div class="backdrop my-1 d-flex justify-content-between align-items-center"
            v-for="(song, index) in musicPlaylist" :key="song.info.file">
            <button class="btn btn-circle mx-1" :title="song.genre.name"
                :style="{ 'background-color': genreColors[song.genre.id] }">
            </button>
            <h5 class="m-0 mx-1 p-1">{{ song.info.title }}</h5>
            <a :href="'https://files.freemusicarchive.org/storage-freemusicarchive-org/' + song.info.file"
                target="_blank" class="mx-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-link-45deg"
                    viewBox="0 0 16 16">
                    <path
                        d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                    <path
                        d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                </svg>
            </a>
            <a @click="musicPlaylist.splice(index, 1)" class="mx-1 delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash-fill"
                    viewBox="0 0 16 16">
                    <path
                        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                </svg>
            </a>
        </div>
    </div>

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
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import axios from 'axios';

interface Loc {
    x: number,
    y: number,
    xDev: number,
    yDev: number
}
interface DataPoint {
    location: Loc,
    genre: {
        id: number,
        name: string
    },
    info: {
        artist: string,
        title: string,
        file: string
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

const genreNames = [
    'Electronic',
    'Rock',
    'Instrumental',
    'Folk',
    'Pop',
    'Hip Hop'
]

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

.backdrop {
    padding: 10px;
    color: #fff;
    border-radius: 15px;
    border: 1px solid rgb(50 55 60);
    box-shadow: transparent 0 0 0 3px, rgb(50 55 60) 0 6px 20px;
    background-color: #212529;
}

.btn-list {
    position: absolute;
    bottom: 50px;
    right: 50px;
}

.btn.btn-circle {
    width: 30px;
    height: 30px;
    padding: 6px 0px;
    border-radius: 15px;
    border: none;
    text-align: center;
    font-size: 12px;
    line-height: 1.42857;
}

.btn.btn-circle.selected {
    border: 3px solid #fff;
}

.song-list {
    position: absolute;
    bottom: 50px;
    left: 50px;
}

.delete {
    color: #d11047;
    cursor: pointer;
}
</style>
