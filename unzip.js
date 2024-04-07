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

// Function to read compressed file and decode using Huffman codes
function decodeFile(inputFilePath, outputFilePath, huffmanTree) {
    // Read compressed file
    const compressedData = fs.readFileSync(inputFilePath);

    // Decode compressed data using Huffman tree
    let decodedBits = '';
    for (let byte of compressedData) {
        let binaryStr = byte.toString(2).padStart(8, '0'); // Convert byte to binary string
        decodedBits += binaryStr;
    }

    // Remove padding bits
    const paddingLength = decodedBits.slice(-8);
    decodedBits = decodedBits.slice(0, -parseInt(paddingLength, 2));

    // Traverse Huffman tree to decode bits into symbols
    let currentNode = huffmanTree;
    const decodedSymbols = [];
    for (let bit of decodedBits) {
        if (bit === '0') {
            currentNode = currentNode.left;
        } else if (bit === '1') {
            currentNode = currentNode.right;
        }

        if (currentNode.symbol !== null) {
            decodedSymbols.push(currentNode.symbol);
            currentNode = huffmanTree; // Reset to root for next symbol
        }
    }

    // Convert decoded symbols to original text
    const decodedText = decodedSymbols.join('');

    // Write decoded text to output file
    fs.writeFileSync(outputFilePath, decodedText);

    console.log(`File decompressed successfully. Output saved to: ${outputFilePath}`);
}

// Usage: node decompressor.js <inputFilePath> <outputFilePath>
const args = process.argv.slice(2);

if (args.length !== 2) {
    console.error('Usage: node decompressor.js <inputFilePath> <outputFilePath>');
    process.exit(1);
}

const inputFilePath = args[0];
const outputFilePath = args[1];

// Assuming the Huffman tree is known (e.g., reconstructed from a file header)
// For demonstration, let's create a sample Huffman tree manually (mirror of the one used in compressor.js)
const sampleHuffmanTree = new HuffmanNode(null, null);
sampleHuffmanTree.left = new HuffmanNode('A', null);
sampleHuffmanTree.right = new HuffmanNode(null, null);
sampleHuffmanTree.right.left = new HuffmanNode('B', null);
sampleHuffmanTree.right.right = new HuffmanNode('C', null);

// Decompress input file using the Huffman tree
decodeFile(inputFilePath, outputFilePath, sampleHuffmanTree);
