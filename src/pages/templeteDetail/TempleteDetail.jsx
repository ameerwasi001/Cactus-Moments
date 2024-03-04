import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  arrowBack,
  arrowDown,
  arrowDownTwo,
  arrowLeft,
  arrowRight,
  dummyOne,
  dummyThree,
  dummyTwo,
  dummyWithBg,
  edit,
} from "../../assets";
import {
  ChooseBackgroundModel,
  CompositionModel,
  CustomInputWithDropdown,
  DropdownModel,
  Footer,
  GenderModel,
  DefaultModel,
  PaymentModel,
  NavBar,
  TempleteView,
} from "../../components";
import { req, getKey, setKey } from '../../requests'

import { logo } from "../../assets";
import { getAllParams, setParam } from "../../urlParams";
import "./templeteDetail.css";
import AWS from "aws-sdk";
import { Buffer } from "buffer"
import { getImageSize } from "react-image-size";
import ScaleLoader from "react-spinners/ScaleLoader";
import ClipLoader from "react-spinners/ClipLoader";
import html2canvas from 'html2canvas';
import swal from "sweetalert";
import { OFFLINE, baseURL } from "../../constants";

const CONSTANT_BOTTOM_OFFSET = 0
let renderCanvas = true

const uploadImage = async (file) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MGQzZmJiZTM3NmE0M2NiMGNmMmI5OCIsImlhdCI6MTcwNTY2NDAzNSwiZXhwIjoxNzA1NjY0MTU1fQ.c50apc86vdB7UDBuL1p8QR0KSCcOLYoLbsbdk3ed0n0");

  var formdata = new FormData();
  formdata.append("file", file);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  const requestObject = await fetch(`${baseURL}/user/uploadFile`, requestOptions)
  const response = await requestObject.json()

  return `${baseURL}/user/getFile?file=${encodeURIComponent(response.data.filename)}`
}

const uploadImageOnS3 = async (src) => {
  if (OFFLINE) {
    const blob = await fetch(src).then(it => it.blob());
    const file = new File([blob], 'image.png', { type: "image/jpeg", lastModified: new Date() })
    const url = await uploadImage(file)
    return url
  } else {
    const S3 = new AWS.S3();
    const params = {
      Bucket: "cactus-s3",
      Key: `${10000 + Math.round(Math.random() * 10000)}.png`,
      Body: new Buffer(
        src.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
    };
    let res = await S3.upload(params).promise();
    console.log(res);
    return res.Location;
  }
}

AWS.config.update({
  accessKeyId: "AKIAS5LRGSDTKW6H3MVK",
  secretAccessKey: "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",
  region: "us-east-2",
});

const renderText = (context, name, xText, yText, textSize, font, color) => {

}

function random(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const fontAPI = 'AIzaSyAWrXbPuJpa4VLfqfjmVHGy4M2DG-y4cj4';

const sdbm = str => {
  let arr = str.split('');
  return arr.reduce(
    (hashCode, currentVal) =>
    (hashCode =
      currentVal.charCodeAt(0) +
      (hashCode << 6) +
      (hashCode << 16) -
      hashCode),
    0
  );
}

const shuffleSeed = (seed) => (n, array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random(sdbm(seed)) * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  array.forEach((x, i) => array[i] = x ? x : array[Math.floor(Math.random() * array.length)])
  return array
}

const getCharacters = cat => cat.subcategories.map(sub => sub.characters).reduce((a, b) => a.concat(b)).fit(0, parseInt(cat.max))
const getCategoryCharacters = product => product.categories.map(cat => getCharacters(cat)).reduce((a, b) => a.concat(b), []).fit(0, product.categories.map(cat => parseInt(cat.max)).reduce((a, b) => a + b, 0))

export const getInitialCategoryCharacters = (product, distribution) => {
  const containsStatic = hasStaticPositions(product)
  const charPositions = {}
  const ogChars = getCategoryCharacters(product)
  let newChars = ogChars
    // .slice(0, newChars.length - diff - 1)
    .map((ch, i) => {
      const [cat] = getCategoryOfCharacter(product, ch)
      const catName = cat.name
      const curr = charPositions[catName] ?? 0
      const catDists = distribution.filter(cat => cat.categoryName == catName)
      const currDist = catDists[curr]
      // if(curr >= parseInt(cat.modifiedMax)) return ch
      charPositions[catName] = curr + 1
      if (!currDist) return ch
      return currDist?.sprite
    })
  return newChars
}

const getCharactersGivenStatic = cat => cat.subcategories.map(sub => sub.characters).reduce((a, b) => a.concat(b)).fit(0, parseInt(cat.modifiedMax ?? cat.max))
const getCategoryCharactersGivenStatic = product => product.categories.map(cat => getCharactersGivenStatic(cat)).reduce((a, b) => a.concat(b), []).fit(0, product.categories.map(cat => parseInt(cat.max)).reduce((a, b) => a + b, 0))

const groupPricing = pricings_ => {
  let pricings = pricings_ ?? []
  const pricingSections = {}
  for (const p of pricings) pricingSections[p.section] = []
  for (const p of pricings) pricingSections[p.section].push(p)
  return pricingSections
}

const srandom = (str, i = 0) => random(sdbm(str) + i)

class ObjectRewriter {
  constructor(rewriter) {
    this.requiresArgument = true
    this.rewriter = rewriter
  }

  rewrite(data) {
    const obj = { ...data }
    for (const k in this.rewriter) {
      const rewriter = this.rewriter[k]
      if (k in data) {
        const val = data[k]
        const rewritten = rewriter.rewrite(val)
        obj[k] = rewritten
      } else {
        if (!rewriter.requiresArgument) obj[k] = rewriter.rewrite(null)
        else throw "No rewrite possible"
      }
    }
    return obj
  }
}

class RewriterFunction extends ObjectRewriter {
  constructor(f, constant = true) {
    super(null, null)
    this.requiresArgument = constant
    this.fun = f
  }

  rewrite(data) {
    return this.fun(data)
  }
}

class WholeArrayRewriter extends ObjectRewriter {
  constructor(pattern) {
    super(null, null)
    this.patternVar = pattern
  }

  rewrite(arr) {
    let objs = []
    for (const i in arr) {
      objs.push(this.patternVar.rewrite(arr[i]))
    }
    return objs
  }
}

class TupleRewriter extends ObjectRewriter {
  constructor(pattern) {
    super(pattern, null)
  }

  rewrite(arr) {
    let new_arr = []
    for (const i in this.rewriter) {
      const pattern = this.rewriter[i]
      const elem = arr[i]
      new_arr.push(pattern.rewrite(elem))
    }
    return new_arr
  }
}

function fromObject(obj) {
  let newObj = {}
  for (const k in obj) {
    const v = obj[k]
    if (v instanceof Array) newObj[k] = Const(v)
    else if (v instanceof Object) newObj[k] = fromObject(v)
    else {
      newObj[k] = Const(v)
    }
  }
  return Rewriter(newObj)
}

const Id = () => new RewriterFunction(a => a)
const Const = x => new RewriterFunction(_ => x, false)
const Fun = f => new RewriterFunction(f)
const FunConst = f => new RewriterFunction(f, true)
const Rewriter = pattern => new ObjectRewriter(pattern)
const Arr = patternVar => new WholeArrayRewriter(patternVar)
const Tup = arr => new TupleRewriter(arr)
const Cond = (c, t, e) => new RewriterFunction(x => c.match(x) ? t.rewrite(x) : e.rewrite(x))

class Tags {
  constructor() {
    this.tags = {
      radius: 20,
      fillStyle: '#22cccc',
      strokeStyle: '#009999',
      selectedFill: '#88aaaa',
      sprite: '',
      text: {
        text: "",
        textBaseline: "middle",
        font: "20px Arial",
        textAlign: "middle",
        fillStyle: "red"
      }
    }
  }

  override(rewriter = Rewriter({})) {
    return rewriter.rewrite(this.tags)
  }
}

class VisualizationGraph {
  constructor(nodes = [], edges = [], context, textNodes = []) {
    this.context = this.context
    this.textNodes = textNodes
    this.nodes = nodes
    this.edges = edges
    this.drawer = new GraphDrawer(this, context)
  }

  createNode(x, y, tags = {}) {
    return {
      selected: false,
      ...tags
    }
  }

  within(x, y) {
    return this.nodes.find(n =>
      x > (n.x - n.radius) &&
      y > (n.y - n.radius) &&
      x < (n.x + n.radius) &&
      y < (n.y + n.radius)
    )
  }

  addNode(x, y, tags = {}, shouldDraw = true) {
    const el = document.getElementById('canvas').getBoundingClientRect()
    x = x || tags.x
    y = y || tags.y

    const p = { x, y }
    // x = x >= el.width ? el.width-50-randBetween(0, 30) : x
    // y = y >= el.height ? el.height-50-randBetween(0, 500) : y
    tags.x = x
    tags.y = y
    const node = this.createNode(x, y, tags)
    this.nodes.push(node)
    if (shouldDraw) this.drawer.draw()
    return node
  }

  addEdge(selection, target) {
    const edge = { from: selection, to: target }
    let shouldRet = false
    if (selection && selection !== target) {
      shouldRet = true
      this.edges.push(edge)
    }
    this.drawer.draw()
    return shouldRet ? edge : null
  }

  addTextNode(name, obj) {
    this.textNodes.push({ name, tags: obj })
    this.drawer.draw()
  }
}

class GraphDrawer {
  constructor(graph, context) {
    this.context = context
    this.graph = graph
    this.selection = null
  }

  draw() {
    const context = this.context
    const el = document.getElementById('canvas').getBoundingClientRect()
    context.clearRect(0, 0, el.width, el.height)

    this.graph.edges.map(edge => {
      const fromNode = edge.from
      const toNode = edge.to
      context.beginPath()
      context.strokeStyle = fromNode.strokeStyle
      context.strokeStyle = "red"
      context.lineWidth = 2
      context.shadowOffsetX = 4
      context.shadowOffsetY = 4
      context.shadowBlur = 5
      context.shadowColor = "gray"
      context.moveTo(fromNode.x, fromNode.y)
      context.lineTo(toNode.x, toNode.y)
      context.stroke()
    })

    let renderedNodes = 0
    const sortedNodes = this.graph.nodes.sort((a, b) => parseInt(a.layer) > parseInt(b.layer) ? 1 : -1)
    sortedNodes.map(node => {
      var img = new Image();
      const self = this
      img.onload = function () {
        const specifiedRatio = node.scale == 0 ? 1 : node.scale / 100

        context.webkitImageSmoothingEnabled = true;
        context.mozImageSmoothingEnabled = true;
        context.imageSmoothingEnabled = true;
        // drawImage(context, node.sprite, this.width * specifiedRatio, this.height * specifiedRatio)
        context.drawImage(img, node.x, node.y, this.width * specifiedRatio, this.height * specifiedRatio);

        // renderedNodes += 1
        renderedNodes = self.graph.nodes.length
        if (renderedNodes == self.graph.nodes.length) {
          self.graph.textNodes.map(node => {
            const { textSize, xText, yText, font, color } = node.tags
            const name = node.name
            renderText(self.context, name, xText, yText, textSize, font, color)
          })
        }
      };
      img.src = node.sprite
      // img.crossOrigin = "Anonymous"
    })
  }

  onmousemove(e) {
    if (this.selection && e.buttons) {
      this.selection.x = e.x
      this.selection.y = e.y
      this.draw()
    }
  }

  onmousedown(e) {
    let target = this.graph.within(e.x, e.y)
    if (this.selection && this.selection.selected) {
      this.selection.selected = false
    }
    if (target) {
      // this.graph.addEdge(this.selection, target)
      this.selection = target
      this.selection.selected = true
      this.draw()
    }
  }

  onmouseup(e) {
    if (!this.selection) this.graph.addNode(e.x, e.y, new Tags().override())
    if (this.selection && !this.selection.selected) this.selection = null
    this.draw()
  }
}

const findIndex = (f, arr) => {
  for (let i = 0; i < arr.length; i++)
    if (f(arr[i])) return i
  return -1
}

function doElementsIntersect(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  // Check for intersection
  const isIntersecting = !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );

  return isIntersecting;
}

const productPositions = product => {
  const productNMax = product.categories?.map(x => parseInt(x.max ?? 0) ?? 0)?.reduce((a, b) => a + b, 0)
  const arr = product.categories
    .map(cat => new Array(parseInt(cat.max ?? 0) ?? 0).fill(cat))
    .map(arr => arr.map((cat, i) => cat?.subcategories?.[0]?.characters?.[0]))
    .reduce((a, b) => [...a, ...b], [])
    .slice(0, productNMax)
  const nameArr = product.categories
    .map(cat => new Array(parseInt(cat.max ?? 0) ?? 0).fill(cat))
    .map(arr => arr.map((cat, i) => [cat?.name, i + 1]))
    .reduce((a, b) => [...a, ...b], [])
    .slice(0, productNMax)
  const categoryArr = product.categories
    .map(cat => new Array(parseInt(cat.max ?? 0) ?? 0).fill(cat))
    .map(arr => arr.map(cat => cat?.categoryScale))
    .reduce((a, b) => [...a, ...b], [])
    .slice(0, productNMax)

  const poses = product.backgrounds[0]?.positions?.slice(0, productNMax)?.map((pos, i) => ({ x: pos[0], y: pos[1], categoryScale: categoryArr[i] ?? 0, scale: pos[3], name: nameArr[i], isStatic: pos[5] != undefined && pos[5] != 0, staticAssociation: pos[5] != undefined ? nameArr[i] : null }) ?? [])
  return poses
}

const hasStaticPositions = product => {
  const positions = productPositions(product)
  return positions.map((x, i) => x.isStatic ? i : null).filter(x => x != null).length != 0
}


const accImageIndexes = (hiddenCats, arg) => {
  let i = 0
  const newArr = arg.map(([cat, images]) => {
    return [
      cat,
      images.map(([image, _]) => {
        const res = [image, i]
        i += 1
        return res
      })
    ]
  })
  return newArr
}

const makeRepeatedArray = (arr, l) => {
  const newArr = []
  let j = 0
  for (const i of new Array(l).fill(0).map((_, i) => i)) {
    if (j >= arr.length) j = 0
    const el = arr[j]
    newArr.push(el)
    j++
  }
  return newArr
}

Array.prototype.fit = function (a, b, c, d) {
  const args = [a, b, c, d]
  if (a == 0 && c == undefined && d == undefined) {
    if (b > this.length) return makeRepeatedArray(this, b)
    else return this.slice(...args)
  } else return this.slice(...args)
}

const groupDistribution = (ogProduct, arr) => {
  const iArr = arr
  // findProductPositionIndexes(ogProduct).forEach(i => iArr[i] = )
  return [iArr]
}

const arrangeByParent = arr => {
  const parentArrangement = {}
  const parents = []

  for (const el of arr) if (!el.parent) el.parent = ''
  for (const el of arr) parentArrangement[el.parent] = []
  for (const el of arr)
    if (el.parent) parentArrangement[el.parent].push(el)
    else parents.push(el)

  const parentChildArray = parents.map(p => [p, ...(parentArrangement[p.title] ?? [])]).reduce((a, b) => [...a, ...b], [])
  return parentChildArray
}

const TitleComponent = ({ elementId, givenId, background, title, style }) => {
  const hiddentitleCentricEl = document.querySelector(`#${elementId} > div`)
  const ogValue = hiddentitleCentricEl.innerHTML
  hiddentitleCentricEl.innerHTML = title
  // const hiddentitleCentricEl = overlayTitleHidden?.current
  if (!hiddentitleCentricEl) return <></>

  const halfTitleLen = Math.round(title.length / 2)
  const [titleFirstHalf, titleSecondHalf] = [title.slice(0, halfTitleLen), title.slice(halfTitleLen)]
  const width = hiddentitleCentricEl.getBoundingClientRect().width
  const singleCharWidth = width / title.length
  const widthHalf = width / 2
  const computedLeftX = background.coordinateVariation.xText - widthHalf
  const computedMainX = background.coordinateVariation.xText

  hiddentitleCentricEl.innerHTML = ogValue

  console.log("COMPUTED-AXIS", width, widthHalf, computedLeftX, computedMainX)
  return <div className={givenId} id={givenId} style={{
    zIndex: 100000000,
    // height: "500px", 
    // width: "500px", 
    whiteSpace: 'nowrap',
    position: "absolute",
    // left: `${background.coordinateVariation.xText}px`, 
    top: `${background.coordinateVariation.yText}px`,
    fontSize: `${background.coordinateVariation.textSize}pt`,
    fontFamily: background.font,
    color: background.coordinateVariation.color,
    display: "flex",
    ...(style ? style : {})
  }}>
    <p style={{ position: "absolute", left: `${computedLeftX}px` }}>{title}</p>
    {/* <p style={{ position: "absolute", left: `${computedMainX}px` }}>{titleSecondHalf}</p> */}
  </div>
}

const decodeOffsets = obj => Object.fromEntries(Object.entries(obj).map(([k, v]) => [decodeURIComponent(k), v]))

const makeSpriteModification = img => {
  if (!img) return null
  const url = "https://cactus-s3.s3.us-east-2.amazonaws.com/"
  const [_, rest] = img.split(url)
  return url + encodeURIComponent(rest)
}

const getTotalOffset = url => {
  const el = [...document.getElementsByClassName(url)][0]
  if (!el) return {}
  return el.getBoundingClientRect()
}

const NestedDescription = ({
  setShowModalDes,
  img,
}) => {
  // Set a minimum height for the modal
  const minHeight = 250;
  const maxHeight = 600;
  const descriptionHeight = 500;
  return (
    <div
      onClick={() => setShowModalDes(null)}
      className="add-product-modal-main-container-video"
    >
      <div
        className="add-product-modal-container-product-description-detail-video"
      >
        {/* <h1>Description</h1> */}
        <img className="video-model"
          // url={currentVideo.photo}
          src={img}
        />
      </div>
    </div>
  );
}

const splitByNumOfChars = (inputString, maxLength) => {
  console.log("ARROFSUBTITLE-str", inputString)
  const words = inputString.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if (currentLine.length + word.length + 1 <= maxLength) {
      currentLine += word + ' ';
    } else {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    }
  });

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines;
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const isPhone = () => getWindowDimensions().width < 440

function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

let firstLoad = true

// const getInitialCategoryObject = product => {
//   const positionObject = {}
//   for
// }

const getCategoryOfCharacter = (product, sprite) => {
  const foundCategory = product?.categories?.find(
    cat =>
      cat?.subcategories?.map(sc => sc?.characters).flat().includes(sprite) ||
      cat?.subcategories?.map(sc => sc?.characters).flat().includes(encodeURIComponent(sprite)) ||
      cat?.subcategories?.map(sc => sc?.characters).flat().includes(decodeURIComponent(sprite)) ||
      cat?.subcategories?.map(sc => sc?.characters).flat().includes(makeSpriteModification(sprite))
  )
  const foundSubcategory = product?.subcategories?.find(
    sub => sub?.characters?.includes(sprite) ||
      sub?.characters?.includes(decodeURIComponent(sprite)) ||
      sub?.characters?.includes(encodeURIComponent(sprite)) ||
      sub?.characters?.includes(makeSpriteModification(sprite))
  )

  return [foundCategory, foundSubcategory]
}

const genUUID = () => {
  return (
    String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
  ).replace(/[xy]/g, (character) => {
    const random = (Math.random() * 16) | 0;
    const value = character === "x" ? random : (random & 0x3) | 0x8;

    return value.toString(16);
  });
}

// const findCharacterPositi

const resizeAccordingly = () => {
  const el = document.getElementById("img-total")
  const illustration = document.getElementsByClassName("display-image")[0]
  illustration.style.height = `${el.getBoundingClientRect().height}px`
}

const getDimensions = (uri, cb) => new Promise((resolve, reject) => {
  const img = new Image();
  console.log("statttttinggg", uri)
  img.onload = function () {
    console.log("DIMENSIONSS >>", this.height, this.width)
    cb([this.height, this.width]);
  }
  img.src = uri
  // cb([10000, 7100])
})

var createPDF = function (imgData, frameData, offset, percentage, name, orientation) {
  getDimensions(imgData, ([height, width]) => {
    // getDimensions(frameData, ([h2]) => {
    // const frameHeight = (h2/100)*percentage
    // const finalHeight = Math.max(frameHeight, height)

    console.log("DIMENSIONS h >>", height, width, orientation)

    if (orientation == 'p') {
      const doc = new jsPDF(orientation, 'mm', [3339.63, 4722.71]);
      doc.addImage(imgData, 'PNG', 0, 0, 3339.63, 4722.71, 'monkey')
      doc.save(`${name}.pdf`);

    } else {
      const doc = new jsPDF(orientation, 'px', [width, height]);
      doc.addImage(imgData, 'PNG', 0, 0, width, height, 'monkey')
      doc.save(`${name}.pdf`);
    }
    // })
  })
}

const createCustomPDF = (isIllustrationHorizontal, name, imgData, ph, pw, alignCenter, l, _ih, distX, distY, scale) => {
  getDimensions(imgData, ([height, width]) => {
    console.log("DIMENSIONS custom >>", height, width)
    const doc = new jsPDF(
      l ? 'l' : 'p',
      'cm',
      [pw, ph]
    )

    const ratio = width / height
    const ih = _ih * scale
    const calculatedWidth = ih * ratio

    doc.addImage(imgData, 'PNG', distX * 2, distY * 2, calculatedWidth, ih, 'monkey')
    doc.save(`${name}.pdf`);
  })
}

export const getDistribution = (product, ogProduct, background, characters, alternateBackground) => {
  let staticSeenCounters = {}
  const hiddenCentralCategories = {}
  const categoryCounters = {}
  console.log("bgx", background)
  const processBg = background => background.positions.map((pos, i) => {
    const cat = product.categories.find(cat => cat.name == positions[i]?.name?.[0])
    const hasSeen = staticSeenCounters[cat?.name] >= parseInt((cat?.modifiedMax ?? cat?.max) ?? '0')
    staticSeenCounters[cat?.name] = staticSeenCounters[cat?.name] ?? 0
    const hidden = hasSeen && hasStaticPositions(ogProduct) ? true : cat?.hidden

    // console.log("DIST01-PROTO", cat?.name, cat?.hidden, parseInt(cat?.modifiedMax ?? '0'), staticSeenCounters[cat?.name])

    const catCounter = categoryCounters[`${cat?.name}`] ?? 0
    hiddenCentralCategories[`${cat?.name} ${(categoryCounters[`${cat?.name}`] ?? 0) + 1}`] = hidden
    categoryCounters[`${cat?.name}`] = catCounter + 1
    const ret = {
      x: pos[0],
      y: pos[1],
      ogSubcategoryName: product?.ogSubcats?.[`${pos[0]},${pos[1]}`],
      rectHeight: product?.positionalRects?.[`${pos[0]},${pos[1]}`],
      rectWidth: product?.positionalWidths?.[`${pos[0]},${pos[1]}`],
      layer: pos[2],
      scale: pos[3],
      hidden,
    }

    if (staticSeenCounters[cat?.name]) staticSeenCounters[cat?.name] += 1
    else staticSeenCounters[cat?.name] = 1

    return ret
  }).fit(0, product.categories.map(x => parseInt(x.max)).reduce((a, b) => a + b, 0))

  const sprites = characters
  const positions = productPositions(ogProduct)
  const alternateBackgroundNow = alternateBackground ?? product?.backgrounds?.find(bg => bg?.coordinateVariation?.evenFor == background?.url)
  let distribution = processBg(background)
  if (distribution.length % 2 == 0 && alternateBackgroundNow) distribution = processBg(alternateBackgroundNow)
  console.log("DISTRIBUTIN-NUMS", distribution.length, alternateBackgroundNow, distribution.length % 2 == 0 && alternateBackgroundNow)

  // console.log("DIST00", product.categories.map(x => parseInt(x.max)), distribution)
  // middling algorithm
  console.log("SPRITES", distribution)
  const spritedDistribution = distribution.map((x, i) => {
    const sprite = sprites[i]
    // const ogProduct = JSON.parse(JSONProduct)
    const foundCategory = ogProduct?.categories?.find(
      cat =>
        cat?.subcategories?.map(sc => sc?.characters).flat().includes(sprite) ||
        // cat?.subcategories?.map(sc => sc?.characters).flat()?.find(ch => ch?.split("/")?.at(-1)?.split("-")?.[0] == sprite?.split("/")?.at(-1)?.split("-")?.[0]) ||
        cat?.subcategories?.map(
          sc => sc?.characters?.map(x => {
            return decodeURI(x)
          })
        ).flat().includes(sprite) ||
        cat?.subcategories?.map(sc => sc?.characters).flat().includes(encodeURIComponent(sprite)) ||
        cat?.subcategories?.map(sc => sc?.characters).flat().includes(makeSpriteModification(sprite))
    )
    const foundSubcategory = foundCategory?.subcategories?.find(
      sub => sub?.characters?.includes(sprite) ||
        sub?.characters?.includes(decodeURIComponent(sprite)) ||
        sub?.characters?.includes(decodeURI(sprite)) ||
        sub?.characters?.includes(encodeURIComponent(sprite)) ||
        sub?.characters?.includes(makeSpriteModification(sprite))
        || sub?.characters?.find(ch => ch?.split("/")?.at(-1)?.split("-")?.[0] == sprite?.split("/")?.at(-1)?.split("-")?.[0])
    )
    const foundParent = foundCategory?.subcategories?.find(sub => sub?.name == foundSubcategory?.parent)
    const foundFirstChild = foundCategory?.subcategories?.find(sub => sub?.parent == foundSubcategory?.name)

    let categoryScale = foundSubcategory?.categoryScale
    let fixedOffset = foundSubcategory?.fixedOffset
    let fixedWidth = foundSubcategory?.fixedWidth
    let categoryLayer = foundSubcategory?.layer

    console.log("PRIORITY", ogProduct.priority)
    if (ogProduct.priority) {

      if (foundParent?.categoryScale) categoryScale = foundParent?.categoryScale
      if (foundParent?.layer) categoryLayer = foundParent?.layer
      if (foundParent?.fixedOffset) fixedOffset = foundParent?.fixedOffset
      if (foundParent?.fixedWidth) fixedWidth = foundParent?.fixedWidth

      if (foundFirstChild?.categoryScale) categoryScale = foundFirstChild?.categoryScale ?? 0
      if (foundFirstChild?.fixedOffset) fixedOffset = foundFirstChild?.fixedOffset ?? 0
      if (foundFirstChild?.fixedWidth) fixedWidth = foundFirstChild?.fixedWidth ?? 0

      if (!categoryScale) categoryScale = 0
      if (!fixedOffset) fixedOffset = 0
      if (!fixedWidth) fixedWidth = 0

    } else {

      if (!categoryScale) categoryScale = foundParent?.categoryScale
      if (!categoryLayer) categoryLayer = foundParent?.layer
      if (!fixedOffset) fixedOffset = foundParent?.fixedOffset
      if (!fixedWidth) fixedWidth = foundParent?.fixedWidth

      if (!categoryScale) categoryScale = foundFirstChild?.categoryScale ?? 0
      if (!fixedOffset) fixedOffset = foundFirstChild?.fixedOffset ?? 0
      if (!fixedWidth) fixedWidth = foundFirstChild?.fixedWidth ?? 0
    }

    console.log("||>?>?>", sprite, foundCategory, foundParent, foundFirstChild, fixedWidth)

    console.log(
      "FINDCATEGORY-urix",
      foundSubcategory,
      sprite,
      product?.offsets,
      foundCategory,
      ogProduct?.categories,
      product?.offsets?.[foundCategory?.name]
    )
    return {
      ...x,
      ogscat: foundSubcategory,
      ogparent: foundParent,
      categoryLayer,
      subcategoryName: foundSubcategory?.name,
      fixedOffset,
      fixedWidth,
      categoryName: foundCategory?.name,
      categoryScale,
      offset: product?.offsets?.[foundCategory?.name],
      offsetWidth: product?.offsetWidths?.[foundCategory?.name],
      hidden: x.hidden,
      // offset: getTotalOffset(sprite).height, 
      // offsetWidth: getTotalOffset(sprite).width, 
      sprite: sprite,
    }
  })

  const nulls = spritedDistribution.filter(({ sprite }) => !sprite)
  const actuals = spritedDistribution.filter(({ sprite }) => !!sprite)

  const len = Math.round(nulls.length / 2)
  const nulls1 = nulls.fit(0, len)
  const nulls2 = nulls.fit(len, nulls.length)

  const finalDistribution = [...nulls1, ...actuals, ...nulls2]

  // finalDistribution.forEach(({x, y, sprite, layer, scale}, i) => graph.addNode(null, null, new Tags().override(fromObject({x, y, layer, sprite, scale}))));

  console.log("hidcent", hiddenCentralCategories)
  return [finalDistribution, hiddenCentralCategories]
}

const preloadImage = img => new Image().src = img

function TempleteDetail({ ogProduct, printing, setOgProduct, JSONProduct, orderId, recents, props }) {
  const navigate = useNavigate();
  const overlayTitleHidden = useRef(null)
  const overlaySubtitleHidden = useRef(null)
  const [errorModal, setErrorModal] = useState(null)
  const [product, setProduct] = useState(props?.product ?? Object.freeze(JSON.parse(JSONProduct)))
  console.log("navi", product)
  const [distribution, setDistribution] = useState(props?.distribution ?? [])

  const groupedPricing = groupPricing(props?.product?.pricing)
  const currPricingObject = props ? Object.fromEntries(Object.entries(props).filter(([k]) => k.startsWith('pricing-') || groupedPricing[k]).map(([k, str]) => [k, props.product.pricing.find(pricing => pricing?.name == str)]).map(([k, v]) => [k.split("pricing-").join(""), v])) : null

  const localDict = localStorage.getItem('backgrounds') ?? '{}'
  const dict = JSON.parse(localDict)

  const [background, setBackground] = useState(props?.background ? props?.background : product.backgrounds[product.defaultBackground])
  const [alternateBackground, setAlternateBackground] = useState(product?.backgrounds?.find(bg => bg?.coordinateVariation?.evenFor == background?.url))
  const [title, setTitle] = useState(props?.title ?? product.name)
  const [subtitle, setSubtitle] = useState(props?.subtitle ?? product.subtitle)
  const [fontLoaded, setFontLoaded] = useState(false)
  const [showFrameModel, setShowFrameModel] = useState(false);
  const [showDimensionModel, setShowDimensionModel] = useState(false);
  const [showEditNameDropdown, setShowEditNameDropdown] = useState(false);
  const [showEditBackgroundDropdown, setShowEditBackgroundDropdown] =
    useState(false);
  const [showEditAdultDropdown, setShowEditAdultDropdown] = useState(undefined);
  useState(false);
  const [familyCompositionModel, setFamilyCompositionModel] = useState(false);
  const [chooseBackgroundModel, setChooseBackgroundModel] = useState(false);
  const [pricingObject, setPricingObject] = useState(groupPricing(product.pricing));
  const [selectedPricingOptions, setSelectedPricingOptions] = useState(currPricingObject ? currPricingObject : (props?.selectedPricingOptions ?? Object.fromEntries(Object.entries(groupPricing(product.pricing)).map(([k, v]) => [k, v?.[0]]))))
  const [shownPricingOptions, setShownPricingOptions] = useState(Object.fromEntries(Object.entries(groupPricing(product.pricing)).map(([k, v]) => [k, false])))
  const [chooseGenderModel, setChooseGenderModel] = useState(undefined);
  const [defaultModel, setDefaultModel] = useState(props ? false : true);
  const [characters, setCharacters] = useState(props?.characters ?? [])

  const [sideTempleArray, setSideTempleArray] = useState((product.previews ?? []).map((x, id) => { return { id, image: { url: x } } }));
  const [templeteArray, setTemplateArray] = useState([]);
  const [autoSelect, setAutoSelect] = useState(true)
  const [chosen, setChosen] = useState(false)

  const [ratios, setRatios] = useState(new Set())
  const [offsets, setOffsets] = useState({})
  const [realOffsets, setRealOffsets] = useState({})
  const [selectedImage, setSelectedImage] = useState(null)

  const [showPaymentModel, setShowPaymentModel] = useState(null)
  const [withCard, setWithCard] = useState(false)
  const [hiddenCentralCategories, setHiddenCentralCategories] = useState({})

  const [imageSize, setImageSize] = useState({})

  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)

  const lastDistOffsetRef = useRef(null)
  const lastDistRealOffsetRef = useRef(null)

  const imageInstance = new Image()
  imageInstance.src = background?.coordinateVariation?.alternate ?? background.url

  const [isImageLoaded, setIsImageLoaded] = useState(true)

  const [currRender, setCurrRender] = useState(0)

  // Printing States
  const [width, setWidth] = useState(0)

  const [printBackground, setPrintBackround] = useState(true)
  const [printFrame, setPrintFrame] = useState(true)

  const [fit, setFit] = useState(true)

  const [pdfHeight, setPdfHeight] = useState(background?.coordinateVariation?.pdfHeight ?? 98)
  const [pdfWidth, setPdfWidth] = useState(background?.coordinateVariation?.pdfWidth ?? 23.8)
  const [frameHeight, setFrameHeight] = useState(101)
  const [bottomOffset, setBottomOffset] = useState(100)
  const [frameReadjust, setFrameReadjust] = useState(0)
  const [frameReadjustX, setFrameReadjustX] = useState(1)
  const [landscape, setLandscape] = useState(true)
  const [illustrationHeight, setIllustrationHeight] = useState(background?.coordinateVariation?.illustrationHeight ?? 7.8)
  const [illustrationDistance, setIllustrationDistance] = useState(background?.coordinateVariation?.illustrationDistance ?? 1)
  const [illustrationYDistance, setIllustrationYDistance] = useState(background?.coordinateVariation?.illustrationYDistance ?? 2)
  const [scale, setScale] = useState(background?.coordinateVariation?.illustrationPDFScale ?? 2)

  const [format, setFormat] = useState({ label: 'PNG', value: 'PNG' })
  const [formats, setFormats] = useState([
    { label: 'PDF', value: 'PDF' },
    { label: 'PNG', value: 'PNG' },
    { label: 'JPEG', value: 'JPEG' }
  ])
  const [quality, setQuality] = useState({ label: 'A4', value: product?.productCategry == 'poster' ? 4 : 2 })
  const [qualityOptions, setQualityOptions] = useState([
    { label: 'A4', value: 4 },
    { label: 'A3', value: 8 },
    { label: 'A2', value: 12 },
  ])

  const bill = props?.bill
  // End Printing States


  const rerender = () => {
    setCurrRender(currRender + 1)
  }

  useEffect(() => {
    if (!distribution.length) return
    const interval = setInterval(() => {
      if (!distribution.length) return
      const images = distribution.filter(({ hidden }) => !hidden).map(({ sprite }) => sprite).map(img => {
        if (!img) {
          return {
            complete: true
          }
        }
        const ins = new Image()
        ins.src = img
        return ins
      })
      const allLoaded = images.map(img => img.complete).reduce((a, b) => a && b, true)
      if (allLoaded) return setIsImageLoaded(allLoaded)
      setIsImageLoaded(allLoaded)
      if (allLoaded) clearInterval(interval)
    }, 500)
    return () => clearInterval(interval)
  }, [distribution])

  console.log("xydist", distribution)

  useEffect(() => {
    (async () => {
      const { height, width } = await getImageSize(background.url)
      const ratio = height / width
      console.log("CRATIO", height, width, ratio, ratio <= 0.7 && ratio >= 0.3)
      if (ratio <= 0.8 && ratio >= 0.3) {
        if (ratio >= 0.7 && product?.productCategry == "Tasse") setWidth(355)
        else setWidth(500)
      } else if (ratio >= 1.1 && ratio <= 1.5) {
        setWidth(355)
      }
    })()
  }, [])

  const getSegments = (y, subtitleMaxChars, subtitle, elementId) => {
    const subtitles = splitByNumOfChars(subtitle ?? "", subtitleMaxChars)
    const subtitleHiddenEl = document.querySelector(`#${elementId} > div`)
    if (!subtitleHiddenEl) return null
    const { height } = subtitleHiddenEl.getBoundingClientRect()
    console.log("ARROFSUBTITLEooo", subtitles, height)
    const finalPosition = y
    const subtitleSegments = [...subtitles].reverse().map((seg, i) => ({
      text: seg,
      position: finalPosition - i * height
    })).reverse()

    return subtitleSegments
  }

  const MultiText = ({ background }) => {

    const titleSegments = getSegments(parseInt(background.coordinateVariation.yText), 100_000, title, "overlay-title-hidden")
    const subtitleSegments = getSegments(parseInt(background.coordinateVariation.ySmallText), parseInt(background.coordinateVariation.smallTextMax ?? "80"), subtitle, "overlay-subtitle-hidden")
    if (!subtitleSegments) return <></>
    if (!titleSegments) return <></>

    const dist = parseInt(background.coordinateVariation.ySmallText) - parseInt(background.coordinateVariation.yText)

    console.log("DISTN", parseInt(background.coordinateVariation.ySmallText), parseInt(background.coordinateVariation.yText), dist)

    return <>
      <div id="title-container" style={{ position: "absolute" }}>
        {titleSegments.map(({ text: title, position }) => <TitleComponent title={title} background={background} elementId="overlay-title-hidden" givenId="overlay-title" style={{ top: `${subtitleSegments[0]?.position - dist}px` }} />)}
      </div>
      <div id="subtitle-container" style={{ position: "absolute" }}>
        {subtitleSegments.map(({ text: subtitle, position }) => <TitleComponent title={subtitle} background={background} elementId="overlay-subtitle-hidden" givenId="overlay-subtitle" style={{
          whiteSpace: 'nowrap',
          position: "absolute",
          // _: console.log("ARROFSUBTITLE-height", height, offset, background.coordinateVariation.ySmallText + offset),
          left: `${background.coordinateVariation.xSmallText}px`,
          // top: `${parseInt(background.coordinateVariation.ySmallText) + offset}px`,
          top: `${position}px`,
          fontSize: `${background.coordinateVariation.smallTextSize}pt`,
          fontFamily: background.smallFont,
          color: background.coordinateVariation.smallColor,
        }} />)}
      </div>
    </>
  }

  const editData = async () => {
    const ratios = new Set()
    for (const background of product.backgrounds) {
      preloadImage(background?.url)
      getImageSize(background.url).then(({ height, width }) => {
        const ratio = height / width
        if (ratio >= 1.1 && ratio <= 1.5) ratios.add(background.url)
        setImageSize({ height, width })
        setRatios(oldRatios => new Set([...oldRatios, ...ratios]))
      })
    }
    // setTitle(product.name)
    // setSubtitle(product.subtitle)
    console.log("PREVIEWS", product.previews)
    setSideTempleArray((product.previews ?? []).map((x, id) => { return { id, image: { url: x } } }))
    // setRatios(ratios)
  }

  const recalcOffset = () => {
    console.log("groupx", lastDistOffsetRef?.current, distribution)

    const calculatedOffsets = {}
    console.log("MXC", groupDistribution(ogProduct, distribution).flat(1))
    for (const ch of groupDistribution(ogProduct, distribution).flat(1)) {
      console.log("STRING >>", ch, ch?.sprite)
      const img = ch?.sprite
      const el = document.querySelector(`[src="${img}"]`)
      if (el) {
        const { height } = el.getBoundingClientRect()
        console.log("IAMHERE!", height)
        calculatedOffsets[img] = height + CONSTANT_BOTTOM_OFFSET
      } else {
        calculatedOffsets[img] = 0
      }
    }
    console.log("OFFSET-VALUE-X", calculatedOffsets)
    lastDistOffsetRef.current = distribution
    setOffsets(calculatedOffsets)
    console.log("OFFSET >=>", calculatedOffsets)
  }

  useEffect(recalcOffset, [title, subtitle, product, characters, background])
  useEffect(() => {
    if (JSON.stringify(lastDistOffsetRef?.current) == JSON.stringify(distribution)) return
    recalcOffset()
  }, [distribution])


  useEffect(() => {
    setAlternateBackground(product?.backgrounds?.find(bg => bg?.coordinateVariation?.evenFor == background?.url))
  }, [background])

  useEffect(() => {
    editData().then(_ => console.log(_))

    // Setting the required states
    // setSideTempleArray((product.previews ?? []).map((x, id) => { return { id, image: {url: x} } }))
    console.log("SPRITES-NOW", distribution, characters)


    const newChars = getInitialCategoryCharacters(product, distribution)
    // console.log("chs", charPositions)
    // if(containsStatic) setCharacters(getCategoryCharacters(product))
    // else setCharacters(newChars)
    // if(containsStatic) setCharacters(ogChars)
    // else setCharacters(newChars)
    setCharacters(newChars)
  }, [product])

  useEffect(() => {
    if (recents == 'no') {
      const newBackgrounds = { ...dict }
      newBackgrounds[product._id] = background
      localStorage.setItem('backgrounds', JSON.stringify(newBackgrounds))
    }
  }, [background])

  useEffect(() => {
    if (recents == 'no') setBackground(
      product.backgrounds.find(x => { return x?.url == dict[product._id].url }) ? product.backgrounds.find(x => x?.url == dict[product._id].url) : product.backgrounds[product.defaultBackground]
    )
  }, [product])

  useEffect(() => {
    // if(!chosen) return
    // if(lock) return
    // lock = true

    const [finalDistribution, hiddenCentralCategories] = getDistribution(product, ogProduct, background, characters, alternateBackground)
    // graph.addTextNode(title, {textSize, xText, yText, color, font})
    // graph.addTextNode(subtitle, {textSize: smallTextSize, xText: xSmallText, yText: ySmallText, color: smallColor, font: smallFont})
    // console.log("DIST01", sprites)
    if (characters.length != 0) setDistribution(finalDistribution)
    setHiddenCentralCategories(hiddenCentralCategories)
    // lock = false
  }, [
    product,
    background,
    characters,
    chosen,
    // ratios,
    offsets,
    realOffsets,
  ])

  useEffect(() => {
    // setInterval(() => {
    //   const el = document.getElementById("canvas")
    //   el.style.height = '500px'
    //   el.style.width = '500px'
    // }, 1000)

  }, [])

  const recalcRealOffset = () => {
    const fonts = new Set(Array.from(document.fonts).map(x => x.family))
    setFontLoaded(fonts.has(title));

    document.fonts.onloadingdone = e => {
      setFontLoaded(fonts.has(title));
    }


    const getImgHeight = (url, scale, cb) => {
      var img = new Image();
      img.style.scale = scale;

      const foundCategory = ogProduct?.categories?.find(
        cat =>
          cat?.subcategories?.map(sc => sc?.characters).flat().includes(url) ||
          cat?.subcategories?.map(sc => sc?.characters).flat().includes(encodeURIComponent(url)) ||
          cat?.subcategories?.map(sc => sc?.characters).flat().includes(makeSpriteModification(url))
      )
      const foundSubcategory = foundCategory?.subcategories?.find(
        sub => sub?.characters?.includes(url) ||
          sub?.characters?.includes(encodeURIComponent(url)) ||
          sub?.characters?.includes(makeSpriteModification(url))
      )
      const distSprite = distribution.find(dist => foundSubcategory?.characters?.includes?.(dist.sprite))

      function getHeight(length, ratio) {
        var height = ((length) / (Math.sqrt((Math.pow(ratio, 2) + 1))));
        return Math.round(height);
      }

      function getWidth(length, ratio) {
        var width = ((length) / (Math.sqrt((1) / (Math.pow(ratio, 2) + 1))));
        return Math.round(width);
      }

      img.onload = () => {
        const height = img.height;
        const width = img.width;
        cb({
          height: distSprite ?
            document.getElementsByClassName(distSprite.sprite)?.[0]?.getBoundingClientRect()?.height :
            getHeight(height * scale, height / width),
          width: getWidth(height * scale, height / width)
        })
      }

      img.src = url
    }

    (async () => {
      console.log(lastDistRealOffsetRef.current, distribution)
      const realOffsets = {}
      let i = 0
      for (const sprite of distribution) getImgHeight(
        sprite.sprite,
        (sprite.scale == 0 ? 1 : sprite.scale / 100) * (sprite.categoryScale == 0 ? 1 : sprite.categoryScale / 100),
        obj => {
          realOffsets[sprite.sprite] = obj
          i++
          if (i == distribution.length) {
            setRealOffsets(realOffsets)
          }
        }
      )
      lastDistRealOffsetRef.current = distribution
    })()
  }

  useEffect(recalcRealOffset, [title, subtitle, product, characters, background])
  useEffect(() => {
    if (JSON.stringify(lastDistRealOffsetRef?.current) == JSON.stringify(distribution)) return
    recalcRealOffset()
  })


  const setCartData = async (setLoading) => {
    const rects = Object.fromEntries(Object.keys(offsets).map(x => [x, JSON.parse(JSON.stringify(document.querySelector(`[src="${x}"]`)?.getBoundingClientRect() ?? "{}"))]))
    setLoading(true)

    let cartObj = getKey("cart") ?? []

    const illustration = document.getElementsByClassName("display-image")[0]
    illustration.style.display = "flex"

    let uploadedImage = null
    if (props && JSON.stringify(distribution) != JSON.stringify(props.distribution) || !props) {
      const canvas = await html2canvas(illustration, {
        // allowTaint: true,
        // foreignObjectRendering: true,
        scale: 1,
        useCORS: true,
      })

      const watermarkEl = document.getElementById("watermark")
      const bgEl = document.getElementById("real-background")

      const illustrationStyle = { ...illustration.style }
      const img = canvas.toDataURL();
      uploadedImage = await uploadImageOnS3(img)
    }


    illustration.style.display = "none"

    const productData = {
      uuid: props?.uuid,
      selections: {
        uuid: props?.uuid,
        img: uploadedImage ? uploadedImage : (props?.img ?? props?.selection?.img),
        product: { ...product, templeteArray: undefined },
        distribution,
        ...Object.fromEntries(Object.entries(selectedPricingOptions).map(([k, obj]) => [`pricing-${k}`, obj.name])),
        ...Object.fromEntries(Object.entries(selectedPricingOptions).map(([k, obj]) => [k, obj.name])),
        background,
        title,
        subtitle,
        characters,
        realOffsets,
        // templeteArray,
        offsets,
        rects,
      }
    }

    if (props?.uuid) cartObj = cartObj.map(p => p.uuid == props.uuid ? productData : p)
    else {
      const uuid = genUUID()
      productData.uuid = uuid
      productData.selections.uuid = uuid
      cartObj.push(productData)
    }

    setKey("cart", cartObj)

    setLoading(false)
  }

  const PricingDataComponent = () => <div className="pricing-main-component-container">
    <div className="pricing-main-component">
      <div id="pricing-main-component-text-container">
        <h1>{title}</h1>
        {!isPhone() && <h2>{product.desc}</h2>}
      </div>
      <div>
        <h3 id="pricing-main-component-h3">{(0 + parseFloat(Object.values(selectedPricingOptions).map(({ price }) => parseFloat(price)).reduce((a, b) => a + b, 0))).toFixed(2)} €</h3>
      </div>
    </div>
    <div className="pricing-main-component-pricing-dropdowns">
      {Object.entries(pricingObject).map(([section, prices]) => <DropdownModel
        _={console.log("RELAPRICE", prices)}
        name={selectedPricingOptions[section]?.name}
        array={prices}
        dropdownValue={shownPricingOptions[section]}
        onClickValue={(data) => [
          setSelectedPricingOptions({ ...selectedPricingOptions, [section]: data }),
          setShownPricingOptions({ ...shownPricingOptions, [section]: false }),
        ]}
        onClick={() => setShownPricingOptions({ ...shownPricingOptions, [section]: !shownPricingOptions[section] })}
      />)}
    </div>
  </div>

  const IllustrationRender = ({ isImageLoaded, givenId, printFrame, realOffsets, distribution, ogProduct, adjustScale, unsetMargin, background, product, showChars, style, containerClasses, marginLeftSet=false }) => {
    console.log("printFrameprintFrame", printFrame)

    return <div
      id={isPhone() && !ratios.has(background?.url) && unsetMargin ? givenId : givenId}
      ref={ref => ratios.has(background?.url) ?
          ref && isPhone() && marginLeftSet && ref.style.setProperty('margin-left', '0.3rem', 'important') :
          ref && isPhone() && marginLeftSet && ref.style.setProperty('margin-left', '2.5rem', 'important')
        }
      style={JSON.parse(JSON.stringify({
        height: '500px',
        transform: isPhone() && !ratios.has(background?.url) && adjustScale ? 'scale(0.7)' : undefined,
        width: isPhone() && ratios.has(background?.url) ? '350px' : '500px',
        position: "relative",
        margin: 0,
        marginRight: isPhone() && ratios.has(background?.url) ? '-100px' : '-100px',
        padding: 0,
        ...(style ?? {})
      }))}
      className={['cactus-templete_detail-main_image', ...(containerClasses ?? [])].join(" ")}
    >
      <>
        <canvas id="canvas" height={"500px"} width={'500px'} style={{ backgroundImage: `url("${background?.coordinateVariation?.alternate ?? background.url}")`, width: '100%', height: '100%', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></canvas>
        {((defaultModel || showPaymentModel || selectedImage || chooseBackgroundModel || chooseGenderModel || !printFrame || !background.coordinateVariation.frame)) ? <></> : <img src={background.coordinateVariation.frame} style={{
          zIndex: 100000000000000,
          _: console.log("showChars", distribution, showChars),
          position: "absolute",
          top: -1,
          left: parseInt(background.coordinateVariation.fameScale) + 1 == 361 ? -3 : -1,
          height: "101%",
          maxWidth: "500px",
          width: background.coordinateVariation.fameScale == undefined ? "200px" : `${parseInt(background.coordinateVariation.fameScale) + 1}px`,
        }} />}
        {console.log("OFSET>", offsets, groupDistribution(ogProduct, distribution), product?.offsets)}
        {groupDistribution(ogProduct, distribution).map(sprites => <>
          {
            (defaultModel || showPaymentModel || chooseBackgroundModel || chooseGenderModel) && !showChars ? [] : sprites.map(sprite => <img data-categoryLayer={sprite?.categoryLayer} data-truth={sprite.fixedWidth} className={sprite.sprite} src={sprite.hidden ? "" : sprite.sprite} style={{
              height: "unset",
              width: "unset",
              position: "absolute",
              // _: console.log("GVN", sprite.categoryName, sprite, sprite.fixedWidth, sprite.x),
              // _: console.log("do we", product.alignBottom, "so now", decodeURIComponent(sprite.sprite), "at", sprite.y, "XTSCALE", sprite.rectHeight, sprite.offset, "offset-height", sprite.offset / 2, "rect-height", sprite.rectHeight / 2),
              // _: console.log("STATS", (sprite.scale == 0 ? 1 : sprite.scale/100), (sprite.categoryScale == 0 || sprite.categoryScale == "" ? 1 : sprite.categoryScale/100), (sprite.scale == 0 ? 1 : sprite.scale/100)*(sprite.categoryScale == 0 ? 1 : sprite.categoryScale/100), realOffsets[sprite.sprite]?.width, sprite),
              left: `${((parseFloat(sprite.x) + parseInt(product.xAddition ?? "0") + parseFloat(sprite.fixedWidth == "" || sprite.fixedWidth == undefined ? "0" : sprite.fixedWidth)) - ((product.alignCenterX ? (sprite.offsetWidth == sprite.rectWidth && sprite.ogSubcategoryName == sprite.subcategoryName ? 0 : (sprite.offsetWidth - sprite.rectWidth) / 2) : 0)))}px`,
              top: `${((parseFloat(sprite.y) + parseInt(product.yAddition ?? "0") + parseFloat(sprite.fixedOffset == "" || sprite.fixedOffset == undefined ? "0" : sprite.fixedOffset)) - ((product.alignBottom ? ((sprite.offset ?? 0)) - (sprite.rectHeight ?? 0) : (product.alignCenter ? (sprite.offset == sprite.rectHeight && sprite.ogSubcategoryName == sprite.subcategoryName ? 0 : ((realOffsets[sprite.sprite]?.height ?? 1) - (sprite.rectHeight ?? 0)) / 2) : 0))))}px`,
              scale: `${(sprite.scale == 0 ? 1 : sprite.scale / 100) * (sprite.categoryScale == 0 ? 1 : sprite.categoryScale / 100) * (product.scaleAddition == 0 || !product.scaleAddition ? 1 : product.scaleAddition / 100)}`,
              maxWidth: "500px",
              transformOrigin: "0 0",
              zIndex: 100 * (sprite.layer + 1) + ((sprite?.categoryLayer ?? 0) * 1000)
            }} />)
          }
        </>)}
        {console.log("LOGO COMP", ratios.has(background.url))}
        {(defaultModel || showPaymentModel || chooseBackgroundModel || chooseGenderModel || selectedImage) && !showChars ? <></> : <img className="overlay-logo-template" src={logo} style={ratios.has(background.url) ? {} : {
          top: "74px",
          left: "100px"
        }} />}
        {(defaultModel || showPaymentModel || chooseBackgroundModel || chooseGenderModel || selectedImage) && !showChars ? <></> : <MultiText background={background} />}
        {!isImageLoaded && <div className="overlay-loader-container" style={{
          ...(ratios.has(background.url) ? {
            width: "355px",
          } : {
            width: "500px",
            height: "355px",
          }),
        }}>
          <ScaleLoader color="blue" />
        </div>}
      </>
    </div>
  }

  return (
    <div className="cactus-dashboard-main_container">
      {<div id="overlay-title-hidden" ref={overlayTitleHidden} style={{ position: "absolute", zIndex: -100000 }}>
        {<div style={{
          // height: "500px", 
          // width: "500px", 
          whiteSpace: 'nowrap',
          position: "absolute",
          left: `${background.coordinateVariation.xText}px`,
          top: `${background.coordinateVariation.yText}px`,
          fontSize: `${background.coordinateVariation.textSize}pt`,
          fontFamily: background.font,
          color: background.coordinateVariation.color,
        }}>{title}</div>}
      </div>}
      {<div id="overlay-subtitle-hidden" ref={overlaySubtitleHidden} style={{ position: "absolute", zIndex: -100000 }}>
        {<div style={{
          // height: "500px", 
          // width: "500px", 
          whiteSpace: 'nowrap',
          position: "absolute",
          left: `${background.coordinateVariation.xSmallText}px`,
          top: `${background.coordinateVariation.ySmallText}px`,
          fontSize: `${background.coordinateVariation.smallTextSize}pt`,
          fontFamily: background.smallFont,
          color: background.coordinateVariation.smallColor,
        }}>{subtitle}</div>}
      </div>}
      {recents == 'no' ? <></> : <NavBar onProductClick={async (od, setLoading) => {
        console.log("Navigating through custom function")
        navigate(`/?productId=${od._id}`)
      }} />}
      {selectedImage && <NestedDescription img={selectedImage} setShowModalDes={setSelectedImage} />}
      {showPaymentModel && (
        <PaymentModel
          autoSelect={autoSelect}
          additionalData={showPaymentModel}
          closeModal={() => setShowPaymentModel(null)}
          ogProduct={JSON.parse(decodeURIComponent(JSONProduct))}
          product={product}
          hasStaticPositions={hasStaticPositions(ogProduct)}
          onClick={(optionId, { rects }) => {
            const selectedCardPayment = optionId != 3
            const showBillingScreenForCard = optionId == 1
            const minorBilling = optionId == 2
            console.log("HERE, NAV  props", optionId, showBillingScreenForCard, selectedCardPayment)
            console.log("HERE, NAV")
            setWithCard(selectedCardPayment)
            setShowPaymentModel(null)
            const selectionObject = {
              product: {
                ...product,
                price: Object.entries(selectedPricingOptions).map(([_, obj]) => parseFloat(obj.price ?? '0')).reduce((a, b) => a + b, 0),
                templeteArray: undefined
              },
              distribution,
              ...Object.fromEntries(Object.entries(selectedPricingOptions).map(([k, obj]) => [k, obj.name])),
              background,
              title,
              subtitle,
              characters,
              realOffsets,
              showBillingScreenForCard,
              withCard: selectedCardPayment,
              minorBilling,
              // templeteArray,
              offsets,
              rects,
            }
            navigate(`/billingAddress?${setParam({ product: product._id })}`, {
              state: {
                selections: selectionObject
              }
            })
            // }, 1500)
          }}
        />
      )}
      {defaultModel && (
        <DefaultModel
          _={console.log("autoselect", props)}
          autoSelect={props ? false : autoSelect}
          ogProduct={JSON.parse(decodeURIComponent(JSONProduct))}
          product={product}
          Illustration={IllustrationRender}
          isVertical={!ratios.has(background?.url)}
          illustrationData={{ distribution, printFrame, realOffsets, isImageLoaded, product, ogProduct, background, showChars: true }}
          hasStaticPositions={hasStaticPositions(ogProduct)}
          onClick={({ product, closeModal }) => {
            console.log("chs2")
            firstLoad = false
            setProduct(Object.freeze(product))
            if (closeModal) {
              setDefaultModel(false)
              setChosen(true)
              setAutoSelect(false)
            }
          }}
        />
      )}
      {familyCompositionModel && (
        <CompositionModel onClick={() => setFamilyCompositionModel(false)} />
      )}
      {chooseBackgroundModel && (
        <ChooseBackgroundModel
          isPhone={isPhone()}
          _={console.log("|product", product.backgrounds)}
          backgrounds={product.backgrounds.filter(x => {console.log("<><>|ch", x.coordinateVariation.evenFor); return true})}
          onClick={data => {
            if (data.image) setBackground(data.image)
            // const distCopy = [...distribution]
            // setDistribution([ ...distCopy ])
            // setDistribution(() => distCopy)
            setChooseBackgroundModel(undefined)
          }}
        />
      )}
      {chooseGenderModel && (
        <GenderModel isPhone={isPhone()} index={chooseGenderModel.index} variation={chooseGenderModel.array} femaleVariations={chooseGenderModel.femaleArray} onClick={(data) => {
          if (data.type) return setChooseGenderModel(undefined)
          if (!data.image) data.image = undefined
          console.log("EMPTY >>>>>", chooseGenderModel)
          // const [cat, scat] = getCategoryOfCharacter(product, data.image)
          // setCharacterCategoryObject({ ...characterCategoryObject, [cat.categoryName]: [...(characterCategoryObject[cat] ?? []), data.image] })
          setCharacters(characters.map((ch, i) => i == chooseGenderModel.totalIndex ? data.image : ch))
          setChooseGenderModel(undefined)
        }} />
      )}

      <div className="cactus-dashboard-container">
        <div className="cactus-templet_detail_top_container" style={ isPhone() && ratios.has(background?.url) ? { padding: '1rem' } : {}}>
          <div className="cactus-templete_detail-detail_top_view">
            {!isPhone() && !printing && <PricingDataComponent />}
            <div className="cactus-templete_detail-form_top_view">
              {printing ? <>
                <div style={{ width: printing ? undefined : "50%", display: "flex", flexDirection: "column", }}>

                  <div className="input-container-main" style={{ marginTop: "2rem", display: "flex", alignItems: "center" }}>
                    <input style={{ marginRight: "1rem" }} type="checkbox" checked={printBackground} onClick={() => setPrintBackround(!printBackground)} />
                    <div>Print Background</div>
                  </div>

                  <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                    <input style={{ marginRight: "1rem" }} type="checkbox" checked={printFrame} onClick={() => setPrintFrame(!printFrame)} />
                    <div>Print Frame</div>
                  </div>

                  <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                    <div>Frame Height</div>
                    <input style={{ marginRight: "1rem" }} type="number" value={frameHeight} onChange={ev => setFrameHeight(ev.target.value)} />
                  </div>

                  {product?.productCategry == 'poster' && <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                    <div>Quality</div>
                    <select style={{ marginRight: "1rem" }} type="number" value={quality?.value} onChange={ev => {
                      console.log("evx", { label: qualityOptions.find(q => q.value == ev.target.value)?.label, value: ev.target.value })
                      setQuality({ label: qualityOptions.find(q => q.value == ev.target.value)?.label, value: ev.target.value })
                    }}>
                      {qualityOptions.map(q => <option value={q.value}>{q.label}</option>)}
                    </select>
                  </div>}

                  <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                    <div>Format</div>
                    <select style={{ marginRight: "1rem" }} type="number" value={quality?.value} onChange={ev => {
                      console.log("evx", { label: formats.find(q => q.value == ev.target.value)?.label, value: ev.target.value })
                      setQuality({ label: formats.find(q => q.value == ev.target.value)?.label, value: ev.target.value })
                    }}>
                      {formats.map(q => <option value={q.value}>{q.label}</option>)}
                    </select>
                  </div>

                  <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                    <div>Readjust Frame Position Y</div>
                    <input style={{ marginRight: "1rem" }} type="number" value={frameReadjust} onChange={ev => setFrameReadjust(ev.target.value)} />
                  </div>

                  <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                    <div>Readjust Frame Position X</div>
                    <input style={{ marginRight: "1rem" }} type="number" value={frameReadjustX} onChange={ev => setFrameReadjustX(ev.target.value)} />
                  </div>

                  <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                    <div>Bottom Offset Y</div>
                    <input style={{ marginRight: "1rem" }} type="number" value={bottomOffset} onChange={ev => setBottomOffset(ev.target.value)} />
                  </div>

                  <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                    <input style={{ marginRight: "1rem" }} type="checkbox" checked={fit} onClick={() => setFit(!fit)} />
                    <div>Fit</div>
                  </div>

                  {!fit && <>
                    <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                      <div>PDF Height</div>
                      <input style={{ marginRight: "1rem" }} type="number" value={pdfHeight} onChange={ev => setPdfHeight(ev.target.value)} />
                    </div>
                    <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                      <div>PDF Width</div>
                      <input style={{ marginRight: "1rem" }} type="number" value={pdfWidth} onChange={ev => setPdfWidth(ev.target.value)} />
                    </div>
                    <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                      <div>Illustration Height</div>
                      <input style={{ marginRight: "1rem" }} type="number" value={illustrationHeight} onChange={ev => setIllustrationHeight(ev.target.value)} />
                    </div>
                    {/* <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                            <div>Align Middle Vertically</div>
                            <input style={{ marginRight: "1rem" }} type="checkbox" checked={alignMiddle} onClick={() => setAlignMiddle(!alignMiddle)}/>
                        </div> */}
                    <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                      <div>Landscape</div>
                      <input style={{ marginRight: "1rem" }} type="checkbox" checked={landscape} onClick={() => setLandscape(!landscape)} />
                    </div>
                    <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                      <div>Illustration X Distance</div>
                      <input style={{ marginRight: "1rem" }} type="number" value={illustrationDistance} onChange={ev => setIllustrationDistance(ev.target.value)} />
                    </div>
                    <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                      <div>Illustration Y Distance</div>
                      <input style={{ marginRight: "1rem" }} type="number" value={illustrationYDistance} onChange={ev => setIllustrationYDistance(ev.target.value)} />
                    </div>
                    <div className="input-container-main" style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                      <div>Illustration Scale</div>
                      <input style={{ marginRight: "1rem" }} type="number" value={scale} onChange={ev => setScale(ev.target.value)} />
                    </div>
                  </>}

                  {/* {isFulfilled ? <p>The order has been fulfilled</p> : <button style={{ width: "200px" }} className='btn btn-primary' onClick={async () => {
                        setIsFulfilled(true)
                        await req(`/user/order/${order._id}`, "PATCH", { fulfilled: true })
                    }}>Fulfill</button>} */}
                </div>
                <div className="cactus-templete_detail-order_button"
                  style={{ cursor: loading2 ? "default" : undefined }}
                  onClick={async () => {
                    if (loading2) return

                    window.scrollTo(0, 0)
                    const illustration = document.getElementsByClassName("display-image")[0];
                    const realBg = document.getElementById("real-background")
                    illustration.style.display = "flex"
                    illustration.style.height = `${realBg.getBoundingClientRect()?.height}px`
                    illustration.style.width = `${realBg.getBoundingClientRect()?.width}px`
                    console.log(illustration.style)

                    // [...document.getElementsByClassName("hidden-text")].forEach(el => el.style.display = "none")

                    console.log("ok!!")
                    console.log("WWWWHHH", width)
                    // if(width == 500) resizeAccordingly()
                    // illustration.style.zoom = "1000%"
                    // illustration.style.transform = "rotate(90deg)"
                    console.log("WWWWHHH2", width)
                    const canvas = await html2canvas(illustration, {
                      // allowTaint: true,
                      // foreignObjectRendering: true,
                      scale: parseInt(quality?.value) * 2,
                      useCORS: true,
                    })
                    console.log("WWWWHHH3", width)
                    const img = canvas.toDataURL();
                    // illustration.style.zoom = "100%";
                    // console.log("WWWWHHH4", width)
                    if (fit) createPDF(img, background.coordinateVariation.frame, bottomOffset, frameHeight, title, width == 355 ? 'p' : 'l')
                    else createCustomPDF(width == 355, title, img, pdfHeight, pdfWidth, null, landscape, illustrationHeight, illustrationDistance, illustrationYDistance, scale);
                    // [...document.getElementsByClassName("hidden-text")].forEach(el => el.style.display = "block")

                    illustration.style.display = "none"
                    console.log(quality, quality?.label)
                    await req('PATCH', `/user/order/${orderId}`, { printQuality: quality?.label })
                  }}>
                  {loading2 ? <ScaleLoader color="#fff" /> : <h5>Télécharger</h5>}
                </div>
              </> : <>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div id="cactus-personalize-text-container">
                    <h3>Personnaliser</h3>
                    {!isPhone() && <h2>Composition de la famille</h2>}
                  </div>
                  <button className='cactus-default-select-btn' style={{ borderRadius: '7px', marginRight: '10px', color: 'whitesmoke', width: isPhone() ? "180px" : "250px", alignSelf: 'center', marginBottom: "10px", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => setDefaultModel(true)}>
                    <h3 style={{ color: "whitesmoke", padding: "0px", fontSize: "2rem" }}>Changer les personnages</h3>
                  </button>
                </div>
                <CustomInputWithDropdown
                  type={"name"}
                  value={"Modifier le nom"}
                  modalOpened={defaultModel || showPaymentModel || chooseBackgroundModel || chooseGenderModel || selectedImage || errorModal}
                  subtitle={subtitle}
                  onChangeSubtitle={setSubtitle}
                  title={title}
                  onChangeTitle={setTitle}
                  dropdownValue={showEditNameDropdown}
                  onClickEditNameDropdown={() =>
                    setShowEditNameDropdown(!showEditNameDropdown)
                  }
                />
                <CustomInputWithDropdown
                  onClickButton={() => setChooseBackgroundModel(true)}
                  type={"background"}
                  value={"Modifier l'arrière-plan"}
                  modalOpened={defaultModel || showPaymentModel || chooseBackgroundModel || chooseGenderModel || selectedImage || errorModal}
                  dropdownValue={showEditBackgroundDropdown}
                  dropdownData={{ image: product.backgrounds[product.defaultBackground] }}
                  onClickEditNameDropdown={() =>
                    setShowEditBackgroundDropdown(!showEditBackgroundDropdown)
                  }
                />
                {
                  accImageIndexes(hiddenCentralCategories, product.categories.map((cat, i) => [cat.name, getCharacters(cat).map((img, ind) => [img, ind])])).map(([name, images], ix) => images.map(([image, totalIndex], i) => (hiddenCentralCategories[`${name} ${i + 1}`] && hasStaticPositions(product)) ? <></> : <CustomInputWithDropdown
                    containerStyle={{ display: product.categories.find(cat => cat.name == name)?.hidden ? "none" : undefined }}
                    onClickButton={() => setChooseGenderModel({
                      _: console.log("PARENT-ARRANGEMENT",), type: name, totalIndex, index: i, array: arrangeByParent(product.categories.find(cat => cat.name === name).subcategories.map((sub, id) => {
                        const giveni = findIndex(cat => cat.name == name, product.categories)
                        const j = id
                        return {
                          id,
                          parent: sub.parent,
                          title: sub.name,
                          array: sub.characters.map((x, n) => { return { id: n + 1, index: totalIndex, image: product.categories.find(cat => cat.name == name)?.hidden ? "" : x, i: giveni, j, k: n } }),
                          icon: sub.image,
                        }
                      }))
                    })}
                    type={"adult"}
                    categoryName={name}
                    modalOpened={defaultModel || showPaymentModel || chooseBackgroundModel || chooseGenderModel || selectedImage}
                    value={`Modifier ${name} ${i + 1}`}
                    dropdownValue={showEditAdultDropdown?.index === totalIndex && showEditAdultDropdown?.category == name}
                    dropdownData={{ image: characters[totalIndex] }}
                    onClickEditNameDropdown={() => {
                      setShowEditAdultDropdown(showEditAdultDropdown?.index === totalIndex && showEditAdultDropdown?.category == name ? undefined : { category: name, totalIndex, index: totalIndex })
                    }
                    }
                  />))
                }
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <button className='cactus-default-select-btn' style={{ color: 'whitesmoke', height: "45px", width: "100%", alignSelf: 'center', display: "flex", justifyContent: "center", alignItems: "center", borderRadius: '0px', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} onClick={() => document.getElementsByClassName('cactus-templete_detail-main_image')[0]?.scrollIntoView()}>
                    <h3 style={{ color: "whitesmoke", padding: "0px", fontSize: "1.5rem" }}>Voir affiche</h3>
                  </button>
                </div>
              </>}
            </div>
            {!printing && <div className="order-buttons" style={{ display: "flex" }}>
              <div
                onClick={async () => {
                  if (loading1) return
                  // const img = await screenshot(document.getElementsByClassName("cactus-templete_detail-main_image_view")[0])
                  // console.log("imgs=>", img)
                  const rects = Object.fromEntries(Object.keys(offsets).map(x => [x, JSON.parse(JSON.stringify(document.querySelector(`[src="${x}"]`)?.getBoundingClientRect() ?? "{}"))]))
                  await setCartData(setLoading1)
                  setShowPaymentModel({ rects })
                }}
                style={{ marginRight: "1.5rem", cursor: loading1 ? "default" : undefined }}
                className="cactus-templete_detail-order_button"
              >
                {loading1 ? <ScaleLoader color="#fff" /> : <h5>Commandez maintenant</h5>}
              </div>
              <div className="cactus-templete_detail-order_button"
                style={{ cursor: loading2 ? "default" : undefined, background: 'white', border: '3px solid #2b453e' }}
                onClick={async () => {
                  if (loading2) return

                  await setCartData(setLoading2)
                  setErrorModal("show")
                  swal({
                    title: "Succès",
                    text: "Le produit a été ajouté à votre panier.",
                    icon: "success",
                    // dangerMode: true,
                  }).then(_ => setErrorModal(null))
                }}>
                {loading2 ? <ScaleLoader color="#fff" /> : <h5 style={{ color: '#2b453e', fontWeight: '700' }}>Ajouter au panier</h5>}
              </div>
            </div>}
          </div>
          <div>
            <div className="cactus-templete_detail-main_image_view" style={isPhone() && !ratios.has(background?.url) ? { marginLeft: '-112px' } : {}}>
              <div className="cactus-templete_detail-main_image_button_view" style={isPhone() && !ratios.has(background?.url) ? { marginLeft: '100px' } : {}}>
                {/* <h5>{product.mainDesc}</h5> */}
                <h5>{product.productCategry}</h5>
              </div>
              <IllustrationRender
                givenId='cactus-vertical'
                marginLeftSet={true}
                containerClasses={['cactus-templete_detail-main_image_main_mode', ratios.has(background?.url) ? 'cactus-vertical'  : '']}
                distribution={distribution}
                product={product}
                realOffsets={realOffsets}
                style={{ marginRight: isPhone() && ratios.has(background?.url) ? '-2px' : '-102px' }}
                isImageLoaded={isImageLoaded}
                background={background}
                printFrame={printFrame}
                ogProduct={ogProduct}
                unsetMargin={true}
                adjustScale={true}
                showChars={false}
              />
              <div className="cactus-templete_detail_side_templetes_view" style={isPhone() && !ratios.has(background?.url) ? { marginLeft: '93px' } : {}}>
                <img
                  src={arrowLeft}
                  style={{ marginTop: ratios.has(background?.url) ? undefined : '-100px' }}
                  className="cactus-templete_detail_side__view_arrow_up"
                  onClick={() => document.getElementsByClassName("cactus-list")[0].scrollLeft -= 100}
                />
                <div 
                  id="cactus-list" 
                  className="cactus-list" 
                  style={{ marginTop: ratios.has(background?.url) ? undefined : '-100px', width: ratios.has(background?.url) ? '310px' : '500px' }}
                  ref={el => el && isPhone() && el.style.setProperty('width', '290px', "important")}
                >
                  {sideTempleArray.filter(item => item?.image?.coordinateVariation?.preview || item?.image?.url).map((item) => {
                    return (
                      item.image.url ?
                        <img
                          key={item.id}
                          src={item?.image?.coordinateVariation?.preview || item?.image?.url}
                          // onClick={() => setBackground(item.image)}
                          style={{ cursor: 'pointer', width: !ratios.has(item.image.url) ? '9rem' : undefined, height: !ratios.has(item.image.url) ? '9rem' : undefined }}
                          className="cactus-templete_detail_side__view_image_style"
                          onClick={() => setSelectedImage(item?.image?.coordinateVariation?.preview || item?.image?.url)}
                        /> :
                        <h3>Sélectionnez une image</h3>
                    );
                  })}
                </div>
                <img
                  src={arrowRight}
                  style={{ marginTop: ratios.has(background?.url) ? undefined : '-100px', transform: 'rotate(0deg)' }}
                  className="cactus-templete_detail_side__view_arrow_down"
                  onClick={() => document.getElementsByClassName("cactus-list")[0].scrollLeft += 100}
                />
              </div>
            </div>
          </div>
          {isPhone() && <PricingDataComponent/>}
          {/* {isPhone() && <div className="cactus-templete_poster-desc" style={{
            // width: ratios.has(background.url) ? "350px" : "500px",
            width: "500px",
          }}>
            <p>{product.posterDesc}</p>
          </div>} */}
        </div>
        {/* {!isPhone() && <div className="cactus-templete_poster-desc">
          <p style={{ marginTop: isPhone() ? '0px' : undefined }}>{isPhone() ? '' : product.posterDesc}</p>
        </div>} */}
        <Footer />
        <div id={isPhone() && !ratios.has(background?.url) ? '' : ''} style={JSON.parse(JSON.stringify({
          height: '500px',
          transform: isPhone() && !ratios.has(background?.url) ? 'scale(0.7)' : undefined,
          width: isPhone() && ratios.has(background?.url) ? '350px' : '500px',
          position: "relative",
          margin: 0,
          padding: 0,
        }))} className="cactus-templete_detail-main_image display-image">
          <div
            id="canvas-print"
            style={{
              width: ratios.size == 0 ? undefined : ratios.has(background?.url) ? "355px" : "500px",
              height: ratios.size == 0 ? undefined : ratios.has(background?.url) ? '100%' : 'unset',
            }}
          >
            <img id="real-background" style={{
              width: ratios.size == 0 ? undefined : ratios.has(background?.url) ? "355px" : "500px",
              height: ratios.size == 0 ? undefined : ratios.has(background?.url) ? '100%' : 'unset',
              objectFit: 'contain',
            }} src={
              OFFLINE ?
                (background?.coordinateVariation?.alternate ?? background.url) :
                `${printBackground ? (background?.coordinateVariation?.print ?? background?.url) : (background?.coordinateVariation?.alternate ?? background?.url)}?${Date.now()}`
            } crossOrigin="anonymous" />
          </div>
          {console.log("OFSET>", offsets, groupDistribution(ogProduct, distribution), product?.offsets)}
          {defaultModel || showPaymentModel || selectedImage || chooseBackgroundModel || chooseGenderModel || !printFrame || !background.coordinateVariation.frame ? <></> : <img crossOrigin="anonymous" src={OFFLINE ? background.coordinateVariation.frame : `${background.coordinateVariation.frame}?${Date.now()}`} style={{
            zIndex: 100000000000000,
            position: "absolute",
            top: -1,
            left: parseInt(background.coordinateVariation.fameScale) + 1 == 361 ? -3 : -1,
            height: "101%",
            maxWidth: "355px",
            width: background.coordinateVariation.fameScale == undefined ? "200px" : `${parseInt(background.coordinateVariation.fameScale) + 1}px`,
          }} />}
          {groupDistribution(ogProduct, distribution).map(sprites => <>
            {
              (defaultModel || showPaymentModel || chooseBackgroundModel || chooseGenderModel) ? [] : sprites.map(sprite => <img _={[console.log("ooox", sprite.y), console.log("ooox", sprite.offset), console.log("ooox", sprite.rectHeight)]} crossOrigin="anonymous" data-categoryLayer={sprite?.categoryLayer} data-truth={sprite.y - (sprite.offset - sprite.rectHeight) / 2} className={sprite.sprite} src={sprite.hidden ? "" : (OFFLINE ? sprite.sprite : `${sprite.sprite}?${Date.now()}`)} style={{
                height: "unset",
                width: "unset",
                position: "absolute",
                _: console.log("GVN", sprite.categoryName, sprite, sprite.fixedWidth, sprite.x),
                _: console.log("do we", product.alignBottom, "so now", decodeURIComponent(sprite.sprite), "at", sprite.y, "XTSCALE", sprite.rectHeight, sprite.offset, "offset-height", sprite.offset / 2, "rect-height", sprite.rectHeight / 2),
                _: console.log("STATS", (sprite.scale == 0 ? 1 : sprite.scale / 100), (sprite.categoryScale == 0 || sprite.categoryScale == "" ? 1 : sprite.categoryScale / 100), (sprite.scale == 0 ? 1 : sprite.scale / 100) * (sprite.categoryScale == 0 ? 1 : sprite.categoryScale / 100), realOffsets[sprite.sprite]?.width, sprite),
                left: `${((parseFloat(sprite.x) + parseInt(product.xAddition ?? "0") + parseFloat(sprite.fixedWidth == "" || sprite.fixedWidth == undefined ? "0" : sprite.fixedWidth)) - ((product.alignCenterX ? (sprite.offsetWidth == sprite.rectWidth && sprite.ogSubcategoryName == sprite.subcategoryName ? 0 : (sprite.offsetWidth - sprite.rectWidth) / 2) : 0)))}px`,
                top: `${((parseFloat(sprite.y) + parseInt(product.yAddition ?? "0") + parseFloat(sprite.fixedOffset == "" || sprite.fixedOffset == undefined ? "0" : sprite.fixedOffset)) - ((product.alignBottom ? ((sprite.offset ?? 0)) - (sprite.rectHeight ?? 0) : (product.alignCenter ? (sprite.offset == sprite.rectHeight && sprite.ogSubcategoryName == sprite.subcategoryName ? 0 : ((realOffsets[sprite.sprite]?.height ?? 1) - (sprite.rectHeight ?? 0)) / 2) : 0))))}px`,
                scale: `${(sprite.scale == 0 ? 1 : sprite.scale / 100) * (sprite.categoryScale == 0 ? 1 : sprite.categoryScale / 100) * (product.scaleAddition == 0 || !product.scaleAddition ? 1 : product.scaleAddition / 100)}`,
                maxWidth: "500px",
                transformOrigin: "0 0",
                zIndex: 100 * (sprite.layer + 1) + ((sprite?.categoryLayer ?? 0) * 1000)
              }} />)
            }
          </>)}
          {console.log("LOGO COMP", ratios.has(background.url))}
          {<div id="overlay-title-hidden" ref={overlayTitleHidden} style={{ position: "absolute", zIndex: -100000 }}>
            {<div style={{
              // height: "500px", 
              // width: "500px", 
              whiteSpace: 'nowrap',
              position: "absolute",
              left: `${background.coordinateVariation.xText}px`,
              top: `${background.coordinateVariation.yText}px`,
              fontSize: `${background.coordinateVariation.textSize}pt`,
              fontFamily: background.font,
              color: background.coordinateVariation.color,
            }}>{title}</div>}
          </div>}
          {<div id="overlay-subtitle-hidden" ref={overlaySubtitleHidden} style={{ position: "absolute", zIndex: -100000 }}>
            {<div style={{
              // height: "500px", 
              // width: "500px", 
              whiteSpace: 'nowrap',
              position: "absolute",
              left: `${background.coordinateVariation.xSmallText}px`,
              top: `${background.coordinateVariation.ySmallText}px`,
              fontSize: `${background.coordinateVariation.smallTextSize}pt`,
              fontFamily: background.smallFont,
              color: background.coordinateVariation.smallColor,
            }}>{subtitle}</div>}
          </div>}
          {defaultModel || showPaymentModel || chooseBackgroundModel || chooseGenderModel || selectedImage ? <></> : <MultiText background={background} />}
        </div>
      </div>
    </div>
  );
}

export default function TempleteDetailWrapper() {
  const { state } = useLocation()
  // const { product: JSONProductFromURL, recents, editData } = state
  const JSONProductFromURL = state?.product
  const editData = state?.editData
  const printing = state?.printing
  const orderId = state?.orderId
  const recents = []
  const [JSONProduct, setJSONProduct] = useState(JSONProductFromURL)
  const [ogProduct, setOgProduct] = useState(JSONProductFromURL ? Object.freeze(JSON.parse(JSONProductFromURL)) : null)

  const [parsedProps, setParsedProps] = useState(JSON.parse(editData ? decodeURIComponent(editData) : '{}'))
  const [selectionData, setSelectionData] = useState(parsedProps.props ? JSON.parse(decodeURIComponent(parsedProps.props)) : null)

  useEffect(() => {
    const { title, productCategry } = getAllParams()
    if (title && !ogProduct) req('GET', `/user/product?query=${encodeURIComponent(JSON.stringify({
      mainDesc: decodeURIComponent(title),
      productCategry: productCategry ? decodeURIComponent(productCategry) : "poster"
    }))}`)
      .then(({ products }) => {
        console.log("MPRODUCT", products)
        const product = products[0]
        setOgProduct(product)
        setJSONProduct(JSON.stringify(product))
      })
  }, [])

  console.log("okxk", parsedProps)

  return ogProduct ? <TempleteDetail orderId={orderId} printing={printing} ogProduct={ogProduct} setOgProduct={x => {
    setOgProduct(x)
    setJSONProduct(JSON.stringify(x))
  }} JSONProduct={JSONProduct} recents={recents} props={selectionData ? {
    // ...parsedProps,
    ...selectionData,
  } : null} /> : <div className="cactus-dashboard-main_container">
    <NavBar />
    <div className="cactus-templet_detail_top_container main_cactus-loader-container-template" style={{ height: "100vh", width: "100vw" }}>
      <ClipLoader color="black" size={100} />
    </div>
  </div>
}
