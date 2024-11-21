import { ActionTypes } from "./actions";

// Interface representing the structure of a cycle
export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

// Interface for the application's state related to cycles
interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}


// Reducer function to manage the state of cycles
export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    // Handle adding a new cycle
    case ActionTypes.ADD_NEW_CYCLE:
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      }
    // Handle interrupting the current cycle
    case ActionTypes.INTERRUPT_CURRENT_CYCLE:
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          // Update the interrupted date of the active cycle
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, interruptedDate: new Date() }
          } else {
            return cycle;
          }
        }),
        activeCycleId: null, // Clear the active cycle ID
      }
    // Handle marking the current cycle as finished
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          // Update the finished date of the active cycle
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, finishedDate: new Date() }
          } else {
            return cycle;
          }
        }),
        activeCycleId: null, // Clear the active cycle ID
      }
    // Return the current state for unknown action types
    default:
      return state;
  }
}
