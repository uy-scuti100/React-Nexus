// // Import necessary libraries
// const { spawn } = require("child_process");
// const natural = require("natural");
// const { htmlToText, HtmlToTextOptions } = require("html-to-text");

// const tokenizer = new natural.WordTokenizer();
// const stemmer = natural.PorterStemmer;

// // Function for text preprocessing
// function preprocessText(text: string) {
//    // Convert HTML to plain text
//    const plainText = htmlToText(text, {
//       ignoreHref: true,
//       ignoreImage: true,
//    } as typeof HtmlToTextOptions);

//    // Tokenize the plain text
//    const tokens = tokenizer.tokenize(plainText.toLowerCase());

//    // Stem the tokens
//    const stemmedTokens = tokens.map(stemmer.stem);

//    return stemmedTokens.join(" "); // Join tokens back to text
// }

// // Define a function for categorization
// function categorizePost(data: any, categories: any) {
//    const contentText = data?.content || "";
//    const preprocessedText = preprocessText(contentText);

//    // Communicate with the Python script
//    const pythonProcess = spawn("python", [
//       "categorization_script.py",
//       preprocessedText,
//    ]);

//    pythonProcess.stdout.on("data", (data: any) => {
//       const selectedCategory = data.toString().trim();
//       console.log(`Selected Category ID: ${selectedCategory}`);
//       // Now you can use 'selectedCategory' in your JavaScript code
//    });

//    pythonProcess.stderr.on("data", (data: any) => {
//       console.error(`Error: ${data}`);
//    });
// }

// // Call categorizePost(data, categories) when needed
