<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import { MosaicNodes } from "./lib/stores/MosaicPanel";

  let array: number[] = [0, 1, 2, 3, 4, 5];
  let active = 0;

  let initNode = {
    direction: "row",
    first: 1,
    //second: 'b'
    second: {
      direction: "column",
      first: 2,
      second: {
        direction: "column",
        first: 3,
        second: 5,
      },
    },
  };

  const onClickButton = (number: number) => {
    active = number;
    MosaicNodes.setCurrentNode(initNode);
  };

  onMount(async () => {
    try {
      const response = await axios.get("/pages");
    } catch (error) {
      console.log(error);
    }
  });

  const onUpdateProfile = async () => {
    try {
      const response = await axios.put("/pages");
    } catch (error) {}
  };
</script>

<div class="profile-button">
  {#each array as name}
    <button
      on:click={() => onClickButton(name)}
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
