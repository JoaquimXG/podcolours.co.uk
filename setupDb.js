print("==== Setting up Database ====")
databaseName = db

db.dropDatabase()
print(`Created ${databaseName} database`)

db.content.insert({_id: "/", content : {
    header: {
        image: "/img/paintSplashLogoTextToRight.png"
    },
    footer: {
        copyright: "© 2021 POD Colours All rights reserved.",
        links: [
            {
                text: "Home",
                href: "/"
            },
            {
                text: "Personality Test",
                href: "/test"
            }
        ]
    },
    hero : {
        title : "Welcome to POD Colours",
        text : "POD Colours is a unique personality evaluation test. The POD Colours tool supports individuals and teams to appreciate differences in personality by en-hancing self-awareness, leading to a deeper understanding of oneself and other people. The POD Colours tool is based on psychological research, and provides an indication of your key strengths and potential barriers to success.",
        image: "/img/logo.png",
    },
    redSection : {
        title : "What is POD Colours?",
        text : "POD Colours is a tool which supports individuals and teams, helping them to appreciate differences in personality by en-hancing self-awareness, leading to a deeper understanding of oneself and other people.",
    },
    teamPhotoSection : {
        title : "We believe in POD Colours",
        textOne : "Understanding the key personality differences between ourselves and the people we interact with helps us to realise how they see us; why they act the way they do; the impact that we have on them and how to get the most out of our interactions by capitalising on strengths.",
        textTwo : "The POD Colours tool is based on psychological research, and provide genuine insight into your key areas of strength and potential barriers to success.",
        quoteAuthor : " Tina McGregor, Leadership Development Specialist",
    },
    testimonials : [
        {
            text: "\"Wow! More accurate than I ever could have hoped for\"",
            name: "A. Very happy customer."
        }
    ],
    callToAction : {
        title : "Ready to get started?",
        text : "We'll guide you every step of the way towards your self improvement.",
    }
}})

print("==== Database Setup Complete ====\n\n")
