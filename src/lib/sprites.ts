export type SpriteName = 'fox' | 'bunny' | 'bear' | 'cat' | 'tree' | 'house' | 'acorn' | 'flower' | 'bench'

export type Pixel = { x: number; y: number; color: string }

const draw = (rows: string[], palette: Record<string, string>): Pixel[] => rows.flatMap((row, y) => [...row].flatMap((key, x) => key === '.' ? [] : [{ x, y, color: palette[key] }]))

const palettes = {
  fox: { a: '#f18d55', b: '#fff3cf', c: '#503f39', d: '#dc613d' },
  bunny: { a: '#eaa0bd', b: '#fff4ee', c: '#563f49', d: '#cd789e' },
  bear: { a: '#9b7058', b: '#e5bd91', c: '#4f3d37', d: '#7c5548' },
  cat: { a: '#78a7ce', b: '#e8f6f7', c: '#3f5264', d: '#5986b2' },
  tree: { a: '#4b9b62', b: '#71bb6b', c: '#8b654a' },
  house: { a: '#f0c875', b: '#bd6653', c: '#7c5a49', d: '#91c7c2' },
  acorn: { a: '#bd8248', b: '#79543d', c: '#6da25c' },
  flower: { a: '#e9849d', b: '#ffe7a8', c: '#5a9b55' },
  bench: { a: '#a87550', b: '#745442' },
} as const

export const sprites: Record<SpriteName, Pixel[]> = {
  fox: draw(['..aa..aa..', '.aaaaaaaa.', '.aaabbaa..', '.aabbbbaa.', '.aaccacca.', '.aabbbbaa.', '..aaaaaa..', '...a..a...'], palettes.fox),
  bunny: draw(['..a....a..', '..a....a..', '.aaa..aaa.', '.aabbbbaa.', '.abbcbbba.', '.aabbbbaa.', '..aaaaaa..', '...a..a...'], palettes.bunny),
  bear: draw(['..aa..aa..', '.aaaaaaaa.', '.aabbbbaa.', '.abbcbbba.', '.aabbbbaa.', '.aaddddaa.', '..aaaaaa..', '...a..a...'], palettes.bear),
  cat: draw(['.aa....aa.', '.aaa..aaa.', '.aabbbbaa.', '.abbcbbba.', '.aabbbbaa.', '.aaddddaa.', '..aaaaaa..', '...a..a...'], palettes.cat),
  tree: draw(['....aa....', '...aaaa...', '..aabba...', '..aaaaaa..', '.aaaaaaaa.', '....cc....', '....cc....', '....cc....'], palettes.tree),
  house: draw(['....bb....', '...bbbb...', '..bbbbbb..', '.aaaaaaaa.', '.aacccaad.', '.aacccaad.', '.aacccaad.', '.aaaaaaaa.'], palettes.house),
  acorn: draw(['....c.....', '...cc.....', '..bbbb....', '.baaaab...', '.baaaab...', '..aaaa....', '...aa.....'], palettes.acorn),
  flower: draw(['....a.....', '...aaa....', '....b.....', '....c.....', '....c.....', '...ccc....'], palettes.flower),
  bench: draw(['..........', '.aaaaaaaa.', '.aaaaaaaa.', '..b....b..', '..b....b..'], palettes.bench),
}
