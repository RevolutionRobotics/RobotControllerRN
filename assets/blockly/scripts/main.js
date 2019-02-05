(function() {
  var generateOutput = function() {
    var xmlDom = Blockly.Xml.workspaceToDom(workspace);

    return {
      xmlData: Blockly.Xml.domToText(xmlDom),
      pythonCode: Blockly.Python.workspaceToCode(workspace)
    };
  };

  var workspace = Blockly.inject('blockly-div', {
    toolbox: document.getElementById('toolbox'),
    css: true,
    horizontalLayout: false,
    oneBasedIndex: false
  });

  workspace.addChangeListener(function(event) {
    if (event.type !== Blockly.Events.UI) {
      var output = JSON.stringify(generateOutput());
      window.postMessage(output, '*', false);
    }
  });

  document.addEventListener('message', function(message) {
    Blockly.mainWorkspace.clear();

    if (message.data) {
      var dom = Blockly.Xml.textToDom(message.data);
      Blockly.Xml.domToWorkspace(dom, workspace);
    }
  });
})();
