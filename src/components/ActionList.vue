<template>
    <div class="btn-list d-flex flex-column">
        <div class="backdrop my-2">
            <h3>Standard Deviations:</h3>
            <div class="btn-group d-flex dev-btns" role="group" aria-label="Standard Deviation Selection">
                <button v-for="index in 3" :key="index"
                    :class="standardDev === index ? 'selected-dev' : ''"
                    @click="$emit('changeDev', index)"
                    type="button" class="btn btn-dark"
                >
                    {{ index }}
                </button>
            </div>
        </div>
        <div class="backdrop my-2 d-flex flex-column">
            <h3>Genre Filtering:</h3>
            <div v-for="(color, index) in genreColors" :key="color"
                class="d-flex align-items-center my-2 genre-option"
                :class="selectedGenre === index ? 'selected' : ''"
                @click="changeGenres(index)"
            >
                <button class="btn btn-circle me-4"
                    :style="{ 'background-color': color }"
                    :title="genreNames[index]">
                </button>
                <h5 class="m-0">{{ genreNames[index] }}</h5>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';

// define props
interface Props {
    selectedGenre: number,
    standardDev: number
}
const props = defineProps<Props>();
const emit = defineEmits(['changeGenre', 'changeDev'])

// inject needed globals
const genreColors = inject<string[]>('genreColors');
const genreNames = inject<string[]>('genreNames');

// setup functions
function changeGenres(index: number) {
    let newGenre = index;
    if (props.selectedGenre === index) {
        newGenre = -1;
    }

    emit('changeGenre', newGenre);
}
</script>

<style>
    .dev-btns button {
        border-radius: 15px;
    }
    .dev-btns button.selected-dev {
        background-color: rgb(107 119 131);
    }

    .genre-option {
        cursor: pointer;
        border-radius: 15px;
        color: rgb(107 119 131);
    }
    .genre-option:hover {
        color: rgb(210, 233, 255);
    }
    .genre-option.selected {
        color: rgb(210, 233, 255);
    }
    .genre-option.selected button.btn-circle {
        border: 3px solid rgb(210, 233, 255);
    }
</style>
