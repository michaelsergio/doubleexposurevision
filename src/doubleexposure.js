function parseEntry(txt) {
  try {
  // const parts = txt.split(";");

  const topRegex = /([A-Z]\d+): (.+?; )?(".+?") (.+?\.?)\.(.+)/;
  const topMatch = txt.match(topRegex);
  const id = topMatch[1];
  const type = (topMatch[2] || "").trim().slice(0, -1);
  const name = topMatch[3].trim().slice(1, -1);
  const byline = topMatch[4];
  let presenter = "";
  let author = "";
  byline.split(';').map((x) => x.trim()).forEach((part) => {
    if (part.startsWith("presented")) {
      presenter = part.slice(part.indexOf("by ") + 3).trim();
    } else {
      author = part.slice(part.indexOf("by ") + 3).trim();
    }
  });

  const main = topMatch[5];
  const parts = main.split(';');
  const mainPart = parts[0];

  /*
    const header = parts[0];
    const idi = header.indexOf(':');
    const id = header.substring(0, idi);
    const afterId = header.substring(idi+1);
    const type = afterId.trim();


    const titleLine = parts[1].trim();
    let titleMatch = titleLine.match(/"(.+)"\s+by\s+(.+)/);
    if (titleMatch == null) titleMatch = ["", "", ""];
    const name = titleMatch[1];
    const author = titleMatch[2];

    const mainPart = parts[2];
    */
    const mainRegex = 
      /(.+)(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (.+)/;
    const core = mainPart.match(mainRegex);
    const desc = core[1].trim();
    const day = core[2];
    const time = core[3];
  /*
    const presenterMatch = description.match(/presented by (.+?\.?)\.(.+)/);
    const presenter = (presenterMatch === null) ? "" : presenterMatch[1];
    const desc = presenterMatch[2].trim();
    */

    const round = parts[1].trim();
    const materialsAndLevel = parts[2];
    const mal = materialsAndLevel.split(".")
    const material = mal[0].trim();
    const level = mal[1].trim();

    const final = parts[3];
    const finalParts = final.split(".");

    const attitudeAndAge = finalParts[0];
    const aaa = attitudeAndAge.split(",");
    const attitude = aaa[0].trim();
    const age = aaa[1].trim();

    let nextRound = "";
    let seeAlso = "";
    let status = "";

    finalParts.slice(1).forEach( (item) => {
      const noMatch = ["", ""];
      if (item.indexOf("Next Round") !== -1) {
        nextRound = (item.match(/Next Round:(.+)/) || noMatch)[1];
      }
      else if (item.indexOf("See Also:") !== -1) {
        seeAlso = (item.match(/See Also: (.+)/) || noMatch)[1];
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
    };
  } catch (error) {
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
