<template>
    <DataGraph></DataGraph>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import DataGraph from '@/components/DataGraph.vue'

provide('genreColors', [
    '#eed73f',
    '#f39943',
    '#f65d4e',
    '#da3361',
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

.icons > svg {
    cursor: pointer
}
</style>
