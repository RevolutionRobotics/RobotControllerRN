var customBlocks = {
  block_drive: {
    definition: {
      init: function() {
        this.appendDummyInput()
          .appendField("Drive")
          .appendField("Direction:")
          .appendField(new Blockly.FieldDropdown([
            ["forward","FORWARD"], 
            ["left","LEFT"],
            ["right","RIGHT"],
            ["backward","BACKWARD"],
          ]), "DIRECTION");
        this.appendValueInput("VALUE_1")
          .setCheck("Number");
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ["rotation","OPTION_DRIVE_ROT"], 
            ["sec","OPTION_DRIVE_SEC"]
          ]), "UNIT_1");

        this.appendValueInput("VALUE_2")
          .setCheck("Number");
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ["rpm","OPTION_DRIVE_RPM"], 
            ["power","OPTION_DRIVE_PWR"]
          ]), "UNIT_2");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      var text_name = block.getFieldValue('NAME');
      var dropdown_rotation = block.getFieldValue('ROTATION');
      var number_rotation_value = block.getFieldValue('ROTATION_VALUE');
      var dropdown_name = block.getFieldValue('NAME');
      // TODO: Assemble Python into code variable.
      var code = '...\n';
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
            ["clockwise","CW"], 
            ["counter clockwise","CCW"]
          ]), "ROTATION");
        this.appendValueInput("VALUE")
          .setCheck("Number");
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ["deg","OPTION_DEG"], 
            ["rotation","OPTION_ROT"], 
            ["sec","OPTION_SEC"]
          ]), "UNIT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
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
  block_stop_motor: {
    definition: {
      init: function() {
        this.appendDummyInput()
          .appendField("Stop")
          .appendField("Motor:")
          .appendField(new Blockly.FieldTextInput("M1"), "NAME")
          .appendField(new Blockly.FieldDropdown([
            ["Stop & hold","STOP_AND_HOLD"], 
            ["Release","RELEASE"]
          ]), "STOP_ALL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
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
  block_stop_all_motors: {
    definition: {
      init: function() {
        this.appendDummyInput()
          .appendField("Stop all motors")
          .appendField("Action:")
          .appendField(new Blockly.FieldDropdown([
            ["Stop & hold","STOP_AND_HOLD"], 
            ["Release","RELEASE"]
          ]), "STOP_ALL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
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
      // TODO: Assemble Python into code variable.
      var code = '...';
      // TODO: Change ORDER_NONE to the correct strength.
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
      // TODO: Assemble Python into code variable.
      var code = '...';
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.Python.ORDER_NONE];
    }
  },
  block_tilt: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("Tilt control")
            .appendField(new Blockly.FieldDropdown([
              ["forward","FORWARD"], 
              ["left","LEFT"],
              ["right","RIGHT"],
              ["backward","BACKWARD"],
            ]), "DIRECTION");
        this.setOutput(true, "Boolean");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    },
    generatorStub: function(block) {
      // TODO: Assemble Python into code variable.
      var code = '...';
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.Python.ORDER_NONE];
    }
  },
  block_play_note: {
    definition: {
      init: function() {
        this.appendDummyInput()
            .appendField("Play note")
            .appendField("Key:")
            .appendField(new Blockly.FieldDropdown([["C","OPTION_C"], ["C# / Db","OPTION_CS"], ["D","OPTION_D"], ["D# / Eb","OPTION_DS"], ["E","OPTION_E"], ["F","OPTION_F"], ["F# / Gb","OPTION_FS"], ["G","OPTION_G"], ["G# / Ab","OPTION_GS"], ["A","OPTION_A"], ["A# / Bb","OPTION_AS"], ["B","OPTION_B"]]), "KEY")
            .appendField("Octave:")
            .appendField(new Blockly.FieldDropdown([["1st","OCTAVE_1"], ["2nd","OCTAVE_2"], ["3rd","OCTAVE_3"], ["4th","OCTAVE_4"], ["5th","OCTAVE_5"], ["6th","OCTAVE_6"], ["7th","OCTAVE_7"], ["8th","OCTAVE_8"]]), "OCTAVE")
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
            .appendField(new Blockly.FieldDropdown([["Tune_1","OPTION_TUNE_1"], ["Tune_2","OPTION_TUNE_2"], ["Tune_3","OPTION_TUNE_3"]]), "TUNE");
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
  }
};
