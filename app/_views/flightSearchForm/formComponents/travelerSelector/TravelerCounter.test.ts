import { TRAVELER_CATEGORIES } from "./categories";
import { render, screen, fireEvent } from "@testing-library/react";
import { TravelerCounter } from "./TravelerCounter";

test("incrementing the adult counter should increment the adult count", () => {
  // Arrange
  const mockOnChange = jest.fn();
  const adultCategory = TRAVELER_CATEGORIES.find(
    (category) => category.type === "adults"
  );
  const initialTravelers = { adults: 1, children: 0, infants: 0 };

  const wrapper = render(<TravelerCounter />);

  // Act: Simulate a click to increment the counter
  const incrementButton = screen.getByLabelText(
    `Increase ${adultCategory.label}`
  );
  fireEvent.click(incrementButton);

  // Assert: Verify the onChange callback was called with the expected values
  expect(mockOnChange).toHaveBeenCalledWith("adults", 2);
});
