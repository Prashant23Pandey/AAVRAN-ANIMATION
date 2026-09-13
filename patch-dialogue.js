const fs = require('fs');
const path = require('path');

const BUNDLE_PATH = path.join(__dirname, 'assets', 'App3D-DwM1eiaC.js');
const BACKUP_PATH = path.join(__dirname, 'assets', 'App3D-DwM1eiaC.js.bak');

let bundle = fs.readFileSync(BUNDLE_PATH, 'utf-8');

// Backup original
fs.writeFileSync(BACKUP_PATH, bundle, 'utf-8');
console.log(`Bundle size: ${(bundle.length / 1024 / 1024).toFixed(2)} MB`);
console.log('Backup created at App3D-DwM1eiaC.js.bak');

// ============================================================
// DISASTER SAFETY DIALOGUE REPLACEMENTS
// ============================================================

const replacements = {

  // ---- QUEST 1: quest-employee (office-worker-2 -> boss -> office-worker-2) ----
  'Thank god you\'re here! I sent a letter to my boss earlier, but I need to get it back before he sees it...':
    'Flash flood warning! Move to higher ground immediately\u2014do not wait for water to rise!',
  'He lives at the red cliff house. Do you think he\'s read it yet?':
    'Never walk or drive through moving floodwaters. Just 6 inches of water can knock you down!',
  'Find the red cliff house and get the letter back':
    'FIND THE NEAREST EMERGENCY SHELTER AND SECURE YOUR GROUP',
  'One of my employees wrote this? I can\'t believe it... this... is...':
    'Turn off your main power breaker immediately if floodwaters enter your home to prevent electrocution!',
  '...hilarious. Wow, he\'s really roasting me. Maybe he\'s manager material after all...':
    'Beware of downed power lines in flooded streets. Water conducts electricity\u2014stay far away!',
  'Can you take this note back to him? He works in the main square.':
    'Shut off your main gas valve if you smell gas or suspect a leak after a disaster.',
  'TAKE THE BOSS\'S NOTE TO THE OFFICE WORKER IN THE MAIN SQUARE':
    'DELIVER EMERGENCY ALERT TO THE COORDINATION CENTER IN THE MAIN SQUARE',
  'I\'m getting... promoted?':
    'Earthquake alert! DROP to your knees, COVER your head under sturdy furniture, and HOLD ON!',
  'Wow, who would have known that acting on my lowest instincts would help me advance in the corporate world.':
    'If you are indoors during a quake, stay away from windows, heavy shelves, and exterior walls.',

  // ---- QUEST 2: quest-caveman (caveman -> flower-lady -> caveman) ----
  'Hey there! Can you please take this postcard to my wife? She sells flowers in the main square.':
    'Keep a 72-hour survival kit ready with clean water, non-perishable food, flashlights, and first aid!',
  'I\'d give it to her myself but I... uh... have a bad knee at the moment...':
    'Save phone battery and keep lines open for 112 emergency responders\u2014use text messages to update family.',
  'TAKE THE CAVE MAN\'S POSTCARD TO THE WOMAN IN THE MAIN SQUARE':
    'DELIVER EMERGENCY SUPPLIES TO THE RELIEF SHELTER IN THE MAIN SQUARE',
  'Oh, a postcard from my husband!':
    'Watch out for falling debris and severe aftershocks when exiting damaged buildings!',
  'He\'s on an overseas business trip at the moment, visiting all kinds of exotic places!':
    'Always keep important medical supplies, identification, and emergency contacts in a waterproof bag.',
  'Look, between you and me, I know he\'s living in a cave in the forest... I hope his midlife crisis passes soon...':
    'Stay clear of riverbanks, storm drains, and submerged bridges during heavy rainfall.',
  'Would you mind bringing him these clean clothes? Don\'t say they\'re from me. Just tell him he won a prize.':
    'Carry emergency supplies in a waterproof backpack and know your evacuation route by heart.',
  'TAKE THE CLEAN CLOTHES TO THE MAN IN THE CAVE':
    'DELIVER EMERGENCY KIT TO THE RELIEF SHELTER IN THE FOREST ZONE',
  'Wow, another prize?':
    'Know the difference: a flood WATCH means conditions are favorable, a flood WARNING means act now!',
  'Just in time, too. I\'m down to my last pair of underwear.':
    'After flooding, check your home for structural damage before entering. Wear protective gear!',

  // ---- QUEST 3: quest-scientists (factory-worker-a -> male-scientist -> female-scientist) ----
  'Hey, can you help me with something? We\'re short on staff lately and, well, some of our mail went to the wrong address by mistake...':
    'Earthquake alert! DROP to your knees, COVER your head under sturdy furniture, and HOLD ON!',
  'Go find Doctor Frieb and see if he\'s received any packages lately. He lives at the base of the mountain temple.':
    'Find the nearest emergency shelter and help coordinate citizen evacuation immediately.',
  'FIND DOCTOR FRIEB AT THE BASE OF THE MOUNTAIN TEMPLE':
    'LOCATE THE EMERGENCY COORDINATION CENTER AT THE MOUNTAIN SHELTER',
  'Hello! Yes, I opened some mail by mistake earlier. A "planet gravity data analysis", or something...':
    'Never walk or drive through moving floodwaters. Just 6 inches of water can knock you down!',
  'They probably mixed me up with Doctor Frebi at Capital Corp...':
    'Beware of downed power lines in flooded streets. Water conducts electricity\u2014stay far away!',
  '...wait, does that mean MY ORDER went to Dr Frebi? Oh no!!!':
    'Turn off your main power breaker immediately if floodwaters enter your home to prevent electrocution!',
  'I... uh... ordered the wrong thing anyway... Tell her I don\'t need it anymore...':
    'Keep phone lines clear for 112 emergency responders\u2014use text messaging to update loved ones.',
  'TAKE THE GRAVITY DATA ANALYSIS TO DOCTOR FREBI, AT CAPITAL CORP':
    'DELIVER CRITICAL WEATHER DATA TO THE EMERGENCY OPERATIONS CENTER',
  'Oh hey, you work for the delivery company? I\'ve been meaning to talk to you guys...':
    'Stay clear of riverbanks, storm drains, and submerged bridges during heavy rainfall.',
  'Do you know why I received 63 packets of instant noodles? Was that meant to go to the grocery store or something?':
    'Always keep a 72-hour emergency kit ready with clean water, non-perishable food, flashlights, and first aid!',
  'You don\'t know anything about that? Oh well. Thanks for the package.':
    'Know the difference: a flood WATCH means conditions are favorable, a flood WARNING means act now!',

  // ---- QUEST 4: quest-temple (oldwoman -> mountainman) ----
  'Excuse me, could you please take this offering up to the mountain temple for me?':
    'Flash flood warning! Move to higher ground immediately\u2014do not wait for water to rise!',
  'I have trouble making it up the slope by myself these days.':
    'Never walk or drive through moving floodwaters. Just 6 inches of water can knock you down!',
  'TAKE THE OLD WOMAN\'S OFFERING TO THE MOUNTAIN TEMPLE':
    'DELIVER EMERGENCY SUPPLIES TO THE MOUNTAIN RELIEF SHELTER',
  'Oh, pastries and sake?':
    'Earthquake alert! DROP to your knees, COVER your head under sturdy furniture, and HOLD ON!',
  'My favourite.':
    'If you are indoors during a quake, stay away from windows, heavy shelves, and exterior walls.',

  // ---- QUEST 5: quest-musician (diver -> musician) ----
  'Check this out! I was diving for oysters earlier and found these old lock boxes buried in the sand.':
    'Flash flood warning! Move to higher ground immediately\u2014do not wait for water to rise!',
  'One of them had a letter inside. It\'s a bit wet, but I can make out the name Dave at the top.':
    'Never walk or drive through moving floodwaters. Just 6 inches of water can knock you down!',
  'Pretty crazy huh? I know a guy called Dave. Do you think it could be the same one?':
    'Stay clear of riverbanks, storm drains, and submerged bridges during heavy rainfall.',
  'He\'s probably down at smelly falls, if you want to take it to him.':
    'Find the nearest emergency shelter and help coordinate citizen evacuation immediately.',
  'TAKE THE MYSTERY LETTER TO DAVE AT SMELLY FALLS':
    'DELIVER EMERGENCY BROADCAST TO THE COORDINATION CENTER AT RAPID FALLS',
  'A letter for me? From under the sea? The one who wrote it... is me!':
    'Always keep important medical supplies, identification, and emergency contacts in a waterproof bag.',
  'Let\'s see what I wrote to myself all those years ago...':
    'After flooding, check your home for structural damage before entering. Wear protective gear!',
  'Dear Future Dave...':
    'Dear fellow citizen: stay prepared, stay informed, stay safe.',
  'Keep practicing every day...':
    'Keep your emergency kit updated every 6 months and know your evacuation routes.',
  'Get plenty of sunshine...':
    'Monitor official weather alerts and never ignore flood warnings.',
  'Take care of your hair. Let it grow wild and free. Your hair is your soul and the most defining feature of your personality.':
    'Take care of your family. Keep emergency contacts handy and practice your disaster plan together.',
  'Well...':
    'Remember...',
  '...two out of three ain\'t bad.':
    '...preparation saves lives.',

  // ---- COMPLETION MESSAGES ----
  'CONGRATULATIONS! ANOTHER SUCCESSFUL DELIVERY COMPLETED':
    'MISSION COMPLETE! EMERGENCY SUPPLIES DELIVERED SUCCESSFULLY',
  'CONGRATULATIONS! YOU COMPLETED YOUR FIRST DELIVERY!':
    'MISSION COMPLETE! EMERGENCY RESPONSE DEPLOYMENT SUCCESSFUL',
  'CONGRATULATIONS! ANOTHER DELIVERY COMPLETED!':
    'EMERGENCY SUPPLY ROUTE SECURED! KEEP MOVING TO THE NEXT ZONE!',
  'CONGRATULATIONS! A NEW QUEST IS NOW AVAILABLE!':
    'NEW EMERGENCY MISSION AVAILABLE! REPORT TO THE COORDINATION CENTER!',

  // ---- NPC IDLE DIALOGUE ----
  'Sorry, I\'m on my lunch break.':
    'I\'m heading to the emergency shelter. You should too\u2014flood warning is active!',
  'Senior associate executive chief vice director...':
    'Emergency coordinator on duty. All citizens must report to shelter locations.',
  'It has a nice ring to it, don\'t you think?':
    'Every second counts during a flood. Move to higher ground now!',
  'Have you seen my daughter? I thought she\'d be home by now...':
    'Have you seen my family? I hope they made it to the emergency shelter safely...',
  'Maybe I should just call in sick...':
    'I should evacuate now. The water level is rising fast!',
  'Oh my...':
    'The flood warning is serious. We need to move to higher ground!',
  'Tulips can take a while to bloom.':
    'Recovery takes time, but preparation helps us rebuild stronger.',
  'I think I hear my dad calling...':
    'I hear emergency sirens. We should head to the shelter immediately!',
  'Hello.':
    'Stay alert. Emergency broadcasts are on all channels.',
  'Have you heard of a thing called three.js?':
    'Have you heard the emergency broadcast? Flood warning is active in this zone!',
  'Well... I suppose most people don\'t know about 3D experiences.':
    'Well... I suppose not everyone knows about flood safety protocols.',
  'They\'re an art form that combines creativity and technology.':
    'Emergency response combines training, technology, and quick thinking.',
  'It\'s like painting, but with code!':
    'It\'s like survival, but with preparation!',
  'Shipments in... shipments out...':
    'Supplies in... evacuees out... the emergency shelter is operational.',
  'The new guy is late again.':
    'The responder team is assembling. Everyone must report for duty!',
  'We\'ll need to build here... here... and also here...':
    'We\'ll need sandbags here... here... and also here to prevent flooding.',
  'I think I\'ve seen you somewhere before...':
    'I think I saw you at the emergency shelter briefing. Stay safe out there.',
  'Let\'s see... First I\'ll need to calculate the radius of the bike tire...':
    'Let\'s see... First I\'ll need to check the water level and evacuation routes.',
  'Come on... open up...':
    'Come on... the shelter doors are open. Get everyone to safety!',
  'Do you hear that sound? Silence...':
    'Do you hear that sound? The emergency sirens have stopped. Stay alert for aftershocks.',
  'I mean, there\'s the wind chimes too, but it\'s mostly silence...':
    'I mean, there\'s the rain too, but it\'s mostly the sound of rising water...',
  'Thank you for delivering my offering.':
    'Thank you for delivering the emergency supplies. You saved lives today.',
  'Have you heard this one before?':
    'Have you heard this safety tip? Always keep your emergency kit within reach!',

  // ---- END SCREEN TEXTS ----
  'YOU MADE IT!':
    'EMERGENCY RESPONSE COMPLETE!',
  'YOU FINISHED ALL THE DELIVERIES!':
    'ALL EMERGENCY ZONES HAVE BEEN SECURED!',
  'STAY AND EXPLORE THE WORLD, OR REFRESH YOUR BROWSER TO START AGAIN.':
    'STAY AND PATROL THE AREA, OR REFRESH YOUR BROWSER TO DEPLOY AGAIN.',
  'CREATED IN 2025 BY VICENTE LUCENDO AND MICHAEL SUNGAILA. MUSIC BY KEVIN COLOMBIN.':
    'EMERGENCY RESPONSE SIMULATION \u2022 FLOOD & DISASTER SAFETY TRAINING \u2022 KOZUI-X 2026',
  '>CONTINUE': '>DEPLOY',

  // ---- TEST PLACEHOLDER ----
  'Hello, I am a NPC.':
    'Emergency responder online. All citizens must evacuate to higher ground!',
  'I am talking to you right now.':
    'This is an emergency broadcast. Follow evacuation protocols immediately!',
  'hello there':
    'emergency alert',
  'how are you?':
    'are you safe? move to higher ground!',
  'hi, how are you doing? i was wondering if you would mind delivering this letter to my brother.':
    'flash flood warning! move to higher ground immediately and avoid low-lying roads!',
};

// ============================================================
// APPLY REPLACEMENTS
// ============================================================

let replacedCount = 0;
let notFound = [];

for (const [original, replacement] of Object.entries(replacements)) {
  if (bundle.includes(original)) {
    // Use split/join for safe replacement (handles all occurrences)
    const parts = bundle.split(original);
    if (parts.length > 1) {
      bundle = parts.join(replacement);
      replacedCount++;
      console.log(`  [OK] "${original.substring(0, 60)}${original.length > 60 ? '...' : ''}"`);
    }
  } else {
    notFound.push(original);
    console.log(`  [MISS] "${original.substring(0, 60)}${original.length > 60 ? '...' : ''}"`);
  }
}

// Write patched bundle
fs.writeFileSync(BUNDLE_PATH, bundle, 'utf-8');

console.log(`\n=== PATCH SUMMARY ===`);
console.log(`Replaced: ${replacedCount}/${Object.keys(replacements).length} strings`);
console.log(`Not found: ${notFound.length} strings`);
if (notFound.length > 0) {
  console.log(`Missing strings:`, notFound.map(s => s.substring(0, 40)));
}
console.log(`New bundle size: ${(bundle.length / 1024 / 1024).toFixed(2)} MB`);
console.log(`Done!`);
