import { chromium } from "playwright";
const b = await chromium.launch(); const p = await b.newPage();
p.on("console", (m) => console.log("console", m.type(), m.text().slice(0, 600)));
p.on("pageerror", (e) => console.log("pageerror", e.message));
await p.goto("http://localhost:3000/workflows/alba-tomico", { waitUntil: "networkidle" });
await p.waitForTimeout(3000);
console.log("summary present:", await p.getByText("Photographer portfolio port").count());
console.log("done present:", await p.getByText(/blocks done/).count());
await b.close();
