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
    username: "testStarted",
    password: "testStarted",
    cards: {
        kept: [{ id: "Collaborative", color: "yellow" }],
        discarded: [{ id: "Deliberate", color: "green" }],
        undecided: [{ id: "Talkative", color: "yellow" }],
        next: { id: "Fast paced", color: "red" },
    },
    testState: { complete: "false", result: "" },
    lastUpdate: 1617398323978,
});

db.users.insert({
    username: "testInProgress",
    password: "testInProgress",
    testState: "",
    lastUpdate: 1617398683642,
    cards: {
        kept: [
            { id: "Methodical", color: "green" },
            { id: "Collaborative", color: "yellow" },
            { id: "Imaginative", color: "yellow" },
            { id: "Kind", color: "green" },
            { id: "Persistent", color: "blue" },
            { id: "Calm", color: "green" },
            { id: "Harmonious", color: "green" },
            { id: "Enthusiastic", color: "yellow" },
            { id: "Rule Compliant", color: "blue" },
            { id: "Decisive", color: "red" },
        ],
        discarded: [
            { id: "Team Worker", color: "yellow" },
            { id: "People Oriented", color: "yellow" },
            { id: "Accommodating", color: "green" },
            { id: "Direct", color: "red" },
            { id: "Big picture", color: "yellow" },
            { id: "Dislike change", color: "green" },
            { id: "Gets results", color: "red" },
            { id: "Level Headed", color: "green" },
            { id: "Likes Order", color: "blue" },
            { id: "Self-Starter", color: "red" },
            { id: "Careful", color: "blue" },
            { id: "Logical", color: "blue" },
            { id: "Strong Willed", color: "red" },
            { id: "Excitable" },
            { id: "Impulsive", color: "red" },
            { id: "Accurate", color: "blue" },
            { id: "Caring", color: "green" },
            { id: "Assertive", color: "red" },
            { id: "Optimistic", color: "yellow" },
            { id: "Helpful", color: "green" },
            { id: "Loyal", color: "green" },
            { id: "Perfectionist", color: "blue" },
            { id: "Precise", color: "blue" },
            { id: "Supportive", color: "green" },
            { id: "Avoids Risk", color: "blue" },
            { id: "Task Oriented", color: "blue" },
            { id: "Patient", color: "green" },
            { id: "Reflective", color: "blue" },
            { id: "Systems and Procedures", color: "blue" },
            { id: "Adaptable", color: "yellow" },
        ],
        undecided: [
            { id: "Possessive", color: "green" },
            { id: "Friendly", color: "yellow" },
            { id: "Driving", color: "red" },
            { id: "Systematic", color: "blue" },
        ],
        next: { id: "Independent", color: "red" },
    },
});

db.users.insert({
    username: "testComplete",
    password: "testComplete",
    testState: { complete: "true", result: "red" },
    lastUpdate: 1617400238046,
    cards: {
        kept: [
            { id: "Inquisitive", color: "red" },
            { id: "Focussed", color: "red" },
            { id: "Forward Planning", color: "blue" },
            { id: "Influencer", color: "yellow" },
            { id: "Rule Compliant", color: "blue" },
            { id: "People Oriented", color: "yellow" },
            { id: "Agreeable", color: "green" },
            { id: "Kind", color: "green" },
            { id: "Procrastinates", color: "blue" },
            { id: "Accurate", color: "blue" },
            { id: "Calm", color: "green" },
            { id: "Precise", color: "blue" },
            { id: "Competitive", color: "red" },
            { id: "Spontaneous", color: "yellow" },
            { id: "Easily bored", color: "red" },
            { id: "Patient", color: "green" },
            { id: "Helpful", color: "green" },
            { id: "Gets results", color: "red" },
            { id: "Self-Starter", color: "red" },
            { id: "Impatient", color: "red" },
        ],
        discarded: [
            { id: "Collaborative", color: "yellow" },
            { id: "Systematic", color: "blue" },
            { id: "Energetic", color: "yellow" },
            { id: "Good Listener", color: "green" },
            { id: "Independent", color: "red" },
            { id: "Driving", color: "red" },
            { id: "Methodical", color: "green" },
            { id: "Big picture", color: "yellow" },
            { id: "Imaginative", color: "yellow" },
            { id: "Highly Organised", color: "blue" },
            { id: "Dislike change", color: "green" },
            { id: "Dislikes Detail", color: "red" },
            { id: "Persuasive", color: "yellow" },
            { id: "Optimistic", color: "yellow" },
            { id: "Motivated by recognition", color: "yellow" },
            { id: "Takes Charge", color: "red" },
            { id: "Accommodating", color: "green" },
            { id: "Stubborn", color: "green" },
            { id: "Logical", color: "blue" },
            { id: "Level Headed", color: "green" },
            { id: "Animated", color: "yellow" },
            { id: "Forceful", color: "red" },
            { id: "Adaptable", color: "yellow" },
            { id: "Prepared", color: "blue" },
            { id: "Strong Willed", color: "red" },
            { id: "Sociable", color: "yellow" },
            { id: "Harmonious", color: "green" },
            { id: "Likes Order", color: "blue" },
            { id: "Considerate", color: "green" },
            { id: "Networker", color: "yellow" },
            { id: "Caring", color: "green" },
            { id: "Loyal", color: "green" },
            { id: "Enthusiastic", color: "yellow" },
            { id: "Friendly", color: "yellow" },
            { id: "Team Worker", color: "yellow" },
            { id: "Deliberate", color: "green" },
            { id: "Work at own pace", color: "green" },
            { id: "Curious", color: "yellow" },
            { id: "Fast paced", color: "red" },
            { id: "Assertive", color: "red" },
            { id: "Direct", color: "red" },
            { id: "Analytical", color: "blue" },
            { id: "Dependable", color: "green" },
            { id: "Careful", color: "blue" },
            { id: "Reflective", color: "blue" },
            { id: "Attention to Detail", color: "blue" },
            { id: "Supportive", color: "green" },
            { id: "Avoids Risk", color: "blue" },
            { id: "Serious", color: "blue" },
            { id: "Impulsive", color: "red" },
            { id: "Talkative", color: "yellow" },
            { id: "Decisive", color: "red" },
            { id: "Candid", color: "red" },
            { id: "Achiever", color: "red" },
            { id: "Perfectionist", color: "blue" },
            { id: "Task Oriented", color: "blue" },
            { id: "Systems and Procedures", color: "blue" },
            { id: "Persistent", color: "blue" },
            { id: "Possessive", color: "green" },
            { id: "Excitable", color: "yellow" },
        ],
        next: "false",
        colorCounts: { red: "7", blue: "4", green: "5", yellow: "3" },
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
