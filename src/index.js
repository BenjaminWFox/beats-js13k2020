/*
ZZFX Sounds

[,0,100,,,.75,1,,-0.1,,-50] // bass 1
zzfx(...[,0,75,,.05,.5,,,-0.1,,,,,,,,,,.05]); // BASS 2
zzfx(...[,0,125,,.05,.25,,2.5,-0.1]); // KICK

*/

import './main.scss'
import Bass from './sound/bass'
import Kick from './sound/kick'
import Snare from './sound/snare'
import HiHat from './sound/hihat'
import l1 from './assets/images/levels/heartbeat3.png'
import Ticker from './sound/ticker'
import { calcFps } from './util'

/* eslint-disable */
// const zzfxV=.3 // volume
// const zzfx=    // play sound
// (t=1,a=.05,n=220,e=0,f=0,h=.1,M=0,r=1,z=0,o=0,i=0,s=0,u=0,x=0,c=0,d=0,X=0,b=1,m=0,l=44100,B=99+e*l,C=f*l,P=h*l,g=m*l,w=X*l,A=2*Math.PI,D=(t=>0<t?1:-1),I=B+g+C+P+w,S=(z*=500*A/l**2),V=(n*=(1+2*a*Math.random()-a)*A/l),j=D(c)*A/4,k=0,p=0,q=0,v=0,y=0,E=0,F=1,G=[],H=zzfxX.createBufferSource(),J=zzfxX.createBuffer(1,I,l))=>{for(H.connect(zzfxX.destination);q<I;G[q++]=E)++y>100*d&&(y=0,E=k*n*Math.sin(p*c*A/l-j),E=D(E=M?1<M?2<M?3<M?Math.sin((E%A)**3):Math.max(Math.min(Math.tan(E),1),-1):1-(2*E/A%2+2)%2:1-4*Math.abs(Math.round(E/A)-E/A):Math.sin(E))*Math.abs(E)**r*t*zzfxV*(q<B?q/B:q<B+g?1-(q-B)/g*(1-b):q<B+g+C?b:q<I-w?(I-q-w)/P*b:0),E=w?E/2+(w>q?0:(q<I-w?1:(q-I)/w)*G[q-w|0]/2):E),k+=1-x+1e9*(Math.sin(q)+1)%2*x,p+=1-x+1e9*(Math.sin(q)**2+1)%2*x,n+=z+=500*o*A/l**3,F&&++F>s*l&&(n+=i*A/l,V+=i*A/l,F=0),u&&++v>u*l&&(n=V,z=S,v=1,F=F||1);return J.getChannelData(0).set(G),H.buffer=J,H.start(),H},zzfxX=new(window.AudioContext||webkitAudioContext)

// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
const zzfx=(...t)=>zzfxP(zzfxG(...t))

// zzfxP() - the sound player -- returns a AudioBufferSourceNode
const zzfxP=(...t)=>{let e=zzfxX.createBufferSource(),f=zzfxX.createBuffer(t.length,t[0].length,zzfxR);t.map((d,i)=>f.getChannelData(i).set(d)),e.buffer=f,e.connect(zzfxX.destination),e.start();return e}

// zzfxG() - the sound generator -- returns an array of sample data
const zzfxG=(a=1,t=.05,h=220,M=0,n=0,s=.1,i=0,r=1,o=0,z=0,e=0,f=0,m=0,x=0,b=0,d=0,u=0,c=1,G=0,I=zzfxR,P=99+M*I,V=n*I,g=s*I,j=G*I,k=u*I,l=2*Math.PI,p=(a=>0<a?1:-1),q=P+j+V+g+k,v=(o*=500*l/I**2),w=(h*=(1+2*t*Math.random()-t)*l/I),y=p(b)*l/4,A=0,B=0,C=0,D=0,E=0,F=0,H=1,J=[])=>{for(;C<q;J[C++]=F)++E>100*d&&(E=0,F=A*h*Math.sin(B*b*l/I-y),F=p(F=i?1<i?2<i?3<i?Math.sin((F%l)**3):Math.max(Math.min(Math.tan(F),1),-1):1-(2*F/l%2+2)%2:1-4*Math.abs(Math.round(F/l)-F/l):Math.sin(F))*Math.abs(F)**r*a*zzfxV*(C<P?C/P:C<P+j?1-(C-P)/j*(1-c):C<P+j+V?c:C<q-k?(q-C-k)/g*c:0),F=k?F/2+(k>C?0:(C<q-k?1:(C-q)/k)*J[C-k|0]/2):F),A+=1-x+1e9*(Math.sin(C)+1)%2*x,B+=1-x+1e9*(Math.sin(C)**2+1)%2*x,h+=o+=500*z*l/I**3,H&&++H>f*I&&(h+=e*l/I,w+=e*l/I,H=0),m&&++D>m*I&&(h=w,o=v,D=1,H=H||1);return J};

// zzfxV - global volume
const zzfxV=.3

// zzfxR - global sample rate
const zzfxR=44100

// zzfxX - the common audio context
const zzfxX=new(top.AudioContext||webkitAudioContext);

//! ZzFXM (v2.0.2) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
const zzfxM=(f,n,o,t=125)=>{let z,e,l,r,g,h,x,a,u,c,d,i,m,p,G,M,R=[],b=[],j=[],k=0,q=1,s={},v=zzfxR/t*60>>2;for(;q;k++)R=[q=a=d=m=0],o.map((t,d)=>{for(x=n[t][k]||[0,0,0],q|=!!n[t][k],G=m+(n[t][0].length-2-!a)*v,e=2,r=m;e<x.length+(d==o.length-1);a=++e){for(g=x[e],u=c!=(x[0]||0)|g|0,l=0;l<v&&a;l++>v-99&&u?i+=(i<1)/99:0)h=(1-i)*R[p++]/2||0,b[r]=(b[r]||0)+h*M-h,j[r]=(j[r++]||0)+h*M+h;g&&(i=g%1,M=x[1]||0,(g|=0)&&(R=s[[c=x[p=0]||0,g]]=s[[c,g]]||(z=[...f[c]],z[2]*=2**((g-12)/12),zzfxG(...z))))}m=G});return[b,j]}
/* eslint-enable */

// const song = [[[.9, 0, 143, , , .35, 3],[1, 0, 216, , , .45, 1, 4, , ,50],[.75, 0, 196, , .08, .18, 3]],[[[0,-1,1,0, 0, 0,3.5,0, 0, 0],[1,1,2,2.25,3.5,4.75,-1,0, 0, 0]]],  [0,0,],  120,{ title: "My Song",author: "Keith Clark" }]
const depp =   [
  [
    [1, 0, 50],
    [1, 0, 100],
    [1, 0, 150],
    [1, 0, 200],
    [1, 0, 250],
    [1, 0, 300],
    [1, 0, 350],
    [1, 0, 400],
  ],
  [
    [
      [1, 0, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33],
      [3, 1, 22, , , , , , , , , , , , , , , , , , , , , , , , , , , , 24, , , , 24, , , , , , , , , , , , , , , , , , , , , , , , 22, , 22, , 22, , , ,],
      [5, -1, 21, , , , , , , , , , , , , , , , , , , , , , , , , , , , 24, , , , 23, , , , , , , , , , , , , , , , , , , , , , , , 24, , 23, , 21, , , ,],
      [, 1, 21, , , , , , , , , , , , , , , , , , , , , , , , , , , , 24, , , , 23, , , , , , , , , , , , , , , , , , , , , , , , 24, , 23, , 21, , , ,]
    ],
    [
      [1, -1, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33],
      [3, 1, 24, , , , , , , , 27, , , , , , , , , , , , , , , , 27, , , , 24, , , , 24, , , , , , , , 27, , , , , , , , , , , , , , , , 24, , 24, , 24, , , ,],
      [5, -1, 21, , , , , , , , , , , , , , , , , , , , , , , , , , , , 24, , , , 23, , , , , , , , , , , , , , , , , , , , , , , , 24, , 23, , 21, , , ,],
      [, 1, 21, , , , , , , , , , , , , , , , , , , , , , , , , , , , 24, , , , 23, , , , , , , , , , , , , , , , , , , , , , , , 24, , 23, , 21, , , ,],
      [6, 1, , , 34, 34, 34, , , , , , 34, 34, , , , , 34, , , , 34, 34, , , , , 34, , , , 34, , , , 34, 34, 34, , , , , , 34, , , , , , 34, 34, , , 34, 34, , , , , , , , , 34, 34],
      [4, 1, , , , , , , 24, , , , , , 24, , 24, , , , 24, , , , 24, , , , , , , , , , , , , , , , 24, , , , , , 24, , 24, , , , 24, , , , 24, , , , , , , , , ,]
    ],
    [
      [1, -1, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 23, 23, 35, 23, 23, 36, 23, 23, 35, 23, 23, 36, 23, 23, 35, 35, 23, 23, 35, 23, 23, 35, 23, 23, 36, 23, 23, 35, 23, 23, 36, 36],
      [5, -1, 21, , , 19, , , 21, , , , , , , , , , 21, , , 19, , , 17, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,],
      [3, 1, 24, , , 24, , , 24, , , , , , , , , , 24, , , 24, , , 24, , , , 24.75, 24.5, 24.26, 24.01, 24.01, 24.01, , , , , 25, , , , , , , , 25, , , , , , , , 25, , , , , , , , 25, 25, 25, 25],
      [4, -1, , , , , , , , , , , , , , , , , , , , , , , , , , , 24.75, 24.5, 24.26, 24.01, 24.01, 24.01, 24.01, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, , 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24],
      [7, -1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 23, , 21, 23, , 35, , 23, , 21, 23, , 35, , 35, , 23, , 21, 23, , 35, , 21, 23, , 35, , 21, 23, , ,],
      [6, 1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 34, 36, 34, , 33, 34, 34, 36, 31, 36, 34, , 31, 34, 32, , 33, 36, 34, , 31, 34, 34, 36, 33, 36, 33, , 31, , ,]
    ],
    [
      [1, -1, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 29],
      [4, 1, 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, , 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24, 24, , , 24, 24, , 24, , 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24],
      [7, -1, 21, , 19, 21, , 33, , 21, , 19, 21, , 33, , 33, , 21, , 19, 21, , 33, , 21, , 19, 21, , 33, , 33, , 17, , 17, 17, 29, 17, 17, 29, 17, , 17, 17, 29, 17, 17, 29, 17, , 17, 17, 29, 17, 17, 29, 17, , 17, 17, 29, 17, 17, 29],
      [2, 1, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, , , , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, 34, 34, , 34, , ,],
      [6, 1, , , 36, , , , , , 36, , 36, , , , , , , , 36, , , , , , 36, , 36, , , , , , , , 36, , , , , , , , , , , , , , , , 36, , , , , , 36, , 36, , , , , ,],
      [3, 1, , , , , 25, , , , , , , , 25, , , , , , , , 25, , , , , , , , 25, 25, 25, 25, , , , , 25, , , , , 25, , , 25, , , , , , , , 25, , , , , , , , 25, 25, 25, 25]
    ],
    [
      [1, -1, 14, 14, 26, 14, 14, 26, 14, 14, 26, 14, 14, 26, 14, 14, 26, 26, 14, 14, 26, 14, 14, 26, 14, 14, 26, 14, 14, 26, 14, 14, 26, 26, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 17, 17, 29, 29, 19, 19, 31, 19, 19, 31, 19, 19, 31, 19, 19, 31, 19, 19, 31, 31],
      [4, 1, 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, , 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 36, , 24, 24, , 24, 24, , 24, 24, 24, 24, , 24, 24, , 24, 24],
      [7, -1, 14, , 14, 14, 26, 14, 14, 26, 14, , 14, 14, 26, 14, 14, 26, 14, , 14, 14, 26, 14, 14, 26, 14, , 14, 14, 26, 14, 14, 26, 17, , 17, 17, 29, 17, 17, 29, 17, , 17, 17, 29, 17, 17, 29, 19, , 19, 19, 31, 19, 19, 31, 19, , 19, 19, 31, 19, 19, 31],
      [2, 1, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, , , , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, 36, 36, , 36, , ,],
      [3, 1, , , , , 25, , , , , , , , 25, , , , , , , , 25, , , , , , , , 25, 25, 25, 25, , , , , 25, , , , , , , , 25, , , , , , , , 25, , , , , , , , 25, 25, 25, 25],
      [6, 1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 34, , , , , , 34, , 34, , , , , , , , 34, , , , , , 34, , 34, , , , , ,]
    ]
  ],
  [
    0,
    1,
    2,
    3,
    4,
  ],
  120]
// const space = [[
//   [1, 0, 50],
//   [1, 0, 75],
//   [1, 0, 100],
//   [1, 0, 125],
//   [1, 0, 150],
//   [1, 0, 175],
// ],[[[5,-1,30,,,,,,,,,,,,30,,,,28,,,,,,,,,,,,,,,,30,,,,,,,,,,,,30,,,,28,,,,,,,,,,,,,,,,],[,1,30.26,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,30.26,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[3,-1,,,,30,,30.75,,,,30,,30.75,,,30,,,,,,,,,,,,,,,,,,,,,30,,30.75,,,,30,,30.75,,,30,,,,,,,,,,,,,,,,,,],[4,-1,,,,,,,30,,30.75,,,,,,,,,,,,,,28,,28.75,,,,28,,,,,,,,,,30,,30.75,,,,,,,,,,,,,,28,,28.75,,,,28,,,,],[1,1,,,,,,,,,,,,,,,,,28.26,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,28.26,,,,,,,,,,,,,,,,],[2,-1,,,,,,,,,,,,,,,,,,,,28,,28.75,,,,28,,28.75,,,28,,,,,,,,,,,,,,,,,,,,,28,,28.75,,,,28,,28.75,,,28,,]]],[0],120]
const songData = zzfxM(...depp)

const TICK_EVERY = 16
const FPS = 60
const BPM = 120
const TIME_PER_TICK = 60.0 / (TICK_EVERY / 4) / BPM
const TIME_PER_RENDER = TIME_PER_TICK / (TICK_EVERY / 2)
const COUNTS_PER_MEASURE = 16
const SECTION_SIZE = (COUNTS_PER_MEASURE)
let BOARD_HEIGHT
let SECTION_HEIGHT
let ZONE_TOP
let ZONE_CHECK_BOTTOM
let ZONE_CHECK_TOP
let MOVE_SPEED
let ZONE_CHECK_MEH_TOP
let ZONE_CHECK_MEH_BOTTOM
let ZONE_CHECK_OK_TOP
let ZONE_CHECK_OK_BOTTOM
let ZONE_CHECK_GOOD_TOP
let ZONE_CHECK_GOOD_BOTTOM
let ZONE_CHECK_PERFECT_TOP
let ZONE_CHECK_PERFECT_BOTTOM

const MeasureEvents = {
  whole: 'whole',
  half: 'half',
  quarter: 'quarter',
  sixteenth: 'sixteenth',
}

const levelData = {
  0: [],
  1: [],
  2: [],
  3: [],
}

const canvas = document.getElementById('body').appendChild(document.createElement('canvas'))
const cvtx = canvas.getContext('2d')
const level = new Image()
const levelHeight = 4
const levelLength = 176

let isLevelLoaded = false

level.src = l1
level.onload = () => {
  cvtx.drawImage(level, 0, 0)

  for (let i = 0; i < levelHeight; i += 1) {
    for (let j = 0; j < levelLength; j += 1) {
      const result = cvtx.getImageData(j, i, 1, 1).data[0] === 0 ? 0 : null

      console.log(result)

      levelData[i].push(result)
    }
  }
  console.log(levelData[0])
  console.log(levelData[1])

  isLevelLoaded = true
}

const AudioContext = window.AudioContext || window.webkitAudioContext
const ctx = new AudioContext()
const bass = new Bass(ctx)
const kick = new Kick(ctx)
const snare = new Snare(ctx)
const hihat = new HiHat(ctx)

const D = document.getElementById('D')
const F = document.getElementById('F')
const J = document.getElementById('J')
const K = document.getElementById('K')

let board
let zone
let bassLane
let kickLane
let snareLane
let hihatLane
const bassBeats = []
const kickBeats = []
const snareBeats = []
const hihatBeats = []

const fpsEl = document.getElementById('fps')
const clockEl = document.getElementById('clock')

function BeatSprite(lane) {
  this.parent = lane

  this.y = -SECTION_HEIGHT
  this.width = Math.floor(board.offsetHeight / SECTION_SIZE)
  this.height = this.width

  const containerEl = document.createElement('div')
  const visualEl = document.createElement('div')

  containerEl.classList.add('beat-container')
  containerEl.style.width = convertPx(this.width)
  containerEl.style.height = convertPx(this.height)
  containerEl.style.top = convertPx(this.y)

  visualEl.classList.add('beat-visual')

  containerEl.appendChild(visualEl)

  this.element = containerEl
  this.parent.prepend(this.element)
  this.move = function () {
    this.y += MOVE_SPEED

    if (this.y > BOARD_HEIGHT) {
      // TODO: Generalize all of this. Too much hard-coded bass beats!
      bassBeats.pop()
      this.parent.removeChild(this.element)
    }
    else {
      this.render()
    }

  }
  this.render = () => {
    this.element.style.top = convertPx(this.y)
  }
}

function spawnBeat(lane, type) {
  type.unshift(new BeatSprite(lane))
}

let currentTick = TIME_PER_TICK
let measureBeat = 1
let levelIndex = 0
let currentRender = 0 // eslint-disable-line

// audioNode.stop()

function gameLoop() {
  // if (currentTick < ctx.currentTime - TIME_PER_RENDER) {
  //   currentRender += TIME_PER_RENDER
  //   console.log('RENDER', currentRender)
  // }
  if (currentTick < ctx.currentTime - TIME_PER_TICK) {
    if (currentRender === 0) {
      zzfxP(...songData)
      
      currentRender = 1
    }
  currentTick += TIME_PER_TICK

    // Object.keys(levelData).forEach((key) => {
    //   if (levelData[key][levelIndex] !== null) {
    //     const spawnIn = parseInt(key, 10) === 0 ? bassLane : parseInt(key, 10) === 1 ? kickLane : parseInt(key, 10) === 2 ? snareLane : hihatLane
    //     const spawnType = parseInt(key, 10) === 0 ? bassBeats : parseInt(key, 10) === 1 ? kickBeats : parseInt(key, 10) === 2 ? snareBeats : hihatBeats

    //     spawnBeat(spawnIn, spawnType)
    //   }
    // })

    if (currentTick % (TIME_PER_TICK * 2) === 0) {
      // console.log('Measure event:', MeasureEvents.quarter, currentTick)
    }
    if (currentTick % (TIME_PER_TICK * 4) === 0) {
      // console.log('Measure event:', MeasureEvents.half, currentTick)
      spawnBeat(bassLane, bassBeats)
    }
    if (currentTick % (TIME_PER_TICK * 8) === 0) {
      // console.log('Measure event:', MeasureEvents.whole, currentTick)
      // if (bassBeats.length < 2) {
      //   spawnBeat(bassLane)
      // }
    }

    measureBeat += measureBeat === 16 ? -15 : 1
    levelIndex += 1
    if (levelIndex === levelData[0].length) {
      levelIndex -= 17
    }
  }

  bassBeats.forEach((beat) => {
    // console.log('beat/zone', beat.style.top, zone.style.top)
    beat.move()
  })
  kickBeats.forEach((beat) => {
    // console.log('beat/zone', beat.style.top, zone.style.top)
    beat.move()
  })

  // const time = (Math.round(ctx.currentTime * 4) / 4).toFixed(2)
  const time = ctx.currentTime.toFixed(2)

  clockEl.innerHTML = time

  // Do whatever
  requestAnimationFrame(gameLoop)
}

function start() {
  if (isLevelLoaded) {
    console.log('starting...')
    requestAnimationFrame(gameLoop)
  }
  else {
    console.log('loading...')
    setTimeout(start, .5)
  }
}
start()

function checkCollision(laneArr) {
  for (let i = laneArr.length; i > 0; i -= 1) {
    const sI = i - 1
    const sprite = laneArr[sI]
    const sY = Math.floor(sprite.y)

    if (sY >= ZONE_CHECK_BOTTOM) {
      console.log('index', sI, 'too late')
      continue
    }
    if (sY <= ZONE_CHECK_TOP) {
      console.log('index', sI, 'too soon')
      continue
    }
    if (sY < ZONE_CHECK_PERFECT_BOTTOM && sprite.y > ZONE_CHECK_PERFECT_TOP) {
      console.log('... PERFECT ...')
      continue
    }
    if (sY < ZONE_CHECK_GOOD_BOTTOM && sprite.y > ZONE_CHECK_GOOD_TOP) {
      console.log('... GOOD ...')
      continue
    }
    if (sY < ZONE_CHECK_OK_BOTTOM && sprite.y > ZONE_CHECK_OK_TOP) {
      console.log('... OK ...')
      continue
    }
    if (sY < ZONE_CHECK_BOTTOM && sprite.y > ZONE_CHECK_TOP) {
      console.log('... MEH ...')
      continue
    }

    console.log('Unaccounded for situation', sI)
    console.log(sY)
    console.log(ZONE_CHECK_TOP)
    console.log(ZONE_CHECK_BOTTOM)
    console.log(ZONE_CHECK_MEH_TOP)
    console.log(ZONE_CHECK_MEH_BOTTOM)
    console.log(ZONE_CHECK_OK_TOP)
    console.log(ZONE_CHECK_OK_BOTTOM)
    console.log(ZONE_CHECK_GOOD_TOP)
    console.log(ZONE_CHECK_GOOD_BOTTOM)
    console.log(ZONE_CHECK_PERFECT_TOP)
    console.log(ZONE_CHECK_PERFECT_BOTTOM)
    // if (sprite.y < )
  }
}

const body = document.getElementById('body')
// const synthWrapper = document.getElementById('synth-wrapper')
// const synthHeader = document.getElementById('synth-header')
// const gameWrapper = document.getElementById('game-wrapper')

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
let bodyWidth = SCREEN_WIDTH

if ((SCREEN_WIDTH / SCREEN_HEIGHT > 12 / 16) || SCREEN_WIDTH > SCREEN_HEIGHT) {
  bodyWidth = SCREEN_HEIGHT * (12 / 16)
}

const convertPx = (n) => `${n}px`

function makeBeat(lane) {
  const containerEl = document.createElement('div')
  const visualEl = document.createElement('div')

  containerEl.classList.add('beat-container')
  containerEl.style.width = convertPx(Math.floor(board.offsetHeight / SECTION_SIZE))
  containerEl.style.height = containerEl.style.width
  containerEl.style.top = convertPx(Math.floor(board.offsetHeight / SECTION_SIZE) * (SECTION_SIZE - 2))

  visualEl.classList.add('beat-visual')
  containerEl.appendChild(visualEl)

  const beat = new BeatSprite(
    convertPx(Math.floor(board.offsetHeight / SECTION_SIZE) * (SECTION_SIZE - 2)),
    convertPx(Math.floor(board.offsetHeight / SECTION_SIZE)),
    containerEl,
    lane,
  )

  return beat
}

const renderRows = () => {
  for (let i = 0; i < COUNTS_PER_MEASURE; i += 1) {
    const el = document.createElement('div')

    el.style.position = 'absolute'
    el.style.width = '100%'
    el.style.height = convertPx(SECTION_HEIGHT)
    el.style.top = convertPx(SECTION_HEIGHT * i)
    el.style.backgroundColor = i % 2 === 0 ? 'rgba(255, 255, 255, .1)' : 'rgba(255, 255, 255, .05)'

    board.appendChild(el)
  }
}

function createDebugZones(zoneArr) {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue']

  zoneArr.forEach(([top, bottom], i) => {
    const el = document.createElement('div')

    el.style.position = 'absolute'
    el.style.width = '4px'
    el.style.backgroundColor = colors[i]
    el.style.top = convertPx(top)
    el.style.left = convertPx(50 + (4 * (i + 1)))
    el.style.height = convertPx(bottom - top)

    board.appendChild(el)
  })
}

const initGame = () => {
  board = document.getElementById('game-wrapper')
  zone = document.getElementById('zone')
  bassLane = document.getElementById('bass')
  kickLane = document.getElementById('kick')
  snareLane = document.getElementById('snare')
  hihatLane = document.getElementById('hihat')

  BOARD_HEIGHT = board.offsetHeight
  SECTION_HEIGHT = Math.floor(board.offsetHeight / SECTION_SIZE)
  ZONE_TOP = Math.floor(BOARD_HEIGHT / SECTION_SIZE) * (SECTION_SIZE - 2)
  MOVE_SPEED = SECTION_HEIGHT / (FPS * TIME_PER_TICK)

  ZONE_CHECK_TOP = ZONE_TOP - SECTION_HEIGHT
  ZONE_CHECK_BOTTOM = SECTION_HEIGHT * 15
  // ZONE_CHECK_MEH_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  // ZONE_CHECK_MEH_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_OK_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_OK_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_GOOD_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 2.5)))
  ZONE_CHECK_GOOD_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 2.5)))
  ZONE_CHECK_PERFECT_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 5)))
  ZONE_CHECK_PERFECT_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 5)))

  createDebugZones([
    [ZONE_CHECK_TOP, ZONE_CHECK_BOTTOM],
    // [ZONE_CHECK_MEH_TOP, ZONE_CHECK_MEH_BOTTOM],
    [ZONE_CHECK_OK_TOP, ZONE_CHECK_OK_BOTTOM],
    [ZONE_CHECK_GOOD_TOP, ZONE_CHECK_GOOD_BOTTOM],
    [ZONE_CHECK_PERFECT_TOP, ZONE_CHECK_PERFECT_BOTTOM],
  ])

  renderRows()

  board.style.height = convertPx(BOARD_HEIGHT)
  zone.style.height = convertPx(SECTION_HEIGHT)

  // Create the 'hit' zone one 'section' above the boattom of the board
  zone.style.top = convertPx(ZONE_TOP)

  // bassLane.style.top = convertPx(0 - SECTION_HEIGHT)
  // kickLane.style.top = convertPx(0 - SECTION_HEIGHT)
  // snareLane.style.top = convertPx(0 - SECTION_HEIGHT)
  // hihatLane.style.top = convertPx(0 - SECTION_HEIGHT)

  // lanes.style.top = convertPx(0 - SECTION_HEIGHT)

  // bassLane.appendChild(makeBeat())
  // spawnBeat(bassLane)
}

window.addEventListener('load', () => {
  console.log('-- window _ load -- ddd')

  window.addEventListener('keydown', handleKeyboardControl)

  body.style.width = `${bodyWidth}px`
  body.style.height = `${SCREEN_HEIGHT}px`

  initGame()

  // console.log('Creating new ticker')
  // ticker = new Ticker(ctx, onTick, onUpdate)
  // ticker.start()
})

/**
 * ******** CONTORLS ********
 */
D.addEventListener('click', (e) => {
  bass.trigger(ctx.currentTime)
})
F.addEventListener('click', (e) => {
  kick.trigger(ctx.currentTime)
})
J.addEventListener('click', (e) => {
  snare.trigger(ctx.currentTime)
})
K.addEventListener('click', (e) => {
  hihat.trigger(ctx.currentTime)
})

// Will be required for touch events on mobile:
// D.addEventListener('touchend', (e) => {
//   bass.trigger(ctx.currentTime)
// })
// F.addEventListener('touchend', (e) => {
//   kick.trigger(ctx.currentTime)
// })
// J.addEventListener('touchend', (e) => {
//   snare.trigger(ctx.currentTime)
// })
// K.addEventListener('touchend', (e) => {
//   hihat.trigger(ctx.currentTime)
// })

function handleKeyboardControl(e) {
  switch (event.code) {
    case 'KeyD':
      bass.trigger(ctx.currentTime)
      // zzfx(...[,0,75,,.05,.5,,,-0.1,,,,,,,,,,.05])
      // zzfx(...[,0,75,,,.5,,,-0.2,.2,,,,,,,,.9,.1])
      // zzfx(...[,0,75,,,.75,,,-0.1,,,,,,,,,.9,.1])
      // zzfx(...[,0,75,,,.45,,,-0.1,-0.2,,,,,,,,.9,.1])
      // zzfx(...[,0,75,,,.45,,,-0.1,-0.2,,,,,,,,.9,.1])
      // checkCollision(bassBeats)
      break
    case 'KeyF':
      kick.trigger(ctx.currentTime)
      // zzfx(...[,0,125,,.05,.25,,2.5,-0.1]) // KICK
      // zzfx(...[,0,110,,,.05,1,.8,-0.2,-0.4,,,,,,,,.5,.29])
      // zzfx(...[,0,115,,,.45,,,-0.1,-0.2,,,,,,,,.9,.1])
      // zzfx(...[,0,125,,,.5,,,-0.2,-0.1,,,,,,,,.5,.05])
      checkCollision(kickBeats)
      break
    case 'KeyJ':
      snare.trigger(ctx.currentTime)
      checkCollision(snareBeats)
      break
    case 'KeyK':
      hihat.trigger(ctx.currentTime)
      checkCollision(hihatBeats)
      break
    default:
      return
  }
}
