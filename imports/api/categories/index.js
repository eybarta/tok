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
                value: 'add_changingSpread'
            },
            {
                label: 'חיסור הפרש משתנה',
                value: 'subtract_changingSpread'
            },
            {
                label: 'חיבור כל זוג',
                value: 'add_everyOther'
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