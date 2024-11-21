import { createContext, ReactNode, useReducer, useState } from 'react';
import { ActionTypes, Cycle, cyclesReducer } from '../reducers/cycles';

// Interface defining the data structure for creating a new cycle
interface CreateCycleData {
  task: string; // Task description
  minutesAmount: number; // Duration of the cycle in minutes
}

// Interface defining the structure of the context to be shared
interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

// Create the context for cycles, initializing with an empty object
export const CyclesContext = createContext({} as CyclesContextType);

// Interface for the props expected by the CyclesContextProvider
interface CyclesContextProviderProps {
  children: ReactNode;
}

// Context provider component for managing and sharing cycles state
export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  // Reducer hook to manage the state of cycles
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  });

  // State hook to track the number of seconds passed for the current cycle
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  // Destructure cycles and activeCycleId from the reducer state
  const { cycles, activeCycleId } = cyclesState;

  // Find the active cycle based on its ID
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  // Function to update the seconds passed for the current cycle
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  // Function to mark the current cycle as finished
  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
      payload: { activeCycleId },
    });
  }

  // Function to create a new cycle
  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: { newCycle },
    });

    setAmountSecondsPassed(0);
  }

  // Function to interrupt the current cycle
  function interruptCurrentCycle() {
    dispatch({
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
      payload: { activeCycleId },
    });
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}