export const categories = [
    {
        label: 'סדרות',
        value: 'series',
        children: [
            {
                label: 'חיבור',
                value: 'add'
            },
            {
                label: 'חיסור',
                value: 'subtract'
            },
            {
                label: 'כפל',
                value: 'multiply'
            },
            {
                label: 'חילוק',
                value: 'divide'
            },
            {
                label: 'חיבור הפרש משתנה',
                value: 'add_shift'
            },
            {
                label: 'חיסור הפרש משתנה',
                value: 'subtract_shift'
            },
            {
                label: 'כפל הפרש משתנה',
                value: 'multiply_shift'
            },
            {
                label: 'חיבור כל זוג',
                value: 'add_double'
            },
            {
                label: 'חיסור כל זוג',
                value: 'subtract_double'
            },
            {
                label: 'כפל כל זוג',
                value: 'multiply_double'
            },
            {
                label: 'חילוק כל זוג',
                value: 'divide_double'
            },
            {
                label: 'חיבור חיסור כפל כל זוג',
                value: 'add_multiply_double'
            },
            {
                label: 'חיבור כפל כל זוג משתנה',
                value: 'add_multiply_shift_double'
            },
            {
                label: 'כל שלישייה',
                value: 'all_triple'
            },
            {
                label: 'כל רביעיה',
                value: 'all_quad'
            },
            {
                label: 'הפרשי חזקות חיבור',
                value: 'add_power_shift'
            },
            {
                label: 'הפרשי חזקות כפל',
                value: 'multiply_power_shift'
            },
             {
                label: 'פיבונצ׳י',
                value: 'fibonacci'
            }

            
        ]
    },
    {
        label: 'מטריצות',
        value: 'matrices'
    },
    {
        label: 'מילוי הוראות',
        value: 'instruct'
    },
    {
        label: 'עברית',
        value: 'hebrew'
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

export const testTypes = [
    {
        label:'תרגול',
        value: 'practice'
    },
    {
        label: 'מבחנים',
        value: 'autotest'
    },
    {
        label: 'מבחנים קבועים',
        value: 'fixedtest'
    },
    {
        label: 'מבחן אדפטיבי',
        value: 'adaptivetest'
    }
]