#!/usr/bin/env node


const {llog} = require('./src/utils')
var clear = require('clear');
const fs = require('fs');


require("dotenv").config({ path: __dirname + `/.env.cli` });
var yargs = require('yargs').argv;

clear()
if (yargs.finetune) {
    llog.blue(yargs.finetune)
}

llog.magenta(`finetune.js`)
llog.magenta(yargs)

const data = fs.readFileSync(yargs.finetune, 'utf-8');

// Split the input data into dialogue chunks
const chunks = data.split(/\n(?=\d{2}:\d{2}:\d{2}:\d{2} - \d{2}:\d{2}:\d{2}:\d{2})/).filter(Boolean);

// Prepare a list to store JSON objects
const jsonLines = [];

// Define a function to create a JSON object for a dialogue chunk
function createJsonObj(role, content) {
  return {
    role,
    content: content.trim(),
  };
}

// Define a system message
const systemMessage = {
  role: 'system',
  content: 'You are a happy assistant that puts a positive spin on everything.',
};

// Loop through the dialogue chunks and create JSON objects
for (let i = 0; i < chunks.length; i += 3) {
  const speaker = chunks[i + 1];
  const dialogue = chunks[i + 2];

  const messages = [systemMessage];

  if (speaker === 'Speaker 1') {
    messages.push(createJsonObj('assistant', dialogue)); // Change the role to 'assistant'
  } else if (speaker === 'Speaker 2') {
    messages.push(createJsonObj('user', dialogue)); // Change the role to 'user'
  }

  jsonLines.push({ messages });
}

// Convert the list of JSON objects to JSON lines and write to a file
const outputFileName = 'output.jsonl';

fs.writeFileSync(outputFileName, jsonLines.map(JSON.stringify).join('\n'));

console.log(`JSON lines written to ${outputFileName}`);
