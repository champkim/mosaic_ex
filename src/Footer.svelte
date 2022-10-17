<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import { MosaicPanels, Mosaic } from "./lib/MosaicPanels";
  import type { MosaicNode } from "./lib/type/commonType";

  //const pagesurl = "http://127.0.0.1:3000/pages";
  //const pagesurl = "http://192.168.0.6:2001/pages";

  const initNode: MosaicNode<number> = {
    direction: "row",
    first: 1,
    second: 2,
  };
  // const initNode: MosaicNode<number> = null;

  let array: number[] = [0, 1, 2, 3, 4, 5];
  let profileList: { contents: MosaicNode<number>; index: number }[];
  profileList = new Array(6);
  profileList = profileList.fill({ contents: initNode, index: -1 });
  let active = 0;
  //let beURL = "http://ontune.iptime.org:2001/pages"

  const onClickButton = (number: number) => {
    if (active !== number) {
      active = number;
      getPageDataById(number);
    }
  };

  const getPageDataById = async (id) => {
    try {
      const {
        data: { index, contents },
      } = await axios.get(`${import.meta.env.VITE_API_URL}/pages/${id}`);
      const parseContents = JSON.parse(contents);
      profileList[index] = { index, contents: parseContents };
      MosaicPanels.setCurrentNode(parseContents);
    } catch (error) {
      MosaicPanels.setCurrentNode(initNode);
      console.log(error);
    }
  };

  onMount(async () => await getPageDataById(0));

  const onUpdateProfile = async () => {
    if (active === 0) {
      alert("default는 수정할 수 없습니다.");
      return;
    }
    if (confirm("저장하시겠습니까?")) {
      const data = [
        {
          index: active,
          contents: JSON.stringify(Mosaic.getCurrentNode()),
        },
      ];

      const apiMethod = profileList[active].index === -1 ? "post" : "put";
      console.log("METHOD" + apiMethod);
      try {
        const options = {
          // <<<<<<< HEAD
          //           url: beURL,
          // =======
          url: `${import.meta.env.VITE_API_URL}/pages`,
          // >>>>>>> abb14fb78f00f7c59a31abadc706eb3774abbd52
          method: apiMethod,
          data,
        };
        const response = await axios(options);
      } catch (error) {
        console.log("에러" + error);
      }
    }
  };
</script>

<div class="profile-button">
  {#each array as name}
    <button
      on:click={() => onClickButton(name)}
      on:dblclick={onUpdateProfile}
      class={`button-num ${active === name ? "active" : ""}`}
      >{name === 0 ? "Default" : name}</button
    >
  {/each}
</div>

<style>
  .profile-button {
    height: 30px;
    position: absolute;
    right: 10px;
    padding-top: 8px;
  }
  .button-num {
    font-size: 16px;
    background-color: #fff;
    border: 1px solid rgb(100, 127, 185);
    border-left: 0;
    border-radius: 0;
    widows: 10px;
    color: black;
    min-width: 40px;
  }
  .button-num.active {
    background: rgb(100, 127, 185);
    color: #fff;
  }
  .button-num:first-child {
    border-left: 1px solid rgb(100, 127, 185);
  }
</style>
