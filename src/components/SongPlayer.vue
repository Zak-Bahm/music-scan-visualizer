<template>
    <div class="song-list d-flex flex-column">
        <div class="backdrop my-1 d-flex justify-content-between align-items-center" v-for="(song, index) in playlist"
            :key="song.info.file">
            <button class="btn btn-circle mx-1" :title="song.genre.name"
                :style="{ 'background-color': genreColors[song.genre.id] }">
            </button>
            <h5 class="m-0 mx-1 p-1">{{ song.info.title }}</h5>
            <a :href="'https://files.freemusicarchive.org/storage-freemusicarchive-org/' + song.info.file"
                target="_blank" class="mx-1 link-light">
                <fa-icon icon="external-link" size="lg" />
            </a>
            <a @click="$emit('deleteSong', index)" class="mx-1 link-danger">
                <fa-icon icon="trash-can" size="lg" />
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { DataPoint } from "@/types/Graph";

// define props
interface Props {
    playlist: DataPoint[]
}
const props = defineProps<Props>();

// inject needed globals
const genreColors = inject<string[]>('genreColors');
const genreNames = inject<string[]>('genreNames');

// setup ref to mutate

</script>
