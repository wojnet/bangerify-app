class Semaphore {
    constructor(maxCount = 1) {
        if (maxCount <= 0) throw new Error("'maxCount' must be positive");
        this.maxCount = maxCount;
        this.count = 0;
        this.list = [];
    }

    getList() {
        return this.list;
    }

    execute(fn, ...args) {
        return new Promise((resolve, reject) => {
            this.list.push({
                fn: fn,
                args: args,
                resolve: resolve,
                reject: reject
            });
            this.try();
        });
    }

    executeIfPossible(fn, ...args) {
        if (this.count < this.maxCount) {
            this.execute(fn, ...args);
        }
    }

    try() {
        if (this.list.length && this.count < this.maxCount) {
            let { fn, args, resolve, reject } = this.list.shift();
            this.count++;
            let req = fn(...args);
            req.then(res => resolve(res))
                .catch(err => reject(err))
                .finally(() => {
                    this.count--;
                    this.try()
                })
        }
    }
};

export default Semaphore;