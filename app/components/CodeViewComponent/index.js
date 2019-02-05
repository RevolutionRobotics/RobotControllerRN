import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { codeViewStyle as styles } from 'components/styles';

export default class CodeViewComponent extends Component {

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <SyntaxHighlighter
          customStyle={styles.highlighter}
          contentContainerStyle={styles.highlighterContent}
          language='python'
          highlighter={ 'prism' || 'hljs' }
        >
          {this.props.navigation.state.params.code}
        </SyntaxHighlighter>
      </SafeAreaView>
    );
  }
}
