<template>
    <div class="bg-dark" id="graph">
        <svg>
            <g v-for="(name, index) in genreNames" :key="index" :id="name"
                :class="selectedGenre != -1 && selectedGenre != index ? 'd-none' : ''"
            >
                <g :id="name + 'FirstDev'"></g>
                <g :id="name + 'SecondDev'" :class="standardDev >= 2 ? '' : 'd-none'"></g>
                <g :id="name + 'ThirdDev'" :class="standardDev >= 3 ? '' : 'd-none'"></g>
            </g>
        </svg>
    </div>
    <!-- hover tooltip -->
    <div class="tooltip bg-dark pt-tooltip backdrop" ref="hoverTooltip">
        Song Title: {{ hoverInfo.songTitle }}
        <br />
        Artist Name: {{ hoverInfo.artistName }}
        <br />
        Genre Name: {{ hoverInfo.genreName }}
    </div>
    <!-- song tooltip -->
    <div class="tooltip bg-dark pt-tooltip backdrop" ref="songTooltip">
        Song Title: {{ songInfo.songTitle }}
        <br />
        Artist Name: {{ songInfo.artistName }}
        <br />
        Genre Name: {{ songInfo.genreName }}
    </div>

    <SongPlayer
        :playlist="musicPlaylist" @deleteSong="i => musicPlaylist.splice(i, 1)"
        @selectedSong="i => showSongInfo(i)"
    />

    <ActionList
        :selectedGenre="selectedGenre" @changeGenre="i => selectedGenre = i"
        :standardDev="standardDev" @changeDev="i => standardDev = i"
    />
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import * as d3 from "d3";
import axios from 'axios';

import { DataPoint, Tooltip } from "@/types/Graph";
import SongPlayer from '@/components/SongPlayer.vue';
import ActionList from "@/components/ActionList.vue";

// inject needed globals
const genreColors = inject<string[]>('genreColors');
const genreNames = inject<string[]>('genreNames');

// setup datapoints and defaults
const selectedGenre = ref(-1);
const musicPlaylist = ref<DataPoint[]>([]);
const standardDev = ref(3);

// setup tooltip values
const minRad = 3;
const maxRad = 15;
const hoverTooltip = ref<Element | null>(null);
const hoverInfo = ref<Tooltip>({
    songTitle: '',
    artistName: '',
    genreName: ''
});
const songTooltip = ref<Element | null>(null);
const prevSongId = ref('');
const songInfo = ref<Tooltip>({
    songTitle: '',
    artistName: '',
    genreName: ''
});

// setup tooltip functions
const mouseover = (e: any) => {
    if (hoverTooltip.value === null) return;

    // set values
    const dataInfo: DataPoint = JSON.parse(e.target.dataset.info);
    hoverInfo.value.songTitle = dataInfo.info.title;
    hoverInfo.value.genreName = dataInfo.genre.name;
    hoverInfo.value.artistName = dataInfo.info.artist;

    d3.select(e.target).transition().duration(200).attr('r', maxRad);
    d3.select(hoverTooltip.value)
        .style("left", (d3.pointer(e)[0] + 10) + "px")
        .style("top", (d3.pointer(e)[1]) + "px")
        .style("opacity", 1);
}

const click = (e: any) => {
    if (hoverTooltip.value === null) return;

    // set values
    const dataInfo: DataPoint = JSON.parse(e.target.dataset.info);
    musicPlaylist.value.push(dataInfo);
}

const mouseleave = (e: any) => {
    if (hoverTooltip.value === null) return;
    d3.select(e.target).transition().duration(200).attr('r', minRad);

    d3.select(hoverTooltip.value)
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
const idHash = (d: DataPoint) => btoa(encodeURIComponent(d.info.title + d.info.artist)).replace(/=/g, '');

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

        const data: DataPoint = JSON.parse(pt);

        // determine proper group to place pt in
        let selectStr = '#' + data.genre.name;
        const maxDev = Math.max(
            Math.abs(data.location.xDev),
            Math.abs(data.location.yDev)
        );
        let devStr = selectStr + 'FirstDev';
        if (maxDev > 1) devStr = selectStr + 'SecondDev';
        if (maxDev > 2) devStr = selectStr + 'ThirdDev';
        selectStr += ' ' + devStr;

        // add data point using d3
        d3.select(selectStr)
            .append("circle").attr("r", minRad)
            .attr("cx", x(data.location.x + (limit / 2)))
            .attr("cy", y(data.location.y + (limit / 2)))
            .attr("id", idHash(data))
            .attr("data-info", JSON.stringify(data)).style("fill", genreColors[data.genre.id])
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .on("click", click);
    });
}

function showSongInfo(info: DataPoint) {
    if (songTooltip.value === null) return;

    // reset point radius
    if (prevSongId.value !== '') {
        d3.select('#' + prevSongId.value).transition().duration(200).attr('r', minRad);
    }

    // set values
    songInfo.value.songTitle = info.info.title;
    songInfo.value.genreName = info.genre.name;
    songInfo.value.artistName = info.info.artist;

    prevSongId.value = idHash(info);
    d3.select('#' + idHash(info)).transition().duration(200).attr('r', maxRad);
    d3.select(songTooltip.value)
        .style("left", (x(info.location.x + (limit / 2)) + 10) + "px")
        .style("top", (y(info.location.y + (limit / 2))) + "px")
        .style("opacity", 1);
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
