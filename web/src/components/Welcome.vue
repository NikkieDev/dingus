<script setup>
import { ref } from 'vue'
import axios from 'axios'

const connectDisc = () => location.href = "https://discord.com/api/oauth2/authorize?client_id=984840045267664946&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fdiscord&response_type=token&scope=identify%20email";
const account = localStorage.getItem('id');
let gifts = ref(undefined);
let tokens = ref(undefined);

async function checkAccount() {
    axios.post('http://localhost:3005/fetch_user', {id: account})
    .then(res => {
        const response = JSON.stringify(res);
        const data = JSON.parse(response).data._rel;
        console.log(data);

        document.getElementById('gifts').innerHTML = data.gifts;
        document.getElementById('tokens').innerHTML = data.tokens;
        document.getElementById('username').innerHTML = data.username;
    });
}
</script>

<template>
    <div class="flex flex-col justify-center items-center">
        <div id="buttons" class="flex flex-col justify-center items-center gap-8">
            <v-container>
                <v-container class="flex flex-col justify-center">
                    <v-text id="username"></v-text>
                    <v-container class="flex flex-row gap-8">
                        <v-text>tokens: <v-span id="tokens"></v-span></v-text>
                        <v-text>gifts: <v-span id="gifts"></v-span></v-text>
                    </v-container>
                </v-container>
                <v-container @load="async () => await checkAccount()">
                    <button v-if="!account" class="bg-blue-600 py-2 px-4 rounded shadow" @click="connectDisc()">Connect discord</button>
                    <button></button>
                </v-container>
            </v-container>
        </div>
    </div>
</template>