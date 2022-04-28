<template>
    <div class="btn-list d-flex flex-column">
        <Transition>
            <div class="backdrop my-2 d-flex justify-content-between align-items-center" v-if="updateExists">
                <h5 class="m-0">Update Available: </h5>
                <button
                    class="btn btn-success update-btn ms-2"
                    @click="refreshApp()"
                >
                    <fa-icon icon="cloud-arrow-down" size="1x"/>
                </button>
            </div>
        </Transition>
        <div class="backdrop my-2">
            <h3>Clustering View:</h3>
            <div class="btn-group d-flex dev-btns" role="group" aria-label="Clustering View Selection">
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
                :class="selectedGenres.indexOf(index) != -1 ? 'selected' : ''"
                @click="$emit('toggleGenre', index)"
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
    selectedGenres: number[],
    standardDev: number
}
const props = defineProps<Props>();
const emit = defineEmits(['toggleGenre', 'changeDev'])

// inject needed globals
const genreColors = inject<string[]>('genreColors');
const genreNames = inject<string[]>('genreNames');

// setup update refs
const refreshing = ref(false);
const registration = ref();
const updateExists = ref(false);

// setup functions

// Listen for our custom event from the SW registration
document.addEventListener('swUpdated', updateAvailable, { once: true })

// Prevent multiple refreshes
navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing.value) return
    refreshing.value = true
    // Here the actual reload of the page occurs
    window.location.reload()
});

// Store the SW registration so we can send it a message
// We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
// To alert the user there is an update they need to refresh for
function updateAvailable(event: any) {
    registration.value = event.detail
    updateExists.value = true
}

// Called when the user accepts the update
function refreshApp() {
    updateExists.value = false
    // Make sure we only send a 'skip waiting' message if the SW is waiting
    if (!registration.value || !registration.value.waiting) return
    // send message to SW to skip the waiting and activate the new SW
    registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
}
</script>

<style>
    .dev-btns button {
        border-radius: 15px;
    }
    .dev-btns button.selected-dev {
        background-color: rgb(107 119 131);
    }

    button.update-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        cursor: pointer;
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
