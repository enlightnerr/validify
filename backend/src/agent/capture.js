import puppeteer from "puppeteer";

export const captureUI = async (url, source, skipPdf) => {
    if (!url) return; // If no URL provided, skip capture entirely

    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox"]
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto(url, { waitUntil: "networkidle0" });

        // 📸 Screenshot
        await page.screenshot({
            path: `outputs/${source}.png`,
            fullPage: true
        });

        // 📄 PDF Generation (conditionally skip if user uploaded one manually)
        if (!skipPdf) {
            await page.pdf({
                path: `outputs/${source}.pdf`,
                format: "A4",
                printBackground: true
            });
        }
    } catch (e) {
        console.error(`Failed to capture ${source}:`, e);
    } finally {
        await browser.close();
    }
};