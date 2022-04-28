<template>
    <DataGraph></DataGraph>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import DataGraph from '@/components/DataGraph.vue'

document.title = 'Music Scan Visualizer';

provide('genreColors', [
    '#bbcc33',
    '#77aadd',
    '#ee8866',
    '#44bb99',
    '#a93583',
    '#2a3195'
]);

provide('genreNames', [
    'Electronic',
    'Rock',
    'Instrumental',
    'Folk',
    'Pop',
    'Hip-Hop'
])

provide('filePrefix', 'https://files.freemusicarchive.org/storage-freemusicarchive-org/')
</script>

<style>
#body {
    height: 100%;
    background-color: #212529;
    overflow: hidden;
}

.backdrop {
    padding: 10px;
    color: #fff;
    border-radius: 15px;
    border: 1px solid rgb(50 55 60);
    box-shadow: rgb(107 119 131) 3px 3px 0px;
    background-color: #212529;
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

.icons>svg {
    cursor: pointer
}

/* animations */
.hide {
    opacity: 0;
}
.off-right {
    right: -1000px;
}
.off-left {
    left: -1000px;
}

.spin {
    animation-name: spin;
    animation-duration: 500ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.fadeOut {
    animation-name: fadeOut;
    animation-duration: 1000ms;
    animation-iteration-count: 1;
    animation-timing-function: linear;
}

@keyframes fadeOut {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.fadeIn {
    animation-name: fadeIn;
    animation-duration: 1000ms;
    animation-iteration-count: 1;
    animation-timing-function: linear;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.slideInRight {
    animation-name: slideInRight;
    animation-duration: 500ms;
    animation-iteration-count: 1;
    animation-timing-function: linear;
}

@keyframes slideInRight {
    0% {
        right: -1000px;
    }

    100% {
        right: 30px;
    }
}

.slideOutRight {
    animation-name: slideOutRight;
    animation-duration: 500ms;
    animation-iteration-count: 1;
    animation-timing-function: linear;
}

@keyframes slideOutRight {
    0% {
        right: 30px;
    }

    100% {
        right: -1000px;
    }
}

.slideInLeft {
    animation-name: slideInLeft;
    animation-duration: 500ms;
    animation-iteration-count: 1;
    animation-timing-function: linear;
}

@keyframes slideInLeft {
    0% {
        left: -1000px;
    }

    100% {
        left: 30px;
    }
}

.slideOutLeft {
    animation-name: slideOutLeft;
    animation-duration: 500ms;
    animation-iteration-count: 1;
    animation-timing-function: linear;
}

@keyframes slideOutLeft {
    0% {
        left: 30px;
    }

    100% {
        left: -1000px;
    }
}
</style>
