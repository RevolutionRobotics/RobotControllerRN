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

  Object.keys(customBlocks).forEach(function(key) {
    Blockly.Blocks[key] = customBlocks[key].definition;
    Blockly.Python[key] = customBlocks[key].generatorStub;
  });

  workspace.addChangeListener(function(event) {
    if (event.type !== Blockly.Events.UI) {
      var outputData = generateOutput();
      var output = JSON.stringify(outputData);

      try {
        window.postMessage(output, '*', false);
      } catch (err) {
        console.log(outputData.pythonCode);
      }
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
