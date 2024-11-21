import { produce } from "immer";
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

      return produce(state, draft => {
        draft.cycles.push(action.payload.newCycle);
        draft.activeCycleId = action.payload.newCycle.id
      })

    // Handle interrupting the current cycle
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })
      if (currentCycleIndex < 0) {
        return state
      }
      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].interruptedDate = new Date()
      })
    }

    // Handle marking the current cycle as finished
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })
      if (currentCycleIndex < 0) {
        return state
      }
      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].finishedDate = new Date()
      })
    }

    // Return the current state for unknown action types
    default:
      return state;
  }
}
