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
                    userQuery: `Hey Talkative, can you turn on the ${lgDevice} and set it to eco mode?`,
                    apiResponse: `Sure! I'm turning on your LG ${lgDevice} and setting it to eco mode. The device should be ready in a moment.`
                },
                {
                    userQuery: `Talkative, optimize my ${homeyDevice} settings for energy efficiency`,
                    apiResponse: `I've optimized your ${homeyDevice} settings for maximum energy efficiency. You should see reduced power consumption starting now.`
                },
                {
                    userQuery: `Can you create a smart scene that dims the lights and turns on the ${lgDevice}?`,
                    apiResponse: `Absolutely! I've created a custom scene called "Relax Mode" that dims your lights to 30% and turns on your LG ${lgDevice}. Would you like to activate it now?`
                }
            ],
            'Senior Citizens in Assisted Living': [
                {
                    userQuery: `Talkative, please turn on the ${lgDevice}. I'm having trouble with the remote.`,
                    apiResponse: `Of course! I'm turning on your LG ${lgDevice} right now. Is there anything else you'd like me to help you with?`
                },
                {
                    userQuery: `Can you help me with the ${homeyDevice}? I don't know how to use it.`,
                    apiResponse: `I'd be happy to help! I'm turning on your ${homeyDevice} for you. If you need to adjust any settings, just ask me and I'll take care of it.`
                },
                {
                    userQuery: `Talkative, make the house warmer please. I'm feeling cold.`,
                    apiResponse: `I'm adjusting your thermostat to make it warmer. I've increased the temperature by 3 degrees. It should start feeling more comfortable in a few minutes.`
                }
            ],
            'Homeowners with Smart Ecosystems': [
                {
                    userQuery: `Talkative, activate my morning routine with the ${lgDevice} and ${homeyDevice}`,
                    apiResponse: `Good morning! I'm activating your morning routine. Starting your LG ${lgDevice}, adjusting the ${homeyDevice}, and turning on your other connected devices. Everything should be ready in 2 minutes.`
                },
                {
                    userQuery: `Can you integrate the new ${lgDevice} with my existing smart home setup?`,
                    apiResponse: `I've successfully integrated your new LG ${lgDevice} with your smart home ecosystem. It's now part of your existing routines and can be controlled through all your automation rules.`
                },
                {
                    userQuery: `Talkative, check the status of all my LG appliances`,
                    apiResponse: `Here's your LG appliance status: Your ${lgDevice} is running efficiently, the refrigerator temperature is optimal, and your washing machine cycle will complete in 15 minutes. All systems are functioning normally.`
                }
            ],
            'Hotel Guests': [
                {
                    userQuery: `Talkative, how do I control the ${lgDevice} in this room?`,
                    apiResponse: `Welcome to your room! To control the LG ${lgDevice}, just ask me. I can turn it on, adjust settings, or help with any other room features. What would you like me to do?`
                },
                {
                    userQuery: `Can you turn on the ${homeyDevice} and set the room temperature to 72 degrees?`,
                    apiResponse: `Certainly! I'm turning on the ${homeyDevice} and setting your room temperature to 72 degrees. The room should reach your preferred temperature in about 10 minutes.`
                },
                {
                    userQuery: `Talkative, what services are available in this hotel room?`,
                    apiResponse: `You have access to climate control, lighting, entertainment systems, and room service through me. I can also provide information about hotel amenities and local recommendations. How can I assist you?`
                }
            ],
            'Users with Mobility or Vision Challenges': [
                {
                    userQuery: `Talkative, I can't reach the ${lgDevice} controls. Can you help me turn it on?`,
                    apiResponse: `Absolutely! I'm turning on your LG ${lgDevice} for you right now. I'm here to help with any controls that are difficult to reach. Just let me know what you need.`
                },
                {
                    userQuery: `Can you describe what's happening with the ${homeyDevice} status?`,
                    apiResponse: `Your ${homeyDevice} is currently on and functioning normally. The indicator light is green, which means it's operating properly. Would you like me to make any adjustments?`
                },
                {
                    userQuery: `Talkative, please announce when the ${lgDevice} cycle is complete`,
                    apiResponse: `I've set up an announcement for when your LG ${lgDevice} cycle completes. I'll give you a clear audio notification so you know exactly when it's finished.`
                }
            ],
            'Millennials and Gen Z': [
                {
                    userQuery: `Yo Talkative, turn on the ${lgDevice} and make it aesthetic AF`,
                    apiResponse: `Got it! Turning on your LG ${lgDevice} with the perfect ambient settings. Added some mood lighting too - it's about to look absolutely aesthetic! ✨`
                },
                {
                    userQuery: `Talkative, can you connect my ${homeyDevice} to my social media for content creation?`,
                    apiResponse: `I've optimized your ${homeyDevice} settings for content creation! The lighting and positioning are perfect for your videos. Want me to start a timer for your recording session?`
                },
                {
                    userQuery: `Make my smart home setup Insta-worthy with the ${lgDevice}`,
                    apiResponse: `Creating the perfect Insta-worthy vibe! I'm adjusting your LG ${lgDevice}, syncing the lighting, and setting up the ideal atmosphere for your content. Ready to go viral! 📱✨`
                }
            ],
            'Early Adopters of Ambient Tech': [
                {
                    userQuery: `Talkative, demonstrate the latest features of the ${lgDevice} with ambient integration`,
                    apiResponse: `Showcasing cutting-edge features! Your LG ${lgDevice} now has predictive ambient adjustments, seamless IoT integration, and AI-powered optimization. I'm activating the full ambient experience.`
                },
                {
                    userQuery: `Can you show me the advanced automation capabilities with the ${homeyDevice}?`,
                    apiResponse: `Absolutely! I'm demonstrating advanced automation with your ${homeyDevice}. This includes ML-based behavior prediction, contextual adaptation, and seamless integration with your entire ambient ecosystem.`
                },
                {
                    userQuery: `Talkative, what's the latest update for ambient technology integration?`,
                    apiResponse: `The latest ambient tech update includes enhanced spatial awareness, improved predictive algorithms, and better cross-device communication. I'm updating your system with these new capabilities right now.`
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
                        userQuery: "Talkative, what's the weather forecast for my commute tomorrow?",
                        apiResponse: "Tomorrow's forecast shows 72°F with partly cloudy skies. Light traffic expected during your usual commute time. Perfect weather for walking or cycling to work!"
                    }
                ],
                'Senior Citizens in Assisted Living': [
                    {
                        userQuery: "Talkative, will it be a good day to go outside?",
                        apiResponse: "Yes, it's a lovely day! The temperature is a comfortable 70°F with gentle breezes. Perfect weather for a walk in the garden or sitting outside."
                    }
                ],
                'Hotel Guests': [
                    {
                        userQuery: "What's the weather like here? Should I pack an umbrella?",
                        apiResponse: "The local weather is sunny with temperatures around 75°F. No rain expected today, so you can leave the umbrella in your room and enjoy exploring the city!"
                    }
                ]
            },
            'ChitChat': {
                'Millennials and Gen Z': [
                    {
                        userQuery: "Talkative, what's trending today?",
                        apiResponse: "Today's trending topics include sustainable living, new tech innovations, and some amazing food trends! Want me to dive deeper into any of these?"
                    }
                ],
                'Early Adopters of Ambient Tech': [
                    {
                        userQuery: "Tell me something interesting about AI today",
                        apiResponse: "Did you know that ambient AI is now capable of predicting your needs before you even realize them? The latest developments in contextual awareness are truly fascinating!"
                    }
                ]
            },
            'Timer': {
                'Homeowners with Smart Ecosystems': [
                    {
                        userQuery: "Set a 25-minute timer for my workout session",
                        apiResponse: "Perfect! I've set a 25-minute workout timer. I'll also adjust your smart home lighting for optimal exercise conditions and play your workout playlist."
                    }
                ]
            }
        };

        const skillTemplates = templates[skill];
        if (skillTemplates && skillTemplates[persona]) {
            return skillTemplates[persona];
        }

        // Default templates for any skill/persona combination
        return [
            {
                userQuery: `Can you help me with ${skill.toLowerCase()}?`,
                apiResponse: `I'd be happy to help you with ${skill.toLowerCase()}! What specifically would you like me to do?`
            }
        ];
    }

    generateMultiTurnConversation(persona, skill, turn, totalTurns) {
        if (turn === 1) {
            return this.generatePersonaSpecificConversation(persona, skill);
        } else if (turn === totalTurns) {
            return {
                userQuery: "Thanks, that's perfect!",
                apiResponse: "You're welcome! I'm always here to help. Have a great day!"
            };
        } else {
            return {
                userQuery: "Can you adjust that a bit more?",
                apiResponse: "Absolutely! I've made the adjustment. How does that look now?"
            };
        }
    }

    generateMultiIntentQuery(persona, skills) {
        const device1 = this.getRandomElement(this.lgDevices);
        const device2 = this.getRandomElement(this.homeyDevices);
        
        return {
            userQuery: `Talkative, turn on the ${device1}, check the weather, and set a timer for 30 minutes`,
            apiResponse: `I've turned on your LG ${device1}, the current weather is 72°F and sunny, and I've set a 30-minute timer. Anything else you need?`
        };
    }

    generateMultiTurnMultiIntentConversation(persona, skills, turn, totalTurns) {
        if (turn === 1) {
            return this.generateMultiIntentQuery(persona, skills);
        } else {
            return this.generateMultiTurnConversation(persona, skills[0], turn, totalTurns);
        }
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
