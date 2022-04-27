<template>
    <div class="song-list d-flex flex-column" :class="playlist.length > 0 ? 'slideInLeft' : 'off-left'" >
        <TransitionGroup name="list" tag="div">
            <div class="backdrop my-2 d-flex justify-content-between align-items-center" v-for="(song, index) in playlist"
                :key="song.info.file"
                :class="currentSong === index ? 'playing' : ''"
            >
                <button class="btn btn-circle mx-2" :title="song.genre.name"
                    :style="{ 'background-color': genreColors[song.genre.id] }">
                </button>
                <h5 class="m-0 mx-2 p-1 song-title">{{ song.info.title }}</h5>
                <div class="mx-2">
                    <a :href="filePrefix + song.info.file"
                        target="_blank" class="mx-2 link-light">
                        <fa-icon icon="external-link" size="lg" />
                    </a>
                    <a @click="$emit('deleteSong', index)" class="mx-2 link-danger">
                        <fa-icon icon="trash-can" size="lg" />
                    </a>
                </div>
            </div>
        </TransitionGroup>
        <div class="backdrop d-flex justify-content-between align-items-center icons my-2">
            <fa-icon icon="backward" size="2x" class="mx-3" @click="backward"/>
            <fa-icon v-if="playing" icon="pause" size="2x" class="mx-3" @click="pause"/>
            <fa-icon v-else icon="play" size="2x" class="mx-3" @click="play"/>
            <fa-icon icon="forward" size="2x" class="mx-3" @click="forward" />
        </div>
        <audio class="d-none" ref="player"></audio>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';
import { DataPoint } from "@/types/Graph";

// define props
interface Props {
    playlist: DataPoint[]
}
const props = defineProps<Props>();
const emit = defineEmits(['deleteSong', 'selectedSong'])

// inject needed globals
const genreColors = inject<string[]>('genreColors');
const filePrefix = inject<string>('filePrefix');

// setup player functions
const playing = ref(false);
const currentSong = ref(-1);
const player = ref<HTMLAudioElement | null>(null);

function pause() {
    if (player.value === null) return;
    player.value.pause();
    playing.value = false;
}
function play(change = false) {
    if (player.value === null) return;

    // selected song
    let songInfo = props.playlist[currentSong.value];

    // set source for first time
    if (currentSong.value < 0) {
        currentSong.value = 0;
        songInfo = props.playlist[currentSong.value];
        player.value.src = filePrefix + songInfo.info.file;
    }

    // set source if changing songs
    if (change === true) {
        player.value.src = filePrefix + songInfo.info.file;
    }

    // emit new song
    emit('selectedSong', songInfo);

    player.value.play();
    playing.value = true;
}
function forward() {
    if (player.value === null) return;
    if (currentSong.value + 1 >= props.playlist.length) {
        currentSong.value = props.playlist.length - 1;
    }

    currentSong.value++;
    play(true);
}
function backward() {
    if (player.value === null) return;
    if (currentSong.value === 0) return;
    if (currentSong.value + 1 >= props.playlist.length) {
        currentSong.value = props.playlist.length - 1;
    }

    currentSong.value--;
    play(true);
}
</script>

<style>
    .song-title {
        color: rgb(107 119 131);
    }
    div.playing {
        box-shadow: rgb(210, 233, 255) 3px 3px 0px;
    }
    div.playing .song-title {
        color: rgb(210, 233, 255);
    }

    .list-enter-active,
    .list-leave-active {
        transition: all 0.5s ease;
    }
    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateX(-500px);
    }
</style>
