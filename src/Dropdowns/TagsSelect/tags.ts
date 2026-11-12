export type TagType = {
  name: string
  color: string
}

export type TagsType = {
  [key: string]: TagType
}

export type TagsOrderType = string[]

export const tags = {
  beauty: {
    name: 'beauty',
    color: '#c339cf',
  },
  cute: {
    name: 'cute',
    color: '#64d7f2',
  },
  funny: {
    name: 'funny',
    color: '#51bdbb',
  },
  happy: {
    name: 'happy',
    color: '#ea64e3',
  },
  sad: {
    name: 'sad',
    color: '#4097a5',
  },
  scary: {
    name: 'scary',
    color: '#bdf114',
  },
  sexy: {
    name: 'sexy',
    color: '#638fed',
  },
  cuddly: {
    name: 'cuddly',
    color: '#aaa64d',
  },
  fluffy: {
    name: 'fluffy',
    color: '#a27adc',
  },
  soft: {
    name: 'soft',
    color: '#afa967',
  },
  warm: {
    name: 'warm',
    color: '#2dd586',
  },
  fuzzy: {
    name: 'fuzzy',
    color: '#01b9e8',
  },
  hairy: {
    name: 'hairy',
    color: '#81ce8b',
  },
  furry: {
    name: 'furry',
    color: '#94d09e',
  },
  spiky: {
    name: 'spiky',
    color: '#71e1eb',
  },
  sharp: {
    name: 'sharp',
    color: '#ba8eae',
  },
  pointy: {
    name: 'pointy',
    color: '#dbc757',
  },
  dangerous: {
    name: 'dangerous',
    color: '#fb4ac5',
  },
  adorable: {
    name: 'adorable',
    color: '#ff7957',
  },
  flabadob: {
    name: 'flabadob',
    color: '#eeb13f',
  },
  blup: {
    name: 'blup',
    color: '#cc21fd',
  },
  blip: {
    name: 'blip',
    color: '#bdd046',
  },
  boo: {
    name: 'boo',
    color: '#b9e515',
  },
}

export const tagsOrder = [
  'beauty',
  'cute',
  'funny',
  'happy',
  'sad',
  'scary',
  'sexy',
  'cuddly',
  'fluffy',
  'soft',
  'warm',
  'fuzzy',
  'hairy',
  'furry',
  'spiky',
  'sharp',
  'pointy',
  'dangerous',
  'adorable',
  'flabadob',
  'blup',
  'blip',
  'boo',
]
