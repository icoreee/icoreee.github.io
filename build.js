const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { minify } = require("html-minifier-terser");

const DIST = "dist";

const htmlOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: true,
};

const copyRecursive = (src, dest) => {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
};

const minifyHtml = async (src, dest) => {
  const html = fs.readFileSync(src, "utf8");
  const minified = await minify(html, htmlOptions);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, minified);
};

const findHtmlFiles = (dir, files = []) => {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (!["node_modules", "dist", ".git", "src"].includes(item)) {
        findHtmlFiles(full, files);
      }
    } else if (item.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
};

(async () => {
  console.log("Cleaning dist...");
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST);

  console.log("Building CSS...");
  execSync(`npx tailwindcss -i ./src/input.css -o ./${DIST}/style.css --minify`);

  console.log("Minifying HTML...");
  const htmlFiles = findHtmlFiles(".");
  for (const file of htmlFiles) {
    const dest = path.join(DIST, file);
    await minifyHtml(file, dest);
    console.log(`  ${file} -> ${dest}`);
  }

  console.log("Copying assets...");
  copyRecursive("img", path.join(DIST, "img"));
  copyRecursive("favicons", path.join(DIST, "favicons"));
  fs.copyFileSync("favicon.ico", path.join(DIST, "favicon.ico"));
  fs.copyFileSync("cv.pdf", path.join(DIST, "cv.pdf"));
  fs.copyFileSync("robots.txt", path.join(DIST, "robots.txt"));
  fs.copyFileSync("sitemap.xml", path.join(DIST, "sitemap.xml"));
  fs.copyFileSync("CNAME", path.join(DIST, "CNAME"));
  fs.copyFileSync("googlef32f4aa09d540e1e.html", path.join(DIST, "googlef32f4aa09d540e1e.html"));

  console.log("Done! Output in dist/");
})();
