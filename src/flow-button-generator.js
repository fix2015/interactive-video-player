/**
 * A class responsible for generating flow buttons and handling their click events.
 * It dynamically creates buttons for each available flow (excluding the current one),
 * and attaches event listeners to handle flow changes when the buttons are clicked.
 */
export default class FlowButtonGenerator {
  /**
   * Creates an instance of FlowButtonGenerator.
   * @param {string} currentFlow - The name of the current flow.
   * @param {boolean} waitingFlow - A flag indicating whether the flow is waiting to be changed.
   * @param {Function} runFlow - The function that is triggered to run a new flow.
   * @param {Object} VIDEO - The object containing video configurations for different flows.
   */
  constructor(currentFlow, runFlow, VIDEO, wrapper) {
    this.currentFlow = currentFlow;
    this.waitingFlow = false;
    this.runFlow = runFlow;
    this.VIDEO = VIDEO;
    this.wrapper = wrapper;
    this.flowContainer = this.createFlowBlock(); 
    this.wrapper.appendChild(this.flowContainer);
    this.buttonContainer = null;  
  }

  createFlowBlock() {
    const div = document.createElement('div');
    div.classList.add('flow');

    return div;
  }

  /**
   * Generates the flow buttons and appends them to the DOM.
   * It creates buttons for each available flow (excluding the current flow) 
   * and adds event listeners to trigger flow changes.
   * Clears the existing flow container before appending the buttons.
   */
  generate() {
    if (this.waitingFlow) return;

    this.waitingFlow = true;
    this.flowContainer.innerHTML = ''; // Clear existing content

    const flows = this.getAvailableFlows();
    this.buttonContainer = this.createButtonContainer();  // Create button container

    flows.forEach((flowName) => {
      const button = this.createFlowButton(flowName);
      this.addButtonEventListener(button, flowName);
      this.buttonContainer.appendChild(button);
    });

    this.flowContainer.appendChild(this.buttonContainer);  // Append the buttons to the flow container
  }

  /**
   * Gets the available flows excluding the current flow.
   * @returns {Array<string>} A list of flow names that are not the current flow.
   */
  getAvailableFlows() {
    return Object.keys(this.VIDEO).filter((data) => data !== this.currentFlow);
  }

  /**
   * Creates and returns the container element for the flow buttons.
   * @returns {HTMLElement} The container div for the buttons.
   */
  createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flow--buttons');
    return buttonContainer;
  }

  /**
   * Creates a flow button element for a specific flow.
   * @param {string} flowName - The name of the flow to create a button for.
   * @returns {HTMLElement} The created button element.
   */
  createFlowButton(flowName) {
    const button = document.createElement('button');
    button.classList.add('flow--button');
    button.textContent = flowName;
    return button;
  }

  /**
   * Adds an event listener to a flow button. When the button is clicked, it triggers the flow change.
   * @param {HTMLElement} button - The flow button element.
   * @param {string} flowName - The name of the flow to be triggered.
   */
  addButtonEventListener(button, flowName) {
    button.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.currentFlow = flowName;
      this.waitingFlow = false;
      this.runFlow(flowName);
      this.flowContainer.innerHTML = ''; // Clear the flow container after button click
    };
  }

  /**
   * Cleans up the event listeners and DOM elements related to flow buttons.
   * This method should be called when the flow buttons are no longer needed.
   */
  destroy() {
    this.flowContainer.innerHTML = ''; 

    if (this.buttonContainer) {
      this.buttonContainer = null; 
    }

    this.waitingFlow = false;
    this.currentFlow = null;
  }
}
