
// use Proxy to track state changes
const watcher = (state, onChange) => {
    const proxyHandler = {
        set: (target, key, value) => {
            if (typeof value === 'object' && value !== null) {
                value = new Proxy(value, proxyHandler);
            }
            target[key] = value;
            onChange(target, key, value);
            return true;
        }
    }
    return new Proxy(state, proxyHandler);
}

export default watcher;