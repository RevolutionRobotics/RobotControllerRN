/** Override Blockly.alert() with custom implementation. */
Blockly.alert = function(message, callback) {
  if (!$('body').hasClass('swal2-shown')) {
    Swal.fire({
      title: message,
      text: '',
      type: 'info',
      heightAuto: false,
      allowOutsideClick: false
    }).then(function() {
      if (callback) {
        callback();
      }
    });
  }
};

/** Override Blockly.confirm() with custom implementation. */
Blockly.confirm = function(message, callback) {
  if (!$('body').hasClass('swal2-shown')) {
    Swal.fire({
      title: message,
      text: '',
      type: 'question',
      showCancelButton: true,
      allowOutsideClick: false,
      heightAuto: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'OK'
    }).then(function(result) {
      if (callback) {
        callback(!!result.value);
      }
    });
  }
};

/** Override Blockly.prompt() with custom implementation. */
Blockly.prompt = function(message, defaultValue, callback) {
  if ($('body').hasClass('webview')) {
    promptWebView(message, defaultValue, callback);
  } else {
    promptBrowser(message, defaultValue, callback);
  }
};

var promptBrowser = function(message, defaultValue, callback) {
  if (!$('body').hasClass('swal2-shown')) {
    Swal.fire({
      title: message,
      input: 'text',
      inputAttributes: {
        onfocus: 'Blockly.setInputListeners()'
      },
      showCancelButton: true,
      allowOutsideClick: false,
      heightAuto: false
    }).then(function(input) {
      if (input.value && callback) {
        callback(input.value);
      }
    });
  }
};

var promptWebView = function(message, defaultValue, callback) {
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
