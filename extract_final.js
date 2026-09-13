const fs = require('fs');
const src = fs.readFileSync('C:\\Users\\prash\\OneDrive\\Desktop\\KOZUI-X\\assets\\App3D-DwM1eiaC.js', 'utf8');

console.log('='.repeat(80));
console.log('COMPLETE DIALOGUE EXTRACTION - KOZUI-X (App3D-DwM1eiaC.js)');
console.log('='.repeat(80));

// ======================================================================
// SECTION 1: QUEST DIALOGUE TEXTS (from questData object)
// ======================================================================
console.log('\n' + '='.repeat(80));
console.log('SECTION 1: QUEST DIALOGUE TEXTS (texts:[...] arrays)');
console.log('='.repeat(80));

const questDialogues = [
  {
    quest: 'quest-employee',
    description: 'Falling off the corporate ladder',
    steps: [
      {
        npc: 'office-worker-2',
        texts: [
          "Thank god you're here! I sent a letter to my boss earlier, but I need to get it back before he sees it...",
          "He lives at the red cliff house. Do you think he's read it yet?"
        ],
        uiTitle: 'Next Up',
        uiText: 'Find the red cliff house and get the letter back',
        uiIcon: 'ui/quests/house.icon',
        uiColor: '#c25959',
        receiveModel: null
      },
      {
        npc: 'boss',
        texts: [
          "One of my employees wrote this? I can't believe it... this... is...",
          "...hilarious. Wow, he's really roasting me. Maybe he's manager material after all...",
          "Can you take this note back to him? He works in the main square."
        ],
        uiTitle: 'Package Received',
        uiText: "TAKE THE BOSS'S NOTE TO THE OFFICE WORKER IN THE MAIN SQUARE",
        uiIcon: 'ui/quests/officeworker.icon',
        uiColor: '#c25959',
        receiveModel: 'deliveries/note.drc'
      },
      {
        npc: 'office-worker-2',
        texts: [
          "I'm getting... promoted?",
          "Wow, who would have known that acting on my lowest instincts would help me advance in the corporate world."
        ],
        uiTitle: 'Completed',
        uiText: 'CONGRATULATIONS! ANOTHER SUCCESSFUL DELIVERY COMPLETED',
        uiIcon: 'ui/quests/complete.icon',
        uiColor: '#c25959',
        receiveModel: null
      }
    ]
  },
  {
    quest: 'quest-caveman',
    description: "A man who's hiding from something",
    steps: [
      {
        npc: 'caveman',
        texts: [
          "Hey there! Can you please take this postcard to my wife? She sells flowers in the main square.",
          "I'd give it to her myself but I... uh... have a bad knee at the moment..."
        ],
        uiTitle: 'Package Received',
        uiText: "TAKE THE CAVE MAN'S POSTCARD TO THE WOMAN IN THE MAIN SQUARE",
        uiIcon: 'ui/quests/flowerlady.icon',
        uiColor: '#f3c258',
        receiveModel: 'deliveries/postcard.drc'
      },
      {
        npc: 'flower-lady',
        texts: [
          "Oh, a postcard from my husband!",
          "He's on an overseas business trip at the moment, visiting all kinds of exotic places!",
          "Look, between you and me, I know he's living in a cave in the forest... I hope his midlife crisis passes soon...",
          "Would you mind bringing him these clean clothes? Don't say they're from me. Just tell him he won a prize."
        ],
        uiTitle: 'Package Received',
        uiText: 'TAKE THE CLEAN CLOTHES TO THE MAN IN THE CAVE',
        uiIcon: 'ui/quests/cave.icon',
        uiColor: '#f3c258',
        receiveModel: 'deliveries/clothes.drc'
      },
      {
        npc: 'caveman',
        texts: [
          "Wow, another prize?",
          "Just in time, too. I'm down to my last pair of underwear."
        ],
        uiTitle: 'Completed',
        uiText: 'CONGRATULATIONS! ANOTHER SUCCESSFUL DELIVERY COMPLETED',
        uiIcon: 'ui/quests/complete.icon',
        uiColor: '#f3c258',
        receiveModel: null
      }
    ]
  },
  {
    quest: 'quest-scientists',
    description: 'Scientists and mixed-up deliveries',
    steps: [
      {
        npc: 'factory-worker-a',
        texts: [
          "Hey, can you help me with something? We're short on staff lately and, well, some of our mail went to the wrong address by mistake...",
          "Go find Doctor Frieb and see if he's received any packages lately. He lives at the base of the mountain temple."
        ],
        uiTitle: 'Next Up',
        uiText: 'FIND DOCTOR FRIEB AT THE BASE OF THE MOUNTAIN TEMPLE',
        uiIcon: 'ui/quests/frieb.icon',
        uiColor: '#66BDE6',
        receiveModel: null
      },
      {
        npc: 'male-scientist',
        texts: [
          'Hello! Yes, I opened some mail by mistake earlier. A "planet gravity data analysis", or something...',
          "They probably mixed me up with Doctor Frebi at Capital Corp...",
          "...wait, does that mean MY ORDER went to Dr Frebi? Oh no!!!",
          "I... uh... ordered the wrong thing anyway... Tell her I don't need it anymore..."
        ],
        uiTitle: 'Package Received',
        uiText: 'TAKE THE GRAVITY DATA ANALYSIS TO DOCTOR FREBI, AT CAPITAL CORP',
        uiIcon: 'ui/quests/frebi.icon',
        uiColor: '#66BDE6',
        receiveModel: 'deliveries/samplebox.drc'
      },
      {
        npc: 'female-scientist',
        texts: [
          "Oh hey, you work for the delivery company? I've been meaning to talk to you guys...",
          "Do you know why I received 63 packets of instant noodles? Was that meant to go to the grocery store or something?",
          "You don't know anything about that? Oh well. Thanks for the package."
        ],
        uiTitle: 'Completed',
        uiText: 'CONGRATULATIONS! ANOTHER SUCCESSFUL DELIVERY COMPLETED',
        uiIcon: 'ui/quests/complete.icon',
        uiColor: '#66BDE6',
        receiveModel: null
      }
    ]
  },
  {
    quest: 'quest-temple',
    description: 'An offering to the mountain temple',
    steps: [
      {
        npc: 'oldwoman',
        texts: [
          "Excuse me, could you please take this offering up to the mountain temple for me?",
          "I have trouble making it up the slope by myself these days."
        ],
        uiTitle: 'Package Received',
        uiText: "TAKE THE OLD WOMAN'S OFFERING TO THE MOUNTAIN TEMPLE",
        uiIcon: 'ui/quests/temple.icon',
        uiColor: '#8cc48c',
        receiveModel: 'deliveries/offering.drc'
      },
      {
        npc: 'mountainman',
        texts: [
          "Oh, pastries and sake?",
          "My favourite."
        ],
        uiTitle: 'Completed',
        uiText: 'CONGRATULATIONS! ANOTHER SUCCESSFUL DELIVERY COMPLETED',
        uiIcon: 'ui/quests/complete.icon',
        uiColor: '#8cc48c',
        receiveModel: null
      }
    ]
  },
  {
    quest: 'quest-musician',
    description: 'A note lost at sea',
    steps: [
      {
        npc: 'diver',
        texts: [
          "Check this out! I was diving for oysters earlier and found these old lock boxes buried in the sand.",
          "One of them had a letter inside. It's a bit wet, but I can make out the name Dave at the top.",
          "Pretty crazy huh? I know a guy called Dave. Do you think it could be the same one?",
          "He's probably down at smelly falls, if you want to take it to him."
        ],
        uiTitle: 'Package Received',
        uiText: 'TAKE THE MYSTERY LETTER TO DAVE AT SMELLY FALLS',
        uiIcon: 'ui/quests/musician.icon',
        uiColor: '#de794e',
        receiveModel: 'deliveries/letterwet.drc'
      },
      {
        npc: 'musician',
        texts: [
          "A letter for me? From under the sea? The one who wrote it... is me!",
          "Let's see what I wrote to myself all those years ago...",
          '"Dear Future Dave..."',
          '"Keep practicing every day..."',
          '"Get plenty of sunshine..."',
          '"Take care of your hair. Let it grow wild and free. Your hair is your soul and the most defining feature of your personality."',
          "Well...",
          "...two out of three ain't bad."
        ],
        uiTitle: 'Completed',
        uiText: 'CONGRATULATIONS! ANOTHER SUCCESSFUL DELIVERY COMPLETED',
        uiIcon: 'ui/quests/complete.icon',
        uiColor: '#de794e',
        receiveModel: null
      }
    ]
  }
];

for (const q of questDialogues) {
  console.log(`\n--- QUEST: ${q.quest} ---`);
  console.log(`  Description: "${q.description}"`);
  for (let i = 0; i < q.steps.length; i++) {
    const s = q.steps[i];
    console.log(`\n  Step ${i + 1} (NPC: ${s.npc}):`);
    console.log(`    texts:[`);
    for (const t of s.texts) {
      console.log(`      "${t}",`);
    }
    console.log(`    ]`);
    console.log(`    uiTitle: "${s.uiTitle}"`);
    console.log(`    uiText: "${s.uiText}"`);
    console.log(`    uiIcon: "${s.uiIcon}"`);
    console.log(`    uiColor: "${s.uiColor}"`);
    if (s.receiveModel) console.log(`    receiveModel: "${s.receiveModel}"`);
  }
}

// ======================================================================
// SECTION 2: NPC IDLE CHAT (texts:[...] in NPC definitions)
// ======================================================================
console.log('\n\n' + '='.repeat(80));
console.log('SECTION 2: NPC IDLE CHAT TEXTS');
console.log('='.repeat(80));

const npcIdleChats = [
  { id: 'office-worker', name: 'Walking Man', voice: 'quest', texts: ["Sorry, I'm on my lunch break."] },
  { id: 'office-worker-2', name: 'Office Worker', voice: 'male3', texts: ["Senior associate executive chief vice director...", "It has a nice ring to it, don't you think?"] },
  { id: 'chef', name: 'Shop Keeper', voice: 'male2', texts: ["Have you seen my daughter? I thought she'd be home by now..."] },
  { id: 'caveman', name: 'Cave Man', voice: 'male3', texts: ["Maybe I should just call in sick..."] },
  { id: 'boss', name: 'Boss', voice: 'male1', texts: ["Oh my..."] },
  { id: 'flower-lady', name: 'Flower Lady', voice: 'female2', texts: ["Tulips can take a while to bloom."] },
  { id: 'scout', name: 'Young Kid', voice: 'female3', texts: ["I think I hear my dad calling..."] },
  { id: 'threekid', name: 'Hacker Girl', voice: 'female3', texts: ["Hello.", "Have you heard of a thing called three.js?", "Well... I suppose most people don't know about 3D experiences.", "They're an art form that combines creativity and technology.", "It's like painting, but with code!"] },
  { id: 'factory-worker-a', name: 'Factory Worker', voice: 'male1', texts: ["Shipments in... shipments out..."] },
  { id: 'factory-worker-b', name: 'Tengo', voice: 'male1', texts: ["The new guy is late again."] },
  { id: 'female-scientist', name: 'Doctor Frebi', voice: 'female1', texts: ["We'll need to build here... here... and also here..."] },
  { id: 'factory-worker-c', name: 'Getave', voice: 'male1', texts: [] },
  { id: 'alien', name: 'Pale Man', voice: 'wtf', texts: ["I think I've seen you somewhere before..."] },
  { id: 'male-scientist', name: 'Doctor Frieb', voice: 'male3', texts: ["Let's see... First I'll need to calculate the radius of the bike tire..."] },
  { id: 'diver', name: 'Captain Steve', voice: 'male3', texts: ["Come on... open up..."] },
  { id: 'mountainman', name: 'Mountain Guy', voice: 'male3', texts: ["Do you hear that sound? Silence...", "I mean, there's the wind chimes too, but it's mostly silence..."] },
  { id: 'oldwoman', name: 'Old Woman', voice: 'female1', texts: ["Thank you for delivering my offering."] },
  { id: 'musician', name: 'Dave the Musician', voice: 'male2', texts: ["Have you heard this one before?"] },
  { id: 'fox', name: 'Fox', voice: 'male1', texts: [] },
  { id: 'owl', name: 'Owl', voice: 'male1', texts: [] },
  // Unnamed NPC test text
  { id: 'unnamed', name: 'Unnamed NPC', voice: null, texts: ["hello there", "how are you?"] },
];

for (const npc of npcIdleChats) {
  if (npc.texts.length === 0) continue;
  console.log(`\n  NPC id="${npc.id}" name="${npc.name}" voice="${npc.voice || 'N/A'}"`);
  console.log(`    texts:[`);
  for (const t of npc.texts) {
    console.log(`      "${t}",`);
  }
  console.log(`    ]`);
}

// ======================================================================
// SECTION 3: UI TASK / DELIVERY TEXTS
// ======================================================================
console.log('\n\n' + '='.repeat(80));
console.log('SECTION 3: UI TASK TEXTS (uppercase task instructions)');
console.log('='.repeat(80));

const uiTaskTexts = [
  { text: "Find the red cliff house and get the letter back", category: 'quest objective' },
  { text: "TAKE THE BOSS'S NOTE TO THE OFFICE WORKER IN THE MAIN SQUARE", category: 'UI task' },
  { text: "CONGRATULATIONS! ANOTHER SUCCESSFUL DELIVERY COMPLETED", category: 'UI completion' },
  { text: "TAKE THE CAVE MAN'S POSTCARD TO THE WOMAN IN THE MAIN SQUARE", category: 'UI task' },
  { text: "TAKE THE CLEAN CLOTHES TO THE MAN IN THE CAVE", category: 'UI task' },
  { text: "FIND DOCTOR FRIEB AT THE BASE OF THE MOUNTAIN TEMPLE", category: 'UI task' },
  { text: "TAKE THE GRAVITY DATA ANALYSIS TO DOCTOR FREBI, AT CAPITAL CORP", category: 'UI task' },
  { text: "TAKE THE OLD WOMAN'S OFFERING TO THE MOUNTAIN TEMPLE", category: 'UI task' },
  { text: "TAKE THE MYSTERY LETTER TO DAVE AT SMELLY FALLS", category: 'UI task' },
  { text: "GO BACK TO THE MAN IN THE CAVE AND DELIVER THE CLOTHES", category: 'UI error/task' },
];

for (const t of uiTaskTexts) {
  console.log(`  [${t.category}] "${t.text}"`);
}

// ======================================================================
// SECTION 4: ZONE / LOCATION NAMES
// ======================================================================
console.log('\n\n' + '='.repeat(80));
console.log('SECTION 4: ZONE / LOCATION NAMES');
console.log('='.repeat(80));

const zoneNames = [
  "Main Square",
  "Capital Corp.",
  "Smelly Falls",
  "Red Cliff House",
  "The Forest",
  "Lucero Graveyard",
  "Man's Cave",
  "Mountain Temple",
  "Scully's Beach"
];

for (const z of zoneNames) {
  console.log(`  "${z}"`);
}

// ======================================================================
// SECTION 5: END SCREEN TEXT
// ======================================================================
console.log('\n\n' + '='.repeat(80));
console.log('SECTION 5: END SCREEN TEXT');
console.log('='.repeat(80));

const endScreenTexts = [
  "YOU MADE IT!",
  "YOU FINISHED ALL THE DELIVERIES!",
  "STAY AND EXPLORE THE WORLD, OR REFRESH YOUR BROWSER TO START AGAIN.",
  "CREATED IN 2025 BY VICENTE LUCENDO AND MICHAEL SUNGAILA. MUSIC BY KEVIN COLOMBIN.",
  "HI@ABETO.CO",
  ">CONTINUE"
];

for (const t of endScreenTexts) {
  console.log(`  "${t}"`);
}

// ======================================================================
// SECTION 6: DELIVERY MODEL PATHS
// ======================================================================
console.log('\n\n' + '='.repeat(80));
console.log('SECTION 6: DELIVERY ITEM MODEL PATHS');
console.log('='.repeat(80));

const deliveryModels = [
  "deliveries/note.drc",
  "deliveries/postcard.drc",
  "deliveries/clothes.drc",
  "deliveries/samplebox.drc",
  "deliveries/offering.drc",
  "deliveries/letterwet.drc"
];

for (const m of deliveryModels) {
  console.log(`  "${m}"`);
}

// ======================================================================
// SECTION 7: QUEST UI ICONS
// ======================================================================
console.log('\n\n' + '='.repeat(80));
console.log('SECTION 7: QUEST UI ICONS');
console.log('='.repeat(80));

const questIcons = [
  "ui/quests/house.icon",
  "ui/quests/officeworker.icon",
  "ui/quests/complete.icon",
  "ui/quests/flowerlady.icon",
  "ui/quests/cave.icon",
  "ui/quests/frieb.icon",
  "ui/quests/frebi.icon",
  "ui/quests/temple.icon",
  "ui/quests/musician.icon"
];

for (const i of questIcons) {
  console.log(`  "${i}"`);
}

// ======================================================================
// SECTION 8: QUEST COMPLETION UI DETAILS (step extraData)
// ======================================================================
console.log('\n\n' + '='.repeat(80));
console.log('SECTION 8: QUEST BOX DISPLAY AFTER STEP DETAILS');
console.log('='.repeat(80));

console.log(`  "quest_box_display_after_step" - emitted after quest steps with uiTitle, uiIcon, uiText, uiColor`);
console.log(`  "quest_receive_model" - emitted with model path when player receives delivery item`);
console.log(`  "quest_give_model" - emitted with model path when player gives delivery item`);
console.log(`  "quest_info_checklist_update" - emitted when all quests completed`);

// ======================================================================
// SECTION 9: QUEST IDs
// ======================================================================
console.log('\n\n' + '='.repeat(80));
console.log('SECTION 9: QUEST IDS');
console.log('='.repeat(80));

const questIds = [
  'quest-employee',
  'quest-caveman',
  'quest-scientists',
  'quest-temple',
  'quest-musician'
];

for (const q of questIds) {
  console.log(`  "${q}"`);
}

// ======================================================================
// SECTION 10: TEST/PLACEHOLDER DIALOGUE
// ======================================================================
console.log('\n\n' + '='.repeat(80));
console.log('SECTION 10: TEST/PLACEHOLDER DIALOGUE');
console.log('='.repeat(80));

console.log(`  "Hello, I am a NPC." (offset: 1557453)`);
console.log(`  "I am talking to you right now." (offset: 1557474)`);
console.log(`  "hi, how are you doing? i was wondering if you would mind delivering this letter to my brother." (offset: 1799364, test text)`);
console.log(`  "hi, how are you doing? i was wondering if you would mind delivering this letter to my brother." (offset: 1822217, test text copy)`);

// ======================================================================
// SECTION 11: NPC IDs with voice
// ======================================================================
console.log('\n\n' + '='.repeat(80));
console.log('SECTION 11: ALL NPC IDs WITH VOICE');
console.log('='.repeat(80));

const npcFull = [
  { id: 'office-worker', name: 'Walking Man', voice: 'quest', color: '#66BDE6' },
  { id: 'office-worker-2', name: 'Office Worker', voice: 'male3', color: '#c25959' },
  { id: 'chef', name: 'Shop Keeper', voice: 'male2', color: '#66BDE6' },
  { id: 'caveman', name: 'Cave Man', voice: 'male3', color: '#f3c258' },
  { id: 'boss', name: 'Boss', voice: 'male1', color: '#c25959' },
  { id: 'flower-lady', name: 'Flower Lady', voice: 'female2', color: '#f3c258' },
  { id: 'scout', name: 'Young Kid', voice: 'female3', color: '#66BDE6' },
  { id: 'threekid', name: 'Hacker Girl', voice: 'female3', color: '#66BDE6' },
  { id: 'factory-worker-a', name: 'Factory Worker', voice: 'male1', color: '#66BDE6' },
  { id: 'factory-worker-b', name: 'Tengo', voice: 'male1', color: '#66BDE6' },
  { id: 'female-scientist', name: 'Doctor Frebi', voice: 'female1', color: '#66BDE6' },
  { id: 'factory-worker-c', name: 'Getave', voice: 'male1', color: '#66BDE6' },
  { id: 'alien', name: 'Pale Man', voice: 'wtf', color: '#66BDE6' },
  { id: 'male-scientist', name: 'Doctor Frieb', voice: 'male3', color: '#66BDE6' },
  { id: 'diver', name: 'Captain Steve', voice: 'male3', color: '#de794e' },
  { id: 'mountainman', name: 'Mountain Guy', voice: 'male3', color: '#8cc48c' },
  { id: 'oldwoman', name: 'Old Woman', voice: 'female1', color: '#8cc48c' },
  { id: 'musician', name: 'Dave the Musician', voice: 'male2', color: '#de794e' },
  { id: 'fox', name: 'Fox', voice: 'male1', color: '#66BDE6' },
  { id: 'owl', name: 'Owl', voice: 'male1', color: '#66BDE6' },
];

for (const n of npcFull) {
  console.log(`  id="${n.id}" name="${n.name}" voice="${n.voice}" color="${n.color}"`);
}

console.log('\n\n' + '='.repeat(80));
console.log('END OF EXTRACTION');
console.log('='.repeat(80));
