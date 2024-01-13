// path/filename: /shared/event.js

// subscribe and unsubscribe from event actions
function AppEvent() {
    const subscribers = [];

    const subscribe = (subscriber) => {
        subscribers.push(subscriber);
    }

    const unsubscribe = (subscriber) => {
        const index = subscribers.indexOf(subscriber);
        if (index!== -1) {
            subscribers.splice(index, 1);
        }
    }

    const notify = (event) => {
        subscribers.forEach(subscriber => {
            subscriber(event);
        });
    }

    return {
        subscribe,
        unsubscribe,
        notify,
    }
}

export default AppEvent;