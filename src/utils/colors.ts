const colorsMap = new Map([
  ['Piggingogrensk', '#FF6633'],
  ['Boltemontering', '#FFB399'],
  ['Injeksjon', '#C1E1C1'],
  ['Lading', '#FFFF99'],
  ['Lasting', '#99E6E6'],
  ['Boring', '#E6B333'],
  ['Langhullsboring', '#3366E6'],
  ['Gysing', '#FF99E6'],
  ['Sprengning', '#99FF99'],
  ['Sproytebetong', '#B34D4D'],
  ['Heft-stansifremdrift', '#80B300'],
  ['LadingogSprengning', '#E64D66'],
  ['Heft', '#E6B3B3'],
  ['Annet', '#1AFF33'],
]);

export const getEventColor = (eventName: string): string => {
  if (colorsMap.has(eventName)) {
    return colorsMap.get(eventName)!;
  }

  const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
  colorsMap.set(eventName, color);
  return color;
};
