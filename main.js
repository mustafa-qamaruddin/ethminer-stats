const API_ENDPOINT = 'https://api.ethermine.org';
const MINER_ADDR = '0x0C4beC0CF7aA3e3562d0f56558829C348646861b';
const BUBBLE_UP = new Audio('./assets/sounds/bubble.mp3');
const CRASH_DOWN = new Audio('./assets/sounds/crash.mp3');


$(()=>{

    // update miner address in description
    $('.miner-addr .address span').text(MINER_ADDR);
    $( '.miner-stats' ).fadeOut( "slow");
    $( '.miner-stats' ).fadeIn( "slow");
    // $(".miner-stats").animate({
    //     opacity: '0.5',
    //   });
    $(".miner-stats").animate({
        opacity: '1',
      });

    // load ethminer pool stats
    loadPoolStats();

    // load ethminer network stats
    loadNetworkStats();

    // load miner stats
    loadMinerStats();

    // play sound every 2 minutes
    window.setInterval(updateMinerStats, 840000);
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

                // Top Miners
                let top_miners = Array();
                for ( let i in data.data.minedBlocks ) {
                    top_miners.push('0x' + data.data.minedBlocks[i].miner);
                }
                calcTopMinersStats(top_miners);
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
                $('.network-stats .difficulty span').text(
                    Math.floor(
                        100 * data.data.difficulty / 1000000000000
                    ) / 100
                );
                $('.network-stats .block-time span').text(
                    Math.floor(
                        100 * data.data.blockTime
                    ) / 100
                );
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
                $('.last-seen span').text(timestampToDate(data.data.lastSeen));

                // $('.miner-stats .hash-rate span').animate({borderColor:'red'}, 400)
                // .delay(400)
                // .animate({borderColor:'black'}, 1000);
                
                // Unpaid balance (in base units) of the miner
                $('.miner-stats .unpaid span').text(data.data.unpaid);

                const eth_val = Math.floor(
                    100000 * data.data.unpaid / 1000000000000000000
                ) / 100000;

                $('.miner-stats .unpaid-eth span').text(eth_val);

                const btc_price = $('.price .btc span').text();
                const usd_price = $('.price .usd span').text();

                $('.miner-stats .unpaid-btc span').text(
                    Math.floor(
                        1000000 * eth_val * btc_price
                    ) / 1000000
                );
                $('.miner-stats .unpaid-usd span').text(
                    Math.floor(
                        1000000 * eth_val * usd_price
                    ) / 1000000
                );
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
                $('.last-seen span').text(timestampToDate(data.data.lastSeen));

                $('.miner-stats .hash-rate span').animate({borderColor:'red'}, 400)
                .delay(400)
                .animate({borderColor:'black'}, 1000);

                const eth_val = Math.floor(
                    100000 * data.data.unpaid / 1000000000000000000
                ) / 100000;

                $('.miner-stats .unpaid-eth span').text(eth_val);

                const btc_price = $('.price .btc span').text();
                const usd_price = $('.price .usd span').text();

                $('.miner-stats .unpaid-btc span').text(
                    Math.floor(
                        1000000 * eth_val * btc_price
                    ) / 1000000
                );
                $('.miner-stats .unpaid-usd span').text(
                    Math.floor(
                        1000000 * eth_val * usd_price
                    ) / 1000000
                );
            }
        }
    );
}

function calcTopMinersStats(top_miners) {
    let obj = new topMinerCallbackClass();
    for ( let i in top_miners ) {
        //sleep for 5 minutes
        setTimeout(function(){ 
        }, 6000000); 

        $.getJSON(
            API_ENDPOINT + '/miner/' + top_miners[i] + '/currentStats',
            {},
            (data) => {
                obj.topMinerCallback(data);
            }
        );
    }
}

function topMinerCallbackClass() {

    // average hashrate
    this.average_hashrate = 0;
    this.num_miners = 0;
    this.sum_hashrate = 0;

    // valid shares
    this.sum_valid_shares = 0;
    this.average_valid_shares = 0;

    // stale shares
     this.sum_stale_shares = 0;
     this.average_stale_shares = 0;

    // valid shares
    this.sum_invalid_shares = 0;
    this.average_invalid_shares = 0;

    // active workrs
    this.sum_active_workers = 0;    
    this.average_active_workers = 0;

    this.topMinerCallback = function(data) {
        this.num_miners++;

        // average hashrate
        this.sum_hashrate += Math.round(100 * data.data.averageHashrate / 1000000) / 100;
        this.average_hashrate = this.sum_hashrate / this.num_miners;
        $('#top_avg_hashrate').text(this.average_hashrate);

        // average valid shares
        this.sum_valid_shares += data.data.validShares;
        this.average_valid_shares = this.sum_valid_shares / this.num_miners;
        $('#top_avg_valid_shares').text(this.average_valid_shares);
        
        // average stale shares
        this.sum_stale_shares += data.data.staleShares;
        this.average_stale_shares = this.sum_stale_shares / this.num_miners;
        $('#top_avg_stale_shares').text(this.average_stale_shares);

        // average invalid shares
        this.sum_invalid_shares += data.data.invalidShares;
        this.average_invalid_shares = this.sum_invalid_shares / this.num_miners;
        $('#top_avg_invalid_shares').text(this.average_invalid_shares);

        // average active workers
        this.sum_active_workers += data.data.activeWorkers;
        this.average_active_workers = this.sum_active_workers / this.num_miners;
        $('#top_avg_active_workers').text(this.average_active_workers);
    }
}