// سیستم دیتابیس با localStorage - قیمت‌ها به افغانی
const DB = {
    // نرخ تبدیل ریال به افغانی (مثال: هر 100 ریال = 1 افغانی)
    EXCHANGE_RATE: 0.1, // این مقدار را می‌توانید تنظیم کنید
    
    init: function() {
        // ایجاد ساختار اولیه دیتابیس اگر وجود ندارد
        if (!localStorage.getItem('purchaseSystemDB')) {
            const initialDB = {
                users: [
                    { id: 1, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@system.com', status: 'active' },
                    { id: 2, username: 'user1', password: '123456', role: 'user', email: 'user1@example.com', status: 'active' },
                    { id: 3, username: 'user2', password: '123456', role: 'user', email: 'user2@example.com', status: 'active' },
                    { id: 4, username: 'user3', password: '123456', role: 'user', email: 'user3@example.com', status: 'active' },
                    { id: 5, username: 'user4', password: '123456', role: 'user', email: 'user4@example.com', status: 'active' },
                    { id: 6, username: 'user5', password: '123456', role: 'user', email: 'user5@example.com', status: 'active' },
                    { id: 7, username: 'user6', password: '123456', role: 'user', email: 'user6@example.com', status: 'active' },
                    { id: 8, username: 'user7', password: '123456', role: 'user', email: 'user7@example.com', status: 'active' }
                ],
                purchases: [],
                lastReset: Date.now(),
                settings: {
                    autoReset: true,
                    resetInterval: 24 * 60 * 60 * 1000, // 24 ساعت
                    currency: 'AFN' // افغانی
                }
            };
            
            localStorage.setItem('purchaseSystemDB', JSON.stringify(initialDB));
            console.log("دیتابیس جدید ایجاد شد");
        }
        
        return JSON.parse(localStorage.getItem('purchaseSystemDB'));
    },
    
    save: function(db) {
        localStorage.setItem('purchaseSystemDB', JSON.stringify(db));
    },
    
    // تبدیل ریال به افغانی
    convertToAFN: function(rial) {
        return Math.round(rial * this.EXCHANGE_RATE);
    },
    
    // تبدیل افغانی به ریال (در صورت نیاز)
    convertToRial: function(afn) {
        return Math.round(afn / this.EXCHANGE_RATE);
    },
    
    addPurchase: function(purchase) {
        const db = this.init();
        purchase.id = db.purchases.length > 0 ? Math.max(...db.purchases.map(p => p.id)) + 1 : 1;
        purchase.timestamp = Date.now();
        purchase.date = new Date().toLocaleDateString('fa-IR');
        purchase.time = new Date().toLocaleTimeString('fa-IR');
        
        // اطمینان از ذخیره قیمت به افغانی
        purchase.price_afn = purchase.price; // قیمت به افغانی
        purchase.currency = 'AFN'; // واحد پول
        
        db.purchases.push(purchase);
        this.save(db);
        console.log("خرید جدید اضافه شد:", purchase);
        return purchase;
    },
    
    getUserPurchases: function(userId) {
        const db = this.init();
        return db.purchases.filter(p => p.userId === userId);
    },
    
    getAllPurchases: function() {
        const db = this.init();
        return db.purchases;
    },
    
    getUsers: function() {
        const db = this.init();
        return db.users;
    },
    
    // محاسبه مجموع خریدهای یک کاربر به افغانی
    getUserTotalPurchases: function(userId) {
        const purchases = this.getUserPurchases(userId);
        return purchases.reduce((total, purchase) => total + purchase.price_afn, 0);
    },
    
    // محاسبه مجموع کل خریدهای همه کاربران به افغانی
    getAllPurchasesTotal: function() {
        const purchases = this.getAllPurchases();
        return purchases.reduce((total, purchase) => total + purchase.price_afn, 0);
    },
    
    resetDailyData: function() {
        const db = this.init();
        // فقط خریدها را پاک می‌کنیم (کاربران باقی می‌مانند)
        const previousPurchases = [...db.purchases];
        db.purchases = [];
        db.lastReset = Date.now();
        this.save(db);
        console.log("داده‌های خرید بروزرسانی شدند");
        return previousPurchases;
    },
    
    getLastResetTime: function() {
        const db = this.init();
        return db.lastReset;
    },
    
    // دریافت تنظیمات
    getSettings: function() {
        const db = this.init();
        return db.settings;
    },
    
    // ذخیره تنظیمات
    saveSettings: function(settings) {
        const db = this.init();
        db.settings = settings;
        this.save(db);
    },
    
    // دریافت نرخ تبدیل
    getExchangeRate: function() {
        return this.EXCHANGE_RATE;
    }
};
