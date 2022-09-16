<script lang="ts">
  let array: number[] = [0, 1, 2, 3, 4, 5];
  let active = 0;

  const onClickButton = (number: number) => {
    active = number;
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
