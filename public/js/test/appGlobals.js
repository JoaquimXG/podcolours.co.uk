export { wordList, resultsText, setWordList, config };

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
        color: "<span style='color:red;'>Red </span>",
        title: "The Fast Paced Achiever",
        blurb:
            "Reds are very action oriented and always in motion. They will approach others in a direct, authorita-tive manner and have a preference for big picture thinking.  When communicating with a red you should ensure that you are clear, specific and brief.  Ask questions to help them think through the de-tails and define their big picture ideas."
    },
    blue: {
        color: "<span style='color:blue;'>Blue </span>",
        title: "The Prepared Planner",
        blurb:
            "People with a preference for Blue are usually very detail oriented and careful, blues ask hard ques-tions to ensure the job is done right.  They may tend toward perfectionism and like to work within clearly defined processes and procedures. To communicate with your blues, organiseyour thoughts and stick to business. "
    },
    green: {
        color: "<span style='color:green;'>Green </span>",
        title: "The Level Headed Helper",
        blurb:
            "People with a preference for green tend to be intensely loyal and patient, theyare steady workers and make terrific friends. They prefer democratic relations and they are very accommodating when dealing with others.  Maximize their contribution by creating an environment where they feel safe and valued so you can hear their insightful feedback. To communicate with greens be gentle, friendly, and curi-ous."
    },
    yellow: {
        color: "<span style='color:yellow;'>Yellow </span>",
        title: "The Animated Optimist",
        blurb:
            "People with a preference for yellow tend to be personable and trusting with a positive demeanor.  They usually approach others in a collaborative and democratic manner and have a genuine desire to help.  Yellows’dislike details and prefer looking at the bigger picture.  When communicating with a yellow you should be warm and friendly, but make sure you follow with specifics in writing.  "
    }
};
