import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'

// ── Multi-language label translations ────────────────────────────────────────
const TRANSLATIONS = {
  English: {
    pageTitle: '⚙️ Settings & Preferences',
    pageSubtitle: 'Personalise your TailorConnect experience — notifications, theme, fonts, and more.',
    saveBtn: '💾 Save Settings', savedBtn: '✅ Saved!', resetBtn: '↩ Reset All', resetAllBtn: '↩ Reset to Defaults', saveAllBtn: '💾 Save All Settings', allSavedBtn: '✅ All Saved!',
    secNotif: 'Notifications', secNotifSub: 'Choose exactly what you want to be alerted about.',
    secTheme: 'Theme & Colour', secThemeSub: 'Pick any colour — it applies instantly across the entire portal.',
    secFont: 'Font & Typography', secFontSub: 'Change the font style and size across the entire portal.',
    secDisplay: 'Display & Layout', secDisplaySub: 'Control how content is arranged and presented.',
    secPrivacy: 'Privacy & Security', secPrivacySub: 'Control your visibility and how your data is used.',
    notifEmail: 'Email Notifications', notifEmailD: 'Order confirmations, invoices, and tailor updates via email.',
    notifSMS: 'SMS Alerts', notifSMSD: 'Text messages when stitching starts, is ready, or delivered.',
    notifInApp: 'In-App Notifications', notifInAppD: 'Real-time banners and badge counts inside the portal.',
    notifOrders: 'Order Status Updates', notifOrdersD: 'Every time your order status changes.',
    notifOffers: 'Offers & Deals', notifOffersD: 'Special discounts and seasonal offers from tailors you follow.',
    notifReminders: 'Appointment Reminders', notifRemindersD: 'Reminders 24 hrs before your scheduled tailor visit.',
    notifMarketing: 'Marketing & Tips', notifMarketingD: 'Style tips, tailor spotlights, and new feature announcements.',
    notifSound: 'Notification Sound', notifSoundD: 'Play a sound when a new in-app notification arrives.',
    presetColors: 'Preset Colours', customColor: 'Custom Colour', previewLabel: 'Preview →',
    darkMode: 'Dark Mode', darkModeD: 'Switch the entire portal to a dark background theme.',
    fontFamily: 'Font Family', fontSize: 'Font Size', fontPreview: 'Preview: The quick brown fox stitched a beautiful blouse. ✂️',
    density: 'Display Density', language: 'Language',
    compactSidebar: 'Compact Sidebar', compactSidebarD: 'Show only icons in the sidebar to save screen space.',
    showAvatars: 'Show Profile Avatars', showAvatarsD: 'Display user and tailor avatars in tables and cards.',
    animations: 'Animations & Transitions', animationsD: 'Smooth hover effects, page transitions, and micro-animations.',
    publicProfile: 'Public Profile', publicProfileD: 'Allow tailors to view your style preferences and past orders.',
    onlineStatus: 'Show Online Status', onlineStatusD: 'Let tailors and support see when you\'re active.',
    analytics: 'Share Usage Analytics', analyticsD: 'Help us improve by sharing anonymised usage data.',
    changePw: '🔑 Change Password', currentPw: 'Current Password', newPw: 'New Password', confirmPw: 'Confirm New Password', updatePwBtn: 'Update Password',
    pwSuccess: '✅ Password updated successfully!',
  },
  Tamil: {
    pageTitle: '⚙️ அமைப்புகள் & விருப்பங்கள்',
    pageSubtitle: 'உங்கள் TailorConnect அனுபவத்தை தனிப்பயனாக்குங்கள்.',
    saveBtn: '💾 சேமி', savedBtn: '✅ சேமிக்கப்பட்டது!', resetBtn: '↩ மீட்டமை', resetAllBtn: '↩ இயல்புநிலைக்கு மீட்டமை', saveAllBtn: '💾 அனைத்தையும் சேமி', allSavedBtn: '✅ சேமிக்கப்பட்டது!',
    secNotif: 'அறிவிப்புகள்', secNotifSub: 'நீங்கள் எதை அறிவிக்க வேண்டும் என்று தேர்ந்தெடுங்கள்.',
    secTheme: 'தீம் & நிறம்', secThemeSub: 'ஒரு நிறத்தை தேர்ந்தெடுங்கள் — உடனடியாக பயன்படுத்தப்படும்.',
    secFont: 'எழுத்துரு & தட்டச்சு', secFontSub: 'முழு போர்ட்டலிலும் எழுத்துரு மாற்றுங்கள்.',
    secDisplay: 'காட்சி & தளவமைப்பு', secDisplaySub: 'உள்ளடக்கம் எப்படி காட்டப்படுகிறது என்று கட்டுப்படுத்துங்கள்.',
    secPrivacy: 'தனியுரிமை & பாதுகாப்பு', secPrivacySub: 'உங்கள் தரவு எப்படி பயன்படுத்தப்படுகிறது என்று கட்டுப்படுத்துங்கள்.',
    notifEmail: 'மின்னஞ்சல் அறிவிப்புகள்', notifEmailD: 'ஆர்டர் உறுதிப்படுத்தல்கள் மின்னஞ்சல் மூலம்.',
    notifSMS: 'SMS எச்சரிக்கைகள்', notifSMSD: 'தையல் தயாரானதும் SMS வரும்.',
    notifInApp: 'ஆப் அறிவிப்புகள்', notifInAppD: 'நிகழ்நேர பேனர்கள் மற்றும் பேட்ஜ்கள்.',
    notifOrders: 'ஆர்டர் நிலை புதுப்பிப்புகள்', notifOrdersD: 'ஆர்டர் நிலை மாறும் போதெல்லாம்.',
    notifOffers: 'சலுகைகள் & தள்ளுபடிகள்', notifOffersD: 'சிறப்பு தள்ளுபடிகள் மற்றும் சீசன் ஆஃபர்கள்.',
    notifReminders: 'நியமன நினைவூட்டல்கள்', notifRemindersD: 'தையல்காரர் வருகைக்கு 24 மணி நேரத்திற்கு முன்.',
    notifMarketing: 'மார்க்கெட்டிங் & குறிப்புகள்', notifMarketingD: 'ஸ்டைல் குறிப்புகள் மற்றும் அறிவிப்புகள்.',
    notifSound: 'அறிவிப்பு ஒலி', notifSoundD: 'புதிய அறிவிப்பு வரும்போது ஒலி.',
    presetColors: 'முன்னமைக்கப்பட்ட நிறங்கள்', customColor: 'தனிப்பயன் நிறம்', previewLabel: 'முன்னோட்டம் →',
    darkMode: 'இருட்டு பயன்முறை', darkModeD: 'முழு போர்ட்டலையும் இருண்ட பின்னணியில் மாற்றுங்கள்.',
    fontFamily: 'எழுத்துரு குடும்பம்', fontSize: 'எழுத்துரு அளவு', fontPreview: 'முன்னோட்டம்: தையல்காரர் அழகான கவுன் தைத்தார். ✂️',
    density: 'காட்சி அடர்த்தி', language: 'மொழி',
    compactSidebar: 'சுருக்கமான பக்கப்பட்டி', compactSidebarD: 'பக்கப்பட்டியில் ஐகான்கள் மட்டும் காட்டு.',
    showAvatars: 'புரோஃபைல் அவதார்கள் காட்டு', showAvatarsD: 'அட்டவணைகளில் அவதார்கள் காட்டு.',
    animations: 'அனிமேஷன்கள் & மாற்றங்கள்', animationsD: 'மென்மையான ஹோவர் விளைவுகள்.',
    publicProfile: 'பொது சுயவிவரம்', publicProfileD: 'தையல்காரர்கள் உங்கள் விருப்பங்களை பார்க்கலாம்.',
    onlineStatus: 'ஆன்லைன் நிலை காட்டு', onlineStatusD: 'நீங்கள் செயலில் இருக்கும்போது தையல்காரர்களுக்கு தெரிவிக்கவும்.',
    analytics: 'பயன்பாட்டு பகுப்பாய்வு பகிர்', analyticsD: 'அநாமதேய தரவை பகிர்வதன் மூலம் மேம்படுத்த உதவுங்கள்.',
    changePw: '🔑 கடவுச்சொல் மாற்றவும்', currentPw: 'தற்போதைய கடவுச்சொல்', newPw: 'புதிய கடவுச்சொல்', confirmPw: 'புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்', updatePwBtn: 'கடவுச்சொல் புதுப்பி',
    pwSuccess: '✅ கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
  },
  Hindi: {
    pageTitle: '⚙️ सेटिंग्स और प्राथमिकताएं',
    pageSubtitle: 'अपना TailorConnect अनुभव व्यक्तिगत बनाएं।',
    saveBtn: '💾 सहेजें', savedBtn: '✅ सहेजा गया!', resetBtn: '↩ रीसेट करें', resetAllBtn: '↩ डिफ़ॉल्ट पर रीसेट', saveAllBtn: '💾 सभी सहेजें', allSavedBtn: '✅ सब सहेजा गया!',
    secNotif: 'सूचनाएं', secNotifSub: 'चुनें कि आप क्या अलर्ट चाहते हैं।',
    secTheme: 'थीम और रंग', secThemeSub: 'कोई भी रंग चुनें — तुरंत लागू होगा।',
    secFont: 'फ़ॉन्ट और टाइपोग्राफी', secFontSub: 'पूरे पोर्टल में फ़ॉन्ट बदलें।',
    secDisplay: 'डिस्प्ले और लेआउट', secDisplaySub: 'सामग्री की व्यवस्था नियंत्रित करें।',
    secPrivacy: 'गोपनीयता और सुरक्षा', secPrivacySub: 'अपनी दृश्यता और डेटा नियंत्रित करें।',
    notifEmail: 'ईमेल सूचनाएं', notifEmailD: 'ऑर्डर पुष्टि, चालान, ईमेल द्वारा।',
    notifSMS: 'SMS अलर्ट', notifSMSD: 'सिलाई तैयार होने पर SMS।',
    notifInApp: 'इन-ऐप सूचनाएं', notifInAppD: 'रियल-टाइम बैनर और बैज।',
    notifOrders: 'ऑर्डर स्थिति अपडेट', notifOrdersD: 'हर बार ऑर्डर स्थिति बदलने पर।',
    notifOffers: 'ऑफर और डील', notifOffersD: 'विशेष छूट और मौसमी ऑफर।',
    notifReminders: 'अपॉइंटमेंट रिमाइंडर', notifRemindersD: 'दर्जी विजिट से 24 घंटे पहले।',
    notifMarketing: 'मार्केटिंग और टिप्स', notifMarketingD: 'स्टाइल टिप्स और अपडेट।',
    notifSound: 'सूचना ध्वनि', notifSoundD: 'नई सूचना आने पर ध्वनि।',
    presetColors: 'प्रीसेट रंग', customColor: 'कस्टम रंग', previewLabel: 'प्रीव्यू →',
    darkMode: 'डार्क मोड', darkModeD: 'पूरे पोर्टल को डार्क थीम में बदलें।',
    fontFamily: 'फ़ॉन्ट फैमिली', fontSize: 'फ़ॉन्ट आकार', fontPreview: 'प्रीव्यू: दर्जी ने सुंदर ब्लाउज सिला। ✂️',
    density: 'डिस्प्ले घनत्व', language: 'भाषा',
    compactSidebar: 'कॉम्पैक्ट साइडबार', compactSidebarD: 'साइडबार में केवल आइकन दिखाएं।',
    showAvatars: 'प्रोफ़ाइल अवतार दिखाएं', showAvatarsD: 'टेबल में अवतार दिखाएं।',
    animations: 'एनिमेशन और ट्रांज़िशन', animationsD: 'स्मूद होवर इफेक्ट्स।',
    publicProfile: 'सार्वजनिक प्रोफ़ाइल', publicProfileD: 'दर्जी आपकी प्राथमिकताएं देख सकते हैं।',
    onlineStatus: 'ऑनलाइन स्थिति दिखाएं', onlineStatusD: 'दर्जी देख सकते हैं कि आप सक्रिय हैं।',
    analytics: 'उपयोग विश्लेषण साझा करें', analyticsD: 'अनाम डेटा साझा करके सुधार में मदद करें।',
    changePw: '🔑 पासवर्ड बदलें', currentPw: 'वर्तमान पासवर्ड', newPw: 'नया पासवर्ड', confirmPw: 'नया पासवर्ड पुष्टि करें', updatePwBtn: 'पासवर्ड अपडेट करें',
    pwSuccess: '✅ पासवर्ड सफलतापूर्वक अपडेट किया गया!',
  },
  Telugu: {
    pageTitle: '⚙️ సెట్టింగ్‌లు & ప్రాధాన్యతలు',
    pageSubtitle: 'మీ TailorConnect అనుభవాన్ని వ్యక్తిగతీకరించండి.',
    saveBtn: '💾 సేవ్ చేయి', savedBtn: '✅ సేవ్ చేయబడింది!', resetBtn: '↩ రీసెట్', resetAllBtn: '↩ డిఫాల్ట్‌కు రీసెట్', saveAllBtn: '💾 అన్నీ సేవ్ చేయి', allSavedBtn: '✅ అన్నీ సేవ్!',
    secNotif: 'నోటిఫికేషన్‌లు', secNotifSub: 'మీకు ఏ హెచ్చరికలు కావాలో ఎంచుకోండి.',
    secTheme: 'థీమ్ & రంగు', secThemeSub: 'ఏదైనా రంగు ఎంచుకోండి — వెంటనే వర్తిస్తుంది.',
    secFont: 'ఫాంట్ & టైపోగ్రఫీ', secFontSub: 'మొత్తం పోర్టల్‌లో ఫాంట్ మార్చండి.',
    secDisplay: 'డిస్‌ప్లే & లేఔట్', secDisplaySub: 'కంటెంట్ అమరిక నియంత్రించండి.',
    secPrivacy: 'గోప్యత & భద్రత', secPrivacySub: 'మీ దృశ్యత మరియు డేటా నియంత్రించండి.',
    notifEmail: 'ఇమెయిల్ నోటిఫికేషన్‌లు', notifEmailD: 'ఆర్డర్ నిర్ధారణలు ఇమెయిల్ ద్వారా.',
    notifSMS: 'SMS హెచ్చరికలు', notifSMSD: 'కుట్టు సిద్ధమైనప్పుడు SMS.',
    notifInApp: 'యాప్-లో నోటిఫికేషన్‌లు', notifInAppD: 'రియల్-టైమ్ బ్యానర్లు.',
    notifOrders: 'ఆర్డర్ స్థితి నవీకరణలు', notifOrdersD: 'ప్రతిసారి ఆర్డర్ స్థితి మారినప్పుడు.',
    notifOffers: 'ఆఫర్‌లు & డీల్స్', notifOffersD: 'ప్రత్యేక తగ్గింపులు.',
    notifReminders: 'అపాయింట్‌మెంట్ రిమైండర్‌లు', notifRemindersD: '24 గంటల ముందు రిమైండర్.',
    notifMarketing: 'మార్కెటింగ్ & చిట్కాలు', notifMarketingD: 'స్టైల్ చిట్కాలు.',
    notifSound: 'నోటిఫికేషన్ శబ్దం', notifSoundD: 'కొత్త నోటిఫికేషన్ వచ్చినప్పుడు శబ్దం.',
    presetColors: 'ప్రీసెట్ రంగులు', customColor: 'కస్టమ్ రంగు', previewLabel: 'ప్రివ్యూ →',
    darkMode: 'డార్క్ మోడ్', darkModeD: 'మొత్తం పోర్టల్‌ను డార్క్ థీమ్‌కు మార్చండి.',
    fontFamily: 'ఫాంట్ ఫ్యామిలీ', fontSize: 'ఫాంట్ పరిమాణం', fontPreview: 'ప్రివ్యూ: దర్జీ అందమైన బ్లౌజ్ కుట్టాడు. ✂️',
    density: 'డిస్‌ప్లే సాంద్రత', language: 'భాష',
    compactSidebar: 'కాంపాక్ట్ సైడ్‌బార్', compactSidebarD: 'సైడ్‌బార్‌లో చిహ్నాలు మాత్రమే.',
    showAvatars: 'ప్రొఫైల్ అవతార్‌లు చూపించు', showAvatarsD: 'పట్టికల్లో అవతార్‌లు చూపించు.',
    animations: 'యానిమేషన్‌లు & ట్రాన్సిషన్‌లు', animationsD: 'మృదువైన హోవర్ ప్రభావాలు.',
    publicProfile: 'పబ్లిక్ ప్రొఫైల్', publicProfileD: 'దర్జీలు మీ ప్రాధాన్యతలు చూడవచ్చు.',
    onlineStatus: 'ఆన్‌లైన్ స్థితి చూపించు', onlineStatusD: 'మీరు సక్రియంగా ఉన్నప్పుడు దర్జీలు చూస్తారు.',
    analytics: 'వినియోగ విశ్లేషణ భాగస్వామ్యం', analyticsD: 'అనామక డేటా భాగస్వామ్యం ద్వారా మెరుగుపడటానికి సహాయం.',
    changePw: '🔑 పాస్‌వర్డ్ మార్చండి', currentPw: 'ప్రస్తుత పాస్‌వర్డ్', newPw: 'కొత్త పాస్‌వర్డ్', confirmPw: 'కొత్త పాస్‌వర్డ్ నిర్ధారించండి', updatePwBtn: 'పాస్‌వర్డ్ నవీకరించు',
    pwSuccess: '✅ పాస్‌వర్డ్ విజయవంతంగా నవీకరించబడింది!',
  },
  Kannada: {
    pageTitle: '⚙️ ಸೆಟ್ಟಿಂಗ್‌ಗಳು & ಆದ್ಯತೆಗಳು',
    pageSubtitle: 'ನಿಮ್ಮ TailorConnect ಅನುಭವವನ್ನು ವೈಯಕ್ತಿಕಗೊಳಿಸಿ.',
    saveBtn: '💾 ಉಳಿಸಿ', savedBtn: '✅ ಉಳಿಸಲಾಗಿದೆ!', resetBtn: '↩ ಮರುಹೊಂದಿಸಿ', resetAllBtn: '↩ ಡೀಫಾಲ್ಟ್‌ಗೆ ಮರುಹೊಂದಿಸಿ', saveAllBtn: '💾 ಎಲ್ಲವನ್ನು ಉಳಿಸಿ', allSavedBtn: '✅ ಎಲ್ಲ ಉಳಿಸಲಾಗಿದೆ!',
    secNotif: 'ಅಧಿಸೂಚನೆಗಳು', secNotifSub: 'ನೀವು ಏನು ಎಚ್ಚರಿಸಬೇಕೆಂದು ಆಯ್ಕೆ ಮಾಡಿ.',
    secTheme: 'ಥೀಮ್ & ಬಣ್ಣ', secThemeSub: 'ಯಾವುದೇ ಬಣ್ಣ ಆಯ್ಕೆಮಾಡಿ — ತಕ್ಷಣ ಅನ್ವಯಿಸುತ್ತದೆ.',
    secFont: 'ಫಾಂಟ್ & ಟೈಪೋಗ್ರಫಿ', secFontSub: 'ಇಡೀ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಫಾಂಟ್ ಬದಲಾಯಿಸಿ.',
    secDisplay: 'ಡಿಸ್‌ಪ್ಲೇ & ಲೇಔಟ್', secDisplaySub: 'ವಿಷಯದ ವ್ಯವಸ್ಥೆ ನಿಯಂತ್ರಿಸಿ.',
    secPrivacy: 'ಗೌಪ್ಯತೆ & ಭದ್ರತೆ', secPrivacySub: 'ನಿಮ್ಮ ಡೇಟಾ ಹೇಗೆ ಬಳಸಲಾಗುತ್ತದೆ ಎಂದು ನಿಯಂತ್ರಿಸಿ.',
    notifEmail: 'ಇಮೇಲ್ ಅಧಿಸೂಚನೆಗಳು', notifEmailD: 'ಆರ್ಡರ್ ದೃಢೀಕರಣಗಳು ಇಮೇಲ್ ಮೂಲಕ.',
    notifSMS: 'SMS ಎಚ್ಚರಿಕೆಗಳು', notifSMSD: 'ಹೊಲಿಗೆ ಸಿದ್ಧವಾದಾಗ SMS.',
    notifInApp: 'ಆಪ್-ಒಳಗಿನ ಅಧಿಸೂಚನೆಗಳು', notifInAppD: 'ರಿಯಲ್-ಟೈಮ್ ಬ್ಯಾನರ್‌ಗಳು.',
    notifOrders: 'ಆರ್ಡರ್ ಸ್ಥಿತಿ ನವೀಕರಣಗಳು', notifOrdersD: 'ಪ್ರತಿ ಬಾರಿ ಆರ್ಡರ್ ಸ್ಥಿತಿ ಬದಲಾದಾಗ.',
    notifOffers: 'ಆಫರ್‌ಗಳು & ಡೀಲ್‌ಗಳು', notifOffersD: 'ವಿಶೇಷ ರಿಯಾಯಿತಿಗಳು.',
    notifReminders: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ರಿಮೈಂಡರ್‌ಗಳು', notifRemindersD: '24 ಗಂಟೆ ಮೊದಲು ರಿಮೈಂಡರ್.',
    notifMarketing: 'ಮಾರ್ಕೆಟಿಂಗ್ & ಟಿಪ್ಸ್', notifMarketingD: 'ಸ್ಟೈಲ್ ಟಿಪ್ಸ್.',
    notifSound: 'ಅಧಿಸೂಚನೆ ಶಬ್ದ', notifSoundD: 'ಹೊಸ ಅಧಿಸೂಚನೆ ಬಂದಾಗ ಶಬ್ದ.',
    presetColors: 'ಪ್ರೀಸೆಟ್ ಬಣ್ಣಗಳು', customColor: 'ಕಸ್ಟಮ್ ಬಣ್ಣ', previewLabel: 'ಪ್ರಿವ್ಯೂ →',
    darkMode: 'ಡಾರ್ಕ್ ಮೋಡ್', darkModeD: 'ಇಡೀ ಪೋರ್ಟಲ್ ಅನ್ನು ಡಾರ್ಕ್ ಥೀಮ್‌ಗೆ ಬದಲಾಯಿಸಿ.',
    fontFamily: 'ಫಾಂಟ್ ಕುಟುಂಬ', fontSize: 'ಫಾಂಟ್ ಗಾತ್ರ', fontPreview: 'ಪ್ರಿವ್ಯೂ: ದರ್ಜಿ ಸುಂದರ ಬ್ಲೌಸ್ ಹೊಲಿದ. ✂️',
    density: 'ಡಿಸ್‌ಪ್ಲೇ ಸಾಂದ್ರತೆ', language: 'ಭಾಷೆ',
    compactSidebar: 'ಕಾಂಪ್ಯಾಕ್ಟ್ ಸೈಡ್‌ಬಾರ್', compactSidebarD: 'ಸೈಡ್‌ಬಾರ್‌ನಲ್ಲಿ ಐಕಾನ್‌ಗಳು ಮಾತ್ರ.',
    showAvatars: 'ಪ್ರೊಫೈಲ್ ಅವತಾರ್‌ಗಳು ತೋರಿಸಿ', showAvatarsD: 'ಟೇಬಲ್‌ಗಳಲ್ಲಿ ಅವತಾರ್‌ಗಳು ತೋರಿಸಿ.',
    animations: 'ಅನಿಮೇಷನ್‌ಗಳು & ಟ್ರಾನ್ಸಿಷನ್‌ಗಳು', animationsD: 'ಮೃದು ಹೋವರ್ ಪರಿಣಾಮಗಳು.',
    publicProfile: 'ಸಾರ್ವಜನಿಕ ಪ್ರೊಫೈಲ್', publicProfileD: 'ದರ್ಜಿಗಳು ನಿಮ್ಮ ಆದ್ಯತೆಗಳನ್ನು ನೋಡಬಹುದು.',
    onlineStatus: 'ಆನ್‌ಲೈನ್ ಸ್ಥಿತಿ ತೋರಿಸಿ', onlineStatusD: 'ದರ್ಜಿಗಳು ನೀವು ಸಕ್ರಿಯವಾಗಿರುವಾಗ ನೋಡುತ್ತಾರೆ.',
    analytics: 'ಬಳಕೆ ವಿಶ್ಲೇಷಣೆ ಹಂಚಿಕೊಳ್ಳಿ', analyticsD: 'ಅನಾಮಧೇಯ ಡೇಟಾ ಹಂಚಿಕೊಳ್ಳುವ ಮೂಲಕ ಸುಧಾರಿಸಲು ಸಹಾಯ ಮಾಡಿ.',
    changePw: '🔑 ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ', currentPw: 'ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್', newPw: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್', confirmPw: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ', updatePwBtn: 'ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಿ',
    pwSuccess: '✅ ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!',
  },
  Malayalam: {
    pageTitle: '⚙️ ക്രമീകരണങ്ങൾ & മുൻഗണനകൾ',
    pageSubtitle: 'നിങ്ങളുടെ TailorConnect അനുഭവം വ്യക്തിഗതമാക്കുക.',
    saveBtn: '💾 സേവ് ചെയ്യുക', savedBtn: '✅ സേവ് ചെയ്തു!', resetBtn: '↩ റീസെറ്റ്', resetAllBtn: '↩ ഡിഫോൾട്ടിലേക്ക് റീസെറ്റ്', saveAllBtn: '💾 എല്ലാം സേവ് ചെയ്യുക', allSavedBtn: '✅ എല്ലാം സേവ് ചെയ്തു!',
    secNotif: 'അറിയിപ്പുകൾ', secNotifSub: 'നിങ്ങൾക്ക് എന്ത് അലേർട്ടുകൾ വേണമെന്ന് തിരഞ്ഞെടുക്കുക.',
    secTheme: 'തീം & നിറം', secThemeSub: 'ഏത് നിറവും തിരഞ്ഞെടുക്കുക — ഉടനടി ബാധകമാകും.',
    secFont: 'ഫോണ്ട് & ടൈപ്പോഗ്രഫി', secFontSub: 'മുഴുവൻ പോർട്ടലിലും ഫോണ്ട് മാറ്റുക.',
    secDisplay: 'ഡിസ്‌പ്ലേ & ലേഔട്ട്', secDisplaySub: 'ഉള്ളടക്കം ക്രമീകരിക്കുക.',
    secPrivacy: 'സ്വകാര്യത & സുരക്ഷ', secPrivacySub: 'നിങ്ങളുടെ ദൃശ്യത & ഡാറ്റ നിയന്ത്രിക്കുക.',
    notifEmail: 'ഇമെയിൽ അറിയിപ്പുകൾ', notifEmailD: 'ഓർഡർ സ്ഥിരീകരണങ്ങൾ ഇമെയിൽ വഴി.',
    notifSMS: 'SMS അലേർട്ടുകൾ', notifSMSD: 'തയ്യൽ തയ്യാറായാൽ SMS.',
    notifInApp: 'ആപ്പ് അറിയിപ്പുകൾ', notifInAppD: 'തത്സമയ ബാനറുകൾ.',
    notifOrders: 'ഓർഡർ സ്റ്റാറ്റസ് അപ്ഡേറ്റുകൾ', notifOrdersD: 'ഓർഡർ നില മാറുമ്പോഴെല്ലാം.',
    notifOffers: 'ഓഫറുകൾ & ഡീലുകൾ', notifOffersD: 'പ്രത്യേക കിഴിവുകൾ.',
    notifReminders: 'അപ്പോയിന്റ്മെന്റ് ഓർമ്മപ്പെടുത്തലുകൾ', notifRemindersD: '24 മണിക്കൂർ മുൻപ്.',
    notifMarketing: 'മാർക്കറ്റിംഗ് & ടിപ്‌സ്', notifMarketingD: 'സ്റ്റൈൽ ടിപ്‌സ്.',
    notifSound: 'അറിയിപ്പ് ശബ്ദം', notifSoundD: 'പുതിയ അറിയിപ്പ് വരുമ്പോൾ ശബ്ദം.',
    presetColors: 'പ്രീസെറ്റ് നിറങ്ങൾ', customColor: 'കസ്റ്റം നിറം', previewLabel: 'പ്രിവ്യൂ →',
    darkMode: 'ഡാർക്ക് മോഡ്', darkModeD: 'മുഴുവൻ പോർട്ടലും ഡാർക്ക് ആക്കുക.',
    fontFamily: 'ഫോണ്ട് ഫാമിലി', fontSize: 'ഫോണ്ട് വലുപ്പം', fontPreview: 'പ്രിവ്യൂ: തയ്യൽക്കാരൻ മനോഹരമായ ബ്ലൗസ് തുന്നി. ✂️',
    density: 'ഡിസ്‌പ്ലേ സാന്ദ്രത', language: 'ഭാഷ',
    compactSidebar: 'കോംപാക്ട് സൈഡ്‌ബാർ', compactSidebarD: 'സൈഡ്‌ബാറിൽ ഐക്കണുകൾ മാത്രം.',
    showAvatars: 'പ്രൊഫൈൽ അവതാറുകൾ കാണിക്കുക', showAvatarsD: 'ടേബിളുകളിൽ അവതാറുകൾ.',
    animations: 'ആനിമേഷനുകൾ & ട്രാൻസിഷനുകൾ', animationsD: 'സ്മൂത്ത് ഹോവർ ഇഫക്‌ടുകൾ.',
    publicProfile: 'പൊതു പ്രൊഫൈൽ', publicProfileD: 'തയ്യൽക്കാർക്ക് നിങ്ങളുടെ മുൻഗണനകൾ കാണാം.',
    onlineStatus: 'ഓൺലൈൻ സ്റ്റാറ്റസ് കാണിക്കുക', onlineStatusD: 'നിങ്ങൾ സജീവമാകുമ്പോൾ തയ്യൽക്കാർ കാണും.',
    analytics: 'ഉപയോഗ വിശകലനം പങ്കിടുക', analyticsD: 'അജ്ഞാത ഡാറ്റ പങ്കിട്ട് മെച്ചപ്പെടുത്താൻ സഹായിക്കുക.',
    changePw: '🔑 പാസ്‌വേഡ് മാറ്റുക', currentPw: 'നിലവിലെ പാസ്‌വേഡ്', newPw: 'പുതിയ പാസ്‌വേഡ്', confirmPw: 'പുതിയ പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക', updatePwBtn: 'പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്യുക',
    pwSuccess: '✅ പാസ്‌വേഡ് വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!',
  },
}

// ── Preset theme colours ─────────────────────────────────────────────────────
const PRESET_COLORS = [
  { name: 'Teal',       value: '#0F5C5E' },
  { name: 'Emerald',    value: '#059669' },
  { name: 'Forest',     value: '#15803D' },
  { name: 'Violet',     value: '#7C3AED' },
  { name: 'Purple',     value: '#9333EA' },
  { name: 'Rose',       value: '#E11D48' },
  { name: 'Orange',     value: '#EA580C' },
  { name: 'Amber',      value: '#D97706' },
  { name: 'Gold',       value: '#C9A66B' },
  { name: 'Sky',        value: '#0284C7' },
  { name: 'Indigo',     value: '#4338CA' },
  { name: 'Pink',       value: '#DB2777' },
  { name: 'Cyan',       value: '#0891B2' },
  { name: 'Lime',       value: '#65A30D' },
  { name: 'Red',        value: '#DC2626' },
  { name: 'Slate',      value: '#475569' },
  { name: 'Maroon',     value: '#7F1D1D' },
  { name: 'Navy',       value: '#1E3A5F' },
  { name: 'Magenta',    value: '#C026D3' },
  { name: 'Brown',      value: '#92400E' },
]

const FONT_FAMILIES = [
  { name: 'Outfit (Default)', value: "'Outfit', sans-serif" },
  { name: 'Inter',            value: "'Inter', sans-serif" },
  { name: 'Poppins',          value: "'Poppins', sans-serif" },
  { name: 'Nunito',           value: "'Nunito', sans-serif" },
  { name: 'Lato',             value: "'Lato', sans-serif" },
  { name: 'Roboto',           value: "'Roboto', sans-serif" },
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
  { name: 'Merriweather',     value: "'Merriweather', serif" },
  { name: 'Source Sans 3',    value: "'Source Sans 3', sans-serif" },
  { name: 'DM Sans',          value: "'DM Sans', sans-serif" },
]

const FONT_SIZES = [
  { name: 'Small (13px)',   value: '13px' },
  { name: 'Normal (14px)',  value: '14px' },
  { name: 'Medium (15px)',  value: '15px' },
  { name: 'Large (16px)',   value: '16px' },
  { name: 'X-Large (18px)',value: '18px' },
]

const LANGUAGES = ['English', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam']
const DENSITIES = [
  { name: 'Compact',     value: 'compact' },
  { name: 'Normal',      value: 'normal' },
  { name: 'Comfortable', value: 'comfortable' },
]

function ToggleSwitch({ checked, onChange, id }) {
  return (
    <label htmlFor={id} style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer', flexShrink: 0 }}>
      <input id={id} type="checkbox" checked={checked} onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
      <span style={{
        position: 'absolute', inset: 0, borderRadius: 999, transition: 'background 0.25s',
        background: checked ? '#0F5C5E' : '#D1D5DB',
      }} />
      <span style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18,
        borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.25s',
      }} />
    </label>
  )
}

function Section({ icon, title, subtitle, children }) {
  return (
    <div className="card" style={{ padding: 24, marginBottom: 20 }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0F5C5E', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{icon}</span>{title}
        </h3>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9CA3AF' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
      <div style={{ flex: 1, paddingRight: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>{label}</div>
        {desc && <div style={{ fontSize: 12.5, color: '#9CA3AF', marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

const STORAGE_KEY = 'tc_customer_settings'

const defaultSettings = {
  // Notifications
  notifEmail:    true,
  notifSMS:      true,
  notifInApp:    true,
  notifOrders:   true,
  notifOffers:   false,
  notifReminders:true,
  notifMarketing:false,
  notifSound:    true,
  // Theme
  themeColor:    '#0F5C5E',
  customColor:   '',
  darkMode:      false,
  // Typography
  fontFamily:    "'Outfit', sans-serif",
  fontSize:      '14px',
  // Display
  density:       'normal',
  language:      'English',
  compactSidebar:false,
  showAvatars:   true,
  animationsOn:  true,
  // Privacy
  publicProfile: true,
  showOnlineStatus: true,
  dataAnalytics: true,
}

export default function CustomerSettings() {
  const [s, setS] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
    } catch { return defaultSettings }
  })
  const [saved, setSaved] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwErr, setPwErr] = useState('')
  const [pwOk, setPwOk] = useState(false)

  // Derive translation labels from selected language
  const T = TRANSLATIONS[s.language] || TRANSLATIONS.English

  // Persist language change globally
  useEffect(() => {
    localStorage.setItem('tc_app_language', s.language)
    window.dispatchEvent(new CustomEvent('tc_language_changed', { detail: { language: s.language } }))
  }, [s.language])

  // Apply theme color + font across entire app live
  useEffect(() => {
    const color = s.customColor || s.themeColor
    const root = document.documentElement

    // Derive lighter/darker shades by adjusting the hex
    const darken = (hex, pct) => {
      const n = parseInt(hex.slice(1), 16)
      const r = Math.max(0, Math.min(255, (n >> 16) - Math.round(2.55 * pct)))
      const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) - Math.round(2.55 * pct)))
      const b = Math.max(0, Math.min(255, (n & 0xff) - Math.round(2.55 * pct)))
      return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
    }
    const hex2rgba = (hex, a) => {
      const n = parseInt(hex.slice(1), 16)
      return `rgba(${n >> 16},${(n >> 8) & 0xff},${n & 0xff},${a})`
    }

    root.style.setProperty('--primary',              color)
    root.style.setProperty('--primary-hover',        darken(color, 8))
    root.style.setProperty('--primary-light',        darken(color, -8))
    root.style.setProperty('--primary-dark',         darken(color, 12))
    root.style.setProperty('--primary-subtle',       hex2rgba(color, 0.12))
    root.style.setProperty('--bg-sidebar',           color)
    root.style.setProperty('--bg-sidebar-hover',     darken(color, -8))
    root.style.setProperty('--bg-sidebar-active',    darken(color, 12))
    root.style.setProperty('--border-focus',         color)
    root.style.setProperty('--text-navy',            color)

    // Font family — inject Google Fonts link dynamically
    const fontName = s.fontFamily.replace(/'/g, '').split(',')[0].trim()
    const linkId = 'tc-dynamic-font'
    let link = document.getElementById(linkId)
    if (!link) {
      link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700;800&display=swap`

    // Apply font + size to entire app
    root.style.setProperty('--font-body', s.fontFamily)
    document.body.style.fontFamily = s.fontFamily
    document.body.style.fontSize   = s.fontSize

    // Dark mode
    if (s.darkMode) {
      root.style.setProperty('--bg-page',    '#111827')
      root.style.setProperty('--bg-card',    '#1F2937')
      root.style.setProperty('--bg-surface', '#1F2937')
      root.style.setProperty('--text-primary','#F9FAFB')
      root.style.setProperty('--text-main',  '#F9FAFB')
      root.style.setProperty('--border',     '#374151')
    } else {
      root.style.setProperty('--bg-page',    '#FCFBF7')
      root.style.setProperty('--bg-card',    '#FFFFFF')
      root.style.setProperty('--bg-surface', '#FFFFFF')
      root.style.setProperty('--text-primary','#263238')
      root.style.setProperty('--text-main',  '#263238')
      root.style.setProperty('--border',     '#E3E8E6')
    }
  }, [s.themeColor, s.customColor, s.fontFamily, s.fontSize, s.darkMode])


  const update = (key, val) => setS(prev => ({ ...prev, [key]: val }))

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => {
    setS(defaultSettings)
    localStorage.removeItem(STORAGE_KEY)
    document.documentElement.style.setProperty('--primary', defaultSettings.themeColor)
    document.body.style.fontFamily = defaultSettings.fontFamily
    document.body.style.fontSize = defaultSettings.fontSize
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    setPwErr('')
    if (pwForm.next.length < 8) { setPwErr('Password must be at least 8 characters.'); return }
    if (pwForm.next !== pwForm.confirm) { setPwErr('Passwords do not match.'); return }
    setPwOk(true)
    setPwForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setPwOk(false), 3000)
  }

  const activeColor = s.customColor || s.themeColor

  return (
    <DashboardLayout role="customer">
      <div className="page-header">
        <div>
          <h1>{T.pageTitle}</h1>
          <p>{T.pageSubtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleReset} style={{ padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', color: '#6B7280' }}>
            {T.resetBtn}
          </button>
          <button onClick={handleSave} style={{ padding: '9px 22px', borderRadius: 8, fontSize: 13.5, fontWeight: 700, border: 'none', background: activeColor, color: '#fff', cursor: 'pointer', transition: 'opacity 0.2s' }}>
            {saved ? T.savedBtn : T.saveBtn}
          </button>
        </div>
      </div>

      <Section icon="🔔" title={T.secNotif} subtitle={T.secNotifSub}>
        <SettingRow label={T.notifEmail} desc={T.notifEmailD}>
          <ToggleSwitch id="notifEmail" checked={s.notifEmail} onChange={e => update('notifEmail', e.target.checked)} />
        </SettingRow>
        <SettingRow label={T.notifSMS} desc={T.notifSMSD}>
          <ToggleSwitch id="notifSMS" checked={s.notifSMS} onChange={e => update('notifSMS', e.target.checked)} />
        </SettingRow>
        <SettingRow label={T.notifInApp} desc={T.notifInAppD}>
          <ToggleSwitch id="notifInApp" checked={s.notifInApp} onChange={e => update('notifInApp', e.target.checked)} />
        </SettingRow>
        <SettingRow label={T.notifOrders} desc={T.notifOrdersD}>
          <ToggleSwitch id="notifOrders" checked={s.notifOrders} onChange={e => update('notifOrders', e.target.checked)} />
        </SettingRow>
        <SettingRow label={T.notifOffers} desc={T.notifOffersD}>
          <ToggleSwitch id="notifOffers" checked={s.notifOffers} onChange={e => update('notifOffers', e.target.checked)} />
        </SettingRow>
        <SettingRow label={T.notifReminders} desc={T.notifRemindersD}>
          <ToggleSwitch id="notifReminders" checked={s.notifReminders} onChange={e => update('notifReminders', e.target.checked)} />
        </SettingRow>
        <SettingRow label={T.notifMarketing} desc={T.notifMarketingD}>
          <ToggleSwitch id="notifMarketing" checked={s.notifMarketing} onChange={e => update('notifMarketing', e.target.checked)} />
        </SettingRow>
        <SettingRow label={T.notifSound} desc={T.notifSoundD}>
          <ToggleSwitch id="notifSound" checked={s.notifSound} onChange={e => update('notifSound', e.target.checked)} />
        </SettingRow>
      </Section>

      {/* ── THEME & COLOUR ── */}
      <Section icon="🎨" title={T.secTheme} subtitle={T.secThemeSub}>
        <div style={{ height: 6, borderRadius: 999, background: activeColor, marginBottom: 20, transition: 'background 0.3s' }} />

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>{T.presetColors}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PRESET_COLORS.map(c => (
              <button
                key={c.value}
                title={c.name}
                onClick={() => { update('themeColor', c.value); update('customColor', '') }}
                style={{
                  width: 36, height: 36, borderRadius: '50%', background: c.value, border: 'none',
                  cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
                  outline: s.themeColor === c.value && !s.customColor ? `3px solid ${c.value}` : 'none',
                  outlineOffset: 3,
                  boxShadow: s.themeColor === c.value && !s.customColor ? `0 0 0 2px #fff, 0 0 0 4px ${c.value}` : '0 2px 4px rgba(0,0,0,0.18)',
                  transform: s.themeColor === c.value && !s.customColor ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{T.customColor}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="color" value={s.customColor || s.themeColor} onChange={e => update('customColor', e.target.value)}
                style={{ width: 48, height: 36, borderRadius: 8, border: '1.5px solid #E5E7EB', cursor: 'pointer', padding: 2 }} />
              <input type="text" value={s.customColor || s.themeColor}
                onChange={e => { const v = e.target.value; if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) update('customColor', v) }}
                placeholder="#000000"
                style={{ width: 100, padding: '7px 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{T.previewLabel}</span>
              <span style={{ display: 'inline-block', width: 80, height: 32, borderRadius: 8, background: activeColor, transition: 'background 0.2s' }} />
            </div>
          </div>
        </div>

        <SettingRow label={T.darkMode} desc={T.darkModeD}>
          <ToggleSwitch id="darkMode" checked={s.darkMode} onChange={e => update('darkMode', e.target.checked)} />
        </SettingRow>
      </Section>

      <Section icon="🖋️" title={T.secFont} subtitle={T.secFontSub}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>{T.fontFamily}</label>
            <select className="form-control" value={s.fontFamily} onChange={e => update('fontFamily', e.target.value)} style={{ fontFamily: s.fontFamily }}>
              {FONT_FAMILIES.map(f => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.name}</option>
              ))}
            </select>
            <div style={{ marginTop: 10, padding: '12px 16px', borderRadius: 10, background: '#F9FAFB', border: '1px solid #E5E7EB', fontFamily: s.fontFamily, fontSize: s.fontSize }}>
              <strong>{T.fontPreview.split(':')[0]}:</strong> {T.fontPreview.split(':').slice(1).join(':').trim()}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{T.fontSize}</label>
              {/* Quick A- / A / A+ resize buttons */}
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  { label: 'A−', size: '13px' },
                  { label: 'A', size: '14px' },
                  { label: 'A+', size: '16px' },
                ].map(btn => (
                  <button key={btn.size} onClick={() => update('fontSize', btn.size)}
                    style={{ width: 32, height: 28, borderRadius: 6, border: `1.5px solid ${s.fontSize === btn.size ? activeColor : '#E5E7EB'}`, background: s.fontSize === btn.size ? activeColor : '#fff', color: s.fontSize === btn.size ? '#fff' : '#6B7280', fontSize: btn.label === 'A−' ? 11 : btn.label === 'A+' ? 15 : 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.18s' }}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FONT_SIZES.map(f => (
                <label key={f.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${s.fontSize === f.value ? activeColor : '#E5E7EB'}`, background: s.fontSize === f.value ? `${activeColor}11` : '#fff', transition: 'all 0.18s' }}>
                  <input type="radio" name="fontSize" value={f.value} checked={s.fontSize === f.value} onChange={() => update('fontSize', f.value)} style={{ accentColor: activeColor }} />
                  <span style={{ fontSize: f.value, fontFamily: s.fontFamily, fontWeight: 500 }}>{f.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section icon="🖥️" title={T.secDisplay} subtitle={T.secDisplaySub}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>{T.density}</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {DENSITIES.map(d => (
              <button key={d.value} onClick={() => update('density', d.value)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1.5px solid ${s.density === d.value ? activeColor : '#E5E7EB'}`, background: s.density === d.value ? `${activeColor}11` : '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: s.density === d.value ? activeColor : '#6B7280', transition: 'all 0.18s' }}>
                {d.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>{T.language}</label>
          <select className="form-control" value={s.language} onChange={e => update('language', e.target.value)} style={{ maxWidth: 220 }}>
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <SettingRow label={T.compactSidebar} desc={T.compactSidebarD}>
          <ToggleSwitch id="compactSidebar" checked={s.compactSidebar} onChange={e => update('compactSidebar', e.target.checked)} />
        </SettingRow>
        <SettingRow label={T.showAvatars} desc={T.showAvatarsD}>
          <ToggleSwitch id="showAvatars" checked={s.showAvatars} onChange={e => update('showAvatars', e.target.checked)} />
        </SettingRow>
        <SettingRow label={T.animations} desc={T.animationsD}>
          <ToggleSwitch id="animationsOn" checked={s.animationsOn} onChange={e => update('animationsOn', e.target.checked)} />
        </SettingRow>
      </Section>

      <Section icon="🔒" title={T.secPrivacy} subtitle={T.secPrivacySub}>
        <SettingRow label={T.publicProfile} desc={T.publicProfileD}>
          <ToggleSwitch id="publicProfile" checked={s.publicProfile} onChange={e => update('publicProfile', e.target.checked)} />
        </SettingRow>
        <SettingRow label={T.onlineStatus} desc={T.onlineStatusD}>
          <ToggleSwitch id="showOnlineStatus" checked={s.showOnlineStatus} onChange={e => update('showOnlineStatus', e.target.checked)} />
        </SettingRow>
        <SettingRow label={T.analytics} desc={T.analyticsD}>
          <ToggleSwitch id="dataAnalytics" checked={s.dataAnalytics} onChange={e => update('dataAnalytics', e.target.checked)} />
        </SettingRow>

        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', marginBottom: 14 }}>{T.changePw}</div>
          {pwErr && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13 }}>⚠️ {pwErr}</div>}
          {pwOk  && <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{T.pwSuccess}</div>}
          <form onSubmit={handlePasswordChange}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
              {[
                { label: T.currentPw, key: 'current' },
                { label: T.newPw, key: 'next' },
                { label: T.confirmPw, key: 'confirm' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input className="form-control" type="password" placeholder="••••••••" value={pwForm[f.key]} onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })} required />
                </div>
              ))}
            </div>
            <button type="submit" style={{ padding: '9px 22px', borderRadius: 8, fontSize: 13.5, fontWeight: 700, border: 'none', background: activeColor, color: '#fff', cursor: 'pointer' }}>
              {T.updatePwBtn}
            </button>
          </form>
        </div>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 0', borderTop: '1px solid #E5E7EB' }}>
        <button onClick={handleReset} style={{ padding: '10px 22px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', color: '#6B7280' }}>
          {T.resetAllBtn}
        </button>
        <button onClick={handleSave} style={{ padding: '10px 26px', borderRadius: 8, fontSize: 14, fontWeight: 700, border: 'none', background: activeColor, color: '#fff', cursor: 'pointer', boxShadow: `0 4px 12px ${activeColor}55` }}>
          {saved ? T.allSavedBtn : T.saveAllBtn}
        </button>
      </div>

    </DashboardLayout>
  )
}

