// generateHtmlFiles.js
import fs from 'fs';
import path from 'path';
 

// Define a basic HTML template
const htmlTemplate = (name, audio, image, coin) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
</head>
<body>
    <h1>${name}</h1>
    <img src="${image}" alt="${name}" style="width: 300px; height: auto;">
    <audio controls>
        <source src="${audio}" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
    <p>Coin URL: <a href="${coin}">${coin}</a></p>
</body>
</html>
`;

(async () => {
    const { ordArray } = await import('../src/Samplerr.jsx');

    // Generate an HTML file for each item in ordArray
    ordArray.forEach((item) => {
        const htmlContent = htmlTemplate(item.name, item.audio, item.image, item.coin);
        const fileName = `${item.name.replace(/\s+/g, '_')}.html`;
        const filePath = "T:\\KANE MAYFIELD\\iom-ord\\htmlfiles\\" + fileName;

        // Ensure the output directory exists
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        // Write the HTML content to a file
        fs.writeFileSync(filePath, htmlContent, 'utf8');
        console.log(`Generated ${fileName}`);
    });
})();