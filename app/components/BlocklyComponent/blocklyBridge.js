const bridgeCode = () => {
  var generateOutput = function() {
    var xmlDom = Blockly.Xml.workspaceToDom(workspace);

    return {
      xmlData: Blockly.Xml.domToText(xmlDom),
      pythonCode: Blockly.Python.workspaceToCode(workspace)
    };
  };

  Blockly.mainWorkspace.addChangeListener(function(event) {
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

  Blockly.prompt = function(message, defaultValue, callback) {
    var outputData = {
      inputDialog: {
        message: message,
        defaultValue: defaultValue
      }
    };

    Blockly.onDialogInput = function(input) {
      if (callback) {
        callback(input);
      }
    };

    try {
      window.postMessage(JSON.stringify(outputData), '*');
    } catch (err) {
      console.log(err);
    }
  };

  document.addEventListener('message', function(message) {
    var messageData = JSON.parse(message.data);

    if (messageData.dialogValue) {
      Blockly.onDialogInput(messageData.dialogValue);
    } else if (messageData.domValue) {
      Blockly.mainWorkspace.clear();

      var dom = Blockly.Xml.textToDom(messageData.domValue);
      Blockly.Xml.domToWorkspace(dom, workspace);
    } else if (messageData.clear) {
      Blockly.mainWorkspace.clear();
    }
  });
};

const bridge = () => `(${bridgeCode.toString()})(); void(0);`;
export default bridge;
