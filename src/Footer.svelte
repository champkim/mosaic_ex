<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import { MosaicNodes } from "./lib/stores/MosaicPanel";
  import type { MosaicNode } from "./lib/type/commonType";

  const initNode: MosaicNode<number> = {
    direction: "row",
    first: 1,
    second: 2,
  };

  let array: number[] = [0, 1, 2, 3, 4, 5];
  let profileList: { contents: MosaicNode<number>; index: number }[] = [];
  let active = 0;

  const onClickButton = (number: number) => {
    if (active !== number) {
      active = number;
      MosaicNodes.setCurrentNode(profileList[number].contents);
    }
  };

  onMount(async () => {
    // await axios.delete("http://127.0.0.1:3000/pages")

    try {
      const response = await axios.get("http://192.168.0.6:3000/pages");
      profileList = new Array(6);
      profileList = profileList.fill({ contents: initNode, index: -1 });
      response.data.forEach(({ contents, index }) => {
        profileList[index] = { index, contents: JSON.parse(contents) };
      });

      MosaicNodes.setCurrentNode(profileList[0].contents);
    } catch (error) {
      console.log(error);
    }
  });

  const onUpdateProfile = async () => {
    if (active === 0) {
      alert("default는 수정할 수 없습니다.");
      return;
    }
    if (confirm("저장하시겠습니까?")) {
      const data = [
        {
          index: active,
          contents: JSON.stringify(MosaicNodes.getCurrentNode()),
        },
      ];
      const apiMethod = profileList[active].index === -1 ? "post" : "put";
      try {
        const options = {
          url: "http://192.168.0.6:3000/pages",
          method: apiMethod,
          data,
        };
        const response = await axios(options);
        profileList[active].contents = MosaicNodes.getCurrentNode();
      } catch (error) {}
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
