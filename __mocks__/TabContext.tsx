import React from 'react';

const mockSetActiveTab = jest.fn();
const mockActiveTab = 'catch';

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div data-testid="tab-provider">
      {children}
    </div>
  );
};

export const useTabContext = () => ({
  activeTab: mockActiveTab,
  setActiveTab: mockSetActiveTab,
});

// Export the mock functions for test assertions
export const tabContextMocks = {
  mockSetActiveTab,
  mockActiveTab,
}; 