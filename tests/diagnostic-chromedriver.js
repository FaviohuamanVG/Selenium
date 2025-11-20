const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

async function testChromeDriver() {
    console.log('=== ChromeDriver Diagnostic Test ===\n');

    // Check ChromeDriver path
    const chromeDriverPath = path.join(__dirname, '..', '..', 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe');
    console.log('ChromeDriver path:', chromeDriverPath);
    console.log('Path exists:', require('fs').existsSync(chromeDriverPath));

    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    console.log('\nAttempting to start ChromeDriver...');
    const startTime = Date.now();

    try {
        const service = new chrome.ServiceBuilder(chromeDriverPath);

        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(service)
            .build();

        const elapsed = Date.now() - startTime;
        console.log(`✓ ChromeDriver started successfully in ${elapsed}ms`);

        console.log('\nTesting basic operations...');
        await driver.get('data:text/html,<h1>Test Page</h1>');
        const title = await driver.getTitle();
        console.log('✓ Page loaded, title:', title);

        await driver.quit();
        console.log('✓ Driver quit successfully');
        console.log('\n=== All tests passed! ===');

    } catch (error) {
        const elapsed = Date.now() - startTime;
        console.error(`\n❌ Error after ${elapsed}ms:`);
        console.error('Message:', error.message);
        console.error('\nStack:', error.stack);
        process.exit(1);
    }
}

testChromeDriver();
