import { TRAVELER_CATEGORIES } from "./categories";
import { screen, fireEvent, render } from "@testing-library/react";
import { TravelerCounter } from "./TravelerCounter";

test("incrementing the adult counter should increment the adult count", () => {
  // Arrange
  const mockOnChange = jest.fn();
  const adultCategory = TRAVELER_CATEGORIES.find(
    (category) => category.type === "adults"
  );

  if (!adultCategory) {
    throw new Error("Category 'adults' not found in TRAVELER_CATEGORIES");
  }

  const initialTravelers = { adults: 1, children: 0, infants: 0 };

  render(
    <TravelerCounter
      category={adultCategory}
      travelers={initialTravelers}
      onChange={mockOnChange}
    />
  );

  // Act: Simulate a click to increment the counter
  const incrementButton = screen.getByLabelText(
    `Increase ${adultCategory.label}`
  );
  fireEvent.click(incrementButton);

  // Assert: Verify the onChange callback was called with the expected values
  expect(mockOnChange).toHaveBeenCalledWith("adults", 2);
});

test("decrementing the adult counter should decrement the adult count", () => {
  // Arrange
  const mockOnChange = jest.fn();
  const adultCategory = TRAVELER_CATEGORIES.find(
    (category) => category.type === "adults"
  );

  if (!adultCategory) {
    throw new Error("Category 'adults' not found in TRAVELER_CATEGORIES");
  }

  const initialTravelers = { adults: 2, children: 0, infants: 0 };

  render(
    <TravelerCounter
      category={adultCategory}
      travelers={initialTravelers}
      onChange={mockOnChange}
    />
  );

  // Act: Simulate a click to decrement the counter
  const decrementButton = screen.getByLabelText(
    `Decrease ${adultCategory.label}`
  );
  fireEvent.click(decrementButton);

  // Assert: Verify the onChange callback was called with the expected values
  expect(mockOnChange).toHaveBeenCalledWith("adults", 1);
});

test("incrementing the adult counter should not exceed the maximum count", () => {
  // Arrange
  const mockOnChange = jest.fn();
  const adultCategory = TRAVELER_CATEGORIES.find(
    (category) => category.type === "adults"
  );

  if (!adultCategory) {
    throw new Error("Category 'adults' not found in TRAVELER_CATEGORIES");
  }

  const initialTravelers = { adults: 9, children: 0, infants: 0 };

  render(
    <TravelerCounter
      category={adultCategory}
      travelers={initialTravelers}
      onChange={mockOnChange}
    />
  );

  // Act: Simulate a click to increment the counter
  const incrementButton = screen.getByLabelText(
    `Increase ${adultCategory.label}`
  );
  fireEvent.click(incrementButton);

  // Assert: Verify the onChange callback was not called
  expect(mockOnChange).not.toHaveBeenCalled();
});

describe("TRAVELER_CATEGORIES validateAdd", () => {
  test("validateAdd for adults and children ensures total does not exceed 9", () => {
    const adultCategory = TRAVELER_CATEGORIES.find(
      (category) => category.type === "adults"
    );
    const childCategory = TRAVELER_CATEGORIES.find(
      (category) => category.type === "children"
    );

    if (!adultCategory || !childCategory) {
      throw new Error("Required categories not found in TRAVELER_CATEGORIES");
    }

    // Test case where total travelers are less than 9
    expect(
      adultCategory.validateAdd({ adults: 5, children: 3, infants: 0 })
    ).toBe(true);
    expect(
      childCategory.validateAdd({ adults: 5, children: 3, infants: 0 })
    ).toBe(true);

    // Test case where total travelers equals 9
    expect(
      adultCategory.validateAdd({ adults: 6, children: 3, infants: 0 })
    ).toBe(false);
    expect(
      childCategory.validateAdd({ adults: 6, children: 3, infants: 0 })
    ).toBe(false);

    // Test case where total travelers exceed 9
    expect(
      adultCategory.validateAdd({ adults: 7, children: 3, infants: 0 })
    ).toBe(false);
    expect(
      childCategory.validateAdd({ adults: 7, children: 3, infants: 0 })
    ).toBe(false);
  });

  test("validateAdd for infants ensures adding another infant does not exceed adults", () => {
    const infantCategory = TRAVELER_CATEGORIES.find(
      (category) => category.type === "infants"
    );

    if (!infantCategory) {
      throw new Error("Category 'infants' not found in TRAVELER_CATEGORIES");
    }

    // Test case where adding an infant would still satisfy the condition
    expect(
      infantCategory.validateAdd({ adults: 2, children: 0, infants: 1 })
    ).toBe(true);

    // Test case where adding an infant would equal the number of adults (valid)
    expect(
      infantCategory.validateAdd({ adults: 2, children: 0, infants: 2 })
    ).toBe(false);

    // Test case where adding an infant would exceed the number of adults (invalid)
    expect(
      infantCategory.validateAdd({ adults: 2, children: 0, infants: 3 })
    ).toBe(false);
  });
});
