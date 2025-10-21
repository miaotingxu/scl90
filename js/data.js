// SCL90心理健康测评数据配置

// SCL90测评数据
const SCL90_DATA = {
    title: "SCL90心理健康测评",
    description: "国际通用的心理健康评估工具，全面评估您的心理健康状况",
    estimatedTime: "15-20分钟",
    questionCount: 90,
    icon: "mental-health",
    dimensions: {
        "躯体化": {
            questions: [1, 4, 12, 27, 40, 42, 48, 49, 52, 53, 56, 58],
            description: "主要反映主观的身体不适感"
        },
        "强迫症状": {
            questions: [3, 9, 10, 28, 38, 45, 46, 51, 55, 65],
            description: "反映临床上的强迫症状群"
        },
        "人际关系敏感": {
            questions: [6, 21, 34, 36, 37, 41, 61, 69, 73],
            description: "反映个人的不自在感和自卑感"
        },
        "抑郁": {
            questions: [5, 14, 15, 20, 22, 26, 29, 30, 31, 32, 54, 71, 79],
            description: "反映抑郁症状群"
        },
        "焦虑": {
            questions: [2, 17, 23, 33, 39, 57, 72, 78, 80, 86],
            description: "反映焦虑症状群"
        },
        "敌对": {
            questions: [11, 24, 63, 67, 74, 81],
            description: "反映敌对表现"
        },
        "恐怖": {
            questions: [13, 25, 47, 50, 70, 75, 82],
            description: "反映恐怖症状群"
        },
        "偏执": {
            questions: [8, 18, 43, 68, 76, 83],
            description: "反映猜疑和关系妄想等"
        },
        "精神病性": {
            questions: [7, 16, 35, 62, 77, 84, 85, 87, 88, 90],
            description: "反映幻听、被控制感等精神病性症状"
        },
        "其他": {
            questions: [19, 44, 59, 60, 64, 66, 89],
            description: "反映睡眠和饮食情况"
        }
    },
    questions: [
        "头痛",
        "紧张时发抖，神经过敏",
        "不愉快的想法在脑中盘旋",
        "头昏或昏倒",
        "对异性的兴趣减退",
        "对旁人责备求全",
        "感到别人能控制您的思想",
        "责怪别人制造麻烦",
        "忘性大",
        "担心自己的衣饰整齐及仪态的端正",
        "容易烦恼和激动",
        "胸痛",
        "害怕空旷的场所或街道",
        "感到自己的精力下降，活动减慢",
        "想结束自己的生命",
        "听到旁人听不到的声音",
        "发抖",
        "感到大多数人都不可信任",
        "胃口不好",
        "容易哭泣",
        "同异性相处时感到害羞不自在",
        "感到别人对您不公正",
        "突然感到惊恐，无缘无故地害怕",
        "感到情绪失控，脾气爆发",
        "怕单独出门",
        "经常责怪自己",
        "腰痛",
        "感到难以完成任务",
        "感到孤独",
        "感到苦闷",
        "过分担忧",
        "对事物不感兴趣",
        "感到害怕",
        "您的感情容易受到伤害",
        "旁人能知道您的私下想法",
        "感到别人不理解您、不同情您",
        "感到人们对您不友好，不喜欢您",
        "做事必须做得很慢以保证做得正确",
        "心跳得很厉害",
        "恶心或胃部不舒服",
        "感到比不上他人",
        "肌肉酸痛",
        "感到有人在监视您、谈论您",
        "难以入睡",
        "必须反复检查门窗或煤气开关",
        "难以做出日常决定",
        "害怕乘坐公共交通（如地铁、公交）",
        "呼吸有困难",
        "一阵阵发冷或发热",
        "因为感到害怕而避开某些东西、场合或活动",
        "脑子变空了",
        "身体发麻或刺痛",
        "喉咙有梗塞感",
        "感到前途没有希望",
        "不能集中注意力",
        "感到身体的某一部分软弱无力",
        "感到紧张或容易紧张",
        "感到手或脚发重",
        "想到死亡的事",
        "吃得太多",
        "当别人看着您或谈论您时感到不自在",
        "出现不属于您自己的想法或冲动",
        "有攻击他人的冲动或想法",
        "比平时早醒且难以再次入睡",
        "必须反复洗手、确认或计数",
        "睡眠质量差，多梦易醒",
        "有破坏物品的强烈冲动",
        "有他人无法理解的想法或信念",
        "对他人的言行过度敏感",
        "在商店或电影院等人多的地方感到不自在",
        "感到任何事情都很困难",
        "一阵阵恐惧或惊恐",
        "感到公共场合吃东西很不舒服",
        "经常与人争论",
        "单独一人时神经很紧张",
        "别人对您的成绩没有做出恰当的评价",
        "即使和别人在一起也感到孤单",
        "感到坐立不安心神不定",
        "感到自己毫无价值",
        "感到熟悉的事物变得陌生或不真实",
        "大声喊叫或摔东西",
        "害怕在公共场合昏倒",
        "感到别人在占您的便宜",
        "为一些性方面的事情而苦恼",
        "感到自己应该为过错受到惩罚",
        "感到必须赶快把事情做完",
        "感到自己身体有严重疾病",
        "从未感到与任何人亲近",
        "感到自己有罪或犯错",
        "感到自己的精神有问题"
    ],
    answerOptions: [
        { value: 1, label: "没有", description: "没有症状" },
        { value: 2, label: "很轻", description: "症状轻微，不影响正常生活" },
        { value: 3, label: "中等", description: "症状中等，有些影响生活" },
        { value: 4, label: "偏重", description: "症状较重，影响较大" },
        { value: 5, label: "严重", description: "症状严重，影响严重" }
    ]
};

// 测评数据集合
const ASSESSMENT_DATA = {
    scl90: SCL90_DATA
};

// 获取测评数据
function getAssessmentData(type) {
    return ASSESSMENT_DATA[type] || SCL90_DATA;
}

// 获取问题分类
function getQuestionCategory(type, questionIndex) {
    const data = getAssessmentData(type);
    if (type === 'scl90' && data.dimensions) {
        for (const [category, info] of Object.entries(data.dimensions)) {
            if (info.questions.includes(questionIndex + 1)) {
                return category;
            }
        }
    }
    return '综合测评';
}

// 获取测评类型配置
function getAssessmentConfig(type) {
    const data = getAssessmentData(type);
    return {
        type: type,
        title: data.title,
        description: data.description,
        estimatedTime: data.estimatedTime,
        questionCount: data.questionCount,
        icon: data.icon,
        dimensions: data.dimensions || {},
        questions: data.questions,
        answerOptions: data.answerOptions
    };
}
