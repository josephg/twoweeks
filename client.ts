// import landscapeTilesDim from './sheets/landscapeTiles_sheet.js'
const canvas: HTMLCanvasElement = document.getElementsByTagName('canvas')[0]
let ctx: CanvasRenderingContext2D
let needsRedraw = false

let width, height



function draw() {
	if (needsRedraw) return
	needsRedraw = true
	requestAnimationFrame(actuallyDraw)
}


// const dimensions = {landscapeTiles:landscapeTilesDim}
declare const landscapeTiles_sheet: [number, number, number, number][]
const dimensions = {landscapeTiles:landscapeTiles_sheet}
const sheets:{[key: string]: HTMLImageElement} = {}
;['landscapeTiles'].forEach(filename => {
	const s = new Image
	s.src = `sheets/${filename}_sheet.png`
	s.onload = () => draw()
	sheets[filename] = s
})

const player: {x: number, y: number} = {x: 5, y: 5}

// [x][y] is a cell.
enum CellVal {
	Nothing,
	Grass = 67,
	Dirt = 83,
	Ramp1 = 97,
	RoadX = 82,
}
type Cell = {
	height: number
	content: CellVal
}
const map: Cell[][] = []
const setMap = (x: number, y: number, val: Cell) => {
	if (map[x] == null) map[x] = []
	map[x][y] = val
}

{
	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			setMap(x, y, {height: 0, content: Math.random() > 0.3 ? CellVal.Grass : CellVal.Dirt})
		}
	}

	for (let x = 0; x < 10; x++) {
		map[x][5].content = CellVal.RoadX
	}
}

const toPxy = (tx: number, ty: number): [number, number] => {
	const ttx = tx - player.x
	const tty = ty - player.y
	return [(tty-ttx)*64.5 + width/2, (ttx+tty)*32 + height/2]
}

const drawSprite = (sprite: number, x: number, y: number) => {
	const [sx,sy,w,h] = dimensions.landscapeTiles[sprite]
	ctx.drawImage(sheets.landscapeTiles, sx, sy, w, h, x - w/2, y - h + 99, w, h)
}

function actuallyDraw() {
	ctx.fillStyle = 'skyblue'
	ctx.fillRect(0, 0, width, height)

	for (let tx = 0; tx < map.length; tx++) {
		const row = map[tx]
		for (let ty = 0; ty < row.length; ty++) {
			const cell = row[ty]
			const [px, py] = toPxy(tx, ty)
			drawSprite(cell.content, px, py)
		}
	}
	needsRedraw = false
}


const resize = () => {
	width = window.innerWidth
	height = window.innerHeight

  canvas.width = width * devicePixelRatio
  canvas.height = height * devicePixelRatio
  ctx = canvas.getContext('2d')
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

  draw()
}
resize()
window.onresize = resize