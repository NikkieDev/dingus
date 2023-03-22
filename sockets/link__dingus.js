const ws = require('ws');
const wss = new ws.Server({port: 3006});

// data -> ['authorization', 'state', 'target']
let sessionID = 0;
let botReady, serverReady = false;
let sockState;

wss.on('connection', (soc, req) => {
    sessionID++;
    soc.id = sessionID;

    soc.on('open', () => {
        soc.send("Connected to dingus link");
    });

    soc.on('message', _e => {
        const decoder = new TextDecoder();
        const e = JSON.parse(decoder.decode(_e));

        if (e['authorization'] == 'SERVER_BALLS' && e['target'] == 'bot') {
            soc.identify = 'server';
        } else if (e['authorization'] == "CLIENTELE" && e['target'] == 'user') {
            soc.identify = 'bot';
        }
        

        if (e['state'] == 'connect') {
            console.log(`New connection: ${JSON.stringify({'identification': soc.identify, 'sessionID': soc.id})}`);
            wss.clients.forEach(client => {
                if (client.OPEN) {
                    client.ready = true;
                    
                    if (client.identify == 'server') {
                        serverReady = true;
                    } else if (client.identify == 'bot') {
                        botReady = true;
                        sockState = (serverReady) ? 'waiting' : 'connecting'; // if server is connected too, then link is waiting else link is connecting to server

                        client.send(JSON.stringify({Server: serverReady, state: sockState}));
                    }
                }
            });
        }
    });

    soc.on('close', () => {
        if (soc.identify == 'server') {
            serverReady = false;
            soc.ready = false;
        }
        else if (soc.identify == 'bot') {
            botReady = false;
            soc.ready = false;
        }
    });
});