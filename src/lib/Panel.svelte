<script lang="ts">
  import { onMount } from "svelte";
  import PanelTopBar from "./PanelTopBar.svelte";
  import { MosaicNodes } from "./stores/MosaicPanel";
  // import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
  // import type { MarkUps } from "./type/commonType";
  // import { get } from "svelte/store";

  onMount(()=>{
    //renderRecursively 의 split target에 getElementeById는 돔 렌더링 후에 찾아져서
    //onMount 안에서 실행해야함.
    MosaicNodes.renderRecursively();
  })

  // beforeUpdate(() => {
  //   // 반응성있는 값이 바뀔때 실행됨 (화면 렌더링 전 -> onMount보다 먼저 실행됨)
  //   // 컴포넌트가 연결될때도 실행됨
  //   // 반응성을 가지는 데이터가 beforeUpdate, afterUpdate 훅 내부에 있으면 무한루프 (useEffect에서 setState 사용하는 것과 같은 맥락), 꼭 넣어야한다면 조건문을 넣어서 무한루프에 빠지지 않도록
  //   console.log("test before update");
  //   //console.log('h1 && h1.innerText');
  // });
  // afterUpdate(() => {
  //   // 반응성있는 값이 바뀔때 실행됨 (화면 렌더링 후 -> onMount 후에 실행됨)
  //   // 컴포넌트가 연결될때도 실행됨
  //   console.log("test after update");
  //   let marks: Array<MarkUps>;
  //   marks = get(MosaicNodes);
  //   console.log(marks);
  // });
  // onMount(() => {
  //   console.log("test onMount");
  //   MosaicNodes.renderRecursively();
  //   console.log(MosaicNodes);
  //   // 컴포넌트 html 렌더링 된 이후에 실행됨
  //   // 컴포넌트가 화면에 출력된 이후 사용하는 훅
  //   //h1 = document.querySelector('h1');
  //   //console.log("mounted", h1.innerText)

  //   // 반환함수를 넣으면 onDestory와 같은 기능 (onDestory가 먼저 실행되고 반환함수 실행됨)
  //   // onDestory와 return 함수 둘중 하나만 만들어라
  //   // 주의사항! onMount에서 비동기 함수 로직을 넣을 경우 async 함수의 리턴은 promise이므로 return 익명함수가 무시된다. 그래서 비동기 함수가 있는 경우에는 return 익명함수로 onDestory를 사용하지 말고 onDestory 훅을 이용해라
  //   return () => {
  //     console.log("test destory");
  //   };
  // });

  // onDestroy(() => {
  //   // 컴포넌트가 연결해지되기 직전에 실행됨, 해지 직전이니 h1이 출력됨
  //   //const h1 = document.querySelector('h1');
  //   //console.log("destory", h1.innerText)
  //   console.log("test destory real");
  // });
</script>

<!-- {@html slements}

{#each slements as {mark} (id)}

<!-- {#each slements as item}
  {@html item}
{/each} -->

{#each $MosaicNodes as markup}
  <div class="panel" style="inset:{markup.style}">
    <PanelTopBar />
    <div class="contents">Window {markup.name}</div>
  </div>
{/each}

<style>
  .panel {
    background: #fefefe;
    border: 1px solid #636363;
    margin: 3px;
    border-radius: 4px;
    position: absolute;
  }
</style>
