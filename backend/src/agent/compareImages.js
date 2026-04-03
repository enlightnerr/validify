import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

export const compareImages = () => {
    let img1, img2;
    try {
        img1 = PNG.sync.read(fs.readFileSync("outputs/mstr.png"));
        img2 = PNG.sync.read(fs.readFileSync("outputs/metabase.png"));
    } catch (e) {
        console.error("Failed to read images:", e);
        return -1;
    }

    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        width,
        height,
        { threshold: 0.1 }
    );

    fs.writeFileSync("outputs/diff.png", PNG.sync.write(diff));

    return numDiffPixels;
};
