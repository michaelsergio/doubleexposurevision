import React from 'react';
import ReactDOM from 'react-dom';
import { parseEntry, getAllEntryTexts } from './doubleexposure.js'
import App from './App';
import testdata from './test.json';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it ('should parse dom', () => {
    const page = testdata.contents;
    const parser = new DOMParser();
    const doc = parser.parseFromString(page, "text/html");
    const entryTexts = getAllEntryTexts(doc);
    expect(entryTexts.length).toEqual(53);
    // Need to parse Q001
    // expect(entryTexts.length).toEqual(54);
});


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
    expect(parsedEntry).toEqual(expectedEntry);
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
    /*
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
    expect(parsedEntry).toEqual(expectedEntry);
    // TODO: Test simpler entry
});

*/
