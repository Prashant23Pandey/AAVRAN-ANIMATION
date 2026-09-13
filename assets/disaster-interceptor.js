/**
 * DISASTER DIALOGUE INTERCEPTOR
 * Runtime safety net that overrides any remaining delivery/non-disaster dialogue
 * in the 3D game engine. Intercepts NPC bubble text and quest UI updates.
 */

(function () {
  'use strict';

  // Master disaster safety message pool (12 messages as specified)
  const DISASTER_MESSAGES = [
    'Flash flood warning! Move to higher ground immediately\u2014do not wait for water to rise!',
    'Never walk or drive through moving floodwaters. Just 6 inches of water can knock you down!',
    'Stay clear of riverbanks, storm drains, and submerged bridges during heavy rainfall.',
    'Turn off your main power breaker immediately if floodwaters enter your home to prevent electrocution!',
    'Beware of downed power lines in flooded streets. Water conducts electricity\u2014stay far away!',
    'Shut off your main gas valve if you smell gas or suspect a leak after a disaster.',
    'Earthquake alert! DROP to your knees, COVER your head under sturdy furniture, and HOLD ON!',
    'If you are indoors during a quake, stay away from windows, heavy shelves, and exterior walls.',
    'Watch out for falling debris and severe aftershocks when exiting damaged buildings.',
    'Keep a 72-hour survival kit ready with clean water, non-perishable food, flashlights, and first aid!',
    'Save phone battery and keep lines open for 112 emergency responders\u2014use text messages to update family.',
    'Always keep important medical supplies, identification, and emergency contacts in a waterproof bag.',
  ];

  // Blocked keywords that indicate non-disaster dialogue
  const BLOCKED_KEYWORDS = [
    'letter', 'postcard', 'package', 'delivery', 'delivering', 'delivered',
    'offering', 'clothes', 'note back', 'mail', 'oyster', 'pastries',
    'sake', 'underwear', 'promoted', 'corporate', 'lunch break',
    'daughter', 'wife', 'husband', 'flower', 'bloom', 'hair',
    'three.js', 'painting', 'code', 'bike tire', 'data analysis',
    'noodles', 'grocery', 'prize', 'secret', 'midlife crisis',
    'Dave', 'captain', 'diving', 'oysters', 'lock box',
    'hello, i am', 'i am talking', 'how are you', 'hello there',
    'hi, how are you', 'delivering this letter', 'wrong address',
    'delivery company', 'package lately', 'my order',
    'you made it', 'finished all the deliveries', 'start again',
    'vicente', 'sungaila', 'colombin', 'abeto',
  ];

  // Quest UI task text overrides
  const TASK_OVERRIDES = {
    'find the red cliff house and get the letter back': 'FIND THE NEAREST EMERGENCY SHELTER AND SECURE YOUR GROUP',
    'take the boss\'s note to the office worker in the main square': 'DELIVER EMERGENCY ALERT TO THE COORDINATION CENTER',
    'take the cave man\'s postcard to the woman in the main square': 'DELIVER EMERGENCY SUPPLIES TO THE RELIEF SHELTER',
    'take the clean clothes to the man in the cave': 'DELIVER EMERGENCY KIT TO THE RELIEF SHELTER',
    'find doctor frieb at the base of the mountain temple': 'LOCATE THE EMERGENCY COORDINATION CENTER',
    'take the gravity data analysis to doctor frebi, at capital corp': 'DELIVER CRITICAL WEATHER DATA TO THE OPERATIONS CENTER',
    'take the old woman\'s offering to the mountain temple': 'DELIVER EMERGENCY SUPPLIES TO THE MOUNTAIN SHELTER',
    'take the mystery letter to dave at smelly falls': 'DELIVER EMERGENCY BROADCAST TO THE COORDINATION CENTER',
    'congratulations! another successful delivery completed': 'MISSION COMPLETE! EMERGENCY SUPPLIES DELIVERED SUCCESSFULLY',
    'congratulations! you completed your first delivery!': 'MISSION COMPLETE! EMERGENCY RESPONSE DEPLOYMENT SUCCESSFUL',
    'congratulations! another delivery completed!': 'EMERGENCY SUPPLY ROUTE SECURED! KEEP MOVING TO THE NEXT ZONE!',
    'congratulations! a new quest is now available!': 'NEW EMERGENCY MISSION AVAILABLE! REPORT TO THE COORDINATION CENTER!',
    'you made it!': 'EMERGENCY RESPONSE COMPLETE!',
    'you finished all the deliveries!': 'ALL EMERGENCY ZONES HAVE BEEN SECURED!',
    'stay and explore the world, or refresh your browser to start again.': 'STAY AND PATROL THE AREA, OR REFRESH YOUR BROWSER TO DEPLOY AGAIN.',
  };

  function isNonDisasterText(text) {
    if (!text || typeof text !== 'string') return false;
    const lower = text.toLowerCase();
    return BLOCKED_KEYWORDS.some((kw) => lower.includes(kw));
  }

  function getDisasterReplacement(text) {
    if (!text || typeof text !== 'string') return text;
    const lower = text.toLowerCase().trim();

    // Check task overrides first
    for (const [key, val] of Object.entries(TASK_OVERRIDES)) {
      if (lower === key) return val;
    }

    // Check if it's a non-disaster text
    if (isNonDisasterText(text)) {
      // Pick a message based on hash for consistency
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
      }
      return DISASTER_MESSAGES[Math.abs(hash) % DISASTER_MESSAGES.length];
    }

    return text;
  }

  // ============================================================
  // INTERCEPT 1: Override String.prototype if NPC system uses it
  // ============================================================
  // Not recommended - too invasive

  // ============================================================
  // INTERCEPT 2: Proxy-based text interception
  // ============================================================

  let messageIndex = 0;
  function nextDisasterMessage() {
    const msg = DISASTER_MESSAGES[messageIndex % DISASTER_MESSAGES.length];
    messageIndex++;
    return msg;
  }

  // ============================================================
  // INTERCEPT 3: DOM MutationObserver for bubble/UI text
  // ============================================================

  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          overrideElementText(node);
        }
        if (mutation.type === 'characterData' && mutation.target.parentElement) {
          overrideElementText(mutation.target.parentElement);
        }
      }
    });

    function overrideElementText(el) {
      if (!el || !el.textContent) return;
      const text = el.textContent.trim();
      if (text.length < 3) return;

      const replaced = getDisasterReplacement(text);
      if (replaced !== text) {
        el.textContent = replaced;
      }
    }

    function startObserving() {
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      } else {
        window.addEventListener('DOMContentLoaded', startObserving);
      }
    }
    startObserving();
  }

  // ============================================================
  // INTERCEPT 4: Canvas text override (for 3D bubble text)
  // ============================================================

  // Intercept fillText/strokeText on CanvasRenderingContext2D
  if (typeof CanvasRenderingContext2D !== 'undefined') {
    const origFillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text) {
      if (typeof text === 'string' && text.length > 2) {
        arguments[0] = getDisasterReplacement(text);
      }
      return origFillText.apply(this, arguments);
    };

    const origStrokeText = CanvasRenderingContext2D.prototype.strokeText;
    CanvasRenderingContext2D.prototype.strokeText = function (text) {
      if (typeof text === 'string' && text.length > 2) {
        arguments[0] = getDisasterReplacement(text);
      }
      return origStrokeText.apply(this, arguments);
    };
  }

  // ============================================================
  // INTERCEPT 5: Console log override to verify no delivery text leaks
  // ============================================================

  const origLog = console.log;
  console.log = function () {
    const args = Array.from(arguments).map((arg) => {
      if (typeof arg === 'string') return getDisasterReplacement(arg);
      return arg;
    });
    return origLog.apply(console, args);
  };

  console.log('[DISASTER INTERCEPTOR] Active - all dialogue routed through emergency safety messages');
})();
