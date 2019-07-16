const API_ENDPOINT = 'https://api.ethermine.org';
const MINER_ADDR = '0x0C4beC0CF7aA3e3562d0f56558829C348646861b';
const BUBBLE_UP = new Audio('./assets/sounds/bubble.mp3');
const CRASH_DOWN = new Audio('./assets/sounds/crash.mp3');


$(()=>{

    // update miner address in description
    $('.jumbotron p span').text(MINER_ADDR);

    // load ethminer pool stats
    loadPoolStats();

    // load ethminer network stats
    loadNetworkStats();

    // load miner stats
    loadMinerStats();

    // play sound every 2 minutes
    window.setInterval(updateMinerStats, 120000);
});

function loadPoolStats() {
    $.getJSON(
        API_ENDPOINT + '/poolStats',
        {},
        (data) => {
            if (data.status === 'OK' ) {
                $('.pool-stats .hash-rate span').text(Math.round(100 * data.data.poolStats.hashRate / 1000000000000) / 100);
                $('.pool-stats .miners span').text(data.data.poolStats.miners);
                $('.pool-stats .workers span').text(data.data.poolStats.workers);
                $('.pool-stats .blocks span').text(data.data.poolStats.blocksPerHour);

                $('.price .usd span').text(data.data.price.usd);
                $('.price .btc span').text(data.data.price.btc);
            }
        }
    );
}

function loadNetworkStats() {
    $.getJSON(
        API_ENDPOINT + '/networkStats',
        {},
        (data) => {
            if (data.status === 'OK' ) {
                $('.network-stats .hash-rate span').text(Math.round(100 * data.data.hashrate / 1000000000000) / 100);
                $('.network-stats .difficulty span').text(data.data.difficulty);
                $('.network-stats .block-time span').text(data.data.blockTime);
            }
        }
    );
}

function loadMinerStats() {
    $.getJSON(
        API_ENDPOINT + '/miner/' + MINER_ADDR + '/currentStats',
        {},
        (data) => {
            if (data.status === 'OK' ) {
                $('.miner-stats .hash-rate span').text(Math.round(100 * data.data.averageHashrate / 1000000) / 100);
                $('.miner-stats .workers span').text(data.data.activeWorkers);
                $('.miner-stats .valid-shares span').text(data.data.validShares);
                $('.miner-stats .stale-shares span').text(data.data.staleShares);
                $('.miner-stats .invalid-shares span').text(data.data.invalidShares);
                $('.miner-stats .last-seen span').text(timestampToDate(data.data.lastSeen));

                // Unpaid balance (in base units) of the miner
                $('.miner-stats .unpaid span').text(data.data.unpaid);
            }
        }
    );
}

function timestampToDate(unix_timestamp) {

    var date = new Date(unix_timestamp * 1000);

    return date.toTimeString() + ' on ' + date.toDateString();
}

function updateMinerStats() {
    const prev_val = Number($('.miner-stats .unpaid span').text());
    const prev_workers = Number($('.miner-stats .workers span').text());
    $.getJSON(
        API_ENDPOINT + '/miner/' + MINER_ADDR + '/currentStats',
        {},
        (data) => {
            if (data.status === 'OK' ) {
                // Unpaid balance (in base units) of the miner
                $('.miner-stats .unpaid span').text(data.data.unpaid);
                const curr_val = Number($('.miner-stats .unpaid span').text());

                if ( curr_val > prev_val ) {
                    BUBBLE_UP.play();
                }

                $('.miner-stats .workers span').text(data.data.activeWorkers);
                const curr_workers = Number($('.miner-stats .workers span').text());

                if ( curr_workers < prev_workers ) {
                    CRASH_DOWN.play();
                }

                $('.miner-stats .hash-rate span').text(Math.round(100 * data.data.averageHashrate / 1000000) / 100);
                $('.miner-stats .valid-shares span').text(data.data.validShares);
                $('.miner-stats .stale-shares span').text(data.data.staleShares);
                $('.miner-stats .invalid-shares span').text(data.data.invalidShares);
                $('.miner-stats .last-seen span').text(timestampToDate(data.data.lastSeen));
            }
        }
    );
}
