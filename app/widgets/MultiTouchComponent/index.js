import React, { Component } from 'react';
import { 
  View, 
  DeviceEventEmitter, 
  InteractionManager,
  Platform
} from 'react-native';
import ArrayUtils from 'utilities/ArrayUtils';

export default class MultiTouchComponent extends Component {

  /***

    Multi Touch Component
    _____________________

    Child attributes:

    * onMultiTouch - Function
    * onMultiPan   - Function (optional)

  ***/

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      componentFrames: [],
      activeTouches: [],
      softNavListener: null
    };
  }

  componentDidMount() {
    if (!this.state.loaded) {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ loaded: true });
      });
    }

    if (Platform.OS === 'android') {
      this.state.softNavListener = DeviceEventEmitter.addListener(
        'softNavDisplayEvent', 
        this.softNavDisplayChanged
      );
    }
  }

  componentWillUnmount() {
    this.state.softNavListener?.remove();
  }

  softNavDisplayChanged = () => {
    this.setState({
      loaded: false,
      componentFrames: [],
      activeTouches: []
    }, () => this.setState({ loaded: true }));
  }

  onStartShouldSetResponder = () => false;

  onTouchStart = event => {
    const touchCoordinates = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    };

    const touchedFrame = this.state.componentFrames.find(item => (
      this.isInsideFrame(touchCoordinates, item)
    ));

    if (touchedFrame) {
      const location = touchedFrame.panHandler 
        ? { 
          origin: touchCoordinates,
          offset: { x: 0, y: 0 } 
        } 
        : {};

      this.addActiveTouch(touchedFrame, location);
    }
  }

  onTouchMove = event => {
    const movedCoordinates = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    };

    const movedInComponent = this.state.componentFrames.find(item => (
      this.isInsideFrame(movedCoordinates, item)
    ));

    if (movedInComponent) {
      if (movedInComponent.panHandler) {
        this.handlePan(movedInComponent, movedCoordinates);
      }

      return;
    }

    this.handleCancelledTouches(event, movedCoordinates);
  };

  onTouchEnd = event => {
    const touchCount = event.nativeEvent.touches.length;
    if (!touchCount) {
      this.emptyTouches();
    }

    const releasedCoordinates = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    };

    const releasedComponent = this.state.componentFrames.find(item => (
      this.isInsideFrame(releasedCoordinates, item)
    ));

    if (releasedComponent) {
      releasedComponent.handler({ isActive: false });
      this.setState({
        activeTouches: this.state.activeTouches.filter(touch => (
          touch.component !== releasedComponent
        ))
      }, () => {
        if (touchCount < 1) {
          this.emptyTouches();
        }
      });
    }
  };

  handleCancelledTouches = (event, movedCoordinates) => {
    const touches = event.nativeEvent.touches;
    const cancelledTouch = this.state.activeTouches.find(item => (
      ArrayUtils.none(touches.map(touch => {
        const touchLocation = {
          x: touch.pageX,
          y: touch.pageY
        };

        return this.isInsideFrame(touchLocation, item.component);
      }))
    ));

    if (cancelledTouch) {
      if (cancelledTouch.component.panHandler) {
        this.handlePan(cancelledTouch.component, movedCoordinates);
        return;
      }

      cancelledTouch.component.handler({ isActive: false });
      this.setState({
        activeTouches: this.state.activeTouches.filter(touch => (
          touch.component !== cancelledTouch.component
        ))
      });
    }
  }

  handlePan = (component, coordinates) => {
    const activeTouch = this.state.activeTouches.find(item => (
      item.component.key === component.key
    ));

    if (activeTouch) {
      const touchOffset = {
        x: coordinates.x - activeTouch.origin.x,
        y: coordinates.y - activeTouch.origin.y
      };

      this.setState({
        activeTouches: this.state.activeTouches.map(touch => {
          if (touch.key !== activeTouch.key) {
            return touch;
          }

          return { ...touch, offset: touchOffset };
        })
      });

      activeTouch.component.panHandler({
        coordinates: {
          x0: activeTouch.origin.x,
          y0: activeTouch.origin.y,
          dx: touchOffset.x,
          dy: touchOffset.y
        }
      });
    }
  };

  addActiveTouch = (touchedComponent, location) => {
    touchedComponent.handler({ isActive: true });
    this.setState({
      activeTouches: [
        ...this.state.activeTouches,
        { 
          ...location,
          component: touchedComponent
        }
      ]
    });
  };

  emptyTouches = () => {
    const remainingTouches = [...this.state.activeTouches];
    this.setState({ activeTouches: [] });

    remainingTouches.forEach(touch => touch.component.handler({ isActive: false }));
  };

  isInsideFrame = (touch, component) => {
    const frame = component.frame;

    if (!component.panHandler) {
      return ArrayUtils.all([
        touch.x >= frame.x,
        touch.y >= frame.y,
        touch.x < frame.x + frame.width,
        touch.y < frame.y + frame.height
      ]);
    }

    const activeTouch = this.state.activeTouches.find(item => (
      item.component.key === component.key
    ));

    const offsetX = activeTouch?.offset?.x || 0;
    const offsetY = activeTouch?.offset?.y || 0;

    return ArrayUtils.all([
      touch.x >= frame.x + offsetX,
      touch.y >= frame.y + offsetY,
      touch.x < frame.x + offsetX + frame.width,
      touch.y < frame.y + offsetY + frame.height
    ]);
  }
  
  addTouchable = (key, childProps) => {
    this[key].measure((_fx, _fy, width, height, px, py) => {
      const frameAlreadyAdded = this.state.componentFrames.some(item => (
        item.key === key
      ));

      if (!frameAlreadyAdded) {
        this.setState({
          componentFrames: [
            ...this.state.componentFrames,
            {
              key: key,
              frame: { x: px, y: py, width: width, height: height },
              handler: childProps.onMultiTouch,
              panHandler: childProps.onMultiPan
            }
          ]
        });
      }
    });
  };

  cloneChild = (key, child, childrenProps) => React.cloneElement(child, {
    ...childrenProps,
    ...(child.props.onMultiTouch
      ? {
        ref: view => { 
          child.ref && child.ref(view);
          this[key] = view;
        },
        onLayout: () => this.addTouchable(key, child.props)
      }
      : {}),
    key: key
  });

  mapChildren = (children, callback) => children.map(child => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const childrenProps = {};
    if (child.props.children) {
      const childrenValue = Array.isArray(child.props.children)
        ? child.props.children
        : [child.props.children];

      childrenProps.children = this.mapChildren(childrenValue, callback);
    }

    return callback(child, childrenProps);
  });

  render() {
    let childIndex = 0;
    return (
      <View
        {...this.props}
        onStartShouldSetResponder={this.onStartShouldSetResponder}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
        {this.state.loaded && this.mapChildren(this.props.children, 
          (child, childrenProps) => {
            if (!child.props.onMultiTouch && !childrenProps.children) {
              return child;
            }

            const key = child.key || `touchable-${childIndex++}`;
            return this.cloneChild(key, child, childrenProps);
          })
        }
      </View>
    );
  }
}
