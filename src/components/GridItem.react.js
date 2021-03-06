import React, { Component } from 'react'
import PropTypes from 'prop-types';

/**
 * A class for displaying an item in a grid
 * Designed to be wrapped in a function, similar to a higher-order component. Otherwise
 * the layout will render incorrectly
 */
class GridItem extends Component {
  constructor(props) {
    super(props);
    this.relayout = this.relayout.bind(this);
  }

  componentDidUpdate(prevProps) {
    let updated = false;
    // Ensure that the layout has in fact changed before calling relayout
    const keys = ['w','h','x','y'];

    for (let key of keys) {
      if(this.props.layout[key] !== prevProps.layout[key]) {
        updated = true;
      }
    }

    if (updated) {
      this.relayoutChildren();
    }
  }

  componentDidMount() {
    this.relayoutChildren();
  }

  /**
   * Iterate over children and trigger a relayout event
   */
  relayoutChildren() {
    // Relayout after a time period so that the rest of the layout can render properly
    window.setTimeout(() => {
      React.Children.map(this.props.children, this.relayout);
    }, 500);
  }

  /**
   * Relayout the Plotly objects; modify their sizes to fit inside the columns
   */
  relayout(child) {
    if(child.props && child.props.id) {
      const id = child.props.id;
      const elem = document.getElementById(id);

      if(elem) {
        const parent = elem.parentElement.parentElement; //.react-grid-item

        let height = parent.offsetHeight;

        // If there are other elements in the GridItem, don't allow the
        // Plotly chart to completely fill the space
        if (Array.isArray(this.props.children) && this.props.children.length > 1) {
          height = height * this.props.chartSize;
        }

        const update = {
          width: parent.offsetWidth,
          height: height
        };

        try {
          window.Plotly.relayout(elem, update);
        } catch(e) {
          // Log the error
          window.console.log(e);
        }
      }
    }
  }

  render() {
    return (
      <div>{ this.props.children }</div>
    );
  }
}

GridItem.propTypes = {
  /**
   * An identifier for the component.
   * Synonymous with `key`, but `key` cannot be specified as
   * a PropType without causing errors. A caveat to this is that when using
   * the component in pure React (as opposed to via Dash), both `i` and `key`
   * must be specified
   */
  i: PropTypes.string.isRequired,

  /**
   * A list of child elements to place inside the grid ite,
   */
  children: PropTypes.node,

  /**
   * An object describing the layout of the element
   */
  layout: PropTypes.shape({
    /**
     * The x-value of the element location, in grid units
     */
    x: PropTypes.number.isRequired,

    /**
     * The y-value of the element location, in grid units
     */
    y: PropTypes.number.isRequired,

    /**
     * The width of the element, in grid units
     */
    w: PropTypes.number.isRequired,

    /**
     * The height of the element, in grid units
     */
    h: PropTypes.number.isRequired,

    /**
     * The minimum width of the element, in grid units
     */
    minW: PropTypes.number,

    /**
     * The maximum width of the element, in grid units
     */
    maxW: PropTypes.number,

    /**
     * The minimum height of the element, in grid units
     */
    minH: PropTypes.number,

    /**
     * The maximum height of the element, in grid units
     */
    maxH: PropTypes.number,

    /**
     * Is static: if true, the element is not resizable or draggable
     */
    static: PropTypes.bool,

    /**
     * If false, element can not be dragged
     */
    isDraggable: PropTypes.bool,

    /**
     * If false, the element can not be resized
     */
    isResizable: PropTypes.bool
  }),

  /**
   * A decimal representing the amount of space within the GridItem that a Plotly
   * chart should fill, if there are other elements within the GridItem
   */
  chartSize: PropTypes.number,

  /**
   * Dash-assigned callback that should be called whenever any of the properties change
   */
  setProps: PropTypes.func
};

GridItem.defaultProps = {
  chartSize: 2/3
};

export default GridItem;
