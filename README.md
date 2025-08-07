# Talkative Golden Dataset Generator

A comprehensive web application for generating realistic conversational datasets for the Talkative voice assistant device targeting the US market.

## Features

- **Persona-Based Generation**: Creates conversations tailored to 7 distinct US personas
- **Multiple Conversation Types**: Supports all combinations of single/multi-intent and single/multi-turn conversations  
- **Realistic Device Integration**: Incorporates actual LG and Homey device lists with authentic capabilities
- **US Market Focus**: Language, scenarios, and references specifically crafted for American users
- **Interactive Interface**: Easy-to-use web interface with real-time generation and preview
- **CSV Export**: Download generated datasets in CSV format for training and analysis

## Supported Personas

1. **Tech-Savvy Renters** - Young professionals in apartments with smart device expertise
2. **Senior Citizens in Assisted Living** - Elderly users needing simple, clear interactions
3. **Homeowners with Smart Ecosystems** - Users with comprehensive home automation setups
4. **Hotel Guests** - Temporary users interacting with room-based voice assistants
5. **Users with Mobility or Vision Challenges** - Accessibility-focused interactions
6. **Millennials and Gen Z** - Younger users with casual, trendy communication styles
7. **Early Adopters of Ambient Tech** - Technology enthusiasts interested in cutting-edge features

## Conversation Types

- **Single Intent, Single Turn**: One request, one response
- **Single Intent, Multi Turn**: One main topic across multiple exchanges
- **Multi Intent, Single Turn**: Multiple requests in one user query
- **Multi Intent, Multi Turn**: Multiple topics across multiple exchanges

## Supported Skills

Based on the skills.csv file with status "Y":
- Device Control
- ChitChat  
- Weather
- News
- Product Q&A - Troubleshooting
- Web Q&A
- Routine Creation
- Routine Execution
- Alarm
- Calendar
- Timer

## Device Integration

### LG Appliances (25 devices)
Including air conditioners, refrigerators, washing machines, TVs, and more smart home appliances.

### Homey Devices (25 devices)  
Third-party IoT devices including lights, sensors, locks, cameras, and other smart home accessories.

## Usage

1. Open `index.html` in a web browser
2. Select a persona (or leave blank for all personas)
3. Set the number of conversations per persona (5-50)
4. Click "Generate Dataset" to create realistic conversations
5. Review the generated data in the table
6. Click "Download CSV" to export the dataset

## Dataset Format

The generated CSV contains the following columns:
- `conversation_id`: Unique identifier for each conversation
- `skills`: Comma-separated list of skills used
- `user_query`: The user's input/question
- `api_response`: Talkative's response
- `turn_number`: Turn number within the conversation
- `turn_type`: Type of conversation (single/multi intent/turn)
- `persona`: User persona category

## Files

- `index.html`: Main web interface
- `dataset-generator.js`: Core generation logic and conversation templates
- `skills.csv`: Available skills and their status
- `LG Appliances.csv`: LG device catalog
- `HomeyDeviceList.csv`: Third-party device catalog

## Technical Details

- Pure HTML/CSS/JavaScript - no server required
- Bootstrap 5 for responsive UI
- Font Awesome icons
- Client-side CSV generation and download
- Real-time statistics and preview

The application generates contextually appropriate conversations that reflect realistic usage patterns for each persona while incorporating actual device capabilities and US cultural references.
