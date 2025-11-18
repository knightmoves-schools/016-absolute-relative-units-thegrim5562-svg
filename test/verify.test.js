const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    fs.readFile(__dirname + "/.." + req.url, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Enhanced compatibility
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe("the absolute-units div", () => {
  it("should have an absolute margin value in pixels", async () => {
    const matches = await page.$eval("style", (style) => {
      const regex = /#absolute-units\s*{[\s\S]*margin:\s*\d+px;/g;
      return (style.innerHTML.match(regex) || []).length;
    });
    expect(matches).toEqual(1);
  });

  it("should have an absolute padding value in pixels", async () => {
    const matches = await page.$eval("style", (style) => {
      const regex = /#absolute-units\s*{[\s\S]*padding:\s*\d+px;/g;
      return (style.innerHTML.match(regex) || []).length;
    });
    expect(matches).toEqual(1);
  });
});

describe("the relative-units div", () => {
  it("should have margin values relative to the font-size of the element", async () => {
    const matches = await page.$eval("style", (style) => {
      const regex = /#relative-units\s*{[\s\S]*margin:\s*\d+(\.\d+)?em;/g;
      return (style.innerHTML.match(regex) || []).length;
    });
    expect(matches).toEqual(1);
  });

  it("should have padding values relative to the font-size of the element", async () => {
    const matches = await page.$eval("style", (style) => {
      const regex = /#relative-units\s*{[\s\S]*padding:\s*\d+(\.\d+)?em;/g;
      return (style.innerHTML.match(regex) || []).length;
    });
    expect(matches).toEqual(1);
  });
});
