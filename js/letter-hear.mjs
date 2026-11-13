/** Whole-sentence Sunny lines. One clip per shell tap, one clip per letter card. */

export function pictureFor(word) {
  return `assets/icons/openmoji/words/${word}.svg`;
}

const LINES = {
  a: ["Ay says aeh... aeh-pple!", "Ay says aeh."],
  b: ["Bee says buh... bear!", "Bee says buh."],
  c: ["See says kuh... cat!", "See says kuh."],
  d: ["Dee says duh... d-og!", "Dee says duh."],
  e: ["Ee says eh... egg!", "Ee says eh."],
  f: ["Ef says fff... fff-ish!", "Ef says fff."],
  g: ["Jee says guh... g-rape!", "Jee says guh."],
  h: ["Aitch says huh... h-at!", "Aitch says huh."],
  i: ["Eye says ih... ih-gloo!", "Eye says ih."],
  j: ["Jay says juh... j-am!", "Jay says juh."],
  k: ["Kay says kuh... kite!", "Kay says kuh."],
  l: ["El says lll... lllemon!", "El says lll."],
  m: ["Em says mmm... mmmoon!", "Em says mmm."],
  n: ["En says nnn... nnnest!", "En says nnn."],
  o: ["Oh says ah... octopus!", "Oh says ah."],
  p: ["Pee says puh... p-ig!", "Pee says puh."],
  q: ["Cue says kwuh... kw-een!", "Cue says kwuh."],
  r: ["Ar says rrr... rrrain!", "Ar says rrr."],
  s: ["Ess says sss... sssun!", "Ess says sss."],
  t: ["Tee says tuh... turtle!", "Tee says tuh."],
  u: ["You says uh... uh-mbrella!", "You says uh."],
  v: ["Vee says vvv... vvvan!", "Vee says vvv."],
  w: ["Double-you says wuh... wave!", "Double-you says wuh."],
  y: ["Why says yuh... y-arn!", "Why says yuh."],
  z: ["Zee says zzz... zzz-ip!", "Zee says zzz."],
};

export function glyphHear(letter) {
  const line = LINES[letter];
  if (!line) return { text: "", clips: [] };
  return { text: line[1], clips: [`letter-target-${letter}`] };
}

export function shellHear(letter) {
  const line = LINES[letter];
  if (!line) return { text: "", clips: [] };
  return { text: line[0], clips: [`letter-line-${letter}`] };
}
