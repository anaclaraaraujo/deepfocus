import { HandPalm, Play } from "@phosphor-icons/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { createContext, useState } from "react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { Countdown } from "../../components/Countdown";
import { NewCycleForm } from "../../components/NewCycleForm";

//  Define the interface for a cycle with possible states
interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

// Define the shape of the context shared between components
interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
}

/// Create the cycles context, initializing with an empty object (required by TypeScript)
export const CyclesContext = createContext({} as CyclesContextType);

// Form validation schema using Zod
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
});

// Infer the form data type from the Zod schema
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  // State to store the list of cycles
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null); // ID do ciclo ativo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0); // Contador de segundos no ciclo ativo

  // Form configuration with validation
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  // Find the active cycle based on its ID
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

   // Update the seconds passed
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds); 
  }

  function markCurrentCycleAsFinished() {
    // Mark the active cycle as finished
    setCycles((state) =>
      state.map((cycle) =>
        cycle.id === activeCycleId ? { ...cycle, finishedDate: new Date() } : cycle
      )
    );
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
    // Create a new cycle based on the form data
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]); // Add the new cycle to the list
    setActiveCycleId(id); // Set the new cycle as active
    setAmountSecondsPassed(0); // Reset the seconds counter
    reset();
  }

  function handleInterruptCycle() {
    // Interrupt the active cycle
    setCycles((state) =>
      state.map((cycle) =>
        cycle.id === activeCycleId ? { ...cycle, interruptedDate: new Date() } : cycle
      )
    );
    setActiveCycleId(null); // Reset the active cycle ID
  }

  const task = watch('task'); // Watch the 'task' field of the form
  const isSubmitDisable = !task; // Disable the submit button if no task is provided

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>

        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >

          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisable} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}