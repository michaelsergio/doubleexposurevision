import React from 'react';

function makeEmailLink(recipient, subject, body) {
  const encodedBody = body.replace("\n", "%0A").replace(" ", "%20");
  return `mailto:${recipient}?subject=${subject}&body=${encodedBody}`;
}

function Email(props) {
  const entries = props.entries;
  const plainText = Object.keys(entries).sort().join("\n");
  const mailLink = makeEmailLink(
    "vinny@example.com", 
    "Registration", 
    plainText
  );
  // TODO: need to do special key sort
  return(<div className="email">
    <div className="email__title"> Email Form </div>
    <pre>{plainText}</pre>
    <a href={mailLink}>Mail</a>
    </div>
  );
}


export default Email;
