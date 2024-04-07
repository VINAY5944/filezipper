const fs = require('fs');

// Node class for Huffman tree
class HuffmanNode {
    constructor(symbol, frequency) {
        this.symbol = symbol;
        this.frequency = frequency;
        this.left = null;
        this.right = null;
    }
}

// Function to read file and calculate frequency of each symbol
function calculateFrequencies(inputFilePath) {
    const frequencyMap = new Map();

    const data = fs.readFileSync(inputFilePath);
    for (let byte of data) {
        const char = String.fromCharCode(byte);
        if (frequencyMap.has(char)) {
            frequencyMap.set(char, frequencyMap.get(char) + 1);
        } else {
            frequencyMap.set(char, 1);
        }
    }

    return frequencyMap;
}

// Function to build Huffman tree
function buildHuffmanTree(frequencyMap) {
    const priorityQueue = [];

    // Create a leaf node for each symbol and add to priority queue
    for (let [symbol, frequency] of frequencyMap.entries()) {
        priorityQueue.push(new HuffmanNode(symbol, frequency));
    }

    // Build Huffman tree by combining two smallest nodes until only one node remains
    while (priorityQueue.length > 1) {
        priorityQueue.sort((a, b) => a.frequency - b.frequency);

        const node1 = priorityQueue.shift();
        const node2 = priorityQueue.shift();

        const parentNode = new HuffmanNode(null, node1.frequency + node2.frequency);
        parentNode.left = node1;
        parentNode.right = node2;

        priorityQueue.push(parentNode);
    }

    // Return the root of the Huffman tree
    return priorityQueue[0];
}

// Function to generate Huffman codes from Huffman tree
function generateHuffmanCodes(root) {
    const huffmanCodes = new Map();

    // Helper function to traverse the Huffman tree and generate codes
    function traverse(node, code) {
        if (node.symbol !== null) {
            huffmanCodes.set(node.symbol, code);
        } else {
            traverse(node.left, code + '0');
            traverse(node.right, code + '1');
        }
    }

    traverse(root, '');

    return huffmanCodes;
}

// Function to encode file using Huffman codes
function encodeFile(inputFilePath, outputFilePath, huffmanCodes) {
    const data = fs.readFileSync(inputFilePath);
    let encodedBits = '';

    // Convert file data to encoded bits using Huffman codes
    for (let byte of data) {
        const char = String.fromCharCode(byte);
        encodedBits += huffmanCodes.get(char);
    }

    // Pad encoded bits to ensure a whole number of bytes
    const paddingLength = 8 - (encodedBits.length % 8);
    encodedBits += '0'.repeat(paddingLength);

    // Convert encoded bits to bytes
    const encodedBytes = [];
    for (let i = 0; i < encodedBits.length; i += 8) {
        const byte = parseInt(encodedBits.substr(i, 8), 2);
        encodedBytes.push(byte);
    }

    // Write encoded bytes to output file
    const buffer = Buffer.from(encodedBytes);
    fs.writeFileSync(outputFilePath, buffer);

    console.log(`File compressed successfully. Output saved to: ${outputFilePath}`);
}

// Usage: node huffman_compressor.js <inputFilePath> <outputFilePath>
const args = process.argv.slice(2);

if (args.length !== 2) {
    console.error('Usage: node huffman_compressor.js <inputFilePath> <outputFilePath>');
    process.exit(1);
}

const inputFilePath = args[0];
const outputFilePath = args[1];

// Step 1: Calculate symbol frequencies
const frequencyMap = calculateFrequencies(inputFilePath);

// Step 2: Build Huffman tree
const huffmanTree = buildHuffmanTree(frequencyMap);

// Step 3: Generate Huffman codes
const huffmanCodes = generateHuffmanCodes(huffmanTree);

// Step 4: Encode input file using Huffman codes and save to output file
encodeFile(inputFilePath, outputFilePath, huffmanCodes);
