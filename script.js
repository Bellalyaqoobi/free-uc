 // پیکربندی Supabase
        const SUPABASE_URL = 'https://iyxrqfiesrxqermppdyi.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5eHJxZmllc3J4cWVybXBwZHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NjMxNTcsImV4cCI6MjA3NzMzOTE1N30.nEoYjSnCeLxZTI8fc9GALEOp18fiqwUot4J1LQ5fCng';
        
        // ایجاد کلاینت Supabase
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // سیستم دیتابیس با Supabase
        const DB = {
            init: async function() {
                try {
                    // ایجاد جداول در صورت نیاز (این کار باید در Supabase انجام شود)
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
                    const { data, error } = await supabase
                        .from('users')
                        .select('*')
                        .order('id', { ascending: true });
                    
                    if (error) throw error;
                    
                    // اگر کاربری وجود ندارد، کاربران پیش‌فرض را ایجاد می‌کنیم
                    if (!data || data.length === 0) {
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
                    { id: 1, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@system.com', status: 'active' },
                    { id: 2, username: 'user1', password: '123456', role: 'user', email: 'user1@example.com', status: 'active' },
                    { id: 3, username: 'user2', password: '123456', role: 'user', email: 'user2@example.com', status: 'active' },
                    { id: 4, username: 'user3', password: '123456', role: 'user', email: 'user3@example.com', status: 'active' },
                    { id: 5, username: 'user4', password: '123456', role: 'user', email: 'user4@example.com', status: 'active' },
                    { id: 6, username: 'user5', password: '123456', role: 'user', email: 'user5@example.com', status: 'active' },
                    { id: 7, username: 'user6', password: '123456', role: 'user', email: 'user6@example.com', status: 'active' },
                    { id: 8, username: 'user7', password: '123456', role: 'user', email: 'user7@example.com', status: 'active' }
                ];
                
                try {
                    const { data, error } = await supabase
                        .from('users')
                        .insert(defaultUsers)
                        .select();
                    
                    if (error) throw error;
                    return data;
                } catch (error) {
                    console.error("خطا در ایجاد کاربران پیش‌فرض:", error);
                    return defaultUsers;
                }
            },
            
            // افزودن خرید جدید
            addPurchase: async function(purchase) {
                try {
                    const { data, error } = await supabase
                        .from('purchases')
                        .insert([purchase])
                        .select();
                    
                    if (error) throw error;
                    
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
                    const { data, error } = await supabase
                        .from('purchases')
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false });
                    
                    if (error) throw error;
                    
                    return data || [];
                } catch (error) {
                    console.error("خطا در دریافت خریدهای کاربر:", error);
                    return [];
                }
            },
            
            // دریافت تمام خریدها
            getAllPurchases: async function() {
                try {
                    const { data, error } = await supabase
                        .from('purchases')
                        .select('*')
                        .order('created_at', { ascending: false });
                    
                    if (error) throw error;
                    
                    return data || [];
                } catch (error) {
                    console.error("خطا در دریافت تمام خریدها:", error);
                    return [];
                }
            },
            
            // بروزرسانی روزانه داده‌ها
            resetDailyData: async function() {
                try {
                    // دریافت خریدهای قدیمی (بیشتر از 24 ساعت)
                    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                    
                    const { data: oldPurchases, error: fetchError } = await supabase
                        .from('purchases')
                        .select('*')
                        .lt('created_at', twentyFourHoursAgo);
                    
                    if (fetchError) throw fetchError;
                    
                    // حذف خریدهای قدیمی
                    if (oldPurchases && oldPurchases.length > 0) {
                        const { error: deleteError } = await supabase
                            .from('purchases')
                            .delete()
                            .lt('created_at', twentyFourHoursAgo);
                        
                        if (deleteError) throw deleteError;
                        
                        console.log(`${oldPurchases.length} خرید قدیمی حذف شدند`);
                        return oldPurchases;
                    }
                    
                    return [];
                } catch (error) {
                    console.error("خطا در بروزرسانی روزانه داده‌ها:", error);
                    return [];
                }
            },
            
            // دریافت تنظیمات
            getSettings: async function() {
                try {
                    const { data, error } = await supabase
                        .from('settings')
                        .select('*')
                        .single();
                    
                    if (error && error.code !== 'PGRST116') { // اگر رکوردی وجود ندارد
                        throw error;
                    }
                    
                    if (!data) {
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
                        
                        if (insertError) throw insertError;
                        return newSettings;
                    }
                    
                    return data;
                } catch (error) {
                    console.error("خطا در دریافت تنظیمات:", error);
                    return {
                        auto_reset: true,
                        reset_interval: 24 * 60 * 60 * 1000
                    };
                }
            }
        };

        // سیستم احراز هویت
        const Auth = {
            currentUser: null,
            
            login: async function(username, password, role) {
                try {
                    const users = await DB.getUsers();
                    const user = users.find(u => 
                        u.username === username && 
                        u.password === password && 
                        u.role === role
                    );
                    
                    if (user) {
                        this.currentUser = user;
                        // ذخیره کاربر فعلی در sessionStorage
                        sessionStorage.setItem('currentUser', JSON.stringify(user));
                        return user;
                    }
                    
                    return null;
                } catch (error) {
                    console.error("خطا در ورود:", error);
                    return null;
                }
            },
            
            logout: function() {
                this.currentUser = null;
                sessionStorage.removeItem('currentUser');
            },
            
            getCurrentUser: function() {
                if (this.currentUser) {
                    return this.currentUser;
                }
                
                // بررسی sessionStorage
                const storedUser = sessionStorage.getItem('currentUser');
                if (storedUser) {
                    this.currentUser = JSON.parse(storedUser);
                    return this.currentUser;
                }
                
                return null;
            }
        };

        // سیستم مدیریت رابط کاربری
        const UI = {
            init: function() {
                console.log("سیستم UI راه‌اندازی شد");
                
                // اتصال به Supabase
                this.showLoading('در حال اتصال به پایگاه داده...');
                
                setTimeout(async () => {
                    const connected = await DB.init();
                    if (connected) {
                        this.hideLoading();
                        
                        // بررسی اگر کاربر قبلا وارد شده
                        const user = Auth.getCurrentUser();
                        if (user) {
                            console.log("کاربر از قبل وارد شده:", user.username);
                            this.showApp(user);
                        }
                    } else {
                        this.showNotification('خطا در اتصال به پایگاه داده. لطفاً دوباره امتحان کنید.', 'error');
                    }
                    
                    // تنظیم رویدادها
                    this.setupEvents();
                    
                    // تنظیم تایمر بروزرسانی روزانه
                    this.setupDailyResetTimer();
                }, 1000);
            },
            
            setupEvents: function() {
                console.log("رویدادها تنظیم شدند");
                
                // دکمه ورود
                const loginBtn = document.getElementById('loginBtn');
                if (loginBtn) {
                    loginBtn.addEventListener('click', () => {
                        this.handleLogin();
                    });
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
                
                // دکمه‌های خروجی اکسل
                const exportButtons = [
                    'exportUserRecentExcel',
                    'exportUserAllExcel',
                    'exportUsersExcel',
                    'exportAllPurchasesExcel'
                ];
                
                exportButtons.forEach(btnId => {
                    const btn = document.getElementById(btnId);
                    if (btn) {
                        btn.addEventListener('click', () => {
                            this[btnId === 'exportUserRecentExcel' ? 'exportUserRecentToExcel' :
                                  btnId === 'exportUserAllExcel' ? 'exportUserAllToExcel' :
                                  btnId === 'exportUsersExcel' ? 'exportUsersToExcel' :
                                  'exportAllPurchasesToExcel']();
                        });
                    }
                });
                
                // دکمه‌های چاپ
                const printButtons = [
                    'printUserRecent',
                    'printUserAll',
                    'printUsers',
                    'printAllPurchases'
                ];
                
                printButtons.forEach(btnId => {
                    const btn = document.getElementById(btnId);
                    if (btn) {
                        btn.addEventListener('click', () => {
                            this[btnId === 'printUserRecent' ? 'printUserRecentPurchases' :
                                  btnId === 'printUserAll' ? 'printUserAllPurchases' :
                                  btnId === 'printUsers' ? 'printUsersList' :
                                  'printAllPurchasesList']();
                        });
                    }
                });
                
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
            },
            
            handleLogin: async function() {
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value.trim();
                const role = document.getElementById('role').value;
                
                console.log("ورود با:", username, role);
                
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
                        document.getElementById('username').value = '';
                        document.getElementById('password').value = '';
                    } else {
                        this.showNotification('نام کاربری، کلمه عبور یا نقش انتخابی نادرست است.', 'error');
                    }
                } catch (error) {
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
                const authSection = document.getElementById('authSection');
                const appSection = document.getElementById('appSection');
                
                if (authSection) authSection.classList.remove('hidden');
                if (appSection) appSection.classList.add('hidden');
            },
            
            showApp: async function(user) {
                console.log("نمایش برنامه برای کاربر:", user.username);
                
                const authSection = document.getElementById('authSection');
                const appSection = document.getElementById('appSection');
                
                if (authSection) authSection.classList.add('hidden');
                if (appSection) appSection.classList.remove('hidden');
                
                // نمایش اطلاعات کاربر
                const userNameElement = document.getElementById('currentUserName');
                const userEmailElement = document.getElementById('currentUserEmail');
                const userAvatarElement = document.getElementById('userAvatar');
                
                if (userNameElement) userNameElement.textContent = user.username;
                if (userEmailElement) userEmailElement.textContent = user.email;
                
                // تنظیم آواتار کاربر
                if (userAvatarElement) userAvatarElement.textContent = user.username.charAt(0).toUpperCase();
                
                const roleElement = document.getElementById('currentUserRole');
                if (roleElement) {
                    roleElement.textContent = user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی';
                    roleElement.classList.toggle('admin', user.role === 'admin');
                }
                
                // نمایش بخش مناسب بر اساس نقش
                const userContent = document.getElementById('userContent');
                const adminContent = document.getElementById('adminContent');
                
                if (user.role === 'admin') {
                    if (userContent) userContent.classList.add('hidden');
                    if (adminContent) {
                        adminContent.classList.remove('hidden');
                        adminContent.classList.add('active');
                    }
                    await this.loadAdminData();
                } else {
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
                console.log("بارگذاری داده‌های کاربر با ID:", userId);
                
                // نمایش لودینگ
                this.showLoading('در حال بارگذاری خریدها...');
                
                try {
                    // بارگذاری خریدهای اخیر کاربر
                    const userPurchases = await DB.getUserPurchases(userId);
                    console.log("تعداد خریدهای کاربر:", userPurchases.length);
                    
                    this.populatePurchasesTable('recentPurchasesTable', userPurchases.slice(0, 5));
                    
                    // بارگذاری تمام خریدهای کاربر
                    this.populatePurchasesTable('allPurchasesTable', userPurchases);
                } catch (error) {
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
                    this.populateUsersTable(users);
                    
                    // بارگذاری تمام خریدها (همه خریدهای همه کاربران)
                    const allPurchases = await DB.getAllPurchases();
                    console.log("تعداد کل خریدها:", allPurchases.length);
                    this.populateAllPurchasesTable(allPurchases);
                } catch (error) {
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
                const purchase = {
                    item_name: itemNameValue,
                    buyer_name: buyerNameValue,
                    price,
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
                        // نمایش پیام موفقیت
                        this.showNotification(`خرید "${itemNameValue}" با موفقیت ثبت شد. این خرید هم برای شما و هم برای مدیر قابل مشاهده است.`, 'success');
                        
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
                    
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td><strong>${purchase.item_name}</strong></td>
                        <td>${purchase.buyer_name}</td>
                        <td><span class="price-badge">${purchase.price.toLocaleString()}</span></td>
                        <td><span class="category-badge ${categoryClass}">${purchase.category}</span></td>
                        <td>${formattedDate}</td>
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
                    
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td><strong>${user.username}</strong></td>
                        <td>${user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}</td>
                        <td>${user.email}</td>
                        <td>
                            ${user.status === 'active' ? 'فعال' : 'غیرفعال'}
                            <span class="status-indicator ${user.status === 'active' ? 'status-active' : 'status-inactive'}"></span>
                        </td>
                        <td><span class="purchase-count">${userPurchases.length}</span></td>
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
                        <td><span style="background-color: #e8f4fc; padding: 8px 15px; border-radius: 20px; font-weight: 500;">${purchase.username}</span></td>
                        <td><span class="price-badge">${purchase.price.toLocaleString()}</span></td>
                        <td><span class="category-badge ${categoryClass}">${purchase.category}</span></td>
                        <td>${formattedDate}</td>
                    `;
                    tableBody.appendChild(row);
                });
            },
            
            setupDailyResetTimer: async function() {
                try {
                    const settings = await DB.getSettings();
                    const resetInterval = settings.reset_interval;
                    
                    const updateTimer = () => {
                        const now = Date.now();
                        const nextResetTime = now + resetInterval;
                        
                        if (settings.auto_reset) {
                            // بروزرسانی داده‌ها
                            setTimeout(async () => {
                                const previousPurchases = await DB.resetDailyData();
                                this.showNotification(`داده‌های جدول به‌طور خودکار بروزرسانی شدند. ${previousPurchases.length} خرید حذف شد.`, 'info');
                                
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
                        }
                        
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
                if (!notification) return;
                
                notification.innerHTML = `
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                    <span>${message}</span>
                `;
                
                // تغییر رنگ بر اساس نوع
                if (type === 'success') {
                    notification.style.borderTopColor = '#2ecc71';
                } else if (type === 'error') {
                    notification.style.borderTopColor = '#f72585';
                } else if (type === 'info') {
                    notification.style.borderTopColor = '#4361ee';
                }
                
                notification.style.display = 'block';
                
                // مخفی کردن بعد از 5 ثانیه
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 5000);
            },
            
            // تابع خروجی اکسل برای خریدهای اخیر کاربر
            exportUserRecentToExcel: async function() {
                const user = Auth.getCurrentUser();
                if (!user) return;
                
                try {
                    const purchases = await DB.getUserPurchases(user.id);
                    const recentPurchases = purchases.slice(0, 5);
                    
                    if (recentPurchases.length === 0) {
                        this.showNotification('هیچ خریدی برای خروجی گرفتن وجود ندارد.', 'info');
                        return;
                    }
                    
                    const data = recentPurchases.map((purchase, index) => ({
                        'ردیف': index + 1,
                        'نام کالا': purchase.item_name,
                        'نام خریدار': purchase.buyer_name,
                        'قیمت (افغانی )': purchase.price,
                        'دسته‌بندی': purchase.category,
                        'تاریخ ثبت': new Date(purchase.created_at).toLocaleDateString('fa-IR'),
                        'زمان ثبت': new Date(purchase.created_at).toLocaleTimeString('fa-IR')
                    }));
                    
                    this.exportToExcel(data, `خریدهای_اخیر_${user.username}_${new Date().toLocaleDateString('fa-IR')}`);
                    this.showNotification('خروجی اکسل خریدهای اخیر با موفقیت ایجاد شد.', 'success');
                } catch (error) {
                    this.showNotification('خطا در دریافت داده‌ها', 'error');
                }
            },
            
            // تابع خروجی اکسل برای تمام خریدهای کاربر
            exportUserAllToExcel: async function() {
                const user = Auth.getCurrentUser();
                if (!user) return;
                
                try {
                    const purchases = await DB.getUserPurchases(user.id);
                    
                    if (purchases.length === 0) {
                        this.showNotification('هیچ خریدی برای خروجی گرفتن وجود ندارد.', 'info');
                        return;
                    }
                    
                    const data = purchases.map((purchase, index) => ({
                        'ردیف': index + 1,
                        'نام کالا': purchase.item_name,
                        'نام خریدار': purchase.buyer_name,
                        'قیمت (افغانی )': purchase.price,
                        'دسته‌بندی': purchase.category,
                        'تاریخ ثبت': new Date(purchase.created_at).toLocaleDateString('fa-IR'),
                        'زمان ثبت': new Date(purchase.created_at).toLocaleTimeString('fa-IR')
                    }));
                    
                    this.exportToExcel(data, `تمام_خریدهای_${user.username}_${new Date().toLocaleDateString('fa-IR')}`);
                    this.showNotification('خروجی اکسل تمام خریدهای شما با موفقیت ایجاد شد.', 'success');
                } catch (error) {
                    this.showNotification('خطا در دریافت داده‌ها', 'error');
                }
            },
            
            // تابع خروجی اکسل برای کاربران
            exportUsersToExcel: async function() {
                try {
                    const users = await DB.getUsers();
                    const data = [];
                    
                    for (const user of users) {
                        const userPurchases = await DB.getUserPurchases(user.id);
                        data.push({
                            'ردیف': user.id,
                            'نام کاربری': user.username,
                            'نقش': user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی',
                            'ایمیل': user.email,
                            'وضعیت': user.status === 'active' ? 'فعال' : 'غیرفعال',
                            'تعداد خریدها': userPurchases.length
                        });
                    }
                    
                    this.exportToExcel(data, `لیست_کاربران_${new Date().toLocaleDateString('fa-IR')}`);
                    this.showNotification('خروجی اکسل لیست کاربران با موفقیت ایجاد شد.', 'success');
                } catch (error) {
                    this.showNotification('خطا در دریافت داده‌ها', 'error');
                }
            },
            
            // تابع خروجی اکسل برای تمام خریدها
            exportAllPurchasesToExcel: async function() {
                try {
                    const purchases = await DB.getAllPurchases();
                    
                    if (purchases.length === 0) {
                        this.showNotification('هیچ خریدی برای خروجی گرفتن وجود ندارد.', 'info');
                        return;
                    }
                    
                    const data = purchases.map((purchase, index) => ({
                        'ردیف': index + 1,
                        'نام کالا': purchase.item_name,
                        'نام خریدار': purchase.buyer_name,
                        'کاربر ثبت‌کننده': purchase.username,
                        'قیمت (افغانی )': purchase.price,
                        'دسته‌بندی': purchase.category,
                        'تاریخ ثبت': new Date(purchase.created_at).toLocaleDateString('fa-IR'),
                        'زمان ثبت': new Date(purchase.created_at).toLocaleTimeString('fa-IR')
                    }));
                    
                    this.exportToExcel(data, `تمام_خریدهای_سیستم_${new Date().toLocaleDateString('fa-IR')}`);
                    this.showNotification('خروجی اکسل تمام خریدهای سیستم با موفقیت ایجاد شد.', 'success');
                } catch (error) {
                    this.showNotification('خطا در دریافت داده‌ها', 'error');
                }
            },
            
            // تابع عمومی برای ایجاد فایل اکسل - نسخه اصلاح شده
            exportToExcel: function(data, filename) {
                try {
                    // بررسی اینکه آیا کتابخانه XLSX لود شده
                    if (typeof XLSX === 'undefined') {
                        this.showNotification('کتابخانه اکسل لود نشده است. لطفاً صفحه را رفرش کنید.', 'error');
                        return;
                    }
                    
                    // روش اول: استفاده از writeFile
                    try {
                        // ایجاد worksheet
                        const ws = XLSX.utils.json_to_sheet(data);
                        
                        // ایجاد workbook
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                        
                        // ذخیره فایل
                        XLSX.writeFile(wb, `${filename}.xlsx`);
                    } catch (e) {
                        // روش دوم: استفاده از Blob برای مرورگرهایی که writeFile کار نمی‌کند
                        console.log("استفاده از روش جایگزین با Blob");
                        
                        // ایجاد worksheet
                        const ws = XLSX.utils.json_to_sheet(data);
                        
                        // ایجاد workbook
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                        
                        // ایجاد binary string از workbook
                        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                        
                        // ایجاد Blob و ذخیره فایل
                        const blob = new Blob([wbout], { type: 'application/octet-stream' });
                        const url = URL.createObjectURL(blob);
                        
                        // ایجاد لینک برای دانلود
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${filename}.xlsx`;
                        document.body.appendChild(a);
                        a.click();
                        
                        // تمیزکاری
                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }, 100);
                    }
                    
                } catch (error) {
                    console.error('خطا در ایجاد فایل اکسل:', error);
                    this.showNotification('خطا در ایجاد فایل اکسل. لطفاً دوباره امتحان کنید.', 'error');
                }
            },
            
            // توابع چاپ
            printUserRecentPurchases: async function() {
                const user = Auth.getCurrentUser();
                if (!user) return;
                
                try {
                    const purchases = await DB.getUserPurchases(user.id);
                    const recentPurchases = purchases.slice(0, 5);
                    
                    if (recentPurchases.length === 0) {
                        this.showNotification('هیچ خریدی برای چاپ وجود ندارد.', 'info');
                        return;
                    }
                    
                    this.showPrintPreview(recentPurchases, `خریدهای اخیر ${user.username}`, ['ردیف', 'نام کالا', 'نام خریدار', 'قیمت (افغانی )', 'دسته‌بندی', 'تاریخ ثبت']);
                } catch (error) {
                    this.showNotification('خطا در دریافت داده‌ها', 'error');
                }
            },
            
            printUserAllPurchases: async function() {
                const user = Auth.getCurrentUser();
                if (!user) return;
                
                try {
                    const purchases = await DB.getUserPurchases(user.id);
                    
                    if (purchases.length === 0) {
                        this.showNotification('هیچ خریدی برای چاپ وجود ندارد.', 'info');
                        return;
                    }
                    
                    this.showPrintPreview(purchases, `تمام خریدهای ${user.username}`, ['ردیف', 'نام کالا', 'نام خریدار', 'قیمت (افغانی )', 'دسته‌بندی', 'تاریخ ثبت']);
                } catch (error) {
                    this.showNotification('خطا در دریافت داده‌ها', 'error');
                }
            },
            
            printUsersList: async function() {
                try {
                    const users = await DB.getUsers();
                    const data = [];
                    
                    for (const user of users) {
                        const userPurchases = await DB.getUserPurchases(user.id);
                        data.push({
                            'ردیف': user.id,
                            'نام کاربری': user.username,
                            'نقش': user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی',
                            'ایمیل': user.email,
                            'وضعیت': user.status === 'active' ? 'فعال' : 'غیرفعال',
                            'تعداد خریدها': userPurchases.length
                        });
                    }
                    
                    this.showPrintPreview(data, 'لیست کاربران سیستم', ['ردیف', 'نام کاربری', 'نقش', 'ایمیل', 'وضعیت', 'تعداد خریدها']);
                } catch (error) {
                    this.showNotification('خطا در دریافت داده‌ها', 'error');
                }
            },
            
            printAllPurchasesList: async function() {
                try {
                    const purchases = await DB.getAllPurchases();
                    
                    if (purchases.length === 0) {
                        this.showNotification('هیچ خریدی برای چاپ وجود ندارد.', 'info');
                        return;
                    }
                    
                    const data = purchases.map((purchase, index) => ({
                        'ردیف': index + 1,
                        'نام کالا': purchase.item_name,
                        'نام خریدار': purchase.buyer_name,
                        'کاربر ثبت‌کننده': purchase.username,
                        'قیمت (افغانی )': purchase.price,
                        'دسته‌بندی': purchase.category,
                        'تاریخ ثبت': new Date(purchase.created_at).toLocaleDateString('fa-IR')
                    }));
                    
                    this.showPrintPreview(data, 'تمام خریدهای سیستم', ['ردیف', 'نام کالا', 'نام خریدار', 'کاربر ثبت‌کننده', 'قیمت (افغانی )', 'دسته‌بندی', 'تاریخ ثبت']);
                } catch (error) {
                    this.showNotification('خطا در دریافت داده‌ها', 'error');
                }
            },
            
            showPrintPreview: function(data, title, headers) {
                const printPreviewModal = document.getElementById('printPreviewModal');
                const printPreviewBody = document.getElementById('printPreviewBody');
                
                if (!printPreviewModal || !printPreviewBody) return;
                
                // ایجاد HTML برای پیش‌نمایش چاپ
                let html = `
                    <div class="print-section">
                        <div class="print-header">
                            <h2>${title}</h2>
                            <p>تاریخ چاپ: ${new Date().toLocaleDateString('fa-IR')}</p>
                            <p>تعداد رکوردها: ${data.length}</p>
                        </div>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            <thead>
                                <tr>
                `;
                
                // اضافه کردن هدرها
                headers.forEach(header => {
                    html += `<th style="border: 1px solid #ddd; padding: 8px; text-align: right; background-color: #f2f2f2;">${header}</th>`;
                });
                
                html += `
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                // اضافه کردن داده‌ها
                data.forEach((item, index) => {
                    html += `<tr>`;
                    headers.forEach(header => {
                        let value = item[header] || '';
                        // فرمت قیمت
                        if (header === 'قیمت (افغانی )' && value) {
                            value = value.toLocaleString();
                        }
                        html += `<td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${value}</td>`;
                    });
                    html += `</tr>`;
                });
                
                html += `
                            </tbody>
                        </table>
                        <div class="print-footer">
                            <p>سیستم مدیریت ثبت خرید - ${new Date().toLocaleDateString('fa-IR')}</p>
                        </div>
                    </div>
                `;
                
                printPreviewBody.innerHTML = html;
                printPreviewModal.style.display = 'flex';
            },
            
            showLoading: function(message) {
                const notification = document.getElementById('notification');
                if (!notification) return;
                
                notification.innerHTML = `
                    <div class="loading" style="display: inline-block; margin-left: 10px;"></div>
                    <span>${message || 'در حال بارگذاری...'}</span>
                `;
                
                notification.style.borderTopColor = '#4361ee';
                notification.style.display = 'block';
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
                
                if (button) button.disabled = true;
                if (text) text.classList.add('hidden');
                if (loading) loading.classList.remove('hidden');
            },
            
            hideButtonLoading: function(buttonId, textId, loadingId) {
                const button = document.getElementById(buttonId);
                const text = document.getElementById(textId);
                const loading = document.getElementById(loadingId);
                
                if (button) button.disabled = false;
                if (text) text.classList.remove('hidden');
                if (loading) loading.classList.add('hidden');
            }
        };

        // راه‌اندازی سیستم هنگام لود صفحه
        document.addEventListener('DOMContentLoaded', () => {
            console.log("صفحه لود شد");
            // کمی تاخیر برای اطمینان از لود کامل DOM
            setTimeout(() => {
                UI.init();
            }, 100);
        });