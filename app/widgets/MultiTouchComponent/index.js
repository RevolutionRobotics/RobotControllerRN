import React, { Component } from 'react';
import { View } from 'react-native';
import ArrayUtils from 'utilities/ArrayUtils';

export default class MultiTouchComponent extends Component {

  constructor(props) {
    super(props);

    this.onStartShouldSetResponder = this.onStartShouldSetResponder.bind(this);
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
  };

  onTouchMove = event => {
    const movedCoordinates = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    };

    const movedInComponent = this.state.componentFrames.find(item => (
      this.isInsideFrame(movedCoordinates, item.frame, 20)
    ));

    if (movedInComponent) {
      return;
    }

    const cancelledTouch = this.state.activeTouches.find(item => (
      ArrayUtils.none(event.nativeEvent.touches.map(touch => {
        const touchLocation = {
          x: touch.pageX,
          y: touch.pageY
        };

        return this.isInsideFrame(touchLocation, item.component.frame, 20);
      }))
    ));

    if (cancelledTouch) {
      cancelledTouch.component.handler({ isActive: false });
      this.setState({
        activeTouches: this.state.activeTouches.filter(touch => (
          touch.component !== cancelledTouch.component
        ))
      });
    }
  };

  onTouchEnd = event => {
    if (!event.nativeEvent.touches.length) {
      this.emptyTouches();
      return;
    }

    const releasedCoordinates = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    };

    const releasedComponent = this.state.componentFrames.find(item => (
      this.isInsideFrame(releasedCoordinates, item.frame, 20)
    ));

    if (releasedComponent) {
      releasedComponent.handler({ isActive: false });
      this.setState({
        activeTouches: this.state.activeTouches.filter(touch => (
          touch.component !== releasedComponent
        ))
      });
    }
  };

  addTouch = (touchedComponent, eventId) => {
    touchedComponent.handler({ isActive: true });
    this.setState({
      activeTouches: [
        ...this.state.activeTouches,
        { 
          id: eventId,
          component: touchedComponent
        }
      ]
    });
  };

  emptyTouches = () => {
    const remainingTouches = [...this.state.activeTouches];

    this.setState({
      activeTouches: []
    });

    remainingTouches.forEach(touch => {
      touch.component.handler({ isActive: false })
    });
  };

  isInsideFrame = (touch, frame, tolerance) => ArrayUtils.all([
    touch.x >= frame.x - tolerance,
    touch.y >= frame.y - tolerance,
    touch.x < frame.x + frame.width + tolerance,
    touch.y < frame.y + frame.height + tolerance
  ]);

  mapChildren = (children, callback) => children.map(child => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const childrenProps = child.props.children?.length
      ? { children: this.mapChildren(child.props.children, callback) }
      : {};

    return callback(child, childrenProps);
  });

  addTouchable = (key, childProps) => {
    this[key].measure((fx, fy, width, height, px, py) => this.setState({
      componentFrames: [
        ...this.state.componentFrames,
        {
          frame: { x: px, y: py, width: width, height: height },
          handler: childProps.onMultiTouch
        }
      ]
    }));
  };

  cloneChild = (key, child, childrenProps) => React.cloneElement(child, {
    ...childrenProps,
    ...(child.props.onMultiTouch
      ? {
        ref: view => {
          child.ref && child.ref(view);
          this[key] = view;
        },
        onLayout: event => this.addTouchable(key, child.props)
      }
      : {}),
    key: child.props.key || key
  });

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

          const key = `touchable-${childIndex++}`;
          return this.cloneChild(key, child, childrenProps);
        })}
      </View>
    );
  }
}
