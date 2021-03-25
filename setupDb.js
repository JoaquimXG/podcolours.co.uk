print("==== Setting up Database ====")
databaseName = "podcolours"
connection =  new Mongo()

if (connection.getDBNames().indexOf(databaseName) != -1) {
    db = connection.getDB(databaseName)
    db.dropDatabase()
    print(`Dropped ${databaseName} database`)
}

db = connection.getDB(databaseName)
print(`Created ${databaseName} database`)

db.images.insert({header: "/img/paintSplashLogoTextToRight.png"})

db.text.insert({heroTitle : "Welcome to POD Colours"})
db.text.insert({heroCopy : "POD Colours is a unique personality evaluation test. The POD Colours tool supports individuals and teams to appreciate differences in personality by en-hancing self-awareness, leading to a deeper understanding of oneself and other people. The POD Colours tool is based on psychological research, and provides an indication of your key strengths and potential barriers to success."})
db.images.insert({hero: "/img/logo.png"})

db.text.insert({redSectionTitle : "What is POD Colours?"})
db.text.insert({redSectionCopy : "POD Colours is a tool which supports individuals and teams, helping them to appreciate differences in personality by en-hancing self-awareness, leading to a deeper understanding of oneself and other people."})

db.text.insert({teamPhotoTitle : "We believe in POD Colours"})
db.text.insert({teamPhotoCopyOne : "Understanding the key personality differences between ourselves and the people we interact with helps us to realise how they see us; why they act the way they do; the impact that we have on them and how to get the most out of our interactions by capitalising on strengths."}) 
db.text.insert({teamPhotoCopyTwo : "The POD Colours tool is based on psychological research, and provide genuine insight into your key areas of strength and potential barriers to success."}) 
db.text.insert({teamPhotoQuoteAuthor : " Tina McGregor, Leadership Development Specialist"}) 

db.text.insert({testimonialOneCopy : "\"Wow! More accurate than I ever could have hoped for\""}) 
db.text.insert({testimonialOneName : "A. Very happy customer."}) 

db.text.insert({callToActionTitle : "Ready to get started?"}) 
db.text.insert({callToActionCopy : "We'll guide you every step of the way towards your self improvement."}) 


print("==== Database Setup Complete ====\n\n")
