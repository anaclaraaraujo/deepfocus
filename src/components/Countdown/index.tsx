import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";
import { CountdownContainer, Separator } from "./styles";

export function Countdown() {
  
  // Accessing values and functions from CyclesContext
  const {
    activeCycle, // Currently active cycle, if any
    activeCycleId, // ID of the active cycle
    markCurrentCycleAsFinished, // Function to mark the active cycle as finished
    amountSecondsPassed, // Number of seconds passed in the current cycle
    setSecondsPassed, // Function to update the seconds passed
  } = useContext(CyclesContext);

  // Calculate the total seconds for the active cycle or default to 0
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      // Start an interval to update the countdown every second
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(), // Current time
          activeCycle.startDate // Start time of the active cycle
        );

        if (secondsDifference >= totalSeconds) {
          // If the cycle has completed, mark it as finished
          markCurrentCycleAsFinished();

          setSecondsPassed(totalSeconds); // Set the passed time to total time
          clearInterval(interval); // Clear the interval to stop updates
        } else {
          setSecondsPassed(secondsDifference); // Update passed time
        }
      }, 1000); // Execute every second
    }

    return () => {
      clearInterval(interval); // Cleanup: clear the interval when component unmounts or dependencies change
    };
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    setSecondsPassed,
    markCurrentCycleAsFinished,
  ]);

  // Calculate the current remaining seconds in the active cycle
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  // Convert the remaining seconds into minutes and seconds
  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  // Format minutes and seconds to always show two digits
  const minutes = String(minutesAmount).padStart(2, '0');
  const seconds = String(secondsAmount).padStart(2, '0');

  useEffect(() => {
    if (activeCycle) {
      // Update the document title with the remaining time
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}
