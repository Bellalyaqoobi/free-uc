// سیستم مدیریت رابط کاربری
const UI = {
    init: function() {
        console.log("سیستم UI راه‌اندازی شد");
        
        // بررسی اگر کاربر قبلا وارد شده
        const user = Auth.getCurrentUser();
        if (user) {
            console.log("کاربر از قبل وارد شده:", user.username);
            this.showApp(user);
        }
        
        // تنظیم رویدادها
        this.setupEvents();
        
        // تنظیم تایمر بروزرسانی روزانه
        this.setupDailyResetTimer();
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
    
    handleLogin: function() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const role = document.getElementById('role').value;
        
        console.log("ورود با:", username, role);
        
        if (!username || !password) {
            this.showNotification('لطفاً نام کاربری و کلمه عبور را وارد کنید.', 'error');
            return;
        }
        
        const user = Auth.login(username, password, role);
        
        if (user) {
            this.showApp(user);
            this.showNotification(`خوش آمدید ${user.username}!`, 'success');
            // پاک کردن فیلدها
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        } else {
            this.showNotification('نام کاربری، کلمه عبور یا نقش انتخابی نادرست است.', 'error');
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
    
    showApp: function(user) {
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
            this.loadAdminData();
        } else {
            if (adminContent) adminContent.classList.add('hidden');
            if (userContent) {
                userContent.classList.remove('hidden');
                userContent.classList.add('active');
            }
            this.loadUserData(user.id);
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
    
    loadUserData: function(userId) {
        console.log("بارگذاری داده‌های کاربر با ID:", userId);
        
        // بارگذاری خریدهای اخیر کاربر
        const userPurchases = DB.getUserPurchases(userId);
        console.log("تعداد خریدهای کاربر:", userPurchases.length);
        
        this.populatePurchasesTable('recentPurchasesTable', userPurchases.slice(0, 5));
        
        // بارگذاری تمام خریدهای کاربر
        this.populatePurchasesTable('allPurchasesTable', userPurchases);
    },
    
    loadAdminData: function() {
        console.log("بارگذاری داده‌های مدیر");
        
        // بارگذاری لیست کاربران
        const users = DB.getUsers();
        this.populateUsersTable(users);
        
        // بارگذاری تمام خریدها (همه خریدهای همه کاربران)
        const allPurchases = DB.getAllPurchases();
        console.log("تعداد کل خریدها:", allPurchases.length);
        this.populateAllPurchasesTable(allPurchases);
        
        // نمایش مجموع کل خریدها
        const total = DB.getAllPurchasesTotal();
        const totalElement = document.getElementById('totalAllPurchases');
        if (totalElement) {
            totalElement.textContent = total.toLocaleString();
        }
    },
    
    handleAddPurchase: function() {
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
            this.showNotification('لطفاً قیمت معتبر به افغانی وارد کنید.', 'error');
            return;
        }
        
        const user = Auth.getCurrentUser();
        const purchase = {
            itemName: itemNameValue,
            buyerName: buyerNameValue,
            price: price, // قیمت به افغانی
            category: itemCategoryValue,
            userId: user.id,
            username: user.username,
            date: new Date().toLocaleDateString('fa-IR'),
            time: new Date().toLocaleTimeString('fa-IR')
        };
        
        console.log("خرید برای ثبت:", purchase);
        
        DB.addPurchase(purchase);
        
        // نمایش پیام موفقیت
        this.showNotification(`خرید "${itemNameValue}" به مبلغ ${price.toLocaleString()} افغانی با موفقیت ثبت شد.`, 'success');
        
        // پاک کردن فرم
        itemName.value = '';
        itemPrice.value = '';
        
        // بروزرسانی جداول
        if (user.role === 'admin') {
            this.loadAdminData();
        } else {
            this.loadUserData(user.id);
        }
        
        // نمایش تب خریدهای من
        this.switchTab('myPurchases');
        
        // جلوه بصری برای ثبت موفق
        const submitBtn = document.getElementById('submitPurchase');
        if (submitBtn) {
            submitBtn.classList.add('pulse');
            setTimeout(() => submitBtn.classList.remove('pulse'), 2000);
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
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${purchase.itemName}</strong></td>
                <td>${purchase.buyerName}</td>
                <td><span class="price-badge">${purchase.price.toLocaleString()} افغانی</span></td>
                <td><span class="category-badge ${categoryClass}">${purchase.category}</span></td>
                <td>${purchase.date}</td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    populateUsersTable: function(users) {
        const tableBody = document.querySelector('#usersTable tbody');
        if (!tableBody) {
            console.error('جدول usersTable پیدا نشد');
            return;
        }
        
        tableBody.innerHTML = '';
        
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            const userPurchases = DB.getUserPurchases(user.id);
            const userTotal = DB.getUserTotalPurchases(user.id);
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${user.username}</strong></td>
                <td>${user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}</td>
                <td>${user.email}</td>
                <td>
                    ${user.status === 'active' ? 'فعال' : 'غیرفعال'}
                    <span class="status-indicator ${user.status === 'active' ? 'status-active' : 'status-inactive'}"></span>
                </td>
                <td><span class="purchase-count">${userPurchases.length}</span></td>
                <td><span class="price-badge">${userTotal.toLocaleString()} افغانی</span></td>
            `;
            tableBody.appendChild(row);
        });
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
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${purchase.itemName}</strong></td>
                <td>${purchase.buyerName}</td>
                <td><span style="background-color: #e8f4fc; padding: 8px 15px; border-radius: 20px; font-weight: 500;">${purchase.username}</span></td>
                <td><span class="price-badge">${purchase.price.toLocaleString()} افغانی</span></td>
                <td><span class="category-badge ${categoryClass}">${purchase.category}</span></td>
                <td>${purchase.date}</td>
            `;
            tableBody.appendChild(row);
        });
    },
    
    setupDailyResetTimer: function() {
        const lastResetTime = DB.getLastResetTime();
        const settings = DB.getSettings();
        const nextResetTime = lastResetTime + settings.resetInterval;
        
        const updateTimer = () => {
            const now = Date.now();
            const timeLeft = nextResetTime - now;
            
            if (timeLeft <= 0 && settings.autoReset) {
                // بروزرسانی داده‌ها
                const previousPurchases = DB.resetDailyData();
                this.showNotification(`داده‌های جدول به‌طور خودکار بروزرسانی شدند. ${previousPurchases.length} خرید حذف شد.`, 'info');
                
                // بارگذاری مجدد داده‌ها
                const user = Auth.getCurrentUser();
                if (user) {
                    if (user.role === 'admin') {
                        this.loadAdminData();
                    } else {
                        this.loadUserData(user.id);
                    }
                }
                
                // راه‌اندازی مجدد تایمر
                this.setupDailyResetTimer();
                return;
            }
            
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
        
        // بروزرسانی تایمر هر ثانیه
        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
        
        // ذخیره interval برای پاکسازی در صورت نیاز
        if (window.purchaseTimerInterval) {
            clearInterval(window.purchaseTimerInterval);
        }
        window.purchaseTimerInterval = timerInterval;
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
    }
};
