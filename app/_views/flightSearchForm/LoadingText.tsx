"use client";
import { useState, useEffect } from "react";

interface LoadingTextProps {
  isLoading: boolean;
}

export const LoadingText = ({ isLoading }: LoadingTextProps) => {
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    if (isLoading) {
      const loadingStates = ["Loading.", "Loading..", "Loading..."];
      let index = 0;

      const interval = setInterval(() => {
        index = (index + 1) % loadingStates.length;
        setLoadingText(loadingStates[index]);
      }, 800);

      return () => clearInterval(interval);
    } else {
      setLoadingText("Loading.");
    }
  }, [isLoading]);

  return isLoading ? <p>{loadingText}</p> : null;
};
