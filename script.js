// پیکربندی Supabase
const SUPABASE_URL = 'https://iyxrqfiesrxqermppdyi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5eHJxZmllc3J4cWVybXBwZHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NjMxNTcsImV4cCI6MjA3NzMzOTE1N30.nEoYjSnCeLxZTI8fc9GALEOp18fiqwUot4J1LQ5fCng';

// ایجاد کلاینت Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// سیستم دیتابیس با Supabase
const DB = {
    init: async function() {
        try {
            console.log("در حال اتصال به Supabase...");
            
            // تست اتصال با یک کوئری ساده
            const { error } = await supabase
                .from('users')
                .select('count', { count: 'exact', head: true })
                .limit(1);
            
            if (error) {
                console.error("خطا در اتصال به Supabase:", error);
                return false;
            }
            
            console.log("اتصال به Supabase برقرار شد");
            return true;
        } catch (error) {
            console.error("خطا در اتصال به Supabase:", error);
            return false;
        }
    },
    
    // دریافت کاربران
    getUsers: async function() {
        try {
            console.log("در حال دریافت کاربران...");
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('id', { ascending: true });
            
            if (error) {
                console.error("خطا در دریافت کاربران:", error);
                throw error;
            }
            
            console.log("تعداد کاربران دریافت شده:", data?.length || 0);
            
            // اگر کاربری وجود ندارد، کاربران پیش‌فرض را ایجاد می‌کنیم
            if (!data || data.length === 0) {
                console.log("هیچ کاربری یافت نشد، در حال ایجاد کاربران پیش‌فرض...");
                return await this.createDefaultUsers();
            }
            
            return data;
        } catch (error) {
            console.error("خطا در دریافت کاربران:", error);
            this.showNotification('خطا در دریافت داده‌ها از سرور', 'error');
            return [];
        }
    },
    
    // ایجاد کاربران پیش‌فرض
    createDefaultUsers: async function() {
        const defaultUsers = [
            { username: 'admin', password: 'admin123', role: 'admin', email: 'admin@system.com', status: 'active' },
            { username: 'user1', password: '123456', role: 'user', email: 'user1@example.com', status: 'active' },
            { username: 'user2', password: '123456', role: 'user', email: 'user2@example.com', status: 'active' },
            { username: 'user3', password: '123456', role: 'user', email: 'user3@example.com', status: 'active' },
            { username: 'user4', password: '123456', role: 'user', email: 'user4@example.com', status: 'active' },
            { username: 'user5', password: '123456', role: 'user', email: 'user5@example.com', status: 'active' },
            { username: 'user6', password: '123456', role: 'user', email: 'user6@example.com', status: 'active' },
            { username: 'user7', password: '123456', role: 'user', email: 'user7@example.com', status: 'active' }
        ];
        
        try {
            console.log("در حال ایجاد کاربران پیش‌فرض...");
            const { data, error } = await supabase
                .from('users')
                .insert(defaultUsers)
                .select();
            
            if (error) {
                console.error("خطا در ایجاد کاربران پیش‌فرض:", error);
                throw error;
            }
            
            console.log("کاربران پیش‌فرض با موفقیت ایجاد شدند");
            return data;
        } catch (error) {
            console.error("خطا در ایجاد کاربران پیش‌فرض:", error);
            return defaultUsers;
        }
    },
    
    // افزودن خرید جدید
    addPurchase: async function(purchase) {
        try {
            console.log("در حال ثبت خرید جدید:", purchase);
            
            const { data, error } = await supabase
                .from('purchases')
                .insert([purchase])
                .select();
            
            if (error) {
                console.error("خطا در ثبت خرید:", error);
                throw error;
            }
            
            console.log("خرید جدید اضافه شد:", data[0]);
            return data[0];
        } catch (error) {
            console.error("خطا در ثبت خرید:", error);
            this.showNotification('خطا در ثبت خرید', 'error');
            return null;
        }
    },
    
    // دریافت خریدهای کاربر
    getUserPurchases: async function(userId) {
        try {
            console.log(`در حال دریافت خریدهای کاربر با ID: ${userId}`);
            
            const { data, error } = await supabase
                .from('purchases')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error("خطا در دریافت خریدهای کاربر:", error);
                throw error;
            }
            
            console.log(`تعداد خریدهای کاربر ${userId}: ${data?.length || 0}`);
            return data || [];
        } catch (error) {
            console.error("خطا در دریافت خریدهای کاربر:", error);
            return [];
        }
    },
    
    // دریافت تمام خریدها
    getAllPurchases: async function() {
        try {
            console.log("در حال دریافت تمام خریدها...");
            
            const { data, error } = await supabase
                .from('purchases')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error("خطا در دریافت تمام خریدها:", error);
                throw error;
            }
            
            console.log("تعداد کل خریدها:", data?.length || 0);
            return data || [];
        } catch (error) {
            console.error("خطا در دریافت تمام خریدها:", error);
            return [];
        }
    },
    
    // بروزرسانی روزانه داده‌ها
    resetDailyData: async function() {
        try {
            console.log("در حال بروزرسانی روزانه داده‌ها...");
            
            // دریافت خریدهای قدیمی (بیشتر از 24 ساعت)
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            
            const { data: oldPurchases, error: fetchError } = await supabase
                .from('purchases')
                .select('*')
                .lt('created_at', twentyFourHoursAgo);
            
            if (fetchError) {
                console.error("خطا در دریافت خریدهای قدیمی:", fetchError);
                throw fetchError;
            }
            
            // حذف خریدهای قدیمی
            if (oldPurchases && oldPurchases.length > 0) {
                const { error: deleteError } = await supabase
                    .from('purchases')
                    .delete()
                    .lt('created_at', twentyFourHoursAgo);
                
                if (deleteError) {
                    console.error("خطا در حذف خریدهای قدیمی:", deleteError);
                    throw deleteError;
                }
                
                console.log(`${oldPurchases.length} خرید قدیمی حذف شدند`);
                return oldPurchases;
            }
            
            console.log("هیچ خرید قدیمی‌ای برای حذف وجود ندارد");
            return [];
        } catch (error) {
            console.error("خطا در بروزرسانی روزانه داده‌ها:", error);
            return [];
        }
    },
    
    // دریافت تنظیمات
    getSettings: async function() {
        try {
            console.log("در حال دریافت تنظیمات...");
            
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single();
            
            // اگر رکوردی وجود ندارد (کد خطای PGRST116)
            if (error && error.code === 'PGRST116') {
                console.log("هیچ تنظیماتی وجود ندارد، در حال ایجاد تنظیمات پیش‌فرض...");
                
                // ایجاد تنظیمات پیش‌فرض
                const defaultSettings = {
                    auto_reset: true,
                    reset_interval: 24 * 60 * 60 * 1000 // 24 ساعت
                };
                
                const { data: newSettings, error: insertError } = await supabase
                    .from('settings')
                    .insert([defaultSettings])
                    .select()
                    .single();
                
                if (insertError) {
                    console.error("خطا در ایجاد تنظیمات پیش‌فرض:", insertError);
                    throw insertError;
                }
                
                console.log("تنظیمات پیش‌فرض ایجاد شد");
                return newSettings;
            }
            
            if (error) {
                console.error("خطا در دریافت تنظیمات:", error);
                throw error;
            }
            
            console.log("تنظیمات دریافت شد");
            return data;
        } catch (error) {
            console.error("خطا در دریافت تنظیمات:", error);
            return {
                auto_reset: true,
                reset_interval: 24 * 60 * 60 * 1000
            };
        }
    },
    
    // تابع کمکی برای نمایش نوتیفیکیشن
    showNotification: function(message, type = 'info') {
        console.log(`نوتیفیکیشن [${type}]: ${message}`);
        
        // اگر UI ساخته شده است، از آن استفاده کن
        if (typeof UI !== 'undefined' && UI.showNotification) {
            UI.showNotification(message, type);
        } else {
            // نمایش ساده در کنسول
            const colors = {
                error: '🔴',
                success: '🟢',
                info: '🔵',
                warning: '🟡'
            };
            console.log(`${colors[type] || '⚪'} ${message}`);
        }
    }
};

// سیستم احراز هویت
const Auth = {
    currentUser: null,
    
    login: async function(username, password, role) {
        try {
            console.log(`تلاش برای ورود با نام کاربری: ${username}, نقش: ${role}`);
            
            // دریافت لیست کاربران
            const users = await DB.getUsers();
            
            console.log(`تعداد کاربران موجود: ${users.length}`);
            console.log("کاربران موجود:", users.map(u => ({ username: u.username, role: u.role })));
            
            // جستجوی کاربر
            const user = users.find(u => 
                u.username === username && 
                u.password === password && 
                u.role === role
            );
            
            if (user) {
                console.log(`کاربر ${username} با موفقیت پیدا شد`);
                this.currentUser = user;
                
                // ذخیره کاربر فعلی در sessionStorage
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                console.log("اطلاعات کاربر در sessionStorage ذخیره شد");
                
                return user;
            } else {
                console.log(`کاربر ${username} با رمز عبور ${password} و نقش ${role} پیدا نشد`);
                return null;
            }
        } catch (error) {
            console.error("خطا در فرآیند ورود:", error);
            return null;
        }
    },
    
    logout: function() {
        console.log(`کاربر ${this.currentUser?.username || 'ناشناس'} در حال خروج از سیستم`);
        this.currentUser = null;
        sessionStorage.removeItem('currentUser');
        console.log("اطلاعات کاربر از sessionStorage حذف شد");
    },
    
    getCurrentUser: function() {
        // اول از آبجکت جاری چک کن
        if (this.currentUser) {
            console.log("کاربر از آبجکت جاری بازیابی شد:", this.currentUser.username);
            return this.currentUser;
        }
        
        // سپس از sessionStorage چک کن
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
                console.log("کاربر از sessionStorage بازیابی شد:", this.currentUser.username);
                return this.currentUser;
            } catch (error) {
                console.error("خطا در پردازش اطلاعات کاربر ذخیره شده:", error);
                sessionStorage.removeItem('currentUser');
            }
        }
        
        console.log("هیچ کاربری لاگین نکرده است");
        return null;
    }
};

// سیستم مدیریت رابط کاربری
const UI = {
    init: function() {
        console.log("سیستم UI در حال راه‌اندازی...");
        
        // اتصال به Supabase
        this.showLoading('در حال اتصال به پایگاه داده...');
        
        setTimeout(async () => {
            const connected = await DB.init();
            if (connected) {
                this.hideLoading();
                this.showNotification('اتصال به پایگاه داده برقرار شد', 'success');
                
                // بررسی اگر کاربر قبلا وارد شده
                const user = Auth.getCurrentUser();
                if (user) {
                    console.log("کاربر از قبل وارد شده:", user.username);
                    this.showApp(user);
                } else {
                    console.log("هیچ کاربری لاگین نکرده است، نمایش فرم ورود");
                    this.showAuth();
                }
            } else {
                this.showNotification('خطا در اتصال به پایگاه داده. لطفاً دوباره امتحان کنید.', 'error');
                this.showAuth(); // نمایش فرم ورود حتی اگر اتصال برقرار نشد
            }
            
            // تنظیم رویدادها
            this.setupEvents();
            
            // تنظیم تایمر بروزرسانی روزانه
            this.setupDailyResetTimer();
        }, 1000);
    },
    
    setupEvents: function() {
        console.log("در حال تنظیم رویدادها...");
        
        // دکمه ورود
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.handleLogin();
            });
            console.log("رویداد کلیک برای دکمه ورود تنظیم شد");
        } else {
            console.error("دکمه ورود (loginBtn) پیدا نشد!");
        }
        
        // دکمه خروج
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
        
        // دکمه ثبت خرید
        const submitPurchaseBtn = document.getElementById('submitPurchase');
        if (submitPurchaseBtn) {
            submitPurchaseBtn.addEventListener('click', () => {
                console.log("دکمه ثبت خرید کلیک شد");
                this.handleAddPurchase();
            });
        }
        
        // تب‌ها
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.closest('.tab').getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
        
        // امکان ورود با کلید Enter
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin();
                }
            });
        }
        
        // فیلد قیمت - محدودیت ورود
        const itemPriceInput = document.getElementById('itemPrice');
        if (itemPriceInput) {
            itemPriceInput.addEventListener('input', (e) => {
                if (e.target.value < 0) e.target.value = 0;
            });
        }
        
        // رویدادهای مدال چاپ
        const closePreviewBtn = document.getElementById('closePreviewBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const printBtn = document.getElementById('printBtn');
        const printPreviewModal = document.getElementById('printPreviewModal');
        
        if (closePreviewBtn) {
            closePreviewBtn.addEventListener('click', () => {
                printPreviewModal.style.display = 'none';
            });
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                printPreviewModal.style.display = 'none';
            });
        }
        
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
        
        // بستن مدال با کلیک بیرون
        if (printPreviewModal) {
            printPreviewModal.addEventListener('click', (e) => {
                if (e.target === printPreviewModal) {
                    printPreviewModal.style.display = 'none';
                }
            });
        }
        
        console.log("رویدادها با موفقیت تنظیم شدند");
    },
    
    handleLogin: async function() {
        console.log("شروع فرآیند ورود...");
        
        const username = document.getElementById('username')?.value.trim();
        const password = document.getElementById('password')?.value.trim();
        const roleSelect = document.getElementById('role');
        const role = roleSelect ? roleSelect.value : 'user';
        
        console.log("مقادیر ورودی:", { username, password, role });
        
        // اعتبارسنجی
        if (!username || !password) {
            this.showNotification('لطفاً نام کاربری و کلمه عبور را وارد کنید.', 'error');
            return;
        }
        
        // نمایش لودینگ
        this.showButtonLoading('loginBtn', 'loginText', 'loginLoading');
        
        try {
            const user = await Auth.login(username, password, role);
            
            if (user) {
                this.showApp(user);
                this.showNotification(`خوش آمدید ${user.username}!`, 'success');
                
                // پاک کردن فیلدها
                if (document.getElementById('username')) {
                    document.getElementById('username').value = '';
                }
                if (document.getElementById('password')) {
                    document.getElementById('password').value = '';
                }
            } else {
                this.showNotification('نام کاربری، کلمه عبور یا نقش انتخابی نادرست است.', 'error');
            }
        } catch (error) {
            console.error("خطا در فرآیند ورود:", error);
            this.showNotification('خطا در اتصال به سرور', 'error');
        } finally {
            // پنهان کردن لودینگ
            this.hideButtonLoading('loginBtn', 'loginText', 'loginLoading');
        }
    },
    
    handleLogout: function() {
        Auth.logout();
        this.showAuth();
        this.showNotification('با موفقیت از سیستم خارج شدید.', 'info');
    },
    
    showAuth: function() {
        console.log("نمایش بخش احراز هویت");
        
        const authSection = document.getElementById('authSection');
        const appSection = document.getElementById('appSection');
        
        if (authSection) {
            authSection.classList.remove('hidden');
            console.log("بخش احراز هویت نمایش داده شد");
        } else {
            console.error("بخش احراز هویت (authSection) پیدا نشد!");
        }
        
        if (appSection) {
            appSection.classList.add('hidden');
        }
    },
    
    showApp: async function(user) {
        console.log(`نمایش برنامه برای کاربر: ${user.username} (${user.role})`);
        
        const authSection = document.getElementById('authSection');
        const appSection = document.getElementById('appSection');
        
        if (authSection) authSection.classList.add('hidden');
        if (appSection) appSection.classList.remove('hidden');
        
        // نمایش اطلاعات کاربر
        const userNameElement = document.getElementById('currentUserName');
        const userEmailElement = document.getElementById('currentUserEmail');
        const userAvatarElement = document.getElementById('userAvatar');
        
        if (userNameElement) userNameElement.textContent = user.username;
        if (userEmailElement) userEmailElement.textContent = user.email || 'ایمیل ثبت نشده';
        
        // تنظیم آواتار کاربر
        if (userAvatarElement) {
            userAvatarElement.textContent = user.username.charAt(0).toUpperCase();
            userAvatarElement.style.backgroundColor = this.getRandomColor(user.username);
        }
        
        const roleElement = document.getElementById('currentUserRole');
        if (roleElement) {
            roleElement.textContent = user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی';
            roleElement.classList.toggle('admin', user.role === 'admin');
        }
        
        // نمایش بخش مناسب بر اساس نقش
        const userContent = document.getElementById('userContent');
        const adminContent = document.getElementById('adminContent');
        
        if (user.role === 'admin') {
            console.log("نمایش بخش مدیر");
            if (userContent) userContent.classList.add('hidden');
            if (adminContent) {
                adminContent.classList.remove('hidden');
                adminContent.classList.add('active');
            }
            await this.loadAdminData();
        } else {
            console.log("نمایش بخش کاربر عادی");
            if (adminContent) adminContent.classList.add('hidden');
            if (userContent) {
                userContent.classList.remove('hidden');
                userContent.classList.add('active');
            }
            await this.loadUserData(user.id);
        }
        
        // تنظیم نام خریدار به صورت پیش‌فرض برای کاربر عادی
        if (user.role === 'user') {
            const buyerNameInput = document.getElementById('buyerName');
            if (buyerNameInput) {
                buyerNameInput.value = user.username;
            }
        }
        
        // راه‌اندازی تایمر
        this.setupDailyResetTimer();
    },
    
    loadUserData: async function(userId) {
        console.log(`بارگذاری داده‌های کاربر با ID: ${userId}`);
        
        // نمایش لودینگ
        this.showLoading('در حال بارگذاری خریدها...');
        
        try {
            // بارگذاری خریدهای کاربر
            const userPurchases = await DB.getUserPurchases(userId);
            console.log(`تعداد خریدهای کاربر: ${userPurchases.length}`);
            
            // پر کردن جداول
            this.populatePurchasesTable('recentPurchasesTable', userPurchases.slice(0, 5));
            this.populatePurchasesTable('allPurchasesTable', userPurchases);
            
            // به‌روزرسانی آمار
            this.updateUserStats(userPurchases);
        } catch (error) {
            console.error("خطا در بارگذاری خریدها:", error);
            this.showNotification('خطا در بارگذاری خریدها', 'error');
        } finally {
            this.hideLoading();
        }
    },
    
    loadAdminData: async function() {
        console.log("بارگذاری داده‌های مدیر");
        
        // نمایش لودینگ
        this.showLoading('در حال بارگذاری داده‌ها...');
        
        try {
            // بارگذاری لیست کاربران
            const users = await DB.getUsers();
            console.log(`تعداد کاربران: ${users.length}`);
            this.populateUsersTable(users);
            
            // بارگذاری تمام خریدها
            const allPurchases = await DB.getAllPurchases();
            console.log(`تعداد کل خریدها: ${allPurchases.length}`);
            this.populateAllPurchasesTable(allPurchases);
            
            // به‌روزرسانی آمار مدیر
            this.updateAdminStats(users, allPurchases);
        } catch (error) {
            console.error("خطا در بارگذاری داده‌ها:", error);
            this.showNotification('خطا در بارگذاری داده‌ها', 'error');
        } finally {
            this.hideLoading();
        }
    },
    
    handleAddPurchase: async function() {
        console.log("شروع ثبت خرید جدید");
        
        const itemName = document.getElementById('itemName');
        const buyerName = document.getElementById('buyerName');
        const itemPrice = document.getElementById('itemPrice');
        const itemCategory = document.getElementById('itemCategory');
        
        if (!itemName || !buyerName || !itemPrice || !itemCategory) {
            this.showNotification('خطا در پیدا کردن فیلدهای فرم.', 'error');
            return;
        }
        
        const itemNameValue = itemName.value.trim();
        const buyerNameValue = buyerName.value.trim();
        const itemPriceValue = itemPrice.value.trim();
        const itemCategoryValue = itemCategory.value;
        
        console.log("مقادیر فرم:", {itemNameValue, buyerNameValue, itemPriceValue, itemCategoryValue});
        
        // اعتبارسنجی
        if (!itemNameValue || !buyerNameValue || !itemPriceValue) {
            this.showNotification('لطفاً تمام فیلدهای لازم را پر کنید.', 'error');
            return;
        }
        
        const price = parseInt(itemPriceValue);
        if (isNaN(price) || price <= 0) {
            this.showNotification('لطفاً قیمت معتبر وارد کنید.', 'error');
            return;
        }
        
        const user = Auth.getCurrentUser();
        if (!user) {
            this.showNotification('لطفاً ابتدا وارد سیستم شوید.', 'error');
            return;
        }
        
        const purchase = {
            item_name: itemNameValue,
            buyer_name: buyerNameValue,
            price: price,
            category: itemCategoryValue,
            user_id: user.id,
            username: user.username,
            created_at: new Date().toISOString()
        };
        
        console.log("خرید برای ثبت:", purchase);
        
        // نمایش لودینگ
        this.showButtonLoading('submitPurchase', 'submitText', 'submitLoading');
        
        try {
            const result = await DB.addPurchase(purchase);
            
            if (result) {
                this.showNotification(`خرید "${itemNameValue}" با موفقیت ثبت شد.`, 'success');
                
                // پاک کردن فرم
                itemName.value = '';
                itemPrice.value = '';
                
                // بروزرسانی جداول
                if (user.role === 'admin') {
                    await this.loadAdminData();
                } else {
                    await this.loadUserData(user.id);
                }
                
                // نمایش تب خریدهای من
                this.switchTab('myPurchases');
                
                // جلوه بصری برای ثبت موفق
                const submitBtn = document.getElementById('submitPurchase');
                if (submitBtn) {
                    submitBtn.classList.add('pulse');
                    setTimeout(() => submitBtn.classList.remove('pulse'), 2000);
                }
            }
        } catch (error) {
            console.error("خطا در ثبت خرید:", error);
            this.showNotification('خطا در ثبت خرید', 'error');
        } finally {
            // پنهان کردن لودینگ
            this.hideButtonLoading('submitPurchase', 'submitText', 'submitLoading');
        }
    },
    
    switchTab: function(tabId) {
        console.log("تغییر تب به:", tabId);
        
        // غیرفعال کردن همه تب‌ها
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // فعال کردن تب انتخاب شده
        const tabElement = document.querySelector(`.tab[data-tab="${tabId}"]`);
        const contentElement = document.getElementById(tabId);
        
        if (tabElement) tabElement.classList.add('active');
        if (contentElement) contentElement.classList.add('active');
    },
    
    populatePurchasesTable: function(tableId, purchases) {
        console.log(`پر کردن جدول ${tableId} با ${purchases.length} خرید`);
        
        const tableBody = document.querySelector(`#${tableId} tbody`);
        if (!tableBody) {
            console.error(`جدول با شناسه ${tableId} پیدا نشد`);
            return;
        }
        
        tableBody.innerHTML = '';
        
        if (purchases.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <i class="fas fa-shopping-cart" style="font-size: 2.5rem; color: #ddd; margin-bottom: 15px; display: block;"></i>
                        <p style="color: #888; font-size: 1.1rem;">هیچ خریدی ثبت نشده است.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        purchases.forEach((purchase, index) => {
            const row = document.createElement('tr');
            
            // تعیین کلاس دسته‌بندی
            let categoryClass = 'category-other';
            if (purchase.category === 'الکترونیک') categoryClass = 'category-electronics';
            else if (purchase.category === 'پوشاک') categoryClass = 'category-clothing';
            else if (purchase.category === 'خواروبار') categoryClass = 'category-food';
            else if (purchase.category === 'کالای دیجیتال') categoryClass = 'category-digital';
            else if (purchase.category === 'لوازم خانگی') categoryClass = 'category-home';
            
            // تبدیل تاریخ
            const date = new Date(purchase.created_at);
            const formattedDate = date.toLocaleDateString('fa-IR');
            const formattedTime = date.toLocaleTimeString('fa-IR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${purchase.item_name}</strong></td>
                <td>${purchase.buyer_name}</td>
                <td><span class="price-badge">${purchase.price.toLocaleString()} افغانی</span></td>
                <td><span class="category-badge ${categoryClass}">${purchase.category}</span></td>
                <td>
                    <div>${formattedDate}</div>
                    <small style="color: #888; font-size: 0.85rem;">${formattedTime}</small>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    populateUsersTable: async function(users) {
        const tableBody = document.querySelector('#usersTable tbody');
        if (!tableBody) {
            console.error('جدول usersTable پیدا نشد');
            return;
        }
        
        tableBody.innerHTML = '';
        
        for (const user of users) {
            const row = document.createElement('tr');
            const userPurchases = await DB.getUserPurchases(user.id);
            const totalSpent = userPurchases.reduce((sum, purchase) => sum + purchase.price, 0);
            
            row.innerHTML = `
                <td>${user.id}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="user-avatar-small" style="
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            background-color: ${this.getRandomColor(user.username)};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                        ">${user.username.charAt(0).toUpperCase()}</div>
                        <div>
                            <strong>${user.username}</strong>
                            <div style="font-size: 0.85rem; color: #666;">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}">
                        ${user.role === 'admin' ? 'مدیر' : 'کاربر'}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${user.status === 'active' ? 'فعال' : 'غیرفعال'}
                    </span>
                </td>
                <td>
                    <span class="purchase-count">${userPurchases.length}</span>
                </td>
                <td>
                    <span class="price-badge">${totalSpent.toLocaleString()} افغانی</span>
                </td>
            `;
            tableBody.appendChild(row);
        }
    },
    
    populateAllPurchasesTable: function(purchases) {
        const tableBody = document.querySelector('#allUsersPurchasesTable tbody');
        if (!tableBody) {
            console.error('جدول allUsersPurchasesTable پیدا نشد');
            return;
        }
        
        tableBody.innerHTML = '';
        
        if (purchases.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <i class="fas fa-shopping-cart" style="font-size: 2.5rem; color: #ddd; margin-bottom: 15px; display: block;"></i>
                        <p style="color: #888; font-size: 1.1rem;">هیچ خریدی توسط کاربران ثبت نشده است.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        purchases.forEach((purchase, index) => {
            const row = document.createElement('tr');
            
            // تعیین کلاس دسته‌بندی
            let categoryClass = 'category-other';
            if (purchase.category === 'الکترونیک') categoryClass = 'category-electronics';
            else if (purchase.category === 'پوشاک') categoryClass = 'category-clothing';
            else if (purchase.category === 'خواروبار') categoryClass = 'category-food';
            else if (purchase.category === 'کالای دیجیتال') categoryClass = 'category-digital';
            else if (purchase.category === 'لوازم خانگی') categoryClass = 'category-home';
            
            // تبدیل تاریخ
            const date = new Date(purchase.created_at);
            const formattedDate = date.toLocaleDateString('fa-IR');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${purchase.item_name}</strong></td>
                <td>${purchase.buyer_name}</td>
                <td>
                    <span style="
                        background-color: ${this.getRandomColor(purchase.username)};
                        color: white;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-weight: 500;
                        font-size: 0.9rem;
                    ">
                        ${purchase.username}
                    </span>
                </td>
                <td><span class="price-badge">${purchase.price.toLocaleString()} افغانی</span></td>
                <td><span class="category-badge ${categoryClass}">${purchase.category}</span></td>
                <td>${formattedDate}</td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    updateUserStats: function(purchases) {
        const totalPurchases = purchases.length;
        const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price, 0);
        const averagePurchase = totalPurchases > 0 ? Math.round(totalSpent / totalPurchases) : 0;
        
        // به‌روزرسانی عناصر HTML
        const totalPurchasesEl = document.getElementById('userTotalPurchases');
        const totalSpentEl = document.getElementById('userTotalSpent');
        const averagePurchaseEl = document.getElementById('userAveragePurchase');
        
        if (totalPurchasesEl) totalPurchasesEl.textContent = totalPurchases;
        if (totalSpentEl) totalSpentEl.textContent = totalSpent.toLocaleString() + ' افغانی';
        if (averagePurchaseEl) averagePurchaseEl.textContent = averagePurchase.toLocaleString() + ' افغانی';
    },
    
    updateAdminStats: function(users, purchases) {
        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.status === 'active').length;
        const totalPurchases = purchases.length;
        const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.price, 0);
        
        // به‌روزرسانی عناصر HTML
        const totalUsersEl = document.getElementById('adminTotalUsers');
        const activeUsersEl = document.getElementById('adminActiveUsers');
        const totalPurchasesEl = document.getElementById('adminTotalPurchases');
        const totalRevenueEl = document.getElementById('adminTotalRevenue');
        
        if (totalUsersEl) totalUsersEl.textContent = totalUsers;
        if (activeUsersEl) activeUsersEl.textContent = activeUsers;
        if (totalPurchasesEl) totalPurchasesEl.textContent = totalPurchases;
        if (totalRevenueEl) totalRevenueEl.textContent = totalRevenue.toLocaleString() + ' افغانی';
    },
    
    setupDailyResetTimer: async function() {
        try {
            const settings = await DB.getSettings();
            
            if (!settings.auto_reset) {
                console.log("بروزرسانی خودکار غیرفعال است");
                return;
            }
            
            const resetInterval = settings.reset_interval || 86400000; // 24 ساعت پیش‌فرض
            
            const updateTimer = () => {
                const now = Date.now();
                const nextResetTime = now + resetInterval;
                
                // بروزرسانی داده‌ها
                setTimeout(async () => {
                    const previousPurchases = await DB.resetDailyData();
                    
                    if (previousPurchases.length > 0) {
                        this.showNotification(`داده‌های جدول به‌طور خودکار بروزرسانی شدند. ${previousPurchases.length} خرید حذف شد.`, 'info');
                    }
                    
                    // بارگذاری مجدد داده‌ها
                    const user = Auth.getCurrentUser();
                    if (user) {
                        if (user.role === 'admin') {
                            await this.loadAdminData();
                        } else {
                            await this.loadUserData(user.id);
                        }
                    }
                    
                    // راه‌اندازی مجدد تایمر
                    this.setupDailyResetTimer();
                }, resetInterval);
                
                // نمایش تایمر
                const updateCountdown = () => {
                    const timeLeft = nextResetTime - Date.now();
                    
                    // تبدیل میلی‌ثانیه به ساعت، دقیقه و ثانیه
                    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                    
                    // نمایش تایمر
                    const countdownElement = document.getElementById('countdown');
                    if (countdownElement) {
                        countdownElement.textContent = 
                            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                        
                        // تغییر رنگ هنگام نزدیک شدن به زمان بروزرسانی
                        if (hours < 1) {
                            countdownElement.style.color = '#ff6b6b';
                        } else if (hours < 3) {
                            countdownElement.style.color = '#ffd166';
                        }
                    }
                };
                
                updateCountdown();
                const timerInterval = setInterval(updateCountdown, 1000);
                
                // ذخیره interval برای پاکسازی در صورت نیاز
                if (window.purchaseTimerInterval) {
                    clearInterval(window.purchaseTimerInterval);
                }
                window.purchaseTimerInterval = timerInterval;
            };
            
            updateTimer();
        } catch (error) {
            console.error("خطا در تنظیم تایمر:", error);
        }
    },
    
    showNotification: function(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) {
            // اگر نوتیفیکیشن وجود ندارد، یکی ایجاد کن
            this.createNotificationElement();
            return this.showNotification(message, type);
        }
        
        // پاک کردن محتوای قبلی
        notification.innerHTML = '';
        
        // ایجاد آیکون بر اساس نوع
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        else if (type === 'error') iconClass = 'fa-exclamation-circle';
        else if (type === 'warning') iconClass = 'fa-exclamation-triangle';
        
        // ایجاد محتوا
        notification.innerHTML = `
            <i class="fas ${iconClass}" style="margin-left: 10px;"></i>
            <span>${message}</span>
            <button id="closeNotification" style="
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-right: auto;
                font-size: 1.2rem;
            ">×</button>
        `;
        
        // تغییر رنگ بر اساس نوع
        if (type === 'success') {
            notification.style.borderTopColor = '#2ecc71';
            notification.style.backgroundColor = '#d5f4e6';
        } else if (type === 'error') {
            notification.style.borderTopColor = '#f72585';
            notification.style.backgroundColor = '#fde8ef';
        } else if (type === 'warning') {
            notification.style.borderTopColor = '#ff9e00';
            notification.style.backgroundColor = '#fff4e6';
        } else if (type === 'info') {
            notification.style.borderTopColor = '#4361ee';
            notification.style.backgroundColor = '#e8f4fc';
        }
        
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'space-between';
        
        // رویداد بستن
        const closeBtn = document.getElementById('closeNotification');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.style.display = 'none';
            });
        }
        
        // مخفی کردن بعد از 5 ثانیه
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    },
    
    createNotificationElement: function() {
        // ایجاد عنصر نوتیفیکیشن اگر وجود ندارد
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: none;
            min-width: 300px;
            max-width: 400px;
            border-top: 4px solid #4361ee;
            background-color: #e8f4fc;
            color: #333;
            font-family: inherit;
        `;
        document.body.appendChild(notification);
    },
    
    showLoading: function(message) {
        const notification = document.getElementById('notification');
        if (!notification) {
            this.createNotificationElement();
            return this.showLoading(message);
        }
        
        notification.innerHTML = `
            <div class="loading" style="
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #4361ee;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-left: 10px;
            "></div>
            <span>${message || 'در حال بارگذاری...'}</span>
        `;
        
        notification.style.borderTopColor = '#4361ee';
        notification.style.backgroundColor = '#e8f4fc';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        
        // اضافه کردن animation اگر وجود ندارد
        if (!document.querySelector('#loadingStyles')) {
            const style = document.createElement('style');
            style.id = 'loadingStyles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    hideLoading: function() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.style.display = 'none';
        }
    },
    
    showButtonLoading: function(buttonId, textId, loadingId) {
        const button = document.getElementById(buttonId);
        const text = document.getElementById(textId);
        const loading = document.getElementById(loadingId);
        
        if (button) {
            button.disabled = true;
            button.style.opacity = '0.7';
            button.style.cursor = 'not-allowed';
        }
        if (text) text.classList.add('hidden');
        if (loading) loading.classList.remove('hidden');
    },
    
    hideButtonLoading: function(buttonId, textId, loadingId) {
        const button = document.getElementById(buttonId);
        const text = document.getElementById(textId);
        const loading = document.getElementById(loadingId);
        
        if (button) {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
        if (text) text.classList.remove('hidden');
        if (loading) loading.classList.add('hidden');
    },
    
    getRandomColor: function(str) {
        // تولید رنگ ثابت بر اساس رشته ورودی
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const colors = [
            '#4361ee', '#3a0ca3', '#7209b7', '#f72585',
            '#4cc9f0', '#4895ef', '#560bad', '#b5179e'
        ];
        
        return colors[Math.abs(hash) % colors.length];
    }
};

// راه‌اندازی سیستم هنگام لود صفحه
document.addEventListener('DOMContentLoaded', () => {
    console.log("صفحه لود شد - در حال راه‌اندازی سیستم...");
    
    // کمی تاخیر برای اطمینان از لود کامل DOM
    setTimeout(() => {
        console.log("شروع UI.init()");
        try {
            UI.init();
        } catch (error) {
            console.error("خطا در راه‌اندازی UI:", error);
            
            // نمایش پیام خطا به کاربر
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #f72585;
                color: white;
                padding: 15px;
                text-align: center;
                z-index: 9999;
                font-family: sans-serif;
            `;
            errorMsg.innerHTML = `
                خطا در راه‌اندازی سیستم: ${error.message}
                <br><small>لطفاً کنسول مرورگر را بررسی کنید (F12)</small>
            `;
            document.body.appendChild(errorMsg);
        }
    }, 100);
});

// اضافه کردن event listener برای ردیابی خطاها
window.addEventListener('error', function(e) {
    console.error('خطای عمومی:', e.error);
});

// اضافه کردن event listener برای rejectهای promise
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise رد شد:', e.reason);
});