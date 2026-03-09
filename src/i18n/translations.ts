export const translations = {
  en: {
    nav: { home: "Home", orders: "Orders", reports: "Reports", profile: "Profile" },
    auth: {
      login: "Login", register: "Register", forgotPassword: "Forgot Password", email: "Email", password: "Password", confirmPassword: "Confirm Password", phone: "Hong Kong Mobile Number", phonePlaceholder: "+852", rememberMe: "Remember me", forgotPasswordLink: "Forgot password?", noAccount: "Don't have an account?", hasAccount: "Already have an account?", signUp: "Sign Up", signIn: "Sign In", sendCode: "Send Verification Code", verifyCode: "Verify Code", resetPassword: "Reset Password", newPassword: "New Password", verificationTitle: "Verification", verificationDesc: "Enter the verification code sent to", resendCode: "Resend code", resendIn: "Resend in", orContinueWith: "Or continue with", loginWithEmail: "Login with Email", loginWithPhone: "Login with Phone", registerWithEmail: "Register with Email", registerWithPhone: "Register with Phone", fullName: "Full Name", agreeToTerms: "I agree to the Terms of Service and Privacy Policy", backToLogin: "Back to Login", resetViaEmail: "Reset via Email", resetViaPhone: "Reset via Phone", codeSent: "Verification code sent!", passwordRequired: "Password is required", emailRequired: "Email is required", emailInvalid: "Invalid email address", phoneRequired: "Phone number is required", phoneInvalid: "Enter a valid 8-digit HK number", nameRequired: "Full name is required", passwordMin: "Password must be at least 8 characters", passwordMismatch: "Passwords do not match", termsRequired: "You must agree to the terms",
    },
    home: {
      greeting: "Hello", subtitle: "How can we help you today?", inClinic: "In-Clinic Treatment", onlineConsult: "Online Consultation", recommended: "Recommended Institutions", viewAll: "View All", popularServices: "Popular Services", fromPrice: "From", coupons: "My Coupons", couponsAvailable: "coupons available", viewCoupons: "View Coupons", referral: "Referral Rewards", referralDesc: "Invite friends & earn rewards. Share your link and get coins for each successful referral!", referralLink: "Your Referral Link", copyLink: "Copy", qrCode: "QR Code", coinsBalance: "Coins Balance", coins: "coins", viewDetails: "View Details", bannerPromo1: "20% Off Teeth Whitening", bannerPromo1Sub: "Limited time offer at selected clinics", bannerPromo2: "Free Dental Check-up", bannerPromo2Sub: "For new patients at partner clinics", bannerPromo3: "Online Consultation Available", bannerPromo3Sub: "Consult with dentists from home", open: "Open", closed: "Closed", km: "km", rating: "Rating", recommendedAt: "Recommended at",
    },
    institutions: {
      title: "Find Institutions", searchPlaceholder: "Search clinics, services...", filters: "Filters", distance: "Distance", sortByRating: "Rating", priceRange: "Price", category: "Category", nearest: "Nearest", highestRated: "Highest Rated", lowestPrice: "Lowest Price", all: "All", general: "General", orthodontics: "Orthodontics", implants: "Implants", cosmetic: "Cosmetic", pediatric: "Pediatric", noResults: "No institutions found", noResultsDesc: "Try adjusting your search or filters", results: "results",
    },
    institutionDetail: {
      about: "About", photos: "Clinic Photos", hours: "Business Hours", phone: "Phone", address: "Address", transport: "How to Get Here", doctors: "Onboarded Doctors", services: "Services", reviews: "Patient Reviews", viewAllDoctors: "View All Doctors", viewAllServices: "View All Services", viewAllReviews: "View All Reviews", saveToFavorites: "Save", saved: "Saved", getDirections: "Get Directions", bookNow: "Book Now", yearsExp: "yrs exp", perVisit: "per visit", verified: "Verified", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
    },
    savedInstitutions: { title: "Saved Institutions", empty: "No saved institutions", emptyDesc: "Institutions you save will appear here" },
    couponsPage: { title: "My Coupons", available: "Available", used: "Used", expired: "Expired", empty: "No coupons yet", emptyDesc: "Your coupons will appear here", off: "OFF", validUntil: "Valid until", noCouponsApplicable: "No coupons applicable for this order" },
    referralPage: { title: "Referral Rewards", subtitle: "Invite friends, earn coins!", howItWorks: "How It Works", step1: "Share your referral link", step2: "Friend signs up and books", step3: "You both earn reward coins", yourLink: "Your Referral Link", copied: "Copied!", copy: "Copy", qrCode: "QR Code", balance: "Coin Balance", coins: "coins", history: "Transaction History", emptyHistory: "No transactions yet", emptyHistoryDesc: "Start inviting friends to earn coins", invited: "invited via your link", conversion: "≈ HKD value", conversionNote: "10 coins = HK$1. Coins can offset future order payments.", earned: "Earned", spent: "Spent" },
    booking: {
      selectService: "Select Service", serviceDetails: "Service Details", duration: "Duration", minutes: "min", category: "Category", selectDoctor: "Select Doctor", doctorDetails: "Doctor Details", consultations: "consultations", specialties: "Specialties", credentials: "Credentials", bio: "About", availableServices: "Available Services", continueBooking: "Continue Booking", selectTime: "Select Appointment Time", morning: "Morning", afternoon: "Afternoon", noSlots: "No available slots for this date", selectedSlot: "Selected", unavailable: "Unavailable", confirmBooking: "Confirm Booking", bookingSummary: "Booking Summary", institution: "Institution", service: "Service", doctor: "Doctor", dateTime: "Date & Time", treatmentDuration: "Treatment Duration", originalPrice: "Original Price", couponDiscount: "Coupon Discount", finalAmount: "Final Amount", applyCoupon: "Apply Coupon", selectCoupon: "Select Coupon", noCoupon: "No coupon", proceedToPayment: "Proceed to Payment", payment: "Payment", paymentAmount: "Payment Amount", selectPaymentMethod: "Select Payment Method", creditCard: "Credit Card", alipay: "Alipay", wechatPay: "WeChat Pay", payNow: "Pay Now", processing: "Processing...", paymentSuccess: "Payment Successful!", paymentSuccessDesc: "Your appointment has been booked successfully", orderNumber: "Order Number", viewOrder: "View Order", backToHome: "Back to Home",
    },
    orderManagement: {
      title: "My Orders", all: "All", pendingAcceptance: "Pending", pendingTreatment: "Confirmed", completed: "Completed", cancelled: "Cancelled", empty: "No orders", emptyDesc: "Your appointment orders will appear here", orderDetail: "Order Details", orderNo: "Order No.", status: "Status", createdAt: "Created", cancelOrder: "Cancel Order", writeReview: "Write Review", cancelConfirm: "Cancel Appointment", cancelWarning: "Are you sure you want to cancel this appointment?", cancellationPolicy: "Cancellation Policy", fullRefund: "Full refund", partialRefund: "partial refund (30% penalty)", noRefund: "No refund (treatment started)", moreThan24h: "More than 24 hours before appointment", within24h: "Within 24 hours of appointment", treatmentStarted: "Treatment has started", refundAmount: "Refund Amount", confirmCancel: "Confirm Cancellation", cancelSuccess: "Order cancelled successfully", searchOrders: "Search orders...", inClinic: "In-Clinic", onlineConsult: "Consultation",
    },
    review: {
      title: "Write Review", envRating: "Environment", serviceRating: "Service Quality", doctorSkill: "Doctor Competence", doctorAttitude: "Doctor Attitude", comment: "Your Review", commentPlaceholder: "Share your experience...", addPhotos: "Add Photos", submit: "Submit Review", success: "Review submitted!", successDesc: "Thank you for your feedback",
    },
    consultation: {
      doctorList: "Online Consultation", doctorDetail: "Doctor Details", searchDoctors: "Search by name or specialty...", textImage: "Text & Image", video: "Video", consultationFees: "Consultation Fees", noReviews: "No reviews yet", credentialsPlaceholder: "Professional credentials will be verified and displayed here.", requestConsultation: "Request Consultation", selectType: "Consultation Type", symptoms: "Symptoms", symptomsPlaceholder: "Describe your dental symptoms...", medicalHistory: "Medical History", medicalHistoryPlaceholder: "Any relevant medical history...", uploadImages: "Upload Images", tapToUpload: "Tap to upload", consultationFee: "Consultation Fee", proceedToConfirm: "Proceed to Confirm", confirmConsultation: "Confirm Consultation", consultationType: "Consultation Type", uploadedImages: "Uploaded Images", textImageDesc: "Text & image consultation (10 messages, 24h window)", videoDesc: "Live video consultation with dentist", consultationCreated: "Your consultation request has been submitted", orderDetail: "Consultation Details", cancellationRules: "Cancellation Rules", cancelPendingRule: "Cancel before doctor accepts: full refund", cancelInProgressRule: "Once accepted: cancellation not available", simulateAccept: "Simulate: Doctor Accept", enterChat: "Enter Chat", joinVideo: "Join Video Call", viewReport: "View Report", diagnosisNotes: "Diagnosis Notes", medicationAdvice: "Medication Advice", overallRating: "Overall Rating", chatStarted: "Consultation started. You can send up to 10 messages.", chatEnded: "Consultation has ended", messagesRemaining: "Messages remaining", typeMessage: "Type a message...", videoConsultation: "Video Consultation", waitingForDoctor: "Waiting for doctor to join...", connected: "Connected", callEnded: "Call ended", duration: "Duration", you: "You",
    },
    orders: { title: "My Orders", all: "All", pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled", empty: "No orders yet", emptyDesc: "Your appointment orders will appear here" },
    reports: { title: "Diagnosis Reports", empty: "No reports yet", emptyDesc: "Your diagnosis reports will appear here after consultations", searchReports: "Search reports...", reportDetail: "Report Details", save: "Save", share: "Share" },
    profile: {
      title: "Personal Center", personalInfo: "Personal Information", languageSettings: "Language Settings", savedInstitutions: "Saved Institutions", coupons: "My Coupons", referralRewards: "Referral Rewards", logout: "Logout", language: "Language", english: "English", chinese: "繁體中文", phone: "Phone Number", email: "Email", orderHistory: "Order History", diagnosisReports: "Diagnosis Reports",
      accountSecurity: "Account Security", myFavorites: "My Favorites", myReviews: "My Reviews", customerService: "Customer Service", settings: "Settings",
      inClinicOrders: "In-Clinic Orders", consultationOrders: "Consultation Orders",
    },
    personalInfo: {
      title: "Personal Information", nickname: "Nickname", mobile: "Mobile Number", email: "Email", avatar: "Avatar", addresses: "My Addresses", addAddress: "Add Address", editAddress: "Edit Address", addressLabel: "Label", addressDetail: "Detailed Address", addressArea: "Area/District", save: "Save", cancel: "Cancel", deleteAddress: "Delete", home: "Home", work: "Work", other: "Other", noAddresses: "No saved addresses", noAddressesDesc: "Add an address for appointment navigation", nicknamePlaceholder: "Enter nickname", addressPlaceholder: "Enter detailed address", areaPlaceholder: "Select area",
      saved: "Saved successfully",
    },
    accountSecurity: {
      title: "Account Security", changePassword: "Change Password", changeMobile: "Change Mobile Number", changeEmail: "Change Email", loginDevices: "Login Devices",
      currentPassword: "Current Password", newPassword: "New Password", confirmPassword: "Confirm New Password", save: "Save Changes",
      currentMobile: "Current Mobile", newMobile: "New Mobile Number", verificationCode: "Verification Code", sendCode: "Send Code",
      currentEmail: "Current Email", newEmail: "New Email",
      deviceName: "Device", lastLogin: "Last Login", currentDevice: "Current Device", removeDevice: "Remove",
      passwordChanged: "Password changed successfully", mobileChanged: "Mobile number changed successfully", emailChanged: "Email changed successfully", deviceRemoved: "Device removed",
    },
    myFavorites: {
      title: "My Favorites", institutions: "Institutions", doctors: "Doctors", emptyInstitutions: "No saved institutions", emptyInstitutionsDesc: "Institutions you save will appear here", emptyDoctors: "No saved doctors", emptyDoctorsDesc: "Doctors you save will appear here", remove: "Remove",
    },
    myReviews: {
      title: "My Reviews", inClinic: "In-Clinic", consultation: "Consultation", empty: "No reviews yet", emptyDesc: "Your reviews will appear here after you write them", edit: "Edit", delete: "Delete", deleteConfirm: "Are you sure you want to delete this review?", deleted: "Review deleted", updated: "Review updated",
    },
    customerService: {
      title: "Customer Service", faq: "Frequently Asked Questions", onlineSupport: "Online Support", complaint: "Complaint & Feedback", searchFaq: "Search questions...",
      complaintTitle: "Complaint & Feedback", complaintDesc: "We value your feedback. Please describe your issue below.", complaintType: "Type", complaintContent: "Description", complaintContentPlaceholder: "Please describe your issue in detail...", complaintImages: "Attach Images", complaintSubmit: "Submit", complaintSuccess: "Your feedback has been submitted!", complaintSuccessDesc: "We will review and respond within 1-3 business days.",
      typeAppointment: "Appointment Issue", typePayment: "Payment Issue", typeConsultation: "Consultation Issue", typeOther: "Other",
    },
    faq: {
      title: "FAQ",
      q1: "How do I book an appointment?", a1: "Go to the Home page, select an institution, choose a service and doctor, pick a time slot, and confirm your booking.",
      q2: "How do I cancel an appointment?", a2: "Go to Orders, find the appointment you want to cancel, tap on it, and select 'Cancel Order'. Refund policies apply based on timing.",
      q3: "How does online consultation work?", a3: "Select 'Online Consultation' from Home, choose a doctor, describe your symptoms, pay the consultation fee, and wait for the doctor to accept.",
      q4: "How do I use a coupon?", a4: "During booking confirmation, tap 'Apply Coupon' to select an available coupon. The discount will be applied to your total.",
      q5: "How do I get a refund?", a5: "Refunds are processed based on the cancellation policy. Full refund if cancelled 24h+ before appointment; partial refund within 24h.",
      q6: "How do I view my diagnosis report?", a6: "After an online consultation is completed, go to Reports to view your diagnosis report.",
      q7: "How do I earn referral rewards?", a7: "Share your referral link with friends. When they register and complete their first order, you'll earn reward coins.",
      q8: "What payment methods are supported?", a8: "We support Credit Card, Alipay, and WeChat Pay.",
    },
    settingsPage: {
      title: "Settings", language: "Language", notifications: "Message Notifications", notificationsDesc: "Receive appointment reminders and updates", privacyPolicy: "Privacy Policy", userAgreement: "User Agreement", logout: "Logout", logoutConfirm: "Are you sure you want to logout?",
    },
    privacyPolicy: { title: "Privacy Policy" },
    userAgreement: { title: "User Agreement" },
    common: { currency: "HKD", search: "Search", cancel: "Cancel", confirm: "Confirm", save: "Save", back: "Back", next: "Next", loading: "Loading...", comingSoon: "Coming Soon" },
    institution: {
      infoTitle: "Institution Information", infoSubtitle: "Manage your institution's public profile",
      basicInfo: "Basic Information", introduction: "Institution Introduction", businessHours: "Business Hours",
      contactPhone: "Contact Phone", transport: "Transportation Guidance", address: "Address",
      mapPlaceholder: "Map Location Calibration",
      photoMgmt: "Photo Management", addSlot: "Add Slot", upload: "Upload", replace: "Replace",
      storefront: "Storefront", reception: "Reception", treatmentRoom: "Treatment Room", equipment: "Equipment", waitingArea: "Waiting Area",
      uploaded: "Active", pending: "Pending", empty: "Empty",
      serviceMgmt: "Service Management", serviceMgmtSubtitle: "Manage your institution's service items",
      addService: "Add Service", editService: "Edit Service", totalServices: "Total Services",
      listed: "Listed", unlisted: "Unlisted",
      serviceName: "Service Name", nameEN: "Name (EN)", nameZH: "Name (ZH)",
      descEN: "Description (EN)", descZH: "Description (ZH)",
      price: "Price (HKD)", duration: "Duration (min)", population: "Population (EN)", populationZH: "Population (ZH)",
      serviceImages: "Service Images", bookingCount: "Bookings",
      deleteWarning: "Cannot delete service with active bookings. Please unlist it instead.",
      activeBookings: "Active bookings exist", noServicesFound: "No services found",
      searchServices: "Search services...", allStatus: "All Status",
    },
  },
  "zh-HK": {
    nav: { home: "首頁", orders: "訂單", reports: "報告", profile: "我的" },
    auth: {
      login: "登入", register: "註冊", forgotPassword: "忘記密碼", email: "電郵", password: "密碼", confirmPassword: "確認密碼", phone: "香港手機號碼", phonePlaceholder: "+852", rememberMe: "記住我", forgotPasswordLink: "忘記密碼？", noAccount: "還沒有帳戶？", hasAccount: "已有帳戶？", signUp: "註冊", signIn: "登入", sendCode: "發送驗證碼", verifyCode: "驗證", resetPassword: "重設密碼", newPassword: "新密碼", verificationTitle: "驗證", verificationDesc: "請輸入發送至以下位置的驗證碼", resendCode: "重新發送", resendIn: "重新發送於", orContinueWith: "或使用以下方式", loginWithEmail: "使用電郵登入", loginWithPhone: "使用手機登入", registerWithEmail: "使用電郵註冊", registerWithPhone: "使用手機註冊", fullName: "全名", agreeToTerms: "我同意服務條款及私隱政策", backToLogin: "返回登入", resetViaEmail: "透過電郵重設", resetViaPhone: "透過手機重設", codeSent: "驗證碼已發送！", passwordRequired: "請輸入密碼", emailRequired: "請輸入電郵", emailInvalid: "電郵格式不正確", phoneRequired: "請輸入手機號碼", phoneInvalid: "請輸入有效的8位香港號碼", nameRequired: "請輸入全名", passwordMin: "密碼最少8個字元", passwordMismatch: "密碼不一致", termsRequired: "請同意服務條款",
    },
    home: {
      greeting: "你好", subtitle: "今天需要甚麼幫助？", inClinic: "到診治療", onlineConsult: "線上諮詢", recommended: "推薦機構", viewAll: "查看全部", popularServices: "熱門服務", fromPrice: "起", coupons: "我的優惠券", couponsAvailable: "張可用優惠券", viewCoupons: "查看優惠券", referral: "推薦獎賞", referralDesc: "邀請朋友，賺取獎賞。分享您的推薦連結，每次成功推薦即可獲得積分！", referralLink: "您的推薦連結", copyLink: "複製", qrCode: "二維碼", coinsBalance: "積分餘額", coins: "積分", viewDetails: "查看詳情", bannerPromo1: "牙齒美白8折優惠", bannerPromo1Sub: "指定診所限時優惠", bannerPromo2: "免費牙齒檢查", bannerPromo2Sub: "合作診所新患者專享", bannerPromo3: "線上諮詢現已開放", bannerPromo3Sub: "足不出戶諮詢牙醫", open: "營業中", closed: "已休息", km: "公里", rating: "評分", recommendedAt: "推薦於",
    },
    institutions: {
      title: "搜尋機構", searchPlaceholder: "搜尋診所、服務...", filters: "篩選", distance: "距離", sortByRating: "評分", priceRange: "價格", category: "類別", nearest: "最近", highestRated: "最高評分", lowestPrice: "最低價格", all: "全部", general: "一般牙科", orthodontics: "矯齒", implants: "植牙", cosmetic: "美容牙科", pediatric: "兒童牙科", noResults: "找不到機構", noResultsDesc: "請嘗試調整搜尋條件或篩選", results: "個結果",
    },
    institutionDetail: {
      about: "關於", photos: "診所照片", hours: "營業時間", phone: "電話", address: "地址", transport: "交通指引", doctors: "駐診醫生", services: "服務項目", reviews: "患者評價", viewAllDoctors: "查看全部醫生", viewAllServices: "查看全部服務", viewAllReviews: "查看全部評價", saveToFavorites: "收藏", saved: "已收藏", getDirections: "導航", bookNow: "立即預約", yearsExp: "年經驗", perVisit: "每次", verified: "已認證", mon: "星期一", tue: "星期二", wed: "星期三", thu: "星期四", fri: "星期五", sat: "星期六", sun: "星期日",
    },
    savedInstitutions: { title: "已收藏機構", empty: "暫無收藏機構", emptyDesc: "您收藏的機構將會顯示在這裡" },
    couponsPage: { title: "我的優惠券", available: "可用", used: "已使用", expired: "已過期", empty: "暫無優惠券", emptyDesc: "您的優惠券將會顯示在這裡", off: "折扣", validUntil: "有效期至", noCouponsApplicable: "沒有適用於此訂單的優惠券" },
    referralPage: { title: "推薦獎賞", subtitle: "邀請朋友，賺取積分！", howItWorks: "如何運作", step1: "分享您的推薦連結", step2: "朋友註冊並預約", step3: "您和朋友都可獲得獎賞積分", yourLink: "您的推薦連結", copied: "已複製！", copy: "複製", qrCode: "二維碼", balance: "積分餘額", coins: "積分", history: "交易紀錄", emptyHistory: "暫無交易紀錄", emptyHistoryDesc: "開始邀請朋友賺取積分", invited: "透過您的連結邀請", conversion: "≈ 港幣價值", conversionNote: "10積分 = HK$1。積分可用於抵扣未來訂單付款。", earned: "獲得", spent: "使用" },
    booking: {
      selectService: "選擇服務", serviceDetails: "服務詳情", duration: "時長", minutes: "分鐘", category: "類別", selectDoctor: "選擇醫生", doctorDetails: "醫生詳情", consultations: "次診症", specialties: "專科", credentials: "資歷", bio: "簡介", availableServices: "可提供服務", continueBooking: "繼續預約", selectTime: "選擇預約時間", morning: "上午", afternoon: "下午", noSlots: "該日期無可用時段", selectedSlot: "已選", unavailable: "不可用", confirmBooking: "確認預約", bookingSummary: "預約摘要", institution: "機構", service: "服務", doctor: "醫生", dateTime: "日期及時間", treatmentDuration: "治療時長", originalPrice: "原價", couponDiscount: "優惠券折扣", finalAmount: "應付金額", applyCoupon: "使用優惠券", selectCoupon: "選擇優惠券", noCoupon: "不使用優惠券", proceedToPayment: "前往付款", payment: "付款", paymentAmount: "付款金額", selectPaymentMethod: "選擇付款方式", creditCard: "信用卡", alipay: "支付寶", wechatPay: "微信支付", payNow: "立即付款", processing: "處理中...", paymentSuccess: "付款成功！", paymentSuccessDesc: "您的預約已成功確認", orderNumber: "訂單編號", viewOrder: "查看訂單", backToHome: "返回首頁",
    },
    orderManagement: {
      title: "我的訂單", all: "全部", pendingAcceptance: "待確認", pendingTreatment: "待治療", completed: "已完成", cancelled: "已取消", empty: "暫無訂單", emptyDesc: "您的預約訂單將會顯示在這裡", orderDetail: "訂單詳情", orderNo: "訂單編號", status: "狀態", createdAt: "下單時間", cancelOrder: "取消訂單", writeReview: "撰寫評價", cancelConfirm: "取消預約", cancelWarning: "您確定要取消此預約嗎？", cancellationPolicy: "取消政策", fullRefund: "全額退款", partialRefund: "部分退款（30%罰款）", noRefund: "不予退款（治療已開始）", moreThan24h: "預約24小時前取消", within24h: "預約24小時內取消", treatmentStarted: "治療已開始", refundAmount: "退款金額", confirmCancel: "確認取消", cancelSuccess: "訂單已成功取消", searchOrders: "搜尋訂單...", inClinic: "到診", onlineConsult: "諮詢",
    },
    review: {
      title: "撰寫評價", envRating: "環境", serviceRating: "服務質素", doctorSkill: "醫生專業能力", doctorAttitude: "醫生態度", comment: "您的評價", commentPlaceholder: "分享您的體驗...", addPhotos: "添加照片", submit: "提交評價", success: "評價已提交！", successDesc: "感謝您的回饋",
    },
    consultation: {
      doctorList: "線上諮詢", doctorDetail: "醫生詳情", searchDoctors: "按名稱或專科搜尋...", textImage: "圖文諮詢", video: "視頻諮詢", consultationFees: "諮詢費用", noReviews: "暫無評價", credentialsPlaceholder: "專業資歷將經驗證後顯示。", requestConsultation: "發起諮詢", selectType: "諮詢類型", symptoms: "症狀描述", symptomsPlaceholder: "描述您的牙齒症狀...", medicalHistory: "病史", medicalHistoryPlaceholder: "相關病史...", uploadImages: "上傳圖片", tapToUpload: "點擊上傳", consultationFee: "諮詢費用", proceedToConfirm: "前往確認", confirmConsultation: "確認諮詢", consultationType: "諮詢類型", uploadedImages: "已上傳圖片", textImageDesc: "圖文諮詢（10條訊息，24小時有效）", videoDesc: "與牙醫即時視頻諮詢", consultationCreated: "您的諮詢請求已提交", orderDetail: "諮詢詳情", cancellationRules: "取消規則", cancelPendingRule: "醫生接受前取消：全額退款", cancelInProgressRule: "已接受後：不可取消", simulateAccept: "模擬：醫生接受", enterChat: "進入對話", joinVideo: "加入視頻通話", viewReport: "查看報告", diagnosisNotes: "診斷意見", medicationAdvice: "用藥建議", overallRating: "整體評分", chatStarted: "諮詢已開始。您可以發送最多10條訊息。", chatEnded: "諮詢已結束", messagesRemaining: "剩餘訊息", typeMessage: "輸入訊息...", videoConsultation: "視頻諮詢", waitingForDoctor: "等待醫生加入...", connected: "已連接", callEnded: "通話已結束", duration: "通話時長", you: "您",
    },
    orders: { title: "我的訂單", all: "全部", pending: "待確認", confirmed: "已確認", completed: "已完成", cancelled: "已取消", empty: "暫無訂單", emptyDesc: "您的預約訂單將會顯示在這裡" },
    reports: { title: "診斷報告", empty: "暫無報告", emptyDesc: "完成線上諮詢後，您的診斷報告將會顯示在這裡", searchReports: "搜尋報告...", reportDetail: "報告詳情", save: "儲存", share: "分享" },
    profile: {
      title: "個人中心", personalInfo: "個人資料", languageSettings: "語言設定", savedInstitutions: "已收藏機構", coupons: "我的優惠券", referralRewards: "推薦獎賞", logout: "登出", language: "語言", english: "English", chinese: "繁體中文", phone: "電話號碼", email: "電郵", orderHistory: "訂單記錄", diagnosisReports: "診斷報告",
      accountSecurity: "帳戶安全", myFavorites: "我的收藏", myReviews: "我的評價", customerService: "客戶服務", settings: "設定",
      inClinicOrders: "到診訂單", consultationOrders: "諮詢訂單",
    },
    personalInfo: {
      title: "個人資料", nickname: "暱稱", mobile: "手機號碼", email: "電郵", avatar: "頭像", addresses: "我的地址", addAddress: "新增地址", editAddress: "編輯地址", addressLabel: "標籤", addressDetail: "詳細地址", addressArea: "地區", save: "儲存", cancel: "取消", deleteAddress: "刪除", home: "住宅", work: "公司", other: "其他", noAddresses: "暫無已儲存地址", noAddressesDesc: "新增地址以便預約導航", nicknamePlaceholder: "輸入暱稱", addressPlaceholder: "輸入詳細地址", areaPlaceholder: "選擇地區",
      saved: "儲存成功",
    },
    accountSecurity: {
      title: "帳戶安全", changePassword: "更改密碼", changeMobile: "更改手機號碼", changeEmail: "更改電郵", loginDevices: "登入裝置",
      currentPassword: "目前密碼", newPassword: "新密碼", confirmPassword: "確認新密碼", save: "儲存更改",
      currentMobile: "目前手機", newMobile: "新手機號碼", verificationCode: "驗證碼", sendCode: "發送驗證碼",
      currentEmail: "目前電郵", newEmail: "新電郵",
      deviceName: "裝置", lastLogin: "最後登入", currentDevice: "目前裝置", removeDevice: "移除",
      passwordChanged: "密碼已成功更改", mobileChanged: "手機號碼已成功更改", emailChanged: "電郵已成功更改", deviceRemoved: "裝置已移除",
    },
    myFavorites: {
      title: "我的收藏", institutions: "機構", doctors: "醫生", emptyInstitutions: "暫無收藏機構", emptyInstitutionsDesc: "您收藏的機構將會顯示在這裡", emptyDoctors: "暫無收藏醫生", emptyDoctorsDesc: "您收藏的醫生將會顯示在這裡", remove: "移除",
    },
    myReviews: {
      title: "我的評價", inClinic: "到診", consultation: "諮詢", empty: "暫無評價", emptyDesc: "您撰寫的評價將會顯示在這裡", edit: "編輯", delete: "刪除", deleteConfirm: "您確定要刪除此評價嗎？", deleted: "評價已刪除", updated: "評價已更新",
    },
    customerService: {
      title: "客戶服務", faq: "常見問題", onlineSupport: "在線客服", complaint: "投訴與反饋", searchFaq: "搜尋問題...",
      complaintTitle: "投訴與反饋", complaintDesc: "我們重視您的意見。請在下方描述您的問題。", complaintType: "類型", complaintContent: "描述", complaintContentPlaceholder: "請詳細描述您的問題...", complaintImages: "附加圖片", complaintSubmit: "提交", complaintSuccess: "您的反饋已提交！", complaintSuccessDesc: "我們將在1-3個工作天內審核並回覆。",
      typeAppointment: "預約問題", typePayment: "付款問題", typeConsultation: "諮詢問題", typeOther: "其他",
    },
    faq: {
      title: "常見問題",
      q1: "如何預約？", a1: "前往首頁，選擇機構，選擇服務和醫生，選擇時段，確認預約即可。",
      q2: "如何取消預約？", a2: "前往訂單頁面，找到要取消的預約，點擊進入後選擇「取消訂單」。退款政策按時間而定。",
      q3: "線上諮詢如何運作？", a3: "從首頁選擇「線上諮詢」，選擇醫生，描述症狀，支付諮詢費用，等待醫生接受。",
      q4: "如何使用優惠券？", a4: "在預約確認時，點擊「使用優惠券」選擇可用的優惠券，折扣將自動應用。",
      q5: "如何退款？", a5: "退款按取消政策處理。預約24小時前取消可全額退款；24小時內取消部分退款。",
      q6: "如何查看診斷報告？", a6: "線上諮詢完成後，前往「報告」頁面查看診斷報告。",
      q7: "如何賺取推薦獎賞？", a7: "與朋友分享您的推薦連結。當朋友註冊並完成首張訂單時，您即可獲得獎勵積分。",
      q8: "支持哪些付款方式？", a8: "我們支持信用卡、支付寶和微信支付。",
    },
    settingsPage: {
      title: "設定", language: "語言", notifications: "消息通知", notificationsDesc: "接收預約提醒和更新", privacyPolicy: "私隱政策", userAgreement: "用戶協議", logout: "登出", logoutConfirm: "您確定要登出嗎？",
    },
    privacyPolicy: { title: "私隱政策" },
    userAgreement: { title: "用戶協議" },
    common: { currency: "HKD", search: "搜尋", cancel: "取消", confirm: "確認", save: "儲存", back: "返回", next: "下一步", loading: "載入中...", comingSoon: "即將推出" },
  },
};

export type Language = keyof typeof translations;

// Recursive type to widen string literals to string
type DeepStringify<T> = T extends string
  ? string
  : T extends object
  ? { [K in keyof T]: DeepStringify<T[K]> }
  : T;

export type TranslationKeys = DeepStringify<(typeof translations)["en"]>;
