import './styles.css'
import { html, render } from "lit-html";
import { stream, scan } from "flyd"
import merge from "mergerino"

// Model is a singleton
const intialModel = {
  value: 0
}

const update = stream()
const modelStream = scan(merge, intialModel, update)

function present (proposal, payload) {
  // Logic that accepts or rejects the proposed values
  // ...

  if (proposal === INCREMENT) {
    update({ value: v => v + payload})
  }
  if (proposal === RESET) {
    update({ value: payload })
  }

  // -> Reactive Loop
  state(modelStream());

  // persist the new state
  // this is generally guarded and optimized
  persist();
}

function persist () {
  // some persistence code
  // ...
}

// Actions are pure functions /////////////////////////////////////////////
// Actions are known to the stateRepresentation() and nap()
const INCREMENT = 'INCREMENT'
const RESET = 'RESET'

// control state
const limitReached = (sr) => sr.value > 10;

// Next action predicate
const nap = sr => limitReached(sr) ? (present(RESET, 0), true): false

// State is a pure function /////////////////////////////////////////////
function state(model) {
  // Compute State Representation
  const sr = getStateRepresentation(model);
  // Invoke next-action-predicate
  if (!nap(sr)) {
    // Render the view when no next action is invoked
    view.render(sr);
  }
}

function getStateRepresentation({value}) {
  return { value, present };
}

// View is a pure function of the state representation /////////////////////////////////////////////
const view = {
  render({ value, present }) {
    // render the view
    let increment = () => present(INCREMENT, 1)
    let output = html`
        <div>Count: ${value}</div>
        <div><button @click=${increment}>Increment</button></div>
        `;
    // ...

    // wire the possible actions in the view
    //output = output + `${c}`

    // ...
    // -> Complete Reactive Loop
    display(output);
  }
};

// View -> Display
function display(nextState) {
  let view = document.getElementById("app");
  render(nextState, view);
}

present({})