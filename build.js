const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { minify } = require("html-minifier-terser");

const SRC = "src";
const DIST = "dist";
const SKIP = ["input.css", "style.css"];

const htmlOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: true,
};

const processDir = async (dir) => {
  for (const item of fs.readdirSync(dir)) {
    const src = path.join(dir, item);
    const relative = path.relative(SRC, src);
    const dest = path.join(DIST, relative);

    if (SKIP.includes(item)) continue;

    if (fs.statSync(src).isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      await processDir(src);
    } else if (item.endsWith(".html")) {
      const html = fs.readFileSync(src, "utf8");
      const minified = await minify(html, htmlOptions);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, minified);
      console.log(`  ${relative} (minified)`);
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      console.log(`  ${relative}`);
    }
  }
};

(async () => {
  console.log("Cleaning dist...");
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST);

  console.log("Building CSS...");
  execSync(`npx tailwindcss -i ./${SRC}/input.css -o ./${DIST}/style.css --minify`);

  console.log("Processing files...");
  await processDir(SRC);

  console.log("Done!");
})();
