print("==== Setting up Database ====");
databaseName = db;

db.dropDatabase();
print(`Created ${databaseName} database`);

db.users.insert({
    name: "Nick Torres",
    university: "Robert Gordon University",
    department: "School of Computing",
    username: "exampleUserWithDetails",
    password: "exampleUserWithDetails",
});

db.users.insert({
    username: "testNotStarted",
    password: "testNotStarted",
    cards: false,
    testState: { complete: false, result: null },
    lastUpdate: 1617481830775,
});

db.users.insert({
    username: "testStarted",
    password: "testStarted",
    cards: {
        kept: [{ id: "Optimistic", color: "yellow" }],
        discarded: [{ id: "Level Headed", color: "green" }],
        undecided: [{ id: "Adaptable", color: "yellow" }],
        next: { id: "Takes Charge", color: "red" },
    },
    testState: { complete: false, result: null },
    lastUpdate: 1617480955852,
});

db.users.insert({
    username: "testInProgress",
    password: "testInProgress",
    cards: {
        kept: [
            { id: "Candid", color: "red" },
            { id: "Energetic", color: "yellow" },
            { id: "People Oriented", color: "yellow" },
            { id: "Systematic", color: "blue" },
            { id: "Level Headed", color: "green" },
            { id: "Decisive", color: "red" },
            { id: "Fast paced", color: "red" },
            { id: "Logical", color: "blue" },
            { id: "Calm", color: "green" },
            { id: "Inquisitive", color: "red" },
        ],
        discarded: [
            { id: "Imaginative", color: "yellow" },
            { id: "Task Oriented", color: "blue" },
            { id: "Dislikes Detail", color: "red" },
            { id: "Patient", color: "green" },
            { id: "Work at own pace", color: "green" },
            { id: "Direct", color: "red" },
            { id: "Agreeable", color: "green" },
            { id: "Procrastinates", color: "blue" },
            { id: "Impatient", color: "red" },
            { id: "Networker", color: "yellow" },
            { id: "Dependable", color: "green" },
            { id: "Big picture", color: "yellow" },
            { id: "Serious", color: "blue" },
            { id: "Dislike change", color: "green" },
            { id: "Precise", color: "blue" },
            { id: "Focussed", color: "red" },
            { id: "Persistent", color: "blue" },
            { id: "Reflective", color: "blue" },
            { id: "Easily bored", color: "red" },
            { id: "Methodical", color: "green" },
            { id: "Attention to Detail", color: "blue" },
            { id: "Supportive", color: "green" },
            { id: "Accurate", color: "blue" },
            { id: "Rule Compliant", color: "blue" },
            { id: "Analytical", color: "blue" },
            { id: "Talkative", color: "yellow" },
            { id: "Persuasive", color: "yellow" },
            { id: "Independent", color: "red" },
            { id: "Self-Starter", color: "red" },
            { id: "Sociable", color: "yellow" },
        ],
        undecided: [],
        next: { id: "Influencer", color: "yellow" },
    },
    testState: { complete: false, result: null },
    lastUpdate: 1617481595455,
});

db.users.insert({
    username: "testComplete",
    password: "testComplete",
    cards: {
        kept: [
            { id: "Networker", color: "yellow" },
            { id: "Excitable", color: "yellow" },
            { id: "Accurate", color: "blue" },
            { id: "Considerate", color: "green" },
            { id: "Reflective", color: "blue" },
            { id: "Energetic", color: "yellow" },
            { id: "Dislikes Detail", color: "red" },
            { id: "Independent", color: "red" },
            { id: "Direct", color: "red" },
            { id: "Optimistic", color: "yellow" },
            { id: "Calm", color: "green" },
            { id: "Impatient", color: "red" },
            { id: "Achiever", color: "red" },
            { id: "Team Worker", color: "yellow" },
            { id: "Spontaneous", color: "yellow" },
            { id: "Fast paced", color: "red" },
            { id: "Systematic", color: "blue" },
            { id: "Competitive", color: "red" },
            { id: "Logical", color: "blue" },
            { id: "Deliberate", color: "green" },
        ],
        discarded: [
            { id: "Gets results", color: "red" },
            { id: "Careful", color: "blue" },
            { id: "Imaginative", color: "yellow" },
            { id: "Friendly", color: "yellow" },
            { id: "Persistent", color: "blue" },
            { id: "Supportive", color: "green" },
            { id: "Driving", color: "red" },
            { id: "Rule Compliant", color: "blue" },
            { id: "Candid", color: "red" },
            { id: "Attention to Detail", color: "blue" },
            { id: "Kind", color: "green" },
            { id: "Takes Charge", color: "red" },
            { id: "Impulsive", color: "red" },
            { id: "Serious", color: "blue" },
            { id: "Dislike change", color: "green" },
            { id: "Level Headed", color: "green" },
            { id: "Motivated by recognition", color: "yellow" },
            { id: "Curious", color: "yellow" },
            { id: "Stubborn", color: "green" },
            { id: "Caring", color: "green" },
            { id: "Dependable", color: "green" },
            { id: "Persuasive", color: "yellow" },
            { id: "Systems and Procedures", color: "blue" },
            { id: "Highly Organised", color: "blue" },
            { id: "Procrastinates", color: "blue" },
            { id: "Enthusiastic", color: "yellow" },
            { id: "People Oriented", color: "yellow" },
            { id: "Influencer", color: "yellow" },
            { id: "Strong Willed", color: "red" },
            { id: "Focussed", color: "red" },
            { id: "Perfectionist", color: "blue" },
            { id: "Prepared", color: "blue" },
            { id: "Helpful", color: "green" },
            { id: "Accommodating", color: "green" },
            { id: "Talkative", color: "yellow" },
            { id: "Patient", color: "green" },
            { id: "Harmonious", color: "green" },
            { id: "Collaborative", color: "yellow" },
            { id: "Easily bored", color: "red" },
            { id: "Forceful", color: "red" },
            { id: "Assertive", color: "red" },
            { id: "Good Listener", color: "green" },
            { id: "Loyal", color: "green" },
            { id: "Avoids Risk", color: "blue" },
            { id: "Likes Order", color: "blue" },
            { id: "Forward Planning", color: "blue" },
            { id: "Analytical", color: "blue" },
            { id: "Self-Starter", color: "red" },
            { id: "Possessive", color: "green" },
            { id: "Sociable", color: "yellow" },
            { id: "Work at own pace", color: "green" },
            { id: "Agreeable", color: "green" },
            { id: "Inquisitive", color: "red" },
            { id: "Adaptable", color: "yellow" },
            { id: "Decisive", color: "red" },
            { id: "Precise", color: "blue" },
            { id: "Big picture", color: "yellow" },
            { id: "Methodical", color: "green" },
            { id: "Task Oriented", color: "blue" },
            { id: "Animated", color: "yellow" },
        ],
        undecided: [],
        next: false,
        colorCounts: { red: 7, blue: 4, green: 3, yellow: 6 },
    },
    testState: { complete: true, result: "red" },
    lastUpdate: 1617480796130,
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
                {
                    text: "Profile",
                    href: "/profile",
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
