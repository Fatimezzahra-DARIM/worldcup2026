// ============================================================
// WorldCup2026.ma - app.js
// World Cup 2026 Match Schedule - Morocco Time GMT+1
// API: TheSportsDB Free API v1
// ============================================================

(function () {
    'use strict';

    // ----------------------------------------------------------
    // TEAM IDS - All 32 World Cup 2026 Teams + Arab Teams
    // ----------------------------------------------------------
    const TEAMS = {
        // === World Cup 2026 Qualified / Expected Teams ===
        // Host nations
        "United States": 134397,
        "Mexico": 134514,
        "Canada": 140073,
        // Africa (CAF)
        "Morocco": 136139,
        "Senegal": 134567,
        "Nigeria": 134926,
        "Egypt": 134517,
        "Cameroon": 134529,
        "Tunisia": 134561,
        "Algeria": 134516,
        "South Africa": 134560,
        // Europe (UEFA)
        "France": 133816,
        "Germany": 134506,
        "Spain": 133567,
        "England": 134505,
        "Portugal": 133619,
        "Netherlands": 134513,
        "Belgium": 134515,
        "Croatia": 134519,
        "Serbia": 134504,
        "Poland": 134512,
        "Italy": 133766,
        "Denmark": 134518,
        "Switzerland": 134520,
        "Austria": 135986,
        // South America (CONMEBOL)
        "Argentina": 134509,
        "Brazil": 134496,
        "Colombia": 134507,
        "Uruguay": 134521,
        "Ecuador": 134508,
        // Asia (AFC)
        "Japan": 134422,
        "South Korea": 134498,
        "Saudi Arabia": 134566,
        "Iran": 134572,
        "Australia": 134500,
        "Qatar": 140082,
        // CONCACAF
        "Costa Rica": 134524,
        "Panama": 135081,
        // === Additional Arab Teams ===
        "Iraq": 134569,
        "UAE": 140083,
        "Jordan": 141072,
        "Palestine": 140085,
        "Libya": 135111,
        "Sudan": 135113,
        "Oman": 140084,
        "Bahrain": 140081,
        "Kuwait": 135114,
        "Syria": 134570,
        "Yemen": 140086,
        "Lebanon": 135108,
        "Mauritania": 140930
    };

    // Default team
    const DEFAULT_TEAM = "Morocco";
    const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";

    // Morocco timezone (GMT+1 permanent since 2018)
    const MOROCCO_TZ = "Africa/Casablanca";

    // ----------------------------------------------------------
    // LANGUAGE SYSTEM
    // ----------------------------------------------------------
    let currentLang = localStorage.getItem('wc2026_lang') || 'ar';

    const translations = {
        ar: {
            heroTitle: "جدول مباريات كأس العالم 2026 - توقيت المغرب GMT+1",
            heroDesc: "تابع مواعيد جميع المباريات بتوقيت الدار البيضاء. اختر منتخبك المفضل لعرض المباريات القادمة.",
            selectorLabel: "🏴 اختر المنتخب:",
            loadingText: "جاري تحميل المباريات...",
            noMatches: "لا توجد مباريات قادمة لهذا المنتخب حالياً",
            noMatchesSub: "تحقق لاحقاً أو اختر منتخباً آخر",
            streamingTitle: "📺 شاهد المباريات مباشرة",
            streamTag: "بث مباشر",
            streamDesc1: "شاهد جميع مباريات كأس العالم 2026 مباشرة بجودة عالية HD",
            streamDesc2: "تغطية حصرية لكأس العالم - تعليق عربي ومحللين مميزين",
            streamBtn: "اشترك الآن ←",
            productsTitle: "🛒 جهّز نفسك لكأس العالم",
            prodName1: "📺 تلفاز 4K Smart TV",
            prodDesc1: "شاشات ذكية بأسعار مميزة - شاهد المباريات بجودة فائقة",
            prodBtn1: "تسوق من Jumia ←",
            prodName2: "👕 قميص المنتخب المغربي",
            prodDesc2: "قمصان أصلية لمنتخب المغرب - إصدار كأس العالم 2026",
            prodBtn2: "اطلب الآن ←",
            prodName3: "🍿 وجبات خفيفة للمباريات",
            prodDesc3: "حضّر سهرة المباراة - مكسرات وشيبس ومشروبات بأفضل العروض",
            prodBtn3: "تسوق من Noon ←",
            emailTitle: "🔔 تذكير بالمباريات",
            emailDesc: "سجّل بريدك الإلكتروني ليصلك تذكير قبل كل مباراة لمنتخبك المفضل",
            emailSubmitBtn: "سجّل الآن",
            emailSuccess: "✅ تم التسجيل بنجاح! ستصلك التذكيرات.",
            subscribersCount: "مشترك",
            footerDesc: "جميع الأوقات بتوقيت المغرب GMT+1",
            footerDisclaimer: "البيانات مقدمة من TheSportsDB. هذا الموقع غير تابع لـ FIFA.",
            vs: "ضد",
            stadium: "الملعب",
            date: "التاريخ",
            time: "التوقيت",
            tv: "القنوات",
            upcoming: "قادمة",
            apiError: "حدث خطأ في تحميل البيانات. حاول مرة أخرى.",
            tvChannels: "beIN Sports / TOD TV"
        },
        en: {
            heroTitle: "World Cup 2026 Match Schedule - Morocco Time GMT+1",
            heroDesc: "Follow all match times in Casablanca timezone. Select your favorite team to view upcoming matches.",
            selectorLabel: "🏴 Select Team:",
            loadingText: "Loading matches...",
            noMatches: "No upcoming matches for this team",
            noMatchesSub: "Check back later or select another team",
            streamingTitle: "📺 Watch Matches Live",
            streamTag: "Live Stream",
            streamDesc1: "Watch all World Cup 2026 matches live in HD quality",
            streamDesc2: "Exclusive World Cup coverage - Arabic commentary & expert analysis",
            streamBtn: "Subscribe Now →",
            productsTitle: "🛒 Get Ready for the World Cup",
            prodName1: "📺 4K Smart TV",
            prodDesc1: "Smart screens at great prices - Watch matches in ultra quality",
            prodBtn1: "Shop on Jumia →",
            prodName2: "👕 Morocco National Team Jersey",
            prodDesc2: "Official Morocco jerseys - World Cup 2026 Edition",
            prodBtn2: "Order Now →",
            prodName3: "🍿 Match Day Snacks",
            prodDesc3: "Prepare for match night - Nuts, chips & drinks at best deals",
            prodBtn3: "Shop on Noon →",
            emailTitle: "🔔 Match Reminders",
            emailDesc: "Register your email to get reminders before each match of your favorite team",
            emailSubmitBtn: "Subscribe",
            emailSuccess: "✅ Successfully registered! You'll receive reminders.",
            subscribersCount: "subscribers",
            footerDesc: "All times in Morocco time GMT+1",
            footerDisclaimer: "Data provided by TheSportsDB. This site is not affiliated with FIFA.",
            vs: "vs",
            stadium: "Stadium",
            date: "Date",
            time: "Time",
            tv: "TV Channels",
            upcoming: "Upcoming",
            apiError: "Error loading data. Please try again.",
            tvChannels: "beIN Sports / TOD TV"
        }
    };

    // ----------------------------------------------------------
    // INITIALIZATION
    // ----------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        populateTeamSelector();
        applyLanguage();
        loadMatches(TEAMS[DEFAULT_TEAM]);
        updateSubscribersCount();
        showExportIfAdmin();
    });

    // ----------------------------------------------------------
    // TEAM SELECTOR
    // ----------------------------------------------------------
    function populateTeamSelector() {
        const select = document.getElementById('teamSelect');
        const sortedTeams = Object.keys(TEAMS).sort(function (a, b) {
            if (a === DEFAULT_TEAM) return -1;
            if (b === DEFAULT_TEAM) return 1;
            return a.localeCompare(b);
        });

        select.innerHTML = '';
        sortedTeams.forEach(function (team) {
            const option = document.createElement('option');
            option.value = TEAMS[team];
            option.textContent = team;
            if (team === DEFAULT_TEAM) option.selected = true;
            select.appendChild(option);
        });
    }

    // ----------------------------------------------------------
    // FETCH MATCHES
    // ----------------------------------------------------------
    function loadMatches(teamId) {
        var container = document.getElementById('matchesContainer');
        var t = translations[currentLang];

        // Show loading
        container.innerHTML = '<div class="loading"><div class="spinner"></div><p>' + t.loadingText + '</p></div>';

        var url = API_BASE + '/eventsnext.php?id=' + encodeURIComponent(teamId);

        fetch(url)
            .then(function (response) {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(function (data) {
                if (data.events && data.events.length > 0) {
                    renderMatches(data.events);
                } else {
                    showEmptyState();
                }
            })
            .catch(function () {
                container.innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><p>' + t.apiError + '</p></div>';
            });
    }

    // ----------------------------------------------------------
    // RENDER MATCHES
    // ----------------------------------------------------------
    function renderMatches(events) {
        var container = document.getElementById('matchesContainer');
        var t = translations[currentLang];
        var html = '<div class="matches-grid">';

        events.forEach(function (event) {
            var moroccoTime = convertToMoroccoTime(event.strTimestamp || event.dateEvent + 'T' + event.strTime);
            var formattedDate = formatDate(moroccoTime);
            var formattedTime = formatTime(moroccoTime);

            html += '<article class="match-card">';
            html += '<div class="match-header">';
            html += '<span class="match-league">' + sanitize(event.strLeague || 'FIFA World Cup') + '</span>';
            html += '<span class="match-status upcoming">' + t.upcoming + '</span>';
            html += '</div>';

            html += '<div class="match-teams">';
            html += '<div class="team-info">';
            if (event.strHomeTeamBadge) {
                html += '<img class="team-badge" src="' + sanitize(event.strHomeTeamBadge) + '" alt="' + sanitize(event.strHomeTeam) + '" loading="lazy" onerror="this.style.display=\'none\'">';
            }
            html += '<span class="team-name">' + sanitize(event.strHomeTeam) + '</span>';
            html += '</div>';

            html += '<span class="vs-divider">' + t.vs + '</span>';

            html += '<div class="team-info">';
            if (event.strAwayTeamBadge) {
                html += '<img class="team-badge" src="' + sanitize(event.strAwayTeamBadge) + '" alt="' + sanitize(event.strAwayTeam) + '" loading="lazy" onerror="this.style.display=\'none\'">';
            }
            html += '<span class="team-name">' + sanitize(event.strAwayTeam) + '</span>';
            html += '</div>';
            html += '</div>';

            html += '<div class="match-details">';
            html += '<div class="detail-item"><span class="detail-icon">📅</span><span><strong>' + t.date + ':</strong> <span class="detail-value">' + formattedDate + '</span></span></div>';
            html += '<div class="detail-item"><span class="detail-icon">🕐</span><span><strong>' + t.time + ':</strong> <span class="detail-value">' + formattedTime + ' (GMT+1)</span></span></div>';
            html += '<div class="detail-item"><span class="detail-icon">🏟️</span><span><strong>' + t.stadium + ':</strong> <span class="detail-value">' + sanitize(event.strVenue || '—') + '</span></span></div>';
            html += '<div class="detail-item"><span class="detail-icon">📺</span><span><strong>' + t.tv + ':</strong> <span class="detail-value">' + t.tvChannels + '</span></span></div>';
            html += '</div>';

            html += '</article>';
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // ----------------------------------------------------------
    // EMPTY STATE
    // ----------------------------------------------------------
    function showEmptyState() {
        var container = document.getElementById('matchesContainer');
        var t = translations[currentLang];
        container.innerHTML = '<div class="empty-state"><div class="icon">🏈</div><p style="font-size:1.1rem;margin-bottom:0.5rem;">' + t.noMatches + '</p><p>' + t.noMatchesSub + '</p></div>';
    }

    // ----------------------------------------------------------
    // TIME CONVERSION - All times to Morocco GMT+1
    // ----------------------------------------------------------
    function convertToMoroccoTime(timestamp) {
        if (!timestamp) return new Date();
        // Parse ISO timestamp and convert to Morocco timezone
        var date = new Date(timestamp.includes('T') ? timestamp : timestamp + 'T00:00:00Z');
        return date;
    }

    function formatDate(date) {
        try {
            return date.toLocaleDateString(currentLang === 'ar' ? 'ar-MA' : 'en-US', {
                timeZone: MOROCCO_TZ,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return date.toLocaleDateString();
        }
    }

    function formatTime(date) {
        try {
            return date.toLocaleTimeString(currentLang === 'ar' ? 'ar-MA' : 'en-US', {
                timeZone: MOROCCO_TZ,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (e) {
            return date.toLocaleTimeString();
        }
    }

    // ----------------------------------------------------------
    // LANGUAGE TOGGLE
    // ----------------------------------------------------------
    window.toggleLanguage = function () {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        localStorage.setItem('wc2026_lang', currentLang);
        applyLanguage();
        // Reload matches with current selection
        var select = document.getElementById('teamSelect');
        loadMatches(select.value);
    };

    function applyLanguage() {
        var t = translations[currentLang];
        var body = document.body;

        if (currentLang === 'ar') {
            body.setAttribute('dir', 'rtl');
            body.setAttribute('lang', 'ar');
        } else {
            body.setAttribute('dir', 'ltr');
            body.setAttribute('lang', 'en');
        }

        // Update static text
        setText('heroTitle', t.heroTitle);
        setText('heroDesc', t.heroDesc);
        setText('selectorLabel', t.selectorLabel);
        setText('streamingTitle', t.streamingTitle);
        setText('streamTag1', t.streamTag);
        setText('streamTag2', t.streamTag);
        setText('streamDesc1', t.streamDesc1);
        setText('streamDesc2', t.streamDesc2);
        setText('streamBtn1', t.streamBtn);
        setText('streamBtn2', t.streamBtn);
        setText('productsTitle', t.productsTitle);
        setText('prodName1', t.prodName1);
        setText('prodDesc1', t.prodDesc1);
        setText('prodBtn1', t.prodBtn1);
        setText('prodName2', t.prodName2);
        setText('prodDesc2', t.prodDesc2);
        setText('prodBtn2', t.prodBtn2);
        setText('prodName3', t.prodName3);
        setText('prodDesc3', t.prodDesc3);
        setText('prodBtn3', t.prodBtn3);
        setText('emailTitle', t.emailTitle);
        setText('emailDesc', t.emailDesc);
        setText('emailSubmitBtn', t.emailSubmitBtn);
        setText('footerDesc', t.footerDesc);
        setText('footerDisclaimer', t.footerDisclaimer);

        document.getElementById('emailInput').placeholder = currentLang === 'ar' ? 'example@email.com' : 'example@email.com';
    }

    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // ----------------------------------------------------------
    // TEAM CHANGE HANDLER
    // ----------------------------------------------------------
    window.onTeamChange = function () {
        var select = document.getElementById('teamSelect');
        loadMatches(select.value);
    };

    // ----------------------------------------------------------
    // EMAIL COLLECTION - LocalStorage
    // ----------------------------------------------------------
    window.handleEmailSubmit = function (e) {
        e.preventDefault();
        var input = document.getElementById('emailInput');
        var email = input.value.trim();

        if (!email || !isValidEmail(email)) return false;

        // Get existing subscribers
        var subscribers = getSubscribers();

        // Check duplicate
        var exists = subscribers.some(function (s) { return s.email === email; });
        if (exists) {
            document.getElementById('emailSuccess').style.display = 'block';
            document.getElementById('emailSuccess').textContent = currentLang === 'ar' ? '⚠️ هذا البريد مسجل بالفعل' : '⚠️ This email is already registered';
            return false;
        }

        // Get selected team name
        var select = document.getElementById('teamSelect');
        var teamName = select.options[select.selectedIndex].textContent;

        // Save
        subscribers.push({
            email: email,
            team: teamName,
            teamId: select.value,
            date: new Date().toISOString()
        });

        localStorage.setItem('wc2026_subscribers', JSON.stringify(subscribers));

        // UI feedback
        input.value = '';
        var successEl = document.getElementById('emailSuccess');
        successEl.style.display = 'block';
        successEl.textContent = translations[currentLang].emailSuccess;
        updateSubscribersCount();

        setTimeout(function () {
            successEl.style.display = 'none';
        }, 4000);

        return false;
    };

    function getSubscribers() {
        try {
            var data = localStorage.getItem('wc2026_subscribers');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function updateSubscribersCount() {
        var subscribers = getSubscribers();
        var countEl = document.getElementById('subscribersCount');
        if (subscribers.length > 0) {
            var t = translations[currentLang];
            countEl.textContent = '👥 ' + subscribers.length + ' ' + t.subscribersCount;
        } else {
            countEl.textContent = '';
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ----------------------------------------------------------
    // CSV EXPORT
    // ----------------------------------------------------------
    window.exportCSV = function () {
        var subscribers = getSubscribers();
        if (subscribers.length === 0) return;

        var csv = 'Email,Team,Team ID,Registration Date\n';
        subscribers.forEach(function (s) {
            csv += '"' + s.email + '","' + s.team + '","' + s.teamId + '","' + s.date + '"\n';
        });

        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'wc2026_subscribers_' + new Date().toISOString().split('T')[0] + '.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Show export button if there are subscribers (admin access)
    function showExportIfAdmin() {
        var subscribers = getSubscribers();
        var btn = document.getElementById('exportBtn');
        if (subscribers.length > 0 && btn) {
            btn.style.display = 'inline-block';
        }
    }

    // ----------------------------------------------------------
    // SECURITY - Sanitize output to prevent XSS
    // ----------------------------------------------------------
    function sanitize(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

})();
