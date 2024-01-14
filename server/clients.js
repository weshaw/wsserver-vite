// path/filename: /server/clients.js

function Clients() {
    const list = new Map();

    const has = (ws) => {
        return list.has(ws);
    }
    const set = (ws, data) => {
        list.set(ws, data);
        console.log(`Client Added. Total clients: ${total()}`);
    }
    const update = (ws, data) => {
        if (list.has(ws)) {
            list.set(ws, { ...list.get(ws), ...data });
        }
    }
    const get = (ws) => {
        return list.get(ws);
    }
    const remove = (ws) => {
        if (list.has(ws)) {
            list.delete(ws);
            console.log(`Client Removed. Total clients: ${total()}`);
        }
    }
    const total = () => {
        return list.size;
    }

    return {
        set,
        update,
        get,
        remove,
        total,
        has
    }
}
const clients = Clients();
export default clients;