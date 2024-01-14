// path/filename: /shared/event.js
import debounce from './debounce';

// subscribe and unsubscribe from event actions
function AppEvent() {
    const subscribers = [];

    const subscribe = (subscriber) => {
        subscribers.push(subscriber);
    }

    const unsubscribe = (subscriber) => {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) {
            subscribers.splice(index, 1);
        }
    }

    const notify = (event) => {
        subscribers.forEach(subscriber => {
            subscriber(event);
        });
    }

    const debouncedNotify = (event, delay = 0) => {
        debounce(notify, delay)(event);
    }

    return {
        subscribe,
        unsubscribe,
        notify,
        debouncedNotify,
    }
}

export default AppEvent;