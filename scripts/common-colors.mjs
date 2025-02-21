import fs from 'fs';
import { Vibrant } from 'node-vibrant/node';

const indexPaths = ['src/assets/image-library.json'];

indexPaths.forEach(async (indexFile) => {
    const index = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));

    // Array to hold all the promises returned by determineCommonColor
    const promises = index.map(async (block) => {
        block.commonColor = await determineCommonColor(`public/${block.path}`);
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
    console.log(`Updated ${indexFile} with common colors`);
});

async function determineCommonColor(imagePath) {
    console.log(`determineCommonColor: ${imagePath}`);
    try {
        const palette = await Vibrant.from(imagePath).getPalette();
        // Assuming the palette has been successfully generated
        // You can access different colors like Vibrant, Muted, DarkVibrant, etc.
        return palette.Vibrant.hex || null; // Fallback color if Vibrant color not available
    } catch (error) {
        console.error(`Error determining common color for ${imagePath}:`, error.message);
        return null;
    }
}
