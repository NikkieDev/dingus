<template>
    <v-container class="fill-height">
        <VAppBar>
            <VAppBarTitle>Dingus</VAppBarTitle>
        </VAppBar>
        <VResponsive class="d-flex fill-height">
            <VResponsive class="d-flex">
                <div class="d-flex flex-column">
                    <div id="username-control" class="d-flex flex-row">
                        <h2 id="username">{{ user.username }}</h2>
                        <v-btn @click="logout()" color="error">Logout</v-btn> <!-- Becomes "actions" -->
                    </div>
                    <v-divider></v-divider>
                    <div id="tokenAmounts" class="d-flex flex-row">
                        <h3>Tokens: {{ user.tokens }}</h3>
                        <h3>Gifts: {{ user.gifts }}</h3>
                    </div>
                </div>
            </VResponsive>
            <div class="d-flex flex-column mt-5">
                <div class="d-flex flex-row mt-5" id="token-interactions">
                    <div class="token-upper" id="tokens">
                        <h4>Tokens</h4>
                        <div class="d-flex flex-column">
                            <v-btn color="success" @click="checkout(1)">{{ products.tokens1.name }} &euro;{{ products.tokens1.price / 100 }}</v-btn>
                            <v-btn color="success" @click="checkout(2)">{{ products.tokens2.name }} &euro;{{ products.tokens2.price / 100 }}</v-btn>
                            <v-btn color="success" @click="checkout(3)">{{ products.tokens3.name }} &euro;{{ products.tokens3.price / 100 }}</v-btn>
                        </div>
                    </div>
                    <div class="token-upper" id="gift-tokens">
                        <h4>Gift tokens</h4>
                        <div class="d-flex flex-column">
                            <v-btn color="success" @click="checkout(4)">{{ products.gifts1.name }} &euro;{{ products.gifts1.price / 100 }}</v-btn>
                            <v-btn color="success" @click="checkout(5)">{{ products.gifts2.name }} &euro;{{ products.gifts2.price / 100 }}</v-btn>
                            <v-btn color="success" @click="checkout(6)">{{ products.gifts3.name }} &euro;{{ products.gifts3.price / 100 }}</v-btn>
                        </div>
                    </div>
                </div>
                <div class="d-flex align-start flex-column mt-5">
                    <v-card>
                        <VCardTitle>Premium</VCardTitle>
                        <v-card-text>
                            Tired of having to buy tokens everytime? Buy premium for unlimited tokens!
                        </v-card-text>
                        <VCardActions class="text-center">
                            <v-btn v-if="!premiumUser" color="primary" class="flex-grow-1">Buy {{ products.unlim.name }} &euro;{{ products.unlim.price / 100 }}</v-btn>
                            <v-btn v-else color="primary" class="flex-grow-1" disabled>activated</v-btn>
                        </VCardActions>
                        <VCardSubtitle class="d-flex justify-start align-start flex-column">
                            <p>Features include:</p>
                            <ul>
                                <li>Unlimited tokens</li>
                                <li>A significant other <span v-if="comingSoon">(Coming Soon!)</span></li>
                                <li>A special role in the discord server <span v-if="comingSoon">(Coming Soon!)</span></li>
                                <li>One time purchase</li>
                                <li>900 gift tokens</li>
                                <li>1000 s/o tokens</li>
                            </ul>
                        </VCardSubtitle>
                    </v-card>
                </div>
            </div>
            <p style="color: gray; font-size: 12px;">Disclaimer: Bonus tokens (The extra tokens received by the user upon item purchase) are still a W.I.P and will not be paid out!</p>
        </VResponsive>
        <footer style="position: absolute; bottom: 0; left: 0;">
            <div class="d-flex flex-row">
                <v-btn @click="goTo('https://docs.google.com/document/d/1rYHEzoy_bvXMrqJLa4mAAttlzzb4xVyZAeHwZqbGhFM/edit?usp=sharing')" rounded="0">Terms of Service</v-btn>
                <v-btn @click="goTo('https://discord.com/api/oauth2/authorize?client_id=1087038534143201512&permissions=274877982720&redirect_uri=https%3A%2F%2Fdingus.kubyx.nl%2Fdiscord&scope=bot')" rounded="0">Invite bot</v-btn>
            </div>
        </footer>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
    name: 'home',
    data() {
        return {
            user: {
                username: String,
                tokens: Number,
                gifts: Number,
            },
            products: {
                tokens1: {id: 1, name: '100 tokens', price: 129},
                tokens2: {id: 2, name: '300 tokens', price: 249},
                tokens3: {id: 3, name: '900 tokens', price: 499},
                gifts1: {id: 4, name: '100 gifts', price: 129},
                gifts2: {id: 5, name: '300 gifts', price: 249},
                gifts3: {id: 6, name: '900 gifts', price: 499},
                unlim: {id: 7, name: "Premium", price: 899}
            },
            comingSoon: true,
            disclaimer: true,
            premiumUser: false
        }
    },
    async beforeMount() {
        if (localStorage.getItem('discord_id') == null ?? undefined ?? 'undefined') {
            if (location.pathname == '/discord') {
                await this.fetchDiscord();
            } else {
                location.href = "https://discord.com/api/oauth2/authorize?client_id=1087038534143201512&redirect_uri=https%3A%2F%2Fdingus.kubyx.nl%2Fdiscord&response_type=token&scope=identify%20email";
            }
        } else {
            const id = String(localStorage.getItem('discord_id'));
            await this.fetchCloud(id);
        }
    },
    methods: {
        async fetchDiscord() {
            const urlProps = new URLSearchParams(location.hash.slice(1));
            const [tok, typ] = [urlProps.get("access_token"), urlProps.get("token_type")];

            if (tok && typ) {
                await axios.get('https://discord.com/api/users/@me', 
                { headers:
                    { "authorization": `${typ} ${tok}` } 
                }).then((response: any) => {
                    const id = response.data.id;

                    localStorage.setItem('discord_id', id.toString());
                    this.updateCloud(id);

                    location.pathname = '/';
                }).catch((err: any) => { 
                    console.log(err);
                });
            }
        },
        async updateCloud(id: number) {
            await axios.post('https://dingus.kubyx.nl/connect_discord', {id: id})
            .then((response: any) => {
                console.log(response);
            })
            .catch((err: any) => {
                console.log(err);
            })
        },
        async fetchCloud(id: string) {
            await axios.post('https://dingus.kubyx.nl/fetch_user', {id: id})
            .then((response: any) => {
                this.user = response.data._rel;
                this.premiumUser = response.data._rel.premium;
                console.log('data fetched');
            })
            .catch((err: any) => {
                console.log(err);
            });
        },
        logout() {
            localStorage.clear();
            location.reload();
        },
        async checkout(productID: number) {
            let r = new XMLHttpRequest();
            r.open("POST", "https://dingus.kubyx.nl/checkout");
            r.setRequestHeader('Content-Type', "application/json;charset=utf-8");
            r.send(JSON.stringify({
                items: [{ id: productID, quantity: 1}],
                id: localStorage.getItem('discord_id')
            }));

            r.onreadystatechange = () => {
                if (r.readyState == XMLHttpRequest.DONE) {
                    const data = JSON.parse(r.response);
                    location.href = data['url'];
                }
            }
        },
        goTo(url: string) {
            location.href = url;
        }
    }
});
</script>

<style>
button:active {
    transform: translateY(15%);
}

#username {
    margin-right: auto;
}

#username-control>:nth-child(2) {
    margin-left: auto;
}

#username-control {
    margin: 1rem 0;
}

#tokenAmounts>:first-child {
    margin-right: auto;
}

h3, h4 {
    font-weight: 400;
}

.token-upper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.token-upper>* {
    gap: 1rem;
}

#token-interactions {
    margin: 2rem;
}

#token-interactions>:first-child {
    margin-right: auto;
}

li {
    width: fit-content;
    margin-left: 20px;
}
</style>