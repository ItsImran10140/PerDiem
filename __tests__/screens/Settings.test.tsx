import { NavigationProp } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import { TabProvider } from "app/context/TabContext";
import Settings from "app/screens/Settings";

jest.mock('../../app/components/TabBar', () => {
    const MockedTabBar = () => null;
    return MockedTabBar;
  });
  
  
  jest.mock('../../app/context/TabContext', () => ({
    TabProvider: ({ children }: { children: React.ReactNode }) => children,
    useTabContext: () => ({
      activeTab: 'settings',
      setActiveTab: jest.fn(),
    }),
  }));

  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  } as unknown as NavigationProp<any, any>;
  
describe("Settings Component", ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it("Text Render Correctly", ()=>{
        const {getByText} = render(
            <TabProvider>
                <Settings navigation={mockNavigation}/>
            </TabProvider>
        );

        expect(getByText('Settings')).toBeTruthy();
    })
})