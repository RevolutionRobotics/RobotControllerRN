/** Override Blockly.alert() with custom implementation. */
Blockly.alert = function(message, callback) {
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
};

/** Override Blockly.confirm() with custom implementation. */
Blockly.confirm = function(message, callback) {
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
};

/** Override Blockly.prompt() with custom implementation. */
Blockly.prompt = function(message, defaultValue, callback) {
  Swal.fire({
    title: message,
    input: 'text',
    showCancelButton: true,
    allowOutsideClick: false,
    heightAuto: false
  }).then(function(input) {
    if (input.value && callback) {
      callback(input.value);
    }
  });

  var input = $('.swal2-input');
  var container = $('.swal2-popup');

  input.focus(function() {
    if (!container.hasClass('focused')) {
      container.addClass('focused');
    }
  });

  input.blur(function() {
    if (container.hasClass('focused')) {
      container.removeClass('focused');
    }
  });
};