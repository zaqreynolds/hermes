import { fireEvent, render, screen } from "@testing-library/react";
import { TravelerSelector } from "./TravelerSelector";
import { useForm } from "react-hook-form";
import { flightSearchSchema } from "../../flightSearchSchema";
import { z } from "zod";
import { act } from "react";

type FormValues = z.infer<typeof flightSearchSchema>;

const TravelerSelectorTestWrapper = ({
  defaultTravelers,
}: {
  defaultTravelers: FormValues["travelers"];
}) => {
  const { control } = useForm<FormValues>({
    defaultValues: {
      travelers: defaultTravelers,
    },
  });

  return <TravelerSelector control={control} isMobile={false} />;
};

test("renders TravelerSelector with initial state", () => {
  render(
    <TravelerSelectorTestWrapper
      defaultTravelers={{ adults: 1, children: 0, infants: 0 }}
    />
  );

  // Verify the initial label
  expect(screen.getByRole("combobox")).toHaveTextContent("1 Traveler");
});

test("updates the total traveler count when the count changes", async () => {
  render(
    <TravelerSelectorTestWrapper
      defaultTravelers={{ adults: 1, children: 0, infants: 0 }}
    />
  );

  // Open the popover
  await act(async () => {
    fireEvent.click(screen.getByRole("combobox"));
  });

  // Increment the "Adults" count
  const incrementButton = screen.getByLabelText("Increase Adults");
  await act(async () => {
    fireEvent.click(incrementButton);
  });

  // Verify that the combobox label updates correctly
  expect(screen.getByRole("combobox")).toHaveTextContent("2 Travelers");
});

test("reducing adults adjusts infants correctly", async () => {
  // Arrange: Start with 2 adults and 2 infants
  render(
    <TravelerSelectorTestWrapper
      defaultTravelers={{ adults: 2, children: 0, infants: 2 }}
    />
  );

  // Open the popover
  await act(async () => {
    fireEvent.click(screen.getByRole("combobox"));
  });

  // Decrement the "Adults" count
  const decrementAdultsButton = screen.getByLabelText("Decrease Adults");
  await act(async () => {
    fireEvent.click(decrementAdultsButton);
  });

  // Assert: The combobox label updates and the number of infants adjusts
  expect(screen.getByRole("combobox")).toHaveTextContent("2 Travelers"); // 1 adult, 1 infant
});

test("reducing adults does not adjust infants if infants are already fewer", async () => {
  // Arrange: Start with 2 adults and 1 infant
  render(
    <TravelerSelectorTestWrapper
      defaultTravelers={{ adults: 2, children: 0, infants: 1 }}
    />
  );

  // Open the popover
  await act(async () => {
    fireEvent.click(screen.getByRole("combobox"));
  });

  // Decrement the "Adults" count
  const decrementAdultsButton = screen.getByLabelText("Decrease Adults");
  await act(async () => {
    fireEvent.click(decrementAdultsButton);
  });

  // Assert: The combobox label updates, but the number of infants remains the same
  expect(screen.getByRole("combobox")).toHaveTextContent("2 Travelers"); // 1 adult, 1 infant
});
