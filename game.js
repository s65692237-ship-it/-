// ===== СИМУЛЯТОР МЕССЕНДЖЕРА v10.0 =====
// Работает на ПК и телефоне. Все персонажи вымышленные.

function safeNumber(n, def){ return (typeof n === "number" && isFinite(n)) ? n : (def || 0); }

function getDeviceType(){
    const ua = navigator.userAgent || "";
    const isMobile = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(ua);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return isMobile || (isTouch && window.innerWidth < 900) ? "mobile" : "desktop";
}

let S = {
    name:"", color:"#3b82f6", logo:"💬", mode:"normal", difficulty:"medium",
    settings:{sound:true, music:true, coins:true, confetti:true, notify:true, events:true, autosave:true, autotheme:false, fontbig:false},
    users:0, money:2000, rep:50,
    techs:[], staff:[], servers:[],
    staffLevels:{}, staffVacation:{}, staffTraining:{},
    depts:{}, skills:{},
    log:[], achievements:[], playtime:0,
    level:1, xp:0,
    dailyTasks:[], tasksDate:"",
    lastPlaytime:0, light:false,
    prestige:0, prestigeMult:1, prestigePoints:0, prestigeUpgrades:{},
    stocks:{own:{owned:0,price:10}, comp:{owned:0,price:50}, index:{owned:0,price:100}},
    cryptos:{VOX:{owned:0,price:1},BTC:{owned:0,price:60000},ETH:{owned:0,price:3000},DOGE:{owned:0,price:0.15},SHIB:{owned:0,price:0.00002},SOL:{owned:0,price:150},XRP:{owned:0,price:0.5},ADA:{owned:0,price:0.4},DOT:{owned:0,price:7},MATIC:{owned:0,price:0.8}},
    competitors:[
        {name:"Корпорация А",users:900000000,growth:100},{name:"Мессенджер Б",users:2000000000,growth:200},
        {name:"Связь В",users:50000000,growth:50},{name:"Чат Г",users:40000000,growth:30},
        {name:"Дискурс Д",users:150000000,growth:60},{name:"Пульс Е",users:260000000,growth:20},
        {name:"Вэй Ж",users:1300000000,growth:150},{name:"Посланник З",users:1300000000,growth:80},
        {name:"Линия И",users:200000000,growth:25},{name:"К-Чат",users:50000000,growth:15},
        {name:"Снэп К",users:750000000,growth:40},{name:"Фото-чат",users:2000000000,growth:250},
        {name:"Я-Сообщение",users:1300000000,growth:70},{name:"Слэк",users:20000000,growth:10},
        {name:"Команды",users:280000000,growth:35}
    ],
    usersHistory:[0], crisis:false, crisisTimer:0, investors:[], season:1, seasonTimer:0,
    koll:{icons:[], themes:[], stickers:[], customStickers:[], unlockedLogos:["💬"]},
    inflation:0,
    company:{offices:0, absorbed:0, ipo:false, board:false, lawyers:false, franchise:false, partners:0},
    crystals:0, dailyRewardDate:"", dailyStreak:0, questIndex:0,
    countries:[
        {name:"Россия",unlocked:true,users:0},{name:"США",unlocked:false,users:0},
        {name:"Китай",unlocked:false,users:0},{name:"Германия",unlocked:false,users:0},
        {name:"Индия",unlocked:false,users:0},{name:"Бразилия",unlocked:false,users:0},
        {name:"Япония",unlocked:false,users:0},{name:"Корея",unlocked:false,users:0},
        {name:"Турция",unlocked:false,users:0},{name:"Мексика",unlocked:false,users:0},
        {name:"Индонезия",unlocked:false,users:0},{name:"Нигерия",unlocked:false,users:0},
        {name:"Египет",unlocked:false,users:0},{name:"Австралия",unlocked:false,users:0},
        {name:"Канада",unlocked:false,users:0},{name:"Франция",unlocked:false,users:0},
        {name:"Италия",unlocked:false,users:0},{name:"Испания",unlocked:false,users:0},
        {name:"Польша",unlocked:false,users:0},{name:"Аргентина",unlocked:false,users:0}
    ],
    weather:"Ясно", timeOfDay:"День", clan:{name:"", members:[]}, storyChapter:1,
    voxCoin:0, deposit:0, crowdfundTotal:0, offshore:0, bonds:0,
    easterEggsFound:[], codesUsed:[], bots:[], battlesWon:0, bossHP:1000, bossLevel:1,
    unionActivity:0, salaryLevel:1, friends:[], wall:[], clickerCount:0, multiverse:[],
    profileAvatar:"👤", profileName:"", profileStatus:"",
    lastClickTime:0, clickBlocked:false, clickBlockEnd:0, clicksInWindow:0, clickWindowStart:0,
    referrals:0, tutorialDone:false, mathGameActive:false, mathAnswer:0, mathTimer:0,
    prestigeUpgrades:{fastStart:0, cheaperTech:0, moreIncome:0, moreGrowth:0}
};

let gameCreated = false;
let deviceType = getDeviceType();

const DIFFICULTY = {
    easy:{incomeMult:1.5,costMult:0.7,eventChance:0.005,desc:"Лёгкая: больше дохода"},
    medium:{incomeMult:1.0,costMult:1.0,eventChance:0.008,desc:"Средняя: баланс"},
    hard:{incomeMult:0.6,costMult:1.5,eventChance:0.015,desc:"Сложная: меньше дохода"}
};

const TECHS = [
    {id:"chats",name:"Личные чаты",cost:100,users:50},{id:"groups",name:"Группы",cost:300,users:150},
    {id:"photo",name:"Фото",cost:500,users:200},{id:"video",name:"Видео",cost:800,users:300},
    {id:"voice",name:"Голосовые",cost:1200,users:400},{id:"stickers",name:"Стикеры",cost:1800,users:500},
    {id:"reactions",name:"Реакции",cost:2500,users:700},{id:"calls",name:"Звонки",cost:4000,users:1000},
    {id:"crypto",name:"Шифрование",cost:7000,users:1500},{id:"bots",name:"Боты",cost:12000,users:2000},
    {id:"stories",name:"Статусы",cost:18000,users:2500},{id:"channels",name:"Каналы",cost:25000,users:3000},
    {id:"premium",name:"Подписка",cost:40000,users:5000},{id:"apps",name:"Мини-приложения",cost:70000,users:8000},
    {id:"ai",name:"AI-ассистент",cost:120000,users:15000},{id:"vr",name:"VR-чаты",cost:200000,users:20000},
    {id:"ar",name:"AR-маски",cost:300000,users:25000},{id:"nft",name:"NFT-аватары",cost:500000,users:30000},
    {id:"meta",name:"Метавселенная",cost:800000,users:50000},{id:"quantum",name:"Квантовое шифрование",cost:1500000,users:80000},
    {id:"neural",name:"Нейроинтерфейс",cost:3000000,users:120000},{id:"hologram",name:"Голограммы",cost:5000000,users:200000},
    {id:"teleport",name:"Телепортация",cost:10000000,users:400000},{id:"timetravel",name:"Отправка в прошлое",cost:50000000,users:1000000},
    {id:"parallel",name:"Параллельные миры",cost:100000000,users:2000000},{id:"dimension",name:"Межмерное",cost:500000000,users:5000000},
    {id:"universe",name:"Связь вселенных",cost:1000000000,users:10000000},{id:"god",name:"Божественный чат",cost:5000000000,users:50000000},
    {id:"infinity",name:"Бесконечность",cost:10000000000,users:100000000},{id:"eternity",name:"Вечность",cost:50000000000,users:500000000},
    {id:"dream",name:"Сны",cost:100000000000,users:1000000000},{id:"reality",name:"Управление реальностью",cost:500000000000,users:5000000000},
    {id:"time",name:"Путешествия во времени",cost:1000000000000,users:10000000000},{id:"void",name:"Связь с пустотой",cost:5000000000000,users:50000000000},
    {id:"absolute",name:"Абсолютная связь",cost:10000000000000,users:100000000000},{id:"eternal",name:"Вечный чат",cost:50000000000000,users:500000000000},
    {id:"beyond",name:"За пределами",cost:100000000000000,users:1000000000000},{id:"everything",name:"Всё",cost:500000000000000,users:5000000000000},
    {id:"nothing",name:"Ничто",cost:1000000000000000,users:10000000000000},{id:"ome",name:"Ом",cost:5000000000000000,users:50000000000000},
    {id:"zero",name:"Ноль",cost:10000000000000000,users:100000000000000},{id:"alpha",name:"Альфа",cost:50000000000000000,users:500000000000000}
];

const STAFF = [
    {id:"dev",name:"Разработчик",cost:500,income:2,users:10},{id:"mod",name:"Модератор",cost:800,income:0,users:20},
    {id:"design",name:"Дизайнер",cost:1000,income:3,users:15},{id:"market",name:"Маркетолог",cost:1500,income:5,users:50},
    {id:"sec",name:"Безопасник",cost:2000,income:2,users:5},{id:"intern",name:"Стажёр",cost:100,income:0.5,users:2},
    {id:"lead",name:"Тимлид",cost:5000,income:10,users:100},{id:"hr",name:"HR",cost:3000,income:1,users:30},
    {id:"lawyer",name:"Юрист",cost:7000,income:3,users:10},{id:"analyst",name:"Аналитик",cost:6000,income:8,users:40},
    {id:"cto",name:"Техдир",cost:15000,income:20,users:200},{id:"ceo",name:"Гендир",cost:50000,income:50,users:500},
    {id:"ai_dev",name:"AI-разработчик",cost:100000,income:100,users:2000},{id:"quantum_dev",name:"Квантовый инженер",cost:500000,income:500,users:10000},
    {id:"space_dev",name:"Космический инженер",cost:2000000,income:2000,users:50000},{id:"time_dev",name:"Хроно-инженер",cost:10000000,income:10000,users:200000},
    {id:"god_dev",name:"Божественный архитектор",cost:100000000,income:100000,users:2000000}
];

const CHARACTERS = [
    {id:"lazy",name:"Ленивый",mult:0.5,tag:"tag-lazy"},{id:"normal",name:"Обычный",mult:1.0,tag:"tag-normal"},
    {id:"genius",name:"Гений",mult:2.0,tag:"tag-genius"},{id:"work",name:"Трудоголик",mult:1.5,tag:"tag-work"},
    {id:"evil",name:"Злой",mult:1.8,tag:"tag-evil"},{id:"kind",name:"Добрый",mult:1.2,tag:"tag-kind"},
    {id:"clown",name:"Клоун",mult:0.7,tag:"tag-clown"},{id:"greed",name:"Жадный",mult:1.6,tag:"tag-greed"},
    {id:"brave",name:"Смелый",mult:1.4,tag:"tag-brave"},{id:"coward",name:"Трусливый",mult:0.8,tag:"tag-coward"}
];

const SERVERS = [
    {id:"small",name:"Малый",cost:500,maxUsers:1000},{id:"medium",name:"Средний",cost:2000,maxUsers:5000},
    {id:"large",name:"Большой",cost:8000,maxUsers:20000},{id:"mega",name:"Мега",cost:30000,maxUsers:100000},
    {id:"giga",name:"Гига",cost:150000,maxUsers:1000000},{id:"tera",name:"Тера",cost:700000,maxUsers:10000000},
    {id:"quantum",name:"Квантовый",cost:5000000,maxUsers:100000000},{id:"stellar",name:"Звёздный",cost:50000000,maxUsers:1000000000},
    {id:"galactic",name:"Галактический",cost:500000000,maxUsers:10000000000},{id:"universal",name:"Вселенский",cost:5000000000,maxUsers:100000000000},
    {id:"multiversal",name:"Мультивселенский",cost:50000000000,maxUsers:1000000000000},{id:"infinite",name:"Бесконечный",cost:500000000000,maxUsers:10000000000000}
];

const DEPTS = [
    {id:"dev",name:"Разработка",cost:5000,effect:"+10% скорость"},{id:"mark",name:"Маркетинг",cost:8000,effect:"+15% рост"},
    {id:"supp",name:"Поддержка",cost:6000,effect:"+репутация"},{id:"sec",name:"Безопасность",cost:10000,effect:"-50% урон"},
    {id:"data",name:"Аналитика",cost:12000,effect:"+прогнозы"},{id:"legal",name:"Юридический",cost:15000,effect:"-иски"},
    {id:"rnd",name:"Исследования",cost:20000,effect:"+технологии"},{id:"global",name:"Международный",cost:30000,effect:"+страны"}
];

const SKILLS = [
    {id:"speed",name:"Скорость",cost:2000,maxLevel:20,effect:"-5% цена"},{id:"profit",name:"Прибыльность",cost:3000,maxLevel:20,effect:"+10% доход"},
    {id:"defense",name:"Защита",cost:2500,maxLevel:20,effect:"-10% урон"},{id:"growth",name:"Рост",cost:4000,maxLevel:20,effect:"+10% рост"},
    {id:"rep",name:"Репутация",cost:3500,maxLevel:20,effect:"+5 реп/сек"},{id:"luck",name:"Удача",cost:5000,maxLevel:20,effect:"+события"},
    {id:"crypto",name:"Крипто-чутьё",cost:6000,maxLevel:20,effect:"+крипта"},{id:"diplomacy",name:"Дипломатия",cost:8000,maxLevel:20,effect:"-конфликты"}
];

const COMPANY_UPGRADES = [
    {id:"office",name:"Второй офис",cost:50000,desc:"+20% доход"},{id:"absorb",name:"Поглотить",cost:100000,desc:"+50000 юзеров"},
    {id:"ipo",name:"IPO",cost:500000,desc:"+$5000/сек"},{id:"board",name:"Совет директоров",cost:200000,desc:"+15% бонусов"},
    {id:"lawyers",name:"Юристы",cost:80000,desc:"Защита"},{id:"franchise",name:"Франшиза",cost:150000,desc:"+$500/сек"},
    {id:"partners",name:"Партнёрство",cost:60000,desc:"+10% рост"}
];

const BOTS = [
    {id:"autoTech",name:"Автокупец",cost:10000,desc:"Покупает технологии"},
    {id:"autoStaff",name:"АвтоHR",cost:15000,desc:"Наняет сотрудников"},
    {id:"autoStock",name:"Автотрейдер",cost:20000,desc:"Торгует акциями"},
    {id:"autoCrypto",name:"Крипто-бот",cost:25000,desc:"Майнит крипту"},
    {id:"autoAds",name:"Рекламный бот",cost:30000,desc:"Приводит юзеров"}
];

const QUESTS = [
    {id:"q1",name:"Первый шаг",desc:"Купи 1 технологию",check:()=>S.techs.length>=1,reward:500,crystals:1},
    {id:"q2",name:"Первые люди",desc:"Найми сотрудника",check:()=>S.staff.length>=1,reward:800,crystals:1},
    {id:"q3",name:"Растущий бизнес",desc:"1000 юзеров",check:()=>S.users>=1000,reward:2000,crystals:2},
    {id:"q4",name:"Мощность",desc:"Купи сервер",check:()=>S.servers.length>=1,reward:1500,crystals:2},
    {id:"q5",name:"Команда",desc:"5 сотрудников",check:()=>S.staff.length>=5,reward:5000,crystals:3},
    {id:"q6",name:"Инвестор",desc:"50000$",check:()=>S.money>=50000,reward:10000,crystals:5},
    {id:"q7",name:"Империя",desc:"100000 юзеров",check:()=>S.users>=100000,reward:50000,crystals:10},
    {id:"q8",name:"Миллион",desc:"1M юзеров",check:()=>S.users>=1000000,reward:500000,crystals:25},
    {id:"q9",name:"Всемирный",desc:"3 страны",check:()=>S.countries.filter(c=>c.unlocked).length>=3,reward:100000,crystals:15},
    {id:"q10",name:"Клан",desc:"Создай клан",check:()=>S.clan.name!=="",reward:20000,crystals:5},
    {id:"q11",name:"Вкладчик",desc:"10000$ вклад",check:()=>S.deposit>=10000,reward:50000,crystals:10},
    {id:"q12",name:"Крипто-магнат",desc:"10000 VoxCoin",check:()=>S.voxCoin>=10000,reward:150000,crystals:20},
    {id:"q13",name:"Сюжет",desc:"3 главы",check:()=>S.storyChapter>=3,reward:80000,crystals:12},
    {id:"q14",name:"10 технологий",desc:"Купи 10",check:()=>S.techs.length>=10,reward:100000,crystals:15},
    {id:"q15",name:"20 технологий",desc:"Купи 20",check:()=>S.techs.length>=20,reward:500000,crystals:30},
    {id:"q16",name:"Все технологии",desc:"Все",check:()=>S.techs.length>=TECHS.length,reward:10000000,crystals:100},
    {id:"q17",name:"Все сотрудники",desc:"Все",check:()=>S.staff.length>=STAFF.length,reward:200000,crystals:25},
    {id:"q18",name:"Все серверы",desc:"Все",check:()=>S.servers.length>=SERVERS.length,reward:1000000,crystals:40},
    {id:"q19",name:"Все отделы",desc:"Все",check:()=>Object.keys(S.depts).length>=DEPTS.length,reward:500000,crystals:30},
    {id:"q20",name:"Все навыки",desc:"MAX",check:()=>SKILLS.every(sk=>(S.skills[sk.id]||0)>=sk.maxLevel),reward:5000000,crystals:100},
    {id:"q21",name:"10M юзеров",desc:"10M",check:()=>S.users>=10000000,reward:5000000,crystals:50},
    {id:"q22",name:"100M юзеров",desc:"100M",check:()=>S.users>=100000000,reward:50000000,crystals:100},
    {id:"q23",name:"Все страны",desc:"20",check:()=>S.countries.filter(c=>c.unlocked).length>=20,reward:10000000,crystals:80},
    {id:"q24",name:"Престиж 5",desc:"5",check:()=>S.prestige>=5,reward:10000000,crystals:50},
    {id:"q25",name:"Легенда",desc:"1 миллиард",check:()=>S.users>=1000000000,reward:100000000,crystals:200},
    {id:"q26",name:"Космос",desc:"1 триллион",check:()=>S.users>=1000000000000,reward:1000000000,crystals:500},
    {id:"q27",name:"Все боты",desc:"Купи 5 ботов",check:()=>S.bots.length>=BOTS.length,reward:500000,crystals:50},
    {id:"q28",name:"Боец",desc:"Выиграй 10 битв",check:()=>S.battlesWon>=10,reward:2000000,crystals:80},
    {id:"q29",name:"Босс-убийца",desc:"Победи 5 боссов",check:()=>S.bossLevel>=6,reward:10000000,crystals:150},
    {id:"q30",name:"Оффшорный",desc:"100000$ в оффшоре",check:()=>S.offshore>=100000,reward:500000,crystals:30},
    {id:"q31",name:"Мультивселенец",desc:"Открой 3 версии",check:()=>S.multiverse.length>=3,reward:5000000,crystals:100},
    {id:"q32",name:"Пасхалко-искатель",desc:"20 пасхалок",check:()=>S.easterEggsFound.length>=20,reward:1000000,crystals:60},
    {id:"q33",name:"Кодер",desc:"10 кодов",check:()=>S.codesUsed.length>=10,reward:10000000,crystals:200},
    {id:"q34",name:"Филантроп",desc:"1000000 репутации",check:()=>S.rep>=1000000,reward:5000000,crystals:100},
    {id:"q35",name:"Абсолют",desc:"Все технологии",check:()=>S.techs.length>=TECHS.length,reward:1000000000,crystals:1000}
];

const CRYSTAL_SHOP = [
    {id:"c1",name:"+$10000",cost:5,action:()=>{S.money+=10000;}},
    {id:"c2",name:"+50000 юзеров",cost:10,action:()=>{S.users+=50000;}},
    {id:"c3",name:"Мега-сервер",cost:15,action:()=>{if(!S.servers.includes("mega"))S.servers.push("mega");}},
    {id:"c4",name:"Все технологии",cost:50,action:()=>{TECHS.forEach(t=>{if(!S.techs.includes(t.id))S.techs.push(t.id);});}},
    {id:"c5",name:"×2 доход 5 мин",cost:20,action:()=>{S.prestigeMult*=2;setTimeout(()=>{S.prestigeMult/=2;},300000);}},
    {id:"c6",name:"Открыть страну",cost:30,action:()=>{const l=S.countries.find(c=>!c.unlocked);if(l)l.unlocked=true;}},
    {id:"c7",name:"+$1000000",cost:100,action:()=>{S.money+=1000000;}},
    {id:"c8",name:"+1M юзеров",cost:200,action:()=>{S.users+=1000000;}},
    {id:"c9",name:"Все сотрудники",cost:150,action:()=>{STAFF.forEach(s=>{if(!S.staff.includes(s.id)){S.staff.push(s.id);S.staffLevels[s.id]={level:1,char:"genius"};}});}},
    {id:"c10",name:"Все навыки MAX",cost:500,action:()=>{SKILLS.forEach(sk=>{S.skills[sk.id]=sk.maxLevel;});}},
    {id:"c11",name:"×10 доход",cost:1000,action:()=>{S.prestigeMult*=10;}},
    {id:"c12",name:"+$1 миллиард",cost:5000,action:()=>{S.money+=1000000000;}}
];

const ACHIEVEMENTS = [];
(function(){
    const names = ["Первые 100","1 000 юзеров","10 000 юзеров","100 000 юзеров","Миллион юзеров","10 миллионов","100 миллионов","Миллиард","Триллион","Квадриллион","Богач","Миллионер","Мультимиллионер","Миллиардер","Все технологии","Полная команда","Команда мечты","10 минут","30 минут","Час в игре","3 часа","Уровень 5","Уровень 10","Уровень 20","Уровень 50","Уровень 100","Престиж 1","Престиж 3","Престиж 10","Криптоинвестор","Все 10 крипт","Империя","Квест-мастер","Постоянный","Неделя","Месяц","Инвестор-магнат","Все отделы","Все навыки MAX","Коллекционер","Путешественник","Клановый","Все страны","Первый сюжет","Весь сюжет","Вкладчик","Краудфандер","VoxCoin 1000","VoxCoin 100000","Все серверы","Все логотипы","Пасхалка","5 пасхалок","Режим хардкор","Режим песочница","Режим выживание","Топ-1","Обогнал Мессенджер Б","Престиж+","Офисный планктон","Юрист","Франшиза","Партнёр","Легенда","Бот-мастер","Боец","Босс-убийца","Биржевик","Лотерейщик","Оффшорный","Профсоюзник","40 пасхалок","10 кодов","Все боты","Мультивселенец","Мини-игрок","Друг","Стена постов","Лайкер","Автор","Персонаж","Романтик","Предатель","Финал 1","Финал 2","Финал 3","Финал 4","Финал 5","Финал 6","Финал 7","Финал 8","Финал 9","Финал 10","Все достижения","Настоящая легенда","Мультимиллиардер","Космический","Подводный","Вечный","Абсолютный","Божественный","Всё в одном","Ом","Реферал","5 рефералов","10 рефералов","Обучение","Математик","Сезон"];
    for(let i=0;i<120;i++) ACHIEVEMENTS.push({id:"a"+(i+1),name:names[i]||("Достижение "+(i+1)),check:()=>false});
    ACHIEVEMENTS[0].check = ()=>S.users>=100;
    ACHIEVEMENTS[4].check = ()=>S.users>=1000000;
    ACHIEVEMENTS[7].check = ()=>S.users>=1000000000;
    ACHIEVEMENTS[11].check = ()=>S.money>=10000;
    ACHIEVEMENTS[13].check = ()=>S.money>=1000000000;
    ACHIEVEMENTS[14].check = ()=>S.techs.length>=TECHS.length;
    ACHIEVEMENTS[15].check = ()=>S.staff.length>=STAFF.length;
    ACHIEVEMENTS[26].check = ()=>S.prestige>=1;
    ACHIEVEMENTS[27].check = ()=>S.prestige>=3;
    ACHIEVEMENTS[28].check = ()=>S.prestige>=10;
    ACHIEVEMENTS[30].check = ()=>Object.values(S.cryptos).every(c=>c.owned>0);
    ACHIEVEMENTS[38].check = ()=>SKILLS.every(sk=>(S.skills[sk.id]||0)>=sk.maxLevel);
    ACHIEVEMENTS[41].check = ()=>S.countries.filter(c=>c.unlocked).length>=20;
    ACHIEVEMENTS[52].check = ()=>S.easterEggsFound.length>=5;
    ACHIEVEMENTS[53].check = ()=>S.mode==="hardcore";
    ACHIEVEMENTS[54].check = ()=>S.mode==="sandbox";
    ACHIEVEMENTS[55].check = ()=>S.mode==="survival";
    ACHIEVEMENTS[58].check = ()=>S.users>=2000000000;
    ACHIEVEMENTS[64].check = ()=>S.bots.length>=1;
    ACHIEVEMENTS[65].check = ()=>S.battlesWon>=1;
    ACHIEVEMENTS[66].check = ()=>S.bossLevel>=2;
    ACHIEVEMENTS[67].check = ()=>S.stocks.comp.owned>=1;
    ACHIEVEMENTS[68].check = ()=>S.money>=100000;
    ACHIEVEMENTS[69].check = ()=>S.offshore>=10000;
    ACHIEVEMENTS[70].check = ()=>S.unionActivity>=50;
    ACHIEVEMENTS[71].check = ()=>S.easterEggsFound.length>=40;
    ACHIEVEMENTS[72].check = ()=>S.codesUsed.length>=10;
    ACHIEVEMENTS[73].check = ()=>S.bots.length>=BOTS.length;
    ACHIEVEMENTS[74].check = ()=>S.multiverse.length>=6;
    ACHIEVEMENTS[75].check = ()=>S.clickerCount>=100;
    ACHIEVEMENTS[76].check = ()=>S.friends.length>=1;
    ACHIEVEMENTS[77].check = ()=>S.wall.length>=1;
    ACHIEVEMENTS[78].check = ()=>S.wall.some(w=>w.likes>0);
    ACHIEVEMENTS[99].check = ()=>S.referrals>=1;
    ACHIEVEMENTS[100].check = ()=>S.referrals>=5;
    ACHIEVEMENTS[101].check = ()=>S.referrals>=10;
    ACHIEVEMENTS[102].check = ()=>S.tutorialDone;
    ACHIEVEMENTS[103].check = ()=>S.mathWins>=1;
    ACHIEVEMENTS[104].check = ()=>S.season>=2;
})();

const INVESTOR_TYPES = [
    {name:"Частный инвестор",minOffer:5000,share:0.05},{name:"Венчурный фонд",minOffer:20000,share:0.10},
    {name:"Крупный холдинг",minOffer:50000,share:0.15},{name:"Иностранный фонд",minOffer:100000,share:0.20},
    {name:"Ангельский фонд",minOffer:15000,share:0.08},{name:"Хедж-фонд",minOffer:200000,share:0.25},
    {name:"Государственный",minOffer:300000,share:0.30},{name:"Техно-гигант",minOffer:500000,share:0.35},
    {name:"Нефтяной магнат",minOffer:1000000,share:0.40},{name:"Крипто-фонд",minOffer:2000000,share:0.45},
    {name:"Медиа-холдинг",minOffer:5000000,share:0.50},{name:"Военный фонд",minOffer:10000000,share:0.55},
    {name:"Космический фонд",minOffer:50000000,share:0.60},{name:"Тайный орден",minOffer:100000000,share:0.70},
    {name:"Иллюминаты",minOffer:1000000000,share:0.90}
];

const KOLL_ICONS = ["💬","📱","⚡","🌐","🚀","🔥","💎","⭐","🎯","🎨","🦊","🐉","🌈","❄️","🌙","☀️","🍀","🎮","🎧","👑","🐺","🦅","🐼","🐧","🦁","🐯","🐸","🐵","🦄","🐲","🌟","💫","✨","🌠","🎆","🎇","🧨","💥","💢","🎁"];
const KOLL_THEMES = ["Синий","Фиолетовый","Зелёный","Красный","Оранжевый","Розовый","Голубой","Золотой","Бирюзовый","Лайм","Индиго","Коралловый","Мятный","Лавандовый","Серебряный","Бронзовый","Изумрудный","Рубиновый","Сапфировый","Аметистовый","Янтарный","Малиновый","Оливковый","Пурпурный","Бежевый","Хаки","Виноградный","Ночной","Ледяной","Огненный"];
const ALL_LOGOS = ["💬","📱","⚡","🌐","🚀","🔥","💎","⭐","🎯","🎨","🦊","🐉","🌈","❄️","🌙","☀️","🍀","🎮","🎧","👑","🐺","🦅","🐼","🐧","🦁","🐯","🐸","🐵","🦄","🐲","🌟","💫","✨","🌠","🎆","🎇","🧨","💥","💢","🎁","🏆","🥇","🎖️","🏅","💍","👽","🤖","🎃"];
const ALL_STICKERS = ["😂","😍","🤔","😎","🥳","😭","🤯","🤡","👻","👽","🤖","💀","💩","🔥","❤️","💔","👍","👎","🤝","👏","🙏","💪","🤞","✌️"];
const ALL_AVATARS = ["👤","👨","👩","🧑","👶","🧓","👮","🕵️","💂","👷","👨‍💻","👩‍💻","🦸","🦹","🧙","🧚","🧛","🧜","🧝","🎅"];

const STORY_CHAPTERS = [
    {text:"Ты запустил свой мессенджер. Конкуренты заметили.",choices:[{text:"Приватность",effect:()=>{S.rep+=10;}},{text:"Скорость",effect:()=>{S.users+=1000;}}]},
    {text:"Инвесторы хотят долю.",choices:[{text:"Взять деньги",effect:()=>{S.money+=50000;S.prestigeMult*=0.9;}},{text:"Расти самому",effect:()=>{S.users+=5000;}}]},
    {text:"Конкурент запустил похожую фичу.",choices:[{text:"Ответить фичей",effect:()=>{S.techs.push("ai");}},{text:"Сделать скидку",effect:()=>{S.users+=10000;S.money-=5000;}}]},
    {text:"Государство требует лицензию.",choices:[{text:"Получить",effect:()=>{S.money-=20000;S.rep+=20;}},{text:"Игнорировать",effect:()=>{S.rep-=10;S.money+=30000;}}]},
    {text:"Мессенджер стал мировым.",choices:[{text:"Остаться независимым",effect:()=>{S.prestigeMult*=1.5;}},{text:"Продать гиганту",effect:()=>{S.money+=1000000;}}]},
    {text:"Крупный конкурент предложил слияние.",choices:[{text:"Принять",effect:()=>{S.users+=100000000;S.prestigeMult*=0.5;}},{text:"Отказаться",effect:()=>{S.rep+=30;}}]},
    {text:"Появился конкурент из будущего.",choices:[{text:"Изучить",effect:()=>{S.techs.push("quantum");}},{text:"Атаковать",effect:()=>{S.users-=100000;S.money+=500000;}}]},
    {text:"Учёные предлагают нейроинтерфейс.",choices:[{text:"Внедрить",effect:()=>{S.techs.push("neural");S.users*=1.5;}},{text:"Отказаться",effect:()=>{S.rep+=20;}}]},
    {text:"Тебе пишет известный предприниматель.",choices:[{text:"Ответить",effect:()=>{S.money+=10000000;S.rep+=50;}},{text:"Игнорировать",effect:()=>{S.users+=5000000;}}]},
    {text:"Ты стал самым большим мессенджером в истории.",choices:[{text:"Уйти на пенсию",effect:()=>{S.prestige+=1;S.prestigeMult*=5;}},{text:"Продолжать",effect:()=>{S.users*=2;}}]}
];
for(let i=STORY_CHAPTERS.length;i<30;i++) STORY_CHAPTERS.push({text:"Глава "+(i+1)+": Продолжение...",choices:[{text:"Далее",effect:()=>{S.money+=100000;}}]});

const EASTER_EGGS = ["🥚 Тот, кто ищет — найдёт","🥚 КОД-4821","🥚 2026: мессенджеры захватят мир","🥚 Пусто?","🥚 РАКЕТА-2026","🥚 42","🥚 Ещё одна дверь","🥚 Ты — избранный","🥚 Не смотри в бездну","🥚 Всё циклично","🥚 Привет, мир!","🥚 Ты не первый","🥚 Следят за тобой","🥚 Ты видел это","🥚 Данные не исчезают","🥚 Мы видим","🥚 Симуляция","🥚 01001000","🥚 Привет из 3026","🥚 Кот жив","🥚 Красная таблетка","🥚 Синяя таблетка","🥚 Сбой матрицы","🥚 Проснись","🥚 Ты — бот","🥚 Я — ты","🥚 Круг замкнулся","🥚 Конец = начало","🥚 Всё повторится","🥚 Спасибо за игру","🥚 Дверь №7","🥚 Не оборачивайся","🥚 Свет мигает","🥚 Шаги за спиной","🥚 Ты не один","🥚 Они слушают","🥚 Выход есть","🥚 Только вперёд","🥚 Не сдавайся","🥚 Финал близко"];

const EVENTS = [
    {text:"⚠️ Сервер упал! -5%",fn:()=>{S.users*=0.95;},type:"bad"},
    {text:"🎉 Вирусный пост! +500",fn:()=>{S.users+=500;},type:"good"},
    {text:"💀 Хакер! -10% денег",fn:()=>{S.money*=0.9;},type:"bad"},
    {text:"📰 Статья! +10 реп",fn:()=>{S.rep=Math.min(100,S.rep+10);},type:"good"},
    {text:"🚨 Утечка! -15 реп",fn:()=>{S.rep-=15;},type:"bad"},
    {text:"⭐ Инвестор! +$1000",fn:()=>{S.money+=1000;},type:"good"},
    {text:"🐛 Баг! -200",fn:()=>{S.users=Math.max(0,S.users-200);},type:"bad"},
    {text:"🔥 Мем! +2000",fn:()=>{S.users+=2000;},type:"good"},
    {text:"📈 Тренд! +5000",fn:()=>{S.users+=5000;},type:"good"},
    {text:"📉 Отток! -10%",fn:()=>{S.users*=0.9;},type:"bad"},
    {text:"🎁 Спонсор! +$5000",fn:()=>{S.money+=5000;},type:"good"},
    {text:"⚡ DDoS! -20%",fn:()=>{S.money*=0.8;},type:"bad"},
    {text:"📺 Реклама! +3000",fn:()=>{S.users+=3000;},type:"good"},
    {text:"🤝 Партнёрство! +5000",fn:()=>{S.users+=5000;},type:"good"},
    {text:"⚖️ Иск! -$3000",fn:()=>{S.money-=3000;},type:"bad"},
    {text:"🏆 Награда! +20 реп",fn:()=>{S.rep=Math.min(100,S.rep+20);},type:"good"},
    {text:"🌐 Новая страна! +10000",fn:()=>{S.users+=10000;},type:"good"},
    {text:"🚫 Блокировка! -15%",fn:()=>{S.users*=0.85;},type:"bad"},
    {text:"💎 Кристалл!",fn:()=>{S.crystals+=2;},type:"good"},
    {text:"🎯 Заказчик! +$10000",fn:()=>{S.money+=10000;},type:"good"},
    {text:"🌍 Пандемия! +20%",fn:()=>{S.users*=1.2;},type:"good"},
    {text:"📉 Санкции! -10%",fn:()=>{S.money*=0.9;},type:"bad"},
    {text:"⚔️ Война! -5%",fn:()=>{S.users*=0.95;},type:"bad"},
    {text:"💥 Взлом! -$50000",fn:()=>{S.money-=50000;},type:"bad"},
    {text:"🌟 Вирусный ролик! +50000",fn:()=>{S.users+=50000;},type:"good"},
    {text:"🎤 Знаменитость! +100000",fn:()=>{S.users+=100000;},type:"good"},
    {text:"🔥 Пожар! -$20000",fn:()=>{S.money-=20000;},type:"bad"},
    {text:"🎓 Университет! +20 реп",fn:()=>{S.rep=Math.min(100,S.rep+20);},type:"good"},
    {text:"🚀 Космос! +500000",fn:()=>{S.users+=500000;},type:"good"},
    {text:"💎 Алмаз! +5",fn:()=>{S.crystals+=5;},type:"good"},
    {text:"👽 Контакт! +1000000",fn:()=>{S.users+=1000000;},type:"good"},
    {text:"🌈 Чудо! ×2 доход 60с",fn:()=>{S.prestigeMult*=2;setTimeout(()=>{S.prestigeMult/=2;},60000);},type:"good"},
    {text:"🦠 Вирус! -10%",fn:()=>{S.users*=0.9;},type:"bad"},
    {text:"📡 Спутник! +$100000",fn:()=>{S.money+=100000;},type:"good"},
    {text:"🎬 Фильм! +200000",fn:()=>{S.users+=200000;},type:"good"},
    {text:"⚡ Отключение! -$10000",fn:()=>{S.money-=10000;},type:"bad"},
    {text:"🎁 Миллиардер! +$1000000",fn:()=>{S.money+=1000000;},type:"good"},
    {text:"🌪️ Стихия! -20%",fn:()=>{S.users*=0.8;},type:"bad"},
    {text:"💫 Квантовый скачок! +5000000",fn:()=>{S.users+=5000000;},type:"good"},
    {text:"🎆 Праздник! +100000",fn:()=>{S.users+=100000;},type:"good"},
    {text:"🚀 Ракета! +10000000",fn:()=>{S.users+=10000000;},type:"good"},
    {text:"🌌 Параллельная вселенная! +100000000",fn:()=>{S.users+=100000000;},type:"good"},
    {text:"⏳ Временной парадокс! +$10000000",fn:()=>{S.money+=10000000;},type:"good"},
    {text:"🕳️ Чёрная дыра! -30%",fn:()=>{S.users*=0.7;},type:"bad"},
    {text:"🛸 НЛО! +50000000",fn:()=>{S.users+=50000000;},type:"good"},
    {text:"🎩 Фокус! +$1000000",fn:()=>{S.money+=1000000;},type:"good"},
    {text:"🌊 Цунами! -25%",fn:()=>{S.users*=0.75;},type:"bad"},
    {text:"🔥 Вулкан! -$500000",fn:()=>{S.money-=500000;},type:"bad"},
    {text:"⭐ Супернова! +100000000",fn:()=>{S.users+=100000000;},type:"good"},
    {text:"💎 Бриллиант! +10 кристаллов",fn:()=>{S.crystals+=10;},type:"good"},
    {text:"🎊 Юбилей! +$5000000",fn:()=>{S.money+=5000000;},type:"good"},
    {text:"🧬 Эволюция! +50% юзеров",fn:()=>{S.users*=1.5;},type:"good"},
    {text:"🌍 Землетрясение! -15%",fn:()=>{S.users*=0.85;},type:"bad"},
    {text:"🎯 Снайпер! +$2000000",fn:()=>{S.money+=2000000;},type:"good"},
    {text:"🎨 Шедевр! +30 реп",fn:()=>{S.rep=Math.min(100,S.rep+30);},type:"good"},
    {text:"🚀 Космическая гонка! +500000000",fn:()=>{S.users+=500000000;},type:"good"}
];

const BATTLES = [
    {name:"Дуэль с Корпорацией А",reward:50000},{name:"Схватка с Мессенджером Б",reward:80000},
    {name:"Битва со Связью В",reward:30000},{name:"Сражение с Дискурсом Д",reward:60000},
    {name:"Война с Вэй Ж",reward:100000}
];

const CHARACTERS_LIST = [
    {name:"Инвестор №1",role:"Инвестор",desc:"Хочет 30% за $500000"},
    {name:"Техдир",role:"Технический директор",desc:"Гений, но вспыльчивый"},
    {name:"Маркетолог",role:"Маркетолог",desc:"Вирусный гений"},
    {name:"Аноним",role:"Хакер",desc:"Помогает за долю"},
    {name:"Визионер",role:"Визионер",desc:"Предлагает сотрудничество"},
    {name:"Старый программист",role:"Архитектор",desc:"Знает все баги"}
];

const MULTIVERSE_VERSIONS = [
    {name:"Ты-миллиардер",bonus:"+10% доход",req:"1000000000 денег",check:()=>S.money>=1000000000},
    {name:"Ты-президент",bonus:"+20 репутация",req:"100000 репутации",check:()=>S.rep>=100000},
    {name:"Ты-робот",bonus:"+15% технологии",req:"20 технологий",check:()=>S.techs.length>=20},
    {name:"Ты-пришелец",bonus:"+10000 VoxCoin",req:"10000 VoxCoin",check:()=>S.voxCoin>=10000},
    {name:"Ты-кот",bonus:"+удача",req:"1000000 юзеров",check:()=>S.users>=1000000},
    {name:"Ты-бог",bonus:"×2 доход",req:"1 миллиард юзеров",check:()=>S.users>=1000000000}
];

const PRESTIGE_UPGRADES = [
    {id:"fastStart",name:"Быстрый старт",cost:1,desc:"+$5000 при перерождении",max:5},
    {id:"cheaperTech",name:"Дешёвые технологии",cost:2,desc:"-10% цена технологий",max:5},
    {id:"moreIncome",name:"Больше дохода",cost:3,desc:"+25% к доходу",max:5},
    {id:"moreGrowth",name:"Быстрый рост",cost:3,desc:"+20% к росту юзеров",max:5}
];

const SEASONS = {
    0:{name:"Новый год",emoji:"🎄",effect:"+20% доход",mult:1.2},
    1:{name:"Зима",emoji:"❄️",effect:"Обычный",mult:1.0},
    2:{name:"Весна",emoji:"🌸",effect:"Обычный",mult:1.0},
    3:{name:"Пасха",emoji:"🐣",effect:"+10% доход",mult:1.1},
    4:{name:"Весна",emoji:"🌷",effect:"Обычный",mult:1.0},
    5:{name:"Лето",emoji:"☀️",effect:"+15% доход",mult:1.15},
    6:{name:"Лето",emoji:"🏖️",effect:"+15% доход",mult:1.15},
    7:{name:"Лето",emoji:"🌊",effect:"+10% доход",mult:1.1},
    8:{name:"Осень",emoji:"🍂",effect:"Обычный",mult:1.0},
    9:{name:"Хэллоуин",emoji:"🎃",effect:"+25% доход",mult:1.25},
    10:{name:"Осень",emoji:"🍁",effect:"Обычный",mult:1.0},
    11:{name:"Новый год",emoji:"🎄",effect:"+30% доход",mult:1.3}
};

const MONTH_NAMES = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];

function updateDeviceInfo(){
    try {
        const el = document.getElementById("device-info");
        if(el) el.textContent = deviceType === "mobile" ? "📱 Телефон" : "🖥️ ПК";
    } catch(e){}
}

function show(id){
    try {
        if(!gameCreated && id !== "screen-start" && id !== "screen-create" && id !== "screen-settings") {
            document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
            document.getElementById("screen-start").classList.add("active");
            return;
        }
        document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
        const el = document.getElementById(id);
        if(el) el.classList.add("active");
        window.scrollTo(0,0);
        if(id==="screen-tasks") renderTasks();
        if(id==="screen-events") renderEvents();
        if(id==="screen-tech") renderTechs();
        if(id==="screen-staff") renderStaff();
        if(id==="screen-servers") renderServers();
        if(id==="screen-achieve") renderAchievements();
        if(id==="screen-depts") renderDepts();
        if(id==="screen-company") renderCompany();
        if(id==="screen-skills") renderSkills();
        if(id==="screen-quests") renderQuests();
        if(id==="screen-crystals") renderCrystalShop();
        if(id==="screen-stocks") renderStocks();
        if(id==="screen-crypto") renderCrypto();
        if(id==="screen-investors") renderInvestors();
        if(id==="screen-comp") renderComp();
        if(id==="screen-rank") renderRank();
        if(id==="screen-koll") renderKoll();
        if(id==="screen-stats") { drawChart(); renderForecast(); renderDetails(); }
        if(id==="screen-prestige") renderPrestige();
        if(id==="screen-world") renderWorld();
        if(id==="screen-bots") renderBots();
        if(id==="screen-battle") renderBattle();
        if(id==="screen-boss") renderBoss();
        if(id==="screen-exchange") renderExchange();
        if(id==="screen-offshore") renderOffshore();
        if(id==="screen-unions") renderUnions();
        if(id==="screen-story") renderStory();
        if(id==="screen-characters") renderCharacters();
        if(id==="screen-friends") renderFriends();
        if(id==="screen-mini") renderMini();
        if(id==="screen-multiverse") renderMultiverse();
        if(id==="screen-visual") renderVisual();
        if(id==="screen-profile") renderProfile();
        if(id==="screen-settings") { renderSettings(); updateDeviceInfo(); }
        if(id==="screen-seasons") renderSeasons();
        if(id==="screen-prestige-upgrades") renderPrestigeUpgrades();
    } catch(e){ console.log(e); }
}

function backFromSettings(){
    if(gameCreated) show("screen-main");
    else show("screen-start");
}

function notify(text,color){
    if(!S.settings.notify) return;
    try {
        const n = document.createElement("div");
        n.className = "notify";
        n.style.borderLeftColor = color || "#10b981";
        n.textContent = text;
        document.body.appendChild(n);
        setTimeout(()=>n.remove(), 3000);
    } catch(e){}
}

function beep(freq,dur){
    if(!S.settings.sound) return;
    try{
        const ctx = new (window.AudioContext||window.webkitAudioContext)();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq; o.type = "sine";
        g.gain.setValueAtTime(0.05, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        o.start(); o.stop(ctx.currentTime + dur);
    }catch(e){}
}

function playMusic(){
    if(!S.settings.music) return;
    try {
        if(window._musicTimer) clearInterval(window._musicTimer);
        window._musicTimer = setInterval(()=>{
            if(!S.settings.music) return;
            const notes = [262,294,330,349,392,440,494,523];
            const n = notes[Math.floor(Math.random()*notes.length)];
            beep(n, 0.15);
        }, 3000);
    } catch(e){}
}

function confetti(){
    if(!S.settings.confetti) return;
    for(let i=0;i<30;i++){
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = Math.random()*100 + "vw";
        c.style.top = "-20px";
        c.style.background = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444"][Math.floor(Math.random()*5)];
        document.body.appendChild(c);
        setTimeout(()=>c.remove(), 3000);
    }
}

function coinFloat(){
    if(!S.settings.coins) return;
    const c = document.createElement("div");
    c.className = "coin"; c.textContent = "💰";
    c.style.left = (Math.random()*80+10) + "vw";
    c.style.top = "50vh";
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 1500);
}

function addLog(text,type){
    S.log.unshift({text, time:new Date().toLocaleTimeString(), type:type||""});
    if(S.log.length>50) S.log.pop();
}

function updateUI(){
    try {
        document.getElementById("header-logo").textContent = S.logo || "💬";
        document.getElementById("header-name").textContent = S.name || "Мессенджер";
        document.getElementById("header-level").textContent = "Lv." + Math.floor(safeNumber(S.level,1));
        document.getElementById("header-crystals").textContent = "💎 " + Math.floor(safeNumber(S.crystals,0));
        document.getElementById("stat-users").textContent = formatNum(S.users);
        document.getElementById("stat-money").textContent = "$" + formatNum(S.money);
        document.getElementById("stat-rep").textContent = Math.floor(safeNumber(S.rep,50));
        document.getElementById("stat-income").textContent = "$" + calcIncome().toFixed(1);
        document.getElementById("app").style.borderTop = "4px solid " + (S.color || "#3b82f6");
        let pct = Math.min(100, (safeNumber(S.users,0) / 1000000) * 100);
        document.getElementById("progress-bar").style.width = pct + "%";
        let xpNeed = safeNumber(S.level,1) * 100;
        document.getElementById("xp-bar").style.width = Math.min(100, (safeNumber(S.xp,0) / xpNeed) * 100) + "%";
    } catch(e){}
}

function formatNum(n){
    n = safeNumber(n,0);
    if(n >= 1000000000000) return (n/1000000000000).toFixed(2) + "T";
    if(n >= 1000000000) return (n/1000000000).toFixed(2) + "B";
    if(n >= 1000000) return (n/1000000).toFixed(2) + "M";
    if(n >= 1000) return (n/1000).toFixed(2) + "K";
    return Math.floor(n).toString();
}

function getSeasonMult(){
    const m = new Date().getMonth();
    const season = SEASONS[m];
    return season ? season.mult : 1;
}

function calcIncome(){
    try {
        const diff = DIFFICULTY[S.difficulty] || DIFFICULTY.medium;
        const seasonMult = getSeasonMult();
        const prestigeFast = 1 + (S.prestigeUpgrades.moreIncome || 0) * 0.25;
        let base = safeNumber(S.users,0) * 0.02 * (1 - safeNumber(S.inflation,0)) * diff.incomeMult * seasonMult * prestigeFast;
        let staffBonus = 0;
        S.staff.forEach(id=>{
            const s = STAFF.find(x=>x.id===id);
            const data = S.staffLevels[id];
            if(s && data){
                const lvl = safeNumber(data.level,1);
                const ch = data.char || "normal";
                const chMult = CHARACTERS.find(c=>c.id===ch)?.mult || 1;
                const vac = S.staffVacation[id] ? 0.3 : 1;
                const train = S.staffTraining[id] ? 1.5 : 1;
                staffBonus += s.income * lvl * chMult * vac * train;
            }
        });
        let stockBonus = (S.stocks.own?.owned||0)*0.5 + (S.stocks.comp?.owned||0)*2.5 + (S.stocks.index?.owned||0)*5;
        let skillMult = 1 + safeNumber(S.skills?.profit,0) * 0.1;
        let companyMult = 1;
        if(S.company.office) companyMult *= 1.2;
        if(S.company.board) companyMult *= 1.15;
        if(S.company.ipo) stockBonus += 5000;
        if(S.company.franchise) staffBonus += 500;
        if(S.deposit) stockBonus += S.deposit * 0.01;
        if(S.bonds) stockBonus += S.bonds * 0.02;
        if(S.bots.length) stockBonus += S.bots.length * 10;
        const refMult = 1 + S.referrals * 0.1;
        return (base + staffBonus + stockBonus) * safeNumber(S.prestigeMult,1) * skillMult * companyMult * refMult;
    } catch(e){ return 0; }
}

function renderSettings(){
    try {
        ["sound","music","coins","confetti","notify","events","autosave","autotheme","fontbig"].forEach(k=>{
            const el = document.getElementById("tgl-"+k);
            if(el) el.className = "toggle" + (S.settings[k] ? " on" : "");
        });
        ["easy","medium","hard"].forEach(d=>{
            const el = document.getElementById("diff-"+d);
            if(el) el.className = "diff-btn" + (S.difficulty === d ? " active" : "");
        });
        const h = document.getElementById("diff-hint");
        if(h) h.textContent = DIFFICULTY[S.difficulty].desc;
        const t = document.getElementById("tgl-theme");
        if(t) t.className = "toggle" + (S.light ? " on" : "");
    } catch(e){}
}
function toggleSetting(key){
    S.settings[key] = !S.settings[key];
    if(key==="music" && S.settings.music) playMusic();
    if(key==="autotheme"){
        if(S.settings.autotheme){
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            S.light = !isDark;
        }
        document.body.classList.toggle("light", S.light);
    }
    if(key==="fontbig"){
        document.body.classList.toggle("font-big", S.settings.fontbig);
    }
    saveNow(); renderSettings();
}
function setDifficulty(d){ S.difficulty = d; notify("🎚️ " + DIFFICULTY[d].desc, "#06b6d4"); saveNow(); renderSettings(); }

function renderDetails(){
    try {
        const el = document.getElementById("details-list");
        if(!el) return;
        el.innerHTML = "";
        const details = [
            {label:"Технологий", value: S.techs.length + "/" + TECHS.length},
            {label:"Сотрудников", value: S.staff.length + "/" + STAFF.length},
            {label:"Серверов", value: S.servers.length + "/" + SERVERS.length},
            {label:"Отделов", value: Object.keys(S.depts).length + "/" + DEPTS.length},
            {label:"Стран", value: S.countries.filter(c=>c.unlocked).length + "/20"},
            {label:"Достижений", value: S.achievements.length + "/" + ACHIEVEMENTS.length},
            {label:"Квестов", value: S.questIndex + "/" + QUESTS.length},
            {label:"Ботов", value: S.bots.length + "/" + BOTS.length},
            {label:"Битв", value: S.battlesWon},
            {label:"Боссов", value: S.bossLevel-1},
            {label:"Кристаллов", value: Math.floor(S.crystals)},
            {label:"Престиж", value: S.prestige},
            {label:"Множитель", value: "×" + safeNumber(S.prestigeMult,1).toFixed(2)},
            {label:"Рефералов", value: S.referrals},
            {label:"Сложность", value: DIFFICULTY[S.difficulty].desc.split(":")[0]},
            {label:"Режим", value: S.mode},
            {label:"Пасхалок", value: S.easterEggsFound.length + "/40"},
            {label:"Устройство", value: deviceType === "mobile" ? "📱 Телефон" : "🖥️ ПК"},
            {label:"Время", value: Math.floor(S.playtime/60) + " мин"}
        ];
        details.forEach(d=>{
            const div = document.createElement("div");
            div.className = "detail-row";
            div.innerHTML = `<span class="label">${d.label}</span><span class="value">${d.value}</span>`;
            el.appendChild(div);
        });
    } catch(e){}
}

function renderTechs(){
    try {
        const list = document.getElementById("tech-list");
        list.innerHTML = "";
        const discount = 1 - safeNumber(S.skills?.speed,0) * 0.05 - (S.prestigeUpgrades.cheaperTech || 0) * 0.1;
        const diff = DIFFICULTY[S.difficulty] || DIFFICULTY.medium;
        TECHS.forEach(t=>{
            const owned = S.techs.includes(t.id);
            const realCost = Math.floor(t.cost * discount * diff.costMult);
            const canBuy = S.money >= realCost && !owned;
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<div class="item-info"><div class="item-name">${t.name}</div><div class="item-cost">$${formatNum(realCost)} • +${formatNum(t.users)}</div></div>`;
            const btn = document.createElement("button");
            btn.textContent = owned ? "✓" : "Купить";
            btn.disabled = owned || !canBuy;
            if(!owned && canBuy) btn.onclick = ()=>buyTech(t, realCost);
            div.appendChild(btn);
            list.appendChild(div);
        });
    } catch(e){}
}
function buyTech(t, realCost){
    if(S.money < realCost || S.techs.includes(t.id)) return;
    S.money -= realCost; S.users += t.users; S.techs.push(t.id);
    addXp(20); notify("✅ " + t.name); beep(600, 0.15); coinFloat();
    saveNow(); updateUI(); renderTechs();
}

function renderStaff(){
    try {
        const list = document.getElementById("staff-list");
        list.innerHTML = "";
        const allMax = S.staff.length === STAFF.length && S.staff.every(id=>S.staffLevels[id] && S.staffLevels[id].level===3);
        document.getElementById("team-status").textContent = S.staff.length + "/" + STAFF.length + (allMax ? " 🏆" : "");
        STAFF.forEach(s=>{
            const hired = S.staff.includes(s.id);
            const data = S.staffLevels[s.id];
            const lvl = data ? data.level : 1;
            const ch = data ? data.char : "normal";
            const chData = CHARACTERS.find(c=>c.id===ch) || CHARACTERS[1];
            const upgradeCost = Math.floor(s.cost * 2 * lvl);
            const canBuy = S.money >= s.cost && !hired;
            const canUpgrade = hired && lvl < 3 && S.money >= upgradeCost;
            const div = document.createElement("div");
            div.className = "item";
            div.style.flexDirection = "column";
            div.style.alignItems = "stretch";
            div.innerHTML = `<div class="item-info"><div class="item-name">${s.name} ${hired?"[Lv."+lvl+"/3]":""} ${hired?'<span class="tag '+chData.tag+'">'+chData.name+'</span>':''}</div><div class="item-cost">${hired ? "+" + (s.income*lvl*chData.mult).toFixed(1) + "$/сек" : "$" + s.cost}</div></div><div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">${!hired ? `<button style="flex:1;padding:4px;font-size:10px;" onclick="hireStaff('${s.id}')" ${!canBuy?'disabled':''}>Нанять</button>` : ''}${hired && lvl<3 ? `<button style="flex:1;padding:4px;font-size:10px;" onclick="upgradeStaff('${s.id}')" ${!canUpgrade?'disabled':''}>↑</button>` : ''}${hired && lvl>=3 ? `<button style="flex:1;padding:4px;font-size:10px;" disabled>MAX</button>` : ''}${hired ? `<button style="flex:1;padding:4px;font-size:10px;background:#dc2626;" onclick="fireStaff('${s.id}')">🚪</button>` : ''}</div>`;
            list.appendChild(div);
        });
    } catch(e){}
}
function hireStaff(id){
    const s = STAFF.find(x=>x.id===id);
    if(!s || S.money < s.cost || S.staff.includes(id)) return;
    S.money -= s.cost; S.staff.push(id);
    const ch = CHARACTERS[Math.floor(Math.random()*CHARACTERS.length)].id;
    S.staffLevels[id] = {level:1, char:ch};
    S.users += s.users; addXp(30);
    notify("👥 " + s.name, "#3b82f6"); beep(500, 0.15);
    saveNow(); updateUI(); renderStaff();
}
function upgradeStaff(id){
    const s = STAFF.find(x=>x.id===id);
    const data = S.staffLevels[id];
    if(!s || !data || data.level >= 3) return;
    const cost = Math.floor(s.cost * 2 * data.level);
    if(S.money < cost) return;
    S.money -= cost; data.level++;
    addXp(20); notify("⬆️ " + s.name, "#8b5cf6"); beep(700, 0.2);
    saveNow(); updateUI(); renderStaff();
}
function fireStaff(id){
    const s = STAFF.find(x=>x.id===id);
    if(!s || !S.staff.includes(id)) return;
    if(!confirm("Уволить " + s.name + "?")) return;
    S.money += Math.floor(s.cost * 0.5);
    S.staff = S.staff.filter(x=>x!==id);
    delete S.staffLevels[id];
    notify("🚪 Уволен: " + s.name, "#ef4444");
    saveNow(); updateUI(); renderStaff();
}

function renderServers(){
    try {
        const list = document.getElementById("server-list");
        list.innerHTML = "";
        SERVERS.forEach(sv=>{
            const owned = S.servers.includes(sv.id);
            const canBuy = S.money >= sv.cost && !owned;
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<div class="item-info"><div class="item-name">${sv.name}</div><div class="item-cost">$${formatNum(sv.cost)} • до ${formatNum(sv.maxUsers)}</div></div>`;
            const btn = document.createElement("button");
            btn.textContent = owned ? "✓" : "Купить";
            btn.disabled = owned || !canBuy;
            if(!owned && canBuy) btn.onclick = ()=>{ S.money -= sv.cost; S.servers.push(sv.id); addXp(40); notify("🖥️ " + sv.name, "#8b5cf6"); saveNow(); updateUI(); renderServers(); };
            div.appendChild(btn);
            list.appendChild(div);
        });
    } catch(e){}
}

function renderDepts(){
    try {
        const list = document.getElementById("dept-list");
        list.innerHTML = "";
        DEPTS.forEach(d=>{
            const owned = S.depts[d.id];
            const canBuy = S.money >= d.cost && !owned;
            const div = document.createElement("div");
            div.className = "dept";
            div.innerHTML = `<div><b>${d.name}</b><br><span style="color:#94a3b8;font-size:10px;">${d.effect}</span></div>`;
            const btn = document.createElement("button");
            btn.textContent = owned ? "✓" : "$" + formatNum(d.cost);
            btn.disabled = owned || !canBuy;
            if(!owned && canBuy) btn.onclick = ()=>{ S.money -= d.cost; S.depts[d.id] = true; addXp(50); notify("🏢 " + d.name, "#8b5cf6"); saveNow(); updateUI(); renderDepts(); };
            div.appendChild(btn);
            list.appendChild(div);
        });
    } catch(e){}
}

function getCompanyValue(){ return Math.floor(safeNumber(S.users,0) + safeNumber(S.money,0) + S.techs.length * 5000 + S.staff.length * 10000 + S.company.offices * 100000); }
function getCompanyLevel(){
    const v = getCompanyValue();
    if(v < 10000) return "Малый стартап";
    if(v < 100000) return "Растущая компания";
    if(v < 500000) return "Средний бизнес";
    if(v < 2000000) return "Крупная компания";
    if(v < 10000000) return "Международная корпорация";
    if(v < 1000000000) return "Глобальная империя";
    return "Легенда";
}
function renderCompany(){
    try {
        document.getElementById("company-level").textContent = getCompanyLevel();
        document.getElementById("company-value").textContent = "$" + formatNum(getCompanyValue());
        document.getElementById("company-offices").textContent = S.company.offices || 0;
        const list = document.getElementById("company-list");
        list.innerHTML = "";
        COMPANY_UPGRADES.forEach(c=>{
            const owned = S.company[c.id];
            const canBuy = S.money >= c.cost && !owned;
            const div = document.createElement("div");
            div.className = "dept";
            div.innerHTML = `<div><b>${c.name}</b><br><span style="color:#94a3b8;font-size:10px;">${c.desc}</span></div>`;
            const btn = document.createElement("button");
            btn.textContent = owned ? "✓" : "$" + formatNum(c.cost);
            btn.disabled = owned || !canBuy;
            if(!owned && canBuy) btn.onclick = ()=>{
                S.money -= c.cost;
                if(c.id === "office"){ S.company.offices = (S.company.offices || 0) + 1; S.company.office = true; }
                else if(c.id === "absorb"){ S.company.absorbed = (S.company.absorbed || 0) + 1; S.users += 50000; }
                else { S.company[c.id] = true; }
                addXp(100); notify("💼 " + c.name, "#8b5cf6"); confetti(); saveNow(); updateUI(); renderCompany();
            };
            div.appendChild(btn);
            list.appendChild(div);
        });
    } catch(e){}
}
function absorbMessenger(){
    if(S.money < 100000){ notify("Нужно $100000", "#ef4444"); return; }
    S.money -= 100000; S.users += 50000; notify("🛒 +50000", "#8b5cf6");
    saveNow(); updateUI(); renderCompany();
}
function exportReport(){
    try {
        const text = `ОТЧЁТ: "${S.name}"\nЮзеры: ${Math.floor(S.users)}\nДеньги: $${Math.floor(S.money)}\nТехнологий: ${S.techs.length}/${TECHS.length}\nСотрудников: ${S.staff.length}/${STAFF.length}\nУровень: ${S.level}\nПрестиж: ${S.prestige}\nРефералов: ${S.referrals}\nУстройство: ${deviceType === "mobile" ? "Телефон" : "ПК"}`;
        const blob = new Blob([text], {type:"text/plain"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "report.txt"; a.click();
        notify("📤 Скачано", "#10b981");
    } catch(e){ notify("Ошибка", "#ef4444"); }
}

function renderSkills(){
    try {
        const list = document.getElementById("skill-list");
        list.innerHTML = "";
        SKILLS.forEach(sk=>{
            const lvl = S.skills[sk.id] || 0;
            const cost = sk.cost * (lvl + 1);
            const canBuy = S.money >= cost && lvl < sk.maxLevel;
            const div = document.createElement("div");
            div.className = "skill";
            div.innerHTML = `<div><b>${sk.name}</b> [${lvl}/${sk.maxLevel}]<br><span style="color:#94a3b8;font-size:10px;">${sk.effect}</span></div>`;
            const btn = document.createElement("button");
            btn.textContent = lvl >= sk.maxLevel ? "MAX" : "$" + formatNum(cost);
            btn.disabled = !canBuy || lvl >= sk.maxLevel;
            if(canBuy && lvl < sk.maxLevel) btn.onclick = ()=>{ S.money -= cost; S.skills[sk.id] = (S.skills[sk.id] || 0) + 1; addXp(30); notify("🌳 " + sk.name, "#10b981"); saveNow(); updateUI(); renderSkills(); };
            div.appendChild(btn);
            list.appendChild(div);
        });
    } catch(e){}
}

function renderQuests(){
    try {
        const list = document.getElementById("quest-list");
        list.innerHTML = "";
        QUESTS.forEach((q,i)=>{
            const done = S.questIndex > i;
            const active = S.questIndex === i;
            const div = document.createElement("div");
            div.className = "quest" + (done ? " done" : "");
            div.innerHTML = `<b>${done?"✅":active?"⚡":"🔒"} ${q.name}</b><br><span style="color:#94a3b8;font-size:10px;">${q.desc}</span><br><span class="badge">+$${formatNum(q.reward)}</span> <span class="badge badge-crystal">+💎${q.crystals}</span>`;
            list.appendChild(div);
        });
    } catch(e){}
}
function checkQuests(){
    try {
        if(S.questIndex >= QUESTS.length) return;
        const q = QUESTS[S.questIndex];
        if(q.check()){
            S.money += q.reward; S.crystals += q.crystals; S.questIndex++;
            notify("🎯 " + q.name, "#ec4899"); confetti(); beep(900, 0.3); saveNow();
        }
    } catch(e){}
}

function renderCrystalShop(){
    try {
        document.getElementById("crystal-balance").textContent = Math.floor(safeNumber(S.crystals,0));
        const list = document.getElementById("crystal-shop");
        list.innerHTML = "";
        CRYSTAL_SHOP.forEach(item=>{
            const canBuy = S.crystals >= item.cost;
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<div class="item-info"><div class="item-name">${item.name}</div><div class="item-cost">💎 ${item.cost}</div></div>`;
            const btn = document.createElement("button");
            btn.textContent = "Купить"; btn.disabled = !canBuy;
            if(canBuy) btn.onclick = ()=>{ S.crystals -= item.cost; item.action(); notify("💎 " + item.name, "#06b6d4"); confetti(); saveNow(); updateUI(); renderCrystalShop(); };
            div.appendChild(btn);
            list.appendChild(div);
        });
    } catch(e){}
}

function renderStocks(){
    try {
        const list = document.getElementById("stocks-list");
        list.innerHTML = "";
        [{key:"own",name:"Свои акции"},{key:"comp",name:"Конкуренты"},{key:"index",name:"Индекс"}].forEach(s=>{
            const data = S.stocks[s.key];
            const div = document.createElement("div");
            div.className = "item";
            div.style.flexDirection = "column";
            div.style.alignItems = "stretch";
            div.innerHTML = `<div class="item-info"><div class="item-name">${s.name}</div><div class="item-cost">$${data.price.toFixed(2)} • ${data.owned}</div></div><div style="display:flex;gap:4px;margin-top:4px;"><button style="flex:1;padding:4px;font-size:10px;" onclick="buyStock('${s.key}')">Купить</button><button style="flex:1;padding:4px;font-size:10px;" onclick="sellStock('${s.key}')">Продать</button></div>`;
            list.appendChild(div);
        });
    } catch(e){}
}
function buyStock(key){
    const st = S.stocks[key];
    if(S.money < st.price){ notify("Не хватает", "#ef4444"); return; }
    S.money -= st.price; st.owned++;
    notify("📈 Куплено", "#10b981"); saveNow(); updateUI(); renderStocks();
}
function sellStock(key){
    const st = S.stocks[key];
    if(st.owned <= 0){ notify("Нет", "#ef4444"); return; }
    S.money += st.price; st.owned--;
    notify("📉 Продано", "#ef4444"); saveNow(); updateUI(); renderStocks();
}

function renderCrypto(){
    try {
        const list = document.getElementById("crypto-list");
        list.innerHTML = "";
        Object.keys(S.cryptos).forEach(sym=>{
            const c = S.cryptos[sym];
            const div = document.createElement("div");
            div.className = "crypto-item";
            div.innerHTML = `<div class="crypto-name">${sym}</div><div class="crypto-price">$${c.price.toFixed(6)} | ${c.owned}</div><div class="crypto-buttons"><button onclick="buyCrypto('${sym}')">+1</button><button onclick="sellCrypto('${sym}')">Продать</button><button onclick="mineCrypto('${sym}')">⛏️</button></div>`;
            list.appendChild(div);
        });
    } catch(e){}
}
function buyCrypto(sym){
    const c = S.cryptos[sym];
    if(S.money < c.price){ notify("Не хватает", "#ef4444"); return; }
    S.money -= c.price; c.owned += 1;
    notify("🪙 +1 " + sym, "#10b981"); saveNow(); updateUI(); renderCrypto();
}
function sellCrypto(sym){
    const c = S.cryptos[sym];
    if(c.owned <= 0){ notify("Нет", "#ef4444"); return; }
    const sum = c.owned * c.price;
    S.money += sum; c.owned = 0;
    notify("🪙 +$" + sum.toFixed(2), "#10b981"); saveNow(); updateUI(); renderCrypto();
}
function mineCrypto(sym){
    if(Math.random() < 0.4){
        const amount = Math.floor(Math.random() * 3) + 1;
        S.cryptos[sym].owned += amount;
        notify("⛏️ +" + amount + " " + sym, "#10b981");
    } else notify("⛏️ Пусто", "#94a3b8");
    saveNow(); renderCrypto();
}

function renderInvestors(){
    try {
        const list = document.getElementById("investor-list");
        list.innerHTML = "";
        if(S.investors.length === 0){
            list.innerHTML = "<p style='font-size:11px;'>Инвесторов нет. Придут при 10000 юзеров.</p>";
        } else {
            S.investors.forEach((inv, i)=>{
                const div = document.createElement("div");
                div.className = "item";
                div.innerHTML = `<div class="item-info"><div class="item-name">${inv.name}</div><div class="item-cost">$${formatNum(inv.offer)} за ${(inv.share*100)}%</div></div>`;
                const btn = document.createElement("button");
                btn.textContent = "Взять";
                btn.onclick = ()=>{ S.money += inv.offer; S.prestigeMult *= (1 - inv.share); S.investors.splice(i, 1); notify("💼 +$" + formatNum(inv.offer), "#10b981"); saveNow(); updateUI(); renderInvestors(); };
                div.appendChild(btn);
                list.appendChild(div);
            });
        }
        const takeBtn = document.createElement("button");
        takeBtn.textContent = "📞 Найти инвестора";
        takeBtn.onclick = ()=>{
            if(S.users < 10000){ notify("Нужно 10000 юзеров", "#ef4444"); return; }
            const t = INVESTOR_TYPES[Math.floor(Math.random()*INVESTOR_TYPES.length)];
            const offer = t.minOffer + Math.floor(Math.random()*t.minOffer);
            S.investors.push({name:t.name, offer, share:t.share});
            notify("💼 " + t.name, "#8b5cf6"); saveNow(); renderInvestors();
        };
        list.appendChild(takeBtn);
    } catch(e){}
}

function renderComp(){
    try {
        const list = document.getElementById("comp-list");
        list.innerHTML = "";
        S.competitors.forEach(c=>{
            const div = document.createElement("div");
            div.className = "comp-bar";
            div.innerHTML = `<span class="name">${c.name}</span><span class="num">${formatNum(c.users)}</span>`;
            list.appendChild(div);
        });
        const you = document.createElement("div");
        you.className = "comp-bar you";
        you.innerHTML = `<span class="name">💬 ${S.name} (ТЫ)</span><span class="num">${formatNum(S.users)}</span>`;
        list.appendChild(you);
    } catch(e){}
}

function renderRank(){
    try {
        const list = document.getElementById("rank-list");
        list.innerHTML = "";
        [{name:"🥇 Юзеры", value:formatNum(S.users), cls:"gold"},
         {name:"🥈 Деньги", value:"$"+formatNum(S.money), cls:"silver"},
         {name:"🥉 Доход/сек", value:"$"+Math.floor(calcIncome()), cls:"bronze"}].forEach(r=>{
            const div = document.createElement("div");
            div.className = "rank " + r.cls;
            div.innerHTML = `<span>${r.name}</span><span>${r.value}</span>`;
            list.appendChild(div);
        });
    } catch(e){}
}

function renderKoll(){
    try {
        const iconsEl = document.getElementById("koll-icons");
        const themesEl = document.getElementById("koll-themes");
        const stickersEl = document.getElementById("koll-stickers");
        const logoEl = document.getElementById("logo-picker");
        iconsEl.innerHTML = ""; themesEl.innerHTML = ""; stickersEl.innerHTML = ""; logoEl.innerHTML = "";
        KOLL_ICONS.forEach(ic=>{
            const owned = S.koll.icons.includes(ic);
            const div = document.createElement("div");
            div.className = "koll-item" + (owned ? " owned" : " locked");
            div.textContent = ic;
            if(!owned && S.money >= 1000) div.onclick = ()=>{ S.money -= 1000; S.koll.icons.push(ic); saveNow(); updateUI(); renderKoll(); };
            iconsEl.appendChild(div);
        });
        KOLL_THEMES.forEach(t=>{
            const owned = S.koll.themes.includes(t);
            const div = document.createElement("div");
            div.className = "koll-item" + (owned ? " owned" : " locked");
            div.textContent = t[0];
            if(!owned && S.money >= 2000) div.onclick = ()=>{ S.money -= 2000; S.koll.themes.push(t); saveNow(); updateUI(); renderKoll(); };
            themesEl.appendChild(div);
        });
        ALL_STICKERS.forEach(s=>{
            const owned = S.koll.stickers.includes(s);
            const div = document.createElement("div");
            div.className = "koll-item" + (owned ? " owned" : " locked");
            div.textContent = s;
            if(!owned && S.crystals >= 2) div.onclick = ()=>{ S.crystals -= 2; S.koll.stickers.push(s); saveNow(); updateUI(); renderKoll(); };
            stickersEl.appendChild(div);
        });
        ALL_LOGOS.forEach(lg=>{
            const owned = S.koll.unlockedLogos.includes(lg);
            const div = document.createElement("div");
            div.className = "logo-item" + (S.logo === lg ? " active" : "") + (owned ? "" : " locked");
            div.textContent = lg;
            div.style.opacity = owned ? "1" : "0.3";
            if(owned) div.onclick = ()=>{ S.logo = lg; saveNow(); updateUI(); renderKoll(); };
            else if(S.crystals >= 3) div.onclick = ()=>{ S.crystals -= 3; S.koll.unlockedLogos.push(lg); saveNow(); updateUI(); renderKoll(); };
            logoEl.appendChild(div);
        });
    } catch(e){}
}

function renderWorld(){
    try {
        const list = document.getElementById("country-list");
        list.innerHTML = "";
        S.countries.forEach((c,i)=>{
            const div = document.createElement("div");
            div.className = "country" + (c.unlocked ? "" : " locked");
            div.innerHTML = `<div>${c.unlocked?"🟢":"🔒"} <b>${c.name}</b></div>`;
            if(!c.unlocked){
                const cost = 50000 * (i+1);
                const btn = document.createElement("button");
                btn.textContent = "$" + formatNum(cost);
                btn.disabled = S.money < cost;
                btn.onclick = ()=>{ if(S.money >= cost){ S.money -= cost; c.unlocked = true; saveNow(); updateUI(); renderWorld(); }};
                div.appendChild(btn);
            }
            list.appendChild(div);
        });
        document.getElementById("current-weather").textContent = S.weather;
    } catch(e){}
}
function changeWeather(){
    const w = ["Ясно","Дождь","Снег","Гроза","Туман","Ветер"];
    S.weather = w[Math.floor(Math.random()*w.length)];
    notify("🌦️ " + S.weather, "#06b6d4"); saveNow(); renderWorld();
}

function renderBots(){
    try {
        const list = document.getElementById("bots-list");
        list.innerHTML = "";
        BOTS.forEach(b=>{
            const owned = S.bots.includes(b.id);
            const canBuy = S.money >= b.cost && !owned;
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<div class="item-info"><div class="item-name">${b.name}</div><div class="item-cost">$${formatNum(b.cost)} • ${b.desc}</div></div>`;
            const btn = document.createElement("button");
            btn.textContent = owned ? "✓" : "Купить";
            btn.disabled = owned || !canBuy;
            if(!owned && canBuy) btn.onclick = ()=>{ S.money -= b.cost; S.bots.push(b.id); notify("🤖 " + b.name, "#3b82f6"); saveNow(); updateUI(); renderBots(); };
            div.appendChild(btn);
            list.appendChild(div);
        });
    } catch(e){}
}

function renderBattle(){
    try {
        const list = document.getElementById("battle-list");
        list.innerHTML = "";
        BATTLES.forEach(b=>{
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<div class="item-info"><div class="item-name">${b.name}</div><div class="item-cost">Награда: $${formatNum(b.reward)}</div></div>`;
            const btn = document.createElement("button");
            btn.textContent = "В бой!";
            btn.disabled = S.users < 10000;
            btn.onclick = ()=>{
                const power = S.users * (1 + S.techs.length * 0.1);
                if(Math.random() < Math.min(0.9, power / 1000000)){
                    S.money += b.reward; S.battlesWon++; S.users += Math.floor(S.users * 0.05);
                    notify("⚔️ Победа! +$" + formatNum(b.reward), "#10b981"); confetti();
                } else {
                    S.users = Math.floor(S.users * 0.95);
                    notify("⚔️ Поражение", "#ef4444");
                }
                saveNow(); updateUI(); renderBattle();
            };
            div.appendChild(btn);
            list.appendChild(div);
        });
    } catch(e){}
}

function renderBoss(){
    try {
        const el = document.getElementById("boss-content");
        el.innerHTML = `<div class="boss-card"><div style="font-size:36px;">👹</div><div style="font-weight:700;">Босс уровня ${S.bossLevel}</div><div style="font-size:11px;">HP: ${formatNum(S.bossHP)}</div><div class="boss-hp"><div class="boss-hp-bar" style="width:${Math.min(100, S.bossHP/(S.bossLevel*1000)*100)}%"></div></div></div><button onclick="attackBoss()">⚔️ Атаковать</button>`;
    } catch(e){}
}
function attackBoss(){
    const dmg = Math.floor(S.users * 0.01);
    if(dmg <= 0){ notify("Нужны юзеры", "#ef4444"); return; }
    S.bossHP -= dmg;
    if(S.bossHP <= 0){
        S.bossLevel++; S.bossHP = S.bossLevel * 1000;
        S.money += S.bossLevel * 100000; S.crystals += 5;
        notify("👹 Победа! +💎5", "#f59e0b"); confetti();
    } else notify("⚔️ Урон: " + formatNum(dmg), "#dc2626");
    saveNow(); updateUI(); renderBoss();
}

function renderExchange(){
    try {
        const list = document.getElementById("exchange-list");
        list.innerHTML = "";
        S.competitors.slice(0, 10).forEach((c,i)=>{
            const price = c.users / 1000000;
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<div class="item-info"><div class="item-name">${c.name}</div><div class="item-cost">$${price.toFixed(2)}</div></div>`;
            const btn = document.createElement("button");
            btn.textContent = "Купить";
            btn.onclick = ()=>{ if(S.money >= price){ S.money -= price; S.stocks.comp.owned++; notify("📊 Куплено", "#10b981"); saveNow(); updateUI(); renderExchange(); }};
            div.appendChild(btn);
            list.appendChild(div);
        });
    } catch(e){}
}

function buyLottery(){
    if(S.money < 100){ notify("Нужно $100", "#ef4444"); return; }
    S.money -= 100;
    if(Math.random() < 0.05){
        const win = 100 + Math.floor(Math.random() * 100000);
        S.money += win;
        notify("🎉 +$" + formatNum(win), "#f59e0b"); confetti();
    } else notify("😢 Не повезло", "#94a3b8");
    saveNow(); updateUI();
}
function casino(){
    if(S.money < 500){ notify("Нужно $500", "#ef4444"); return; }
    S.money -= 500;
    if(Math.random() < 0.45){ S.money += 1000; notify("🎲 +$1000", "#10b981"); }
    else notify("🎲 Проигрыш", "#ef4444");
    saveNow(); updateUI();
}

function renderOffshore(){
    try {
        document.getElementById("offshore-balance").textContent = "$" + formatNum(S.offshore);
    } catch(e){}
}
function putOffshore(){
    if(S.money < 10000){ notify("Нужно $10000", "#ef4444"); return; }
    S.money -= 10000; S.offshore += 10000;
    notify("🏝️ +$10000", "#10b981"); saveNow(); updateUI(); renderOffshore();
}
function takeOffshore(){
    if(S.offshore <= 0){ notify("Пусто", "#ef4444"); return; }
    S.money += S.offshore; notify("💰 +$" + formatNum(S.offshore), "#10b981");
    S.offshore = 0; saveNow(); updateUI(); renderOffshore();
}

function renderUnions(){
    try {
        document.getElementById("union-activity").textContent = Math.floor(S.unionActivity) + "%";
    } catch(e){}
}
function negotiateUnion(){
    S.unionActivity = Math.max(0, S.unionActivity - 30);
    notify("🤝 -30%", "#10b981"); saveNow(); renderUnions();
}
function raiseSalaries(){
    if(S.money < 10000){ notify("Нужно $10000", "#ef4444"); return; }
    S.money -= 10000; S.salaryLevel += 0.1; S.unionActivity = 0;
    notify("💵 ×" + S.salaryLevel.toFixed(1), "#10b981"); saveNow(); updateUI(); renderUnions();
}

function renderStory(){
    try {
        document.getElementById("story-chapter").textContent = S.storyChapter;
        const ch = STORY_CHAPTERS[Math.min(S.storyChapter-1, STORY_CHAPTERS.length-1)];
        document.getElementById("story-text").textContent = ch.text;
        const choicesEl = document.getElementById("story-choices");
        choicesEl.innerHTML = "";
        if(S.storyChapter <= STORY_CHAPTERS.length){
            ch.choices.forEach(c=>{
                const btn = document.createElement("button");
                btn.textContent = c.text;
                btn.onclick = ()=>{ c.effect(); S.storyChapter++; notify("📖 Глава " + S.storyChapter, "#8b5cf6"); saveNow(); updateUI(); renderStory(); };
                choicesEl.appendChild(btn);
            });
        } else choicesEl.innerHTML = "<p style='font-size:11px;'>Сюжет завершён!</p>";
    } catch(e){}
}

function renderCharacters(){
    try {
        const list = document.getElementById("characters-list");
        list.innerHTML = "";
        CHARACTERS_LIST.forEach(c=>{
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<div class="item-info"><div class="item-name">${c.name} — ${c.role}</div><div class="item-cost">${c.desc}</div></div>`;
            list.appendChild(div);
        });
    } catch(e){}
}

function renderFriends(){
    try {
        const list = document.getElementById("friends-list");
        list.innerHTML = "";
        S.friends.forEach(f=>{
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<div class="item-info"><div class="item-name">👤 ${f}</div></div>`;
            list.appendChild(div);
        });
        const rc = document.getElementById("referral-count");
        if(rc) rc.textContent = S.referrals;
        const rb = document.getElementById("referral-bonus");
        if(rb) rb.textContent = "×" + (1 + S.referrals * 0.1).toFixed(1);
    } catch(e){}
}
function addFriend(){
    const input = document.getElementById("friend-input");
    const name = input.value.trim();
    if(!name) return;
    S.friends.push(name); input.value = "";
    notify("👥 " + name, "#10b981"); saveNow(); renderFriends();
}
function copyReferral(){
    const text = "Играй в Симулятор Мессенджера! " + window.location.origin + window.location.pathname;
    try {
        navigator.clipboard.writeText(text);
        notify("📋 Ссылка скопирована", "#10b981");
    } catch(e){
        prompt("Скопируй ссылку:", text);
    }
}

function renderMini(){
    try {
        document.getElementById("clicker-count").textContent = S.clickerCount;
        const btn = document.getElementById("click-btn");
        if(S.clickBlocked){
            btn.disabled = true;
            btn.textContent = "🚫 Заблокировано на " + Math.ceil((S.clickBlockEnd - Date.now())/1000) + "с";
        } else {
            btn.disabled = false;
            btn.textContent = "👆 Кликнуть";
        }
    } catch(e){}
}

function doClick(event){
    try {
        const now = Date.now();
        if(now - S.lastClickTime < 50 && S.lastClickTime > 0){
            S.clicksInWindow = (S.clicksInWindow || 0) + 1;
            if(S.clicksInWindow > 5){
                S.clickBlocked = true;
                S.clickBlockEnd = now + 10000;
                const msg = document.getElementById("anticheat-message");
                if(msg) msg.innerHTML = '<div class="anticheat-warning">🚫 ОБНАРУЖЕН АВТОКЛИКЕР! Кликер заблокирован на 10 секунд.</div>';
                notify("🚫 Античит", "#dc2626");
                beep(200, 0.5);
                renderMini();
                return;
            }
        } else {
            S.clicksInWindow = 0;
        }
        if(!S.clickWindowStart || now - S.clickWindowStart > 2000){
            S.clickWindowStart = now;
            S.clicksInWindow = 0;
        }
        S.clicksInWindow++;
        if(S.clicksInWindow >= 100){
            S.clickBlocked = true;
            S.clickBlockEnd = now + 10000;
            notify("🚫 Слишком быстро", "#dc2626");
            renderMini();
            return;
        }
        if(S.clickBlocked && now < S.clickBlockEnd){ return; }
        else if(S.clickBlocked && now >= S.clickBlockEnd){
            S.clickBlocked = false;
            S.clicksInWindow = 0;
            const msg = document.getElementById("anticheat-message");
            if(msg) msg.innerHTML = '';
        }
        S.lastClickTime = now;
        S.clickerCount++;
        if(S.clickerCount % 10 === 0){ S.money += 100; notify("👆 +$100", "#10b981"); }
        saveNow(); renderMini(); updateUI();
    } catch(e){ console.log(e); }
}

function startMathGame(){
    try {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const ops = ["+","-","×"];
        const op = ops[Math.floor(Math.random()*3)];
        let answer;
        if(op === "+") answer = a + b;
        else if(op === "-") answer = a - b;
        else answer = a * b;
        S.mathAnswer = answer;
        S.mathGameActive = true;
        document.getElementById("math-question").textContent = a + " " + op + " " + b + " = ?";
        document.getElementById("math-answer").value = "";
        document.getElementById("math-answer").focus();
        S.mathTimer = setTimeout(()=>{
            if(S.mathGameActive){
                S.mathGameActive = false;
                notify("⏰ Время вышло", "#ef4444");
            }
        }, 10000);
    } catch(e){}
}

function checkMathAnswer(){
    if(!S.mathGameActive) return;
    const input = document.getElementById("math-answer");
    const val = parseInt(input.value);
    if(val === S.mathAnswer){
        S.money += 500;
        S.mathWins = (S.mathWins || 0) + 1;
        notify("✅ +$500", "#10b981");
        beep(900, 0.3);
    } else {
        notify("❌ Неверно", "#ef4444");
    }
    S.mathGameActive = false;
    clearTimeout(S.mathTimer);
    input.value = "";
    document.getElementById("math-question").textContent = "—";
    saveNow(); updateUI();
}

function renderMultiverse(){
    try {
        const list = document.getElementById("multiverse-list");
        list.innerHTML = "";
        MULTIVERSE_VERSIONS.forEach(v=>{
            const found = S.multiverse.includes(v.name);
            const canGet = v.check();
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<div class="item-info"><div class="item-name">${found?"🌟":canGet?"⚡":"🔒"} ${v.name}</div><div class="item-cost">${v.bonus}<br>Требование: ${v.req}</div></div>`;
            if(!found){
                const btn = document.createElement("button");
                btn.textContent = canGet ? "Найти" : "Недоступно";
                btn.disabled = !canGet;
                if(canGet) btn.onclick = ()=>{
                    S.multiverse.push(v.name);
                    if(v.name.includes("миллиардер")) S.money += 1000000;
                    if(v.name.includes("президент")) S.rep += 50;
                    if(v.name.includes("робот")) S.techs.push("ai");
                    if(v.name.includes("пришелец")) S.voxCoin += 10000;
                    if(v.name.includes("кот")) S.crystals += 50;
                    if(v.name.includes("бог")) S.prestigeMult *= 2;
                    notify("🌌 " + v.name, "#8b5cf6"); confetti();
                    saveNow(); updateUI(); renderMultiverse();
                };
                div.appendChild(btn);
            }
            list.appendChild(div);
        });
    } catch(e){}
}

function renderSeasons(){
    try {
        const m = new Date().getMonth();
        const season = SEASONS[m];
        const cur = document.getElementById("current-season");
        if(cur) cur.textContent = season.emoji + " " + season.name;
        const sm = document.getElementById("season-month");
        if(sm) sm.textContent = MONTH_NAMES[m];
        const eff = document.getElementById("season-effects");
        if(eff) eff.innerHTML = `<div class="detail-row"><span class="label">Эффект</span><span class="value">${season.effect}</span></div><div class="detail-row"><span class="label">Множитель</span><span class="value">×${season.mult}</span></div>`;
    } catch(e){}
}

function renderPrestigeUpgrades(){
    try {
        const el = document.getElementById("prestige-points");
        if(el) el.textContent = Math.floor(S.prestigePoints || 0);
        const list = document.getElementById("prestige-upgrades-list");
        if(!list) return;
        list.innerHTML = "";
        PRESTIGE_UPGRADES.forEach(u=>{
            const lvl = S.prestigeUpgrades[u.id] || 0;
            const canBuy = S.prestigePoints >= u.cost && lvl < u.max;
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<div class="item-info"><div class="item-name">${u.name} [${lvl}/${u.max}]</div><div class="item-cost">${u.desc}</div></div>`;
            const btn = document.createElement("button");
            btn.textContent = lvl >= u.max ? "MAX" : "⭐ " + u.cost;
            btn.disabled = !canBuy;
            if(canBuy) btn.onclick = ()=>{
                S.prestigePoints -= u.cost;
                S.prestigeUpgrades[u.id] = lvl + 1;
                notify("⬆️ " + u.name + " → Lv." + (lvl+1), "#8b5cf6");
                confetti(); saveNow(); renderPrestigeUpgrades();
            };
            div.appendChild(btn);
            list.appendChild(div);
        });
    } catch(e){}
}

function renderVisual(){
    try {
        document.getElementById("time-of-day").textContent = S.timeOfDay;
        document.getElementById("visual-weather").textContent = S.weather;
        document.getElementById("current-mode").textContent = S.mode === "hardcore" ? "Хардкор" : S.mode === "sandbox" ? "Песочница" : S.mode === "survival" ? "Выживание" : "Обычный";
        document.getElementById("eggs-count").textContent = S.easterEggsFound.length;
        const csEl = document.getElementById("custom-stickers");
        csEl.innerHTML = "";
        S.koll.customStickers.forEach(s=>{
            const div = document.createElement("div");
            div.className = "koll-item owned";
            div.textContent = s;
            csEl.appendChild(div);
        });
    } catch(e){}
}
function createSticker(){
    const input = document.getElementById("sticker-input");
    const val = input.value.trim();
    if(!val) return;
    if(!S.koll.customStickers.includes(val)){
        S.koll.customStickers.push(val);
        notify("🎨 " + val, "#10b981");
        input.value = ""; saveNow(); renderVisual();
    }
}
function changeTimeOfDay(){
    const times = ["Утро","День","Вечер","Ночь"];
    const idx = times.indexOf(S.timeOfDay);
    S.timeOfDay = times[(idx+1) % times.length];
    notify("🕐 " + S.timeOfDay, "#8b5cf6"); saveNow(); renderVisual();
}
function checkEasterEgg(){
    const remaining = EASTER_EGGS.filter(e=>!S.easterEggsFound.includes(e));
    if(remaining.length === 0){ notify("Все найдены!", "#f59e0b"); return; }
    const egg = remaining[Math.floor(Math.random()*remaining.length)];
    document.getElementById("easter-egg-result").textContent = egg;
    S.easterEggsFound.push(egg); S.crystals += 1;
    notify("🥚 +💎1 (" + S.easterEggsFound.length + "/40)", "#f59e0b");
    saveNow(); updateUI(); renderVisual();
}
function enterCode(){
    const input = document.getElementById("code-input");
    const code = input.value.trim().toUpperCase();
    const codes = {
        "КОД-4821":()=>{S.money+=100000;notify("🔑 +$100000","#f59e0b");},
        "РАКЕТА-2026":()=>{S.crystals+=10;notify("🔑 +💎10","#06b6d4");},
        "БЭКРУМС":()=>{S.users+=1000000;notify("🔑 +1M","#10b981");},
        "БОГМОД":()=>{S.prestigeMult*=10;notify("🔑 ×10","#8b5cf6");},
        "БЕСПЛАТНО":()=>{S.money+=10000;notify("🔑 +$10000","#10b981");}
    };
    if(codes[code]){
        if(S.codesUsed.includes(code)){ notify("Уже использован", "#ef4444"); return; }
        codes[code](); S.codesUsed.push(code); confetti();
    } else notify("❌ Неверный код", "#ef4444");
    input.value = ""; saveNow(); updateUI();
}
function changeMode(mode){
    S.mode = mode;
    if(mode === "hardcore"){ S.prestigeMult *= 0.5; notify("💀 Хардкор", "#ef4444"); }
    else if(mode === "sandbox"){ S.money += 1000000; notify("🏖️ +$1M", "#10b981"); }
    else if(mode === "survival"){ notify("💀 Одна жизнь", "#dc2626"); }
    else notify("⚙️ Обычный", "#3b82f6");
    saveNow(); updateUI(); renderVisual();
}

function renderProfile(){
    try {
        document.getElementById("profile-avatar").textContent = S.profileAvatar || "👤";
        document.getElementById("profile-name").value = S.profileName || S.name;
        document.getElementById("profile-status").value = S.profileStatus || "";
        const picker = document.getElementById("avatar-picker");
        picker.innerHTML = "";
        ALL_AVATARS.forEach(a=>{
            const div = document.createElement("div");
            div.className = "koll-item" + (S.profileAvatar === a ? " owned" : "");
            div.textContent = a;
            div.onclick = ()=>{ S.profileAvatar = a; saveNow(); renderProfile(); updateUI(); };
            picker.appendChild(div);
        });
        const wallList = document.getElementById("wall-list");
        wallList.innerHTML = "";
        S.wall.forEach(w=>{
            const div = document.createElement("div");
            div.className = "chat-msg";
            div.innerHTML = `<b>${w.text}</b><br><span style="font-size:10px;color:#94a3b8;">${w.time} • ❤️ ${w.likes}</span>`;
            const likeBtn = document.createElement("button");
            likeBtn.textContent = "❤️";
            likeBtn.style.width = "auto"; likeBtn.style.padding = "2px 6px"; likeBtn.style.fontSize = "10px";
            likeBtn.onclick = ()=>{ w.likes++; saveNow(); renderProfile(); };
            div.appendChild(likeBtn);
            wallList.appendChild(div);
        });
    } catch(e){}
}
function saveProfile(){
    S.profileName = document.getElementById("profile-name").value;
    S.profileStatus = document.getElementById("profile-status").value;
    notify("💾 Сохранено", "#10b981"); saveNow();
}
function postWall(){
    const input = document.getElementById("wall-input");
    const text = input.value.trim();
    if(!text) return;
    S.wall.unshift({text, time:new Date().toLocaleTimeString(), likes:0});
    input.value = "";
    notify("📝 Опубликовано", "#10b981"); saveNow(); renderProfile();
}

function drawChart(){
    try {
        const canvas = document.getElementById("chart");
        if(!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight || 80;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const data = S.usersHistory.slice(-60);
        if(data.length < 2) return;
        const max = Math.max(...data, 1);
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.beginPath();
        data.forEach((v,i)=>{
            const x = (i / (data.length-1)) * canvas.width;
            const y = canvas.height - (v / max) * canvas.height;
            if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        });
        ctx.stroke();
    } catch(e){}
}
function renderForecast(){
    try {
        const data = S.usersHistory.slice(-10);
        const el = document.getElementById("forecast");
        if(data.length < 2){ el.textContent = "Мало данных."; return; }
        const perSec = (data[data.length-1] - data[0]) / data.length;
        if(perSec > 0) el.innerHTML = `📈 +${perSec.toFixed(1)}/сек<br>Через минуту: <b>${formatNum(S.users + perSec*60)}</b>`;
        else el.innerHTML = `📉 ${perSec.toFixed(1)}/сек`;
    } catch(e){}
}

function renderPrestige(){
    try {
        document.getElementById("prestige-mult").textContent = "×" + safeNumber(S.prestigeMult,1).toFixed(2);
        document.getElementById("prestige-level").textContent = Math.floor(safeNumber(S.prestige,0));
        const pp = document.getElementById("prestige-points-display");
        if(pp) pp.textContent = Math.floor(S.prestigePoints || 0);
    } catch(e){}
}
function doPrestige(){
    if(S.users < 1000000){ notify("Нужно 1 000 000", "#ef4444"); return; }
    if(!confirm("Переродиться?")) return;
    S.prestige++; S.prestigeMult = Math.pow(2, S.prestige);
    S.prestigePoints = (S.prestigePoints || 0) + 1;
    S.users = 0; S.money = 2000 + (S.prestigeUpgrades.fastStart || 0) * 5000; S.rep = 50;
    S.techs = []; S.staff = []; S.servers = [];
    S.staffLevels = {}; S.staffVacation = {}; S.staffTraining = {};
    S.depts = {}; S.skills = {};
    S.level = 1; S.xp = 0;
    S.stocks = {own:{owned:0,price:10}, comp:{owned:0,price:50}, index:{owned:0,price:100}};
    S.usersHistory = [0];
    S.company = {offices:0, absorbed:0, ipo:false, board:false, lawyers:false, franchise:false, partners:0};
    S.bots = [];
    notify("🌟 Престиж " + S.prestige + "! ×" + S.prestigeMult, "#f59e0b");
    confetti(); beep(900, 0.5);
    saveNow(); updateUI(); show("screen-main");
}

function generateTasks(){
    const today = new Date().toDateString();
    if(S.tasksDate === today && S.dailyTasks.length > 0) return;
    S.tasksDate = today;
    const all = [
        {id:"t1", text:"Купи 1 технологию", check:()=>S.techs.length>=1, done:false, reward:200},
        {id:"t2", text:"Найми 1 сотрудника", check:()=>S.staff.length>=1, done:false, reward:300},
        {id:"t3", text:"100 юзеров", check:()=>S.users>=100, done:false, reward:500},
        {id:"t4", text:"Купи сервер", check:()=>S.servers.length>=1, done:false, reward:400},
        {id:"t5", text:"Имей 5000$", check:()=>S.money>=5000, done:false, reward:600}
    ];
    S.dailyTasks = all.sort(()=>Math.random()-0.5).slice(0,3);
}
function renderTasks(){
    try {
        generateTasks();
        const list = document.getElementById("tasks-list");
        list.innerHTML = "";
        S.dailyTasks.forEach(t=>{
            const done = t.done || t.check();
            if(done && !t.done){ t.done = true; S.money += t.reward; addXp(50); notify("📅 " + t.text, "#10b981"); saveNow(); }
            const div = document.createElement("div");
            div.className = "task" + (t.done ? " done" : "");
            div.innerHTML = `<span>${t.done?"✅":"⬜"} ${t.text}</span><span class="badge">+$${t.reward}</span>`;
            list.appendChild(div);
        });
    } catch(e){}
}

function renderEvents(){
    try {
        const list = document.getElementById("events-list");
        list.innerHTML = "";
        if(S.log.length === 0){ list.innerHTML = "<div class='event'>Пока событий нет.</div>"; return; }
        S.log.forEach(e=>{
            const d = document.createElement("div");
            d.className = "event" + (e.type ? " " + e.type : "");
            d.textContent = "[" + e.time + "] " + e.text;
            list.appendChild(d);
        });
    } catch(e){}
}

function renderAchievements(){
    try {
        const list = document.getElementById("achieve-list");
        list.innerHTML = "";
        ACHIEVEMENTS.forEach(a=>{
            const done = S.achievements.includes(a.id);
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<div class="item-info"><div class="item-name">${done?"🏆":"🔒"} ${a.name}</div></div>`;
            list.appendChild(div);
        });
    } catch(e){}
}
function checkAchievements(){
    try {
        ACHIEVEMENTS.forEach(a=>{
            if(!S.achievements.includes(a.id) && a.check()){
                S.achievements.push(a.id); S.crystals += 1;
                S.money += 5000;
                addLog("🏆 Достижение: " + a.name, "achievement");
                notify("🏆 " + a.name + " +💎1 +$5000", "#f59e0b");
                confetti(); beep(900, 0.3); saveNow();
            }
        });
    } catch(e){}
}

function addXp(amount){
    try {
        S.xp += amount;
        const need = S.level * 100;
        if(S.xp >= need){ S.xp -= need; S.level++; notify("⬆️ Уровень " + S.level, "#f59e0b"); confetti(); beep(800, 0.3); saveNow(); }
    } catch(e){}
}

function claimDaily(){
    if(!gameCreated){ notify("Сначала создай игру!", "#ef4444"); return; }
    const today = new Date().toDateString();
    if(S.dailyRewardDate === today){ notify("Уже получено", "#94a3b8"); return; }
    S.dailyRewardDate = today;
    S.dailyStreak = (S.dailyStreak || 0) + 1;
    const reward = 1000 * S.dailyStreak;
    const crystals = Math.min(10, S.dailyStreak);
    S.money += reward; S.crystals += crystals;
    notify("🎁 День " + S.dailyStreak + ": +$" + reward + " +💎" + crystals, "#f59e0b");
    confetti(); beep(900, 0.4); saveNow(); updateUI();
}

function showShareMenu(){
    const text = `🎮 Играй в Симулятор Мессенджера!\nСоздай свой мессенджер, обгони конкурентов.\n\n🔗 ${window.location.origin}${window.location.pathname}\n📢 t.me/VOXLAB0`;
    if(navigator.share){
        navigator.share({title:"Симулятор Мессенджера", text: text}).catch(()=>{});
    } else {
        try {
            navigator.clipboard.writeText(text);
            notify("📋 Текст скопирован! Вставь в TikTok/VK", "#10b981");
        } catch(e){
            prompt("Скопируй текст:", text);
        }
    }
}

// ОНБОРДИНГ
function showTutorial(){
    try {
        if(S.tutorialDone) return;
        if(document.getElementById("tutorialOverlay")) return;
        const overlay = document.createElement("div");
        overlay.id = "tutorialOverlay";
        overlay.className = "tutorial-overlay";
        overlay.innerHTML = `
            <div class="tutorial-box">
                <div class="tutorial-emoji">🎮</div>
                <h2>Добро пожаловать!</h2>
                <div class="step">Шаг 1 из 4</div>
                <p>Ты — разработчик. Твоя цель — построить мессенджер и обгони всех конкурентов.</p>
                <button onclick="nextTutorial(2)">Далее →</button>
            </div>
        `;
        document.body.appendChild(overlay);
    } catch(e){}
}
function nextTutorial(step){
    try {
        const overlay = document.getElementById("tutorialOverlay");
        if(!overlay) return;
        if(step === 2){
            overlay.innerHTML = `
                <div class="tutorial-box">
                    <div class="tutorial-emoji">🔬</div>
                    <h2>Купи технологию</h2>
                    <div class="step">Шаг 2 из 4</div>
                    <p>Зайди в раздел <b>«Технологии»</b> и купи первую — «Личные чаты».</p>
                    <button onclick="nextTutorial(3)">Далее →</button>
                </div>
            `;
        } else if(step === 3){
            overlay.innerHTML = `
                <div class="tutorial-box">
                    <div class="tutorial-emoji">👥</div>
                    <h2>Найми сотрудника</h2>
                    <div class="step">Шаг 3 из 4</div>
                    <p>В разделе <b>«Персонал»</b> найми первого сотрудника — он приносит доход.</p>
                    <button onclick="nextTutorial(4)">Далее →</button>
                </div>
            `;
        } else if(step === 4){
            overlay.innerHTML = `
                <div class="tutorial-box">
                    <div class="tutorial-emoji">🚀</div>
                    <h2>Всё готово!</h2>
                    <div class="step">Шаг 4 из 4</div>
                    <p>Ты знаешь основы. Дальше — твоё дело. Обгони всех и стань №1!</p>
                    <button class="btn-green" onclick="finishTutorial()">🎮 Начать игру!</button>
                </div>
            `;
        }
    } catch(e){}
}
function finishTutorial(){
    try {
        S.tutorialDone = true;
        const overlay = document.getElementById("tutorialOverlay");
        if(overlay) overlay.remove();
        S.crystals += 5;
        notify("🎁 +💎5 за обучение!", "#f59e0b");
        confetti();
        saveNow(); updateUI();
    } catch(e){}
}

let taxTimer = 0, storyTimer = 0, stockTimer = 0, historyTimer = 0;
let cryptoTimer = 0, crisisTimer = 0, investorTimer = 0, seasonTimer = 0;
let depositTimer = 0, countryTimer = 0, weatherTimer = 0, botTimer = 0, unionTimer = 0;

function tick(){
    try {
        if(!gameCreated) return;
        S.playtime++;
        taxTimer++; storyTimer++; stockTimer++; historyTimer++;
        cryptoTimer++; crisisTimer++; investorTimer++; seasonTimer++;
        depositTimer++; countryTimer++; weatherTimer++; botTimer++; unionTimer++;

        const diff = DIFFICULTY[S.difficulty] || DIFFICULTY.medium;
        S.inflation = Math.min(0.5, S.playtime * 0.00001);
        S.money += calcIncome();

        let upkeep = 0;
        S.servers.forEach(id=>{ const s = SERVERS.find(x=>x.id===id); if(s) upkeep += s.cost * 0.001 * diff.costMult; });
        S.money -= upkeep;

        if(taxTimer >= 600){
            taxTimer = 0;
            const taxable = Math.max(0, S.money - S.offshore);
            const tax = taxable * 0.1;
            S.money -= tax;
            addLog("🏦 Налог: -$" + formatNum(tax), "bad");
        }

        if(storyTimer >= 180){
            storyTimer = 0;
            if(storyIndex < STORY.length){ addLog(STORY[storyIndex], "story"); storyIndex++; }
        }

        if(stockTimer >= 10){
            stockTimer = 0;
            ["own","comp","index"].forEach(k=>{
                const st = S.stocks[k];
                const vol = k === "own" ? 2 : k === "comp" ? 5 : 10;
                st.price = Math.max(1, st.price + (Math.random() - 0.45) * vol);
            });
        }

        if(cryptoTimer >= 8){
            cryptoTimer = 0;
            Object.keys(S.cryptos).forEach(sym=>{
                const c = S.cryptos[sym];
                const vol = sym === "SHIB" ? 0.000001 : sym === "DOGE" ? 0.01 : 1;
                c.price = Math.max(0.000001, c.price + (Math.random() - 0.5) * c.price * 0.05 * vol);
            });
        }

        if(depositTimer >= 300){
            depositTimer = 0;
            if(S.deposit > 0){ S.deposit += S.deposit * 0.05; }
            if(S.bonds > 0){ S.bonds += S.bonds * 0.10; }
        }

        if(!S.crisis && crisisTimer >= 600 && Math.random() < 0.1){
            S.crisis = true; crisisTimer = 0;
            if(!document.getElementById("crisisBanner")){
                const b = document.createElement("div");
                b.id = "crisisBanner"; b.className = "crisis-banner";
                b.textContent = "🌍 КРИЗИС — ДОХОД -30%";
                document.body.appendChild(b);
            }
        }
        if(S.crisis){
            S.crisisTimer = (S.crisisTimer || 0) + 1;
            if(S.crisisTimer >= 60){ S.crisis = false; S.crisisTimer = 0; const b = document.getElementById("crisisBanner"); if(b) b.remove(); }
        }

        if(S.users >= 10000 && investorTimer >= 300 && S.investors.length < 3){
            investorTimer = 0;
            if(Math.random() < 0.5){
                const t = INVESTOR_TYPES[Math.floor(Math.random()*INVESTOR_TYPES.length)];
                const offer = t.minOffer + Math.floor(Math.random()*t.minOffer);
                S.investors.push({name:t.name, offer, share:t.share});
            }
        }

        if(seasonTimer >= 1800){ seasonTimer = 0; S.season++; }

        S.competitors.forEach(c=>{ c.users += c.growth * (0.8 + Math.random() * 0.4); });

        if(countryTimer >= 30){
            countryTimer = 0;
            const unlocked = S.countries.filter(c=>c.unlocked);
            unlocked.forEach(c=>{ c.users = Math.floor(S.users / unlocked.length); });
        }

        if(weatherTimer >= 600){
            weatherTimer = 0;
            S.weather = ["Ясно","Дождь","Снег","Гроза","Туман","Ветер"][Math.floor(Math.random()*6)];
        }

        if(botTimer >= 10){
            botTimer = 0;
            S.bots.forEach(bid=>{
                if(bid === "autoTech" && S.money >= 1000){ const t = TECHS.find(x=>!S.techs.includes(x.id)); if(t && S.money >= t.cost){ S.money -= t.cost; S.techs.push(t.id); } }
                if(bid === "autoStaff" && S.money >= 2000){ const s = STAFF.find(x=>!S.staff.includes(x.id)); if(s && S.money >= s.cost){ S.money -= s.cost; S.staff.push(s.id); S.staffLevels[s.id] = {level:1, char:"genius"}; } }
                if(bid === "autoCrypto"){ const sym = Object.keys(S.cryptos)[Math.floor(Math.random()*10)]; S.cryptos[sym].owned += 1; }
                if(bid === "autoAds"){ S.users += 100; }
            });
        }

        if(unionTimer >= 60){
            unionTimer = 0;
            if(S.staff.length > 0) S.unionActivity = Math.min(100, S.unionActivity + S.staff.length * 2);
        }

        let maxUsers = 1000;
        S.servers.forEach(id=>{ const s = SERVERS.find(x=>x.id===id); if(s) maxUsers += s.maxUsers; });

        if(S.users < maxUsers){
            let growth = 1 + S.techs.length * 0.5 + S.staff.length * 2;
            growth *= (S.rep / 50);
            growth *= (1 + (S.level-1) * 0.1);
            growth *= (1 + (S.skills.growth || 0) * 0.1);
            growth *= (1 + (S.prestigeUpgrades.moreGrowth || 0) * 0.2);
            if(S.depts.mark) growth *= 1.15;
            if(S.company.partners) growth *= 1.1;
            if(S.crisis) growth *= 0.7;
            if(S.mode === "hardcore") growth *= 0.7;
            if(S.mode === "sandbox") growth *= 2;
            S.users += growth;
        }

        S.rep = Math.max(0, S.rep - 0.02);
        if(S.depts.supp) S.rep = Math.min(100, S.rep + 0.05);

        addXp(0.5);
        if(Math.random() < diff.eventChance){
            const e = EVENTS[Math.floor(Math.random()*EVENTS.length)];
            e.fn(); addLog(e.text, e.type);
            notify(e.text, e.type==="good"?"#10b981":"#ef4444");
            beep(e.type==="good"?700:200, 0.3);
        }

        if(historyTimer >= 5){
            historyTimer = 0;
            S.usersHistory.push(S.users);
            if(S.usersHistory.length > 60) S.usersHistory.shift();
        }

        checkAchievements();
        checkQuests();
        updateUI();
    } catch(e){ console.log(e); }
}

function saveNow(){
    try {
        if(!gameCreated) return;
        S.lastPlaytime = Math.floor(Date.now()/1000);
        ["v10","v9","v8","v7","v6","v5","v4","v3","v2"].forEach(v=>{
            try { localStorage.setItem("messengerSim_"+v, JSON.stringify(S)); } catch(e){}
        });
    } catch(e){}
}

function load(){
    try {
        let d = null;
        ["v10","v9","v8","v7","v6","v5","v4","v3","v2"].forEach(v=>{ if(!d) d = localStorage.getItem("messengerSim_"+v); });
        if(!d) return false;
        const parsed = JSON.parse(d);
        Object.assign(S, parsed);
        if(!S.settings) S.settings = {sound:true,music:true,coins:true,confetti:true,notify:true,events:true,autosave:true,autotheme:false,fontbig:false};
        if(S.settings.music === undefined) S.settings.music = true;
        if(S.settings.autotheme === undefined) S.settings.autotheme = false;
        if(S.settings.fontbig === undefined) S.settings.fontbig = false;
        if(!S.difficulty) S.difficulty = "medium";
        if(!S.bots) S.bots = [];
        if(!S.friends) S.friends = [];
        if(!S.wall) S.wall = [];
        if(!S.multiverse) S.multiverse = [];
        if(!S.easterEggsFound) S.easterEggsFound = [];
        if(!S.codesUsed) S.codesUsed = [];
        if(S.battlesWon === undefined) S.battlesWon = 0;
        if(S.bossHP === undefined) S.bossHP = 1000;
        if(S.bossLevel === undefined) S.bossLevel = 1;
        if(S.unionActivity === undefined) S.unionActivity = 0;
        if(S.salaryLevel === undefined) S.salaryLevel = 1;
        if(S.offshore === undefined) S.offshore = 0;
        if(S.bonds === undefined) S.bonds = 0;
        if(S.clickerCount === undefined) S.clickerCount = 0;
        if(S.referrals === undefined) S.referrals = 0;
        if(S.tutorialDone === undefined) S.tutorialDone = false;
        if(S.mathWins === undefined) S.mathWins = 0;
        if(S.prestigePoints === undefined) S.prestigePoints = 0;
        if(!S.prestigeUpgrades) S.prestigeUpgrades = {fastStart:0, cheaperTech:0, moreIncome:0, moreGrowth:0};
        if(!S.stocks) S.stocks = {own:{owned:0,price:10}, comp:{owned:0,price:50}, index:{owned:0,price:100}};
        if(!S.cryptos) S.cryptos = {VOX:{owned:0,price:1},BTC:{owned:0,price:60000},ETH:{owned:0,price:3000},DOGE:{owned:0,price:0.15},SHIB:{owned:0,price:0.00002},SOL:{owned:0,price:150},XRP:{owned:0,price:0.5},ADA:{owned:0,price:0.4},DOT:{owned:0,price:7},MATIC:{owned:0,price:0.8}};
        if(!S.depts) S.depts = {};
        if(!S.skills) S.skills = {};
        if(!S.koll) S.koll = {icons:[], themes:[], stickers:[], customStickers:[], unlockedLogos:["💬"]};
        if(!S.investors) S.investors = [];
        if(!S.usersHistory) S.usersHistory = [S.users];
        if(S.prestigeMult === undefined) S.prestigeMult = 1;
        if(S.prestige === undefined) S.prestige = 0;
        if(S.inflation === undefined) S.inflation = 0;
        if(S.season === undefined) S.season = 1;
        if(!S.staffVacation) S.staffVacation = {};
        if(!S.staffTraining) S.staffTraining = {};
        if(!S.company) S.company = {offices:0, absorbed:0, ipo:false, board:false, lawyers:false, franchise:false, partners:0};
        if(S.crystals === undefined) S.crystals = 0;
        if(S.dailyRewardDate === undefined) S.dailyRewardDate = "";
        if(S.dailyStreak === undefined) S.dailyStreak = 0;
        if(S.questIndex === undefined) S.questIndex = 0;
        if(S.mode === undefined) S.mode = "normal";
        if(!S.weather) S.weather = "Ясно";
        if(!S.timeOfDay) S.timeOfDay = "День";
        if(!S.clan) S.clan = {name:"", members:[]};
        if(!S.storyChapter) S.storyChapter = 1;
        if(S.voxCoin === undefined) S.voxCoin = 0;
        if(S.deposit === undefined) S.deposit = 0;
        if(S.crowdfundTotal === undefined) S.crowdfundTotal = 0;
        for(const id in S.staffLevels){ if(typeof S.staffLevels[id] === "number") S.staffLevels[id] = {level: S.staffLevels[id], char:"normal"}; }
        if(S.countries && S.countries.length >= 20){
            const newNames = ["Россия","США","Китай","Германия","Индия","Бразилия","Япония","Корея","Турция","Мексика","Индонезия","Нигерия","Египет","Австралия","Канада","Франция","Италия","Испания","Польша","Аргентина"];
            S.countries.forEach((c,i)=>{ if(newNames[i]) c.name = newNames[i]; });
        }
        storyIndex = Math.min(STORY.length, Math.floor(S.playtime / 180));
        if(S.lastPlaytime){
            const offlineSec = Math.min(3600, Math.floor(Date.now()/1000) - S.lastPlaytime);
            if(offlineSec > 60){
                const offlineIncome = offlineSec * calcIncome();
                S.money += offlineIncome;
                setTimeout(()=>notify("💤 Оффлайн-доход: +$" + formatNum(offlineIncome), "#10b981"), 1500);
            }
        }
        return true;
    } catch(e){ return false; }
}

function toggleTheme(){
    S.light = !S.light;
    document.body.classList.toggle("light", S.light);
    saveNow();
    renderSettings();
}

function newGame(){ gameCreated = false; show("screen-create"); }

function continueGame(){
    if(load()){
        gameCreated = true;
        updateUI();
        document.body.classList.toggle("light", S.light);
        document.body.classList.toggle("font-big", S.settings.fontbig);
        show("screen-main");
        notify("💾 Загружено", "#10b981");
        if(S.settings.music) playMusic();
        if(!S.tutorialDone) setTimeout(()=>showTutorial(), 1500);
    } else {
        notify("Нет сохранений", "#ef4444");
    }
}

function createMessenger(){
    const name = document.getElementById("input-name").value.trim();
    if(!name){ notify("Введи название!", "#ef4444"); return; }
    S = {
        name, color:document.getElementById("select-color").value, logo:document.getElementById("select-logo").value,
        mode:document.getElementById("select-mode").value, difficulty:document.getElementById("select-diff").value,
        settings:{sound:true,music:true,coins:true,confetti:true,notify:true,events:true,autosave:true,autotheme:false,fontbig:false},
        users:0, money:2000, rep:50, techs:[], staff:[], servers:[],
        staffLevels:{}, staffVacation:{}, staffTraining:{},
        depts:{}, skills:{}, log:[], achievements:[], playtime:0,
        level:1, xp:0, dailyTasks:[], tasksDate:"", lastPlaytime:0, light:false,
        prestige:0, prestigeMult:1, prestigePoints:0, prestigeUpgrades:{fastStart:0, cheaperTech:0, moreIncome:0, moreGrowth:0},
        stocks:{own:{owned:0,price:10}, comp:{owned:0,price:50}, index:{owned:0,price:100}},
        cryptos:{VOX:{owned:0,price:1},BTC:{owned:0,price:60000},ETH:{owned:0,price:3000},DOGE:{owned:0,price:0.15},SHIB:{owned:0,price:0.00002},SOL:{owned:0,price:150},XRP:{owned:0,price:0.5},ADA:{owned:0,price:0.4},DOT:{owned:0,price:7},MATIC:{owned:0,price:0.8}},
        competitors:[{name:"Корпорация А",users:900000000,growth:100},{name:"Мессенджер Б",users:2000000000,growth:200},{name:"Связь В",users:50000000,growth:50},{name:"Чат Г",users:40000000,growth:30},{name:"Дискурс Д",users:150000000,growth:60},{name:"Пульс Е",users:260000000,growth:20},{name:"Вэй Ж",users:1300000000,growth:150}],
        usersHistory:[0], crisis:false, crisisTimer:0, investors:[], season:1, seasonTimer:0,
        koll:{icons:[], themes:[], stickers:[], customStickers:[], unlockedLogos:["💬"]},
        inflation:0,
        company:{offices:0, absorbed:0, ipo:false, board:false, lawyers:false, franchise:false, partners:0},
        crystals:0, dailyRewardDate:"", dailyStreak:0, questIndex:0,
        countries:[
            {name:"Россия",unlocked:true,users:0},{name:"США",unlocked:false,users:0},{name:"Китай",unlocked:false,users:0},
            {name:"Германия",unlocked:false,users:0},{name:"Индия",unlocked:false,users:0},{name:"Бразилия",unlocked:false,users:0},
            {name:"Япония",unlocked:false,users:0},{name:"Корея",unlocked:false,users:0},{name:"Турция",unlocked:false,users:0},
            {name:"Мексика",unlocked:false,users:0},{name:"Индонезия",unlocked:false,users:0},{name:"Нигерия",unlocked:false,users:0},
            {name:"Египет",unlocked:false,users:0},{name:"Австралия",unlocked:false,users:0},{name:"Канада",unlocked:false,users:0},
            {name:"Франция",unlocked:false,users:0},{name:"Италия",unlocked:false,users:0},{name:"Испания",unlocked:false,users:0},
            {name:"Польша",unlocked:false,users:0},{name:"Аргентина",unlocked:false,users:0}
        ],
        weather:"Ясно", timeOfDay:"День", clan:{name:"", members:[]}, storyChapter:1,
        voxCoin:0, deposit:0, crowdfundTotal:0, offshore:0, bonds:0,
        easterEggsFound:[], codesUsed:[], bots:[], battlesWon:0, bossHP:1000, bossLevel:1,
        unionActivity:0, salaryLevel:1, friends:[], wall:[], clickerCount:0, multiverse:[],
        profileAvatar:"👤", profileName:name, profileStatus:"",
        lastClickTime:0, clickBlocked:false, clickBlockEnd:0, clicksInWindow:0, clickWindowStart:0,
        referrals:0, tutorialDone:false, mathWins:0
    };
    gameCreated = true;
    generateTasks();
    addLog("Мессенджер создан: " + name, "good");
    notify("✨ " + name + " запущен!", "#10b981");
    saveNow(); updateUI();
    if(S.settings.music) playMusic();
    show("screen-main");
    setTimeout(()=>showTutorial(), 800);
}

function resetGame(){
    if(confirm("Сбросить ВСЁ?")){
        ["v10","v9","v8","v7","v6","v5","v4","v3","v2"].forEach(v=>localStorage.removeItem("messengerSim_"+v));
        localStorage.removeItem("messengerSim");
        location.reload();
    }
}

// Проверка ответа на математику
document.addEventListener("DOMContentLoaded", ()=>{
    const mathInput = document.getElementById("math-answer");
    if(mathInput){
        mathInput.addEventListener("keypress", (e)=>{
            if(e.key === "Enter") checkMathAnswer();
        });
    }
});

window.addEventListener("resize", ()=>{
    const newDevice = getDeviceType();
    if(newDevice !== deviceType){
        deviceType = newDevice;
        updateDeviceInfo();
    }
});

updateUI();
updateDeviceInfo();
setInterval(tick, 1000);
window.addEventListener("beforeunload", saveNow);
setInterval(()=>{ if(S.settings.autosave && gameCreated) saveNow(); }, 3000);
