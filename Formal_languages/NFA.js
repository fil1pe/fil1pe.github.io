import './vue.js'

class NFA {
    constructor(states, alphabet, transition, start, accept){
        this.states = states
        this.alphabet = alphabet
        this.transition = (q, s) => transition[q] === undefined || transition[q][s] === undefined ? [] : transition[q][s]
        this.start = start
        this.accept = accept
    }

    // Renders state:
    state(q){
        return JSON.stringify(q).replace(/\"/g, '')
    }

    // Renders transition table:
    table(name){
        let states = this.states
        let alphabet = this.alphabet
        let transition = this.transition
        let start = this.start
        let accept = this.accept
        let state = this.state
        Vue.component(name, {
            data: function () {
                return {
                    states: states,
                    alphabet: alphabet,
                    transition: transition,
                    start: start,
                    accept: accept,
                    state: state
                }
            },
            template:
                `<div>
                    <slot></slot>
                    <table class="nfa-table" cellspacing=0>
                        <thead>
                            <tr>
                                <th class="header"></th>
                                <th class="header" v-for="s in alphabet">{{s}}</th>
                            </tr>
                        </thead>
                        <tr v-for="q in states">
                            <th>
                                <template v-if="q === start">&rarr;</template>
                                {{state(q)}}
                            </th>
                            <td v-for="s in alphabet" :class="[accept.includes(q) ? 'accept' : '']">
                                <template v-if="transition(q,s) !== undefined">
                                    {{state(transition(q,s))}}
                                </template>
                            </td>
                        </tr>
                    </table>
                </div>`
        })
    }

    // Renders input form for generating NFA: 
    static input(name, handler, button='Generate', states='', alphabet='', transition='', start='', accept=''){
        Vue.component(name, {
            data: function(){
                return {
                    states: states,
                    alphabet: alphabet,
                    transition: transition,
                    start: start,
                    accept: accept,
                    button: button
                }
            },
            methods: {
                construct: function(){
                    let states = this.$refs.states.value.split(',').map(x => x.trim())
                    let alphabet = this.$refs.alphabet.value.split(',').map(x => x.trim())
                    let transition = {}
                    let start = this.$refs.start.value.trim()
                    let accept = this.$refs.accept.value.split(',').map(x => x.trim())
                    let transition_tuples = this.$refs.transition.value.replace(/\),[ ]*\(/g, ')(').split(/[()]+/)
                    for(let t of transition_tuples){
                        let args = t.split(/,/g).map(x => x.trim())
                        if(args.length < 3) continue
                        if(transition[args[0]] === undefined)
                            transition[args[0]] = {}
                        if(transition[args[0]][args[1]] === undefined)
                            transition[args[0]][args[1]] = []
                        transition[args[0]][args[1]].push(args[2])
                    }
                    handler(states, alphabet, transition, start, accept)
                }
            },
            template:
                `<table class="nfa-input">
                    <tr>
                        <td>States</td>
                        <td><input type="text" :value="states" ref="states"></td>
                    </tr>
                    <tr>
                        <td>Alphabet</td>
                        <td><input type="text" :value="alphabet" ref="alphabet"></td>
                    </tr>
                    <tr>
                        <td>Transition function</td>
                        <td><input type="text" :value="transition" ref="transition"></td>
                    </tr>
                    <tr>
                        <td>Start state</td>
                        <td><input type="text" :value="start" ref="start"></td>
                    </tr>
                    <tr>
                        <td>Accepting states</td>
                        <td><input type="text" :value="accept" ref="accept"></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button v-on:click="construct">{{button}}</button></td>
                    </tr>
                </table>`
        })
    }
}

export default NFA