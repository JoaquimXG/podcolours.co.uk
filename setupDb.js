print("==== Setting up Database ====");
databaseName = db;

db.dropDatabase();
print(`Created ${databaseName} database`);

db.users.insert({
    name: "Nick Torres",
    university: "Robert Gordon University",
    department: "School of Computing",
    username: "user",
    password: "password",
    dateTaken: Date(),
});

db.users.insert({
    name: "Nyla Suarez",
    university: "Robert Gordon University",
    department: "School of Computing",
    username: "testInProgress",
    password: "testInProgress",
    cards: {
        red: [
            { Impatient: "false" },
            { "Fast paced": "false" },
            { Inquisitive: "false" },
            { Achiever: "false" },
            { Driving: "false" },
        ],
        green: [
            { Deliberate: "true" },
            { Dependable: "true" },
            { Possessive: "false" },
            { Methodical: "false" },
            { Caring: "false" },
            { "Good Listener": "false" },
            { Calm: "false" },
            { "Level Headed": "false" },
        ],
        yellow: [
            { Networker: "true" },
            { Sociable: "true" },
            { Curious: "true" },
            { Animated: "true" },
            { Excitable: "false" },
            { Talkative: "false" },
            { Adaptable: "false" },
            { Enthusiastic: "false" },
            { Persuasive: "false" },
            { Spontaneous: "false" },
        ],
        blue: [
            { "Forward Planning": "true" },
            { Prepared: "false" },
            { Systematic: "false" },
            { Analytical: "false" },
            { Logical: "false" },
            { Careful: "false" },
            { Accurate: "false" },
            { Serious: "false" },
        ],
    },
});

db.users.insert({
    name: "Calum Ramirez",
    university: "Robert Gordon University",
    department: "School of Computing",
    username: "testComplete",
    password: "testComplete",
    dateTaken: Date(),
    cards: {
        red: [
            { Independent: "true" },
            { Competitive: "true" },
            { Driving: "true" },
            { Candid: "true" },
            { "Easily bored": "false" },
            { "Dislikes Detail": "false" },
            { Decisive: "false" },
            { Achiever: "false" },
            { Focussed: "false" },
            { "Takes Charge": "false" },
            { "Gets results": "false" },
            { Assertive: "false" },
            { "Strong Willed": "false" },
            { Impulsive: "false" },
            { "Fast paced": "false" },
            { "Self-Starter": "false" },
            { Direct: "false" },
            { Impatient: "false" },
            { Forceful: "false" },
            { Inquisitive: "false" },
        ],
        green: [
            { Patient: "true" },
            { Deliberate: "true" },
            { Possessive: "true" },
            { "Dislike change": "true" },
            { Helpful: "false" },
            { Considerate: "false" },
            { Stubborn: "false" },
            { Calm: "false" },
            { "Level Headed": "false" },
            { Loyal: "false" },
            { Agreeable: "false" },
            { Caring: "false" },
            { Accommodating: "false" },
            { Methodical: "false" },
            { Dependable: "false" },
            { Harmonious: "false" },
            { "Work at own pace": "false" },
            { "Good Listener": "false" },
            { Supportive: "false" },
            { Kind: "false" },
        ],
        yellow: [
            { Optimistic: "true" },
            { Networker: "true" },
            { "Big picture": "true" },
            { Excitable: "true" },
            { Energetic: "true" },
            { Spontaneous: "false" },
            { Collaborative: "false" },
            { Talkative: "false" },
            { "People Oriented": "false" },
            { Adaptable: "false" },
            { Influencer: "false" },
            { Curious: "false" },
            { Friendly: "false" },
            { Persuasive: "false" },
            { Imaginative: "false" },
            { Enthusiastic: "false" },
            { "Motivated by recognition": "false" },
            { Animated: "false" },
            { Sociable: "false" },
            { "Team Worker": "false" },
        ],
        blue: [
            { Precise: "true" },
            { Perfectionist: "true" },
            { Accurate: "true" },
            { "Task Oriented": "true" },
            { "Forward Planning": "true" },
            { Logical: "true" },
            { Persistent: "true" },
            { Procrastinates: "false" },
            { "Systems and Procedures": "false" },
            { "Likes Order": "false" },
            { "Attention to Detail": "false" },
            { Reflective: "false" },
            { Analytical: "false" },
            { Serious: "false" },
            { "Highly Organised": "false" },
            { Systematic: "false" },
            { "Rule Compliant": "false" },
            { Careful: "false" },
            { "Avoids Risk": "false" },
            { Prepared: "false" },
        ],
    },
});

db.content.insert({
    _id: "/",
    content: {
        header: {
            image: "/img/paintSplashLogoTextToRight.png",
        },
        footer: {
            copyright: "© 2021 POD Colours All rights reserved.",
            links: [
                {
                    text: "Home",
                    href: "/",
                },
                {
                    text: "Personality Test",
                    href: "/test",
                },
            ],
        },
        hero: {
            title: "Welcome to POD Colours",
            text:
                "POD Colours is a unique personality evaluation test. The POD Colours tool supports individuals and teams to appreciate differences in personality by en-hancing self-awareness, leading to a deeper understanding of oneself and other people. The POD Colours tool is based on psychological research, and provides an indication of your key strengths and potential barriers to success.",
            image: "/img/logo.png",
        },
        redSection: {
            title: "What is POD Colours?",
            text:
                "POD Colours is a tool which supports individuals and teams, helping them to appreciate differences in personality by en-hancing self-awareness, leading to a deeper understanding of oneself and other people.",
        },
        teamPhotoSection: {
            title: "We believe in POD Colours",
            textOne:
                "Understanding the key personality differences between ourselves and the people we interact with helps us to realise how they see us; why they act the way they do; the impact that we have on them and how to get the most out of our interactions by capitalising on strengths.",
            textTwo:
                "The POD Colours tool is based on psychological research, and provide genuine insight into your key areas of strength and potential barriers to success.",
            quoteAuthor: " Tina McGregor, Leadership Development Specialist",
        },
        testimonials: [
            {
                text:
                    "My team have seen amazing results already. Needless to say we are extremely satisfied",
                name: "Jody Heath",
            },
            {
                text:
                    "I love how extensive the profile is! It will really help me understand myself better.",
                name: "Ariya Sanders",
            },
            {
                text: "Genuinely insightful and an interesting read.",
                name: "Jim Millar",
            },
            {
                text: "A profound assessment of my personality.",
                name: "Tony Crouch",
            },
            {
                text: "More accurate than I could have hoped for",
                name: "Jana Holder",
            },
        ],
        callToAction: {
            title: "Ready to get started?",
            text:
                "We'll guide you every step of the way towards your self improvement.",
        },
    },
});

print("==== Database Setup Complete ====\n\n");
