function parseEntry(txt) {
  try {
  // const parts = txt.split(";");
  const topRegex = /([A-Z]\d+):( \[.+\])? (.+?; )?(".+?")\.? (.+?\.?)\.(.+)/;
  const topMatch = txt.match(topRegex);
  const test = (topMatch[2] || "").trim();
  const id = topMatch[1];
  const type = (topMatch[3] || "").trim().slice(0, -1);
  const name = topMatch[4].trim().slice(1, -1);
  const byline = topMatch[5];
  let presenter = "";
  let author = "";
  byline.split(';').map((x) => x.trim()).forEach((part) => {
    if (part.startsWith("presented")) {
      presenter = part.slice(part.indexOf("by ") + 3).trim();
    } else {
      author = part.slice(part.indexOf("by ") + 3).trim();
    }
  });

  const main = topMatch[6];
  const parts = main.split('M;');

  const mainPart = parts[0];

  const mainRegex =
    /(.+)(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (.+)/;
    const core = mainPart.match(mainRegex);
  const desc = core[1].trim();
  const day = core[2];
  const time = core[3] + 'M';

  let round = "";
  let material =  "";
  let level =  "";
  let attitude =  "";
  let age = "";
  let nextRound = "";
  let seeAlso = "";
  let status = "";
  let hiTest = false;

  let materialsAndLevel = "";
  let final = "";
  if (parts.length > 3) {
    round = parts[1].trim();
    materialsAndLevel = parts[2];
    final = parts[3];
  }
  else if (parts.length === 2) {
    final = parts[1];
  }

  const mal = materialsAndLevel.split(".")
  if (mal.length > 1) {
    material = mal[0].trim();
    level = mal[1].trim();
  }

  const finalParts = final.split(".");

  const attitudeAndAge = finalParts[0];
  const aaa = attitudeAndAge.split(",");
  if (aaa.length > 1) {
    attitude = aaa[0].trim();
    age = aaa[1].trim();
  }

  finalParts.slice(1).forEach( (item) => {
    const noMatch = ["", ""];
    if (item.indexOf("Next Round") !== -1) {
      nextRound = (item.match(/Next Round:(.+)/) || noMatch)[1];
    }
    else if (item.indexOf("See Also:") !== -1) {
      seeAlso = (item.match(/See Also: (.+)/) || noMatch)[1];
    }
    else if (item.indexOf("This is a HI-TEST session") !== -1) {
      hiTest = true;
    }
    else if (item.trim().length !== 0) {
      status = item.trim();
    }
  });

  return {
    id: id,
    type: type,
    name: name,
    author: author,
    presenter: presenter,
    description: desc,
    day: day,
    time: time,
    round: round,
    material: material,
    level: level,
    attitude: attitude,
    age: age,
    nextRound: nextRound,
    seeAlso: seeAlso,
    status: status,
    testType: test,
    hiTest: hiTest,
    raw: txt,
  };
  } catch (error) {
    console.log("Could not parse: ", txt, error);
    // console.log(error);
    return null;
  }
}

function getAllEntryTexts(doc) {
  const tags = doc.getElementsByTagName("p");
  var ps = Array.prototype.slice.call(tags);
  const startsWithId = (text) => text.match(/[A-Z][0-9]+:.+/);
  return ps.map((p) => p.textContent.trim())
    .filter(startsWithId);
}

export { parseEntry, getAllEntryTexts, };
