// path/filename: /client/app.component.js

function Component(children) {
    let mounted = false;
    let state = {};
    this.template = ``;
    this.parent = null;

    this.onRender = () => {};
    this.onMount = () => {};
    this.render = () => {
        if(!this.parent) return;
        this.parent.innerHTML = this.template(state);
        addSlots();
        if(!mounted) {
            this.onMount(this.parent, state);
        }
        mounted = true;
        this.onRender(this.parent, state);
    }

    this.setParent = (parent) => {
        this.parent = parent;
        this.render();
    }
    this.appendTo = (parent) => {
        if(!this.parent) {
            this.setParent(parent);
            return;
        }
        parent.appendChild(this.parent);
    }

    const addSlots = () => {
        const slots = this.parent.querySelectorAll('slot');
        slots.forEach(slot => {
            const componentName = slot.getAttribute('component');
            const element = slot.getAttribute('element') || 'div';
            const component = children && children[componentName];
            if(!component) {
                slot.remove();
                return;
            }
            const parent = document.createElement(element);
            parent.setAttribute('x-component', componentName);
            slot.parentNode.replaceChild(parent, slot);
            component.appendTo(parent);
        });
    }

    const proxyHandler = {
        set: (target, property, value) => {
            if (typeof value === 'object' && value !== null) {
                value = new Proxy(value, proxyHandler);
            }
            target[property] = value;
            if (mounted) this.render();
            return true;
        },
    };

    state = new Proxy({}, proxyHandler);

    this.setState = (newState) => {
        for (const key in newState) {
            state[key] = newState[key];
        }
    };
    
}

export default Component;