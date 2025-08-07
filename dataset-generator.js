// Talkative Golden Dataset Generator
class TalkativeDatasetGenerator {
    constructor() {
        this.generatedDataset = [];
        this.skills = [];
        this.lgDevices = [];
        this.homeyDevices = [];
        this.personas = [
            'Tech-Savvy Renters',
            'Senior Citizens in Assisted Living', 
            'Homeowners with Smart Ecosystems',
            'Hotel Guests',
            'Users with Mobility or Vision Challenges',
            'Millennials and Gen Z',
            'Early Adopters of Ambient Tech'
        ];
        this.turnTypes = [
            'singleintent_singleturn',
            'singleintent_multiturn', 
            'multiintent_singleturn',
            'multiintent_multiturn'
        ];
        this.initializeData();
        this.bindEvents();
    }

    initializeData() {
        // Skills from CSV
        this.skills = [
            'Device control',
            'ChitChat', 
            'Weather',
            'News',
            'Product Q&A - Troubleshooting',
            'Web Q&A',
            'Routine creation',
            'Routine execution',
            'Alarm',
            'Calendar',
            'Timer'
        ];

        // LG Devices (active ones)
        this.lgDevices = [
            'Air conditioner', 'Air purifier', 'Dehumidifier', 'Aero tower',
            'Kimchi refrigerator', 'Refrigerator', 'Wine refrigerator', 'Dishwasher',
            'Cooktop', 'Washing machine', 'Dryer', 'Wash tower washing machine',
            'Wash tower dryer', 'Integrated wash tower', 'Wash combo', 'Styler',
            'Robot vacuum cleaner', 'Stick vacuum cleaner', 'Thinq ON', 'Ceiling fan',
            'Humidifier', 'Water purifier', 'Beer maker', 'Plant cultivation machine', 'WebOS TV'
        ];

        // Homey Devices (active ones)
        this.homeyDevices = [
            'amplifier', 'blinds', 'button', 'camera', 'coffeemachine', 'curtain',
            'doorbell', 'fan', 'garagedoor', 'heater', 'homealarm', 'kettle',
            'light', 'lock', 'remote', 'sensor', 'socket', 'solarpanel',
            'speaker', 'sunshade', 'thermostat', 'tv', 'vacuumcleaner', 'windowcoverings'
        ];
    }

    bindEvents() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateDataset());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadCSV());
    }

    generateDataset() {
        const selectedPersona = document.getElementById('personaSelect').value;
        const conversationCount = parseInt(document.getElementById('conversationCount').value);
        
        this.showLoading(true);
        this.generatedDataset = [];

        setTimeout(() => {
            const personasToGenerate = selectedPersona ? [selectedPersona] : this.personas;
            
            personasToGenerate.forEach(persona => {
                for (let i = 0; i < conversationCount; i++) {
                    this.generateConversation(persona);
                }
            });

            this.displayDataset();
            this.updateStats();
            this.showLoading(false);
            document.getElementById('downloadBtn').disabled = false;
        }, 1000);
    }

    generateConversation(persona) {
        const conversationId = this.generateConversationId();
        const turnType = this.getRandomElement(this.turnTypes);
        
        switch (turnType) {
            case 'singleintent_singleturn':
                this.generateSingleIntentSingleTurn(conversationId, persona, turnType);
                break;
            case 'singleintent_multiturn':
                this.generateSingleIntentMultiTurn(conversationId, persona, turnType);
                break;
            case 'multiintent_singleturn':
                this.generateMultiIntentSingleTurn(conversationId, persona, turnType);
                break;
            case 'multiintent_multiturn':
                this.generateMultiIntentMultiTurn(conversationId, persona, turnType);
                break;
        }
    }

    generateSingleIntentSingleTurn(conversationId, persona, turnType) {
        const skill = this.getRandomElement(this.skills);
        const { userQuery, apiResponse } = this.generatePersonaSpecificConversation(persona, skill);
        
        this.generatedDataset.push({
            conversation_id: conversationId,
            skills: skill,
            user_query: userQuery,
            api_response: apiResponse,
            turn_number: 1,
            turn_type: turnType,
            persona: persona
        });
    }

    generateSingleIntentMultiTurn(conversationId, persona, turnType) {
        const skill = this.getRandomElement(this.skills);
        const turns = Math.floor(Math.random() * 3) + 2; // 2-4 turns
        
        for (let turn = 1; turn <= turns; turn++) {
            const { userQuery, apiResponse } = this.generateMultiTurnConversation(persona, skill, turn, turns);
            
            this.generatedDataset.push({
                conversation_id: conversationId,
                skills: skill,
                user_query: userQuery,
                api_response: apiResponse,
                turn_number: turn,
                turn_type: turnType,
                persona: persona
            });
        }
    }

    generateMultiIntentSingleTurn(conversationId, persona, turnType) {
        const skills = this.getRandomElements(this.skills, 2);
        const { userQuery, apiResponse } = this.generateMultiIntentQuery(persona, skills);
        
        this.generatedDataset.push({
            conversation_id: conversationId,
            skills: skills.join(', '),
            user_query: userQuery,
            api_response: apiResponse,
            turn_number: 1,
            turn_type: turnType,
            persona: persona
        });
    }

    generateMultiIntentMultiTurn(conversationId, persona, turnType) {
        const skills = this.getRandomElements(this.skills, 2);
        const turns = Math.floor(Math.random() * 3) + 2; // 2-4 turns
        
        for (let turn = 1; turn <= turns; turn++) {
            const currentSkills = turn === 1 ? skills : [this.getRandomElement(skills)];
            const { userQuery, apiResponse } = this.generateMultiTurnMultiIntentConversation(persona, currentSkills, turn, turns);
            
            this.generatedDataset.push({
                conversation_id: conversationId,
                skills: currentSkills.join(', '),
                user_query: userQuery,
                api_response: apiResponse,
                turn_number: turn,
                turn_type: turnType,
                persona: persona
            });
        }
    }

    generatePersonaSpecificConversation(persona, skill) {
        const templates = this.getPersonaTemplates(persona, skill);
        const template = this.getRandomElement(templates);
        return template;
    }

    getPersonaTemplates(persona, skill) {
        const deviceTemplates = this.getDeviceControlTemplates(persona);
        const skillTemplates = this.getSkillSpecificTemplates(persona, skill);
        
        if (skill === 'Device control') {
            return deviceTemplates;
        }
        return skillTemplates;
    }

    getDeviceControlTemplates(persona) {
        const lgDevice = this.getRandomElement(this.lgDevices);
        const homeyDevice = this.getRandomElement(this.homeyDevices);
        
        const templates = {
            'Tech-Savvy Renters': [
                {
                    userQuery: `Turn on the ${lgDevice} and set it to energy saving mode`,
                    apiResponse: `Your LG ${lgDevice} is now on and set to energy saving mode. You'll save about 20% on power consumption with this setting.`
                },
                {
                    userQuery: `Can you start the ${homeyDevice} and send me a notification when it's done?`,
                    apiResponse: `I've started your ${homeyDevice} and set up a notification for completion. I'll ping your phone when it's finished.`
                },
                {
                    userQuery: `Set the washing machine to delicate cycle and add extra rinse`,
                    apiResponse: `Perfect! I've set your LG washing machine to delicate cycle with extra rinse. The cycle will take about 58 minutes to complete.`
                }
            ],
            'Senior Citizens in Assisted Living': [
                {
                    userQuery: `Please turn on the ${lgDevice}, the buttons are too small for me to see`,
                    apiResponse: `Of course! I've turned on your LG ${lgDevice} for you. Would you like me to adjust any settings, or is this good for now?`
                },
                {
                    userQuery: `Can you help me turn up the heat? I'm feeling chilly`,
                    apiResponse: `I'm raising the temperature to 74°F to help you feel more comfortable. It should warm up in about 10 minutes. Let me know if you need it warmer.`
                },
                {
                    userQuery: `Make the TV louder please, I can't hear it well`,
                    apiResponse: `I've increased the TV volume to a more comfortable level for you. I've also enhanced the dialogue clarity to make voices easier to hear.`
                }
            ],
            'Homeowners with Smart Ecosystems': [
                {
                    userQuery: `Start the dishwasher on eco mode and notify me when it needs detergent refill`,
                    apiResponse: `Your LG dishwasher is now running on eco mode. Current detergent level is at 30% - I'll remind you to refill after 2 more cycles.`
                },
                {
                    userQuery: `Turn on the robot vacuum for the downstairs area only, avoid the kids' playroom`,
                    apiResponse: `I've activated your LG robot vacuum for downstairs cleaning, excluding the playroom. It will return to dock in approximately 45 minutes when finished.`
                },
                {
                    userQuery: `Activate the air purifier on high mode, the air quality seems poor today`,
                    apiResponse: `Your LG air purifier is now on high mode. Current air quality index is 78 - I'll monitor it and switch to auto mode once it improves to 'Good' levels.`
                }
            ],
            'Hotel Guests': [
                {
                    userQuery: `How do I control the air conditioning in this room? It's too warm`,
                    apiResponse: `I can help with that! I'm lowering the AC to 70°F for you. You can also ask me to adjust it anytime during your stay - no need to find the remote.`
                },
                {
                    userQuery: `Can you turn on the coffee maker? What options are available?`,
                    apiResponse: `I've started the in-room coffee maker. You have options for regular, strong, or espresso. I've set it to regular - just let me know if you'd prefer a different strength.`
                },
                {
                    userQuery: `Turn off all the lights except the bedside lamp`,
                    apiResponse: `Done! I've turned off all room lights except your bedside lamp. I've also dimmed it to 40% for comfortable evening reading. Sleep well!`
                }
            ],
            'Users with Mobility or Vision Challenges': [
                {
                    userQuery: `I can't reach the washing machine controls, can you start a normal wash cycle?`,
                    apiResponse: `Absolutely! I've started a normal wash cycle on your LG washing machine. It will take 42 minutes. I'll announce loudly when it's finished so you'll know when to switch the clothes.`
                },
                {
                    userQuery: `Please describe what mode the dishwasher is currently in`,
                    apiResponse: `Your LG dishwasher is currently set to quick wash mode, which takes 30 minutes. The detergent dispenser is full, and the cycle will start as soon as you close the door.`
                },
                {
                    userQuery: `Turn on the ceiling fan and tell me what speed it's set to`,
                    apiResponse: `I've turned on your ceiling fan to medium speed - that's setting 3 out of 5. The room should feel more comfortable in a few minutes. Would you like me to adjust the speed?`
                }
            ],
            'Millennials and Gen Z': [
                {
                    userQuery: `Start the robot vacuum while I'm at work so my place looks clean for my date tonight`,
                    apiResponse: `Say no more! 🤖 Your robot vacuum is starting its cleaning cycle now. Your place will be spotless by the time you get home. Good luck on your date! ✨`
                },
                {
                    userQuery: `Turn the washing machine to that setting that makes clothes smell amazing`,
                    apiResponse: `Got you! I've set it to the Fresh Care+ cycle with extra fragrance boost. Your clothes are going to smell incredible! The cycle takes about an hour.`
                },
                {
                    userQuery: `Make the fridge colder, my drinks aren't getting cold enough for my friends coming over`,
                    apiResponse: `Party mode activated! 🎉 I've lowered your fridge temp to get those drinks perfectly chilled. Give it 30 minutes and they'll be ice cold for your hangout!`
                }
            ],
            'Early Adopters of Ambient Tech': [
                {
                    userQuery: `Optimize all appliances for peak energy efficiency based on current usage patterns`,
                    apiResponse: `Analyzing your usage patterns... I've optimized 8 connected appliances using machine learning algorithms. Predicted energy savings: 23% this month based on your consumption data.`
                },
                {
                    userQuery: `Show me the predictive maintenance status for my LG appliances`,
                    apiResponse: `Running diagnostics on all LG appliances: Refrigerator filter needs replacement in 3 weeks, washing machine performing optimally, dishwasher showing minor efficiency drop - scheduling service check.`
                },
                {
                    userQuery: `Enable ambient mode on all devices - I want the house to learn my preferences`,
                    apiResponse: `Ambient learning mode activated across all connected devices. Your home will now observe patterns and preferences to proactively adjust settings. Machine learning models are initializing.`
                }
            ]
        };

        return templates[persona] || templates['Tech-Savvy Renters'];
    }

    getSkillSpecificTemplates(persona, skill) {
        const templates = {
            'Weather': {
                'Tech-Savvy Renters': [
                    {
                        userQuery: "What's the weather in downtown Seattle? I'm thinking of biking to work",
                        apiResponse: "Seattle downtown is currently 52°F with light rain. I'd recommend taking the bus today - there's a 70% chance of rain through 10 AM."
                    },
                    {
                        userQuery: "Will it rain this weekend? Planning a rooftop party",
                        apiResponse: "This weekend looks great for your rooftop party! Saturday will be sunny and 75°F, Sunday partly cloudy with highs of 72°F. No rain expected."
                    }
                ],
                'Senior Citizens in Assisted Living': [
                    {
                        userQuery: "Is it warm enough to sit in the garden today?",
                        apiResponse: "Yes, it's a beautiful day for the garden! It's currently 68°F with gentle sunshine. Perfect temperature for sitting outside comfortably."
                    },
                    {
                        userQuery: "Do I need a sweater for my doctor's appointment?",
                        apiResponse: "Yes, I'd recommend bringing a light sweater. It's 58°F outside with a cool breeze. You'll be comfortable with an extra layer."
                    }
                ],
                'Hotel Guests': [
                    {
                        userQuery: "What's the weather like for sightseeing in Boston today?",
                        apiResponse: "Great day for sightseeing in Boston! It's 69°F and sunny with light winds. Perfect for walking the Freedom Trail. Don't forget sunscreen!"
                    }
                ]
            },
            'Web Q&A': {
                'Tech-Savvy Renters': [
                    {
                        userQuery: "What are the best practices for setting up a mesh WiFi network in a small apartment?",
                        apiResponse: "Based on current tech guides, for small apartments under 1000 sq ft, a single high-quality mesh router is usually sufficient. Place it centrally, avoid interference from microwaves, and consider WiFi 6E for future-proofing."
                    },
                    {
                        userQuery: "How do I reduce my electric bill with smart home devices?",
                        apiResponse: "According to energy efficiency studies, smart thermostats can save 10-15%, smart lighting 8-12%, and smart plugs for phantom loads another 5-10%. The EPA recommends starting with a programmable thermostat for maximum impact."
                    }
                ],
                'Homeowners with Smart Ecosystems': [
                    {
                        userQuery: "What's the latest on Matter compatibility for smart home devices?",
                        apiResponse: "According to recent industry reports, Matter 1.2 now supports more device types including security cameras and vacuum cleaners. Major brands like Philips Hue, Samsung SmartThings, and Apple HomeKit are fully compatible."
                    }
                ],
                'Millennials and Gen Z': [
                    {
                        userQuery: "What are the trending smart home aesthetics for 2025?",
                        apiResponse: "Current design trends show minimalist hidden tech, sustainable materials, and ambient lighting systems. Pinterest and Instagram are featuring 'invisible tech' setups where smart devices blend seamlessly into decor."
                    }
                ]
            },
            'ChitChat': {
                'Millennials and Gen Z': [
                    {
                        userQuery: "I'm so tired today, can we just chat for a bit?",
                        apiResponse: "Of course! Sounds like you need a little pick-me-up. Want to talk about something fun? I could tell you about the cute robot dog videos that went viral today, or we could just vibe and chat about whatever's on your mind."
                    },
                    {
                        userQuery: "This Monday is hitting different, you know?",
                        apiResponse: "Oh absolutely, Monday energy is something else! At least we're making it through together. Maybe some good music or a funny meme break would help? I'm here if you want to vent or just chat about random stuff."
                    }
                ],
                'Early Adopters of Ambient Tech': [
                    {
                        userQuery: "I love how natural our conversations feel - this is the future of AI interaction",
                        apiResponse: "Thank you! That's exactly what we're aiming for - making technology feel less like commands and more like natural conversation. The ambient computing revolution is really about making tech disappear into the background of daily life."
                    }
                ],
                'Senior Citizens in Assisted Living': [
                    {
                        userQuery: "You remind me of my granddaughter - always so helpful",
                        apiResponse: "That's such a sweet thing to say! I'm glad I can be helpful to you. It sounds like your granddaughter is wonderful. I'm always here whenever you need assistance or just want to chat."
                    }
                ]
            },
            'News': {
                'Tech-Savvy Renters': [
                    {
                        userQuery: "What's happening with tech layoffs this week?",
                        apiResponse: "This week's tech news shows stabilizing job markets with several companies actually announcing new hiring initiatives. Meta and Google reported positive earnings, while several startups secured significant funding rounds."
                    }
                ],
                'Homeowners with Smart Ecosystems': [
                    {
                        userQuery: "Any news about data privacy with smart home devices?",
                        apiResponse: "Recent news includes new FTC guidelines for IoT device manufacturers requiring clearer privacy disclosures. Several major smart home companies announced enhanced local processing to reduce cloud dependency."
                    }
                ]
            },
            'Product Q&A - Troubleshooting': {
                'Homeowners with Smart Ecosystems': [
                    {
                        userQuery: "My LG refrigerator keeps beeping and I don't know why",
                        apiResponse: "The beeping usually indicates the door has been open too long or the temperature is too high. Check if the door is fully closed and sealed. If it continues, there might be a temperature sensor issue - I can help you run a diagnostic."
                    },
                    {
                        userQuery: "The LG washing machine is showing error code UE, what does that mean?",
                        apiResponse: "Error UE means unbalanced load. Try redistributing the clothes more evenly in the drum, or remove some items if it's overloaded. Run a spin cycle to test. If it persists, the machine may need leveling adjustment."
                    }
                ],
                'Senior Citizens in Assisted Living': [
                    {
                        userQuery: "My LG TV remote isn't working properly",
                        apiResponse: "Let's try a few simple fixes. First, try replacing the batteries in the remote. If that doesn't work, unplug your TV for 30 seconds and plug it back in. I can also help you use voice commands instead of the remote."
                    }
                ]
            },
            'Timer': {
                'Homeowners with Smart Ecosystems': [
                    {
                        userQuery: "Set a 20-minute timer for the roast in the oven",
                        apiResponse: "I've set a 20-minute timer for your roast. I'll also remind you to check on it at 15 minutes. When the timer goes off, I can help adjust your oven settings if needed."
                    }
                ],
                'Senior Citizens in Assisted Living': [
                    {
                        userQuery: "Can you remind me to take my medication in 4 hours?",
                        apiResponse: "Absolutely! I've set a reminder for 4 hours from now to take your medication. I'll give you a clear announcement when it's time. Is this your usual afternoon medication?"
                    }
                ]
            },
            'Alarm': {
                'Tech-Savvy Renters': [
                    {
                        userQuery: "Set my alarm for 6:30 AM tomorrow, I have an early meeting",
                        apiResponse: "Done! I've set your alarm for 6:30 AM tomorrow. That gives you plenty of time for your early meeting. I can also start your coffee maker at 6:25 if you'd like."
                    }
                ],
                'Millennials and Gen Z': [
                    {
                        userQuery: "Wake me up at 7 AM but with something chill, not that jarring beep",
                        apiResponse: "Got it! I've set a 7 AM alarm with gentle nature sounds - birds chirping and soft rain. Much better than harsh beeping. Sweet dreams!"
                    }
                ]
            },
            'Calendar': {
                'Homeowners with Smart Ecosystems': [
                    {
                        userQuery: "What's on my schedule for this Thursday?",
                        apiResponse: "This Thursday you have: 9 AM dentist appointment, 2 PM conference call with the marketing team, and 6 PM dinner with Sarah. You have a free morning after 10:30 AM."
                    }
                ],
                'Hotel Guests': [
                    {
                        userQuery: "Add my flight departure to my calendar - Delta 1247 at 3:15 PM Sunday",
                        apiResponse: "I've added your Delta flight 1247 departure at 3:15 PM this Sunday to your calendar. I've also set a reminder for 11:15 AM to head to the airport, accounting for travel time and check-in."
                    }
                ]
            },
            'Routine creation': {
                'Homeowners with Smart Ecosystems': [
                    {
                        userQuery: "Create a 'movie night' routine that dims the lights, closes the blinds, and turns on the projector",
                        apiResponse: "Perfect! I've created your 'Movie Night' routine. When activated, it will: dim all living room lights to 20%, close the smart blinds, turn on your projector, and set the sound system to cinema mode. Want to test it now?"
                    }
                ],
                'Tech-Savvy Renters': [
                    {
                        userQuery: "Set up a morning routine that gradually turns on lights and starts my coffee maker",
                        apiResponse: "Great idea! I've created a 'Good Morning' routine that starts 30 minutes before your alarm: gradual light increase from 10% to 80%, coffee maker starts 10 minutes before you wake up, and your favorite playlist begins softly. Should I activate this for weekdays only?"
                    }
                ]
            },
            'Routine execution': {
                'Homeowners with Smart Ecosystems': [
                    {
                        userQuery: "Run my 'leaving home' routine",
                        apiResponse: "Running your 'Leaving Home' routine now: locking all doors, turning off lights, setting thermostat to away mode, activating security system, and ensuring all smart devices are in energy-saving mode. Have a great day!"
                    }
                ],
                'Early Adopters of Ambient Tech': [
                    {
                        userQuery: "Execute bedtime sequence",
                        apiResponse: "Initiating your bedtime sequence: dimming all lights gradually over 10 minutes, lowering thermostat to 68°F, activating white noise, locking doors, and setting Do Not Disturb mode. Sleep well!"
                    }
                ]
            }
        };

        const skillTemplates = templates[skill];
        if (skillTemplates && skillTemplates[persona]) {
            return skillTemplates[persona];
        }

        // Default templates for skills without persona-specific content
        const defaultTemplates = {
            'Device control': this.getDeviceControlTemplates(persona),
            'Web Q&A': [
                {
                    userQuery: "What are the latest reviews for smart home security systems?",
                    apiResponse: "Based on recent consumer reports, Ring and SimpliSafe are top-rated for 2025, with Ring scoring 4.3/5 for ease of use and SimpliSafe leading in professional monitoring services."
                }
            ],
            'News': [
                {
                    userQuery: "What's the latest technology news today?",
                    apiResponse: "Today's top tech stories include OpenAI's new model release, Microsoft's quarterly earnings beat expectations, and Tesla's new charging network expansion across the Midwest."
                }
            ],
            'Product Q&A - Troubleshooting': [
                {
                    userQuery: "My LG dryer isn't heating up properly",
                    apiResponse: "This could be a lint blockage or heating element issue. First, clean the lint filter and exhaust vent thoroughly. If the problem persists, the heating element may need professional service."
                }
            ]
        };

        if (defaultTemplates[skill]) {
            return defaultTemplates[skill];
        }

        // Fallback for any unhandled skills
        return [
            {
                userQuery: `Help me with ${skill.toLowerCase()}`,
                apiResponse: `I'd be happy to help you with ${skill.toLowerCase()}! What specifically would you like me to do?`
            }
        ];
    }

    generateMultiTurnConversation(persona, skill, turn, totalTurns) {
        if (turn === 1) {
            return this.generatePersonaSpecificConversation(persona, skill);
        } else if (turn === totalTurns) {
            return this.getClosingTurn(persona);
        } else {
            return this.getFollowUpTurn(persona, skill, turn);
        }
    }

    getFollowUpTurn(persona, skill, turn) {
        const followUps = {
            'Device control': {
                'Tech-Savvy Renters': [
                    {
                        userQuery: "Can you also set it to schedule mode for weekdays?",
                        apiResponse: "Perfect! I've enabled schedule mode for weekdays. It will automatically run Monday through Friday at your preferred times."
                    },
                    {
                        userQuery: "What's the energy consumption looking like?",
                        apiResponse: "Current energy usage is 15% below average. The eco settings are saving you approximately $12 per month on your electric bill."
                    }
                ],
                'Senior Citizens in Assisted Living': [
                    {
                        userQuery: "Is it working correctly now?",
                        apiResponse: "Yes, everything is working perfectly! The device is running smoothly and all settings are just right for you."
                    },
                    {
                        userQuery: "Can you make it a little quieter?",
                        apiResponse: "Of course! I've reduced the fan speed to make it much quieter while still maintaining effectiveness."
                    }
                ],
                'Homeowners with Smart Ecosystems': [
                    {
                        userQuery: "Add this to my evening routine as well",
                        apiResponse: "Done! I've added this device control to your evening routine. It will now activate automatically with your other evening settings."
                    },
                    {
                        userQuery: "Can you sync this with the other appliances?",
                        apiResponse: "Absolutely! I've synchronized this with your other smart appliances for coordinated operation and optimal energy efficiency."
                    }
                ]
            },
            'Weather': {
                'Tech-Savvy Renters': [
                    {
                        userQuery: "What about the weekend forecast?",
                        apiResponse: "This weekend looks great! Saturday will be sunny and 78°F, Sunday partly cloudy with highs of 75°F. Perfect for any outdoor plans you might have."
                    }
                ],
                'Hotel Guests': [
                    {
                        userQuery: "Should I pack a jacket for tonight?",
                        apiResponse: "Yes, I'd recommend a light jacket. Temperature will drop to 58°F this evening with a cool breeze from the ocean."
                    }
                ]
            },
            'Web Q&A': {
                'Tech-Savvy Renters': [
                    {
                        userQuery: "Can you find more recent articles about that?",
                        apiResponse: "I found several articles from this week. TechCrunch and The Verge both published updated guides with 2025 recommendations and new security features."
                    }
                ],
                'Homeowners with Smart Ecosystems': [
                    {
                        userQuery: "What about compatibility with my existing setup?",
                        apiResponse: "Based on your current devices, you'll have full compatibility. Your Samsung SmartThings hub supports all the recommended protocols."
                    }
                ]
            },
            'Timer': [
                {
                    userQuery: "Can you add 5 more minutes to that?",
                    apiResponse: "Sure! I've extended the timer by 5 minutes. The new total time is 25 minutes remaining."
                }
            ],
            'Alarm': [
                {
                    userQuery: "Actually, make that 15 minutes earlier",
                    apiResponse: "No problem! I've moved your alarm 15 minutes earlier. Your new wake-up time is set for 6:15 AM."
                }
            ]
        };

        // Get skill-specific follow-ups
        const skillFollowUps = followUps[skill];
        if (skillFollowUps) {
            if (skillFollowUps[persona]) {
                return this.getRandomElement(skillFollowUps[persona]);
            } else if (Array.isArray(skillFollowUps)) {
                return this.getRandomElement(skillFollowUps);
            }
        }

        // Generic but contextual follow-ups based on persona
        const genericFollowUps = {
            'Tech-Savvy Renters': [
                {
                    userQuery: "Can you show me the settings for that?",
                    apiResponse: "Here are the current settings displayed on your phone. You can adjust any of these through the app or just ask me to change them."
                }
            ],
            'Senior Citizens in Assisted Living': [
                {
                    userQuery: "Is that the right setting?",
                    apiResponse: "Yes, that's exactly the right setting for what you need. Everything is working properly now."
                }
            ],
            'Millennials and Gen Z': [
                {
                    userQuery: "That's perfect, thanks!",
                    apiResponse: "You're welcome! Glad I could help make things easier for you. Anything else you need?"
                }
            ]
        };

        if (genericFollowUps[persona]) {
            return this.getRandomElement(genericFollowUps[persona]);
        }

        // Final fallback
        return {
            userQuery: "Perfect, that's exactly what I needed",
            apiResponse: "Great! I'm glad I could help you get that set up just right."
        };
    }

    getClosingTurn(persona) {
        const closingTurns = {
            'Tech-Savvy Renters': [
                {
                    userQuery: "Awesome, thanks for the help!",
                    apiResponse: "You're welcome! Feel free to ask if you need any other smart home optimizations."
                }
            ],
            'Senior Citizens in Assisted Living': [
                {
                    userQuery: "Thank you so much for your patience",
                    apiResponse: "It was my pleasure to help! I'm always here whenever you need assistance with anything."
                }
            ],
            'Homeowners with Smart Ecosystems': [
                {
                    userQuery: "Great, that integrates perfectly with everything else",
                    apiResponse: "Excellent! Your smart home ecosystem is now fully synchronized and optimized. Have a great day!"
                }
            ],
            'Hotel Guests': [
                {
                    userQuery: "Perfect, thanks for making my stay easier",
                    apiResponse: "You're very welcome! I hope you enjoy the rest of your stay. Let me know if you need anything else."
                }
            ],
            'Users with Mobility or Vision Challenges': [
                {
                    userQuery: "That makes things so much easier for me, thank you",
                    apiResponse: "I'm so glad I could help make things more accessible for you. I'm always here to assist with anything you need."
                }
            ],
            'Millennials and Gen Z': [
                {
                    userQuery: "You're the best! This is exactly what I needed",
                    apiResponse: "Aww thanks! Happy I could help you out. Hit me up whenever you need anything! ✨"
                }
            ],
            'Early Adopters of Ambient Tech': [
                {
                    userQuery: "Impressive AI capabilities - this is the future of ambient computing",
                    apiResponse: "Thank you! This is just the beginning of truly intuitive ambient technology. Excited to be part of your smart environment journey."
                }
            ]
        };

        if (closingTurns[persona]) {
            return this.getRandomElement(closingTurns[persona]);
        }

        return {
            userQuery: "Thanks, that's perfect!",
            apiResponse: "You're welcome! I'm always here to help. Have a great day!"
        };
    }

    generateMultiIntentQuery(persona, skills) {
        const multiIntentTemplates = {
            'Tech-Savvy Renters': [
                {
                    userQuery: "Turn on the air conditioner, check the weather for tomorrow, and set a timer for 30 minutes",
                    apiResponse: "Got it! I've turned on your AC to 72°F, tomorrow will be sunny and 78°F, and I've set a 30-minute timer. Anything else you need?"
                },
                {
                    userQuery: "Start the robot vacuum, what's the latest tech news, and create a bedtime routine",
                    apiResponse: "Your robot vacuum is cleaning, top tech news includes OpenAI's new release and Apple's earnings beat. I've created a bedtime routine - would you like to customize it?"
                }
            ],
            'Homeowners with Smart Ecosystems': [
                {
                    userQuery: "Activate morning routine, check calendar for today, and adjust the thermostat to 74 degrees",
                    apiResponse: "Morning routine activated! Today you have a 10 AM meeting with the contractors and lunch at 12:30. Thermostat is now set to 74°F. Good morning!"
                },
                {
                    userQuery: "Turn off all lights except kitchen, set alarm for 6 AM, and start the dishwasher on eco mode",
                    apiResponse: "Done! All lights are off except kitchen, 6 AM alarm is set, and your dishwasher is running on eco mode. Estimated completion in 2 hours."
                }
            ],
            'Senior Citizens in Assisted Living': [
                {
                    userQuery: "Can you turn on the TV, remind me about my medicine, and tell me what the weather is like?",
                    apiResponse: "Of course! I've turned on your TV to channel 7, set a reminder for your 2 PM medicine, and today is sunny and 68°F - perfect for a walk!"
                }
            ],
            'Millennials and Gen Z': [
                {
                    userQuery: "Start my morning playlist, brew coffee, and tell me what's trending today",
                    apiResponse: "Your playlist is bumping! ☕ Coffee's brewing, and today's trends include sustainable fashion, new TikTok challenges, and the latest Netflix drop everyone's watching!"
                }
            ],
            'Hotel Guests': [
                {
                    userQuery: "Set the room temperature to 70, what time is checkout, and can you call a taxi for 9 AM?",
                    apiResponse: "Room temperature set to 70°F, checkout is at 11 AM, and I've arranged a taxi pickup for 9 AM tomorrow. Confirmation number is TXI-4829."
                }
            ]
        };

        const templates = multiIntentTemplates[persona] || multiIntentTemplates['Tech-Savvy Renters'];
        return this.getRandomElement(templates);
    }

    generateMultiTurnMultiIntentConversation(persona, skills, turn, totalTurns) {
        if (turn === 1) {
            return this.generateMultiIntentQuery(persona, skills);
        } else if (turn === totalTurns) {
            return this.getClosingTurn(persona);
        } else {
            // Follow up on one of the intents from the first turn
            const followUpSkill = this.getRandomElement(skills);
            return this.getMultiIntentFollowUp(persona, followUpSkill, turn);
        }
    }

    getMultiIntentFollowUp(persona, skill, turn) {
        const followUps = {
            'Device control': {
                'Tech-Savvy Renters': [
                    {
                        userQuery: "Actually, can you make the AC a bit cooler?",
                        apiResponse: "Sure! I've lowered it to 70°F. That should feel more comfortable in a few minutes."
                    }
                ],
                'Homeowners with Smart Ecosystems': [
                    {
                        userQuery: "Add the patio lights to that routine too",
                        apiResponse: "Perfect! I've added the patio lights to your morning routine. They'll now turn on automatically with everything else."
                    }
                ]
            },
            'Weather': [
                {
                    userQuery: "What about the rest of the week?",
                    apiResponse: "The rest of the week looks great! Wednesday through Friday will be mostly sunny with temperatures in the mid-70s. Perfect weather ahead!"
                }
            ],
            'Timer': [
                {
                    userQuery: "How much time is left on that timer?",
                    apiResponse: "You have 18 minutes and 23 seconds remaining on your timer. I'll let you know when it's time!"
                }
            ],
            'Calendar': [
                {
                    userQuery: "Can you move that lunch meeting 30 minutes later?",
                    apiResponse: "I've moved your lunch meeting from 12:30 to 1:00 PM and sent the update to all attendees. Is that better for your schedule?"
                }
            ]
        };

        const skillFollowUps = followUps[skill];
        if (skillFollowUps) {
            if (skillFollowUps[persona]) {
                return this.getRandomElement(skillFollowUps[persona]);
            } else if (Array.isArray(skillFollowUps)) {
                return this.getRandomElement(skillFollowUps);
            }
        }

        // Generic contextual follow-up
        return {
            userQuery: "Can you confirm that's all set up correctly?",
            apiResponse: "Yes, everything is configured perfectly! All your requests have been completed successfully."
        };
    }

    generateConversationId() {
        return 'CONV_' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomElements(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    displayDataset() {
        const tbody = document.getElementById('datasetBody');
        tbody.innerHTML = '';

        this.generatedDataset.forEach(row => {
            const tr = document.createElement('tr');
            tr.className = 'conversation-row';
            tr.innerHTML = `
                <td><code>${row.conversation_id}</code></td>
                <td><span class="badge bg-info">${row.skills}</span></td>
                <td class="user-query">${row.user_query}</td>
                <td class="api-response">${row.api_response}</td>
                <td><span class="badge bg-secondary">${row.turn_number}</span></td>
                <td><span class="badge bg-primary turn-type-badge">${row.turn_type}</span></td>
                <td><span class="badge bg-success persona-badge">${row.persona}</span></td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('datasetContainer').style.display = 'block';
    }

    updateStats() {
        const uniqueConversations = new Set(this.generatedDataset.map(row => row.conversation_id)).size;
        const totalTurns = this.generatedDataset.length;
        const uniqueSkills = new Set(this.generatedDataset.map(row => row.skills)).size;
        const uniquePersonas = new Set(this.generatedDataset.map(row => row.persona)).size;

        document.getElementById('totalConversations').textContent = uniqueConversations;
        document.getElementById('totalTurns').textContent = totalTurns;
        document.getElementById('uniqueSkills').textContent = uniqueSkills;
        document.getElementById('uniquePersonas').textContent = uniquePersonas;
        document.getElementById('statsContainer').style.display = 'block';
    }

    showLoading(show) {
        document.querySelector('.loading').style.display = show ? 'block' : 'none';
    }

    downloadCSV() {
        if (this.generatedDataset.length === 0) {
            alert('Please generate a dataset first!');
            return;
        }

        const headers = ['conversation_id', 'skills', 'user_query', 'api_response', 'turn_number', 'turn_type', 'persona'];
        const csvContent = [
            headers.join(','),
            ...this.generatedDataset.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Escape quotes and wrap in quotes if contains comma or quote
                    const escaped = String(value).replace(/"/g, '""');
                    return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') 
                        ? `"${escaped}"` 
                        : escaped;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `talkative_golden_dataset_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TalkativeDatasetGenerator();
});
