// فایل اصلی - ترکیب همه بخش‌ها و افزودن توابع اکسل و چاپ

// اضافه کردن توابع اکسل به UI
Object.assign(UI, {
    // تابع خروجی اکسل برای خریدهای اخیر کاربر
    exportUserRecentToExcel: function() {
        const user = Auth.getCurrentUser();
        if (!user) return;
        
        const purchases = DB.getUserPurchases(user.id).slice(0, 5);
        if (purchases.length === 0) {
            this.showNotification('هیچ خریدی برای خروجی گرفتن وجود ندارد.', 'info');
            return;
        }
        
        const data = purchases.map((purchase, index) => ({
            'ردیف': index + 1,
            'نام کالا': purchase.itemName,
            'نام خریدار': purchase.buyerName,
            'قیمت (افغانی)': purchase.price,
            'دسته‌بندی': purchase.category,
            'تاریخ ثبت': purchase.date,
            'زمان ثبت': purchase.time || ''
        }));
        
        this.exportToExcel(data, `خریدهای_اخیر_${user.username}_${new Date().toLocaleDateString('fa-IR')}`);
        this.showNotification('خروجی اکسل خریدهای اخیر با موفقیت ایجاد شد.', 'success');
    },
    
    // تابع خروجی اکسل برای تمام خریدهای کاربر
    exportUserAllToExcel: function() {
        const user = Auth.getCurrentUser();
        if (!user) return;
        
        const purchases = DB.getUserPurchases(user.id);
        if (purchases.length === 0) {
            this.showNotification('هیچ خریدی برای خروجی گرفتن وجود ندارد.', 'info');
            return;
        }
        
        const data = purchases.map((purchase, index) => ({
            'ردیف': index + 1,
            'نام کالا': purchase.itemName,
            'نام خریدار': purchase.buyerName,
            'قیمت (افغانی)': purchase.price,
            'دسته‌بندی': purchase.category,
            'تاریخ ثبت': purchase.date,
            'زمان ثبت': purchase.time || ''
        }));
        
        this.exportToExcel(data, `تمام_خریدهای_${user.username}_${new Date().toLocaleDateString('fa-IR')}`);
        this.showNotification('خروجی اکسل تمام خریدهای شما با موفقیت ایجاد شد.', 'success');
    },
    
    // تابع خروجی اکسل برای کاربران
    exportUsersToExcel: function() {
        const users = DB.getUsers();
        const data = users.map((user, index) => {
            const userPurchases = DB.getUserPurchases(user.id);
            const userTotal = DB.getUserTotalPurchases(user.id);
            return {
                'ردیف': index + 1,
                'نام کاربری': user.username,
                'نقش': user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی',
                'ایمیل': user.email,
                'وضعیت': user.status === 'active' ? 'فعال' : 'غیرفعال',
                'تعداد خریدها': userPurchases.length,
                'مجموع خرید (افغانی)': userTotal
            };
        });
        
        this.exportToExcel(data, `لیست_کاربران_${new Date().toLocaleDateString('fa-IR')}`);
        this.showNotification('خروجی اکسل لیست کاربران با موفقیت ایجاد شد.', 'success');
    },
    
    // تابع خروجی اکسل برای تمام خریدها
    exportAllPurchasesToExcel: function() {
        const purchases = DB.getAllPurchases();
        if (purchases.length === 0) {
            this.showNotification('هیچ خریدی برای خروجی گرفتن وجود ندارد.', 'info');
            return;
        }
        
        const data = purchases.map((purchase, index) => ({
            'ردیف': index + 1,
            'نام کالا': purchase.itemName,
            'نام خریدار': purchase.buyerName,
            'کاربر ثبت‌کننده': purchase.username,
            'قیمت (افغانی)': purchase.price,
            'دسته‌بندی': purchase.category,
            'تاریخ ثبت': purchase.date,
            'زمان ثبت': purchase.time || ''
        }));
        
        this.exportToExcel(data, `تمام_خریدهای_سیستم_${new Date().toLocaleDateString('fa-IR')}`);
        this.showNotification('خروجی اکسل تمام خریدهای سیستم با موفقیت ایجاد شد.', 'success');
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
    printUserRecentPurchases: function() {
        const user = Auth.getCurrentUser();
        if (!user) return;
        
        const purchases = DB.getUserPurchases(user.id).slice(0, 5);
        if (purchases.length === 0) {
            this.showNotification('هیچ خریدی برای چاپ وجود ندارد.', 'info');
            return;
        }
        
        const data = purchases.map((purchase, index) => ({
            'ردیف': index + 1,
            'نام کالا': purchase.itemName,
            'نام خریدار': purchase.buyerName,
            'قیمت (افغانی)': purchase.price,
            'دسته‌بندی': purchase.category,
            'تاریخ ثبت': purchase.date
        }));
        
        this.showPrintPreview(data, `خریدهای اخیر ${user.username}`, ['ردیف', 'نام کالا', 'نام خریدار', 'قیمت (افغانی)', 'دسته‌بندی', 'تاریخ ثبت']);
    },
    
    printUserAllPurchases: function() {
        const user = Auth.getCurrentUser();
        if (!user) return;
        
        const purchases = DB.getUserPurchases(user.id);
        if (purchases.length === 0) {
            this.showNotification('هیچ خریدی برای چاپ وجود ندارد.', 'info');
            return;
        }
        
        const data = purchases.map((purchase, index) => ({
            'ردیف': index + 1,
            'نام کالا': purchase.itemName,
            'نام خریدار': purchase.buyerName,
            'قیمت (افغانی)': purchase.price,
            'دسته‌بندی': purchase.category,
            'تاریخ ثبت': purchase.date
        }));
        
        const total = purchases.reduce((sum, p) => sum + p.price, 0);
        this.showPrintPreview(data, `تمام خریدهای ${user.username}`, ['ردیف', 'نام کالا', 'نام خریدار', 'قیمت (افغانی)', 'دسته‌بندی', 'تاریخ ثبت'], total);
    },
    
    printUsersList: function() {
        const users = DB.getUsers();
        const data = users.map((user, index) => {
            const userPurchases = DB.getUserPurchases(user.id);
            const userTotal = DB.getUserTotalPurchases(user.id);
            return {
                'ردیف': index + 1,
                'نام کاربری': user.username,
                'نقش': user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی',
                'ایمیل': user.email,
                'وضعیت': user.status === 'active' ? 'فعال' : 'غیرفعال',
                'تعداد خریدها': userPurchases.length,
                'مجموع خرید (افغانی)': userTotal
            };
        });
        
        const total = users.reduce((sum, user) => sum + DB.getUserTotalPurchases(user.id), 0);
        this.showPrintPreview(data, 'لیست کاربران سیستم', ['ردیف', 'نام کاربری', 'نقش', 'ایمیل', 'وضعیت', 'تعداد خریدها', 'مجموع خرید (افغانی)'], total);
    },
    
    printAllPurchasesList: function() {
        const purchases = DB.getAllPurchases();
        if (purchases.length === 0) {
            this.showNotification('هیچ خریدی برای چاپ وجود ندارد.', 'info');
            return;
        }
        
        const data = purchases.map((purchase, index) => ({
            'ردیف': index + 1,
            'نام کالا': purchase.itemName,
            'نام خریدار': purchase.buyerName,
            'کاربر ثبت‌کننده': purchase.username,
            'قیمت (افغانی)': purchase.price,
            'دسته‌بندی': purchase.category,
            'تاریخ ثبت': purchase.date
        }));
        
        const total = purchases.reduce((sum, p) => sum + p.price, 0);
        this.showPrintPreview(data, 'تمام خریدهای سیستم', ['ردیف', 'نام کالا', 'نام خریدار', 'کاربر ثبت‌کننده', 'قیمت (افغانی)', 'دسته‌بندی', 'تاریخ ثبت'], total);
    },
    
    showPrintPreview: function(data, title, headers, total = null) {
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
        `;
        
        if (total !== null) {
            html += `<p>مجموع کل: ${total.toLocaleString()} افغانی</p>`;
        }
        
        html += `
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
                // فرمت اعداد
                if ((header.includes('قیمت') || header.includes('مجموع')) && value && !isNaN(value)) {
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
                    <p>تمامی قیمت‌ها به افغانی محاسبه شده است.</p>
                </div>
            </div>
        `;
        
        printPreviewBody.innerHTML = html;
        printPreviewModal.style.display = 'flex';
    }
});

// راه‌اندازی سیستم هنگام لود صفحه
document.addEventListener('DOMContentLoaded', () => {
    console.log("صفحه لود شد");
    // کمی تاخیر برای اطمینان از لود کامل DOM
    setTimeout(() => {
        UI.init();
    }, 100);
});
