export { 
    wordList,
    resultsText,
    setWordList,
    config,
    colourGenreLists
};

//GLOBAL Constants 
const config = {
    //Card height and width for css
    CARDWIDTH: 180,
    CARDHEIGHT: 127,
    //CSS transition time length
    CARDTRANSTIME: 400,
    //Number of cards user should keep before test can end
    NUMTOKEEP: 20,
    //Number of cards to discard before test can end
    NUMTODISCARD: 60,
}

//Function to allow setting the value for
//wordlist global from outside of this module
function setWordList(newWordList) {
    wordList = newWordList
}

//All words which can be shown as cards during the test
var wordList = [
    {id: "Achiever", color: "red"},
    {id: "Assertive", color: "red"},
    {id: "Candid", color: "red"},
    {id: "Competitive", color: "red"},
    {id: "Decisive", color: "red"},
    {id: "Direct", color: "red"},
    {id: "Dislikes Detail", color: "red"},
    {id: "Driving", color: "red"},
    {id: "Easily bored", color: "red"},
    {id: "Fast paced", color: "red"},
    {id: "Focussed", color: "red"},
    {id: "Forceful", color: "red"},
    {id: "Gets results", color: "red"},
    {id: "Impatient", color: "red"},
    {id: "Impulsive", color: "red"},
    {id: "Independent", color: "red"},
    {id: "Inquisitive", color: "red"},
    {id: "Self-Starter", color: "red"},
    {id: "Strong Willed", color: "red"},
    {id: "Takes Charge", color: "red"},
    {id: "Accommodating", color: "green"},
    {id: "Agreeable", color: "green"},
    {id: "Calm", color: "green"},
    {id: "Caring", color: "green"},
    {id: "Considerate", color: "green"},
    {id: "Deliberate", color: "green"},
    {id: "Dependable", color: "green"},
    {id: "Dislike change", color: "green"},
    {id: "Good Listener", color: "green"},
    {id: "Harmonious", color: "green"},
    {id: "Helpful", color: "green"},
    {id: "Kind", color: "green"},
    {id: "Level Headed", color: "green"},
    {id: "Loyal", color: "green"},
    {id: "Methodical", color: "green"},
    {id: "Patient", color: "green"},
    {id: "Possessive", color: "green"},
    {id: "Stubborn", color: "green"},
    {id: "Supportive", color: "green"},
    {id: "Work at own pace", color: "green"},
    {id: "Accurate", color: "blue"},
    {id: "Analytical", color: "blue"},
    {id: "Attention to Detail", color: "blue"},
    {id: "Avoids Risk", color: "blue"},
    {id: "Careful", color: "blue"},
    {id: "Forward Planning", color: "blue"},
    {id: "Highly Organised", color: "blue"},
    {id: "Likes Order", color: "blue"},
    {id: "Logical", color: "blue"},
    {id: "Perfectionist", color: "blue"},
    {id: "Persistent", color: "blue"},
    {id: "Precise", color: "blue"},
    {id: "Prepared", color: "blue"},
    {id: "Procrastinates", color: "blue"},
    {id: "Reflective", color: "blue"},
    {id: "Rule Compliant", color: "blue"},
    {id: "Serious", color: "blue"},
    {id: "Systematic", color: "blue"},
    {id: "Systems and Procedures", color: "blue"},
    {id: "Task Oriented", color: "blue"},
    {id: "Adaptable", color: "yellow"},
    {id: "Animated", color: "yellow"},
    {id: "Big picture", color: "yellow"},
    {id: "Collaborative", color: "yellow"},
    {id: "Curious", color: "yellow"},
    {id: "Energetic", color: "yellow"},
    {id: "Enthusiastic", color: "yellow"},
    {id: "Excitable", color: "yellow"},
    {id: "Friendly", color: "yellow"},
    {id: "Imaginative", color: "yellow"},
    {id: "Influencer", color: "yellow"},
    {id: "Motivated by recognition", color: "yellow"},
    {id: "Networker", color: "yellow"},
    {id: "Optimistic", color: "yellow"},
    {id: "People Oriented", color: "yellow"},
    {id: "Persuasive", color: "yellow"},
    {id: "Sociable", color: "yellow"},
    {id: "Spontaneous", color: "yellow"},
    {id: "Talkative", color: "yellow"},
    {id: "Team Worker", color: "yellow"}
]

//Example results which users can recieve after the test
const resultsText = {
    red: {
        color: "<span style='color:red;'>Red</span>",
        title: "The Fast Paced Achiever",
        blurb:
            "Please ensure you bring your POD Colours profile to the workshop."
    },
    blue: {
        color: "<span style='color:blue;'>Blue</span>",
        title: "The Prepared Planner",
        blurb:
            "Please ensure you bring your POD Colours profile to the workshop."
    },
    green: {
        color: "<span style='color:green;'>Green</span>",
        title: "The Level Headed Helper",
        blurb:
            "Please ensure you bring your POD Colours profile to the workshop."
    },
    yellow: {
        color: "<span style='color:yellow;'>Yellow</span>",
        title: "The Animated Optimist",
        blurb:
            "Please ensure you bring your POD Colours profile to the workshop."
    }
};

const colourGenreLists = {
    red: ["Thriller", "Horror"],
    blue: ["Comedy", "Documentary"],
    yellow: ["Action", "Drama"],
    green: ["Romance", "Mystery"]
};
