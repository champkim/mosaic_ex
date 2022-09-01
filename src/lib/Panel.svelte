<script lang="ts">
  import PanelTopBar from './PanelTopBar.svelte'
  import Split from './Split.svelte'
  import type { direction, mosaic, insetrect } from './type/commonType'
  export let node: mosaic
  export let insetrec: insetrect = { top: 0, left: 0, bottom: 0, right: 0 }
  export let direction: direction

  const BASIC_PERCENT = 50

  let insetStr: string = '0% 0% 0% 0%'
  insetStr = `${insetrec.top}% ${insetrec.right}% ${insetrec.bottom}% ${insetrec.left}% `

  console.log(
    node +
      ' [first] ' +
      typeof node.first +
      ' [second] ' +
      typeof node.second +
      ' [direction] ' +
      node.direction +
      ' [inset arg] ' +
      insetStr
  )

  let insetrec1: insetrect = { top: 0, left: 0, bottom: 0, right: 0 }
  let insetrec2: insetrect = { top: 0, left: 0, bottom: 0, right: 0 }

  if (typeof node === 'object') {
    insetrec1 = { ...insetrec }
    insetrec2 = { ...insetrec }
    if (node.direction === 'row') {
      //if (typeof node.first === 'string') {
      console.log('row')
      insetrec1.right = Math.floor((100 - insetrec.right) / 2)
      insetrec2.left = 100 - insetrec1.right
      //}
    } else {
      console.log('col')
      insetrec1.bottom = Math.floor((100 - insetrec1.bottom) / 2)
      insetrec2.top = 100 - insetrec1.bottom
    }
  }
</script>

{#if typeof node === 'string'}
  <div
    class="panel"
    style="inset:{`${insetrec.top}% ${insetrec.right}% ${insetrec.bottom}% ${insetrec.left}% `}"
  >
    <PanelTopBar />
    <div class="contents">Window {node}</div>
  </div>
{:else if typeof node === 'object'}
  <svelte:self
    node={node.first}
    direction={node.direction}
    insetrec={insetrec1}
  />
  {#if node.second}
    <Split direction={node.direction} insetrec={insetrec2} />
  {/if}
  <svelte:self
    node={node.second}
    direction={node.direction}
    insetrec={insetrec2}
  />
{/if}

<style>
  .panel {
    background: #fefefe;
    border: 1px solid #636363;
    margin: 3px;
    border-radius: 4px;
    position: absolute;
  }
</style>
