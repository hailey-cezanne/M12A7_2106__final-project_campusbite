const { chromium } = require('C:/Users/haile/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
(async () => {
const root = path.resolve(__dirname, '..');
const pages = ['index.html','food-spots.html','deals-reviews.html','contact.html'];
for (const file of pages) {
  const html = fs.readFileSync(path.join(root,file),'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1].split(/[?#]/)[0];
    if (target && !target.includes(':')) assert.ok(fs.existsSync(path.join(root,target)), file + ': broken path ' + target);
  }
}
const server = require('http').createServer((req,res)=>{
 const requested = path.join(root,decodeURIComponent(req.url.split('?')[0]));
 if (!requested.startsWith(root + path.sep) || !fs.existsSync(requested)) { res.writeHead(404); res.end(); return; }
 const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png'};
 res.setHeader('Content-Type',types[path.extname(requested)] || 'application/octet-stream');
 res.end(fs.readFileSync(requested));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
server.unref();
const browser = await chromium.launch({headless:true, executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
const page = await browser.newPage({acceptDownloads:true,viewport:{width:1440,height:1000}});
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const open = file => page.goto('http://127.0.0.1:' + server.address().port + '/' + file);
for (const width of [1440,768,375]) {
  await page.setViewportSize({width,height:1000});
  for (const file of pages) {
    await open(file);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), file + ' overflow at '+width);
    assert.ok(await page.locator('h1').count() === 1);
    assert.ok(await page.locator('img').evaluateAll(images => images.every(img=>img.complete && img.naturalWidth>0)));
  }
}
await open('food-spots.html?category=snacks');
assert.equal(await page.locator('#food-list .food-card:visible').count(),1);
await page.click('#reset-filters');
assert.equal(await page.locator('#food-list .food-card:visible').count(),4);
await page.fill('#food-search','sweet');
assert.equal(await page.locator('#food-list .food-card:visible').count(),1);
await page.click('[data-filter="meals"]');
assert.equal(await page.locator('#food-list .food-card:visible').count(),0);
assert.ok(await page.locator('#no-results').isVisible());
await page.click('#reset-filters');
await page.selectOption('#max-budget','30');
assert.equal(await page.locator('#food-list .food-card:visible').count(),2);
await page.selectOption('#food-sort','price');
assert.equal(await page.locator('#food-list .food-card').first().getAttribute('id'),'spot-2');
await open('food-spots.html#spot-3');
assert.equal(await page.locator('#spot-3 details').getAttribute('open'),'');
await open('deals-reviews.html');
await page.evaluate(()=>localStorage.clear());
await page.reload();
await page.fill('#review-text','<b>Personal note test</b>');
await page.click('#review-form button');
assert.equal(await page.locator('.personal-note').count(),1);
assert.equal(await page.locator('.personal-note b').count(),0);
await page.reload();
assert.equal(await page.locator('.personal-note').count(),1);
await page.click('#clear-reviews');
assert.equal(await page.locator('.personal-note').count(),0);
await open('contact.html');
await page.click('#contact-form button[type="submit"]');
assert.ok(await page.locator('#download-suggestion').isHidden());
await page.fill('#name','Test Student');
await page.fill('#email','test@example.com');
await page.fill('#message','Please add a verified cafeteria menu.');
await page.click('#contact-form button[type="submit"]');
assert.ok(await page.locator('#download-suggestion').isVisible());
const downloadPromise = page.waitForEvent('download');
await page.click('#download-suggestion');
const download = await downloadPromise;
assert.equal(download.suggestedFilename(),'campusbites-suggestion.txt');
const downloadPath = await download.path();
assert.ok(fs.readFileSync(downloadPath,'utf8').includes('Test Student'));
await page.fill('#message','Updated message');
assert.ok(await page.locator('#download-suggestion').isHidden());
await page.setViewportSize({width:1440,height:1000});
await open('index.html');
await page.screenshot({path:path.join(root,'project','home-desktop.png'),fullPage:true});
await page.setViewportSize({width:375,height:900});
await page.screenshot({path:path.join(root,'project','home-mobile.png'),fullPage:true});
assert.deepEqual(errors,[]);
await browser.close(); server.close();
console.log('PASS: local paths, images, 12 page/viewport checks, filters, sort, reset, deep links, notes persistence and safe rendering, form validation and download; no JavaScript page errors.');
})().catch(error=>{console.error(error); process.exit(1);});
