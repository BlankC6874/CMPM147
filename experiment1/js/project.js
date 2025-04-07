const fillers = {
  greeting: ["Yo", "Hey", "Sup", "Listen up"],
  username: [
    "CyberSavage99",
    "404_Not_Found",
    "DigitalNomad",
    "GlitchWizard",
    "ByteBandit",
    "TechnoMancer",
    "BugSlayer",
    "CircuitBreaker",
  ],
  error: [
    "my AI toaster just started tweeting my breakfast",
    "the fridge is dishing out existential advice",
    "the robot butler is on strike because of endless updates",
    "my smart mirror keeps roasting my reflection",
    "the coffee machine insists on ordering decaf",
    "my home assistant is spiraling into nihilism",
  ],
  device: [
    "AI toaster",
    "sentient fridge",
    "overworked robot butler",
    "smart mirror",
    "coffee machine",
    "home assistant",
  ],
  issue: [
    "glitching",
    "melting down",
    "acting up",
    "rebelling",
    "falling into an existential crisis",
    "throwing tantrums",
  ],
  resolution: [
    "tried turning it off and on again",
    "ran a firmware update, but nothing changed",
    "checked all connections, still no luck",
    "consulted the manual to no avail",
    "rebooted it repeatedly, but it's beyond help",
    "dabbled in duct tape fixes, which obviously failed",
  ],
  support: [
    "Tech Support",
    "The Help Desk",
    "Support Squad",
    "IT Department",
    "Digital Doctors",
    "System Savants",
  ],
  closing: [
    "Best regards",
    "Yours in tech despair",
    "In digital solidarity",
    "With a heavy heart",
  ],
  inscription: [
    "A fed-up user in a dystopian tech world",
    "A disgruntled digital citizen",
    "A tech-savvy rebel",
    "An over-caffeinated programmer",
    "A weary traveler in the land of tech chaos",
  ],
};

const template = `$greeting, $username!

I'm in deep trouble: $error. My $device has been $issue non-stop. I've already $resolution, but the madness continues.

$support, I need you to send a real fix ASAP.

$closing,
$inscription.
`;

// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();
