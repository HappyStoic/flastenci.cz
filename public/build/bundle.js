
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        const updates = [];
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.58.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Card.svelte generated by Svelte v3.58.0 */

    const { console: console_1$1 } = globals;
    const file$4 = "src/components/Card.svelte";

    function create_fragment$4(ctx) {
    	let div2;
    	let div0;
    	let div0_class_value;
    	let t;
    	let div1;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			img = element("img");
    			attr_dev(div0, "class", div0_class_value = "card-face card-face-front " + /*color*/ ctx[0] + " svelte-1ceylsu");
    			add_location(div0, file$4, 50, 2, 955);
    			if (!src_url_equal(img.src, img_src_value = /*rsc*/ ctx[1].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Card image");
    			attr_dev(img, "class", "svelte-1ceylsu");
    			add_location(img, file$4, 53, 4, 1058);
    			attr_dev(div1, "class", "card-face card-face-back svelte-1ceylsu");
    			add_location(div1, file$4, 52, 2, 1015);
    			attr_dev(div2, "class", "card svelte-1ceylsu");
    			toggle_class(div2, "flipped", /*flipped*/ ctx[2]);
    			add_location(div2, file$4, 49, 0, 890);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			append_dev(div1, img);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*flipCard*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1 && div0_class_value !== (div0_class_value = "card-face card-face-front " + /*color*/ ctx[0] + " svelte-1ceylsu")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*rsc*/ 2 && !src_url_equal(img.src, img_src_value = /*rsc*/ ctx[1].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*flipped*/ 4) {
    				toggle_class(div2, "flipped", /*flipped*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let playedOnce = false;

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	const dispatch = createEventDispatcher();
    	let { cardId } = $$props;
    	let { color } = $$props;
    	let { rsc } = $$props;
    	let flipped = false;
    	let audio;

    	onMount(() => {
    		if (rsc.audio) {
    			audio = new Audio(rsc.audio);
    		}
    	});

    	function dispatchShown() {
    		dispatch('shown', {
    			rsc,
    			"hideCallback": () => {
    				$$invalidate(2, flipped = false);
    			}
    		});
    	}

    	function flipCard() {
    		if (flipped) {
    			return; // flipped back only via callback from gameboard
    		}

    		$$invalidate(2, flipped = true);
    		console.log(`Flipped card ${cardId}: ${flipped}`);

    		if (flipped) {
    			dispatchShown();

    			if (audio && !playedOnce) {
    				playedOnce = true;
    				console.log("play sound");
    				audio.play();
    			}
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (cardId === undefined && !('cardId' in $$props || $$self.$$.bound[$$self.$$.props['cardId']])) {
    			console_1$1.warn("<Card> was created without expected prop 'cardId'");
    		}

    		if (color === undefined && !('color' in $$props || $$self.$$.bound[$$self.$$.props['color']])) {
    			console_1$1.warn("<Card> was created without expected prop 'color'");
    		}

    		if (rsc === undefined && !('rsc' in $$props || $$self.$$.bound[$$self.$$.props['rsc']])) {
    			console_1$1.warn("<Card> was created without expected prop 'rsc'");
    		}
    	});

    	const writable_props = ['cardId', 'color', 'rsc'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('cardId' in $$props) $$invalidate(4, cardId = $$props.cardId);
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('rsc' in $$props) $$invalidate(1, rsc = $$props.rsc);
    	};

    	$$self.$capture_state = () => ({
    		playedOnce,
    		onMount,
    		createEventDispatcher,
    		dispatch,
    		cardId,
    		color,
    		rsc,
    		flipped,
    		audio,
    		dispatchShown,
    		flipCard
    	});

    	$$self.$inject_state = $$props => {
    		if ('cardId' in $$props) $$invalidate(4, cardId = $$props.cardId);
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('rsc' in $$props) $$invalidate(1, rsc = $$props.rsc);
    		if ('flipped' in $$props) $$invalidate(2, flipped = $$props.flipped);
    		if ('audio' in $$props) audio = $$props.audio;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, rsc, flipped, flipCard, cardId];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { cardId: 4, color: 0, rsc: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get cardId() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cardId(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rsc() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rsc(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const rawResources = [
        {img:"assets/babis.jpg"},
        {img:"assets/skromach.jpg"},
        {img:"assets/feri.jpg"},
        {img:"assets/havel.jpg"},
        {img:"assets/kalousek.jpg"},
        {img:"assets/klaus.jpg"},
        {img:"assets/rath.jpg"},
        {img:"assets/schillerova.jpg"},
        {img:"assets/schwarzenberg.jpg"},
        {img:"assets/sobotka.jpg"},
        // {img:"assets/topolanek.jpg"},
        {img:"assets/vojtech.jpg"},
        {img:"assets/volny.jpg"},
        {img:"assets/chovanec.jpg"},
        {img:"assets/ondracek.jpg"},
        {img:"assets/vondracek.jpg"},
        {img:"assets/bartos.jpg"},
        {img:"assets/pitomio.jpg"},
        {img:"assets/zeman.jpg", audio:"assets/kunda.mp3"},
    ];


    const resources = readable(undefined, async function start(set) {
        let res = [];
        try {
            for (const rawRsc of rawResources) {
                let response = await fetch(rawRsc.img);
                let blob = await response.blob();
                let rsc = {
                    "img": URL.createObjectURL(blob)
                };
                if (rawRsc.audio) {
                    response = await fetch(rawRsc.audio);
                    blob = await response.blob();
                    rsc.audio = URL.createObjectURL(blob);
                }
                res.push(rsc);
            }
            set(res);
        } catch (err) {
            alert(err);
        }

    });

    /* src/components/GameBoard.svelte generated by Svelte v3.58.0 */

    const { console: console_1 } = globals;
    const file$3 = "src/components/GameBoard.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (62:2) {#each cards as card (card)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				color: color(/*card*/ ctx[8]),
    				cardId: /*card*/ ctx[8],
    				rsc: /*popRandomRsc*/ ctx[1]()
    			},
    			$$inline: true
    		});

    	card.$on("shown", /*cardShown*/ ctx[2]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(card.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const card_changes = {};
    			if (dirty & /*cards*/ 1) card_changes.color = color(/*card*/ ctx[8]);
    			if (dirty & /*cards*/ 1) card_changes.cardId = /*card*/ ctx[8];
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(62:2) {#each cards as card (card)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*cards*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*card*/ ctx[8];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "container svelte-9sunci");
    			add_location(div, file$3, 60, 0, 1532);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color, cards, popRandomRsc, cardShown*/ 7) {
    				each_value = /*cards*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function color(idx) {
    	return idx % 6 < 2 ? 'white' : idx % 6 < 4 ? 'red' : 'blue';
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $resources;
    	validate_store(resources, 'resources');
    	component_subscribe($$self, resources, $$value => $$invalidate(6, $resources = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameBoard', slots, []);
    	let gridSize = 6;
    	let cards = [];
    	let availableResources;
    	let firstShown = null;
    	let hideAwaitingCards = null;

    	onMount(() => {
    		// each card twice
    		availableResources = $resources.flatMap(x => [x, x]);

    		$$invalidate(0, cards = Array.from({ length: gridSize * gridSize }, (_, i) => i));
    	});

    	function popRandomRsc() {
    		const idx = Math.floor(Math.random() * availableResources.length);
    		return availableResources.splice(idx, 1)[0]; // pop the element
    	}

    	function cardShown(e) {
    		let card = e.detail;

    		// console.log(e)
    		if (firstShown == null) {
    			if (hideAwaitingCards) {
    				hideAwaitingCards();
    				hideAwaitingCards = null;
    			}

    			firstShown = card;
    			return;
    		}

    		if (firstShown.rsc == card.rsc) {
    			console.log("clicked the same!");
    			firstShown = null;
    		} else {
    			let id1 = setTimeout(card.hideCallback, 5000);
    			let id2 = setTimeout(firstShown.hideCallback, 5000);
    			let callback1 = card.hideCallback;
    			let callback2 = firstShown.hideCallback;

    			hideAwaitingCards = () => {
    				clearTimeout(id1);
    				clearTimeout(id2);
    				callback1();
    				callback2();
    			};

    			firstShown = null;
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<GameBoard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Card,
    		resources,
    		onMount,
    		gridSize,
    		cards,
    		availableResources,
    		firstShown,
    		hideAwaitingCards,
    		color,
    		popRandomRsc,
    		cardShown,
    		$resources
    	});

    	$$self.$inject_state = $$props => {
    		if ('gridSize' in $$props) gridSize = $$props.gridSize;
    		if ('cards' in $$props) $$invalidate(0, cards = $$props.cards);
    		if ('availableResources' in $$props) availableResources = $$props.availableResources;
    		if ('firstShown' in $$props) firstShown = $$props.firstShown;
    		if ('hideAwaitingCards' in $$props) hideAwaitingCards = $$props.hideAwaitingCards;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cards, popRandomRsc, cardShown];
    }

    class GameBoard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameBoard",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/Matrix.svelte generated by Svelte v3.58.0 */
    const file$2 = "src/components/Matrix.svelte";

    function create_fragment$2(ctx) {
    	let canvas_1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "class", "svelte-15nsus0");
    			add_location(canvas_1, file$2, 81, 0, 2002);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[2](canvas_1);

    			if (!mounted) {
    				dispose = listen_dev(canvas_1, "resize", /*onResize*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[2](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const flagWidth = 70;
    const flagHeight = 50;
    const rotationSpeed = 0.025;
    const fallSpeed = 2;

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Matrix', slots, []);
    	let canvas;
    	let ctx;
    	let flags = [];
    	let numFlags;

    	function createFlag() {
    		return {
    			x: Math.random() * canvas.width,
    			y: -Math.random() * canvas.height,
    			rotation: Math.random() * Math.PI * 2
    		};
    	}

    	function update() {
    		ctx.clearRect(0, 0, canvas.width, canvas.height);

    		flags.forEach(flag => {
    			flag.y += fallSpeed;
    			flag.rotation += rotationSpeed;

    			if (flag.y > canvas.height) {
    				flag.y = -flagHeight;
    				flag.x = Math.random() * canvas.width;
    			}

    			ctx.save();
    			ctx.translate(flag.x + flagWidth / 2, flag.y + flagHeight / 2);
    			ctx.rotate(flag.rotation);
    			ctx.drawImage(flag.image, -flagWidth / 2, -flagHeight / 2, flagWidth, flagHeight);
    			ctx.restore();
    		});

    		requestAnimationFrame(update);
    	}

    	onMount(() => {
    		numFlags = Math.round(window.innerWidth * window.innerHeight / 23000);
    		$$invalidate(0, canvas.width = window.innerWidth, canvas);
    		$$invalidate(0, canvas.height = window.innerHeight, canvas);
    		ctx = canvas.getContext('2d');

    		for (let i = 0; i < numFlags; i++) {
    			const flagImage = new Image();
    			flagImage.src = '/assets/cz-flag.svg';

    			flagImage.onload = () => {
    				flags.push({ ...createFlag(), image: flagImage });
    			};
    		}

    		requestAnimationFrame(update);

    		return () => {
    			onDestroy();
    		};
    	});

    	function onResize() {
    		$$invalidate(0, canvas.width = window.innerWidth, canvas);
    		$$invalidate(0, canvas.height = window.innerHeight, canvas);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Matrix> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(0, canvas);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		canvas,
    		ctx,
    		flags,
    		numFlags,
    		flagWidth,
    		flagHeight,
    		rotationSpeed,
    		fallSpeed,
    		createFlag,
    		update,
    		onResize
    	});

    	$$self.$inject_state = $$props => {
    		if ('canvas' in $$props) $$invalidate(0, canvas = $$props.canvas);
    		if ('ctx' in $$props) ctx = $$props.ctx;
    		if ('flags' in $$props) flags = $$props.flags;
    		if ('numFlags' in $$props) numFlags = $$props.numFlags;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [canvas, onResize, canvas_1_binding];
    }

    class Matrix extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Matrix",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/ExitNote.svelte generated by Svelte v3.58.0 */

    const file$1 = "src/components/ExitNote.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(div, "class", "exit-note alert alert-success shadow-sm svelte-3zju3q");
    			attr_dev(div, "role", "alert");
    			add_location(div, file$1, 29, 0, 662);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExitNote', slots, []);
    	let { text = "Site under construction 🏗️" } = $$props;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExitNote> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class ExitNote extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExitNote",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get text() {
    		throw new Error("<ExitNote>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<ExitNote>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.58.0 */
    const file = "src/App.svelte";

    // (25:2) {:else}
    function create_else_block(ctx) {
    	let gameboard;
    	let current;
    	gameboard = new GameBoard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(gameboard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(gameboard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gameboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gameboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(gameboard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(25:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#if !started}
    function create_if_block(ctx) {
    	let matrix;
    	let t;
    	let exitnote;
    	let current;
    	matrix = new Matrix({ $$inline: true });

    	exitnote = new ExitNote({
    			props: { text: /*centralText*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(matrix.$$.fragment);
    			t = space();
    			create_component(exitnote.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(matrix, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(exitnote, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const exitnote_changes = {};
    			if (dirty & /*centralText*/ 2) exitnote_changes.text = /*centralText*/ ctx[1];
    			exitnote.$set(exitnote_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(matrix.$$.fragment, local);
    			transition_in(exitnote.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(matrix.$$.fragment, local);
    			transition_out(exitnote.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(matrix, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(exitnote, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(22:2) {#if !started}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*started*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			add_location(main, file, 20, 0, 514);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handleKeyPress*/ ctx[2], false, false, false, false),
    					listen_dev(window, "click", /*handleKeyPress*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let loaded;
    	let centralText;
    	let $resources;
    	validate_store(resources, 'resources');
    	component_subscribe($$self, resources, $$value => $$invalidate(4, $resources = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let started = false;

    	function handleKeyPress() {
    		if (loaded) {
    			$$invalidate(0, started = true);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		GameBoard,
    		Matrix,
    		ExitNote,
    		resources,
    		started,
    		handleKeyPress,
    		loaded,
    		centralText,
    		$resources
    	});

    	$$self.$inject_state = $$props => {
    		if ('started' in $$props) $$invalidate(0, started = $$props.started);
    		if ('loaded' in $$props) $$invalidate(3, loaded = $$props.loaded);
    		if ('centralText' in $$props) $$invalidate(1, centralText = $$props.centralText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$resources*/ 16) {
    			$$invalidate(3, loaded = $resources !== undefined);
    		}

    		if ($$self.$$.dirty & /*loaded*/ 8) {
    			$$invalidate(1, centralText = loaded ? "press any key to continue" : "loading...");
    		}
    	};

    	return [started, centralText, handleKeyPress, loaded, $resources];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
