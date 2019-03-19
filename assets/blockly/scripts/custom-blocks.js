var customBlocks = {
  block_terminate_program: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("terminate program");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      Blockly.Python.definitions_['import_robot_lib'] = 'import robot_lib';
      var code = 'Control.terminate_program()\n';
      return code;
    }
  },
  block_terminate_all: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("terminate all");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      Blockly.Python.definitions_['import_robot_lib'] = 'import robot_lib';
      var code = 'Control.terminate_all()\n';
      return code;
    }
  },
  block_wait: {
    definition: {
      init: function() {
        this.appendValueInput("WAIT")
            .setCheck("Number")
            .appendField("wait");
        this.appendDummyInput()
            .appendField("sec");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      Blockly.Python.definitions_['import_time'] = 'import time';
      var value_wait = Blockly.Python.valueToCode(block, 'WAIT', Blockly.Python.ORDER_ATOMIC);
      var code = 'time.sleep(' + value_wait + ')\n';
      return code;
    }
  },
  block_global_timer: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("global timer [sec]");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      Blockly.Python.definitions_['import_robot_lib'] = 'import robot_lib';
      var code = 'Control.get_global_timer()\n';
      return code;
    }
  },
  block_repeat_forever: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("repeat forever");
        this.appendStatementInput("STATEMENT")
            .setCheck(null)
            .appendField("do");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var statements_statement = Blockly.Python.statementToCode(block, 'STATEMENT');
      var branch = Blockly.Python.addLoopTrap(statements_statement, block.id) ||
      Blockly.Python.PASS;

      var code = 'while True:\n' + branch;
      return code;
    }
  },
  block_break: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("break");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var code = 'break\n';
      return code;
    }
  },
  block_repeat_while: {
    definition: {
      init: function() {
        this.appendValueInput("CONDITION")
            .setCheck("Boolean")
            .appendField("repeat while");
        this.appendStatementInput("STATEMENT")
            .setCheck(null)
            .appendField("do");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var value_condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_ATOMIC);
      var statements_statement = Blockly.Python.statementToCode(block, 'STATEMENT');
      
      var branch = Blockly.Python.addLoopTrap(statements_statement, block.id) ||
      Blockly.Python.PASS;

      var code = 'while ' + (value_condition || 'False') + ':\n' + branch;
      return code;
    }
  },
  block_repeat_until: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("repeat");
        this.appendStatementInput("STATEMENT")
            .setCheck(null)
            .appendField("do");
        this.appendValueInput("CONDITION")
            .setCheck("Boolean")
            .appendField("until");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var statements_statement = Blockly.Python.statementToCode(block, 'STATEMENT');
      var value_condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_ATOMIC);

      var branch = Blockly.Python.addLoopTrap(statements_statement, block.id) ||
      Blockly.Python.PASS;

      branch += '  if ' + (value_condition || 'True') + ': break\n'

      var code = 'while True:\n' + branch;
      return code;
    }
  },
  block_drive: {
    definition: {
      init: function() {
        this.appendDummyInput()
          .appendField("Drive")
          .appendField("Direction:")
          .appendField(new Blockly.FieldDropdown([
            ["forward","Motor.DIRECTION_FWD"], 
            ["left","Motor.DIRECTION_LEFT"],
            ["right","Motor.DIRECTION_RIGHT"],
            ["backward","Motor.DIRECTION_BACK"],
          ]), "DIRECTION");
        this.appendValueInput("ROTATION")
          .setCheck("Number");
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ["rotation","Motor.UNIT_ROT"], 
            ["sec","Motor.UNIT_SEC"]
          ]), "UNIT_ROTATION");
        this.appendValueInput("SPEED")
          .setCheck("Number");
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ["rpm","Motor.UNIT_SPEED_RPM"], 
            ["power","Motor.UNIT_SPEED_PWR"]
          ]), "UNIT_SPEED");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var dropdown_direction = block.getFieldValue('DIRECTION');
      var number_rotation = Blockly.Python.valueToCode(block, 'ROTATION', Blockly.Python.ORDER_ATOMIC);
      var unit_rotation = block.getFieldValue('UNIT_ROTATION');
      var number_speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_ATOMIC);
      var unit_speed = block.getFieldValue('UNIT_SPEED');

      Blockly.Python.definitions_['import_robot_lib'] = 'import robot_lib';
      var code = 'Motor.drive(' 
        + 'direction=' + dropdown_direction + ', '
        + 'rotation=' + number_rotation + ', '
        + 'unit_rotation=' + unit_rotation + ', '
        + 'speed=' + number_speed + ', '
        + 'unit_speed=' + unit_speed
        + ')\n';

      return code;
    }
  },
  block_motor: {
    definition: {
      init: function() {
        this.appendDummyInput()
          .appendField("Motor")
          .appendField("Name:")
          .appendField(new Blockly.FieldTextInput("M1"), "NAME")
          .appendField("Rotation:")
          .appendField(new Blockly.FieldDropdown([
            ["clockwise","Motor.DIR_CW"], 
            ["counter clockwise","Motor.DIR_CCW"]
          ]), "DIRECTION");
        this.appendValueInput("ROTATION")
          .setCheck("Number");
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ["deg","Motor.UNIT_DEG"], 
            ["rotation","Motor.UNIT_ROT"], 
            ["sec","Motor.UNIT_SEC"]
          ]), "UNIT_ROTATION");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var text_name = block.getFieldValue('NAME');
      var dropdown_direction = block.getFieldValue('DIRECTION');
      var number_rotation = Blockly.Python.valueToCode(block, 'ROTATION', Blockly.Python.ORDER_ATOMIC);
      var dropdown_unit = block.getFieldValue('UNIT_ROTATION');

      Blockly.Python.definitions_['import_robot_lib'] = 'import robot_lib';
      var code = 'Motor.motor(' 
        + "name='" + text_name + "', "
        + 'direction=' + dropdown_direction + ', '
        + 'rotation=' + number_rotation + ', '
        + 'unit_rotation=' + dropdown_unit
        + ')\n';

      return code;
    }
  },
  block_stop_motor: {
    definition: {
      init: function() {
        this.appendDummyInput()
          .appendField("Stop")
          .appendField("Motor:")
          .appendField(new Blockly.FieldTextInput("M1"), "NAME")
          .appendField(new Blockly.FieldDropdown([
            ["Stop & hold","Motor.ACTION_STOP_AND_HOLD"], 
            ["Release","Motor.ACTION_RELEASE"]
          ]), "STOP_ACTION");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var text_name = block.getFieldValue('NAME');
      var dropdown_action = block.getFieldValue('STOP_ACTION');

      Blockly.Python.definitions_['import_robot_lib'] = 'import robot_lib';
      var code = 'Motor.stop('
        + "name='" + text_name + "', "
        + 'action=' + dropdown_action
        + ')\n';
      return code;
    }
  },
  block_stop_all_motors: {
    definition: {
      init: function() {
        this.appendDummyInput()
          .appendField("Stop all motors")
          .appendField("Action:")
          .appendField(new Blockly.FieldDropdown([
            ["Stop & hold","Motor.ACTION_STOP_AND_HOLD"], 
            ["Release","Motor.ACTION_RELEASE"]
          ]), "STOP_ALL_ACTION");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var dropdown_action = block.getFieldValue('STOP_ALL_ACTION');

      Blockly.Python.definitions_['import_robot_lib'] = 'import robot_lib';
      var code = 'Motor.stop_all(action=' + dropdown_action + ')\n';
      return code;
    }
  },
  block_ultrasonic_sensor: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("Ultrasonic sensor");
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      Blockly.Python.definitions_['import_robot_lib'] = 'import robot_lib';
      var code = 'Sensor.get_ultrasonic_value()\n';
      return [code, Blockly.Python.ORDER_NONE];
    }
  },
  block_bumper: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("Bumper switch");
        this.setOutput(true, "Boolean");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      Blockly.Python.definitions_['import_robot_lib'] = 'import robot_lib';
      var code = 'Sensor.get_bumper_pressed_state()\n';
      return [code, Blockly.Python.ORDER_NONE];
    }
  },
  block_tilt: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("Tilt control")
            .appendField(new Blockly.FieldDropdown([
              ["forward","Sensor.TILT_FWD"], 
              ["left","Sensor.TILT_LEFT"],
              ["right","Sensor.TILT_RIGHT"],
              ["backward","Sensor.TILT_BACK"],
            ]), "DIRECTION_TILT");
        this.setOutput(true, "Boolean");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var dropdown_tilt = block.getFieldValue('DIRECTION_TILT');
      Blockly.Python.definitions_['import_robot_lib'] = 'import robot_lib';
      var code = 'Sensor.get_tilt_state(direction=' + dropdown_tilt + ')\n';
      return [code, Blockly.Python.ORDER_NONE];
    }
  },
  block_play_note: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("Play note")
            .appendField("Octave:")
            .appendField(new Blockly.FieldDropdown([
              ["1st","OCTAVE_1"], 
              ["2nd","OCTAVE_2"], 
              ["3rd","OCTAVE_3"], 
              ["4th","OCTAVE_4"], 
              ["5th","OCTAVE_5"], 
              ["6th","OCTAVE_6"], 
              ["7th","OCTAVE_7"], 
              ["8th","OCTAVE_8"]
            ]), "OCTAVE")
            .appendField("Key:")
            .appendField(new Blockly.FieldDropdown([
              ["C","OPTION_C"], 
              ["C# / Db","OPTION_CS"], 
              ["D","OPTION_D"], 
              ["D# / Eb","OPTION_DS"], 
              ["E","OPTION_E"], 
              ["F","OPTION_F"], 
              ["F# / Gb","OPTION_FS"], 
              ["G","OPTION_G"], 
              ["G# / Ab","OPTION_GS"], 
              ["A","OPTION_A"], 
              ["A# / Bb","OPTION_AS"], 
              ["B","OPTION_B"]
            ]), "KEY")
            .appendField("Duration:");
        this.appendValueInput("DURATION")
            .setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var dropdown_key = block.getFieldValue('KEY');
      var dropdown_octave = block.getFieldValue('OCTAVE');
      var value_name = Blockly.Python.valueToCode(block, 'DURATION', Blockly.Python.ORDER_ATOMIC);
      // TODO: Assemble Python into code variable.
      var code = '...\n';
      return code;
    }
  },
  block_play_tune: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("Play tune")
            .appendField(new Blockly.FieldDropdown([
              ["Tune_1","OPTION_TUNE_1"], 
              ["Tune_2","OPTION_TUNE_2"], 
              ["Tune_3","OPTION_TUNE_3"]
            ]), "TUNE");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var dropdown_tune = block.getFieldValue('TUNE');
      // TODO: Assemble Python into code variable.
      var code = '...\n';
      return code;
    }
  },
  block_stop_playback: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("Stop playback");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      // TODO: Assemble Python into code variable.
      var code = '...\n';
      return code;
    }
  },
  block_set_led: {
    definition: {
      init: function() {
        this.appendValueInput("LED")
            .setCheck("Number")
            .appendField("Set LED:");
        this.appendValueInput("COLOR")
            .setCheck("Colour")
            .appendField("Color:");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var value_led = Blockly.Python.valueToCode(block, 'LED', Blockly.Python.ORDER_ATOMIC);
      var value_color = Blockly.Python.valueToCode(block, 'COLOR', Blockly.Python.ORDER_ATOMIC);
      // TODO: Assemble Python into code variable.
      var code = '...\n';
      return code;
    }
  }
};
