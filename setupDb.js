print("==== Setting up Database ====");
databaseName = db;

db.dropDatabase();
print(`Created ${databaseName} database`);

db.users.insert({
    name: "Test Not Started",
    department: "Computing",
    university: "Robert Gordon University",
    email: "test@notstarted.com",
    password: "test@notstarted.com",
    cards: false,
    testState: { complete: false, result: null },
    lastUpdate: 1617569642314,
});

db.users.insert({
    name: "Test Started",
    department: "Computing",
    university: "Robert Gordon University",
    email: "test@started.com",
    password: "test@started.com",
    cards: {
        kept: [{ id: "Precise", color: "blue" }],
        discarded: [{ id: "Assertive", color: "red" }],
        undecided: [{ id: "Focussed", color: "red" }],
        next: { id: "Avoids Risk", color: "blue" },
    },
    testState: { complete: false, result: null },
    lastUpdate: 1617569586597,
});

db.users.insert({
    name: "Test In Progress",
    department: "Computing",
    university: "Robert Gordon University",
    email: "test@inprogress.com",
    password: "test@inprogress.com",
    cards: {
        kept: [
            { id: "Work at own pace", color: "green" },
            { id: "Caring", color: "green" },
            { id: "Direct", color: "red" },
            { id: "Stubborn", color: "green" },
            { id: "Influencer", color: "yellow" },
            { id: "Impatient", color: "red" },
            { id: "Procrastinates", color: "blue" },
            { id: "Animated", color: "yellow" },
            { id: "Gets results", color: "red" },
        ],
        discarded: [
            { id: "Dislike change", color: "green" },
            { id: "Accurate", color: "blue" },
            { id: "Careful", color: "blue" },
            { id: "Big picture", color: "yellow" },
            { id: "Talkative", color: "yellow" },
            { id: "Enthusiastic", color: "yellow" },
            { id: "Persuasive", color: "yellow" },
            { id: "Precise", color: "blue" },
            { id: "Kind", color: "green" },
            { id: "Possessive", color: "green" },
            { id: "Dislikes Detail", color: "red" },
            { id: "Spontaneous", color: "yellow" },
            { id: "Friendly", color: "yellow" },
            { id: "Imaginative", color: "yellow" },
            { id: "Accommodating", color: "green" },
            { id: "Systematic", color: "blue" },
            { id: "Strong Willed", color: "red" },
            { id: "Task Oriented", color: "blue" },
            { id: "Highly Organised", color: "blue" },
            { id: "Deliberate", color: "green" },
            { id: "Optimistic", color: "yellow" },
            { id: "Logical", color: "blue" },
            { id: "Forward Planning", color: "blue" },
            { id: "Reflective", color: "blue" },
            { id: "Candid", color: "red" },
            { id: "Competitive", color: "red" },
            { id: "Inquisitive", color: "red" },
            { id: "Considerate", color: "green" },
            { id: "Curious", color: "yellow" },
        ],
        undecided: [
            { id: "Helpful", color: "green" },
            { id: "Harmonious", color: "green" },
            { id: "Achiever", color: "red" },
        ],
        next: { id: "Patient", color: "green" },
    },
    testState: { complete: false, result: null },
    lastUpdate: 1617569748293,
});

db.users.insert({
    name: "Test Complete",
    department: "Computing",
    university: "Robert Gordon University",
    email: "test@complete.com",
    password: "test@complete.com",
    cards: {
        kept: [
            { id: "Highly Organised", color: "blue" },
            { id: "Rule Compliant", color: "blue" },
            { id: "Logical", color: "blue" },
            { id: "Collaborative", color: "yellow" },
            { id: "Direct", color: "red" },
            { id: "Harmonious", color: "green" },
            { id: "Dependable", color: "green" },
            { id: "Likes Order", color: "blue" },
            { id: "Gets results", color: "red" },
            { id: "Energetic", color: "yellow" },
            { id: "Enthusiastic", color: "yellow" },
            { id: "Patient", color: "green" },
            { id: "Systems and Procedures", color: "blue" },
            { id: "Stubborn", color: "green" },
            { id: "Work at own pace", color: "green" },
            { id: "Curious", color: "yellow" },
            { id: "Task Oriented", color: "blue" },
            { id: "People Oriented", color: "yellow" },
            { id: "Considerate", color: "green" },
            { id: "Animated", color: "yellow" },
        ],
        discarded: [
            { id: "Impulsive", color: "red" },
            { id: "Spontaneous", color: "yellow" },
            { id: "Loyal", color: "green" },
            { id: "Analytical", color: "blue" },
            { id: "Accurate", color: "blue" },
            { id: "Focussed", color: "red" },
            { id: "Networker", color: "yellow" },
            { id: "Driving", color: "red" },
            { id: "Dislikes Detail", color: "red" },
            { id: "Deliberate", color: "green" },
            { id: "Persuasive", color: "yellow" },
            { id: "Imaginative", color: "yellow" },
            { id: "Decisive", color: "red" },
            { id: "Calm", color: "green" },
            { id: "Dislike change", color: "green" },
            { id: "Persistent", color: "blue" },
            { id: "Accommodating", color: "green" },
            { id: "Friendly", color: "yellow" },
            { id: "Forceful", color: "red" },
            { id: "Serious", color: "blue" },
            { id: "Adaptable", color: "yellow" },
            { id: "Methodical", color: "green" },
            { id: "Impatient", color: "red" },
            { id: "Big picture", color: "yellow" },
            { id: "Reflective", color: "blue" },
            { id: "Forward Planning", color: "blue" },
            { id: "Inquisitive", color: "red" },
            { id: "Easily bored", color: "red" },
            { id: "Excitable", color: "yellow" },
            { id: "Attention to Detail", color: "blue" },
            { id: "Candid", color: "red" },
            { id: "Self-Starter", color: "red" },
            { id: "Strong Willed", color: "red" },
            { id: "Sociable", color: "yellow" },
            { id: "Prepared", color: "blue" },
            { id: "Assertive", color: "red" },
            { id: "Influencer", color: "yellow" },
            { id: "Good Listener", color: "green" },
            { id: "Fast paced", color: "red" },
            { id: "Team Worker", color: "yellow" },
            { id: "Achiever", color: "red" },
            { id: "Agreeable", color: "green" },
            { id: "Talkative", color: "yellow" },
            { id: "Procrastinates", color: "blue" },
            { id: "Independent", color: "red" },
            { id: "Caring", color: "green" },
            { id: "Motivated by recognition", color: "yellow" },
            { id: "Precise", color: "blue" },
            { id: "Possessive", color: "green" },
            { id: "Kind", color: "green" },
            { id: "Competitive", color: "red" },
            { id: "Systematic", color: "blue" },
            { id: "Level Headed", color: "green" },
            { id: "Perfectionist", color: "blue" },
            { id: "Optimistic", color: "yellow" },
            { id: "Helpful", color: "green" },
            { id: "Takes Charge", color: "red" },
            { id: "Careful", color: "blue" },
            { id: "Avoids Risk", color: "blue" },
            { id: "Supportive", color: "green" },
        ],
        undecided: [],
        next: false,
        colorCounts: { red: 2, blue: 6, green: 6, yellow: 6 },
    },
    testState: { complete: true, result: "blue", time: 1617569470802 },
    lastUpdate: 1617569470802,
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
