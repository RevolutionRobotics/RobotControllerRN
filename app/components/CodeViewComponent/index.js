import React, { Component } from 'react';
import { View } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';

export default class CodeViewComponent extends Component {

  render() {
    return (
      <SyntaxHighlighter
        language='python'
        highlighter={ "prism" || "hljs" }
      >
        {this.props.navigation.state.params.code}
      </SyntaxHighlighter>
    );
  }
}
