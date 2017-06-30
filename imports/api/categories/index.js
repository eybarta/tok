export const categories = [
    {
        label: 'סדרות',
        value: 'series',
        children: [
            {
                label: 'חיבור',
                value: 'add',
                level: 1
            },
            {
                label: 'חיסור',
                value: 'subtract',
                level: 1
            },
            {
                label: 'כפל',
                value: 'multiply',
                level:2
            },
            {
                label: 'חילוק',
                value: 'divide',
                level:2
                
            },
            {
                label: 'חיבור הפרש משתנה',
                value: 'add_shift',
                level:3
            },
            {
                label: 'חיסור הפרש משתנה',
                value: 'subtract_shift',
                level:3
            },
            {
                label: 'כפל הפרש משתנה',
                value: 'multiply_shift',
                level:4
                
            },
            {
                label: 'חיבור כל זוג',
                value: 'add_double',
                level:1
            },
            {
                label: 'חיסור כל זוג',
                value: 'subtract_double',
                level:1
            },
            {
                label: 'כפל כל זוג',
                value: 'multiply_double',
                level:4
            },
            {
                label: 'חילוק כל זוג',
                value: 'divide_double',
                level:5
            },
            {
                label: 'חיבור חיסור כפל כל זוג',
                value: 'add_multiply_double',
                level: 3
            },
            {
                label: 'חיבור כפל כל זוג משתנה',
                value: 'add_multiply_shift_double',
                level:6
            },
            {
                label: 'כל שלישייה',
                value: 'all_triple',
                level: 4.5
            },
            {
                label: 'כל רביעיה',
                value: 'all_quad',
                level: 6
            },
            {
                label: 'הפרשי חזקות חיבור',
                value: 'add_power_shift',
                level: 7
            },
            {
                label: 'הפרשי חזקות כפל',
                value: 'multiply_power_shift',
                level: 8
            },
             {
                label: 'פיבונצ׳י',
                value: 'fibonacci',
                level:3
            }

            
        ]
    },
    {
        label: 'מטריצות',
        value: 'matrices',
        requirement: 'hasMatrices'
    },
    {
        label: 'מילוי הוראות',
        value: 'instruct',
        children: [
            {
                label: 'סידורי אותיות',
                value: 'letter_arrange'
            },
            {
                label: 'סידורי שמות',
                value: 'name_arrange'
            },
            {
                label: 'אותיות ומספרים',
                value: 'letters_numbers'
            },
            {
                label: 'מצפן',
                value: 'compass'
            },
            {
                label: 'שאלות מילון',
                value: 'dictionary'
            },
            {
                label: 'לוגיקה מילולית',
                value: 'word_logic'
            },
            {
                label: 'קריאת נתונים',
                value: 'analyze'
            },
        ],
        requirement: 'hasInstruct'
    },
    {
        label: 'עברית',
        value: 'hebrew',
        children: [
            {
                label: 'אוצר מילים',
                value: 'vocabulary'
            },
            {
                label: 'שגיאות כתיב',
                value: 'misspelling'
            },
            {
                label: 'השלמת משפטים',
                value: 'completion'
            },
            {
                label: 'ניסוח נכון',
                value: 'wording'
            },
            {
                label: 'הבנת הנקרא',
                value: 'comprehension'
            }
            
        ],
        requirement: 'hasHebrew'
    },
    {
        label: 'מכינה',
        value: 'prepare'
    },
    {
        label: 'מבחן מלא',
        value: 'fulltest'
    }
]

const categoryMenu = {
    key: 'category',
    items: categories
}

export const testFormats = [
    // {
    //     label:'תרגול',
    //     value: 'practice'
    // },
    {
        label: 'מבחן',
        value: 'autotest',
        menu: [{
    key: 'category',
    name: 'autotest',
    items: categories
}],
        type: 'format'
    },
    {
        label: 'מבחנים קודמים',
        value: 'testhistory',
        menu: [
            {
    key: 'category',
    name: 'category',
    items: categories
},
            {
                key: 'namelist',
                name:'testhistory',
                items: "userTestHistory" // getter
            }
        ],
        requirement: "userTestHistory"   // getter
    },
    {
        label: 'מבחנים קבועים',
        value: 'fixedtest',
        menu: [
            {
                key: 'category',
                name: 'category',
                items: categories
            },
            {
                key: 'namelist',
                name:'fixedtest',
                items: "fixedTestsList" // getter
            }
        ],
        requirement: "hasFixedTestsList"
         
    },
    {
        label: 'מבחן אדפטיבי',
        value: 'adaptivetest',
        menu: [{
    key: 'category',
    name: 'adaptivetest',
    items: categories
}]
    }
]


// Questions