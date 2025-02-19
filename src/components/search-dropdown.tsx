import React, { useState, useEffect, useRef } from "react";

const SearchDropdown = ({ optionList, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown container

  // Filter options based on search term
  const filteredOptions = optionList.filter(
    (option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedOptions.includes(option), // Exclude already selected options
  );

  // Handle option selection
  const handleSelect = (option) => {
    const newSelectedOptions = [...selectedOptions, option];
    setSelectedOptions(newSelectedOptions);
    onSelect(newSelectedOptions); // Pass the updated list of selected options
    setSearchTerm("");
  };

  // Handle removing a selected option
  const handleRemove = (option) => {
    const newSelectedOptions = selectedOptions.filter(
      (item) => item !== option,
    );
    setSelectedOptions(newSelectedOptions);
    onSelect(newSelectedOptions); // Pass the updated list of selected options
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      {/* Input field */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black"
      />

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-black border border-gray-300 rounded-md shadow-lg">
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                className="p-2 hover:bg-gray-700 cursor-pointer"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected options */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedOptions.map((option, index) => (
          <div
            key={index}
            className="flex items-center bg-black rounded-md px-2 py-1"
          >
            <span className="mr-2">{option}</span>
            <button
              onClick={() => handleRemove(option)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchDropdown;
