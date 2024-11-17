import FlowButtonGenerator from './FlowButtonGenerator';

// Mock configuration for testing
const mockConfig = {
  VIDEO: {
    flow1: [{ link: 'video1.mp4' }],
    flow2: [{ link: 'video2.mp4' }],
    flow3: [{ link: 'video3.mp4' }],
  },
  testSpeedLink: 'testLink',
  startFlow: 'flow1',
};

describe('FlowButtonGenerator Class', () => {
  let wrapper;
  let flowButtonGenerator;

  beforeEach(() => {
    // Create a mock wrapper div to simulate DOM structure
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    flowButtonGenerator = new FlowButtonGenerator(
      mockConfig.startFlow,
      jest.fn(),
      mockConfig.VIDEO,
      wrapper
    );
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  it('should create a flow container', () => {
    expect(flowButtonGenerator.flowContainer).toBeInTheDocument();
    expect(flowButtonGenerator.flowContainer).toHaveClass('flow');
  });

  it('should generate buttons for all flows except the current flow', () => {
    flowButtonGenerator.generate();

    const buttons = flowButtonGenerator.flowContainer.querySelectorAll('button');
    expect(buttons.length).toBe(2);  // It should exclude the current flow ('flow1')
    expect(buttons[0]).toHaveTextContent('flow2');
    expect(buttons[1]).toHaveTextContent('flow3');
  });

  it('should trigger the runFlow method when a button is clicked', () => {
    const runFlowMock = jest.fn();
    flowButtonGenerator.runFlow = runFlowMock;

    flowButtonGenerator.generate();

    const buttons = flowButtonGenerator.flowContainer.querySelectorAll('button');
    buttons[0].click(); // Click on the first button (flow2)

    expect(runFlowMock).toHaveBeenCalledWith('flow2');
    expect(flowButtonGenerator.currentFlow).toBe('flow2');
    expect(flowButtonGenerator.waitingFlow).toBe(false);
  });

  it('should clear the flow container after a button is clicked', () => {
    flowButtonGenerator.generate();

    expect(flowButtonGenerator.flowContainer.innerHTML).not.toBe('');
    const buttons = flowButtonGenerator.flowContainer.querySelectorAll('button');
    buttons[0].click();

    expect(flowButtonGenerator.flowContainer.innerHTML).toBe('');
  });

  it('should not generate buttons if waiting for flow', () => {
    flowButtonGenerator.waitingFlow = true;
    flowButtonGenerator.generate();

    expect(flowButtonGenerator.flowContainer.innerHTML).toBe('');
  });

  it('should clean up buttons and internal state when destroy is called', () => {
    flowButtonGenerator.generate();
    expect(flowButtonGenerator.flowContainer.innerHTML).not.toBe('');

    flowButtonGenerator.destroy();

    expect(flowButtonGenerator.flowContainer.innerHTML).toBe('');
    expect(flowButtonGenerator.buttonContainer).toBeNull();
    expect(flowButtonGenerator.waitingFlow).toBe(false);
    expect(flowButtonGenerator.currentFlow).toBeNull();
  });

  it('should create and append flow buttons to the container', () => {
    flowButtonGenerator.generate();
    
    const buttons = flowButtonGenerator.flowContainer.querySelectorAll('button');
    expect(buttons.length).toBe(2); // 'flow2' and 'flow3' buttons
    expect(buttons[0].textContent).toBe('flow2');
    expect(buttons[1].textContent).toBe('flow3');
  });
});
