import { createContext, ReactNode, useEffect, useReducer, useState } from 'react';
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer';
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from '../reducers/cycles/actions';
import { differenceInSeconds } from 'date-fns';

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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer, 
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        '@focus-deep:cycles-state-1.0.0',
      )
      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
      return initialState
    }
  );

  // Destructure cycles and activeCycleId from the reducer state
  const { cycles, activeCycleId } = cyclesState;

  // Find the active cycle based on its ID
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  // State hook to track the number of seconds passed for the current cycle
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }
    
    return 0;
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem('@focus-deep:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  // Function to update the seconds passed for the current cycle
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  // Function to mark the current cycle as finished
  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
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

    dispatch(addNewCycleAction(newCycle));

    setAmountSecondsPassed(0);
  }

  // Function to interrupt the current cycle
  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
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