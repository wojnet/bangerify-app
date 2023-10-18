// HARD TO EXPLAIN

class Gateway {
    constructor(ms) {
        this.ms = ms;
        this.lastLoad = new Date().getTime();
    }

    execute(fn) {
        let currentTime = new Date().getTime();
        if (currentTime - this.lastLoad >= this.ms) {
            fn;
        }
    }
}

export const loadPostGateway = new Gateway(1000);