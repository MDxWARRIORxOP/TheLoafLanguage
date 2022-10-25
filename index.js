#!/usr/bin/env node
const fs = require("fs");
const vars = [];

/**
 *
 * @param {String} msg
 */
function error(msg) {
  throw new Error(`[BREAD-ERROR] ${msg} \n\n\n You burnt your bread.`);
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
  }
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
  }
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
  }
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
  }
}

// checks
if (!process.argv[2]) error("No Loaf file specified.");
if (!process.argv[2].endsWith(".loaf"))
  error("That is not a valid .loaf file.");
if (!fs.existsSync(process.argv[2]))
  error("The Loaf file specified dosent exist.");

// main stuff
const fileContent = fs.readFileSync(process.argv[2]).toString();

if (fileContent.length == 0) error("The specified Loaf file is empty.");

const mainFunc = fileContent.match(/bake main \(\) \{(.|\n|\r)*\}/gim);

const linesRaw = mainFunc[0].split("\n");
const lines = linesRaw.map((l) => l.split("\r"));

for (const line of lines) {
  readForVarString(line[0]);
  readForVarNumber(line[0]);
  readForVarBoolean(line[0]);
  readForFunctions(line[0]);
}
