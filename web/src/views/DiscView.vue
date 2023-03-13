<script setup>
import axios from 'axios';

const frag = new URLSearchParams(location.hash.slice(1));
const [tok, typ] = [frag.get('access_token'), frag.get('token_type')];

if (tok && typ) {
    axios.get('https://discord.com/api/users/@me', {headers: {"authorization": `${typ} ${tok}`}})
    .then((res) => {
        const response = JSON.stringify(res);
        const data = JSON.parse(response).data;

        localStorage.setItem('id', data['id']);
        
        axios.post('http://localhost:3005/connect_discord', {id: data['id'], email: data['email']})
        .then(res => {
            location.href = '/';
        })
        .catch(err => {
            alert("Couldn't connect to discord!");
            location.href = '/';
        })
    })
    .catch(err => {
        console.log(err);
    });
}
</script>

<template>
    
</template>