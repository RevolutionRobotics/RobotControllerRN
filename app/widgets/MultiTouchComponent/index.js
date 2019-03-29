import React, { Component } from 'react';
import { 
  View, 
  PanResponder,
  findNodeHandle
} from 'react-native';

const RCTUIManager = require('NativeModules').UIManager;

export default class MultiTouchComponent extends Component {

  constructor(props) {
    super(props);

    this.onStartShouldSetResponder = this.onStartShouldSetResponder.bind(this);
    //this.onResponderRelease = this.onResponderRelease.bind(this);

    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.state = {
      componentFrames: [],
      activeTouches: []
    };
  }

  onStartShouldSetResponder = event => {
    const touchCoordinates = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    };

    const touchedComponent = this.state.componentFrames.find(item => (
      this.isInsideFrame(touchCoordinates, item.frame, 10)
    ));

    if (touchedComponent) {
      this.addTouch(touchedComponent, event.nativeEvent.identifier);
    }

    return false;
  }

  onTouchMove = event => {
    const movedCoordinates = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    };

    const movedInComponent = this.state.componentFrames.find(item => (
      this.isInsideFrame(movedCoordinates, item.frame, 10)
    ));

    if (movedInComponent) {
      return;
    }

    const cancelledTouch = this.state.activeTouches.find(touch => (
      touch.id === event.nativeEvent.identifier
    ));

    if (cancelledTouch) {
      this.setState({
        activeTouches: this.state.activeTouches.filter(touch => (
          touch.id !== cancelledTouch.id
        ))
      }, () => {
        setTimeout(() => cancelledTouch.handler({ isActive: false }), 0);
      });
    }
  }

  onTouchEnd = event => {
    const releasedCoordinates = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    };

    const releasedComponent = this.state.componentFrames.find(item => (
      this.isInsideFrame(releasedCoordinates, item.frame, 20)
    ));

    if (releasedComponent) {
      this.setState({
        activeTouches: this.state.activeTouches.filter(touch => (
          touch.component !== releasedComponent
        ))
      }, () => {
        setTimeout(() => releasedComponent.handler({ isActive: false }), 0);
      });
    }
  }

  addTouch = (touchedComponent, eventId) => {
    this.setState({
      activeTouches: [
        ...this.state.activeTouches,
        { 
          id: eventId,
          handler: touchedComponent.handler
        }
      ]
    }, () => {
      setTimeout(() => touchedComponent.handler({ isActive: true }), 0);
    });
  }

  isInsideFrame = (touch, view, tolerance) => [
    touch.x >= view.x - tolerance,
    touch.y >= view.y - tolerance,
    touch.x < view.x + view.width + tolerance,
    touch.y < view.y + view.height + tolerance
  ]
  .every(condition => condition);

  mapChildren = (children, callback) => children.map(child => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const childrenProps = child.props.children?.length
      ? { children: this.mapChildren(child.props.children, callback) }
      : {};

    return callback(child, childrenProps);
  });

  addTouchable = (event, childProps) => {
    RCTUIManager.measure(findNodeHandle(event.nativeEvent.target), (fx, fy, width, height, px, py) => {
      console.log(childProps.style.borderWidth);

      this.setState({
        componentFrames: [
          ...this.state.componentFrames,
          {
            touchLocation: {
              x: null,
              y: null
            },
            frame: { x: px, y: py, width: width, height: height },
            handler: childProps.onMultiTouch
          }
        ]
      });
    });
  };

  render() {
    let childIndex = 0;
    return (
      <View
        {...this.props}
        onStartShouldSetResponder={this.onStartShouldSetResponder}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
        {this.mapChildren(this.props.children, (child, childrenProps) => {
          if (!child.props.onMultiTouch && !Object.keys(childrenProps).length) {
            return child;
          }

          const onLayoutProps = child.props.onMultiTouch 
            ? { onLayout: event => this.addTouchable(event, child.props) }
            : {};

          return React.cloneElement(child, {
            ...childrenProps,
            ...onLayoutProps,
            key: child.props.key || `touchable-${childIndex++}`
          });
        })}
      </View>
    );
  }
}
