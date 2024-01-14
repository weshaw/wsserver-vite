// path/filename: /client/core/component.js
import watcher from "./watcher";

function Component(children) {
    let mounted = false;
    let state = {};
    this.template = ``;
    this.parent = null;
    this.node = null;

    this.onRender = () => { };
    this.onMount = () => { };
    this.render = () => {
        if (!this.parent) return;
        const componentNode = hydrateTemplate(this.template, state);
        if (this.node && this.parent.contains(this.node)) {
            this.parent.replaceChild(componentNode, this.node);
        }
        else {
            this.parent.appendChild(componentNode);
        }
        this.node = componentNode;
        addSlots();
        if (!mounted) {
            mounted = true;
            this.onMount(this.node, state);
        }
        this.onRender(this.node, state);
    }

    this.setParent = (parent) => {
        this.parent = parent;
        this.render();
    }
    this.appendTo = (parent) => {
        if (!this.parent) {
            this.setParent(parent);
            return;
        }
        parent.appendChild(this.parent);
    }

    const hydrateTemplate = (template, state = {}) => {
        const tempNode = document.createElement('div');
        tempNode.innerHTML = template(state);
        return tempNode.firstElementChild;
    }

    const addSlots = () => {
        const slots = this.parent.querySelectorAll('Component');
        slots.forEach(slotNode => {
            const componentName = slotNode.getAttribute('name');
            const component = children && children[componentName];
            if (!component) {
                slotNode.remove();
                return;
            }
            const componentNode = hydrateTemplate(component.template, component.getState())
            const parentNode = slotNode.parentNode;
            parentNode.replaceChild(componentNode, slotNode);
            component.node = componentNode;
            component.setParent(parentNode);
        });
    }

    state = watcher({}, () => {
        if (mounted) this.render();
    });

    this.setState = (newState) => {
        for (const key in newState) {
            state[key] = newState[key];
        }
    };
    this.getState = () => {
        return state;
    };

}

export default Component;