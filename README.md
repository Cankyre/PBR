# PBR

## Server installation from source
Follow these steps in your terminal (make sure you've installed git and NodeJS)

1. `git clone https://github.com/ThatCookie/PBR.git`
2. `cd server`
3. `npm i` 

(Start with `npm start`)

## Client installation from source
Follow these steps in your terminal (make sure you've installed git and NodeJS)

1. `git clone https://github.com/ThatCookie/PBR.git`
2. `cd client`
3. `npm i` 

(Start with `npm start`)

## Client Select Host

please press "*" to select the host (If you're hosting in local just type `ws://localhost:8082`, else type `ws://<server-ip>:8082`)

## Server Configuration
All config options are in ./config/config.json

* `whitelist`: true/false. Authorize connection for trusted IPs.
* `trustedIPs`: []. Write the IPs to authorize with the whitelist.
* `blacklist`: true/false. Reject any connection coming from banIPs.
* `banIPs`: []. Write the IPs to reject on connection
* `port`: int. Port for the WebSocket