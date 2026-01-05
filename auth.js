// سیستم احراز هویت
const Auth = {
    currentUser: null,
    
    login: function(username, password, role) {
        const db = DB.init();
        const user = db.users.find(u => 
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
