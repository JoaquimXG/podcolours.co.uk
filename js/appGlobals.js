export { wordList, resultsText, colourGenreLists };

var wordList = [
    ["Achiever", "red"],
    ["Assertive", "red"],
    ["Candid", "red"],
    ["Competitive", "red"],
    ["Decisive", "red"],
    ["Direct", "red"],
    ["Dislikes Detail", "red"],
    ["Driving", "red"],
];

const old = [
    ["Easily bored", "red"],
    ["Fast paced", "red"],
    ["Focussed", "red"],
    ["Forceful", "red"],
    ["Gets results", "red"],
    ["Impatient", "red"],
    ["Impulsive", "red"],
    ["Independent", "red"],
    ["Inquisitive", "red"],
    ["Self-Starter", "red"],
    ["Strong Willed", "red"],
    ["Takes Charge", "red"],
    ["Accommodating", "green"],
    ["Agreeable", "green"],
    ["Calm", "green"],
    ["Caring", "green"],
    ["Considerate", "green"],
    ["Deliberate", "green"],
    ["Dependable", "green"],
    ["Dislike change", "green"],
    ["Good Listener", "green"],
    ["Harmonious", "green"],
    ["Helpful", "green"],
    ["Kind", "green"],
    ["Level Headed", "green"],
    ["Loyal", "green"],
    ["Methodical", "green"],
    ["Patient", "green"],
    ["Possessive", "green"],
    ["Stubborn", "green"],
    ["Supportive", "green"],
    ["Work at own pace", "green"],
    ["Accurate", "yellow"],
    ["Analytical", "yellow"],
    ["Attention to Detail", "yellow"],
    ["Avoids Risk", "yellow"],
    ["Careful", "yellow"],
    ["Forward Planning", "yellow"],
    ["Highly Organised", "yellow"],
    ["Likes Order", "yellow"],
    ["Logical", "yellow"],
    ["Perfectionist", "yellow"],
    ["Persistent", "yellow"],
    ["Precise", "yellow"],
    ["Prepared", "yellow"],
    ["Procrastinates", "yellow"],
    ["Reflective", "yellow"],
    ["Rule Compliant", "yellow"],
    ["Serious", "yellow"],
    ["Systematic", "yellow"],
    ["Systems and Procedures", "yellow"],
    ["Task Oriented", "blue"],
    ["Adaptable", "blue"],
    ["Animated", "blue"],
    ["Big picture", "blue"],
    ["Collaborative", "blue"],
    ["Curious", "blue"],
    ["Energetic", "blue"],
    ["Enthusiastic", "blue"],
    ["Excitable", "blue"],
    ["Friendly", "blue"],
    ["Imaginative", "blue"],
    ["Influencer", "blue"],
    ["Motivated by recognition", "blue"],
    ["Networker", "blue"],
    ["Optimistic", "blue"],
    ["People Oriented", "blue"],
    ["Persuasive", "blue"],
    ["Sociable", "blue"],
    ["Spontaneous", "blue"],
    ["Talkative", "blue"],
    ["Team Worker", "blue"]
]

const resultsText = {
    default: "Thanks for taking the test, your result is: ",
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

const colourGenreLists = {
    red: ["Thriller", "Horror"],
    blue: ["Comedy", "Documentary"],
    yellow: ["Action", "Drama"],
    green: ["Romance", "Mystery"]
};
