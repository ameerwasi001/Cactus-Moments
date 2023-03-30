import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  arrowBack,
  arrowDown,
  arrowDownTwo,
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
  NavBar,
  TempleteView,
} from "../../components";
import { getAllParams, setParam } from "../../urlParams";
import "./templeteDetail.css";

function shuffleArray(n, array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  array.forEach((x, i) => array[i] = x ? x : array[Math.floor(Math.random()*array.length)])
}

function random(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

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

const srandom = (str, i=0) => random(sdbm(str)+i)

class ObjectRewriter {
  constructor(rewriter){
      this.requiresArgument = true
      this.rewriter = rewriter
  }

  rewrite(data){
      const obj = {...data}
      for(const k in this.rewriter){
          const rewriter = this.rewriter[k]
          if (k in data){
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
  constructor(f, constant=true){
      super(null, null)
      this.requiresArgument = constant
      this.fun = f
  }

  rewrite(data){
      return this.fun(data)
  }
}

class WholeArrayRewriter extends ObjectRewriter {
  constructor(pattern){
      super(null, null)
      this.patternVar = pattern
  }

  rewrite(arr){
      let objs = []
      for(const i in arr){
          objs.push(this.patternVar.rewrite(arr[i]))
      }
      return objs
  }
}

class TupleRewriter extends ObjectRewriter {
  constructor(pattern){
      super(pattern, null)
  }

  rewrite(arr){
      let new_arr = []
      for(const i in this.rewriter){
          const pattern = this.rewriter[i]
          const elem = arr[i]
          new_arr.push(pattern.rewrite(elem))
      }
      return new_arr
  }
}

function fromObject(obj){
  let newObj = {}
  for(const k in obj){
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
  constructor(){
      this.tags = {
          radius: 20,
          fillStyle: '#22cccc',
          strokeStyle: '#009999',
          selectedFill: '#88aaaa',
          text: {
              text: "",
              textBaseline: "middle",
              font: "20px Arial",
              textAlign: "middle",
              fillStyle: "red"
          } 
      }
  }

  override(rewriter=Rewriter({})){
      return rewriter.rewrite(this.tags)
  }
}

class VisualizationGraph {
  constructor(nodes=[], edges=[], context){
    this.context = this.context
    this.nodes = nodes
    this.edges = edges
    this.drawer = new GraphDrawer(this, context)
  }

  createNode(x, y, tags={}) {
      return {
          selected: false,
          ...tags
      }
  }

  within(x, y){ 
      return this.nodes.find(n => 
          x > (n.x - n.radius) && 
          y > (n.y - n.radius) &&
          x < (n.x + n.radius) &&
          y < (n.y + n.radius)
      )
  }

  addNode(x, y, tags={}, shouldDraw=true) {
      const el = document.getElementById('canvas').getBoundingClientRect()
      x = x || tags.x
      y = y || tags.y

      const p = {x, y}
      // x = x >= el.width ? el.width-50-randBetween(0, 30) : x
      // y = y >= el.height ? el.height-50-randBetween(0, 500) : y
      tags.x = x
      tags.y = y
      const node = this.createNode(x, y, tags)
      this.nodes.push(node)
      console.log(node)
      if(shouldDraw) this.drawer.draw()
      return node
  }

  addEdge(selection, target) {
      const edge = {from: selection, to: target}
      let shouldRet = false
      if (selection && selection !== target) {
          shouldRet = true
          this.edges.push(edge)
      }
      this.drawer.draw()
      return shouldRet ? edge : null
  }
}

class GraphDrawer {
  constructor(graph, context){
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

    this.graph.nodes.map(node => {
        context.beginPath()
        context.fillStyle = node.selected ? node.selectedFill : node.fillStyle
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true)
        context.strokeStyle = node.strokeStyle
        context.fill()
        if ("text" in node) {
            context.beginPath()
            context.fillStyle = node.text.fillStyle
            context.font = node.text.font
            context.textBaseline = node.text.textBaseline
            context.textAlign = node.text.textAlign
            context.fillText(node.text.text, node.x, node.y)
            context.fill()
        }
        context.stroke()
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

  onmouseup(e){
      if (!this.selection) this.graph.addNode(e.x, e.y, new Tags().override())
      if (this.selection && !this.selection.selected) this.selection = null
      this.draw()
  }
}

const initializeGraph = (nodes=[], edges=[], context) => {
  const graph = new VisualizationGraph(nodes, edges, context)
  return graph
}

const distributeGraph = (n, x, y, getXVariation, getYVariation) => {
  let arr1 = new Array(Math.ceil(n/2)).fill(0).map((_, i) => { return { x: x+i*getXVariation(i) } })
  let arr2 = new Array(Math.floor(n/2)).fill(0).map((_, i) => { return { x: x-(i+1)*getXVariation(i) } })

  arr1 = arr1.map(({x}, i) => { return { x, y: y+i*getYVariation(i) } })
  arr2 = arr2.map(({x}, i) => { return { x, y: y-(i+1)*getYVariation(i) } })

  return [...arr1, ...arr2]
}

export default function TempleteDetail() {
  const navigate = useNavigate();
  const { product: JSONProduct } = getAllParams()
  const product = JSON.parse(JSONProduct)
  shuffleArray(product.maxAdults, product.adultFemaleVariations)
  shuffleArray(product.maxAdults, product.adultMaleVariations)
  shuffleArray(product.maxChildren, product.childMaleVariations)
  shuffleArray(product.maxChildren, product.childMaleVariations)
  const [background, setBackground] = useState(product.defaultBackground)
  const [showFrameModel, setShowFrameModel] = useState(false);
  const [showDimensionModel, setShowDimensionModel] = useState(false);
  const [showEditNameDropdown, setShowEditNameDropdown] = useState(false);
  const [showEditBackgroundDropdown, setShowEditBackgroundDropdown] =
    useState(false);
  const [showEditAdultDropdown, setShowEditAdultDropdown] = useState(undefined);
    useState(false);
  const [showEditChildDropdown, setShowEditChildDropdown] =
    useState(undefined);
  const [familyCompositionModel, setFamilyCompositionModel] = useState(false);
  const [chooseBackgroundModel, setChooseBackgroundModel] = useState(false);
  const [chooseGenderModel, setChooseGenderModel] = useState(undefined);
  const [adults, setAdults] = useState([...product.adultMaleVariations, ...product.adultFemaleVariations].slice(0, product.maxAdults))
  const [children, setChildren] = useState([...product.childMaleVariations, ...product.childFemaleVariations].slice(0, product.maxAdults))

  const [selectedFrame, setSelectedFrame] = useState({
    id: 1,
    name: "Without Frame",
  });
  const [selectedDimension, setSelectedDimesion] = useState({
    id: 1,
    name: "A3 - (29,7 x 42 cm",
  });

  const sideTempleArray = product.backgrounds.map((x, id) => { return { id, image: x } });
  const frameArray = [
    {
      id: 1,
      name: "Without Frame",
    },
    {
      id: 2,
      name: "With Frame",
    },
  ];
  const dimensionArray = [
    {
      id: 1,
      name: "A3 - (29,7 x 42 cm)",
    },
    {
      id: 2,
      name: "A4 - (29,7 x 42 cm)",
    },
    {
      id: 2,
      name: "A6 - (29,7 x 42 cm)",
    },
  ];
  const [templeteArray, setTemplateArray] = useState([]);

  useEffect(() => {
    let cactusRecents = localStorage.getItem("cactus_recents") ?? "[]"
    if(cactusRecents.length == 0) localStorage.setItem("cactus_recents", "")
    const parsedRecents = JSON.parse(cactusRecents)
    const newRecents = []
    for(const recent of parsedRecents) 
      if(recent._id == product._id) newRecents.push(product)
      else newRecents.push(recent)
    setTemplateArray(newRecents)
    if(!parsedRecents.find(p => p._id == product._id)) newRecents.push(product)
    localStorage.setItem("cactus_recents", JSON.stringify(newRecents))
  }, [])

  useEffect(() => {
    const canvas = document.getElementById("canvas")
    const context = canvas.getContext('2d')

    const graph = initializeGraph([], [], context);

    console.log(srandom(product._id))
    // const distribution = distributeGraph(product.maxAdults, 120, 50, () => 50, (i) => (srandom(product._id, i)  > 0.5 ? 1 : -1) * Math.round(srandom(product._id, i)*10))
    const distribution = distributeGraph(product.maxAdults+product.maxChildren, product.coordinateVariation.x, product.coordinateVariation.y, () => product.coordinateVariation.xVariation, (i) => (srandom(product._id, i)  > 0.5 ? 1 : -1) * Math.round(srandom(product._id, i)*product.coordinateVariation.yVariation))
    console.log(distribution)
    distribution.forEach(({x, y}) => {
      const a1 = graph.addNode(null, null, new Tags().override(fromObject({x, y})));
    })

    // graph.addEdge(a1, a2);
    // graph.addEdge(a1, a3);
    // graph.addEdge(a2, a3);
    // graph.addEdge(a3, a2);
    // graph.addEdge(a3, a4);
  }, [])

  return (
    <div className="cactus-dashboard-main_container">
      <NavBar />
      {familyCompositionModel && (
        <CompositionModel onClick={() => setFamilyCompositionModel(false)} />
      )}
      {chooseBackgroundModel && (
        <ChooseBackgroundModel
          backgrounds={product.backgrounds}
          onClick={data => {
            setBackground(data.image)
            setChooseBackgroundModel(undefined)
          }}
        />
      )}
      {chooseGenderModel && (
        <GenderModel maleVariations={chooseGenderModel.maleArray} femaleVariations={chooseGenderModel.femaleArray} onClick={data => {
          if(chooseGenderModel.type == "adult") setAdults(adults.map((adult, i) => i == chooseGenderModel.index ? data.image : adult))
          else setChildren(children.map((child, i) => i == chooseGenderModel.index ? data.image : child))
          setChooseGenderModel(undefined)
        }} />
      )}

      <div className="cactus-dashboard-container">
        <div className="cactus-templet_detail_top_container">
          <div className="cactus-templete_detail_side_templetes_view">
            <img
              src={arrowBack}
              className="cactus-templete_detail_side__view_arrow_up"
            />
            {sideTempleArray.map((item) => {
              return (
                <img
                  key={item.id}
                  src={item.image}
                  className="cactus-templete_detail_side__view_image_style"
                />
              );
            })}
            <img
              src={arrowBack}
              className="cactus-templete_detail_side__view_arrow_down"
            />
          </div>
          <div className="cactus-templete_detail-main_image_view">
            <div className="cactus-templete_detail-main_image_button_view">
              <h5>Family Outing</h5>
            </div>
            <div className="cactus-templete_detail-main_image">
              <canvas id="canvas" style={{ backgroundImage: `url("${background}")`, width: '100%', backgroundRepeat: 'no-repeat' }}></canvas>
            </div>
          </div>
          <div className="cactus-templete_detail-detail_top_view">
            <h1>{product.name}</h1>
            <h2>{product.desc}</h2>
            <h3>${product.price}</h3>
            <DropdownModel
              name={selectedFrame.name}
              array={frameArray}
              dropdownValue={false}
              onClickValue={(data) => [
                setSelectedFrame(data),
                setShowFrameModel(false),
              ]}
              onClick={() => setShowFrameModel(!showFrameModel)}
            />
            <DropdownModel
              name={selectedDimension.name}
              array={dimensionArray}
              dropdownValue={showDimensionModel}
              onClickValue={(data) => [
                setSelectedDimesion(data),
                setShowDimensionModel(false),
              ]}
              onClick={() => setShowDimensionModel(!showDimensionModel)}
            />
            <div className="cactus-templete_detail-form_top_view">
              <div className="cactus-templete_detail-form_title">
                <h4>Personalize</h4>
                <h5>COMPOSITION OF THE FAMILY</h5>
              </div>
              <CustomInputWithDropdown
                type={"name"}
                value={"Edit Name"}
                dropdownValue={showEditNameDropdown}
                onClickEditNameDropdown={() =>
                  setShowEditNameDropdown(!showEditNameDropdown)
                }
              />
              <CustomInputWithDropdown
                onClickButton={() => setChooseBackgroundModel(true)}
                type={"background"}
                value={"Edit Background"}
                dropdownValue={showEditBackgroundDropdown}
                dropdownData={{image: product.defaultBackground}}
                onClickEditNameDropdown={() =>
                  setShowEditBackgroundDropdown(!showEditBackgroundDropdown)
                }
              />
              {
                adults?.map((x, i) => <CustomInputWithDropdown
                  onClickButton={() => setChooseGenderModel({type: "adult", index: i, maleArray: product.adultMaleVariations, femaleArray: product.adultFemaleVariations})}
                  type={"adult"}
                  value={`Edit Adult ${i+1}`}
                  dropdownValue={showEditAdultDropdown === i}
                  dropdownData={{image: adults[i]}}
                  onClickEditNameDropdown={() =>
                    setShowEditAdultDropdown(showEditAdultDropdown === i ? undefined : i)
                  }
                />)
              }
              {
                children?.map((x, i) => <CustomInputWithDropdown
                  onClickButton={() => setChooseGenderModel({type: "child", index: i, maleArray: product.childMaleVariations, femaleArray: product.childFemaleVariations})}
                  type={"child"}
                  value={`Edit Child ${i+1}`}
                  dropdownValue={showEditChildDropdown == i}
                  dropdownData={{image: children[i]}}
                  onClickEditNameDropdown={() =>
                    setShowEditChildDropdown(showEditChildDropdown === i ? undefined : i)
                  }
              />)}
            </div>
            <div
              onClick={() => navigate(`/billingAddress?${setParam({ product: JSON.stringify(product) })}`)}
              className="cactus-templete_detail-order_button"
            >
              <h5>Order Now</h5>
            </div>
          </div>
        </div>
        <div className="cactus-templet_detail_bottom_view">
          <h1>Recently Viewed</h1>
          <div className="cactus-dashboard-templete_top_view">
            {templeteArray.map((item) => {
              return (
                <TempleteView
                  onClick={() => navigate("/templetedetail")}
                  item={item}
                />
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
