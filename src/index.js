import { html, render } from "lit-html";

// Model is a singleton
const model = {
  value: 0
};

model.present = function (proposal) {
  // Logic that accepts or rejects the proposed values
  // ...

  if (proposal.incrementBy != null) {
    model.value = model.value + proposal.incrementBy;
    console.log(model.value)
  }
  if (proposal.reset != null) {
    model.value = proposal.reset;
  }

  // -> Reactive Loop
  state(model);

  // persist the new state
  // this is generally guarded and optimized
  model.persist();
}

model.persist = function () {
  // some persistence code
  // ...
}

// Actions are pure functions /////////////////////////////////////////////
function increment(data) {
  // Logic that prepares the data to be presented to the model

  // -> Reactive Loop
  present({ incrementBy: 1 });

  // to avoid a page reload
  return false;
}

function reset() {
  // Logic that prepares the data to be presented to the model
  // ...

  // -> Reactive Loop
  present({ reset: 0 });

  // to avoid a page reload
  return false;
}

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
  return { value, increment };
}

// control state
const limitReached = (sr) => sr.value > 10;

function e(evName, sr) {
  console.log(evName);
}

function nap(stateRepresentation) {
  if (limitReached(stateRepresentation)) {
    const event = e("onLimit", stateRepresentation);
    reset(event);
    return true;
  }

  return false;
}

// View is a pure function of the state representation /////////////////////////////////////////////
const view = {
  render({ value, increment }) {
    // render the view
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

// Wiring /////////////////////////////////////////////
//
// Actions are known to the stateRepresentation() and nap()
//
// Actions -> Model
const present = model.present;

// View -> Display
function display(nextState) {
  let view = document.getElementById("app");
  render(nextState, view);
}

model.present({})