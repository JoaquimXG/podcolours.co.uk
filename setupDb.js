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
    username: "testComplete",
    password: "testComplete",
    dateTaken: Date(),
    cards: {
        red: [
            { id: "Easily bored", isKept: "true" },
            { id: "Inquisitive", isKept: "true" },
            { id: "Impulsive", isKept: "true" },
            { id: "Assertive", isKept: "true" },
            { id: "Achiever", isKept: "true" },
            { id: "Dislikes Detail", isKept: "true" },
            { id: "Takes Charge", isKept: "false" },
            { id: "Fast paced", isKept: "false" },
            { id: "Decisive", isKept: "false" },
            { id: "Impatient", isKept: "false" },
            { id: "Candid", isKept: "false" },
            { id: "Forceful", isKept: "false" },
            { id: "Gets results", isKept: "false" },
            { id: "Self-Starter", isKept: "false" },
            { id: "Direct", isKept: "false" },
            { id: "Strong Willed", isKept: "false" },
            { id: "Driving", isKept: "false" },
            { id: "Competitive", isKept: "false" },
            { id: "Independent", isKept: "false" },
            { id: "Focussed", isKept: "false" },
        ],
        green: [
            { id: "Loyal", isKept: "true" },
            { id: "Methodical", isKept: "true" },
            { id: "Stubborn", isKept: "true" },
            { id: "Caring", isKept: "true" },
            { id: "Helpful", isKept: "true" },
            { id: "Calm", isKept: "false" },
            { id: "Good Listener", isKept: "false" },
            { id: "Deliberate", isKept: "false" },
            { id: "Kind", isKept: "false" },
            { id: "Supportive", isKept: "false" },
            { id: "Considerate", isKept: "false" },
            { id: "Level Headed", isKept: "false" },
            { id: "Dislike change", isKept: "false" },
            { id: "Harmonious", isKept: "false" },
            { id: "Work at own pace", isKept: "false" },
            { id: "Patient", isKept: "false" },
            { id: "Dependable", isKept: "false" },
            { id: "Agreeable", isKept: "false" },
            { id: "Accommodating", isKept: "false" },
            { id: "Possessive", isKept: "false" },
        ],
        yellow: [
            { id: "Talkative", isKept: "true" },
            { id: "Sociable", isKept: "true" },
            { id: "Enthusiastic", isKept: "true" },
            { id: "Excitable", isKept: "true" },
            { id: "Persuasive", isKept: "false" },
            { id: "Networker", isKept: "false" },
            { id: "Big picture", isKept: "false" },
            { id: "Motivated by recognition", isKept: "false" },
            { id: "Friendly", isKept: "false" },
            { id: "Animated", isKept: "false" },
            { id: "Collaborative", isKept: "false" },
            { id: "Optimistic", isKept: "false" },
            { id: "Adaptable", isKept: "false" },
            { id: "Team Worker", isKept: "false" },
            { id: "People Oriented", isKept: "false" },
            { id: "Curious", isKept: "false" },
            { id: "Energetic", isKept: "false" },
            { id: "Influencer", isKept: "false" },
            { id: "Imaginative", isKept: "false" },
            { id: "Spontaneous", isKept: "false" },
        ],
        blue: [
            { id: "Attention to Detail", isKept: "true" },
            { id: "Likes Order", isKept: "true" },
            { id: "Avoids Risk", isKept: "true" },
            { id: "Task Oriented", isKept: "true" },
            { id: "Systematic", isKept: "true" },
            { id: "Systems and Procedures", isKept: "false" },
            { id: "Procrastinates", isKept: "false" },
            { id: "Rule Compliant", isKept: "false" },
            { id: "Prepared", isKept: "false" },
            { id: "Persistent", isKept: "false" },
            { id: "Reflective", isKept: "false" },
            { id: "Accurate", isKept: "false" },
            { id: "Careful", isKept: "false" },
            { id: "Precise", isKept: "false" },
            { id: "Serious", isKept: "false" },
            { id: "Highly Organised", isKept: "false" },
            { id: "Forward Planning", isKept: "false" },
            { id: "Analytical", isKept: "false" },
            { id: "Perfectionist", isKept: "false" },
            { id: "Logical", isKept: "false" },
        ],
    },
});

db.users.insert({
    name: "Calum Ramirez",
    university: "Robert Gordon University",
    department: "School of Computing",
    username: "testInProgress",
    password: "testInProgress",
    dateTaken: Date(),
    cards: {
        red: [
            { id: "Easily bored", isKept: "true" },
            { id: "Gets results", isKept: "true" },
            { id: "Takes Charge", isKept: "true" },
            { id: "Direct", isKept: "false" },
            { id: "Impatient", isKept: "false" },
            { id: "Driving", isKept: "false" },
            { id: "Fast paced", isKept: "false" },
            { id: "Competitive", isKept: "false" },
        ],
        green: [
            { id: "Helpful", isKept: "true" },
            { id: "Calm", isKept: "true" },
            { id: "Dislike change", isKept: "false" },
            { id: "Methodical", isKept: "false" },
            { id: "Harmonious", isKept: "false" },
            { id: "Accommodating", isKept: "false" },
            { id: "Stubborn", isKept: "false" },
            { id: "Considerate", isKept: "false" },
            { id: "Dependable", isKept: "false" },
            { id: "Patient", isKept: "false" },
        ],
        yellow: [
            { id: "Energetic", isKept: "true" },
            { id: "Enthusiastic", isKept: "true" },
            { id: "Talkative", isKept: "false" },
            { id: "Adaptable", isKept: "false" },
            { id: "Spontaneous", isKept: "false" },
            { id: "Networker", isKept: "false" },
            { id: "Curious", isKept: "false" },
            { id: "Friendly", isKept: "false" },
            { id: "Motivated by recognition", isKept: "false" },
            { id: "Influencer", isKept: "false" },
        ],
        blue: [
            { id: "Analytical", isKept: "false" },
            { id: "Precise", isKept: "false" },
            { id: "Logical", isKept: "false" },
            { id: "Avoids Risk", isKept: "false" },
            { id: "Reflective", isKept: "false" },
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
