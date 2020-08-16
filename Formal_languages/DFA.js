import NFA from './NFA.js'

class DFA extends NFA {
    constructor(states, alphabet, transition, start, accept){
        super(states, alphabet, transition, start, accept)

        let ntransition = this.transition
        this.transition = (q, s) => ntransition(q, s)[0]
    }

    // Makes transition function total:
    total_transition(){
        let is_total = true
        let transition_obj = {}

        for(let q of this.states){
            transition_obj[q] = {}
            for(let s of this.alphabet){
                let p = this.transition(q,s)
                if(p === undefined){
                    is_total = false
                    transition_obj[q][s] = 'sink'
                }else
                    transition_obj[q][s] = p
            }
        }

        if(!is_total){
            this.states.push('sink')
            transition_obj['sink'] = {}
            for(let s of this.alphabet)
                transition_obj['sink'][s] = 'sink'
        
            this.transition = (q, s) => transition_obj[q][s]
        }
    }

    // The reverse transition function:
    rev_transition(q, a){
        if(this.rev_transition_obj === undefined){
            this.rev_transition_obj = {}

            for(let q of this.states){
                this.rev_transition_obj[q] = {}
                for(let s of this.alphabet)
                    this.rev_transition_obj[q][s] = []
            }

            for(let q of this.states)
                for(let s of this.alphabet){
                    let p = this.transition(q, s)
                    if (p !== undefined)
                        this.rev_transition_obj[p][s].push(q)
                }
        }

        return this.rev_transition_obj[q][a]
    }
}

export default DFA