import React from 'react';
import ReactDOM from 'react-dom';
import { parseEntry, getAllEntryTexts } from './doubleexposure.js'
import App from './App';
import testdata from './sampledata/d20.json'

/*
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
*/

  /*
it ('should parse dom', () => {
    const page = testdata.contents;
    const parser = new DOMParser();
    const doc = parser.parseFromString(page, "text/html");
    const entryTexts = getAllEntryTexts(doc);
    expect(entryTexts.length).toEqual(53);
    // Need to parse Q001
    // expect(entryTexts.length).toEqual(54);
});
*/


it ('parse a complex Entry 1', () => {
    const entry = `L014: Breach v1.0; "Breach: Mobile Strike Team Alpha" by Pandaragon Games. The first mobile strike team has been assembled. The Foundation's finest candidates, given weapon and rank and a purpose. Thursday, 8:00PM - 12:00AM; One Round; All Materials Offered. Beginners Welcome; Serious, 18 & Over ONLY.`

    const expectedEntry = {
        id: 'L014',
        type: 'Breach v1.0',
        name: 'Breach: Mobile Strike Team Alpha',
        author: 'Pandaragon Games',
        presenter: '',
        description: "The first mobile strike team has been assembled. The Foundation's finest candidates, given weapon and rank and a purpose.",
        day: 'Thursday',
        time: '8:00PM - 12:00AM',
        round: 'One Round',
        material: 'All Materials Offered',
        level: 'Beginners Welcome',
        attitude: 'Serious',
        age: '18 & Over ONLY',
        nextRound: '',
        seeAlso: '',
        status: '',
    };
    const parsedEntry = parseEntry(entry);
    expect(parsedEntry).toEqual(expectedEntry);
    expect(parsedEntry).toMatchObject(expectedEntry);
});

it ('parse a complex Entry 2', () => {
    const entry = `L028: Wayfinder; "The Hedge: Orientation" by No Company; presented by Ben Schwartz Inc.. Sentence 1.. Sentence 2. Sentence 3. Sentence 4.. Friday, 2:00PM - 6:00PM; One Round; All Materials Provided. Beginners Welcome; Serious, Young Players Encouraged. See Also: L023, L024. ONLY ONE SEAT LEFT!`;

    const expectedEntry = {
        id: 'L028',
        type: 'Wayfinder',
        name: 'The Hedge: Orientation',
        author: 'No Company',
        presenter: 'Ben Schwartz Inc.',
        description: 'Sentence 1.. Sentence 2. Sentence 3. Sentence 4..',
        day: 'Friday',
        time: '2:00PM - 6:00PM',
        round: 'One Round',
        material: 'All Materials Provided',
        level: 'Beginners Welcome',
        attitude: 'Serious',
        age: 'Young Players Encouraged',
        nextRound: '',
        seeAlso: 'L023, L024',
        status: 'ONLY ONE SEAT LEFT!',
    };
    const parsedEntry = parseEntry(entry);
    expect(parsedEntry).toMatchObject(expectedEntry);
    // TODO: Test simpler entry
});
it ('parse an Entry with nested quotes', () => {
    const entry =
        `L019: "Releasing STEAM" presented by Andi & Morgan Gastonguay. In our last adventure, the brave superhero children of Downhill befriended the dragon STEAM. Join the children of Downhill for their next fun adventure with STEAM in a Live Action Role Playing game designed specifically for young players. This game will focus on age appropriate puzzles and storytelling. Characters will be created at the game. Children must be accompanied by an adult who will be playing the part of their "favorite stuffed animal" who comes to life via the magic of Downhill. Friday, 9:00AM - 1:00PM; One Round; All Materials Provided. Beginners Welcome; Silly, Young Players Encouraged.`

    const parsedEntry = parseEntry(entry);
    expect(parsedEntry.name).toEqual("Releasing STEAM");
});


it ('make sure status is included', () => {
  const entry = `L0017: Freeform; "The Porch" by Damocles Thread Development. Teenagers gather together on a porch in a small town, on the last night of the summer before they all go off to college or the army or another day at the corner deli. Each one of them has a burning question they want answered - but they can't quite bring themselves to ask. "The Porch" won a Golden Cobra award for Most Convention-Ready LARP at METATOPIA 2016. Thursday, 8:00PM - 12:00AM; One Round; All Materials Provided. Beginners Welcome; Serious, Under 18 Requires Parental Clearance. THIS EVENT HAS BEEN FILLED! You may sign up as an Alternate at the convention.`;
    const parsedEntry = parseEntry(entry);
    expect(parsedEntry.age).toEqual("Under 18 Requires Parental Clearance");
    expect(parsedEntry.status).toEqual("THIS EVENT HAS BEEN FILLED! You may sign up as an Alternate at the convention");
});

it ('must handle no byline', () => {
  const entry =
    `R0333: CONTINUUM (1.1); "The Electric Lamb". A DEXCON 20 EXCLUSIVE! The 2017 Aetherco CONTINUUM Championship. Temporary memory enhancement nano is one of the largest consumer products of the 21st Century. Obviously ancient Mesopotamian herdsmen shouldn't have it in their bodies. Let alone be able to manipulate people's behavior at vast distances of time. Your task is to span down to their era and untangle this paradox before you fall under their "spell". Don't presume easy superiority: Those herdsman know how to herd. Called "unusual" by the Sci-Fi Channel, and "unique and painfully satisfying" and "very cool" by player-reviewers on Amazon.com, CONTINUUM has broken new ground by logically solving every time travel conundrum, and actually made a civilization of time travelers outrageously playable. Saturday, 2:00PM - 6:00PM; One Round; All Materials Provided. Beginners Welcome; Serious, All Ages.`;
    const parsedEntry = parseEntry(entry);
    expect(parsedEntry.type).toEqual("CONTINUUM (1.1)");
    expect(parsedEntry.name).toEqual("The Electric Lamb");
});

it ('parse an simple Entry', () => {
    const entry = `R0268: "Sentinels of the Multiverse RPG (Sneak Peek)". An Envoy Event! See R0213. Friday, 2:00PM - 6:00PM; One Round. See Also: R0355. THIS EVENT HAS BEEN FILLED! You may sign up as an Alternate at the convention.`;

    const expectedEntry = {
        id: 'R0268',
        type: '',
        name: 'Sentinels of the Multiverse RPG (Sneak Peek)',
        author: '',
        presenter: '',
        description: 'An Envoy Event! See R0213.',
        day: 'Friday',
        time: '2:00PM - 6:00PM',
        round: 'One Round',
        material: '',
        level: '',
        attitude: '',
        age: '',
        nextRound: '',
        seeAlso: 'R0355',
        status: 'THIS EVENT HAS BEEN FILLED! You may sign up as an Alternate at the convention.',
    };
    const parsedEntry = parseEntry(entry);
    expect(parsedEntry).toMatchObject(expectedEntry);
    // TODO: Test simpler entry
});

it('is broken for some reason', () => {
    const entry =
    `L031: Cthulhu Live! 3.5; "Shirley, You Can't Be Serious!" by PST Productions; presented by Emily Meyers. A DEXCON 21 EXCLUSIVE! "Good Morning, Passengers of Flight 468, departing soon for Mexico City! I will be your pilot today; Captain O'Vergh. My copilot is Roger Murtock and we anticipate about four hours of flight time today with mild weather conditions. There will be an inflight meal service as soon as we reach cruising altitude, your flight attendants will be coming around after the safety briefing and please let them know if you prefer the chicken or the fish.." were the last sane lines spoken on Flight 468, which was flying straight into a hilarious disaster no one could predict. The passengers may have to band together to save this flight from the lowest form of humor, and if they do not make any grave mistakes; perhaps they will survive! Trigger Warning: Claustrophobic Circumstances (Planes/Trains), Vehicular Accidents, Illnesses/Epidemics, Paronomasia. Friday, 8:00PM - 12:00AM; One Round; All Materials Provided. Beginners Welcome; Silly, 18 & Over ONLY.`;
    const parsedEntry = parseEntry(entry);
    expect(parsedEntry.name).toEqual("Shirley, You Can't Be Serious!");
});

it ('should handle metatopia tests', () => {
    const expectedEntry = {
        id: 'R350',
        type: '',
        name: 'The Steps Between',
        author: '',
        presenter: 'Amr El-Azizi',
        description: 'The solution to every problem is pretty simple, at least in hindsight. Even when you factor magic into the equation.',
        day: 'Friday',
        time: '8:00PM - 10:00PM',
        round: '',
        material: '',
        level: '',
        attitude: 'Fun',
        age: 'All Ages',
        nextRound: '',
        seeAlso: '',
        hiTest: true,
        status: 'There are 4 seats left',
        testType: "[ALPHA TEST]",
    };
  const entry = `R350: [ALPHA TEST] "The Steps Between" presented by Amr El-Azizi. The solution to every problem is pretty simple, at least in hindsight. Even when you factor magic into the equation. Friday, 8:00PM - 10:00PM; Fun, All Ages. This is a HI-TEST session. There are 4 seats left.`
    const parsedEntry = parseEntry(entry);
    expect(parsedEntry).toMatchObject(expectedEntry);
});
