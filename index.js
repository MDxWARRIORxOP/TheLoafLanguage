#!/usr/bin/env node
const fs = require("fs");
const vars = [];

/**
 *
 * @param {String} msg
 */
function error(msg) {
  throw `[BREAD-ERROR] ${msg} \n\n\n You burnt your bread.`;
}

/**
 *
 * @param {String} line
 */
function readForVarString(line) {
  if (line.includes("^^")) {
    return;
  }

  const index = line.search(/(bagel|bread) ([a-z]|[1-9])* \= \"(.*)*\"/gi);
  if (index != -1) {
    const semiIndex = line.search(/\;/);

    if (semiIndex == -1) {
      error(`No Semi Colon Found After Line.\n\n(${line})`);
    }

    const substring = line.substring(index, semiIndex);
    // console.log(substring, index);

    // the variable's assignment operator
    const assignmentOperatorIndex = substring.indexOf("=");

    if (assignmentOperatorIndex == -1) {
      error(`No assignment operator for the variable.\n\n(${line})`);
    }

    // true if constant
    const varConstant = substring.indexOf("bagel") != -1;

    // the variable's name
    const varName = substring
      .substring(index + 1, assignmentOperatorIndex)
      .replace(/ /gi, "");

    // the last double quote
    const lastDoubleQuoteIndex = substring.lastIndexOf('"');

    // the variable's value
    const varValue = substring.substring(
      assignmentOperatorIndex + 3,
      lastDoubleQuoteIndex
    );

    vars.push({ varName, varValue, varConstant });
    return true;
  }

  return false;
}

/**
 * @param {String} line
 */
function readForVarNumber(line) {
  if (line.includes("^^")) {
    return;
  }

  const index = line.search(/(donut|cookie) ([a-z]|[1-9])* \= ([0-9])*/gi);
  if (index != -1) {
    const semiIndex = line.search(/\;/);

    if (semiIndex == -1) {
      error(`No Semi Colon Found After Line.\n\n(${line})`);
    }

    // index of assignment operator
    const assignmentOperatorIndex = line.indexOf("=");

    if (assignmentOperatorIndex == -1) {
      error(`No assignment operator for the variable.\n\n(${line})`);
    }

    // true if the variable is constant
    const varConstant = line.indexOf("cookie") != -1;

    // the name of the variable
    const varName = line
      .substring(varConstant ? index + 6 : index + 5, assignmentOperatorIndex)
      .replace(/ /gi, "");

    // the value of the variable
    const varValueRaw = line.substring(assignmentOperatorIndex + 1, semiIndex);
    const varValue = varValueRaw.includes(".")
      ? parseFloat(varValueRaw)
      : parseInt(varValueRaw);

    vars.push({
      varName,
      varValue,
      varConstant,
    });

    return true;
  }

  return false;
}

/**
 *
 * @param {String} line
 */
function readForVarBoolean(line) {
  if (line.includes("^^")) {
    return;
  }

  const index = line.search(/(pizza|burger) ([a-z]|[1-9])* \= (true|false)*/gi);
  if (index != -1) {
    const semiIndex = line.search(/\;/);

    if (semiIndex == -1) {
      error(`No Semi Colon Found After Line.\n\n(${line})`);
    }

    // index of assignment operator
    const assignmentOperatorIndex = line.indexOf("=");

    if (assignmentOperatorIndex == -1) {
      error(`No assignment operator for the variable.\n\n(${line})`);
    }

    // true if the variable is constant
    const varConstant = line.indexOf("burger") != -1;

    // the name of the variable
    const varName = line
      .substring(varConstant ? index + 6 : index + 5, assignmentOperatorIndex)
      .replace(/ /gi, "");

    // the variable's value
    const varValue = JSON.parse(
      line.substring(assignmentOperatorIndex + 1, semiIndex)
    );

    vars.push({
      varName,
      varValue,
      varConstant,
    });

    return true;
  }

  return false;
}

/**
 * @param {String} line
 */

function readForFunctions(line) {
  if (line.includes("^^")) {
    return;
  }

  // sprinkle
  const sprinkleIndex = line.search(
    /(sprinkle|breadcast)\((\"|\`)(.)*(\"|\`)\)/i
  );

  // if sprinkle function is being used:
  if (sprinkleIndex != -1) {
    const firstBacktickIndex = line.indexOf("`");
    const lastBacktickIndex = line.lastIndexOf("`");

    if (firstBacktickIndex == -1 || firstBacktickIndex == lastBacktickIndex) {
      const firstQuoteIndex = line.indexOf('"');
      const lastQuoteIndex = line.lastIndexOf('"');

      if (firstQuoteIndex == -1 || firstQuoteIndex == lastQuoteIndex) {
        error(`Syntax Error.\n\n(${line})`);
      }

      const string = line.substring(firstQuoteIndex + 1, lastQuoteIndex);
      console.log(string);
    }

    const varName = line.substring(firstBacktickIndex + 1, lastBacktickIndex);
    vars.find((e) => {
      if (e.varName == varName) {
        console.log(e.varValue);
      }
    });

    return true;
  }

  // addition
  const addIndex = line.search(/breadition\([0-9]*, [0-9]*\)/i);

  if (addIndex != -1) {
    const openParenthesisIndex = line.indexOf("(");
    const closeParenthesisIndex = line.indexOf(")");

    if (openParenthesisIndex == -1 || closeParenthesisIndex == -1) {
      error(`Syntax Error.\n\n(${line})`);
    }

    const commaIndex = line.indexOf(",");

    if (commaIndex == -1) {
      error(`Syntax Error.\n\n(${line})`);
    }

    try {
      const string1 = line.substring(openParenthesisIndex + 1, commaIndex);
      const string2 = line.substring(commaIndex + 1, closeParenthesisIndex);

      const number1 = string1.includes(".")
        ? parseFloat(string1)
        : parseInt(string1);

      const number2 = string2.includes(".")
        ? parseFloat(string2)
        : parseInt(string2);

      const sum = number1 + number2;
      console.log(sum);
    } catch (error) {
      error(`Error parsing numbers.\n\n${line}`);
    }

    return true;
  }

  const subtractIndex = line.search(/breadtraction\([0-9]*, [0-9]*\)/i);

  if (subtractIndex != -1) {
    const openParenthesisIndex = line.indexOf("(");
    const closeParenthesisIndex = line.indexOf(")");

    if (openParenthesisIndex == -1 || closeParenthesisIndex == -1) {
      error(`Syntax Error.\n\n(${line})`);
    }

    const commaIndex = line.indexOf(",");

    if (commaIndex == -1) {
      error(`Syntax Error.\n\n(${line})`);
    }

    try {
      const string1 = line.substring(openParenthesisIndex + 1, commaIndex);
      const string2 = line.substring(commaIndex + 1, closeParenthesisIndex);

      const number1 = string1.includes(".")
        ? parseFloat(string1)
        : parseInt(string1);

      const number2 = string2.includes(".")
        ? parseFloat(string2)
        : parseInt(string2);

      const sum = number1 - number2;
      console.log(sum);
    } catch (error) {
      error(`Error parsing numbers.\n\n${line}`);
    }

    return true;
  }

  const divisionIndex = line.search(/breadivision\([0-9]*, [0-9]*\)/i);

  if (divisionIndex != -1) {
    const openParenthesisIndex = line.indexOf("(");
    const closeParenthesisIndex = line.indexOf(")");

    if (openParenthesisIndex == -1 || closeParenthesisIndex == -1) {
      error(`Syntax Error.\n\n(${line})`);
    }

    const commaIndex = line.indexOf(",");

    if (commaIndex == -1) {
      error(`Syntax Error.\n\n(${line})`);
    }

    try {
      const string1 = line.substring(openParenthesisIndex + 1, commaIndex);
      const string2 = line.substring(commaIndex + 1, closeParenthesisIndex);

      const number1 = string1.includes(".")
        ? parseFloat(string1)
        : parseInt(string1);

      const number2 = string2.includes(".")
        ? parseFloat(string2)
        : parseInt(string2);

      const sum = number1 / number2;
      console.log(sum);
    } catch (error) {
      error(`Error parsing numbers.\n\n${line}`);
    }

    return true;
  }

  const multiplicationIndex = line.search(/breadplication\([0-9]*, [0-9]*\)/i);

  if (multiplicationIndex != -1) {
    const openParenthesisIndex = line.indexOf("(");
    const closeParenthesisIndex = line.indexOf(")");

    if (openParenthesisIndex == -1 || closeParenthesisIndex == -1) {
      error(`Syntax Error.\n\n(${line})`);
    }

    const commaIndex = line.indexOf(",");

    if (commaIndex == -1) {
      error(`Syntax Error.\n\n(${line})`);
    }

    try {
      const string1 = line.substring(openParenthesisIndex + 1, commaIndex);
      const string2 = line.substring(commaIndex + 1, closeParenthesisIndex);

      const number1 = string1.includes(".")
        ? parseFloat(string1)
        : parseInt(string1);

      const number2 = string2.includes(".")
        ? parseFloat(string2)
        : parseInt(string2);

      const sum = number1 * number2;
      console.log(sum);
    } catch (error) {
      error(`Error parsing numbers.\n\n${line}`);
    }

    return true;
  }

  return false;
}

// checks
if (!process.argv[2]) error("No Loaf file specified.");
if (!process.argv[2].endsWith(".loaf"))
  error("That is not a valid .loaf file.");
if (!fs.existsSync(process.argv[2]))
  error("The Loaf file specified doesn't exist.");

// main stuff
const fileContent = fs.readFileSync(process.argv[2]).toString();

if (fileContent.length == 0) error("The specified Loaf file is empty.");

const mainFunc = fileContent.match(/bake main \(\) \{(.|\n|\r)*\}/gim);

if (!mainFunc || !mainFunc[0]) {
  error("No Main Function found.");
}

const linesRaw = mainFunc[0].split("\n");
const lines = linesRaw.map((l) => l.split("\r"));

for (const line of lines) {
  readForVarString(line[0]);
  readForVarNumber(line[0]);
  readForVarBoolean(line[0]);
  readForFunctions(line[0]);
}
