const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('chai').assert;

describe('Teacher Management - Functional Tests', function () {
    let driver;
    const baseUrl = 'http://localhost:3000';

    // Increase timeout for Selenium operations
    this.timeout(30000);

    before(async function () {
        // Set up Chrome options for Windows compatibility
        const options = new chrome.Options();

        // Add arguments for better stability on Windows
        // options.addArguments('--headless=new'); // DISABLED: Chrome 142 headless bug on Windows
        // options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1920,1080');
        options.addArguments('--disable-blink-features=AutomationControlled');
        // options.addArguments('--disable-extensions');
        // options.addArguments('--disable-software-rasterizer');

        console.log('🚀 Iniciando ChromeDriver en modo VISIBLE...');

        try {
            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .build();

            console.log('✓ ChromeDriver initialized successfully');
        } catch (error) {
            console.error('Error initializing ChromeDriver:', error.message);
            throw error;
        }
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    describe('Login Functionality', function () {
        it('should display login form on page load', async function () {
            await driver.get(baseUrl);

            const loginScreen = await driver.findElement(By.id('loginScreen'));
            const isDisplayed = await loginScreen.isDisplayed();

            assert.isTrue(isDisplayed, 'Login screen should be visible');
        });

        it('should login with valid credentials', async function () {
            await driver.get(baseUrl);

            // Fill login form
            await driver.findElement(By.id('username')).sendKeys('admin');
            await driver.findElement(By.id('password')).sendKeys('admin123');

            // Submit form
            await driver.findElement(By.css('#loginForm button[type="submit"]')).click();

            // Wait for app screen to appear
            await driver.wait(until.elementLocated(By.id('appScreen')), 5000);

            const appScreen = await driver.findElement(By.id('appScreen'));
            const isDisplayed = await appScreen.isDisplayed();

            assert.isTrue(isDisplayed, 'App screen should be visible after login');
        });

        it('should reject invalid credentials', async function () {
            await driver.get(baseUrl);

            // Fill login form with invalid credentials
            await driver.findElement(By.id('username')).sendKeys('invalid');
            await driver.findElement(By.id('password')).sendKeys('wrong');

            // Submit form
            await driver.findElement(By.css('#loginForm button[type="submit"]')).click();

            // Wait a bit for alert
            await driver.sleep(1000);

            // Check if still on login screen
            const loginScreen = await driver.findElement(By.id('loginScreen'));
            const isDisplayed = await loginScreen.isDisplayed();

            assert.isTrue(isDisplayed, 'Should remain on login screen with invalid credentials');
        });
    });

    describe('Teacher CRUD Operations', function () {
        beforeEach(async function () {
            // Login before each test
            await driver.get(baseUrl);
            await driver.findElement(By.id('username')).sendKeys('admin');
            await driver.findElement(By.id('password')).sendKeys('admin123');
            await driver.findElement(By.css('#loginForm button[type="submit"]')).click();
            await driver.wait(until.elementLocated(By.id('appScreen')), 5000);
        });

        it('should display list of teachers', async function () {
            // Wait for teachers to load
            await driver.sleep(1000);

            const teacherCards = await driver.findElements(By.css('.teacher-card'));

            assert.isAtLeast(teacherCards.length, 1, 'Should display at least one teacher');
        });

        it('should open add teacher modal', async function () {
            // Click add teacher button
            await driver.findElement(By.id('addTeacherBtn')).click();

            // Wait for modal
            await driver.wait(until.elementLocated(By.css('.modal.active')), 3000);

            const modal = await driver.findElement(By.id('teacherModal'));
            const modalClass = await modal.getAttribute('class');

            assert.include(modalClass, 'active', 'Modal should be active');
        });

        it('should add a new teacher', async function () {
            // Click add teacher button
            await driver.findElement(By.id('addTeacherBtn')).click();
            await driver.wait(until.elementLocated(By.css('.modal.active')), 3000);

            // Fill form
            await driver.findElement(By.id('teacherName')).sendKeys('Test Teacher');
            await driver.findElement(By.id('teacherEmail')).sendKeys('test@example.com');
            await driver.findElement(By.id('teacherSpecialty')).sendKeys('Testing');
            await driver.findElement(By.id('teacherPhone')).sendKeys('+1-555-9999');
            await driver.findElement(By.id('teacherClassroom')).sendKeys('T-100');
            await driver.findElement(By.id('teacherSchedule')).sendKeys('Lunes a Viernes 9:00-15:00');

            // Submit form
            await driver.findElement(By.css('#teacherForm button[type="submit"]')).click();

            // Wait for modal to close
            await driver.sleep(2000);

            // Check if teacher was added
            const teacherCards = await driver.findElements(By.css('.teacher-card'));
            const lastCard = teacherCards[teacherCards.length - 1];
            const cardText = await lastCard.getText();

            assert.include(cardText, 'Test Teacher', 'New teacher should appear in the list');
        });

        it('should search for teachers', async function () {
            await driver.sleep(1000);

            // Type in search box
            const searchInput = await driver.findElement(By.id('searchInput'));
            await searchInput.sendKeys('María');

            await driver.sleep(500);

            // Check filtered results
            const teacherCards = await driver.findElements(By.css('.teacher-card'));

            assert.isAtLeast(teacherCards.length, 0, 'Search should filter results');

            if (teacherCards.length > 0) {
                const firstCard = teacherCards[0];
                const cardText = await firstCard.getText();
                assert.include(cardText.toLowerCase(), 'maría', 'Filtered results should match search term');
            }
        });

        it('should validate required fields', async function () {
            // Click add teacher button
            await driver.findElement(By.id('addTeacherBtn')).click();
            await driver.wait(until.elementLocated(By.css('.modal.active')), 3000);

            // Try to submit empty form
            await driver.findElement(By.css('#teacherForm button[type="submit"]')).click();

            // Check if form validation prevents submission
            const nameInput = await driver.findElement(By.id('teacherName'));
            const validationMessage = await nameInput.getAttribute('validationMessage');

            assert.isNotEmpty(validationMessage, 'Should show validation message for required field');
        });
    });

    describe('UI Interactions', function () {
        beforeEach(async function () {
            // Login before each test
            await driver.get(baseUrl);
            await driver.findElement(By.id('username')).sendKeys('admin');
            await driver.findElement(By.id('password')).sendKeys('admin123');
            await driver.findElement(By.css('#loginForm button[type="submit"]')).click();
            await driver.wait(until.elementLocated(By.id('appScreen')), 5000);
        });

        it('should close modal when clicking cancel', async function () {
            // Open modal
            await driver.findElement(By.id('addTeacherBtn')).click();
            await driver.wait(until.elementLocated(By.css('.modal.active')), 3000);

            // Click cancel
            await driver.findElement(By.id('cancelBtn')).click();

            await driver.sleep(500);

            // Check if modal is closed
            const modal = await driver.findElement(By.id('teacherModal'));
            const modalClass = await modal.getAttribute('class');

            assert.notInclude(modalClass, 'active', 'Modal should be closed');
        });

        it('should logout successfully', async function () {
            // Click logout button
            await driver.findElement(By.id('logoutBtn')).click();

            await driver.sleep(500);

            // Check if back to login screen
            const loginScreen = await driver.findElement(By.id('loginScreen'));
            const isDisplayed = await loginScreen.isDisplayed();

            assert.isTrue(isDisplayed, 'Should return to login screen after logout');
        });
    });
});
