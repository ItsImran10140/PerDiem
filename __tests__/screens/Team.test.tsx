import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';
import Team from '../../app/screens/Team';
import { TabProvider } from '../../app/context/TabContext';
import { NavigationProp } from '@react-navigation/native';


jest.mock('../../app/components/TabBar', () => {
  const MockedTabBar = () => null;
  return MockedTabBar;
});


jest.mock('../../app/context/TabContext', () => ({
  TabProvider: ({ children }: { children: React.ReactNode }) => children,
  useTabContext: () => ({
    activeTab: 'team',
    setActiveTab: jest.fn(),
  }),
}));


const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as unknown as NavigationProp<any, any>;

describe('Team Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <TabProvider>
        <Team navigation={mockNavigation} />
      </TabProvider>
    );
    
 
    expect(getByText('My Team')).toBeTruthy();
    
  
    expect(getByText('Your captured Pokemon will appear here')).toBeTruthy();
  });

  it('has the correct layout structure', () => {
    const { UNSAFE_getAllByType } = render(
      <TabProvider>
        <Team navigation={mockNavigation} />
      </TabProvider>
    );
    
 
    const viewComponents = UNSAFE_getAllByType(View);
    expect(viewComponents.length).toBeGreaterThan(0);
  });

  it('renders with the correct structure', () => {
    const { toJSON } = render(
      <TabProvider>
        <Team navigation={mockNavigation} />
      </TabProvider>
    );
    const tree = toJSON();
    

    expect(tree).toMatchSnapshot();
  });

  it('passes navigation prop to TabBar', () => {
    const { UNSAFE_getAllByProps } = render(
      <TabProvider>
        <Team navigation={mockNavigation} />
      </TabProvider>
    );
    
    const tabBars = UNSAFE_getAllByProps({ navigation: mockNavigation });
    expect(tabBars.length).toBeGreaterThan(0);
    expect(tabBars[0].props.navigation).toBe(mockNavigation);
  });

  it('has the correct styling', () => {
    const { toJSON } = render(
      <TabProvider>
        <Team navigation={mockNavigation} />
      </TabProvider>
    );
    const tree = toJSON();
    
    expect(tree.props.style).toEqual(expect.objectContaining({
      flex: 1,
      backgroundColor: "white",
      position: 'relative',
    }));
  });
}); 